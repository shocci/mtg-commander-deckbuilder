# Automatic Deckbuilding

## Zweck

Dieser Workflow erstellt ein Commander-/EDH-Deck weitgehend oder vollständig automatisch.

Er ist nicht der Standardmodus.

Er wird nur verwendet, wenn der Nutzer ausdrücklich einen automatischen Deckbau ohne schrittweise Kartenbestätigung verlangt.

Alle gemeinsamen Deckbuilding-Regeln werden aus

`brains/deckbuilding/templates.md`

übernommen.

Der Automatic-Workflow bestimmt nur, dass die Kartenauswahl ohne Bestätigungsstopps durchgeführt wird.

Er definiert kein eigenes finales Ausgabeformat.

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

# 2. Voraussetzungen bestimmen

Vor der Kartenauswahl müssen bestimmt werden:

- Commander
- gegebenenfalls mehrere Commander
- Color Identity
- Nutzer-Constraints
- Ziel-Bracket
- gewünschte Strategie
- mögliche Unterstrategien
- passendes Deckbuilding-Template

Wenn kein Ziel-Bracket genannt wurde, gilt der Standard aus:

`brains/deckbuilding/templates.md`

---

# 3. Deckbuilding-Template auswählen

Das passende strukturelle Deckbuilding-Template wird anhand der Regeln aus

`brains/deckbuilding/templates.md`

ausgewählt.

Wenn kein spezialisiertes Template vorhanden oder ausdrücklich gewünscht ist, verwende:

`brains/deckbuilding/templates/standard-100.md`

Das gewählte Template bestimmt die Rollen-Zielwerte und gegebenenfalls besondere strategische Anforderungen.

---

# 4. Vorgehen

Der automatische Deckbau verwendet grundsätzlich dieselbe Kategorienlogik wie Guided Deckbuilding, aber ohne Stopps für Nutzerbestätigungen.

Die Standardreihenfolge ist, sofern das gewählte Template nichts anderes vorgibt:

1. Länder auswählen
2. Ramp auswählen
3. Card Advantage auswählen
4. Targeted Interaction auswählen
5. Mass Interaction auswählen
6. restliche Deckslots mit Plan Cards füllen
    - Enabler
    - Payoffs
    - Enhancer
7. fertigen Entwurf an die gemeinsamen Abschlussregeln übergeben

Zwischen diesen Kategorien wird nicht auf eine Nutzerbestätigung gewartet.

---

# 5. Kartenauswahl

Die Karten sollen nicht ausschließlich danach ausgewählt werden, ob sie allgemein stark sind.

Zu berücksichtigen sind insbesondere:

- Commander-Synergie
- Strategie
- gewähltes Deckbuilding-Template
- Ziel-Bracket
- Mana Curve
- Color Requirements
- Redundanz
- Resilienz
- Rollenabdeckung
- Multi-Role-Funktion
- Plan-Rollen
- Collection
- Budget
- Nutzer-Constraints

---

# 6. Rollenabdeckung

Die Rollen-Zielwerte werden aus dem gewählten Deckbuilding-Template übernommen.

Eine Karte kann mehrere Rollen gleichzeitig erfüllen.

Beispiel:

`Loran of the Third Path`

kann gleichzeitig zählen als:

- Card Advantage
- Targeted Interaction

Die Karte belegt trotzdem nur einen Deckslot.

Bereits abgedeckte Rollen müssen bei späteren Kategorien berücksichtigt werden.

Wenn beispielsweise während Ramp bereits Karten gewählt wurden, die zusätzlich Card Advantage liefern, reduziert sich entsprechend der noch offene Bedarf in der Card-Advantage-Kategorie.

Rollen-Zielwerte dürfen deshalb nicht einfach addiert werden, um die Deckgröße zu bestimmen.

---

# 7. Länder

Die Länderzahl wird aus dem gewählten Template übernommen.

Bei der automatischen Auswahl sollen berücksichtigt werden:

- Color Identity
- Farbverteilung
- Farbanforderungen der Spells
- Mana Curve
- Utility Lands
- Fetch-/Dual-/Tri-Land-Synergien
- getappte Länder
- Commander-Anforderungen
- Deckstrategie
- MDFCs
- mögliche zusätzliche Rollen der Länder

