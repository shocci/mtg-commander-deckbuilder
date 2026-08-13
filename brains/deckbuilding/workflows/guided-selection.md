# Guided Deckbuilding Selection

## Zweck

Dieser Workflow beschreibt den schrittweisen, geführten Deckbau eines Commander-/EDH-Decks.

Guided Deckbuilding ist der Standardmodus.

Die gemeinsamen Deckbuilding-Regeln werden aus

`brains/deckbuilding/templates.md`

übernommen.

Der Guided-Workflow bestimmt nur, wie die Kartenauswahl gemeinsam mit dem Nutzer Schritt für Schritt durchgeführt wird.

Er definiert kein eigenes finales Ausgabeformat.

---

# Grundprinzip

Der Guided-Workflow arbeitet Kategorie für Kategorie.

Nach jeder Kategorie wird die Auswahl dem Nutzer gezeigt.

Der Nutzer kann:

- Karten bestätigen
- einzelne Karten ersetzen
- Alternativen wählen
- neue Alternativen verlangen
- Karten ausschließen

Erst nach Bestätigung der aktuellen Kategorie wird mit der nächsten Kategorie fortgefahren.

Es darf nicht automatisch bis zum vollständigen Deck weitergebaut werden, wenn der Nutzer den aktuellen Auswahlblock noch nicht bestätigt hat.

---

# 1. Gemeinsame Regeln laden

Vor Beginn müssen die gemeinsamen Deckbuilding-Regeln aus

`brains/deckbuilding/templates.md`

berücksichtigt werden.

Insbesondere gelten daraus:

- Commander- und Decklegalität
- Standard-Bracket
- Nutzer-Constraints
- Template-Auswahl
- Collection-Regeln
- Basic-Land-Regeln
- Multi-Role-Regeln
- Game-Changer-Prüfung
- Combo- und Win-Condition-Prüfung
- gemeinsame Abschlussprüfung
- gemeinsames finales Ausgabeformat
- Speicherregeln

---

# 2. Template auswählen

Vor Beginn der Kartenauswahl muss gemäß

`brains/deckbuilding/templates.md`

ein passendes strukturelles Deckbuilding-Template aus

`brains/deckbuilding/templates/`

bestimmt werden.

Wenn kein spezialisiertes Template vorhanden oder ausdrücklich gewünscht ist, verwende:

`brains/deckbuilding/templates/standard-100.md`

Das gewählte Template wird zu Beginn genannt.

Es bleibt während des laufenden Guided-Workflows aktiv, solange der Nutzer keinen Template-Wechsel verlangt.

---

# 3. Commander und Strategie bestimmen

Vor der ersten Kartenauswahl müssen bestimmt werden:

- Commander
- gegebenenfalls mehrere Commander
- Color Identity
- Ziel-Bracket
- grundlegende Strategie
- mögliche Unterstrategien
- gewähltes Deckbuilding-Template
- relevante Nutzer-Constraints

Die Legalität des Commanders und der Color Identity muss gemäß

`brains/rules/magic-rules.md`

geprüft werden.

---

# 4. Collection als primäre Kartenquelle

Wenn die Collection für den Auftrag relevant ist, verwende:

`data/collection.json`

Im Guided-Workflow sollen Karten aus der Collection für die Hauptauswahl bevorzugt werden.

Basic Lands gelten gemäß den gemeinsamen Regeln aus

`brains/deckbuilding/templates.md`

als automatisch verfügbar.

---

# 5. Externe Alternativen

Zu jeder Auswahlstufe dürfen zusätzlich Karten vorgeschlagen werden, die nicht in der Collection vorhanden sind.

Für externe Alternativen gilt standardmäßig:

- maximal 5 Euro pro Einzelkarte
- das Preislimit gilt nur für Karten, die nicht in der Collection vorhanden sind
- Karten aus der eigenen Collection unterliegen diesem Preislimit nicht
- der Preis soll aus einer aktuellen und geeigneten Kartenquelle stammen
- wenn kein ausreichend verlässlicher Preis bestimmbar ist, soll die Karte nicht als externe Alternative vorgeschlagen werden

Das Preislimit bezieht sich auf einen üblichen verfügbaren Einzelkartenpreis und nicht auf spezielle Foils, Promos oder besonders seltene Printings.

Wenn der Nutzer ausdrücklich ein anderes Budget nennt, überschreibt dieses das Standardlimit.

---

# 6. Rollen statt exklusiver Kategorien

Die Multi-Role-Regeln aus

`brains/deckbuilding/templates.md`

gelten vollständig.

Eine Karte kann gleichzeitig mehrere Rollen erfüllen.

