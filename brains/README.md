# MTG Commander Brain – Registry und Task Router

## Zweck

Dieser Ordner ist die gemeinsame, KI-unabhängige Quelle für Projektregeln und MTG-Workflows.

KI-spezifische Dateien unter `ai-context/` dürfen auf diese Brains verweisen, aber deren Fachlogik nicht duplizieren.

## Grundregel

Lade pro Auftrag nur die tatsächlich benötigten Module.

Zusammengesetzte Aufträge verwenden die Vereinigung der benötigten Module.

## Brain Registry

| Brain | Zuständigkeit |
|---|---|
| `project/philosophy.md` | projektweite Grundsätze, Daten- und Schreibmodell |
| `rules/magic-rules.md` | Legalität, Color Identity, Commander-Regeln und Karteninteraktionen |
| `collection/templates.md` | Collection-Lookups, Besitzlogik, Commander-Auswahl aus der Collection |
| `deckbuilding/templates.md` | neues Deck, Umbau, Varianten und Deckbau-Workflow |
| `deck-analysis/templates.md` | Analyse bestehender Decklisten und Gameplan-Ableitung |
| `bracket/templates.md` | Commander Brackets, Game Changers und Bracket-Bewertung |
| `deck-versioning/templates.md` | Ersetzen einer bestehenden Hauptdeckliste und Archivierung alter Versionen |

## Immer zuerst

Für projektbezogene MTG-Aufgaben zuerst lesen:

```text
brains/project/philosophy.md
```

Danach über die folgende Tabelle routen.

## Task Routing

| Nutzerauftrag | Pflicht-Brains | Zusätzliche Daten |
|---|---|---|
| neues Deck bauen | `deckbuilding`, `bracket`, `rules` | Commander/Kartenquellen nach Auftrag |
| Deck aus/mit Collection bauen | `collection`, `deckbuilding`, `bracket`, `rules` | `data/collection.json` oder ManaBox-Import |
| Commander aus Collection auswählen | `collection`, `rules` | Collection; bei Popularität ggf. aktuelle Community-Daten |
| Deck analysieren | `deck-analysis`, `bracket`, `rules` | betroffene Deckliste |
| Gameplan für vorhandenes Deck | `deck-analysis`, `rules` | betroffene Deckliste |
| Bracket bestimmen | `bracket`, `rules` | Deckliste |
| bestehendes Deck überarbeiten, ohne Hauptversion zu ersetzen | `deckbuilding`, `bracket`, `rules` | bestehende Deckliste; Collection nur wenn relevant |
| neue Hauptversion eines bestehenden Decks übernehmen | `deck-versioning`, `deck-analysis`, `bracket`, `rules` | alte und neue Deckliste |
| Variante erstellen | `deckbuilding`, `bracket`, `rules` | Hauptdeck; Collection nur wenn relevant |
| Karteninteraktion / Combo / Legalität | `rules` | betroffene Karten |
| mehrere Decks vergleichen | `deck-analysis` plus `bracket` wenn Power relevant | nur die verglichenen Decklisten |

`project/philosophy.md` kommt jeweils zusätzlich dazu.

## Routing-Regeln

### Collection ist nicht automatisch Deckbau-Constraint

Unterscheide:

```text
"Commander aus meiner Collection"
```

bedeutet: Der Commander muss vorhanden sein.

```text
"Baue das Deck aus meiner Collection"
"Collection-first"
"Nutze meine Collection"
```

bedeutet: Die gesamte Kartenwahl soll die Collection entsprechend `collection/templates.md` berücksichtigen.

Nicht aus der ersten Formulierung ungefragt die zweite ableiten.

### Bestehende Decks nur bei Relevanz laden

Nicht pauschal alle Decklisten lesen.

Bestehende Decks laden, wenn der Auftrag:

- ein konkretes Deck analysiert oder ändert,
- eine Variante oder Version betrifft,
- einen Vergleich verlangt,
- ausdrücklich Unterschiede zu vorhandenen Decks fordert.

### Regeln und Aktualität

Wenn eine Aussage von aktueller Legalität, Oracle-Text, Brackets, Game Changers oder Banlist abhängt, gelten die Aktualitätsregeln des jeweiligen Brains.

## Datenrouting

Bevorzugte Quellen:

1. strukturierte Daten unter `data/`
2. Rohdaten unter `imports/`, wenn strukturierte Daten fehlen oder ausdrücklich neu importiert werden sollen
3. externe Quellen nur für Informationen, die im Projekt nicht vorhanden oder dynamisch sind

Collection:

```text
data/collection.json
```

Fallback:

```text
imports/manabox/ManaBox_Collection.csv
```

Decklisten:

```text
data/decks/decklists/*.txt
```

Gespeicherte Auswertungen:

```text
data/decks/saved/[deck-slug]/
```

## Schreiben

Das Lesen und Erstellen eines Arbeitsstands ist erlaubt.

Persistente Dateiänderungen benötigen eine ausdrückliche Nutzeranweisung oder Bestätigung.

Für das Ersetzen einer bestehenden Hauptdeckliste immer zuerst `deck-versioning/templates.md` verwenden.
