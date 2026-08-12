# Deckanalyse Template

## Regelbasis

Alle Deckanalysen müssen `brains/rules/magic-rules.md` beachten.
Combo-Linien, Synergien und Karteninteraktionen dürfen nur als
funktionierend bewertet werden, wenn sie regelkonform verifiziert sind.

## Zweck

Dieses Brain analysiert vorhandene Commander-/EDH-Decklisten und leitet
Commander, Farben, Spielplan, Engines, Payoffs, Interaktion,
Win Conditions, Schwächen, Bracket und Gameplan ab.

Die Analyse ist ein Arbeitsstand und wird erst nach Nutzerbestätigung
gespeichert.

## Input

Primärer Input ist eine ManaBox-Deckliste unter:

```text
data/decks/decklists/[deck-slug].txt
```

### Parsing

- `// COMMANDER` startet den Commander-Bereich.
- Alle Kartenzeilen bis zur nächsten Leerzeile oder Sektion sind Commander.
- Mehrere Commander sind möglich; ihre gemeinsame Legalität muss geprüft werden.
- Kartenzeilen haben üblicherweise das Format `[Anzahl] [Kartenname]`.
- `//` innerhalb eines doppelseitigen Kartennamens ist Teil des Namens.
- Sonstige `//`-Zeilen sind Sektionen oder Kommentare und keine Karten.
- Unklare oder nicht parsebare Zeilen müssen als Unsicherheit genannt werden.

## Pflichtprüfungen

1. Commander und gegebenenfalls Partner-Kombination bestimmen.
2. Commander-Legalität, Color Identity, Banlist und Deckgröße prüfen.
3. Aktuellen Oracle-Text für entscheidende Karteninteraktionen verwenden.
4. Ramp, Card Advantage, Interaction, Schutz und Manabase erfassen.
5. Engines, Synergien, Combo-Linien und Win Conditions bestimmen.
6. Geschwindigkeit, Konsistenz, Resilienz und Commander-Abhängigkeit bewerten.
7. `brains/bracket/templates.md` für Bracket und Game Changers verwenden.
8. Fehlende Daten und nicht verifizierbare Annahmen offen ausweisen.

## Ausgabeformat

# Deckanalyse: [Deckname]

## Kurzprofil

- Commander:
- Color Identity:
- Hauptstrategie:
- Geschätztes Bracket:
- Erwarteter Siegzug:

## Legalitäts- und Regelcheck

- Commander-Kombination:
- Deckgröße und Singleton:
- Color Identity:
- Banlist und Sonderbeschränkungen:
- Relevante Regelinteraktionen:

## Spielplan

### Early Game

- ...

### Mid Game

- ...

### Late Game

- ...

## Kartenpakete

### Ramp und Manabase

- ...

### Card Advantage

- ...

### Interaction und Schutz

- ...

### Engines und Payoffs

- ...

### Win Conditions und Combos

- ...

## Stärken

- ...

## Schwächen und Risiken

- ...

## Bracket-Einschätzung

- Game Changers:
- Geschwindigkeit:
- einschränkende Spielmuster:
- begründetes Ergebnis:

## Unsicherheiten

- ...

## Speichern

Nach Bestätigung werden Ergebnisse unter
`data/decks/saved/[deck-slug]/` als `analysis.md`, `bracket.md` und
`gameplan.md` abgelegt. Ohne Bestätigung werden keine Dateien verändert.
