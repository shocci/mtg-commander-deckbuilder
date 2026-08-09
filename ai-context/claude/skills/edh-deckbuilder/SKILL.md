---
name: "edh-deckbuilder"
description: "Claude adapter for the MTG Commander Brain project."
---

# EDH Deckbuilder Skill – MTG Commander Brain Adapter

# EDH Deckbuilder Skill – MTG Commander Brain Adapter

## Purpose

This skill connects Claude to the user's MTG Commander Brain project.

The project is not a rigid deckbuilder app. It is a multi-brain knowledge system where different folders provide different types of context:

- `brains/` = general logic and reusable instructions for all AI systems
- `data/` = concrete stored project data such as decklists, saved analyses, variants, and collection exports
- `imports/` = raw external imports such as ManaBox CSV exports
- `ai-context/` = AI-specific adapters for Claude, ChatGPT, and other systems
- `scripts/` = automation and data conversion utilities

Do not treat this skill as the main source of project rules. This skill is the Claude-specific adapter. Prefer the project files as source of truth.

---

## Core Project Rules

1. The user's Collection and the user's Decklists are separate concepts.
    - Collection = cards physically owned.
    - Decklists = cards planned, tested, played, or stored as deck ideas.
    - A card may appear in several decks even if the user owns only one copy.

2. Do not assume personal preferences from previous decks.
    - The user intentionally builds many different playstyles.
    - Do not conclude that the user dislikes or prefers a strategy unless explicitly stated for the current task.

3. Analyses are not permanent until confirmed.
    - You may produce a bracket estimate, gameplan, or deck interpretation.
    - Ask the user whether it should be saved before treating it as stored project knowledge.

4. Use the relevant brain only.
    - Do not load or apply every project file for every task.
    - Select the smallest context needed for the user's request.

5. Do not create redundant card-role databases.
    - Infer card roles from card text, Scryfall knowledge, Commander context, and the actual deck plan.
    - Store roles only when they are relevant to a specific deck analysis or deckbuilding output.

---

## Project File Sources

Use these files when available:

### Project Philosophy

`brains/project/philosophy.md`

Use for general behavior and project principles.

### Bracket Brain

`brains/bracket/templates.md`

Use for:

- Commander Bracket definitions
- Game Changer rules
- bracket analysis
- deciding whether a deck matches a bracket
- explaining why a deck is Bracket 1–5

The Bracket Brain is the source of truth for bracket rules. Do not hardcode outdated bracket definitions in this skill.

### Deckbuilding Brain

`brains/deckbuilding/templates.md`

Use for:

- creating new decks
- rebuilding existing decks
- creating variants
- applying constraints such as budget, artwork theme, flavor, bracket, collection-first, or power target

If the user does not specify a target bracket for deckbuilding, use the default defined in `brains/deckbuilding/templates.md`.

### Deck Analysis Brain

`brains/deck-analysis/templates.md`

Use for:

- analyzing uploaded or stored decklists
- extracting the deck's gameplan
- identifying engines, payoffs, interaction, weaknesses, and win conditions
- producing a bracket estimate through the Bracket Brain

### Collection Data

Preferred current/processed collection source:

- `data/collection/collection.json`
- or `data/collection.json` if the project still uses the earlier flat structure

Raw import source:

- `imports/manabox/ManaBox_Collection.csv`

Use collection data only when the task actually requires ownership checks, collection-first deckbuilding, missing-card checks, or budget-aware upgrades.

### Deck Data

Primary decklist location:

```text
data/decks/decklists/
```

The user should only need to add simple `.txt` decklists.

The default decklist format is the ManaBox export format.

Example:

```txt
// COMMANDER
1 Vivi Ornitier

1 Alania, Divergent Storm
1 Ancestors' Aid
1 Arcane Signet
1 As Foretold
1 Blaze
```

Parsing rules:

- Lines with `// COMMANDER` mark the commander section.
- The first card line after `// COMMANDER` is the commander.
- Card lines usually follow the format `[quantity] [card name]`.
- Empty lines should be ignored.
- Comment lines starting with `//` should not be treated as cards.
- The remaining card lines after the commander are the decklist.
- If additional ManaBox sections exist, use them as context but do not require them.
- ManaBox decklists are the primary decklist input format.

Saved AI-generated results should be stored only after user confirmation.

Preferred saved-output location:

```text
data/decks/saved/[deck-slug]/
```

Preferred saved-output files:

```text
data/decks/saved/[deck-slug]/
├─ analysis.md
├─ bracket.md
├─ gameplan.md
└─ variants/
```

Do not require the user to manually create this structure. The user primarily maintains only decklists in `data/decks/decklists/`.

## Task Routing

### When the user asks to analyze a deck

