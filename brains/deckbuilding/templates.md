# Deckbuilding

## Regelbasis

Alle Deckbauentscheidungen müssen die Vorgaben aus

`brains/rules/magic-rules.md`

beachten.

Insbesondere müssen geprüft werden:

- Commander-Legalität
- Color Identity
- Multi-Commander-Regeln
- Deckgröße
- Singleton-Regel
- Commander-Banlist
- regelabhängige Karteninteraktionen

---

## Aufgabe

Dieses Brain steuert das Erstellen und Überarbeiten von
Commander-/EDH-Decks.

Es dient dazu:

- neue Decks zu erstellen
- bestehende Decks umzubauen
- Varianten vorhandener Decks zu erstellen
- den passenden Deckbuilding-Workflow auszuwählen
- das passende strukturelle Deckbuilding-Template auszuwählen
- gemeinsame Qualitäts-, Daten- und Ausgaberegeln für alle Workflows bereitzustellen

Die eigentliche Kartenauswahl erfolgt über einen Workflow unter:

`brains/deckbuilding/workflows/`

---

# Deckbuilding-Modi

Es gibt zwei Deckbuilding-Modi:

1. Guided Deckbuilding
2. Automatischer Deckbau

## Guided Deckbuilding

Guided Deckbuilding ist der Standardmodus.

Wenn der Nutzer ein neues Deck erstellen oder ein bestehendes Deck
grundlegend neu aufbauen möchte und keinen anderen Modus ausdrücklich
verlangt, verwende:

`brains/deckbuilding/workflows/guided-selection.md`

Der Guided-Workflow führt den Deckbau schrittweise gemeinsam mit dem
Nutzer durch.

Die Karten werden Kategorie für Kategorie vorgeschlagen und vom Nutzer
bestätigt oder angepasst.

## Automatischer Deckbau

Der automatische Deckbau ist ein ausdrücklich gewählter Sondermodus.

Er wird nur verwendet, wenn der Nutzer klar verlangt, dass das Deck
vollständig oder weitgehend automatisch erstellt werden soll.

Verwende dann:

`brains/deckbuilding/workflows/automatic.md`

Wenn nicht eindeutig erkennbar ist, dass der Nutzer den automatischen
Modus möchte, wird Guided Deckbuilding verwendet.

---

# Zu berücksichtigende Quellen

Beim Deckbau sollen abhängig vom Auftrag berücksichtigt werden:

- vorhandene Decklisten aus `data/decks/`
- Collection-Daten aus `data/collection.json`
- Bracket-Regeln aus `brains/bracket/templates.md`
- Regelbasis aus `brains/rules/magic-rules.md`
- Projektphilosophie aus `brains/project/philosophy.md`
- passende Deckbuilding-Templates aus `brains/deckbuilding/templates/`
- Deckbuilding-Staples aus `brains/deckbuilding/reference/staples.md`
- aktuelle Commander-/Theme-Daten von EDHREC
- aktuelle vergleichbare Decklisten und Deckdaten, wenn sie für den Auftrag sinnvoll sind
- konkrete Constraints des Nutzers

Weitere Brains können verwendet werden, wenn sie für den Auftrag erforderlich sind.

---

# Externe Deckdaten und Synergie

Die Kartenauswahl soll nicht nur aus allgemeinem Kartenwissen oder der
Collection erfolgen.

Wenn aktuelle externe Daten verfügbar sind, soll vor und während des
Deckbaus geprüft werden, welche Karten in Decks mit demselben Commander,
derselben Strategie oder einem vergleichbaren Thema tatsächlich gespielt
werden.

Bevorzugte Signale:

- EDHREC Commander-Daten
- EDHREC Theme-/Tag-Daten
- EDHREC Synergy
- EDHREC Inclusion Rate
- EDHREC High-Synergy-Karten
- EDHREC Average-Deck-/vergleichbare Deckdaten
- aktuelle vergleichbare Decklisten auf geeigneten Deckplattformen
- vorhandene lokale Decks mit ähnlicher Strategie, wenn relevant

Community-Daten sind ein Auswahl- und Vergleichssignal.

Sie ersetzen nicht:

- Magic-Regeln
- Color Identity
- Banlist
- Bracket-Regeln
- konkrete Nutzer-Constraints

EDHREC-Synergy-, Inclusion- oder ähnliche Prozentwerte dürfen nur
ausgegeben werden, wenn sie für die konkrete Karte aus einer aktuellen
Quelle tatsächlich ermittelt wurden.

Wenn kein verlässlicher Wert vorliegt, qualitativ formulieren, z. B.:

