# Data

Dieser Ordner enthält die konkreten Projektdaten des MTG Commander Brain Projekts.

Hier liegen keine allgemeinen Regeln oder KI-Anweisungen, sondern echte Arbeitsdaten wie:

- Collection-Daten
- ManaBox-Decklisten
- gespeicherte Analysen
- gespeicherte Bracket-Einschätzungen
- gespeicherte Gameplans
- gespeicherte Deckvarianten
- gespeicherte Deckvergleiche

Die allgemeinen Regeln liegen in `brains/`.  
Die KI-spezifischen Adapter liegen in `ai-context/`.

---

## Struktur

```text
data/
├─ collection.json
└─ decks/
   ├─ decklists/
   └─ saved/
      └─ [deck-slug]/
         ├─ analysis.md
         ├─ bracket.md
         ├─ gameplan.md
         ├─ variants/
         └─ versions/
```

---

# Collection

## `collection.json`

Diese Datei wird aus dem ManaBox CSV Export erzeugt.

Quelle:

```text
imports/manabox/ManaBox_Collection.csv
```

Erzeugung:

```bash
npm run import:collection
```

Ziel:

```text
data/collection.json
```

Die Collection beschreibt, welche Karten physisch vorhanden sind.

Wichtig:

```text
Collection ≠ Decklisten
```

Eine Karte kann in mehreren Decklisten vorkommen, auch wenn sie nur einmal physisch vorhanden ist.

Das ist kein Fehler.

---

# Deckdaten

Deckdaten liegen unter:

```text
data/decks/
```

Die wichtigste Trennung ist:

```text
decklists/
```

und:

```text
saved/
```

---

## `data/decks/decklists/`

Hier liegen die rohen Decklisten aus ManaBox.

Der Nutzer pflegt primär nur diesen Ordner.

Beispiel:

```text
data/decks/decklists/vi-oh-no.txt
```

Standardformat:

```txt
// COMMANDER
1 Vivi Ornitier

1 Alania, Divergent Storm
1 Ancestors' Aid
1 Arcane Signet
1 As Foretold
1 Blaze
```

Regeln:

- Decklisten dürfen einfache `.txt`-Dateien sein.
- ManaBox-Exportformat ist der Standard.
- `// COMMANDER` startet den Commander-Bereich.
- Alle Kartenzeilen bis zur nächsten Leerzeile oder Sektion gehören zum Commander-Bereich.
- Mehrere Commander sind zulässig, wenn die Commander-Regeln ihre gemeinsame Verwendung erlauben.
- Sektions- und Kommentarzeilen mit `//` sind keine Karten. `//` innerhalb eines doppelseitigen Kartennamens bleibt jedoch Teil des Kartennamens.
- Eine Leerzeile beendet den Commander-Bereich; sonstige Leerzeilen werden ignoriert.
- Weitere Sektionen können vorhanden sein, sind aber nicht zwingend nötig.

---

## `data/decks/saved/`

Hier liegen bestätigte KI-Ergebnisse.

Dieser Ordner wird nicht manuell für jede neue Deckliste vorbereitet.  
Er entsteht, wenn eine Analyse, ein Gameplan oder eine Variante bestätigt und gespeichert werden soll.

Beispiel:

```text
data/decks/saved/vi-oh-no/
├─ analysis.md
├─ bracket.md
├─ gameplan.md
└─ variants/
```

Bedeutung:

```text
analysis.md
```

Gesamtanalyse des Decks.

```text
bracket.md
```

Bracket-Einschätzung inklusive Game Changer Check.

```text
gameplan.md
```

Spielplan nach Early Game, Mid Game und Late Game.

```text
variants/
```

Alternative Versionen eines bestehenden Decks.

Beispiel:

```text
data/decks/saved/vi-oh-no/variants/vivi-burn-fire-artwork.md
```

```text
versions/
```

Archivierte frühere Hauptversionen desselben Decks. Das Ersetzen einer Hauptdeckliste folgt dem Workflow aus `brains/deck-versioning/templates.md`.

Beispiel:

```text
data/decks/saved/vi-oh-no/versions/v001.md
```

---

# Vergleiche

Deckvergleiche können gespeichert werden unter:

```text
data/decks/saved/comparisons/
```

Beispiel:

```text
data/decks/saved/comparisons/ghost-gwen-nom-vi-oh-no.md
```

Vergleiche gehören nicht zu einem einzelnen Deck, sondern beschreiben Beziehungen zwischen mehreren Decks.

---

# Speicherregel

KI-Ergebnisse dürfen erst gespeichert werden, wenn der Nutzer bestätigt.

Beispiele für Bestätigung:

```text
passt so
speichern
übernehmen
das ist die finale Version
```

Vorher sind Analysen und Vorschläge nur Arbeitsstände.

---

# Wichtige Regeln

## Collection und Decklisten getrennt halten

Die Collection zeigt Besitz.

Decklisten zeigen Planung, Tests oder gespielte Decks.

Beispiel:

```text
Jeska's Will
Besitz: 1
Geplant in:
- Vi oh no
- Lightning, Army of One
```

Das ist erlaubt.

Nur wenn nach physischer Verfügbarkeit gefragt wird, soll die Mehrfachverwendung als Hinweis ausgegeben werden.

---

## Keine Nutzerpräferenzen ableiten

Aus gespeicherten Decks dürfen keine festen persönlichen Vorlieben abgeleitet werden.

Richtig:

```text
Dieses Deck nutzt Spellslinger-Elemente.
```

Falsch:

```text
Der Nutzer bevorzugt Spellslinger.
```

---

## Dateinamen

Für neue Dateien bevorzugt Slugs verwenden:

```text
vi-oh-no.txt
ghost-of-numbers.txt
gwen-nom.txt
```

Nicht ideal:

```text
Vi oh no.txt
Ghost of Numbers.txt
GwenNom.txt
```

Der Inhalt darf weiterhin den normalen Decknamen enthalten.

---

# Typischer Workflow

## Neue Deckliste hinzufügen

1. Deck in ManaBox exportieren.
2. `.txt`-Datei ablegen unter:

```text
data/decks/decklists/
```

3. KI bitten, das Deck zu analysieren.
4. Analyse prüfen.
5. Erst nach Bestätigung speichern lassen.

---

## Gespeicherte Analyse

Nach Bestätigung wird gespeichert unter:

```text
data/decks/saved/[deck-slug]/
```

Beispiel:

```text
data/decks/saved/vi-oh-no/
├─ analysis.md
├─ bracket.md
└─ gameplan.md
```

---

# Was hier nicht hingehört

Nicht in `data/` speichern:

- allgemeine Regeln
- Bracket-System-Erklärungen
- ChatGPT-Anweisungen
- Claude-Skills
- Prompt-Vorlagen
- Scripts

Diese gehören in:

```text
brains/
ai-context/
scripts/
```