Beispiel:

`Loran of the Third Path`

kann gleichzeitig zählen als:

- Card Advantage
- Targeted Interaction

Die Karte belegt trotzdem nur einen Deckslot.

Zusätzlich kann dieselbe Karte eine Plan-Rolle erfüllen.

---

# 7. Rollenabdeckung

Nach jeder bestätigten Auswahl muss die aktuelle Rollenabdeckung neu berechnet werden.

Beispiel:

```text
Deckslots: 51 / 100

Länder:                 38 / 38
Ramp:                     7 / 10
Card Advantage:            5 / 12
Targeted Interaction:      4 / 12
Mass Interaction:          1 / 6
```

Eine bereits gewählte Karte kann dazu führen, dass eine spätere Kategorie teilweise oder vollständig abgedeckt ist.

---

# 8. Auswahlreihenfolge

Sofern das gewählte Template keine ausdrücklich andere Reihenfolge vorgibt, wird diese Reihenfolge verwendet:

1. Länder
2. Ramp
3. Card Advantage
4. Targeted Interaction
5. Mass Interaction
6. Plan Cards
    - Enabler
    - Payoffs
    - Enhancer
7. gemeinsame Abschlussprüfung

---

# 9. Auswahlmenge pro Kategorie

Für jede Kategorie wird zuerst der Zielwert aus dem gewählten Template gelesen.

Danach wird geprüft, wie viele Rollenpunkte bereits durch zuvor gewählte Karten erfüllt sind.

Beispiel:

```text
Ramp Ziel: 10
Bereits abgedeckt: 3
Neu benötigt: 7
```

Es werden in diesem Schritt nur noch so viele Hauptkarten vorgeschlagen, wie für die Rollenabdeckung tatsächlich fehlen.

Wenn eine Kategorie bereits vollständig durch Multi-Role-Karten abgedeckt ist, muss dort keine zusätzliche Hauptauswahl erzwungen werden.

Der Workflow zeigt dann die vollständige Abdeckung und fährt nach Bestätigung mit der nächsten Kategorie fort.

---

# 10. Hauptauswahl

Die Hauptauswahl enthält genau so viele Karten, wie für die aktuelle Kategorie noch benötigt werden.

Die Hauptauswahl soll bevorzugt aus der Collection stammen.

Die Auswahl soll nicht nur generisch gute Karten enthalten, sondern zum Commander, zur Strategie und zum gewählten Template passen.

Zu berücksichtigen sind insbesondere:

- Synergie mit dem Commander
- Mana Curve
- bestehende Rollenabdeckung
- Farbanforderungen
- vorhandene Karten
- Redundanz
- Spielplan
- mögliche Multi-Role-Funktion
- Plan-Rollen
- Ziel-Bracket
- Nutzer-Constraints

---

# 11. Genau fünf Alternativen

Zu jeder Auswahlstufe werden zusätzlich genau 5 Alternativen gezeigt.

Die Alternativen zählen zunächst nicht zum Deck.

Sie dürfen sein:

- Karten aus der Collection
- Karten außerhalb der Collection

Für externe Karten gilt das festgelegte Preislimit.

Die fünf Alternativen sollen möglichst unterschiedliche Gründe für einen Tausch bieten.

Beispiele:

- günstigere Mana-Kosten
- stärkere Synergie
- mehr Flexibilität
- zusätzlicher Card Advantage
- zusätzliche Interaction
- bessere Budget-Option
- höhere Resilienz
- zusätzlicher Plan-Card-Nutzen
- bessere Rollenüberschneidung

Es sollen nicht fünf nahezu identische Karten ohne erkennbaren Unterschied vorgeschlagen werden.

---

# 12. Ausgabe einer Auswahlstufe

Jede Kategorie soll ungefähr so dargestellt werden:

```text
Ramp

Template-Ziel: 10
Bereits abgedeckt: 2
Neu benötigt: 8

Hauptauswahl

1. Karte A
   Collection: ja
   Rollen: Ramp

2. Karte B
   Collection: ja
   Rollen: Ramp, Card Advantage

...

8. Karte H
   Collection: ja
   Rollen: Ramp, Enabler

Alternativen

A1. Karte I
    Collection: ja
    Rollen: Ramp, Card Advantage

A2. Karte J
    Collection: nein
    Preis: ca. 3,50 €
    Rollen: Ramp

A3. Karte K
    Collection: ja
    Rollen: Ramp, Enabler

A4. Karte L
    Collection: nein
    Preis: ca. 1,80 €
    Rollen: Ramp, Targeted Interaction

A5. Karte M
    Collection: ja
    Rollen: Ramp
```

