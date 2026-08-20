import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { parseManaBoxDecklist } from "./lib/decklist-parser.js";

const ROOT_DIR = process.cwd();

const DECKLISTS_DIR = path.join(ROOT_DIR, "data", "decks", "decklists");
const SAVED_DIR = path.join(ROOT_DIR, "data", "decks", "saved");
const COLLECTION_PATH = path.join(ROOT_DIR, "data", "collection.json");

const DOCS_DIR = path.join(ROOT_DIR, "docs");
const DOCS_DECKS_DIR = path.join(DOCS_DIR, "decks");

const SCRYFALL_HEADERS = {
    "User-Agent": "mtg-commander-deckbuilder/1.0",
    "Accept": "application/json",
};

const DECK_VIEW_CATEGORY_ORDER = [
    "Commander",
    "Creatures",
    "Artifacts",
    "Instants",
    "Sorceries",
    "Enchantments",
    "Lands",
    "Other",
] as const;

type DeckViewCategory = typeof DECK_VIEW_CATEGORY_ORDER[number];

type DeckVariant = {
    slug: string;
    title: string;
    content: string;
};

type DeckVersion = {
    slug: string;
    title: string;
    content: string;
};

type CollectionCard = {
    name?: string;
    scryfallId?: string;
    scryfall_id?: string;
    "Scryfall ID"?: string;
};

type CommanderImage = {
    url: string;
    owned: boolean;
};

type CommanderDoc = {
    name: string;
    image: CommanderImage | null;
};

type DeckViewCard = {
    name: string;
    quantity: number;
    manaValue?: number | null;
    ownedQuantity: number;
    missingQuantity: number;
    availability: "collection" | "basic-land" | "partial" | "missing";
    scryfallId: string | null;
    scryfallUri: string | null;
    imageUri: string | null;
    backImageUri: string | null;
    priceEur: number | null;
    missingTotalEur: number | null;
    printing?: {
        setCode: string;
        collectorNumber: string;
        foil: boolean;
        flavorName?: string | null;
    } | null;
};

type DeckView = {
    deckSlug: string;
    sourceDecklist: string;
    generatedAt?: string;
    cards: Partial<Record<DeckViewCategory, DeckViewCard[]>>;
};

type DeckDoc = {
    slug: string;
    title: string;
    commanders: CommanderDoc[];
    decklist: string | null;
    deckView: DeckView | null;
    shoppingList: string | null;
    analysis: string | null;
    bracket: string | null;
    gameplan: string | null;
    ruleZero: string | null;
    variants: DeckVariant[];
    versions: DeckVersion[];
};

type MainSectionContentType = "subsections" | "markdown" | "html";

async function pathExists(filePath: string): Promise<boolean> {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function readIfExists(filePath: string): Promise<string | null> {
    try {
        return await readFile(filePath, "utf8");
    } catch {
        return null;
    }
}

async function readDeckView(savedDeckDir: string): Promise<DeckView | null> {
    const raw = await readIfExists(path.join(savedDeckDir, "deck-view.json"));

    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw) as DeckView;

        if (
            !parsed ||
            typeof parsed !== "object" ||
            !parsed.cards ||
            typeof parsed.cards !== "object"
        ) {
            return null;
        }

        return parsed;
    } catch (error) {
        console.warn(
            `deck-view.json konnte nicht gelesen werden: ${savedDeckDir}`,
            error,
        );
        return null;
    }
}

