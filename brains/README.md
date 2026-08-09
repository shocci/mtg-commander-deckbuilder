# Brains

Dieser Ordner enthält die allgemeinen Denk-, Bewertungs- und Arbeitslogiken des MTG Commander Brain Projekts.

Die Dateien in `brains/` sind **KI-übergreifend** gedacht.  
Sie gelten also nicht nur für ChatGPT oder Claude, sondern beschreiben die gemeinsamen Projektregeln, Templates und Bewertungsgrundlagen.

KI-spezifische Adapter liegen dagegen in:

```text
ai-context/
```

Konkrete Daten wie Decklisten, Collection und gespeicherte Analysen liegen in:

```text
data/
```

---

## Zweck

Die Brains definieren, **wie** mit Commander/EDH-Daten gearbeitet werden soll.

Sie beantworten Fragen wie:

- Wie wird ein Deck analysiert?
- Wie wird ein Bracket eingeschätzt?
- Wie wird ein neues Deck gebaut?
- Welche Regeln gelten für Collection-Nutzung?
- Wann darf etwas gespeichert werden?
- Welche Projektphilosophie gilt?

---

## Struktur

```text
brains/
├─ bracket/
├─ collection/
├─ deck-analysis/
├─ deckbuilding/
└─ project/
```

---

# Brain-Bereiche

## `brains/project/`

Enthält die grundlegende Projektphilosophie.

Wichtige Datei:

```text
brains/project/philosophy.md
```

Diese Datei beschreibt:

- das Ziel des Projekts
- die Trennung zwischen Collection und Decklisten
- dass Analysen erst nach Bestätigung gespeichert werden
- dass keine festen Nutzerpräferenzen aus bestehenden Decks abgeleitet werden sollen
- dass unterschiedliche Commander, Mechaniken und Spielstile ausdrücklich erlaubt sind

Diese Datei sollte bei allgemeinen Projektfragen berücksichtigt werden.

---

## `brains/bracket/`

Enthält das Commander Bracket System.

Wichtige Datei:

```text
brains/bracket/templates.md
```

Diese Datei beschreibt:

- Bracket 1–5
- Game-Changer-Regeln
- aktuelle Game-Changer-Liste
- Analysevorgehen für Bracket-Einschätzungen
- Konflikte zwischen Nutzerwunsch und Bracket-Ziel

Dieses Brain wird genutzt bei:

- Bracket-Einschätzungen
- Deckanalysen
- Deckbuilding mit Ziel-Powerlevel
- cEDH- oder High-Power-Fragen
- Game-Changer-Checks

Wichtig:

Beim Deckbuilding wird das Standard-Bracket nicht hier festgelegt, sondern im Deckbuilding-Brain.

---

## `brains/deck-analysis/`

Enthält das Template für Deckanalysen.

Wichtige Datei:

```text
brains/deck-analysis/templates.md
```

Dieses Brain wird genutzt, wenn eine vorhandene Deckliste analysiert werden soll.

Typischer Input:

```text
data/decks/decklists/[deck-name].txt
```

Typische Analysebestandteile:

- Commander
- Farbidentität
- erkannter Spielplan
- Early Game
- Mid Game
- Late Game
- zentrale Engines
- Payoffs
- Interaction
- Win Conditions
- Game Changer Check
- Bracket-Einschätzung
- Stärken
- Schwächen
- Unsicherheiten
- Rückfrage zum Speichern

---

## `brains/deckbuilding/`

Enthält das Template für das Erstellen, Umbauen oder Varianten-Bauen von Decks.

Wichtige Datei:

```text
brains/deckbuilding/templates.md
```

Dieses Brain wird genutzt bei Aufgaben wie:

```text
Baue mir ein neues Commander Deck.
```

```text
Erstelle eine Burn-Variante von Vivi.
```

```text
Baue ein Bracket-3-Deck mit maximal 5 € Zusatzbudget.
```

```text
Mach aus diesem Deck eine cEDH-Version.
```

Wichtige Regel:

Wenn der Nutzer beim Deckbuilding kein Ziel-Bracket nennt, wird standardmäßig verwendet:

```text
Bracket 3: Upgraded / Aufgewertet
```

Das bedeutet:

- bis zu 3 Game Changers erlaubt
- keine typischen frühen Zwei-Karten-Endloskombos
- keine Mass Land Denial Strategie
- keine wiederholbaren Extra-Turn-Schleifen
- starke Synergien erlaubt
- gute Kartenqualität erlaubt
- nicht vollständig optimiert
- nicht cEDH-orientiert

Falls der Nutzer ein anderes Ziel-Bracket nennt, überschreibt diese Angabe den Standard.

---

## `brains/collection/`

Enthält Regeln für die Nutzung der Collection.

Mögliche Datei:

```text
brains/collection/templates.md
```

Dieses Brain wird genutzt bei Fragen wie:

- Welche Karten besitzt der Nutzer?
- Welche Karten fehlen für ein Deck?
- Welche Karten aus der Collection passen zu einem neuen Deck?
- Welche Karten kommen in mehreren Decklisten vor?
- Gibt es physische Kopien-Konflikte?

Wichtige Grundregel:

```text
Collection ≠ Decklisten
```

Die Collection zeigt Besitz.

Decklisten zeigen Planung, Tests oder gespielte Decks.

Eine Karte darf in mehreren Decklisten vorkommen, auch wenn sie nur einmal physisch vorhanden ist.