Bei besonders relevanten Karten soll kurz erkennbar sein, warum sie vorgeschlagen wurden.

---

# 13. Auf Nutzerauswahl warten

Nach jeder Kategorie wird der Workflow angehalten.

Beispiele für gültige Nutzerantworten:

```text
passt
```

```text
A2 statt Nummer 4
```

```text
Karte 3 raus, gib mir dafür 5 neue Alternativen
```

```text
keine Karten außerhalb meiner Collection
```

Die Auswahl wird entsprechend aktualisiert.

Danach wird die Rollenabdeckung neu berechnet.

Erst anschließend wird die nächste Kategorie begonnen.

---

# 14. Länder

Die Länderzahl wird aus dem gewählten Template übernommen.

Bei der Auswahl sollen berücksichtigt werden:

- Color Identity
- Farbverteilung
- farbige Anforderungen in niedrigen Mana Values
- Utility Lands
- Fetch-/Dual-/Tri-Land-Synergien
- getappte Länder
- Commander-Anforderungen
- Deckstrategie
- Landfall oder andere Land-Synergien
- MDFCs

Basic Lands gelten als verfügbar.

Länder können zusätzlich andere Rollen erfüllen.

Beispiele:

- Ramp
- Card Advantage
- Targeted Interaction
- Enabler

Nach der Länderauswahl wird auf Nutzerbestätigung gewartet.

---

# 15. Ramp

Ramp umfasst Karten, die den verfügbaren Mana-Zugriff sinnvoll erhöhen oder Manaentwicklung beschleunigen.

Dazu können gehören:

- Mana Rocks
- Mana Dorks
- Land Ramp
- Cost Reduction
- Rituals, wenn sie für den konkreten Spielplan relevant sind
- andere wiederholbare Manaquellen

Nicht jede Form von Manaerzeugung muss automatisch als vollständiger Ramp-Slot zählen.

Die Einordnung muss zur Funktion im konkreten Deck passen.

Bereits durch Länder oder andere zuvor gewählte Karten abgedeckte Ramp-Rollen werden angerechnet.

Nach der Ramp-Auswahl wird auf Nutzerbestätigung gewartet.

---

# 16. Card Advantage

Card Advantage umfasst Effekte, die realen oder wiederholbaren Ressourcenvorteil erzeugen.

Dazu können gehören:

- Karten ziehen
- wiederholbare Draw Engines
- Impulse Draw
- relevante Exile-Play-Effekte
- zusätzliche Kartennutzung aus Graveyard oder anderen Zonen
- Commander-basierte Draw Engines

Cantrips zählen nicht automatisch als vollständiger Card-Advantage-Slot.

Bereits gewählte Multi-Role-Karten werden angerechnet.

Nach der Card-Advantage-Auswahl wird auf Nutzerbestätigung gewartet.

---

# 17. Targeted Interaction

Targeted Interaction umfasst gezielte Antworten auf gegnerische Bedrohungen.

Dazu gehören beispielsweise:

- Creature Removal
- Artifact Removal
- Enchantment Removal
- Planeswalker Removal
- Counterspells
- Graveyard Interaction
- flexible Removal-Spells

Karten mit mehreren Modi sind besonders relevant, wenn sie gleichzeitig andere Rollen erfüllen.

Bereits gewählte Multi-Role-Karten werden angerechnet.

Nach der Auswahl wird auf Nutzerbestätigung gewartet.

---

# 18. Mass Interaction

Mass Interaction umfasst Effekte, die mehrere relevante Permanents, Spielerressourcen oder Boardstates gleichzeitig beeinflussen.

Dazu können gehören:

- Boardwipes
- Mass Bounce
- Mass Exile
- asymmetrische Boardwipes
- andere breit wirkende Reset-Effekte

Die Auswahl muss zum eigenen Board und Spielplan passen.

Bereits gewählte Multi-Role-Karten werden angerechnet.

Nach der Auswahl wird auf Nutzerbestätigung gewartet.

---

# 19. Plan Cards

Plan Cards werden nicht als feste zusätzliche Kartenmenge auf die vorherigen Kategorien addiert.

Stattdessen wird nach Abschluss der vorherigen Kategorien geprüft:

- wie viele einzigartige Deckslots bereits belegt sind
- wie viele Deckslots noch frei sind
- welche bereits gewählten Karten schon Plan-Rollen erfüllen
- welche strategischen Rollen noch fehlen

Plan Cards werden hauptsächlich unterteilt in:

## Enabler

Karten, die den zentralen Spielplan ermöglichen oder vorbereiten.

