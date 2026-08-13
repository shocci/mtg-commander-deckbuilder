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
- Banlist
- regelabhängige Karteninteraktionen

---

## Aufgabe

Dieses Brain steuert das Erstellen und Überarbeiten von Commander-/EDH-Decks.

Es dient dazu:

- neue Decks zu erstellen
- bestehende Decks umzubauen
- Varianten vorhandener Decks zu erstellen
- den passenden Deckbuilding-Workflow auszuwählen
- das passende strukturelle Deckbuilding-Template auszuwählen

Die eigentliche Kartenauswahl erfolgt über einen Workflow unter:

`brains/deckbuilding/workflows/`

---

# Deckbuilding-Modi

Es gibt zwei Deckbuilding-Modi:

1. Guided Deckbuilding
2. Automatischer Deckbau

## Guided Deckbuilding

Guided Deckbuilding ist der Standardmodus.

Wenn der Nutzer ein neues Deck erstellen oder ein bestehendes Deck grundlegend neu aufbauen möchte und keinen anderen Modus ausdrücklich verlangt, verwende:

`brains/deckbuilding/workflows/guided-selection.md`

Der Guided-Workflow führt den Deckbau schrittweise gemeinsam mit dem Nutzer durch. Die Karten werden Kategorie für Kategorie vorgeschlagen und vom Nutzer bestätigt oder angepasst.

Beispiele:

- "Baue mir ein Deck mit Tidus"
- "Ich möchte ein Landfall-Deck mit Commander X bauen"
- "Lass uns ein neues Deck bauen"
- "Baue mir ein Commander-Deck"
- "Ich möchte Commander X bauen"

Diese Anfragen verwenden standardmäßig Guided Deckbuilding.

## Automatischer Deckbau

Der automatische Deckbau ist ein ausdrücklich gewählter Sondermodus.

Er wird nur verwendet, wenn der Nutzer klar verlangt, dass das Deck vollständig oder weitgehend automatisch erstellt werden soll.

Verwende dann:

`brains/deckbuilding/workflows/automatic.md`

Beispiele:

- "Baue mir automatisch ein Deck mit Tidus"
- "Erstelle direkt eine vollständige Deckliste"
- "Mach das Deck komplett für mich"
- "Baue das Deck ohne Zwischenschritte"
- "Kein Guided Mode"
- "Automatic Deckbuilding"

Wenn nicht eindeutig erkennbar ist, dass der Nutzer den automatischen Modus möchte, wird Guided Deckbuilding verwendet.

---

# Zu berücksichtigende Quellen

Beim Deckbau sollen abhängig vom Auftrag berücksichtigt werden:

- vorhandene Decklisten aus `data/decks/`
- Collection-Daten aus `data/collection.json`
- Bracket-Regeln aus `brains/bracket/templates.md`
- Regelbasis aus `brains/rules/magic-rules.md`
- Projektphilosophie aus `brains/project/philosophy.md`
- passende Deckbuilding-Templates aus `brains/deckbuilding/templates/`
- konkrete Constraints des Nutzers

Weitere Brains können verwendet werden, wenn sie für den Auftrag erforderlich sind.

---

# Standard-Bracket

Wenn der Nutzer beim Erstellen oder Überarbeiten eines Decks kein Ziel-Bracket angibt, wird standardmäßig verwendet:

**Bracket 3: Upgraded / Aufgewertet**

Die genaue Bewertung erfolgt anhand von:

`brains/bracket/templates.md`

Wenn der Nutzer später ein anderes Ziel-Bracket nennt, überschreibt diese Angabe den Standardwert.

Der Deckbuilding-Workflow soll keine eigene abweichende Bracket-Definition erzeugen.

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

Explizite Nutzer-Constraints haben Vorrang vor Standardwerten, solange sie regelkonform und miteinander vereinbar sind. Konflikte müssen klar benannt werden.

---

# Deckbuilding-Template auswählen

Vor der eigentlichen Kartenauswahl muss ein passendes strukturelles Deckbuilding-Template aus

`brains/deckbuilding/templates/`

bestimmt werden.

## Auswahlpriorität

Die Priorität ist:

1. vom Nutzer ausdrücklich genanntes Template
2. vorhandenes Template für eine ausdrücklich genannte Strategie oder ein Deckthema
3. `standard-100.md`

## Standardfall

Wenn kein anderes passendes Template vorhanden oder ausdrücklich gewünscht ist, verwende:

`brains/deckbuilding/templates/standard-100.md`

## Thematische Templates

Wenn der Nutzer eine Strategie oder ein Deckthema nennt und dafür ein passendes Template tatsächlich vorhanden ist, wird dieses verwendet.

Beispiele:

- Landfall → `landfall-100.md`
- Aristocrats → `aristocrats-100.md`
- Spellslinger → `spellslinger-100.md`

Die Beispiele bedeuten nicht, dass diese Dateien zwangsläufig vorhanden sind.

Vor der Verwendung muss geprüft werden, ob das entsprechende Template wirklich existiert. Ein Dateiname darf nicht allein aus einem Strategienamen erfunden werden.

Wenn kein passendes spezialisiertes Template vorhanden ist, verwende:

`standard-100.md`

## Aufgabe des Templates

Das gewählte Deckbuilding-Template bestimmt die strukturellen Zielwerte.

Dazu können insbesondere gehören:

- Länder
- Ramp
- Card Advantage
- Targeted Interaction
- Mass Interaction
- Plan Cards
- besondere strategische Rollen
- spezielle Anforderungen der Strategie

