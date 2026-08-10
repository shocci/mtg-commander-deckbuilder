import { mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();

const DECKLISTS_DIR = path.join(ROOT_DIR, "data", "decks", "decklists");
const SAVED_DIR = path.join(ROOT_DIR, "data", "decks", "saved");

const DOCS_DIR = path.join(ROOT_DIR, "docs");
const DOCS_DECKS_DIR = path.join(DOCS_DIR, "decks");

type DeckDoc = {
    slug: string;
    title: string;
    commander: string | null;
    decklist: string | null;
    analysis: string | null;
    bracket: string | null;
    gameplan: string | null;
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

    return {
        slug,
        title: titleFromSlug(slug),
        commander: extractCommander(decklist),
        decklist,
        analysis,
        bracket,
        gameplan,
    };
}

function renderIndex(decks: DeckDoc[]): string {
    const rows = decks
        .map((deck) => {
            const commander = deck.commander ?? "offen";
            const analysis = deck.analysis ? "Ja" : "Nein";
            const bracket = deck.bracket ? "Ja" : "Nein";
            const gameplan = deck.gameplan ? "Ja" : "Nein";

            return `| [${deck.title}](decks/${deck.slug}.md) | ${commander} | ${analysis} | ${bracket} | ${gameplan} |`;
        })
        .join("\n");

    return `# MTG Commander Brain – Deckübersicht

> Diese Datei wurde automatisch aus \`data/\` erzeugt.  
> Manuelle Änderungen können beim nächsten Build überschrieben werden.

## Decks

| Deck | Commander | Analyse | Bracket | Gameplan |
|---|---|---:|---:|---:|
${rows || "| Keine Decks gefunden | - | - | - | - |"}

## Datenquellen

Die eigentlichen Projektdaten liegen unter:

\`\`\`text
data/decks/decklists/
data/decks/saved/
\`\`\`

Diese \`docs/\`-Dateien sind nur die lesbare Anzeige für GitHub Pages.
`;
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

    return `# ${deck.title}

> Diese Datei wurde automatisch aus \`data/\` erzeugt.  
> Manuelle Änderungen können beim nächsten Build überschrieben werden.

## Kurzprofil

| Feld | Wert |
|---|---|
| Slug | \`${deck.slug}\` |
| Commander | ${deck.commander ?? "offen"} |
| Deckliste | ${deck.decklist ? "Ja" : "Nein"} |
| Analyse | ${deck.analysis ? "Ja" : "Nein"} |
| Bracket | ${deck.bracket ? "Ja" : "Nein"} |
| Gameplan | ${deck.gameplan ? "Ja" : "Nein"} |

---

## Analyse

${analysisBlock}

---

## Bracket

${bracketBlock}

---

## Gameplan

${gameplanBlock}

---

## Deckliste

${decklistBlock}
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