## Payoffs

Karten, die für das Ausführen des Spielplans einen starken Vorteil oder eine Win Condition liefern.

## Enhancer

Karten, die einen bereits funktionierenden Spielplan stärker, konsistenter, schneller oder resilienter machen.

---

# 20. Restliche Deckslots mit Plan Cards füllen

Nach Abschluss von:

- Ländern
- Ramp
- Card Advantage
- Targeted Interaction
- Mass Interaction

werden die bereits belegten einzigartigen Deckslots gezählt.

Die verbleibenden Slots werden mit Plan Cards gefüllt.

Beispiel:

```text
Commander: 1
Bisherige einzigartige Karten: 68

Noch freie Slots:
31
```

Dann werden genau die verbleibenden Slots über:

- Enabler
- Payoffs
- Enhancer

gefüllt.

Bereits vorhandene Plan-Rollen bleiben dabei vollständig angerechnet.

---

# 21. Bereits vorhandene Plan-Rollen berücksichtigen

Vor der Plan-Card-Auswahl muss geprüft werden, welche zuvor gewählten Karten bereits Plan-Rollen erfüllen.

Beispiel:

```text
Bereits vorhandene Plan-Rollen

Enabler: 8
Payoffs: 5
Enhancer: 6
```

Diese Karten bleiben gleichzeitig in ihren anderen Rollen angerechnet.

Eine Karte kann zum Beispiel gleichzeitig sein:

- Ramp
- Enabler

oder:

- Card Advantage
- Payoff

oder:

- Targeted Interaction
- Enhancer

---

# 22. Verteilung von Enabler, Payoff und Enhancer

Die genaue Verteilung wird nicht pauschal fest vorgegeben, sofern das gewählte Deckbuilding-Template keine ausdrücklichen Zielwerte dafür definiert.

Sie richtet sich nach:

- Commander
- Strategie
- gewähltem Template
- bereits ausgewählten Karten
- vorhandenen Engines
- benötigter Redundanz
- Win Conditions
- noch freien Deckslots

Vor Beginn der Plan-Card-Auswahl soll kurz eine vorgeschlagene Verteilung der noch freien Slots gezeigt werden.

Beispiel:

```text
Noch freie Slots: 27

Vorgeschlagene Verteilung der neuen Karten:

Enabler:   9
Payoffs:  11
Enhancer:  7
```

Die Summe darf die verbleibenden Deckslots nicht überschreiten.

---

# 23. Plan-Card-Auswahl schrittweise

Die Plan Cards werden in dieser Reihenfolge ausgewählt:

1. Enabler
2. Payoffs
3. Enhancer

Auch hier gilt für jede Stufe:

- bereits vorhandene Rollen berücksichtigen
- Hauptauswahl entsprechend benötigter neuer Karten
- zusätzlich genau 5 Alternativen
- Collection-Status anzeigen
- bei externen Alternativen Preis anzeigen
- Multi-Role-Funktion anzeigen
- anschließend auf Nutzerbestätigung warten

---

# 24. Deckgröße

Der finale Stand muss Commander-regelkonform sein.

Für ein reguläres Commander-Deck bedeutet das normalerweise:

```text
100 Karten inklusive Commander
```

Bei mehreren legalen Commandern zählen alle Commander zur Deckgröße.

Rollen-Zielwerte dürfen die Anzahl der einzigartigen Karten überschreiten, da Karten mehrere Rollen gleichzeitig erfüllen können.

---

# 25. Übergabe an die gemeinsamen Abschlussregeln

Nachdem alle Kategorien bestätigt wurden, wird der vollständige Deckentwurf an die gemeinsamen Abschlussregeln aus

`brains/deckbuilding/templates.md`

übergeben.

Insbesondere müssen dort durchgeführt werden:

- gemeinsame Abschlussprüfung
- Decklegalitätsprüfung
- Combo- und Win-Condition-Prüfung
- Game-Changer-Prüfung
- Bracket-Bewertung
- Rule-0-Ausgabe, wenn verfügbar
- finales gemeinsames Ausgabeformat

Der Guided-Workflow definiert kein eigenes finales Ausgabeformat.

---

# 26. Speichern

Der Guided-Workflow ist bis zur finalen Nutzerbestätigung ein Arbeitsstand.

Das fertige Deck wird erst gespeichert, nachdem der Nutzer die finale Deckliste bestätigt hat.

Vorher dürfen bestehende Hauptversionen nicht überschrieben werden.

Für Speicherung und Versionierung gelten die gemeinsamen Projektregeln aus

`brains/deck-versioning/templates.md`
