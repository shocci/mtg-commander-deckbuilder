import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();

const DECKLISTS_DIR = path.join(ROOT_DIR, "data", "decks", "decklists");
const SAVED_DIR = path.join(ROOT_DIR, "data", "decks", "saved");

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

type DeckDoc = {
    slug: string;
    title: string;
    commander: string | null;
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

async function loadDeck(slug: string): Promise<DeckDoc> {
    const decklistPath = path.join(DECKLISTS_DIR, `${slug}.txt`);
    const savedDeckDir = path.join(SAVED_DIR, slug);

    const decklist = await readIfExists(decklistPath);
    const analysis = await readIfExists(path.join(savedDeckDir, "analysis.md"));
    const bracket = await readIfExists(path.join(savedDeckDir, "bracket.md"));
    const gameplan = await readIfExists(path.join(savedDeckDir, "gameplan.md"));
    const variants = await readVariants(savedDeckDir);
    const versions = await readVersions(savedDeckDir);

    return {
        slug,
        title: titleFromSlug(slug),
        commander: extractCommander(decklist),
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
            const commander = deck.commander ?? "offen";
            const analysis = deck.analysis ? "Analyse" : "Keine Analyse";
            const bracket = deck.bracket ? "Bracket" : "Kein Bracket";
            const gameplan = deck.gameplan ? "Gameplan" : "Kein Gameplan";
            const variants = `${deck.variants.length} Varianten`;
            const versions = `${deck.versions.length} Versionen`;

            return `<a class="deck-card" href="decks/${deck.slug}.html">
  <h2>${deck.title}</h2>
  <p><strong>Commander:</strong> ${commander}</p>
  <div class="tag-row">
    <span>${analysis}</span>
    <span>${bracket}</span>
    <span>${gameplan}</span>
    <span>${variants}</span>
    <span>${versions}</span>
  </div>
</a>`;
        })
        .join("\n\n");

    return `${renderStylesheetLink("assets/style.css")}

<div class="page-shell">

<header class="site-header">
  <p class="eyebrow">MTG Commander Brain</p>
  <h1>Deckübersicht</h1>
  <p class="subtitle">Gespeicherte Decks, Analysen, Brackets, Gameplans, Varianten und Versionen.</p>
</header>

<section class="info-box">
  <strong>Hinweis:</strong> Diese Seite wurde automatisch aus <code>data/</code> erzeugt.
  Manuelle Änderungen können beim nächsten Build überschrieben werden.
</section>

<section class="deck-grid">
${deckCards || "<p>Keine Decks gefunden.</p>"}
</section>

<section class="data-source">
  <h2>Datenquellen</h2>

\`\`\`text
data/decks/decklists/
data/decks/saved/
\`\`\`

  <p>Diese <code>docs/</code>-Dateien sind nur die lesbare Anzeige für GitHub Pages.</p>
</section>

</div>
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

    return `${renderStylesheetLink("../assets/style.css")}

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

  <table>
    <tr>
      <th>Feld</th>
      <th>Wert</th>
    </tr>
    <tr>
      <td>Slug</td>
      <td><code>${deck.slug}</code></td>
    </tr>
    <tr>
      <td>Commander</td>
      <td>${deck.commander ?? "offen"}</td>
    </tr>
    <tr>
      <td>Analyse</td>
      <td>${deck.analysis ? '<a href="#analyse">Ja</a>' : "Nein"}</td>
    </tr>
    <tr>
      <td>Bracket</td>
      <td>${deck.bracket ? '<a href="#bracket">Ja</a>' : "Nein"}</td>
    </tr>
    <tr>
      <td>Gameplan</td>
      <td>${deck.gameplan ? '<a href="#gameplan">Ja</a>' : "Nein"}</td>
    </tr>
    <tr>
      <td>Deckliste</td>
      <td>${deck.decklist ? '<a href="#deckliste">Ja</a>' : "Nein"}</td>
    </tr>
    <tr>
      <td>Varianten</td>
      <td>${deck.variants.length > 0 ? `<a href="#varianten">${deck.variants.length}</a>` : "0"}</td>
    </tr>
    <tr>
      <td>Versionen</td>
      <td>${deck.versions.length > 0 ? `<a href="#versionen">${deck.versions.length}</a>` : "0"}</td>
    </tr>
  </table>
</section>

<section id="analyse" class="content-card">
  <h2>Analyse</h2>

${analysisBlock}
</section>

<section id="bracket" class="content-card">
  <h2>Bracket</h2>

${bracketBlock}
</section>

<section id="gameplan" class="content-card">
  <h2>Gameplan</h2>

${gameplanBlock}
</section>

<section id="deckliste" class="content-card">
  <h2>Deckliste</h2>

${decklistBlock}
</section>

<section id="varianten" class="content-card">
  <h2>Varianten</h2>

${variantsBlock}
</section>

<section id="versionen" class="content-card">
  <h2>Versionen</h2>

${versionsBlock}
</section>

</div>
`;
}

async function main(): Promise<void> {
    await mkdir(DOCS_DIR, { recursive: true });

    if (await pathExists(DOCS_DECKS_DIR)) {
        await rm(DOCS_DECKS_DIR, { recursive: true, force: true });
    }

    await mkdir(DOCS_DECKS_DIR, { recursive: true });

    const slugs = await getDeckSlugs();
    const decks = await Promise.all(slugs.map((slug) => loadDeck(slug)));

    await writeFile(path.join(DOCS_DIR, "index.md"), renderIndex(decks), "utf8");

    for (const deck of decks) {
        const outputPath = path.join(DOCS_DECKS_DIR, `${deck.slug}.md`);
        await writeFile(outputPath, renderDeckPage(deck), "utf8");
    }

    console.log(`Docs generated for ${decks.length} deck(s).`);
}

main().catch((error: unknown) => {
    console.error("Failed to build docs:");
    console.error(error);
    process.exitCode = 1;
});