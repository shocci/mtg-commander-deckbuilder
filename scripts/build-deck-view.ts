import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();

const DECKLISTS_DIR = path.join(ROOT_DIR, "data", "decks", "decklists");
const SAVED_DIR = path.join(ROOT_DIR, "data", "decks", "saved");
const COLLECTION_PATH = path.join(ROOT_DIR, "data", "collection.json");

const SCRYFALL_HEADERS = {
    "User-Agent": "mtg-commander-deckbuilder/1.0",
    "Accept": "application/json;q=0.9,*/*;q=0.8",
};

const BASIC_LANDS = new Set([
    "plains",
    "island",
    "swamp",
    "mountain",
    "forest",
    "wastes",
]);

type DeckCategory =
    | "Commander"
    | "Creatures"
    | "Artifacts"
    | "Instants"
    | "Sorceries"
    | "Enchantments"
    | "Lands"
    | "Other";

type Availability =
    | "collection"
    | "basic-land"
    | "partial"
    | "missing";

type ParsedDeckCard = {
    name: string;
    quantity: number;
    commander: boolean;
};

type CollectionCard = {
    name: string;
    quantity: number;
    scryfallId?: string;
    scryfall_id?: string;
    "Scryfall ID"?: string;
};

type CollectionData = {
    cards?: CollectionCard[];
};

type ScryfallCard = {
    id?: string;
    name?: string;
    type_line?: string;
    scryfall_uri?: string;
    image_uris?: {
        normal?: string;
    };
    card_faces?: Array<{
        type_line?: string;
        image_uris?: {
            normal?: string;
        };
    }>;
    prices?: {
        eur?: string | null;
        eur_foil?: string | null;
        eur_etched?: string | null;
    };
};

type DeckViewCard = {
    name: string;
    quantity: number;
    ownedQuantity: number;
    missingQuantity: number;
    availability: Availability;
    scryfallId: string | null;
    scryfallUri: string | null;
    imageUri: string | null;
    backImageUri: string | null;
    priceEur: number | null;
    missingTotalEur: number | null;
};

type DeckView = {
    deckSlug: string;
    sourceDecklist: string;
    generatedAt: string;
    cards: Partial<Record<DeckCategory, DeckViewCard[]>>;
};

function normalizeCardName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[’']/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function cardNameParts(name: string): string[] {
    return name
        .split("//")
        .map((part) => normalizeCardName(part))
        .filter(Boolean);
}

function sameCardName(left: string, right: string): boolean {
    const leftNormalized = normalizeCardName(left);
    const rightNormalized = normalizeCardName(right);

    if (leftNormalized === rightNormalized) {
        return true;
    }

    const leftParts = cardNameParts(left);
    const rightParts = cardNameParts(right);

    return leftParts.some((part) => rightParts.includes(part));
}

function parseDecklist(decklist: string): ParsedDeckCard[] {
    const parsed: ParsedDeckCard[] = [];
    let section = "";

    for (const rawLine of decklist.split(/\r?\n/)) {
        const line = rawLine.trim();

        if (!line) {
            if (section === "commander") {
                section = "deck";
            }
            continue;
        }

        if (line.startsWith("//")) {
            section =
                line.slice(2).trim().toLowerCase() === "commander"
                    ? "commander"
                    : "deck";
            continue;
        }

        const match = line.match(/^(\d+)\s+(.+)$/);

        if (!match?.[1] || !match[2]) {
            continue;
        }

        parsed.push({
            quantity: Number.parseInt(match[1], 10),
            name: match[2].trim(),
            commander: section === "commander",
        });
    }

    // Gleiche Karten zu einem Eintrag zusammenfassen.
    // Beispiel: drei einzelne "1 Forest"-Zeilen werden zu quantity: 3.
    const grouped = new Map<string, ParsedDeckCard>();

    for (const card of parsed) {
        const key = normalizeCardName(card.name);
        const existing = grouped.get(key);

        if (existing) {
            existing.quantity += card.quantity;
            existing.commander = existing.commander || card.commander;
            continue;
        }

        grouped.set(key, { ...card });
    }

    return [...grouped.values()];
}

async function loadCollection(): Promise<CollectionCard[]> {
    const raw = await readFile(COLLECTION_PATH, "utf8");
    const parsed = JSON.parse(raw) as CollectionData | CollectionCard[];

    if (Array.isArray(parsed)) {
        return parsed;
    }

    return Array.isArray(parsed.cards) ? parsed.cards : [];
}