Diese Werte werden vom jeweiligen Workflow verwendet. Der Workflow soll Zielwerte nicht selbst erfinden, wenn sie bereits durch das gewählte Template definiert sind.

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

Die strukturellen Zielwerte eines Templates sind deshalb Rollen-Zielwerte und nicht zwangsläufig die Anzahl unterschiedlicher Karten.

Die genaue Rollenverwaltung erfolgt im jeweils verwendeten Workflow.

---

# Collection

Wenn die Collection für den Auftrag relevant ist, verwende:

`data/collection.json`

Karten aus der Collection sollen entsprechend den Nutzeranforderungen berücksichtigt werden.

Bei Collection-first sollen vorhandene Karten bevorzugt werden.

Der Nutzer darf ausdrücklich festlegen:

- Collection-first
- nur Collection
- Collection nicht relevant
- bestimmte Anzahl neuer Karten
- eigenes Kaufbudget

---

# Basic Lands

Basic Lands gelten als automatisch verfügbar.

Der Nutzer scannt Basic Lands nicht vollständig in ManaBox ein, da davon ausreichend viele vorhanden sind.

Daher gilt:

- Basic Lands müssen nicht in `data/collection.json` vorhanden sein.
- Basic Lands zählen nicht als fehlende Karten.
- Basic Lands zählen nicht als neue Käufe.
- Basic Lands zählen nicht gegen ein Zusatzbudget.
- Basic Lands dürfen verwendet werden, wenn sie zur Color Identity passen.
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

---

# Game Changers

Die aktuelle Game-Changer-Liste liegt unter:

`data/reference/commander/game-changers.json`

Game Changers müssen gegen diese aktuelle Referenz geprüft werden.

Die Liste darf nicht aus Modellwissen oder älteren Brain-Inhalten rekonstruiert werden.

Nach Fertigstellung eines Decks muss geprüft werden:

- welche Game Changers enthalten sind
- wie viele enthalten sind
- ob die Auswahl zum Ziel-Bracket passt

Die Bracket-Bewertung erfolgt anhand von:

`brains/bracket/templates.md`

---

# Commander-Banlist

Die aktuelle strukturierte Commander-Banlist liegt unter:

`data/reference/commander/banned.json`

Für Decklegalitätsprüfungen soll diese lokale Referenz zusammen mit

`brains/rules/magic-rules.md`

verwendet werden.

Die Banlist darf nicht aus Modellwissen oder veralteten Brain-Inhalten
rekonstruiert werden.

---

# Combo- und Win-Condition-Prüfung

Jedes fertig gebaute Deck muss auf relevante Win Conditions und Combo-Linien geprüft werden.

Dabei müssen unabhängig von der Anzahl der benötigten Karten berücksichtigt werden:

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

# Gemeinsame Abschlussprüfung

Unabhängig vom verwendeten Deckbuilding-Modus muss ein fertiger Deckvorschlag abschließend geprüft werden.

Zu prüfen sind insbesondere:

- Commander-Legalität
- Multi-Commander-Legalität
- Color Identity
- Deckgröße
- Singleton-Regel
- Banlist
- Mana Base
- Mana Curve
- Ramp-Abdeckung
- Card-Advantage-Abdeckung
- Targeted-Interaction-Abdeckung
- Mass-Interaction-Abdeckung
- Plan-Card-Abdeckung
- Synergien
- Engines
- Win Conditions
- Combo-Linien
- Game Changers
- Ziel-Bracket
- Nutzer-Constraints
- fehlende oder nicht vorhandene Karten

Wenn eine Prüfung nicht zuverlässig durchgeführt werden kann, muss die Unsicherheit ausdrücklich genannt werden.

---

# Rule 0

Wenn vorhanden, soll für die abschließende Tischkommunikation verwendet werden:

`brains/rule-zero/templates.md`

Die Rule-0-Zusammenfassung basiert auf der fertigen Deckanalyse.

Sie darf keine Eigenschaften behaupten, die nicht geprüft wurden.

Insbesondere dürfen Aussagen wie:

- keine Endloskombo
- keine Tutoren
- kein Fast Mana
- keine Game Changers

nur gemacht werden, wenn diese Punkte tatsächlich geprüft wurden.

---

# Finales Ausgabeformat

Unabhängig davon, ob Guided oder Automatic verwendet wurde, soll ein fertiges Deck im gleichen Abschlussformat ausgegeben werden.

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

Multi-Role-Karten dürfen in mehreren Rollen gezählt werden, belegen aber nur einen Deckslot.

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

### Win Conditions

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

Wenn keine Combo verifiziert wurde, dies entsprechend kennzeichnen.

## Game Changer Check

Anzahl Game Changers:

- ...

Gefundene Game Changers:

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

[Wenn relevant erklären, wie sich das neue Deck von vorhandenen Decks unterscheidet.]

## Konflikte mit Nutzerwunsch

[Falls Vorgaben nicht zusammenpassen, klar benennen.]

## Abschlussprüfung

- Deckgröße:
- Commander-Legalität:
- Color Identity:
- Singleton:
- Banlist:
- Mana Base:
- Ziel-Bracket:
- Game Changers:
- Combo-Linien:
- fehlende Karten:

## Rule 0

[Kurze Rule-0-/Tischkommunikation anhand der fertigen Analyse.]

## Speichern

Soll diese Version gespeichert werden?

---

# Speichern

Ein neu gebautes oder überarbeitetes Deck ist zunächst ein Arbeitsstand.

Es wird erst gespeichert oder als bestehende Hauptversion ersetzt, wenn der Nutzer dies bestätigt.

Für Versionierung und Speicherung gelten die Regeln aus:

`brains/deck-versioning/templates.md`
