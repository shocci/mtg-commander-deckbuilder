import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();

const RULES_PAGE_URL = "https://magic.wizards.com/en/rules";
const COMMANDER_PAGE_URL = "https://magic.wizards.com/en/formats/commander";
const BANLIST_PAGE_URL = "https://magic.wizards.com/en/banned-restricted-list";

const RULES_DIR = path.join(ROOT_DIR, "imports", "wizards", "rules");
const COMMANDER_IMPORT_DIR = path.join(ROOT_DIR, "imports", "wizards", "commander");
const COMMANDER_REFERENCE_DIR = path.join(ROOT_DIR, "data", "reference", "commander");

const RULES_FILE = path.join(RULES_DIR, "comprehensive-rules.txt");
const RULES_METADATA_FILE = path.join(RULES_DIR, "metadata.json");

const COMMANDER_PAGE_FILE = path.join(COMMANDER_IMPORT_DIR, "commander-page.html");
const BANLIST_PAGE_FILE = path.join(COMMANDER_IMPORT_DIR, "banned-restricted-page.html");

const GAME_CHANGERS_FILE = path.join(COMMANDER_REFERENCE_DIR, "game-changers.json");
const GAME_CHANGERS_METADATA_FILE = path.join(
    COMMANDER_REFERENCE_DIR,
    "game-changers.metadata.json",
);

const BANLIST_FILE = path.join(COMMANDER_REFERENCE_DIR, "banned.json");
const BANLIST_METADATA_FILE = path.join(
    COMMANDER_REFERENCE_DIR,
    "banned.metadata.json",
);

const REQUEST_HEADERS = {
    "User-Agent": "mtg-commander-deckbuilder/1.0",
    Accept: "text/html,text/plain;q=0.9,*/*;q=0.8",
};

type RulesMetadata = {
    sourcePage: string;
    resolvedSource: string;
    effectiveDate: string;
    fetchedAt: string;
    sha256: string;
};

type GameChangersData = {
    cards: string[];
};

type GameChangersMetadata = {
    sourcePage: string;
    fetchedAt: string;
    count: number;
    sha256: string;
};

type CategoryBan = {
    id: string;
    description: string;
};

type CommanderBanlistData = {
    banned: string[];
    bannedAsCompanion: string[];
    categoryBans: CategoryBan[];
};

type BanlistMetadata = {
    sourcePage: string;
    fetchedAt: string;
    bannedCount: number;
    bannedAsCompanionCount: number;
    categoryBanCount: number;
    sha256: string;
};

function sha256(content: string): string {
    return createHash("sha256").update(content, "utf8").digest("hex");
}