Basic Lands gelten gemäß den gemeinsamen Regeln aus

`brains/deckbuilding/templates.md`

als automatisch verfügbar.

---

# 8. Ramp

Ramp wird entsprechend dem Zielwert des gewählten Templates ausgewählt.

Bereits durch Länder oder andere Multi-Role-Karten abgedeckte Ramp-Rollen werden berücksichtigt.

Die Auswahl soll zum Commander und Spielplan passen.

---

# 9. Card Advantage

Card Advantage wird entsprechend dem Zielwert des gewählten Templates ausgewählt.

Bereits gewählte Multi-Role-Karten werden angerechnet.

Cantrips zählen nicht automatisch als vollständiger Card-Advantage-Slot.

---

# 10. Targeted Interaction

Targeted Interaction wird entsprechend dem Zielwert des gewählten Templates ausgewählt.

Bereits gewählte Multi-Role-Karten werden angerechnet.

Flexible Karten mit mehreren relevanten Modi dürfen bevorzugt werden, wenn sie zum Deckplan passen.

---

# 11. Mass Interaction

Mass Interaction wird entsprechend dem Zielwert des gewählten Templates ausgewählt.

Die Auswahl muss zum eigenen Board und Spielplan passen.

Bereits gewählte Multi-Role-Karten werden angerechnet.

---

# 12. Plan Cards

Plan Cards werden nicht automatisch als zusätzliche feste Anzahl von Karten auf die anderen Kategorien addiert.

Stattdessen muss geprüft werden:

- welche bereits ausgewählten Karten Plan-Rollen erfüllen
- wie viele einzigartige Deckslots bereits belegt sind
- welche Plan-Rollen noch fehlen
- wie viele Deckslots noch verfügbar sind

Restliche Slots sollen gezielt mit passenden

- Enablern
- Payoffs
- Enhancern

gefüllt werden.

Die konkrete Verteilung richtet sich nach:

- Commander
- Strategie
- gewähltem Template
- bereits ausgewählten Karten
- vorhandenen Engines
- benötigter Redundanz
- Win Conditions
- noch freien Deckslots

Wenn das gewählte Template ausdrückliche Zielwerte für diese Rollen definiert, haben diese Vorrang.

---

# 13. Collection

Wenn Collection-Nutzung relevant ist, verwende:

`data/collection.json`

Bei Collection-first sollen vorhandene Karten bevorzugt werden.

Für Basic Lands gelten die gemeinsamen Regeln aus:

`brains/deckbuilding/templates.md`

Wenn externe Karten verwendet oder empfohlen werden, gelten die ausdrücklichen Budget- und Kauf-Constraints des Nutzers.

---

# 14. Vollständigen Entwurf erzeugen

Der automatische Workflow baut ohne Zwischenstopps einen vollständigen Deckentwurf.

Dabei muss insbesondere sichergestellt werden:

- korrekte Anzahl einzigartiger Deckslots
- Rollenabdeckung gemäß Template
- sinnvolle Mana Base
- sinnvolle Mana Curve
- ausreichende strategische Dichte
- erkennbare Win Conditions
- Berücksichtigung von Multi-Role-Karten
- Einhaltung der Nutzer-Constraints

Der Automatic-Workflow darf Rollen-Zielwerte nicht als voneinander unabhängige Kartenmengen addieren.

---

# 15. Übergabe an die gemeinsamen Abschlussregeln

Nach Fertigstellung des Deckentwurfs wird dieser an die gemeinsamen Abschlussregeln aus

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

Der Automatic-Workflow definiert kein eigenes finales Ausgabeformat.

---

# 16. Speichern

Der automatisch erzeugte Deckvorschlag ist zunächst ein Arbeitsstand.

Er wird erst gespeichert oder als bestehende Hauptversion ersetzt, wenn der Nutzer dies bestätigt.

Für Speicherung und Versionierung gelten die gemeinsamen Projektregeln aus

`brains/deck-versioning/templates.md`
