import assert from "node:assert/strict";
import test from "node:test";
import { parseManaBoxDecklist } from "./decklist-parser.js";

test("parses a single Commander and regular cards", () => {
    const result = parseManaBoxDecklist("// COMMANDER\n1 Vivi Ornitier\n\n1 Arcane Signet");
    assert.deepEqual(result.commanders, ["Vivi Ornitier"]);
    assert.deepEqual(result.cards, ["Arcane Signet"]);
});

test("parses partner Commanders", () => {
    const result = parseManaBoxDecklist(
        "// COMMANDER\n1 Tymna the Weaver\n1 Kraum, Ludevic's Opus\n\n// MAINBOARD\n1 Sol Ring",
    );
    assert.deepEqual(result.commanders, ["Tymna the Weaver", "Kraum, Ludevic's Opus"]);
    assert.deepEqual(result.cards, ["Sol Ring"]);
});

test("keeps double-faced card names intact", () => {
    const result = parseManaBoxDecklist(
        "// COMMANDER\n1 Esika, God of the Tree // The Prismatic Bridge\n\n1 Bala Ged Recovery // Bala Ged Sanctuary",
    );
    assert.deepEqual(result.commanders, ["Esika, God of the Tree // The Prismatic Bridge"]);
    assert.deepEqual(result.cards, ["Bala Ged Recovery // Bala Ged Sanctuary"]);
});