async function fetchText(
    url: string,
    accept = REQUEST_HEADERS.Accept,
): Promise<string> {
    const response = await fetch(url, {
        headers: {
            ...REQUEST_HEADERS,
            Accept: accept,
        },
        redirect: "follow",
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} beim Abruf von ${url}`);
    }

    return await response.text();
}

async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
    try {
        const raw = await readFile(filePath, "utf8");
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function decodeHtmlEntities(value: string): string {
    return value
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
            String.fromCodePoint(Number.parseInt(hex, 16)),
        )
        .replace(/&#(\d+);/g, (_, dec: string) =>
            String.fromCodePoint(Number.parseInt(dec, 10)),
        );
}

function decodeJavaScriptEscapes(value: string): string {
    return value
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
            String.fromCharCode(Number.parseInt(hex, 16)),
        )
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
}

function stripHtml(value: string): string {
    return decodeHtmlEntities(
        value
            .replace(/<br\s*\/?>/gi, " ")
            .replace(/<[^>]+>/g, " "),
    )
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeCardList(cards: string[]): string[] {
    return [...new Set(cards.map((card) => card.trim()).filter(Boolean))];
}

function compareCardLists(
    previous: string[],
    current: string[],
): { added: string[]; removed: string[] } {
    const previousSet = new Set(previous);
    const currentSet = new Set(current);

    return {
        added: current.filter((card) => !previousSet.has(card)),
        removed: previous.filter((card) => !currentSet.has(card)),
    };
}

function validateRelativeCount(
    label: string,
    previousCount: number,
    currentCount: number,
): void {
    if (previousCount < 10) {
        return;
    }

    const lowerBound = Math.floor(previousCount * 0.5);
    const upperBound = Math.ceil(previousCount * 2);

    if (currentCount < lowerBound || currentCount > upperBound) {
        throw new Error(
            `${label}: Anzahl änderte sich unplausibel von ${previousCount} auf ${currentCount}.`,
        );
    }
}

function printListChanges(
    label: string,
    previous: string[],
    current: string[],
): void {
    const { added, removed } = compareCardLists(previous, current);

    if (added.length === 0 && removed.length === 0) {
        console.log(`  ${label}: keine Änderungen`);
        return;
    }

    console.log(`  ${label}:`);

    for (const card of added) {
        console.log(`  + ${card}`);
    }

    for (const card of removed) {
        console.log(`  - ${card}`);
    }
}

function findComprehensiveRulesTxtUrl(html: string): string {
    const hrefMatches = [
        ...html.matchAll(/href\s*=\s*["']([^"']+\.txt(?:\?[^"']*)?)["']/gi),
    ];

    const candidates = hrefMatches
        .map((match) => match[1])
        .filter((value): value is string => Boolean(value))
        .map(decodeHtmlEntities)
        .map((href) => {
            try {
                return new URL(href, RULES_PAGE_URL).toString();
            } catch {
                return null;
            }
        })
        .filter((url): url is string => Boolean(url));

    const comprehensiveRulesUrl = candidates.find((url) => /MagicCompRules/i.test(url));

    if (comprehensiveRulesUrl) {
        return comprehensiveRulesUrl;
    }

    const mediaWizardsUrl = candidates.find((url) => url.includes("media.wizards.com"));

    if (mediaWizardsUrl) {
        return mediaWizardsUrl;
    }

    if (candidates[0]) {
        return candidates[0];
    }

    throw new Error(
        "Auf der Wizards-Regelseite wurde kein Comprehensive-Rules-TXT-Link gefunden.",
    );
}

function validateRulesText(content: string): void {
    const minimumLength = 100_000;

    if (content.length < minimumLength) {
        throw new Error(`Rules-Datei ist unerwartet klein (${content.length} Zeichen).`);
    }

    const requiredMarkers = [
        "Magic: The Gathering Comprehensive Rules",
        "These rules are effective as of",
        "903. Commander",
        "Glossary",
    ];

    for (const marker of requiredMarkers) {
        if (!content.includes(marker)) {
            throw new Error(
                `Rules-Datei konnte nicht validiert werden. Marker fehlt: "${marker}"`,
            );
        }
    }
}

function extractEffectiveDate(content: string): string {
    const match = content.match(
        /These rules are effective as of ([A-Za-z]+) (\d{1,2}), (\d{4})\./,
    );

    if (!match?.[1] || !match[2] || !match[3]) {
        throw new Error(
            "Effective Date konnte aus den Comprehensive Rules nicht erkannt werden.",
        );
    }

    const monthNames: Record<string, number> = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
    };

    const month = monthNames[match[1].toLowerCase()];

    if (!month) {
        throw new Error(`Unbekannter Monatsname im Effective Date: ${match[1]}`);
    }

    return [
        match[3],
        String(month).padStart(2, "0"),
        String(Number(match[2])).padStart(2, "0"),
    ].join("-");
}

async function updateComprehensiveRules(): Promise<void> {
    console.log("");
    console.log("Magic Comprehensive Rules");
    console.log("-------------------------");
    console.log("→ Wizards Rules-Seite abrufen");

    const rulesPageHtml = await fetchText(RULES_PAGE_URL);
    console.log("✓ Rules-Seite geladen");

    const txtUrl = findComprehensiveRulesTxtUrl(rulesPageHtml);
    console.log(`→ TXT gefunden: ${txtUrl}`);

    const rulesText = await fetchText(txtUrl, "text/plain,*/*;q=0.8");
    console.log("→ Rules validieren");

    validateRulesText(rulesText);

    const effectiveDate = extractEffectiveDate(rulesText);
    const hash = sha256(rulesText);

    const metadata: RulesMetadata = {
        sourcePage: RULES_PAGE_URL,
        resolvedSource: txtUrl,
        effectiveDate,
        fetchedAt: new Date().toISOString(),
        sha256: hash,
    };

    await mkdir(RULES_DIR, { recursive: true });

    // Erst nach erfolgreichem Download + Validierung schreiben.
    await writeFile(RULES_FILE, rulesText, "utf8");
    await writeJson(RULES_METADATA_FILE, metadata);

    console.log("✓ Comprehensive Rules aktualisiert");
    console.log(`  Effective Date: ${effectiveDate}`);
    console.log(`  SHA-256: ${hash}`);
}

function extractGameChangerSection(html: string): string {
    const startMarkers = [
        'identifier:"gamechangers"',
        'entryTitle:"Formats | Commander Refresh | Game Changers Info"',
    ];

    let start = -1;

    for (const marker of startMarkers) {
        start = html.indexOf(marker);
        if (start !== -1) {
            break;
        }
    }

    if (start === -1) {
        throw new Error("Eingebetteter Game-Changers-Datenblock wurde nicht gefunden.");
    }

    const endMarkers = [
        'entryTitle:"Commander Decklists Articles"',
        '"ArticleCollection:0"',
    ];

    let end = -1;

    for (const marker of endMarkers) {
        const candidate = html.indexOf(marker, start);

        if (candidate !== -1 && (end === -1 || candidate < end)) {
            end = candidate;
        }
    }

    if (end === -1) {
        throw new Error("Ende des Game-Changers-Datenblocks wurde nicht erkannt.");
    }

    return html.slice(start, end);
}

function extractGameChangers(html: string): string[] {
    const section = extractGameChangerSection(html);

    const requiredGroups = [
        "White",
        "Blue",
        "Black",
        "Red",
        "Green",
        "Multicolor",
        "Colorless",
    ];

    for (const group of requiredGroups) {
        if (!section.includes(`topic:"${group}"`)) {
            throw new Error(`Game-Changer-Gruppe fehlt: ${group}`);
        }
    }

    const cardPattern =
        /\\u003Cauto-card\\u003E(.*?)\\u003C\\u002Fauto-card\\u003E/g;

    const cards = [...section.matchAll(cardPattern)]
        .map((match) => match[1])
        .filter((value): value is string => Boolean(value))
        .map(decodeJavaScriptEscapes)
        .map((name) => name.trim())
        .filter(Boolean);

    return normalizeCardList(cards);
}

function validateGameChangers(cards: string[]): void {
    if (cards.length < 30) {
        throw new Error(
            `Nur ${cards.length} Game Changer erkannt. Das Ergebnis wirkt unvollständig.`,
        );
    }

    if (cards.length > 150) {
        throw new Error(`Unerwartet viele Game Changer erkannt: ${cards.length}.`);
    }

    for (const card of cards) {
        if (card.length < 2 || card.length > 200) {
            throw new Error(`Unplausibler Kartenname in Game-Changer-Liste: "${card}"`);
        }
    }
}

async function readExistingGameChangers(): Promise<string[]> {
    const parsed = await readJsonIfExists<unknown>(GAME_CHANGERS_FILE);

    if (Array.isArray(parsed)) {
        return parsed.filter((value): value is string => typeof value === "string");
    }

    if (
        parsed &&
        typeof parsed === "object" &&
        "cards" in parsed &&
        Array.isArray((parsed as { cards?: unknown }).cards)
    ) {
        return (parsed as { cards: unknown[] }).cards.filter(
            (value): value is string => typeof value === "string",
        );
    }

    return [];
}

async function updateGameChangers(): Promise<void> {
    console.log("");
    console.log("Commander Game Changers");
    console.log("-----------------------");
    console.log("→ Wizards Commander-Seite abrufen");

    const commanderHtml = await fetchText(COMMANDER_PAGE_URL);

    if (commanderHtml.length < 10_000) {
        throw new Error(
            `Commander-Seite ist unerwartet klein (${commanderHtml.length} Zeichen).`,
        );
    }

    if (
        !commanderHtml.includes('identifier:"gamechangers"') &&
        !/GAME CHANGERS/i.test(commanderHtml)
    ) {
        throw new Error("Commander-Seite enthält keinen erkennbaren Game-Changers-Bereich.");
    }

    await mkdir(COMMANDER_IMPORT_DIR, { recursive: true });
    await writeFile(COMMANDER_PAGE_FILE, commanderHtml, "utf8");

    console.log("✓ Commander-Rohseite gespeichert");
    console.log(`  ${path.relative(ROOT_DIR, COMMANDER_PAGE_FILE)}`);
    console.log("→ Game Changers extrahieren");

    const cards = extractGameChangers(commanderHtml);
    validateGameChangers(cards);

    const previousCards = await readExistingGameChangers();
    validateRelativeCount("Game Changers", previousCards.length, cards.length);

    console.log(`✓ ${cards.length} Game Changer erkannt`);

    if (previousCards.length === 0) {
        console.log("  Noch keine lokale Game-Changer-Liste vorhanden");
    } else {
        printListChanges("Änderungen", previousCards, cards);
    }

    const data: GameChangersData = { cards };
    const dataJson = `${JSON.stringify(data, null, 2)}\n`;
    const listHash = sha256(dataJson);

    const metadata: GameChangersMetadata = {
        sourcePage: COMMANDER_PAGE_URL,
        fetchedAt: new Date().toISOString(),
        count: cards.length,
        sha256: listHash,
    };

    await mkdir(COMMANDER_REFERENCE_DIR, { recursive: true });

    // Erst nach erfolgreichem Parsing + Validierung schreiben.
    await writeFile(GAME_CHANGERS_FILE, dataJson, "utf8");
    await writeJson(GAME_CHANGERS_METADATA_FILE, metadata);

    console.log("✓ Game-Changer-Referenz aktualisiert");
    console.log(`  Anzahl: ${cards.length}`);
    console.log(`  SHA-256: ${listHash}`);
}

function findHeadingSection(html: string, headingText: string): string {
    const headingPattern = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;

    for (const match of html.matchAll(headingPattern)) {
        const fullHeading = match[0];
        const innerHeading = match[2] ?? "";
        const normalizedHeading = stripHtml(innerHeading).toLowerCase();

        if (normalizedHeading !== headingText.toLowerCase()) {
            continue;
        }

        if (match.index === undefined) {
            break;
        }

        const start = match.index + fullHeading.length;
        const remaining = html.slice(start);
        const nextHeading = /<h[1-6][^>]*>/i.exec(remaining);
        const end = nextHeading?.index ?? remaining.length;

        return remaining.slice(0, end);
    }

    throw new Error(`Abschnitt "${headingText}" wurde nicht gefunden.`);
}

function categoryIdFromDescription(description: string): string {
    const normalized = description.toLowerCase();

    if (normalized.includes("conspiracy")) {
        return "conspiracy";
    }

    if (normalized.includes("playing for ante") || normalized.includes(" ante")) {
        return "ante";
    }

    if (
        normalized.includes("racially") ||
        normalized.includes("culturally offensive") ||
        normalized.includes("offensive")
    ) {
        return "offensive";
    }

    return normalized
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
}

function cleanCategoryDescription(value: string): string {
    return value
        .replace(/\s+Click here(?: for (?:the )?list| for more details)?\.?$/i, "")
        .trim();
}

function extractCommanderBanlist(html: string): CommanderBanlistData {
    const section = findHeadingSection(html, "Commander Banned Cards");

    const listItems = [...section.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((match) => match[1])
        .filter((value): value is string => Boolean(value))
        .map(stripHtml)
        .filter(Boolean);

    if (listItems.length === 0) {
        throw new Error("Keine Einträge in der Commander-Banlist erkannt.");
    }

    const banned: string[] = [];
    const bannedAsCompanion: string[] = [];
    const categoryBans: CategoryBan[] = [];

    for (const item of listItems) {
        const normalized = item.toLowerCase();

        if (
            normalized.includes("card type") ||
            normalized.includes("playing for ante") ||
            normalized.includes("racially") ||
            normalized.includes("culturally offensive")
        ) {
            const description = cleanCategoryDescription(item);

            categoryBans.push({
                id: categoryIdFromDescription(description),
                description,
            });
            continue;
        }

        const companionMatch = item.match(
            /^(.+?)\s*[-–—]\s*only banned as a companion\b/i,
        );

        if (companionMatch?.[1]) {
            bannedAsCompanion.push(companionMatch[1].trim());
            continue;
        }

        banned.push(item);
    }

    const deduplicatedCategories = categoryBans.filter(
        (category, index, all) =>
            all.findIndex((candidate) => candidate.id === category.id) === index,
    );

    return {
        banned: normalizeCardList(banned),
        bannedAsCompanion: normalizeCardList(bannedAsCompanion),
        categoryBans: deduplicatedCategories,
    };
}

function validateCommanderBanlist(data: CommanderBanlistData): void {
    if (data.banned.length < 25) {
        throw new Error(
            `Nur ${data.banned.length} normale Commander-Bans erkannt. Das Ergebnis wirkt unvollständig.`,
        );
    }

    if (data.banned.length > 150) {
        throw new Error(`Unerwartet viele Commander-Bans erkannt: ${data.banned.length}.`);
    }

    if (data.categoryBans.length < 2 || data.categoryBans.length > 10) {
        throw new Error(
            `Unplausible Anzahl Commander-Kategorie-Bans: ${data.categoryBans.length}.`,
        );
    }

    if (data.bannedAsCompanion.length > 20) {
        throw new Error(
            `Unplausible Anzahl Companion-Sonderbans: ${data.bannedAsCompanion.length}.`,
        );
    }

    const allCards = [...data.banned, ...data.bannedAsCompanion];

    if (new Set(allCards).size !== allCards.length) {
        throw new Error("Eine Karte taucht in mehreren Ban-Kategorien gleichzeitig auf.");
    }

    for (const card of allCards) {
        if (card.length < 2 || card.length > 200) {
            throw new Error(`Unplausibler Kartenname in Commander-Banlist: "${card}"`);
        }
    }
}

async function readExistingBanlist(): Promise<CommanderBanlistData | null> {
    const parsed = await readJsonIfExists<CommanderBanlistData>(BANLIST_FILE);

    if (!parsed) {
        return null;
    }

    if (
        !Array.isArray(parsed.banned) ||
        !Array.isArray(parsed.bannedAsCompanion) ||
        !Array.isArray(parsed.categoryBans)
    ) {
        return null;
    }

    return parsed;
}

async function updateCommanderBanlist(): Promise<void> {
    console.log("");
    console.log("Commander Banlist");
    console.log("-----------------");
    console.log("→ Wizards Banned-&-Restricted-Seite abrufen");

    const html = await fetchText(BANLIST_PAGE_URL);

    if (html.length < 20_000) {
        throw new Error(
            `Banned-&-Restricted-Seite ist unerwartet klein (${html.length} Zeichen).`,
        );
    }

    await mkdir(COMMANDER_IMPORT_DIR, { recursive: true });
    await writeFile(BANLIST_PAGE_FILE, html, "utf8");

    console.log("✓ Banlist-Rohseite gespeichert");
    console.log(`  ${path.relative(ROOT_DIR, BANLIST_PAGE_FILE)}`);
    console.log("→ Commander-Banlist extrahieren");

    const data = extractCommanderBanlist(html);
    validateCommanderBanlist(data);

    const previous = await readExistingBanlist();

    if (previous) {
        validateRelativeCount("Commander Banlist", previous.banned.length, data.banned.length);
    }

    console.log(`✓ ${data.banned.length} normale Bans erkannt`);
    console.log(`✓ ${data.bannedAsCompanion.length} Companion-Sonderregeln erkannt`);
    console.log(`✓ ${data.categoryBans.length} Kategorie-Bans erkannt`);

    if (previous) {
        printListChanges("Normale Bans", previous.banned, data.banned);
        printListChanges(
            "Banned as Companion",
            previous.bannedAsCompanion,
            data.bannedAsCompanion,
        );
    } else {
        console.log("  Noch keine lokale Banlist vorhanden");
    }

    const dataJson = `${JSON.stringify(data, null, 2)}\n`;
    const hash = sha256(dataJson);

    const metadata: BanlistMetadata = {
        sourcePage: BANLIST_PAGE_URL,
        fetchedAt: new Date().toISOString(),
        bannedCount: data.banned.length,
        bannedAsCompanionCount: data.bannedAsCompanion.length,
        categoryBanCount: data.categoryBans.length,
        sha256: hash,
    };

    await mkdir(COMMANDER_REFERENCE_DIR, { recursive: true });

    // Erst nach erfolgreichem Parsing + Validierung schreiben.
    await writeFile(BANLIST_FILE, dataJson, "utf8");
    await writeJson(BANLIST_METADATA_FILE, metadata);

    console.log("✓ Commander-Banlist aktualisiert");
    console.log(`  Normale Bans: ${data.banned.length}`);
    console.log(`  Banned as Companion: ${data.bannedAsCompanion.length}`);
    console.log(`  Kategorie-Bans: ${data.categoryBans.length}`);
    console.log(`  SHA-256: ${hash}`);
}

async function main(): Promise<void> {
    console.log("");
    console.log("MTG Reference Update");
    console.log("====================");

    let failed = false;

    try {
        await updateComprehensiveRules();
    } catch (error) {
        failed = true;
        console.error("");
        console.error("✗ Comprehensive Rules Update fehlgeschlagen");
        console.error(error instanceof Error ? error.message : error);
        console.error("  Bestehende validierte Rules wurden nicht überschrieben.");
    }

    try {
        await updateGameChangers();
    } catch (error) {
        failed = true;
        console.error("");
        console.error("✗ Game-Changer Update fehlgeschlagen");
        console.error(error instanceof Error ? error.message : error);
        console.error("  Bestehende validierte Game-Changer-Daten wurden nicht überschrieben.");
    }

    try {
        await updateCommanderBanlist();
    } catch (error) {
        failed = true;
        console.error("");
        console.error("✗ Commander-Banlist Update fehlgeschlagen");
        console.error(error instanceof Error ? error.message : error);
        console.error("  Bestehende validierte Banlist wurde nicht überschrieben.");
    }

    console.log("");

    if (failed) {
        console.error("Update mit Fehlern beendet.");
        process.exitCode = 1;
        return;
    }

    console.log("✓ Reference Update abgeschlossen");
}

main().catch((error: unknown) => {
    console.error("");
    console.error("Unerwarteter Fehler:");
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exitCode = 1;
});
