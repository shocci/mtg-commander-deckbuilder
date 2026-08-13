# Guided Deckbuilding Selection

## Zweck

Dieser Workflow beschreibt den schrittweisen, geführten Deckbau eines
Commander-/EDH-Decks.

Guided Deckbuilding ist der Standardmodus.

Die gemeinsamen Deckbuilding-Regeln werden aus

`brains/deckbuilding/templates.md`

übernommen.

Der Guided-Workflow bestimmt, wie die Kartenauswahl gemeinsam mit dem
Nutzer Schritt für Schritt durchgeführt wird.

Das finale Ausgabeformat stammt aus `brains/deckbuilding/templates.md`.

---

# Grundprinzip

Der Guided-Workflow arbeitet Abschnitt für Abschnitt.

Nach jedem Auswahlabschnitt wird gestoppt und auf die Entscheidung des
Nutzers gewartet.

Der Nutzer kann:

- Karten bestätigen
- einzelne Karten ersetzen
- Alternativen wählen
- neue Alternativen verlangen
- Karten ausschließen
- Karten ins Maybe Board verschieben
- Karten aus dem Maybe Board zurückholen

Erst nach Bestätigung des aktuellen Abschnitts wird weitergebaut.

---

# 1. Vorbereitung

Vor der ersten Kartenauswahl müssen bestimmt oder geladen werden:

- Commander
- gegebenenfalls mehrere Commander
- Color Identity
- Ziel-Bracket
- grundlegende Strategie
- mögliche Unterstrategien
- relevante Nutzer-Constraints
- Collection, wenn relevant
- passendes Deckbuilding-Template
- `brains/deckbuilding/reference/staples.md`
- aktuelle EDHREC-/vergleichbare Deckdaten, soweit verfügbar

Die Legalität muss gemäß

`brains/rules/magic-rules.md`

geprüft werden.

---

# 2. Template auswählen

Die Template-Auswahl erfolgt gemäß

`brains/deckbuilding/templates.md`

aus:

`brains/deckbuilding/templates/`

Wenn kein passendes spezialisiertes Template vorhanden ist, verwende:

`brains/deckbuilding/templates/standard-100.md`

Das gewählte Template wird zu Beginn genannt und bleibt aktiv, solange
der Nutzer keinen Wechsel verlangt.

---

# 3. Commander-/Strategie-Research

Bevor Karten vorgeschlagen werden, soll der Commander bzw. die gewählte
Strategie anhand aktueller externer Daten eingeordnet werden.

Wenn verfügbar, prüfe insbesondere:

- EDHREC Commander-Seite
- passende EDHREC Themes/Tags
- High-Synergy-Karten
- Inclusion Rates
- typische Engines
- typische Payoffs
- typische Win Conditions
- vergleichbare Decklisten und Average-Deck-Daten
- lokale Decks mit ähnlicher Richtung, wenn relevant

Ergebnis dieses Schritts ist eine Auswahlbasis für die folgenden
Kategorien.

Nicht automatisch die populärsten Karten übernehmen.

Die Daten sollen helfen, Synergie, Redundanz und bewährte Pakete zu
erkennen.

---

# 4. Hauptauswahl vs. Alternativen

## Hauptauswahl

Wenn Collection-first aktiv ist, soll die Hauptauswahl grundsätzlich aus
der Collection stammen.

Innerhalb der Collection-Kandidaten wird priorisiert nach:

1. Rollenfit
2. Commander-/Strategie-Synergie
3. EDHREC-/vergleichbaren Deckdaten
4. Multi-Role-Nutzen
5. Mana Curve
6. Ziel-Bracket

Die Hauptauswahl enthält genau so viele neue Karten, wie zur aktuellen
Rollenabdeckung noch benötigt werden.

## Alternativen

Zu jedem Auswahlabschnitt werden zusätzlich genau 5 Alternativen gezeigt.

Die Alternativen sollen stärker nach Synergie als nach Collection-Besitz
priorisiert werden.

