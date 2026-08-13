# Automatic Deckbuilding

## Zweck

Dieser Workflow erstellt ein Commander-/EDH-Deck weitgehend oder
vollständig automatisch.

Er ist nicht der Standardmodus.

Er wird nur verwendet, wenn der Nutzer ausdrücklich einen automatischen
Deckbau ohne schrittweise Kartenbestätigung verlangt.

Alle gemeinsamen Deckbuilding-Regeln werden aus

`brains/deckbuilding/templates.md`

übernommen.

Der Automatic-Workflow verwendet dieselben Auswahl- und Qualitätsregeln
wie Guided Deckbuilding, aber ohne Bestätigungsstopps.

---

# 1. Vorbereitung

Vor der Kartenauswahl müssen bestimmt oder geladen werden:

- Commander
- gegebenenfalls mehrere Commander
- Color Identity
- Nutzer-Constraints
- Ziel-Bracket
- gewünschte Strategie
- mögliche Unterstrategien
- passendes Deckbuilding-Template
- Collection, wenn relevant
- `brains/deckbuilding/reference/staples.md`
- aktuelle EDHREC-/vergleichbare Deckdaten, soweit verfügbar

---

# 2. Template auswählen

Das passende strukturelle Deckbuilding-Template wird anhand der Regeln aus

`brains/deckbuilding/templates.md`

ausgewählt.

Wenn kein spezialisiertes Template vorhanden ist, verwende:

`brains/deckbuilding/templates/standard-100.md`

---

# 3. Commander-/Strategie-Research

Vor dem eigentlichen Deckbau sollen aktuelle Synergie- und Deckdaten
geprüft werden.

Wenn verfügbar:

- EDHREC Commander-Daten
- Themes/Tags
- Synergy
- Inclusion Rates
- High-Synergy-Karten
- Average-Deck-/vergleichbare Deckdaten
- vergleichbare aktuelle Decklisten
- relevante lokale Decks mit ähnlicher Richtung

Diese Daten sind Auswahlhilfe und ersetzen keine Regeln oder
Nutzer-Constraints.

---

# 4. Auswahlprinzip

Der Automatic-Workflow folgt derselben Qualitätspriorität aus

`brains/deckbuilding/templates.md`

wie Guided Deckbuilding.

Bei Collection-first werden zunächst passende Collection-Kandidaten
priorisiert.

Wenn externe Karten erlaubt sind, können bessere synergistische Karten
innerhalb der Nutzer- und Budget-Constraints automatisch gewählt werden.

Karten sollen im finalen Ergebnis nach Möglichkeit verlinkt und mit
Collection-/Preisinformation versehen werden.

---

# 5. Reihenfolge

Sofern das aktive Template nichts anderes verlangt:

1. Ramp
2. Card Advantage
3. Targeted Interaction
4. Mass Interaction
5. Enabler
6. Payoffs
7. Enhancer
8. Finisher / Win Conditions / Combos / Game Changers
9. Länder
10. finaler Template- und Qualitätscheck

Es gibt keine Nutzerstopps zwischen diesen Schritten.

---

# 6. Ramp

Ramp wird entsprechend dem aktiven Template ausgewählt.

Zusätzlich werden die Ramp-Kandidaten aus

`brains/deckbuilding/reference/staples.md`

geprüft.

Staples sind keine Auto-Includes.

Sie werden nur verwendet, wenn sie gegenüber synergistischeren Optionen
sinnvoll sind.

---

# 7. Card Advantage

Card Advantage wird entsprechend dem aktiven Template ausgewählt.

Bereits vorhandene Multi-Role-Karten werden angerechnet.

Cantrips zählen nicht automatisch als vollständiger Card-Advantage-Slot.

Synergistische Engines aus EDHREC-/vergleichbaren Deckdaten sollen
gegen generische Optionen abgewogen werden.

---

# 8. Targeted Interaction

Targeted Interaction wird entsprechend dem aktiven Template ausgewählt.

Flexible Multi-Role-Karten sollen besonders berücksichtigt werden, wenn
sie zur Strategie passen.

---

# 9. Mass Interaction

Mass Interaction wird entsprechend dem aktiven Template ausgewählt.