function getOwnedQuantity(
    cardName: string,
    collection: CollectionCard[],
): number {
    return collection
        .filter((card) => sameCardName(cardName, card.name))
        .reduce((sum, card) => sum + Math.max(0, card.quantity ?? 0), 0);
}

function getCollectionScryfallId(
    cardName: string,
    collection: CollectionCard[],
): string | null {
    const match = collection.find(
        (card) =>
            sameCardName(cardName, card.name) &&
            Boolean(
                card.scryfallId ??
                card.scryfall_id ??
                card["Scryfall ID"],
            ),
    );

    if (!match) {
        return null;
    }

    return (
        match.scryfallId ??
        match.scryfall_id ??
        match["Scryfall ID"] ??
        null
    );
}

function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function fetchScryfall(url: string): Promise<ScryfallCard | null> {
    await sleep(300);

    try {
        const response = await fetch(url, {
            headers: SCRYFALL_HEADERS,
            signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
            console.warn(`Scryfall lookup failed: ${response.status} ${url}`);
            return null;
        }

        return await response.json() as ScryfallCard;
    } catch (error) {
        console.warn(`Scryfall lookup error: ${url}`, error);
        return null;
    }
}

async function resolveScryfallCard(
    cardName: string,
    collection: CollectionCard[],
): Promise<ScryfallCard | null> {
    const scryfallId = getCollectionScryfallId(cardName, collection);

    if (scryfallId) {
        const byId = await fetchScryfall(
            `https://api.scryfall.com/cards/${encodeURIComponent(scryfallId)}`,
        );

        if (byId) {
            return byId;
        }
    }

    const params = new URLSearchParams({
        exact: cardName,
    });

    return await fetchScryfall(
        `https://api.scryfall.com/cards/named?${params.toString()}`,
    );
}

function getCompleteTypeLine(card: ScryfallCard | null): string {
    if (!card) {
        return "";
    }

    return [
        card.type_line,
        ...(card.card_faces ?? []).map((face) => face.type_line),
    ]
        .filter((value): value is string => Boolean(value))
        .join(" // ");
}

function getCategory(
    parsedCard: ParsedDeckCard,
    scryfallCard: ScryfallCard | null,
): DeckCategory {
    if (parsedCard.commander) {
        return "Commander";
    }

    const typeLine = getCompleteTypeLine(scryfallCard);

    // Priorität für Mischtypen:
    // Land > Creature > Artifact > Instant > Sorcery > Enchantment
    if (/\bLand\b/i.test(typeLine)) {
        return "Lands";
    }

    if (/\bCreature\b/i.test(typeLine)) {
        return "Creatures";
    }

    if (/\bArtifact\b/i.test(typeLine)) {
        return "Artifacts";
    }

    if (/\bInstant\b/i.test(typeLine)) {
        return "Instants";
    }

    if (/\bSorcery\b/i.test(typeLine)) {
        return "Sorceries";
    }

    if (/\bEnchantment\b/i.test(typeLine)) {
        return "Enchantments";
    }

    return "Other";
}

function getImageUris(card: ScryfallCard | null): {
    front: string | null;
    back: string | null;
} {
    if (!card) {
        return {
            front: null,
            back: null,
        };
    }

    if (card.image_uris?.normal) {
        return {
            front: card.image_uris.normal,
            back: null,
        };
    }

    const front = card.card_faces?.[0]?.image_uris?.normal ?? null;
    const back = card.card_faces?.[1]?.image_uris?.normal ?? null;

    return {
        front,
        back,
    };
}

function parseEuroPrice(value: string | null | undefined): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number.parseFloat(value);

    return Number.isFinite(parsed)
        ? Math.round(parsed * 100) / 100
        : null;
}

function getEuroPrice(card: ScryfallCard | null): number | null {
    if (!card?.prices) {
        return null;
    }

    return (
        parseEuroPrice(card.prices.eur) ??
        parseEuroPrice(card.prices.eur_foil) ??
        parseEuroPrice(card.prices.eur_etched)
    );
}

function getAvailability(
    cardName: string,
    quantity: number,
    ownedQuantity: number,
): Availability {
    if (BASIC_LANDS.has(normalizeCardName(cardName))) {
        return "basic-land";
    }

    if (ownedQuantity >= quantity) {
        return "collection";
    }

    if (ownedQuantity > 0) {
        return "partial";
    }

    return "missing";
}