Priorität:

1. Commander-/Strategie-Synergie
2. EDHREC-/vergleichbare Deckdaten
3. Rollenfit
4. Multi-Role-Nutzen
5. Mana Curve / Resilienz
6. Collection-Status
7. Preislimit

Alternativen dürfen aus der Collection oder extern sein.

Für externe Alternativen gilt standardmäßig:

**maximal 5 Euro pro Einzelkarte**

sofern der Nutzer kein anderes Limit nennt.

---

# 5. Kartenanzeige

Konkrete Karten sollen möglichst direkt auf ihre Scryfall-Seite verlinkt
werden.

Die Besitz-/Preisanzeige erfolgt kompakt:

```text
1. [Karte A] — Collection
2. [Karte B] — ca. 2,40 €
```

Bei Collection-Karten wird kein Preis benötigt.

Bei externen Karten muss ein aktueller verlässlicher Preis vorliegen.

Wenn zusätzlich Synergie-Daten vorliegen, können sie darunter angezeigt
werden:

```text
A1. [Karte A] — ca. 1,80 €
    Rollen: Ramp, Enabler
    EDHREC Synergy: +XX %
    Grund: ...
```

Prozentwerte nur ausgeben, wenn sie tatsächlich aus einer aktuellen
Quelle ermittelt wurden.

---

# 6. Maybe Board

Während des gesamten Workflows wird ein Maybe Board geführt.

Eine Karte kann ins Maybe Board aufgenommen werden, wenn:

- sie eine starke Alternative ist, aber aktuell kein Slot frei ist
- sie vom Nutzer nicht sofort ausgewählt wird, aber später relevant sein könnte
- sie mehrere Rollen erfüllt und für den Abschlusscheck interessant ist
- sie als Finisher, Wincon, Combo-Teil oder Sidegrade später erneut geprüft werden soll

Beispiel:

```text
Maybe Board

- [Karte A] — Collection
  Rollen: Ramp, Enabler
  Grund: guter Swap, falls später Ramp fehlt

- [Karte B] — ca. 1,20 €
  Rollen: Payoff
  Grund: hohe Commander-Synergie
```

Das Maybe Board zählt nicht zur Deckgröße und nicht zur Rollenabdeckung.

---

# 7. Rollenabdeckung

Nach jeder bestätigten Auswahl wird die Rollenabdeckung neu berechnet.

Multi-Role-Karten zählen in allen passenden Rollen, aber nur einmal als
Deckslot.

Beispiel:

```text
Deckslots: 43 / 100

Ramp:                    10 / 10
Card Advantage:           4 / 12
Targeted Interaction:     3 / 12
Mass Interaction:         1 / 6
```

---

# 8. Standardreihenfolge

Sofern das gewählte Template keine ausdrücklich andere Reihenfolge
vorgibt, gilt:

1. Ramp
2. Card Advantage
3. Targeted Interaction
4. Mass Interaction
5. Plan Cards – Enabler
6. Plan Cards – Payoffs
7. Plan Cards – Enhancer
8. Finisher / Win Conditions / Combos / Game Changers
9. Länder
10. Finaler Template- und Qualitätscheck

Das Maybe Board läuft parallel über alle Schritte.

---

# 9. Ramp

Der Ramp-Zielwert wird aus dem gewählten Template gelesen.

Vor der Auswahl müssen die Ramp-Kandidaten aus

`brains/deckbuilding/reference/staples.md`

mitgeprüft werden.

Eine Staple-Karte ist kein Auto-Include.

Es muss geprüft werden, ob sie:

- legal ist
- zum Bracket passt
- zur Strategie passt
- gegenüber synergistischeren Optionen sinnvoll ist

Bereits durch Multi-Role-Karten abgedeckte Ramp-Rollen werden angerechnet.

Danach:

- Hauptauswahl anzeigen
- genau 5 Alternativen anzeigen
- Maybe-Board-Kandidaten markieren
- auf Nutzerbestätigung warten

