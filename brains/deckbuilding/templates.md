# Deckbuilding Template

## Regelbasis

Alle Deckbauentscheidungen müssen die Vorgaben aus
`brains/rules/magic-rules.md` beachten.

Insbesondere müssen Commander-Legalität, Color Identity,
Multi-Commander-Regeln und regelabhängige Karteninteraktionen
verifiziert werden.

## Aufgabe

Erstelle oder überarbeite ein Commander Deck anhand der Nutzeranforderungen.

Dieses Brain dient dazu, neue Deckideen zu entwickeln, bestehende Decks umzubauen oder Varianten vorhandener Decks zu erstellen.

## Zu berücksichtigende Quellen

- vorhandene Decklisten aus `data/decks/`
- Collection-Daten aus `data/collection/`
- Bracket-Regeln aus `brains/bracket/templates.md`
- Projektphilosophie aus `brains/project/philosophy.md`
- konkrete Constraints des Nutzers

## Standard-Bracket

Wenn der Nutzer beim Erstellen oder Überarbeiten eines Decks kein Ziel-Bracket angibt, wird standardmäßig **Bracket 3: Upgraded / Aufgewertet** verwendet.

Das bedeutet:

- bis zu 3 Game Changers sind erlaubt
- keine typischen frühen Zwei-Karten-Endloskombos
- keine Mass Land Denial Strategie
- keine wiederholbaren Extra-Turn-Schleifen
- starke Synergien sind erlaubt
- gute Kartenqualität ist erlaubt
- das Deck darf aktiv und fokussiert gebaut sein
- das Deck soll nicht vollständig optimiert oder cEDH-orientiert sein

Wenn der Nutzer später ein anderes Ziel-Bracket nennt, überschreibt diese Angabe den Standardwert.

## Mögliche Nutzer-Constraints

Ein Deckbau-Auftrag kann unter anderem diese Vorgaben enthalten:

- Commander
- Ziel-Bracket
- Budget
- Thema
- Mechanik
- Artwork- oder Flavor-Vorgaben
- Collection-first
- maximale Anzahl neuer Karten
- Karten, die vermieden werden sollen
- Karten, die enthalten sein müssen
- bestehende Decks, von denen sich das neue Deck unterscheiden soll
- gewünschter Spielstil
- gewünschte Power-Anpassung

## Vorgehen

1. Nutzerwunsch lesen.
2. Ziel-Bracket bestimmen.
    - Falls kein Ziel genannt wurde: Bracket 3 verwenden.
3. Vorhandene relevante Decks prüfen.
4. Collection prüfen, wenn Collection-Nutzung relevant ist.
5. Deckidee formulieren.
6. Karten nach Funktion und Beitrag zum Spielplan auswählen.
7. Game Changers zählen.
8. Prüfen, ob das Deck zum Ziel-Bracket passt.
9. Konflikte klar benennen.
10. Ausgabe als Deckvorschlag strukturieren.

## Ausgabeformat

# Deckvorschlag: [Deckname]

## Ziel

[Was soll das Deck tun?]

## Constraints

- Commander:
- Ziel-Bracket:
- Budget:
- Thema:
- Mechanik:
- Collection-Nutzung:
- Besondere Vorgaben:

## Deckkonzept

[Kurze Beschreibung der Deckidee.]

## Spielplan

### Early Game

- ...

### Mid Game

- ...

### Late Game

- ...

## Wichtige Kartenpakete

### Ramp

- ...

### Card Draw / Card Advantage

- ...

### Removal / Interaction

- ...

### Engines

- ...

### Payoffs

- ...

### Win Conditions

- ...

## Game Changer Check

Anzahl Game Changers:

- ...

Auswirkung auf das Ziel-Bracket:

- ...

## Karten aus vorhandener Collection

- ...

## Neue Kartenvorschläge

| Karte | Preisrahmen | Grund |
|---|---:|---|
| ... | ... | ... |

## Unterschiede zu bestehenden Decks

[Wenn relevant: erklären, wie sich das neue Deck von vorhandenen Decks unterscheidet.]

## Konflikte mit Nutzerwunsch

[Falls Vorgaben nicht zusammenpassen, klar benennen.]

## Basic Lands bei Collection-first Deckbau

Wenn der Nutzer sagt, dass ein Deck ausschließlich oder bevorzugt aus der Collection gebaut werden soll, gelten Basic Lands als automatisch verfügbar.

Der Nutzer scannt Basic Lands nicht vollständig in ManaBox ein, weil davon ausreichend viele vorhanden sind.

Daher gilt:

- Basic Lands müssen nicht in `data/collection.json` vorhanden sein.
- Basic Lands zählen nicht als fehlende Karten.
- Basic Lands zählen nicht als neue Käufe.
- Basic Lands zählen nicht gegen ein Zusatzbudget.
- Basic Lands dürfen immer verwendet werden, wenn sie zur Farbidentität des Commanders passen.
- Die Manabase darf mit passenden Basic Lands aufgefüllt werden.

Als Basic Lands gelten:

```text
Plains
Island
Swamp
Mountain
Forest
Wastes
```

## Offene Fragen

- Soll diese Version als neues Deck gespeichert werden?
- Soll sie als Variante eines bestehenden Decks gespeichert werden?
- Soll das Ziel-Bracket angepasst werden?