Das ist kein Fehler.

Nur wenn explizit nach physischer Verfügbarkeit gefragt wird, soll Mehrfachverwendung als Hinweis ausgegeben werden.

---

# Allgemeine Brain-Regeln

## 1. Brains sind keine Rohdaten

In `brains/` liegen keine Decklisten und keine Collection-Dateien.

Nicht hier speichern:

```text
ManaBox_Collection.csv
collection.json
Decklisten
Analysen
Gameplans
Varianten
```

Diese gehören nach:

```text
data/
imports/
```

---

## 2. Brains sind keine KI-spezifischen Adapter

Nicht hier speichern:

```text
ChatGPT Projektanweisung
Claude Skill
MCP-Konfiguration
```

Diese gehören nach:

```text
ai-context/
```

---

## 3. Brains enthalten wiederverwendbare Logik

Ein Brain sollte allgemeine Regeln oder Templates enthalten, die mehrfach genutzt werden können.

Beispiele:

```text
Wie analysiere ich ein Deck?
Wie bewerte ich ein Bracket?
Wie baue ich ein Deck mit Constraints?
Wie gehe ich mit Collection-Daten um?
```

---

## 4. Keine unnötige Doppelung

Wenn eine Regel bereits in einem Brain definiert ist, sollte sie nicht mehrfach an anderen Stellen hart wiederholt werden.

Beispiel:

```text
Bracket-Regeln
```

gehören primär in:

```text
brains/bracket/templates.md
```

Andere Dateien sollen darauf verweisen.

---

## 5. Aktuelle Nutzeranweisung hat Vorrang

Wenn der Nutzer im Chat eine konkrete Anweisung gibt, hat diese Vorrang vor den Brain-Templates.

Beispiel:

```text
Baue das Deck explizit als Bracket 2.
```

überschreibt den Standard-Bracket-3-Deckbuilding-Fall.

Falls Nutzerwunsch und Brain-Regeln im Konflikt stehen, muss der Konflikt benannt werden.

---

# Typischer KI-Ablauf

## Deckanalyse

Verwendete Quellen:

```text
brains/project/philosophy.md
brains/deck-analysis/templates.md
brains/bracket/templates.md
data/decks/decklists/[deck].txt
```

Ablauf:

1. Deckliste lesen.
2. Commander erkennen.
3. Spielplan ableiten.
4. Kartenrollen kontextbezogen bestimmen.
5. Game Changers prüfen.
6. Bracket einschätzen.
7. Early/Mid/Late Gameplan formulieren.
8. Unsicherheiten nennen.
9. Fragen, ob gespeichert werden soll.

---

## Deckbuilding

Verwendete Quellen:

```text
brains/project/philosophy.md
brains/deckbuilding/templates.md
brains/bracket/templates.md
data/decks/decklists/
data/collection.json
```

Ablauf:

1. Nutzerwunsch lesen.
2. Constraints erkennen.
3. Ziel-Bracket bestimmen.
4. Falls kein Ziel-Bracket genannt wurde: Bracket 3 verwenden.
5. Collection berücksichtigen, wenn relevant.
6. Bestehende Decks berücksichtigen, wenn Abgrenzung gewünscht ist.
7. Deckvorschlag erstellen.
8. Game Changers prüfen.
9. Budget prüfen.
10. Fragen, ob gespeichert werden soll.

---

## Collection-Fragen

Verwendete Quellen:

```text
brains/collection/templates.md
data/collection.json
data/decks/decklists/
```

Ablauf:

1. Collection prüfen.
2. Decklisten nur hinzuziehen, wenn relevant.
3. Besitz und Deckverwendung getrennt behandeln.
4. Mehrfachverwendung nicht automatisch als Fehler markieren.
5. Physische Konflikte nur ausgeben, wenn danach gefragt wird.

---

# Speicherung

Brains speichern selbst keine Ergebnisse.

Gespeicherte Ergebnisse gehören unter:

```text
data/decks/saved/
```

Beispiele:

```text
data/decks/saved/vi-oh-no/analysis.md
data/decks/saved/vi-oh-no/bracket.md
data/decks/saved/vi-oh-no/gameplan.md
data/decks/saved/vi-oh-no/variants/vivi-burn-fire-artwork.md
```

Deckvergleiche:

```text
data/decks/saved/comparisons/
```

---

# Namenskonvention

Ordner und Dateien möglichst als Slug schreiben:

```text
deck-analysis/
deckbuilding/
bracket/
collection/
project/
```

Decknamen in gespeicherten Daten ebenfalls bevorzugt als Slug:

```text
vi-oh-no
ghost-of-numbers
gwennom
```

Der lesbare Deckname kann im Dateiinhalt stehen.

---

# Pflegehinweise

Wenn sich externe Systeme ändern, müssen die entsprechenden Brains aktualisiert werden.

Beispiele:

- Commander Bracket System ändert sich
- Game-Changer-Liste ändert sich
- ManaBox-Exportformat ändert sich
- Projekt entscheidet sich für neue Speicherstruktur
- Deckbuilding-Standard soll angepasst werden

Bei Änderungen an Brains sollte ein passender Commit verwendet werden:

```bash
git commit -m "docs: Bracket Brain aktualisieren"
```

oder:

```bash
git commit -m "docs: Deckbuilding Brain erweitern"
```