---

# 10. Card Advantage

Der Zielwert wird aus dem aktiven Template gelesen.

Bereits vorhandene Multi-Role-Karten werden angerechnet.

Bevorzugt werden Karten, die:

- echten oder wiederholbaren Kartenvorteil erzeugen
- zur Commander-Strategie passen
- über EDHREC oder vergleichbare Deckdaten als synergistisch auffallen
- zusätzliche Rollen erfüllen

Cantrips zählen nicht automatisch als vollständiger
Card-Advantage-Slot.

Danach:

- Hauptauswahl
- genau 5 Alternativen
- Maybe Board aktualisieren
- Nutzerbestätigung

---

# 11. Targeted Interaction

Der Zielwert wird aus dem aktiven Template gelesen.

Zu berücksichtigen sind insbesondere:

- Creature Removal
- Artifact Removal
- Enchantment Removal
- Planeswalker Removal
- Counterspells
- Graveyard Interaction
- flexible Antworten

Multi-Role-Karten sind besonders wertvoll.

Danach:

- Hauptauswahl
- genau 5 Alternativen
- Maybe Board aktualisieren
- Nutzerbestätigung

---

# 12. Mass Interaction

Der Zielwert wird aus dem aktiven Template gelesen.

Zu berücksichtigen sind:

- Boardwipes
- Mass Bounce
- Mass Exile
- asymmetrische Wipes
- andere breit wirkende Reset-Effekte

Die Auswahl muss zum eigenen Board und Spielplan passen.

Danach:

- Hauptauswahl
- genau 5 Alternativen
- Maybe Board aktualisieren
- Nutzerbestätigung

---

# 13. Plan Cards

Plan Cards werden nicht als feste zusätzliche Kartenmenge auf die
vorherigen Kategorien addiert.

Bereits ausgewählte Karten können zugleich sein:

- Enabler
- Payoff
- Enhancer

Vor jeder Plan-Kategorie wird deshalb geprüft, wie viel Rollenabdeckung
bereits vorhanden ist.

---

# 14. Enabler

Enabler ermöglichen oder beschleunigen den eigentlichen Spielplan.

Die Auswahl erfolgt anhand von:

- Commander-Synergie
- EDHREC-/Theme-Synergie
- bestehenden Engines
- Redundanz
- bereits vorhandenen Plan-Rollen

Danach:

- Hauptauswahl
- genau 5 Alternativen
- Maybe Board aktualisieren
- Nutzerbestätigung

---

# 15. Payoffs

Payoffs belohnen das Deck dafür, seinen Plan auszuführen.

Bei der Auswahl sollen insbesondere geprüft werden:

- hohe Commander-/Theme-Synergie
- skalierende Effekte
- Karten, die aus normalen Spielzügen echten Vorteil erzeugen
- mögliche Übergänge zu Finishern oder Win Conditions

Danach:

- Hauptauswahl
- genau 5 Alternativen
- Maybe Board aktualisieren
- Nutzerbestätigung

---

# 16. Enhancer

Enhancer verstärken einen bereits funktionierenden Plan.

Sie sollen nicht wichtiger werden als ausreichende Enabler und Payoffs.

Zu prüfen sind:

- Verdoppler
- Trigger-Verdoppler
- Multiplikatoren
- Schutz
- Resilienz
- zusätzliche Kopien
- Effizienzsteigerung

Danach:

- Hauptauswahl
- genau 5 Alternativen
- Maybe Board aktualisieren
- Nutzerbestätigung

---

# 17. Finisher-, Wincon-, Combo- und Game-Changer-Pass

Dieser Schritt findet statt, bevor die Länder endgültig ausgewählt werden.

Das bisherige Deck wird gezielt geprüft auf:

- vorhandene Finisher
- fehlende Finisher
- primäre Win Conditions
- sekundäre Win Conditions
- Combat-Finisher
- alternative Win Conditions
- Zwei-Karten-Combos
- Drei-Karten-Combos
- mehrteilige Combos
- Commander-gestützte Combos
- Infinite Loops
- deterministische Win-Lines
- passende Game Changers innerhalb des Ziel-Brackets

Zusätzlich werden EDHREC-/vergleichbare Deckdaten erneut darauf geprüft,
welche Finisher und Wincons für diese Strategie typisch oder besonders
synergistisch sind.

## Austauschvorschläge

Wenn bessere oder fehlende Optionen erkannt werden, werden konkrete Swaps
vorgeschlagen.

Beispiel:

```text
Finisher Review

Raus:
- [Karte A] — Collection

Rein:
- [Karte B] — ca. 3,20 €

Grund:
- klarerer Finisher
- höhere Synergie mit Commander
- schließt eine erkennbare Wincon-Lücke
```

Vor neuen externen Vorschlägen zuerst relevante Maybe-Board-Kandidaten
prüfen.

Dieser Schritt endet mit einem Guided-Stop.

Keine vorgeschlagene Änderung wird ohne Nutzerbestätigung übernommen.

---

# 18. Länder zuletzt

Erst nach Abschluss des Spell-Pakets und des Finisher-Passes wird die
endgültige Manabase gebaut.

Die Land-Zielzahl stammt aus dem aktiven Template.

Jetzt können tatsächlich berücksichtigt werden:

- farbige Manaanforderungen aller gewählten Spells
- Commander-Farbanforderungen
- Mana Curve
- Ramp-Dichte
- Utility Lands
- Landfall-/Land-Synergien
- MDFCs
- getappte Länder
- benötigte Farbquellen

Die Länderauswahl wird ebenfalls als Guided-Schritt gezeigt.

Wenn sinnvoll, werden Alternativen für Utility- oder Dual-Lands angeboten.

Danach auf Nutzerbestätigung warten.

---

# 19. Finaler Template- und Qualitätscheck

Nach der Länderauswahl wird das vollständige Deck noch einmal anhand von

`brains/deckbuilding/templates.md`

und des aktiven Deckbuilding-Templates geprüft.

Beispiel:

```text
Template Check

Deckgröße:              100 / 100
Länder:                  38 / 38
Ramp:                    10 / 10
Card Advantage:          12 / 12
Targeted Interaction:    11 / 12
Mass Interaction:         6 / 6

Enabler: ausreichend
Payoffs: ausreichend
Enhancer: hoch

Win Conditions: 2
Combos: 1
Game Changers: 2
```

Zu prüfen sind zusätzlich:

- Mana Curve
- Farbquellen
- redundante Effekte
- tote oder schwache Slots
- fehlende Rollen
- zu hohe oder zu niedrige Rollenabdeckung
- Commander-Abhängigkeit
- Resilienz
- Ziel-Bracket
- Wincon-Dichte
- Combo-Linien

## Letzte Verbesserungsvorschläge

Wenn sinnvolle Verbesserungen erkannt werden, werden konkrete Swaps
vorgeschlagen.

Zuerst das Maybe Board prüfen.

Danach bei Bedarf weitere synergistische Optionen anhand von EDHREC und
vergleichbaren Deckdaten suchen.

Dieser Schritt endet mit einem letzten Guided-Stop.

---

# 20. Finale Ausgabe

Nach Bestätigung des finalen Checks wird das Deck anhand des gemeinsamen
Ausgabeformats aus

`brains/deckbuilding/templates.md`

ausgegeben.

Das Maybe Board wird separat angezeigt, wenn es nicht leer ist.

---

# 21. Speichern

Der Guided-Workflow ist bis zur finalen Nutzerbestätigung ein
Arbeitsstand.

Das fertige Deck wird erst gespeichert, nachdem der Nutzer die finale
Deckliste bestätigt hat.

Für Speicherung und Versionierung gelten die Regeln aus:

`brains/deck-versioning/templates.md`