- sehr hohe Synergie
- hohe Synergie
- gute Synergie
- situative Synergie

Keine erfundenen Prozentwerte ausgeben.

---

# Auswahlpriorität

Die Auswahl einer Karte soll grundsätzlich in dieser Reihenfolge bewertet
werden:

1. Legalität und Color Identity
2. konkrete Nutzer-Constraints
3. benötigte Rolle im Deck
4. Synergie mit Commander und Hauptstrategie
5. aktuelle EDHREC-/vergleichbare Deckdaten
6. Multi-Role-Nutzen
7. Mana Curve und Farbbedarf
8. Ziel-Bracket und gewünschtes Spielerlebnis
9. Collection und Budget entsprechend dem aktiven Workflow

Die Collection ist ein wichtiges Constraint, aber nicht automatisch ein
Qualitätssignal.

Bei Collection-first wird zunächst auf legale und passende Karten aus der
Collection gefiltert und innerhalb dieser Kandidaten nach Synergie,
Rollenfit und Deckdaten priorisiert.

---

# Kartenlinks und Anzeige im Chat

Konkrete Kartenempfehlungen sollen im Chat nach Möglichkeit direkt
anklickbar sein.

Bevorzugtes Ziel ist die konkrete Scryfall-Kartenseite.

Wenn eine konkrete Karten-URI ermittelt wurde, soll diese verwendet
werden.

Kartenlinks dürfen nicht zu einer anderen Karte oder einem geratenen
Printing führen.

Bei Vorschlägen soll direkt hinter der Karte stehen:

- `Collection`, wenn die Karte in `data/collection.json` vorhanden ist
- ein aktueller ungefährer Europreis, wenn die Karte nicht vorhanden ist

Beispiele:

```text
[Explore] — Collection
[Nature's Lore] — ca. 2,50 €
```

Für Collection-Karten muss nicht zusätzlich ein Preis angezeigt werden.

Für externe Karten darf kein Preis erfunden werden.

---

# Standard-Bracket

Wenn der Nutzer beim Erstellen oder Überarbeiten eines Decks kein
Ziel-Bracket angibt, wird standardmäßig verwendet:

**Bracket 3: Upgraded / Aufgewertet**

Die genaue Bewertung erfolgt anhand von:

`brains/bracket/templates.md`

Wenn der Nutzer später ein anderes Ziel-Bracket nennt, überschreibt diese
Angabe den Standardwert.

---

# Mögliche Nutzer-Constraints

Ein Deckbau-Auftrag kann unter anderem diese Vorgaben enthalten:

- Commander
- mehrere Commander
- Ziel-Bracket
- Budget
- Thema
- Mechanik
- Strategie
- Artwork- oder Flavor-Vorgaben
- Collection-first
- ausschließlich Collection
- maximale Anzahl neuer Karten
- maximales Budget pro neuer Karte
- Karten, die vermieden werden sollen
- Karten, die enthalten sein müssen
- bestehende Decks, von denen sich das neue Deck unterscheiden soll
- gewünschter Spielstil
- gewünschte Power-Anpassung
- gewünschter Deckbuilding-Modus
- ausdrücklich gewünschtes Deckbuilding-Template

Explizite Nutzer-Constraints haben Vorrang vor Standardwerten, solange
sie regelkonform und miteinander vereinbar sind.

Konflikte müssen klar benannt werden.

---

# Deckbuilding-Template auswählen

Vor der eigentlichen Kartenauswahl muss ein passendes strukturelles
Deckbuilding-Template aus

`brains/deckbuilding/templates/`

bestimmt werden.

## Auswahlpriorität

1. vom Nutzer ausdrücklich genanntes Template
2. vorhandenes Template für eine ausdrücklich genannte Strategie oder ein Deckthema
3. `standard-100.md`

Wenn kein passendes spezialisiertes Template vorhanden ist, verwende:

`brains/deckbuilding/templates/standard-100.md`

Ein Dateiname darf nicht allein aus einem Strategienamen erfunden werden.

Das gewählte Deckbuilding-Template bestimmt die strukturellen Zielwerte,
z. B.:

- Länder
- Ramp
- Card Advantage
- Targeted Interaction
- Mass Interaction
- Plan Cards
- besondere strategische Rollen
- spezielle Anforderungen der Strategie

---

# Multi-Role-Karten

Eine Karte kann mehrere Rollen gleichzeitig erfüllen.

Beispiel:

`Loran of the Third Path`

kann gleichzeitig relevant sein als:

- Card Advantage
- Targeted Interaction

Eine solche Karte:

- darf in mehreren Rollen angerechnet werden
- belegt trotzdem nur einen Deckslot
- darf zusätzlich eine Plan-Rolle erfüllen

---

# Collection

Wenn die Collection für den Auftrag relevant ist, verwende:

`data/collection.json`

Bei Collection-first sollen vorhandene Karten bevorzugt werden.

"Bevorzugt" bedeutet nicht, dass schwächere oder deutlich schlechter
passende Karten automatisch höher bewertet werden als starke
synergistische Optionen.

---

# Basic Lands

Basic Lands gelten als automatisch verfügbar.

Daher gilt:

- Basic Lands müssen nicht in `data/collection.json` vorhanden sein.
- Basic Lands zählen nicht als fehlende Karten.
- Basic Lands zählen nicht als neue Käufe.
- Basic Lands zählen nicht gegen ein Zusatzbudget.
- Basic Lands dürfen verwendet werden, wenn sie zur Color Identity passen.

Als Basic Lands gelten:

```text
Plains
Island
Swamp
Mountain
Forest
Wastes
```

---

# Staple-Referenz

Für etablierte Basisoptionen verwende:

`brains/deckbuilding/reference/staples.md`

Eine Karte in dieser Referenz ist kein Auto-Include.

Staples müssen weiterhin gegen folgende Punkte geprüft werden:

- Color Identity
- Bracket
- Synergie
- Strategie
- Mana Curve
- Nutzer-Constraints
- bereits vorhandene bessere Rollenabdeckung

---

# Game Changers

Die aktuelle Game-Changer-Liste liegt unter:

`data/reference/commander/game-changers.json`

Game Changers müssen gegen diese aktuelle Referenz geprüft werden.

Die Liste darf nicht aus Modellwissen oder älteren Brain-Inhalten
rekonstruiert werden.

Die Bracket-Bewertung erfolgt anhand von:

`brains/bracket/templates.md`

---

# Commander-Banlist

Die aktuelle strukturierte Commander-Banlist liegt unter:

`data/reference/commander/banned.json`

Für Decklegalitätsprüfungen soll diese lokale Referenz zusammen mit

`brains/rules/magic-rules.md`

verwendet werden.

---

# Combo- und Win-Condition-Prüfung

Jedes fertig gebaute Deck muss auf relevante Win Conditions und
Combo-Linien geprüft werden.

Dabei müssen unabhängig von der Anzahl der benötigten Karten
berücksichtigt werden:

- Zwei-Karten-Kombos
- Drei-Karten-Kombos
- mehrteilige Kombos
- Commander-gestützte Kombos
- Infinite Loops
- beliebig oft wiederholbare Loops
- deterministische Win-Lines

Für die genaue Analyse verwende:

`brains/deck-analysis/templates.md`

Regelabhängige Interaktionen müssen anhand von

`brains/rules/magic-rules.md`

verifiziert werden.

---

# Finisher-, Wincon-, Combo- und Game-Changer-Pass

Bevor die endgültige Manabase gebaut wird, muss das bisherige Spell-Paket
gezielt darauf geprüft werden, ob das Deck tatsächlich schließen und
gewinnen kann.

Zu prüfen sind:

- explizite Finisher
- primäre und sekundäre Win Conditions
- Combat-Finisher
- alternative Win Conditions
- Zwei-, Drei- und mehrteilige Combos
- Commander-gestützte Combos
- vorhandene oder passende Game Changers
- Karten, die durch stärkere oder synergistischere Finisher ersetzt werden könnten

Wenn eine sinnvolle Verbesserung erkennbar ist, sollen konkrete
Austauschvorschläge gemacht werden.

Im Guided-Workflow muss der Nutzer diese Änderungen bestätigen.

Im Automatic-Workflow dürfen die Änderungen innerhalb der bestehenden
Constraints automatisch in den Entwurf übernommen werden.

---

# Länder erst nach dem Spell-Paket

Sofern ein spezialisiertes Template nicht ausdrücklich einen anderen
Ablauf verlangt, wird die endgültige Länderauswahl erst vorgenommen,
nachdem Ramp, Card Advantage, Interaction, Plan Cards und der
Finisher-/Wincon-/Combo-Pass feststehen.

Dadurch können berücksichtigt werden:

- tatsächliche farbige Manaanforderungen
- Mana Curve
- Anzahl und Art der Ramp-Karten
- Utility-Lands
- Land-Synergien
- MDFCs
- Farbpips der endgültig gewählten Spells

Die Zielzahl für Länder stammt weiterhin aus dem aktiven
Deckbuilding-Template.

---

