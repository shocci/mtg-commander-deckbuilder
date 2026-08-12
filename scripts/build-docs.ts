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

type DeckDoc = {
    slug: string;
    title: string;
    commanders: CommanderDoc[];
    decklist: string | null;
    analysis: string | null;
    bracket: string | null;
    gameplan: string | null;
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
    const analysis = await readIfExists(path.join(savedDeckDir, "analysis.md"));
    const bracket = await readIfExists(path.join(savedDeckDir, "bracket.md"));
    const gameplan = await readIfExists(path.join(savedDeckDir, "gameplan.md"));
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
        analysis,
        bracket,
        gameplan,
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

            const analysisClass = deck.analysis ? "badge-good" : "badge-missing";
            const bracketClass = bracketNumber ? "badge-good" : "badge-missing";
            const gameplanClass = deck.gameplan ? "badge-good" : "badge-missing";
            const variantsClass = deck.variants.length > 0 ? "badge-good" : "badge-missing";
            const versionsClass = deck.decklist ? "badge-good" : "badge-missing";

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
      <p class="subtitle">Gespeicherte Decks, Analysen, Brackets, Gameplans, Varianten und Versionen.</p>
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
    const analysisBlock = deck.analysis
        ? deck.analysis.trim()
        : "_Keine gespeicherte Analyse vorhanden._";

    const bracketBlock = deck.bracket
        ? deck.bracket.trim()
        : "_Keine gespeicherte Bracket-Einschätzung vorhanden._";

    const gameplanBlock = deck.gameplan
        ? deck.gameplan.trim()
        : "_Kein gespeicherter Gameplan vorhanden._";

    const decklistBlock = deck.decklist
        ? `\`\`\`txt\n${deck.decklist.trim()}\n\`\`\``
        : "_Keine Deckliste vorhanden._";

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
          ${profileButton("#analyse", "Analyse", Boolean(deck.analysis))}
          ${profileButton(
              "#bracket",
              bracketNumber ? `Bracket ${bracketNumber}` : "Bracket",
              Boolean(bracketNumber),
          )}
          ${profileButton("#gameplan", "Gameplan", Boolean(deck.gameplan))}
          ${profileButton("#deckliste", "Deckliste", Boolean(deck.decklist))}
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

${renderMainSection("analyse", "Analyse", analysisBlock, "subsections")}

${renderMainSection(
    "bracket",
    bracketNumber ? `Bracket ${bracketNumber}` : "Bracket",
    bracketBlock,
    "subsections",
)}

${renderMainSection("gameplan", "Gameplan", gameplanBlock, "subsections")}

${renderMainSection("deckliste", "Deckliste", decklistBlock, "markdown")}

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