Die Auswahl soll das eigene Board und die Strategie berücksichtigen.

---

# 10. Plan Cards

Plan Cards werden nicht einfach zusätzlich auf die anderen Kategorien
addiert.

Bereits ausgewählte Karten können zugleich Enabler, Payoff oder Enhancer
sein.

Restliche Slots werden anhand der fehlenden strategischen Rollen gefüllt.

## Reihenfolge

1. Enabler
2. Payoffs
3. Enhancer

Die Verteilung richtet sich nach:

- Commander
- Strategie
- aktivem Template
- EDHREC-/vergleichbaren Deckdaten
- vorhandenen Engines
- Redundanz
- Win Conditions
- noch freien Slots

---

# 11. Finisher-, Wincon-, Combo- und Game-Changer-Pass

Vor der Manabase wird das bisherige Spell-Paket gezielt geprüft auf:

- Finisher
- primäre Win Conditions
- sekundäre Win Conditions
- Combat-Finisher
- alternative Win Conditions
- Zwei-, Drei- und mehrteilige Combos
- Commander-gestützte Combos
- Infinite Loops
- deterministische Win-Lines
- passende Game Changers innerhalb des Ziel-Brackets

EDHREC-/vergleichbare Deckdaten werden erneut auf typische und
synergistische Finisher geprüft.

Wenn ein schwacher Slot durch eine bessere Option ersetzt werden kann,
darf der Automatic-Workflow den Swap innerhalb der Nutzer-Constraints
vornehmen.

Relevante verworfene Alternativen können im Maybe Board festgehalten
werden.

---

# 12. Länder zuletzt

Die endgültige Manabase wird erst nach dem Spell-Paket und dem
Finisher-Pass gebaut.

Zu berücksichtigen sind:

- tatsächliche Farbpips
- Mana Curve
- Commander
- Ramp-Dichte
- Utility Lands
- MDFCs
- Land-Synergien
- erforderliche Farbquellen

Die Landzahl stammt aus dem aktiven Template.

---

# 13. Maybe Board

Auch der Automatic-Workflow kann ein Maybe Board führen.

Darin können starke Alternativen festgehalten werden, die wegen Slot-,
Budget-, Bracket- oder Rollenentscheidungen nicht in die Hauptliste
aufgenommen wurden.

Das Maybe Board zählt nicht zur Deckgröße.

Beim finalen Qualitätscheck wird es zuerst als Swap-Pool geprüft.

---

# 14. Finaler Template- und Qualitätscheck

Nach der Manabase wird das vollständige Deck anhand von

`brains/deckbuilding/templates.md`

und dem aktiven Template geprüft.

Zu prüfen sind:

- Deckgröße
- Legalität
- Color Identity
- Singleton
- Banlist
- Länder
- Farbquellen
- Mana Curve
- Ramp
- Card Advantage
- Targeted Interaction
- Mass Interaction
- Enabler
- Payoffs
- Enhancer
- Finisher
- Win Conditions
- Combo-Linien
- Game Changers
- Ziel-Bracket
- Nutzer-Constraints
- schwache oder redundante Slots

Wenn sinnvolle Verbesserungen erkannt werden, darf der Automatic-Workflow
diese innerhalb der Constraints direkt anwenden.

Zuerst sollen passende Maybe-Board-Kandidaten geprüft werden.

---

# 15. Finale Ausgabe

Das finale Ergebnis verwendet ausschließlich das gemeinsame Ausgabeformat
aus:

`brains/deckbuilding/templates.md`

Karten sollen nach Möglichkeit verlinkt werden.

Collection-Karten werden als `Collection` markiert.

Externe Karten erhalten einen aktuellen ungefähren Preis, wenn dieser
verlässlich ermittelt werden konnte.

---

# 16. Speichern

Der automatisch erzeugte Deckvorschlag ist zunächst ein Arbeitsstand.

Er wird erst gespeichert oder als bestehende Hauptversion ersetzt, wenn
der Nutzer dies bestätigt.

Für Speicherung und Versionierung gelten die gemeinsamen Projektregeln aus

`brains/deck-versioning/templates.md`