function createEmptyCategories(): Record<DeckCategory, DeckViewCard[]> {
    return {
        Commander: [],
        Creatures: [],
        Artifacts: [],
        Instants: [],
        Sorceries: [],
        Enchantments: [],
        Lands: [],
        Other: [],
    };
}

async function buildDeckView(deckSlug: string): Promise<void> {
    const decklistPath = path.join(DECKLISTS_DIR, `${deckSlug}.txt`);
    const savedDeckDir = path.join(SAVED_DIR, deckSlug);
    const outputPath = path.join(savedDeckDir, "deck-view.json");

    const decklist = await readFile(decklistPath, "utf8");
    const collection = await loadCollection();
    const parsedCards = parseDecklist(decklist);

    if (parsedCards.length === 0) {
        throw new Error(`Keine Karten in ${decklistPath} gefunden.`);
    }

    const scryfallCache = new Map<string, ScryfallCard | null>();
    const cards = createEmptyCategories();

    for (const parsedCard of parsedCards) {
        const cacheKey = normalizeCardName(parsedCard.name);

        let scryfallCard = scryfallCache.get(cacheKey);

        if (scryfallCard === undefined) {
            console.log(`Scryfall: ${parsedCard.name}`);
            scryfallCard = await resolveScryfallCard(
                parsedCard.name,
                collection,
            );
            scryfallCache.set(cacheKey, scryfallCard);
        }

        const isBasicLand = BASIC_LANDS.has(
            normalizeCardName(parsedCard.name),
        );

        const actualOwnedQuantity = getOwnedQuantity(
            parsedCard.name,
            collection,
        );

        // Basics gelten immer als verfügbar.
        // Bei allen anderen Karten zeigt ownedQuantity die gesamte
        // tatsächliche Menge aus der Collection.
        const ownedQuantity = isBasicLand
            ? parsedCard.quantity
            : actualOwnedQuantity;

        const missingQuantity = isBasicLand
            ? 0
            : Math.max(0, parsedCard.quantity - actualOwnedQuantity);

        const availability = getAvailability(
            parsedCard.name,
            parsedCard.quantity,
            ownedQuantity,
        );

        const category = getCategory(parsedCard, scryfallCard);
        const images = getImageUris(scryfallCard);

        const priceEur = missingQuantity > 0
            ? getEuroPrice(scryfallCard)
            : null;

        const missingTotalEur =
            priceEur !== null && missingQuantity > 0
                ? Math.round(priceEur * missingQuantity * 100) / 100
                : null;

        cards[category].push({
            name: parsedCard.name,
            quantity: parsedCard.quantity,
            ownedQuantity,
            missingQuantity,
            availability,
            scryfallId: scryfallCard?.id ?? null,
            scryfallUri: scryfallCard?.scryfall_uri ?? null,
            imageUri: images.front,
            backImageUri: images.back,
            priceEur,
            missingTotalEur,
        });
    }

    for (const category of Object.keys(cards) as DeckCategory[]) {
        cards[category].sort((a, b) => a.name.localeCompare(b.name));
    }

    const outputCards: Partial<Record<DeckCategory, DeckViewCard[]>> = {
        Commander: cards.Commander,
        Creatures: cards.Creatures,
        Artifacts: cards.Artifacts,
        Instants: cards.Instants,
        Sorceries: cards.Sorceries,
        Enchantments: cards.Enchantments,
        Lands: cards.Lands,
    };

    if (cards.Other.length > 0) {
        outputCards.Other = cards.Other;
    }

    const deckView: DeckView = {
        deckSlug,
        sourceDecklist: `data/decks/decklists/${deckSlug}.txt`,
        generatedAt: new Date().toISOString(),
        cards: outputCards,
    };

    await mkdir(savedDeckDir, { recursive: true });
    await writeFile(
        outputPath,
        JSON.stringify(deckView, null, 2),
        "utf8",
    );

    console.log(`Deck View erstellt: ${outputPath}`);
}

async function main(): Promise<void> {
    const deckSlug = process.argv[2];

    if (!deckSlug) {
        console.error(
            "Deck-Slug fehlt. Beispiel: npx tsx scripts/build-deck-view-fixed.ts terra-esper-encore",
        );
        process.exitCode = 1;
        return;
    }

    console.log("build-deck-view-fixed.ts gestartet");
    await buildDeckView(deckSlug);
}

main().catch((error: unknown) => {
    console.error("Deck View konnte nicht erstellt werden:");
    console.error(error);
    process.exitCode = 1;
});