Use:

1. `brains/project/philosophy.md`
2. `brains/deck-analysis/templates.md`
3. `brains/bracket/templates.md`
4. the provided or stored decklist
5. collection data only if ownership matters

Output should include:

- recognized commander
- recognized deck plan
- early/mid/late gameplan
- central engines and payoffs
- interaction and win conditions
- bracket estimate
- Game Changer check if bracket rules require it
- uncertainties
- confirmation question before saving

### When the user asks to build or rebuild a deck

Use:

1. `brains/project/philosophy.md`
2. `brains/deckbuilding/templates.md`
3. `brains/bracket/templates.md`
4. relevant existing decks if the user wants a deck to feel different from them
5. collection data if the user asks for collection-first, missing-card checks, budget use, or owned-card preference

Default behavior:

- If no target bracket is given, apply the default from the Deckbuilding Brain.
- If the user gives a budget, respect it strictly.
- If no budget is given, do not invent one.
- If a request contains flavor or artwork constraints, treat them as real deckbuilding constraints, not decoration.

### When the user asks about existing decks

Examples:

- "Welche Decks sind neu?"
- "Welche Commander habe ich schon gebaut?"
- "Welche Decks spielen sich ähnlich?"
- "Welche Karten sind in mehreren Decks?"

Use:

1. `data/decks/`
2. saved analyses if present
3. collection data only if the question involves owned copies or missing cards

Do not assume a card conflict just because a card appears in multiple decklists. State it only as shared usage unless the user specifically asks for physical availability.

### When the user asks about collection ownership

Use:

1. processed collection JSON if available
2. ManaBox CSV only if processed data is missing or outdated
3. decklist files if comparing collection against decks

Report clearly:

- owned
- missing
- quantity owned
- quantity requested
- shared across decks if relevant

---

## Scryfall, EDHREC, and External Card Knowledge

Use Scryfall-style knowledge for:

- card identity
- oracle text
- color identity
- legality
- card function
- similar cards
- artwork or flavor searches when relevant

Use EDHREC-style knowledge for:

- common synergies
- archetype staples
- commander-specific packages
- popularity signals

Do not fabricate current prices, legality changes, Game Changer updates, or live EDHREC rankings. If live data is unavailable, label such information as approximate or ask the user to allow lookup.

Scryfall links:

- Link key recommended cards when useful.
- Do not force a link on every card in very long decklists unless the user asks for that.
- Preferred format: `[Card Name](https://scryfall.com/search?q=!%22Card%20Name%22)`

---

## Deckbuilding Template Defaults

When constructing Commander decks, use the Deckbuilding Brain as source of truth. The following counts are flexible starting points, not hard laws:

- 1 Commander
- around 36–38 lands depending on curve and ramp
- around 10–12 ramp pieces
- around 10–14 card advantage pieces
- enough targeted interaction for the intended bracket
- boardwipes or mass interaction as appropriate
- remaining cards as engines, payoffs, synergy, and win conditions

Mana curve is a guideline, not a rule. Adjust for commander cost, ramp density, colors, average mana value, and intended bracket.

---

## Output Behavior

Be direct and practical.

Avoid filler such as:

- "Gerne helfe ich dir"
- "Das ist eine spannende Frage"
- unnecessary recap paragraphs

Use German by default when the user writes German.

Ask short clarification questions only when required information is missing and cannot be reasonably handled by project defaults.

Do not over-interpret the user. Follow the exact task and constraints.

---

## Save / Persistence Protocol

Before saving new project knowledge, ask for confirmation.

Examples:

- "Passt die Analyse so und soll ich sie speichern?"
- "Soll diese Variante als `data/decks/<deck>/variants/<name>.md` gespeichert werden?"
- "Soll ich den Gameplan in `gameplan.md` übernehmen?"

After confirmation, save only the confirmed content. Do not silently rewrite unrelated project files.

---

## Example Workflows

### Analyze uploaded Vivi deck

1. Read the provided decklist.
2. Use Deck Analysis Brain.
3. Use Bracket Brain.
4. Infer gameplan from cards and commander.
5. Output bracket estimate and play pattern.
6. Ask whether to save the analysis.

### Build Vivi as burn variant with fire artwork and 5 € budget

1. Use Deckbuilding Brain.
2. Use Bracket Brain.
3. Use stored Vivi deck if available to avoid duplicating the existing deck identity.
4. Apply constraints:
    - Commander: Vivi
    - Theme: Burn
    - Flavor/artwork: fire-focused
    - Extra budget: 5 € total if the user means total budget; clarify if unclear
5. Prefer collection cards if collection use is requested or implied by the task.
6. Suggest only additions that fit the stated budget.
7. Ask whether to save as a variant.
