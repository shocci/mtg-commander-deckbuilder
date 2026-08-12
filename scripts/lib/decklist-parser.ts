export type ParsedDecklist = {
    commanders: string[];
    cards: string[];
};

const CARD_LINE = /^\d+\s+(.+)$/;

export function parseManaBoxDecklist(decklist: string | null): ParsedDecklist {
    if (!decklist) return { commanders: [], cards: [] };

    const commanders: string[] = [];
    const cards: string[] = [];
    let section = "";

    for (const rawLine of decklist.split(/\r?\n/)) {
        const line = rawLine.trim();

        if (!line) {
            if (section === "commander" && commanders.length > 0) section = "deck";
            continue;
        }

        if (line.startsWith("//")) {
            section = line.slice(2).trim().toLowerCase() === "commander"
                ? "commander"
                : "deck";
            continue;
        }

        const match = line.match(CARD_LINE);
        if (!match?.[1]) continue;

        const name = match[1].trim();
        if (section === "commander") commanders.push(name);
        else cards.push(name);
    }

    return { commanders, cards };
}
