import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();

const DECKLISTS_DIR = path.join(ROOT_DIR, "data", "decks", "decklists");
const SAVED_DIR = path.join(ROOT_DIR, "data", "decks", "saved");
const COLLECTION_PATH = path.join(ROOT_DIR, "data", "collection.json");

const DOCS_DIR = path.join(ROOT_DIR, "docs");
const DOCS_DECKS_DIR = path.join(DOCS_DIR, "decks");

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

type DeckDoc = {
    slug: string;
    title: string;
    commander: string | null;
    commanderImageUrl: string | null;
    decklist: string | null;
    analysis: string | null;
    bracket: string | null;
    gameplan: string | null;
    variants: DeckVariant[];
    versions: DeckVersion[];
};

async function pathExists(filePath: string): Promise<boolean> {
    try {
        await readFile(filePath, "utf8");
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

function renderStylesheetLink(relativePath: string): string {
    return `<link rel="stylesheet" href="${relativePath}">`;
}

function normalizeCardName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[’']/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function getScryfallImageUrl(scryfallId: string): string {
    const cleanId = scryfallId.trim();

    return `https://cards.scryfall.io/normal/front/${cleanId[0]}/${cleanId[1]}/${cleanId}.jpg`;
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

function findCommanderImageUrl(
    commander: string | null,
    collection: CollectionCard[],
): string | null {
    if (!commander) return null;

    const commanderNames = commander
        .split("//")
        .map((part) => normalizeCardName(part));

    const match = collection.find((card) => {
        if (!card.name) return false;

        const cardName = normalizeCardName(card.name);

        return commanderNames.some((commanderName) => cardName === commanderName);
    });

    if (!match) return null;

    const scryfallId =
        match.scryfallId ?? match.scryfall_id ?? match["Scryfall ID"];

    if (!scryfallId) return null;

    return getScryfallImageUrl(scryfallId);
}

function extractCommander(decklist: string | null): string | null {
    if (!decklist) return null;

    const lines = decklist.split(/\r?\n/);
    const commanderIndex = lines.findIndex(
        (line) => line.trim().toLowerCase() === "// commander",
    );

    if (commanderIndex === -1) return null;

    for (let i = commanderIndex + 1; i < lines.length; i++) {
        const line = lines[i]?.trim();

        if (!line) continue;
        if (line.startsWith("//")) continue;

        const match = line.match(/^\d+\s+(.+)$/);
        return match?.[1]?.trim() ?? line;
    }

    return null;
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
    const commander = extractCommander(decklist);
    const commanderImageUrl = findCommanderImageUrl(commander, collection);

    return {
        slug,
        title: titleFromSlug(slug),
        commander,
        commanderImageUrl,
        decklist,
        analysis,
        bracket,
        gameplan,
        variants,
        versions,
    };
}

function renderIndex(decks: DeckDoc[]): string {
    const deckCards = decks
        .map((deck) => {
            const commander = deck.commander ?? "Commander offen";

            const analysisClass = deck.analysis ? "badge-good" : "badge-missing";
            const bracketClass = deck.bracket ? "badge-good" : "badge-missing";
            const gameplanClass = deck.gameplan ? "badge-good" : "badge-missing";
            const variantsClass = deck.variants.length > 0 ? "badge-good" : "badge-missing";
            const versionsClass = deck.versions.length > 0 ? "badge-good" : "badge-missing";

            const analysis = deck.analysis ? "Analyse" : "Keine Analyse";
            const bracket = deck.bracket ? "Bracket" : "Kein Bracket";
            const gameplan = deck.gameplan ? "Gameplan" : "Kein Gameplan";
            const variants = `${deck.variants.length} Varianten`;
            const versions = `${deck.versions.length} Versionen`;

            return `<a class="deck-card" href="decks/${deck.slug}.html">
  <div class="deck-card-title">${deck.title}</div>

  <div class="deck-card-art">
    ${
                deck.commanderImageUrl
                    ? `<img src="${deck.commanderImageUrl}" alt="${commander}" loading="lazy">`
                    : `<div class="deck-card-art-placeholder">
        <span>${commander}</span>
      </div>`
            }
  </div>

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
    return `<!doctype html>
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
        return "_Keine gespeicherten Varianten vorhanden._";
    }

    const variantLinks = deck.variants
        .map((variant) => `- [${variant.title}](#variant-${variant.slug})`)
        .join("\n");

    const variantSections = deck.variants
        .map(
            (variant) => `<a id="variant-${variant.slug}"></a>

### ${variant.title}

${variant.content.trim()}`,
        )
        .join("\n\n---\n\n");

    return `${variantLinks}

---

${variantSections}`;
}

function renderVersionsBlock(deck: DeckDoc): string {
    if (deck.versions.length === 0) {
        return "_Keine archivierten Versionen vorhanden._";
    }

    const versionLinks = deck.versions
        .map((version) => `- [${version.title}](#version-${version.slug})`)
        .join("\n");

    const versionSections = deck.versions
        .map(
            (version) => `<a id="version-${version.slug}"></a>

### ${version.title}

${version.content.trim()}`,
        )
        .join("\n\n---\n\n");

    return `${versionLinks}

---

${versionSections}`;
}

// language=HTML
// noinspection HtmlUnknownAttribute
function renderAccordionSection(id: string, title: string, content: string, open = false,): string {
    return `<details id="${id}" class="accordion-card"${open ? " open" : ""} markdown="1">
<summary>${title}</summary>

${content}

</details>`;
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

    // language=HTML
    // noinspection HtmlUnknownAnchorTarget
    return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${deck.title} – MTG Commander Brain</title>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
  <div class="page-shell">
    <nav class="breadcrumb">
      <a href="../index.html">← Deckübersicht</a>
    </nav>

    <header class="deck-header">
      <p class="eyebrow">Deck</p>
      <h1>${deck.title}</h1>
      <p class="subtitle">Commander: ${deck.commander ?? "offen"}</p>
    </header>

    <section class="quick-nav">
      <a href="#analyse">Analyse</a>
      <a href="#bracket">Bracket</a>
      <a href="#gameplan">Gameplan</a>
      <a href="#deckliste">Deckliste</a>
      <a href="#varianten">Varianten</a>
      <a href="#versionen">Versionen</a>
    </section>

    <section class="profile-card">
      <h2>Kurzprofil</h2>

      <div class="profile-grid">
        <div>
          <span>Slug</span>
          <strong><code>${deck.slug}</code></strong>
        </div>
        <div>
          <span>Commander</span>
          <strong>${deck.commander ?? "offen"}</strong>
        </div>
        <div>
          <span>Analyse</span>
          <strong>${deck.analysis ? '<a href="#analyse">Ja</a>' : "Nein"}</strong>
        </div>
        <div>
          <span>Bracket</span>
          <strong>${deck.bracket ? '<a href="#bracket">Ja</a>' : "Nein"}</strong>
        </div>
        <div>
          <span>Gameplan</span>
          <strong>${deck.gameplan ? '<a href="#gameplan">Ja</a>' : "Nein"}</strong>
        </div>
        <div>
          <span>Deckliste</span>
          <strong>${deck.decklist ? '<a href="#deckliste">Ja</a>' : "Nein"}</strong>
        </div>
        <div>
          <span>Varianten</span>
          <strong>${deck.variants.length > 0 ? `<a href="#varianten">${deck.variants.length}</a>` : "0"}</strong>
        </div>
        <div>
          <span>Versionen</span>
          <strong>${deck.versions.length > 0 ? `<a href="#versionen">${deck.versions.length}</a>` : "0"}</strong>
        </div>
      </div>
    </section>

${renderAccordionSection("analyse", "Analyse", analysisBlock, true)}

${renderAccordionSection("bracket", "Bracket", bracketBlock)}

${renderAccordionSection("gameplan", "Gameplan", gameplanBlock)}

${renderAccordionSection("deckliste", "Deckliste", decklistBlock)}

${renderAccordionSection("varianten", "Varianten", variantsBlock)}

${renderAccordionSection("versionen", "Versionen", versionsBlock)}
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

    await writeFile(path.join(DOCS_DIR, "index.html"), renderIndex(decks), "utf8");

    for (const deck of decks) {
        const outputPath = path.join(DOCS_DECKS_DIR, `${deck.slug}.html`);
        await writeFile(outputPath, renderDeckPage(deck), "utf8");
    }

    console.log(`Docs generated for ${decks.length} deck(s).`);
}

main().catch((error: unknown) => {
    console.error("Failed to build docs:");
    console.error(error);
    process.exitCode = 1;
});