function titleFromSlug(slug: string): string {
    return slug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderMarkdown(content: string): string {
    const html = marked.parse(content, {
        async: false,
    }) as string;

    return html
        .replace(/\s+align="left"/g, ' class="text-left"')
        .replace(/\s+align="center"/g, ' class="text-center"')
        .replace(/\s+align="right"/g, ' class="text-right"');
}

function normalizeCardName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[’']/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function extractBracketNumber(bracket: string | null): number | null {
    if (!bracket) return null;

    const lines = bracket.split(/\r?\n/);

    for (const line of lines) {
        const plainLine = line
            .replace(/[*_`]/g, "")
            .trim();

        const match = plainLine.match(
            /^Geschätztes\s+Bracket\s*:\s*([1-5])\b/i,
        );

        if (match?.[1]) {
            return Number(match[1]);
        }
    }

    return null;
}

function formatVersionNumber(version: number): string {
    return `v${String(version).padStart(3, "0")}`;
}

function getCurrentVersion(deck: DeckDoc): string {
    return formatVersionNumber(deck.versions.length + 1);
}

function stripFirstHeading(content: string): string {
    return content.replace(/^#\s+.+(?:\r?\n)+/, "").trim();
}

function renderMarkdownSubsections(content: string): string {
    const cleaned = stripFirstHeading(content);
    const lines = cleaned.split(/\r?\n/);

    const introLines: string[] = [];
    const sections: Array<{
        title: string;
        content: string[];
    }> = [];

    let currentSection: {
        title: string;
        content: string[];
    } | null = null;

    for (const line of lines) {
        const headingMatch = line.match(/^##\s+(.+)$/);

        if (headingMatch?.[1]) {
            if (currentSection) {
                sections.push(currentSection);
            }

            currentSection = {
                title: headingMatch[1].trim(),
                content: [],
            };

            continue;
        }

        if (currentSection) {
            currentSection.content.push(line);
        } else {
            introLines.push(line);
        }
    }

    if (currentSection) {
        sections.push(currentSection);
    }

    const intro = introLines.join("\n").trim();

    const introHtml = intro
        ? `<div class="section-intro">
${renderMarkdown(intro)}
</div>`
        : "";

    const sectionsHtml = sections
        .map((section) => {
            return `<details class="sub-accordion">
<summary>${escapeHtml(section.title)}</summary>
<div class="sub-accordion-content">
${renderMarkdown(section.content.join("\n").trim())}
</div>
</details>`;
        })
        .join("\n");

    return `${introHtml}${sectionsHtml}`;
}

async function loadCollection(): Promise<CollectionCard[]> {
    try {
        const raw = await readFile(COLLECTION_PATH, "utf8");
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
            return parsed as CollectionCard[];
        }

        if (Array.isArray(parsed.cards)) {
            return parsed.cards as CollectionCard[];
        }

        return [];
    } catch {
        return [];
    }
}

function getScryfallImageUrl(scryfallId: string): string | null {
    const cleanId = scryfallId.trim();

    if (cleanId.length < 2) {
        return null;
    }

    return `https://cards.scryfall.io/normal/front/${cleanId[0]}/${cleanId[1]}/${cleanId}.jpg`;
}

function getImageUrlFromScryfallCard(card: unknown): string | null {
    const maybeCard = card as {
        image_uris?: {
            normal?: string;
        };
        card_faces?: Array<{
            image_uris?: {
                normal?: string;
            };
        }>;
    };

    if (maybeCard.image_uris?.normal) {
        return maybeCard.image_uris.normal;
    }

    if (Array.isArray(maybeCard.card_faces)) {
        for (const face of maybeCard.card_faces) {
            if (face.image_uris?.normal) {
                return face.image_uris.normal;
            }
        }
    }

    return null;
}

function findCommanderImageInCollection(
    commander: string | null,
    collection: CollectionCard[],
): CommanderImage | null {
    if (!commander) return null;

    const commanderNames = commander
        .split("//")
        .map((part) => normalizeCardName(part));

    const match = collection.find((card) => {
        if (!card.name) return false;

        const cardName = normalizeCardName(card.name);

        return commanderNames.some((commanderName) => {
            return (
                cardName === commanderName ||
                cardName.includes(commanderName) ||
                commanderName.includes(cardName)
            );
        });
    });

    if (!match) return null;

    const scryfallId =
        match.scryfallId ?? match.scryfall_id ?? match["Scryfall ID"];

    if (!scryfallId) return null;

    const imageUrl = getScryfallImageUrl(scryfallId);

    if (!imageUrl) return null;

    return {
        url: imageUrl,
        owned: true,
    };
}

function buildScryfallNamedUrl(mode: "exact" | "fuzzy", name: string): string {
    const params = new URLSearchParams({
        [mode]: name,
    });

    return `https://api.scryfall.com/cards/named?${params.toString()}`;
}

async function findCommanderImageFromScryfall(
    commander: string | null,
): Promise<CommanderImage | null> {
    if (!commander) return null;

    const commanderNames = commander
        .split("//")
        .map((part) => part.trim())
        .filter(Boolean);

    if (commanderNames.length === 0) return null;

    const queries = [
        buildScryfallNamedUrl("exact", commander),
        ...commanderNames.map((name) => buildScryfallNamedUrl("exact", name)),
        ...commanderNames.map((name) => buildScryfallNamedUrl("fuzzy", name)),
    ];

    for (const url of queries) {
        try {
            const response = await fetch(url, {
                headers: SCRYFALL_HEADERS,
            });

            if (!response.ok) {
                console.warn("Scryfall lookup failed:", response.status, url);
                continue;
            }

            const card = await response.json();
            const imageUrl = getImageUrlFromScryfallCard(card);

            if (!imageUrl) continue;

            return {
                url: imageUrl,
                owned: false,
            };
        } catch (error) {
            console.warn("Scryfall lookup error:", url, error);
        }
    }

    return null;
}

async function findCommanderImage(
    commander: string | null,
    collection: CollectionCard[],
): Promise<CommanderImage | null> {
    const collectionImage = findCommanderImageInCollection(commander, collection);

    if (collectionImage) {
        return collectionImage;
    }

    return await findCommanderImageFromScryfall(commander);
}

function extractCommanders(decklist: string | null): string[] {
    return parseManaBoxDecklist(decklist).commanders;
}

async function readVariants(savedDeckDir: string): Promise<DeckVariant[]> {
    const variantsDir = path.join(savedDeckDir, "variants");

    try {
        const files = await readdir(variantsDir);

        const variantFiles = files
            .filter((file) => file.endsWith(".md"))
            .sort((a, b) => a.localeCompare(b));

        const variants: DeckVariant[] = [];

        for (const file of variantFiles) {
            const slug = file.replace(/\.md$/, "");
            const content = await readFile(path.join(variantsDir, file), "utf8");

            variants.push({
                slug,
                title: titleFromSlug(slug),
                content,
            });
        }

        return variants;
    } catch {
        return [];
    }
}

async function readVersions(savedDeckDir: string): Promise<DeckVersion[]> {
    const versionsDir = path.join(savedDeckDir, "versions");

    try {
        const files = await readdir(versionsDir);

        const versionFiles = files
            .filter((file) => file.endsWith(".md"))
            .sort((a, b) => a.localeCompare(b));

        const versions: DeckVersion[] = [];

        for (const file of versionFiles) {
            const slug = file.replace(/\.md$/, "");
            const content = await readFile(path.join(versionsDir, file), "utf8");

            versions.push({
                slug,
                title: slug.toUpperCase(),
                content,
            });
        }

        return versions;
    } catch {
        return [];
    }
}

async function getDeckSlugs(): Promise<string[]> {
    const slugs = new Set<string>();

    try {
        const decklistFiles = await readdir(DECKLISTS_DIR);

        for (const file of decklistFiles) {
            if (file.endsWith(".txt")) {
                slugs.add(file.replace(/\.txt$/, ""));
            }
        }
    } catch {
        // Wenn der Ordner noch nicht existiert, einfach ignorieren.
    }

    try {
        const savedEntries = await readdir(SAVED_DIR, { withFileTypes: true });

        for (const entry of savedEntries) {
            if (entry.isDirectory() && entry.name !== "comparisons") {
                slugs.add(entry.name);
            }
        }
    } catch {
        // Wenn der Ordner noch nicht existiert, einfach ignorieren.
    }

    return [...slugs].sort((a, b) => a.localeCompare(b));
}

async function loadDeck(
    slug: string,
    collection: CollectionCard[],
): Promise<DeckDoc> {
    const decklistPath = path.join(DECKLISTS_DIR, `${slug}.txt`);
    const savedDeckDir = path.join(SAVED_DIR, slug);

    const decklist = await readIfExists(decklistPath);
    const deckView = await readDeckView(savedDeckDir);
    const shoppingList = await readIfExists(path.join(savedDeckDir, "shopping-list.md"));
    const analysis = await readIfExists(path.join(savedDeckDir, "analysis.md"));
    const bracket = await readIfExists(path.join(savedDeckDir, "bracket.md"));
    const gameplan = await readIfExists(path.join(savedDeckDir, "gameplan.md"));
    const ruleZero = await readIfExists(path.join(savedDeckDir, "rule-zero.md"));
    const variants = await readVariants(savedDeckDir);
    const versions = await readVersions(savedDeckDir);

    const commanderNames = extractCommanders(decklist);

    const commanders: CommanderDoc[] = await Promise.all(
        commanderNames.map(async (name) => ({
            name,
            image: await findCommanderImage(name, collection),
        })),
    );

    return {
        slug,
        title: titleFromSlug(slug),
        commanders,
        decklist,
        deckView,
        shoppingList,
        analysis,
        bracket,
        gameplan,
        ruleZero,
        variants,
        versions,
    };
}

function getCommanderLabel(deck: DeckDoc): string {
    if (deck.commanders.length === 0) {
        return "Commander offen";
    }

    return deck.commanders
        .map((commander) => commander.name)
        .join(" + ");
}

function renderCommanderImageContent(commander: CommanderDoc): string {
    if (commander.image) {
        return `<img
  src="${escapeHtml(commander.image.url)}"
  alt="${escapeHtml(commander.name)}"
  loading="lazy"
>
${
            commander.image.owned
                ? ""
                : '<span class="not-owned-label">Nicht in Collection</span>'
        }`;
    }

    return `<div class="deck-card-art-placeholder">
  <span>${escapeHtml(commander.name)}</span>
</div>`;
}

function renderIndexCommanderArt(deck: DeckDoc): string {
    if (deck.commanders.length === 0) {
        return `<div class="deck-card-art">
  <div class="deck-card-art-placeholder">
    <span>Commander offen</span>
  </div>
</div>`;
    }

    if (deck.commanders.length === 1) {
        const commander = deck.commanders[0]!;

        return `<div class="deck-card-art ${commander.image && !commander.image.owned ? "not-owned" : ""}">
${renderCommanderImageContent(commander)}
</div>`;
    }

    return `<div class="deck-card-art deck-card-art-multi">
${deck.commanders
        .map(
            (commander) => `<div class="commander-art-part ${commander.image && !commander.image.owned ? "not-owned" : ""}">
${renderCommanderImageContent(commander)}
</div>`,
        )
        .join("\n")}
</div>`;
}

function renderIndex(decks: DeckDoc[]): string {
    const deckCards = decks
        .map((deck) => {
            const bracketNumber = extractBracketNumber(deck.bracket);

            const ruleZeroClass = deck.ruleZero ? "badge-good" : "badge-missing";
            const analysisClass = deck.analysis ? "badge-good" : "badge-missing";
            const bracketClass = bracketNumber ? "badge-good" : "badge-missing";
            const gameplanClass = deck.gameplan ? "badge-good" : "badge-missing";
            const variantsClass = deck.variants.length > 0 ? "badge-good" : "badge-missing";
            const versionsClass = deck.decklist ? "badge-good" : "badge-missing";

            const ruleZero = deck.ruleZero ? "Rule 0" : "Kein Rule 0";
            const analysis = deck.analysis ? "Analyse" : "Keine Analyse";
            const bracket = bracketNumber
                ? `Bracket ${bracketNumber}`
                : "Kein Bracket";
            const gameplan = deck.gameplan ? "Gameplan" : "Kein Gameplan";
            const variants = `${deck.variants.length} Varianten`;
            const versions = deck.decklist
                ? `Version ${getCurrentVersion(deck)}`
                : "Keine Version";

            return `<a class="deck-card" href="decks/${escapeHtml(deck.slug)}.html">
  <div class="deck-card-title">${escapeHtml(deck.title)}</div>

${renderIndexCommanderArt(deck)}

  <div class="deck-card-badges">
    <span class="badge ${ruleZeroClass}">${ruleZero}</span>
    <span class="badge ${analysisClass}">${analysis}</span>
    <span class="badge ${bracketClass}">${bracket}</span>
    <span class="badge ${gameplanClass}">${gameplan}</span>
    <span class="badge ${variantsClass}">${variants}</span>
    <span class="badge ${versionsClass}">${versions}</span>
  </div>
</a>`;
        })
        .join("\n\n");

    // language=HTML
    // noinspection HtmlUnknownTarget
    return `<!doctype html>
<!--suppress HtmlUnknownTarget -->
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MTG Commander Brain – Deckübersicht</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="top-bar">
    <div class="page-width">
      <div class="brand">MTG Commander Brain</div>
    </div>
  </header>

  <main class="page-width index-content">
    <header class="site-header">
      <h1>Deckübersicht</h1>
      <p class="subtitle">Gespeicherte Decks, Rule-0-Hinweise, Analysen, Brackets, Gameplans, Varianten und Versionen.</p>
    </header>

    <section class="deck-grid">
${deckCards || "<p>Keine Decks gefunden.</p>"}
    </section>
  </main>
</body>
</html>
`;
}

function renderVariantsBlock(deck: DeckDoc): string {
    if (deck.variants.length === 0) {
        return `<p class="empty-content">Keine gespeicherten Varianten vorhanden.</p>`;
    }

    return deck.variants
        .map((variant) => {
            const originalContent = variant.content.trim();
            const titleMatch = originalContent.match(/^#\s+(.+)$/m);

            const title = titleMatch?.[1]
                ? titleMatch[1].trim()
                : variant.title;

            const content = stripFirstHeading(originalContent);

            return `<details class="sub-accordion variant-accordion">
<summary>${escapeHtml(title)}</summary>
<div class="sub-accordion-content">
${renderMarkdown(content)}
</div>
</details>`;
        })
        .join("\n");
}

function renderVersionsBlock(deck: DeckDoc): string {
    if (deck.versions.length === 0) {
        return `<p class="empty-content">Keine archivierten Versionen vorhanden.</p>`;
    }

    return deck.versions
        .map((version) => {
            const originalContent = version.content.trim();
            const titleMatch = originalContent.match(/^#\s+(.+)$/m);

            const title = titleMatch?.[1]
                ? titleMatch[1].trim()
                : `${deck.title} – Version ${version.slug}`;

            const content = stripFirstHeading(originalContent);

            return `<details class="sub-accordion version-accordion">
<summary>${escapeHtml(title)}</summary>
<div class="sub-accordion-content">
${renderMarkdown(content)}
</div>
</details>`;
        })
        .join("\n");
}

function formatEur(value: number): string {
    return `${value.toFixed(2).replace(".", ",")} €`;
}

function renderDeckViewStatus(card: DeckViewCard): string {
    if (card.availability === "basic-land") {
        return `<span class="deck-view-status deck-view-status-owned">Owned · Basic Land</span>`;
    }

    if (card.missingQuantity === 0) {
        return `<span class="deck-view-status deck-view-status-owned">Owned · ${card.ownedQuantity} vorhanden</span>`;
    }

    const priceParts: string[] = [];

    if (card.priceEur !== null) {
        priceParts.push(`${formatEur(card.priceEur)} / Karte`);
    }

    if (card.missingTotalEur !== null && card.missingQuantity > 1) {
        priceParts.push(`${formatEur(card.missingTotalEur)} gesamt`);
    }

    const priceText = priceParts.length > 0
        ? priceParts.join(" · ")
        : "Preis unbekannt";

    const ownedText = card.ownedQuantity > 0
        ? ` · ${card.ownedQuantity} vorhanden`
        : "";

    return `<span class="deck-view-status deck-view-status-missing">Fehlt ${card.missingQuantity}${ownedText} · ${escapeHtml(priceText)}</span>`;
}

function renderDeckViewCard(card: DeckViewCard): string {
    const quantityLabel = card.quantity > 1
        ? `<span class="deck-view-quantity">${card.quantity}×</span>`
        : "";

    const image = card.imageUri
        ? `<img
  class="deck-view-card-image"
  src="${escapeHtml(card.imageUri)}"
  alt="${escapeHtml(card.name)}"
  loading="lazy"
  width="180"
>`
        : `<div class="deck-view-card-placeholder">${escapeHtml(card.name)}</div>`;

    const visual = card.scryfallUri
        ? `<a
  class="deck-view-card-link"
  href="${escapeHtml(card.scryfallUri)}"
  target="_blank"
  rel="noopener noreferrer"
>${image}</a>`
        : image;

    const metaParts: string[] = [];

    if (card.manaValue !== null && card.manaValue !== undefined) {
        metaParts.push(`MV ${card.manaValue}`);
    }

    if (card.printing) {
        const flavorName = card.printing.flavorName
            ? `${card.printing.flavorName} · `
            : "";
        const foil = card.printing.foil ? " · Foil" : "";
        metaParts.push(
            `${flavorName}${card.printing.setCode.toUpperCase()} #${card.printing.collectorNumber}${foil}`,
        );
    }

    const meta = metaParts.length > 0
        ? `<div class="deck-view-card-meta">${escapeHtml(metaParts.join(" · "))}</div>`
        : "";
    const quantityLine = quantityLabel ? `\n    ${quantityLabel}` : "";
    const metaLine = meta ? `\n    ${meta}` : "";

    return `<article class="deck-view-card" data-availability="${escapeHtml(card.availability)}">
  <div class="deck-view-card-visual">${quantityLine}
    ${visual}
  </div>
  <div class="deck-view-card-info">
    <div class="deck-view-card-name">${escapeHtml(card.name)}</div>${metaLine}
    ${renderDeckViewStatus(card)}
  </div>
</article>`;
}

function renderDeckViewBlock(deck: DeckDoc): string {
    if (!deck.deckView) {
        return `<p class="empty-content">Keine generierte Deckansicht vorhanden.</p>`;
    }

    const categories = DECK_VIEW_CATEGORY_ORDER
        .map((category) => {
            const cards = [...(deck.deckView?.cards[category] ?? [])]
                .sort((a, b) => {
                    const manaA = a.manaValue ?? Number.POSITIVE_INFINITY;
                    const manaB = b.manaValue ?? Number.POSITIVE_INFINITY;

                    if (manaA !== manaB) {
                        return manaA - manaB;
                    }

                    return a.name.localeCompare(b.name);
                });

            if (cards.length === 0) {
                return "";
            }

            const totalQuantity = cards.reduce(
                (sum, card) => sum + card.quantity,
                0,
            );

            return `<section class="deck-view-category">
  <h3>${escapeHtml(category)} <span class="deck-view-category-count">(${totalQuantity})</span></h3>
  <div class="deck-view-card-grid">
${cards.map(renderDeckViewCard).join("\n")}
  </div>
</section>`;
        })
        .filter(Boolean)
        .join("\n");

    return categories || `<p class="empty-content">Keine Karten in der Deckansicht vorhanden.</p>`;
}


function renderDeckBlock(
    decklistBlock: string,
    deckViewBlock: string,
    shoppingListBlock: string,
): string {
    return `<details id="deckliste" class="sub-accordion deck-sub-accordion">
<summary>Liste</summary>
<div class="sub-accordion-content">
${renderMarkdown(decklistBlock)}
</div>
</details>

<details id="deckansicht" class="sub-accordion deck-sub-accordion">
<summary>Ansicht</summary>
<div class="accordion-content deck-view-accordion-content">
${deckViewBlock}
</div>
</details>

<details id="einkaufsliste" class="sub-accordion deck-sub-accordion">
<summary>Einkaufsliste</summary>
<div class="sub-accordion-content">
${renderMarkdown(shoppingListBlock)}
</div>
</details>`;
}


function renderMainSection(
    id: string,
    title: string,
    content: string,
    contentType: MainSectionContentType = "subsections",
): string {
    let renderedContent: string;

    switch (contentType) {
        case "html":
            renderedContent = content;
            break;

        case "markdown":
            renderedContent = renderMarkdown(content);
            break;

        case "subsections":
        default:
            renderedContent = renderMarkdownSubsections(content);
            break;
    }

    return `<section id="${escapeHtml(id)}" class="accordion-card main-section">
<div class="main-section-title">
  ${escapeHtml(title)}
</div>

<div class="accordion-content">
${renderedContent}
</div>
</section>`;
}

function renderProfileCommanderImages(deck: DeckDoc): string {
    if (deck.commanders.length === 0) {
        return `<div class="profile-commander-images">
  <div class="deck-card-art">
    <div class="deck-card-art-placeholder">
      <span>Commander offen</span>
    </div>
  </div>
</div>`;
    }

    return `<div class="profile-commander-images">
${deck.commanders
        .map(
            (commander) => `<div class="deck-card-art ${commander.image && !commander.image.owned ? "not-owned" : ""}">
${renderCommanderImageContent(commander)}
</div>`,
        )
        .join("\n")}
</div>`;
}

function renderDeckPage(deck: DeckDoc): string {
    const ruleZeroBlock = deck.ruleZero
        ? deck.ruleZero.trim()
        : "_Kein gespeicherter Rule-0-Hinweis vorhanden._";

    const analysisBlock = deck.analysis
        ? deck.analysis.trim()
        : "_Keine gespeicherte Analyse vorhanden._";

    const bracketBlock = deck.bracket
        ? deck.bracket.trim()
        : "_Keine gespeicherte Bracket-Einschätzung vorhanden._";

    const gameplanBlock = deck.gameplan
        ? deck.gameplan.trim()
        : "_Kein gespeicherter Gameplan vorhanden._";

    const deckViewBlock = renderDeckViewBlock(deck);

    const decklistBlock = deck.decklist
        ? `\`\`\`txt\n${deck.decklist.trim()}\n\`\`\``
        : "_Keine Deckliste vorhanden._";

    const shoppingListBlock = deck.shoppingList
        ? deck.shoppingList.trim()
        : "_Keine Einkaufsliste vorhanden._";

    const deckBlock = renderDeckBlock(
        decklistBlock,
        deckViewBlock,
        shoppingListBlock,
    );

    const variantsBlock = renderVariantsBlock(deck);
    const versionsBlock = renderVersionsBlock(deck);

    const bracketNumber = extractBracketNumber(deck.bracket);
    const currentVersion = getCurrentVersion(deck);
    const commanderLabel = getCommanderLabel(deck);
    const commanderImagesHtml = renderProfileCommanderImages(deck);

    const profileButton = (
        href: string,
        label: string,
        available: boolean,
    ): string => {
        if (!available) {
            return `<span class="profile-nav-button disabled">${escapeHtml(label)}</span>`;
        }

        return `<a class="profile-nav-button" href="${href}">${escapeHtml(label)}</a>`;
    };

    // language=HTML
    // noinspection HtmlUnknownAnchorTarget,HtmlUnknownTarget
    return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(deck.title)} – MTG Commander Brain</title>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
  <div class="page-shell">

    <nav class="breadcrumb">
      <a href="../index.html">← Deckübersicht</a>
    </nav>

    <header class="deck-header">
      <p class="eyebrow">Deck</p>
      <h1>${escapeHtml(deck.title)}</h1>
      <p class="subtitle">
        Commander: ${escapeHtml(commanderLabel)}
      </p>
    </header>

    <section class="profile-card">
      <h2>Kurzprofil</h2>

      <div class="profile-layout">
        ${commanderImagesHtml}

        <div class="profile-nav">
          ${profileButton("#rule-zero", "Rule 0", Boolean(deck.ruleZero))}
          ${profileButton("#analyse", "Analyse", Boolean(deck.analysis))}
          ${profileButton(
        "#bracket",
        bracketNumber ? `Bracket ${bracketNumber}` : "Bracket",
        Boolean(bracketNumber),
    )}
          ${profileButton("#gameplan", "Gameplan", Boolean(deck.gameplan))}
          ${profileButton(
        "#deck",
        "Deck",
        Boolean(deck.decklist || deck.deckView || deck.shoppingList),
    )}
          ${profileButton(
        "#varianten",
        `${deck.variants.length} ${deck.variants.length === 1 ? "Variante" : "Varianten"}`,
        deck.variants.length > 0,
    )}
          ${profileButton(
        "#versionen",
        `Version ${currentVersion}`,
        Boolean(deck.decklist),
    )}
        </div>
      </div>
    </section>

${renderMainSection("rule-zero", "Rule 0", ruleZeroBlock, "subsections")}

${renderMainSection("analyse", "Analyse", analysisBlock, "subsections")}

${renderMainSection(
        "bracket",
        bracketNumber ? `Bracket ${bracketNumber}` : "Bracket",
        bracketBlock,
        "subsections",
    )}

${renderMainSection("gameplan", "Gameplan", gameplanBlock, "subsections")}

${renderMainSection("deck", "Deck", deckBlock, "html")}

${renderMainSection("varianten", "Varianten", variantsBlock, "html")}

${renderMainSection(
        "versionen",
        `Versionen · aktuell ${currentVersion}`,
        versionsBlock,
        "html",
    )}

  </div>
</body>
</html>
`;
}

async function main(): Promise<void> {
    await mkdir(DOCS_DIR, { recursive: true });

    if (await pathExists(DOCS_DECKS_DIR)) {
        await rm(DOCS_DECKS_DIR, { recursive: true, force: true });
    }

    await mkdir(DOCS_DECKS_DIR, { recursive: true });

    const collection = await loadCollection();
    const slugs = await getDeckSlugs();

    const decks = await Promise.all(
        slugs.map((slug) => loadDeck(slug, collection)),
    );

    await writeFile(
        path.join(DOCS_DIR, "index.html"),
        renderIndex(decks),
        "utf8",
    );

    for (const deck of decks) {
        const outputPath = path.join(
            DOCS_DECKS_DIR,
            `${deck.slug}.html`,
        );

        await writeFile(
            outputPath,
            renderDeckPage(deck),
            "utf8",
        );
    }

    console.log(`Docs generated for ${decks.length} deck(s).`);
}

main().catch((error: unknown) => {
    console.error("Failed to build docs:");
    console.error(error);
    process.exitCode = 1;
});
