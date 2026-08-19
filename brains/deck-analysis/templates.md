# Deckanalyse Template

## Regelbasis

Alle Deckanalysen müssen

`brains/rules/magic-rules.md`

beachten.

Combo-Linien, Synergien und Karteninteraktionen dürfen nur als
funktionierend bewertet werden, wenn sie regelkonform verifiziert sind.

---

## Zweck

Dieses Brain analysiert vorhandene Commander-/EDH-Decklisten.

Die gespeicherte Analyse soll sich auf die eigentliche Deckstruktur
konzentrieren:

- Color Identity
- Hauptstrategie
- Unterstrategien
- Kartenrollen
- Engines
- Enabler
- Payoffs
- Stärken
- Schwächen

Informationen zu:

- Spielplan
- Win Conditions
- Combos
- Bracket-Details
- Rule 0

werden während der Analyse weiterhin ermittelt, aber nicht ausführlich
in `analysis.md` wiederholt.

Diese Informationen werden von den dafür zuständigen Ausgaben bzw.
Brains verwendet.

Die Analyse ist ein Arbeitsstand und wird erst nach Nutzerbestätigung
gespeichert.

---

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
- Unklare oder nicht parsebare Zeilen müssen erkannt und bei relevanten Auswirkungen genannt werden.

---

## Pflichtprüfungen

Vor Erstellung der Analyse müssen folgende Punkte geprüft werden:

1. Commander und gegebenenfalls Partner-Kombination bestimmen.

2. Regelkonformität prüfen:
   - Commander-Legalität
   - Multi-Commander-Legalität
   - Color Identity
   - Singleton
   - Deckgröße
   - Commander-Banlist

3. Aktuellen Oracle-Text für entscheidende Karteninteraktionen verwenden.

4. Kartenrollen und Kartenpakete bestimmen:
   - Ramp
   - Card Advantage
   - Card Draw & Selection
   - Tutors
   - Targeted Interaction
   - Mass Interaction
   - Schutz und Resilienz
   - Engines
   - Enabler
   - Payoffs

5. Hauptstrategie und relevante Unterstrategien bestimmen.

6. Geschwindigkeit, Konsistenz, Resilienz und Commander-Abhängigkeit bewerten.

7. Stärken und Schwächen des Decks bestimmen.

8. Win Conditions und Combo-Linien vollständig bestimmen.

9. `brains/bracket/templates.md` für Bracket und Game Changers verwenden.

---

## Legalitätsprüfung

Die Legalitätsprüfung ist verpflichtend.

Sie wird jedoch nicht standardmäßig als eigener Abschnitt in
`analysis.md` ausgegeben.

Geprüft werden:

- Commander-Legalität
- Multi-Commander-Legalität
- Deckgröße
- Singleton
- Color Identity
- Commander-Banlist

Wenn das Deck vollständig regelkonform ist, wird kein zusätzlicher
Legalitätsabschnitt erzeugt.

Nur wenn ein tatsächliches Problem oder eine für das Ergebnis relevante
Unsicherheit besteht, soll dies kurz in der Analyse genannt werden.

---

## Combo-Prüfung

Combo-Linien müssen weiterhin vollständig geprüft werden, auch wenn sie
nicht in `analysis.md` ausgegeben werden.

Dabei ausdrücklich prüfen:

- Zwei-Karten-Kombos
- Drei-Karten-Kombos
- mehrteilige Kombos mit vier oder mehr Karten
- Commander-gestützte Kombos
- Infinite Loops
- beliebig oft wiederholbare Loops
- Mana-Loops
- Damage- oder Lifedrain-Loops
- Draw- oder Mill-Loops
- Token- oder Counter-Loops
- Extra-Turn-Loops
- deterministische Win-Lines

Eine Combo darf nicht nur deshalb übersehen werden, weil sie aus mehr
als zwei Karten besteht.

Für erkannte Combo-Linien sollen soweit relevant bestimmt werden:

- beteiligte Karten
- benötigter Boardstate
- benötigtes Mana
- Rolle des Commanders
- Ergebnis
- Infinite oder wiederholbar
- Interaktionspunkte
- Zuverlässigkeit im Deck

Regelabhängige Combo-Linien müssen gemäß

`brains/rules/magic-rules.md`

verifiziert werden.

Die ausführliche Ausgabe von Win Conditions und Combos gehört nicht in
`analysis.md`.

---

## Bracket-Format

Wenn das geschätzte Bracket in einer Analyse ausgegeben wird, muss immer
dieses Format verwendet werden:

```text
Geschätztes Bracket: X – Name
```

Erlaubte Werte:

```text
Geschätztes Bracket: 1 – Exhibition
Geschätztes Bracket: 2 – Core
Geschätztes Bracket: 3 – Upgraded
Geschätztes Bracket: 4 – Optimized
Geschätztes Bracket: 5 – cEDH
```

Nicht verwenden:

```text
Upper Bracket 3
Lower Bracket 3
Bracket 3+
oberes Bracket 3
unteres Bracket 3
```

Zusätzliche Power-Einschätzungen dürfen die standardisierte
Bracket-Bezeichnung nicht verändern.

Die ausführliche Bracket-Begründung gehört in die dafür vorgesehene
Bracket-Ausgabe.

---

## Rollenbewertung

Karten dürfen mehrere Rollen gleichzeitig erfüllen.

Beispiel:

Eine Karte kann gleichzeitig zählen als:

- Card Advantage
- Targeted Interaction
- Enabler

Sie belegt trotzdem nur einen Deckslot.

Die Analyse soll daher Rollen und Funktion bewerten und nicht versuchen,
jede Karte ausschließlich einer einzigen Kategorie zuzuordnen.

---

# Ausgabeformat

# Deckanalyse: [Deckname]

## Kurzprofil

- Color Identity:
- Hauptstrategie:
- Unterstrategien:
- Geschätztes Bracket: [X] – [Name]

## Kartenpakete

### Ramp

[Kurze Bewertung der Ramp-Struktur und wichtiger Ramp-Karten.]

### Card Advantage

[Kurze Bewertung allgemeiner Card-Advantage-Strukturen und relevanter Engines.]

### Card Draw & Selection

[Kurze Bewertung der konkreten Karten für Kartennachschub und Kartenauswahl.]

Dabei berücksichtigen:

- permanenter Draw
- einmaliger Draw
- Looting / Filtering / Selection
- Impulse Draw
- sonstige Card-Advantage-Engines

### Tutors

[Kurze Bewertung der Tutor-Struktur.]

Dabei berücksichtigen:

- Anzahl der Tutoren
- Suchbereich der einzelnen Tutoren
- Flexibilität der Tutoren
- grob, welche Kartentypen oder Funktionsbereiche sie suchen können

Konkrete Tutor-Ziele und die Frage „Was suche ich wann?“ gehören nicht
in `analysis.md`, sondern in den Gameplan.

### Targeted Interaction

[Kurze Bewertung gezielter Antworten.]

### Mass Interaction

[Kurze Bewertung von Boardwipes und anderer breiter Interaktion.]

### Schutz und Resilienz

[Kurze Bewertung von Schutz, Recursion und Wiederaufbau.]

### Engines

[Zentrale Karten oder Kartenpakete, die dauerhaft Value oder den
Spielplan antreiben.]

### Enabler

[Karten, die den Hauptspielplan ermöglichen oder vorbereiten.]

### Payoffs

[Karten, die den Hauptspielplan belohnen oder stark skalieren.]

## Stärken

- ...
- ...
- ...

## Schwächen und Risiken

- ...
- ...
- ...

---

## Ausgabeprinzipien

Die Analyse soll kompakt und sachlich bleiben.

Sie soll nicht erneut Informationen ausführlich erklären, die in anderen
Dateien besser aufgehoben sind.

Nicht standardmäßig als eigene Abschnitte in `analysis.md` ausgeben:

- Commander
- Deckbuilding-Modus
- ausführlicher Legalitäts- und Regelcheck
- Deckgrößen-Zusammenfassung
- Collection-Zusammenfassung
- erwarteter Siegzug
- Spielplan
- Early Game
- Mid Game
- Late Game
- Win Conditions
- Combo-Linien
- ausführliche Bracket-Einschätzung
- Bracket-Empfehlungen
- Rule-0-Hinweis
- Unsicherheiten als eigener Standardabschnitt

Wenn einer dieser Punkte ein tatsächliches Problem oder eine wichtige
Besonderheit des Decks darstellt, darf er kurz in einem passenden
Analyseabschnitt erwähnt werden.

---

## Speichern

Nach Nutzerbestätigung wird ausschließlich die Deckanalyse unter

```text
data/decks/saved/[deck-slug]/analysis.md
```

gespeichert.

Bracket, Gameplan und Rule 0 werden durch ihre jeweils zuständigen
Brains bzw. Ausgabeformate erzeugt und separat gespeichert.

Ohne Nutzerbestätigung werden keine Dateien verändert.