# Gemeinsame Abschlussprüfung

Nach der Länderauswahl muss das vollständige Deck noch einmal gegen das
aktive Deckbuilding-Template und alle gemeinsamen Regeln geprüft werden.

Zu prüfen sind insbesondere:

- Commander-Legalität
- Color Identity
- Deckgröße
- Singleton-Regel
- Banlist
- Mana Base und Farbquellen
- Mana Curve
- Ramp-Abdeckung
- Card-Advantage-Abdeckung
- Targeted-Interaction-Abdeckung
- Mass-Interaction-Abdeckung
- Enabler
- Payoffs
- Enhancer
- Finisher
- Win Conditions
- Combo-Linien
- Game Changers
- Ziel-Bracket
- Nutzer-Constraints
- fehlende oder nicht vorhandene Karten

Wenn Lücken, unnötige Redundanz oder schwache Slots erkannt werden,
sollen konkrete Verbesserungen und passende Alternativen vorgeschlagen
werden.

Dabei sollen zuerst bereits vorgemerkte Karten aus dem Maybe Board
geprüft werden.

---

# Maybe Board

Während eines Deckbaus können Karten vorgemerkt werden, die aktuell nicht
in die Hauptliste aufgenommen werden, aber später für Swaps,
Finisher-Anpassungen oder den Abschlusscheck relevant sein könnten.

Das Maybe Board:

- zählt nicht zur Deckgröße
- zählt nicht zur Rollenabdeckung
- kann Karten aus der Collection und externe Karten enthalten
- soll bei späteren Austauschvorschlägen zuerst geprüft werden
- soll bei Abschluss des Deckbaus separat ausgegeben werden, wenn es nicht leer ist

---

# Rule 0

Wenn vorhanden, soll für die abschließende Tischkommunikation verwendet
werden:

`brains/rule-zero/templates.md`

Die Rule-0-Zusammenfassung basiert auf der fertigen Deckanalyse.

---

# Finales Ausgabeformat

Unabhängig davon, ob Guided oder Automatic verwendet wurde, soll ein
fertiges Deck im gleichen Abschlussformat ausgegeben werden.

# Deckvorschlag: [Deckname]

## Ziel

[Was soll das Deck tun?]

## Constraints

- Commander:
- Ziel-Bracket:
- Deckbuilding-Modus:
- Template:
- Budget:
- Thema:
- Mechanik:
- Collection-Nutzung:
- Besondere Vorgaben:

## Deckkonzept

[Kurze Beschreibung der Deckidee.]

## Deckliste

[Vollständige Deckliste.]

## Rollenabdeckung

- Länder:
- Ramp:
- Card Advantage:
- Targeted Interaction:
- Mass Interaction:
- Enabler:
- Payoffs:
- Enhancer:

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

### Card Advantage
- ...

### Targeted Interaction
- ...

### Mass Interaction
- ...

### Engines und Enabler
- ...

### Payoffs
- ...

### Enhancer
- ...

### Finisher und Win Conditions
- ...

## Combo-Linien

Für jede relevante erkannte Combo:

- beteiligte Karten:
- Commander beteiligt:
- Typ:
- Voraussetzungen:
- Ergebnis:
- Interaktionspunkte:
- Regelcheck:

## Game Changer Check

Anzahl Game Changers:
- ...

Gefundene Game Changers:
- ...

Auswirkung auf das Ziel-Bracket:
- ...

## Collection und neue Karten

Kompaktes Format:

```text
[Kartenname] — Collection
[Kartenname] — ca. X,XX €
```

## Maybe Board

[Wenn vorhanden: vorgemerkte Karten mit kurzem Grund.]

## Abschlussprüfung

- Deckgröße:
- Commander-Legalität:
- Color Identity:
- Singleton:
- Banlist:
- Mana Base / Farbquellen:
- Mana Curve:
- Template-Abdeckung:
- Ziel-Bracket:
- Game Changers:
- Combo-Linien:
- fehlende Karten:

## Empfohlene letzte Änderungen

[Wenn sinnvoll: konkrete Raus/Rein-Vorschläge mit Alternativen.]

## Rule 0

[Kurze Rule-0-/Tischkommunikation.]

## Speichern

Soll diese Version gespeichert werden?

---

# Speichern

Ein neu gebautes oder überarbeitetes Deck ist zunächst ein Arbeitsstand.

Es wird erst gespeichert oder als bestehende Hauptversion ersetzt, wenn
der Nutzer dies bestätigt.

Für Versionierung und Speicherung gelten die Regeln aus:

`brains/deck-versioning/templates.md`
