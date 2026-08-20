import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const inputPath = path.join(
    process.cwd(),
    "imports",
    "manabox",
    "ManaBox_Collection.csv"
);

const outputPath = path.join(
    process.cwd(),
    "data",
    "collection.json"
);

type ManaBoxRow = {
    "Binder Name": string;
    "Binder Type": string;
    Name: string;
    "Set code": string;
    "Set name": string;
    "Collector number": string;
    Foil: string;
    Rarity: string;
    Quantity: string;
    "ManaBox ID": string;
    "Scryfall ID": string;
    "Purchase price": string;
    Misprint: string;
    Altered: string;
    Condition: string;
    Language: string;
    "Purchase price currency": string;
    Added: string;
};

type CollectionCard = {
    name: string;
    flavorName?: string;
    setCode: string;
    setName: string;
    collectorNumber: string;
    quantity: number;
    foil: boolean;
    rarity: string;
    manaboxId: string;
    scryfallId: string;
    condition: string;
    language: string;
    binderName: string;
    binderType: string;
    added: string;
    source?: "manual";
    note?: string;
};

type ExistingCollection = {
    cards?: CollectionCard[];
};

function parseBoolean(value: string): boolean {
    return value.trim().toLowerCase() === "true" || value.trim().toLowerCase() === "yes";
}

function parseQuantity(value: string): number {
    const quantity = Number.parseInt(value, 10);

    if (Number.isNaN(quantity) || quantity < 0) {
        return 0;
    }

    return quantity;
}

function readManualEntries(): CollectionCard[] {
    if (!fs.existsSync(outputPath)) {
        return [];
    }

    const existing = JSON.parse(
        fs.readFileSync(outputPath, "utf8")
    ) as ExistingCollection;

    return (existing.cards ?? []).filter((card) => card.source === "manual");
}

function main(): void {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`ManaBox CSV nicht gefunden: ${inputPath}`);
    }

    const csvContent = fs.readFileSync(inputPath, "utf8");

    const rows = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    }) as ManaBoxRow[];

    const importedCards: CollectionCard[] = rows.map((row) => ({
        name: row.Name,
        setCode: row["Set code"],
        setName: row["Set name"],
        collectorNumber: row["Collector number"],
        quantity: parseQuantity(row.Quantity),
        foil: parseBoolean(row.Foil),
        rarity: row.Rarity,
        manaboxId: row["ManaBox ID"],
        scryfallId: row["Scryfall ID"],
        condition: row.Condition,
        language: row.Language,
        binderName: row["Binder Name"],
        binderType: row["Binder Type"],
        added: row.Added,
    }));

    const importedScryfallIds = new Set(
        importedCards
            .map((card) => card.scryfallId)
            .filter(Boolean)
    );
    const manualCards = readManualEntries().filter(
        (card) => !card.scryfallId || !importedScryfallIds.has(card.scryfallId)
    );
    const cards = [...importedCards, ...manualCards];

    const collection = {
        source: "ManaBox",
        sourceFile: "imports/manabox/ManaBox_Collection.csv",
        importedAt: new Date().toISOString(),
        totalRows: rows.length,
        totalCards: cards.reduce((sum, card) => sum + card.quantity, 0),
        uniqueCards: cards.length,
        manualEntries: manualCards.length,
        cards,
    };

    fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), "utf8");

    console.log(`Import abgeschlossen.`);
    console.log(`Zeilen: ${rows.length}`);
    console.log(`Karten gesamt: ${collection.totalCards}`);
    console.log(`Einträge: ${collection.uniqueCards}`);
    console.log(`Ausgabe: ${outputPath}`);
}

main();
