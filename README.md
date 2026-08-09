# MTG Commander Brain

Ein persönliches Multi-Brain-System für Magic: The Gathering Commander/EDH.

Das Projekt dient nicht als klassische Deckbuilder-App, sondern als strukturierte Wissensbasis für KI-gestützte Commander-Arbeit.

Ziel ist, Decklisten, Collection-Daten, Bracket-Regeln, Deckanalysen, Gameplans und Deckbau-Ideen so zu organisieren, dass verschiedene KI-Systeme wie ChatGPT oder Claude damit arbeiten können.

---

## Ziele

Dieses Projekt soll helfen bei:

- Commander/EDH Deckanalyse
- Bracket-Einschätzung
- Gameplan-Erstellung
- Deckbau und Deckvarianten
- Vergleich bestehender Decks
- Collection-Nutzung aus ManaBox
- Speichern bestätigter Analysen
- KI-gestützter Arbeit mit mehreren spezialisierten Kontexten

---

## Grundprinzip

Das Projekt trennt bewusst zwischen:

```text
Collection
= Karten, die physisch vorhanden sind

Decklisten
= Karten, die in Decks geplant, getestet oder gespielt werden
```

Eine Karte darf in mehreren Decklisten vorkommen, auch wenn sie nur einmal physisch vorhanden ist.

Beispiel:

```text
Jeska's Will kann in mehreren Decklisten auftauchen.
Das ist kein Fehler.
Ein Besitzkonflikt entsteht nur, wenn konkret nach physischer Verfügbarkeit gefragt wird.
```

---

## Projektstruktur

```text
brains/
```

Allgemeine Regeln, Templates und Bewertungslogiken für alle KI-Systeme.

```text
data/
```

Konkrete Projektdaten wie Collection, Decklisten, gespeicherte Analysen und Varianten.

```text
imports/
```

Rohdaten aus externen Quellen, z. B. ManaBox CSV Exporte.

```text
scripts/
```

Automatisierungen und Import-Scripts.

```text
ai-context/
```

KI-spezifische Adapter für ChatGPT, Claude und weitere Systeme.

```text
prompts/
```

Wiederverwendbare Prompts für Tests und typische Arbeitsabläufe.

---

## Aktueller Workflow

### 1. Collection aus ManaBox importieren

ManaBox Collection als CSV exportieren und ablegen unter:

```text
imports/manabox/ManaBox_Collection.csv
```

Dann Import ausführen:

```bash
npm run import:collection
```

Ergebnis:

```text
data/collection.json
```

---

### 2. Decklisten aus ManaBox ablegen

Decklisten werden als einfache `.txt`-Dateien abgelegt:

```text
data/decks/decklists/
```

Beispiel:

```text
data/decks/decklists/vi-oh-no.txt
```

ManaBox-Format:

```txt
// COMMANDER
1 Vivi Ornitier

1 Alania, Divergent Storm
1 Ancestors' Aid
1 Arcane Signet
1 As Foretold
1 Blaze
```

---

### 3. Deck analysieren lassen

Die KI nutzt:

```text
brains/deck-analysis/templates.md
brains/bracket/templates.md
ai-context/chatgpt/anweisung.md
```

und erzeugt daraus:

- Commander-Erkennung
- Spielplan
- zentrale Kartenpakete
- Game Changer Check
- Bracket-Einschätzung
- Early/Mid/Late Gameplan
- Unsicherheiten
- Rückfrage zum Speichern

---

### 4. Ergebnisse speichern

Analysen, Brackets, Gameplans und Varianten werden erst gespeichert, wenn der Nutzer bestätigt.

Gespeicherte Ergebnisse liegen unter:

```text
data/decks/saved/
```

Beispiel:

```text
data/decks/saved/vi-oh-no/
├─ analysis.md
├─ bracket.md
├─ gameplan.md
└─ variants/
```

---

## KI-Adapter

### ChatGPT

ChatGPT-spezifische Anweisung:

```text
ai-context/chatgpt/anweisung.md
```

Diese Datei kann als Projektanweisung in ChatGPT verwendet werden.

### Claude

Claude Skill:

```text
ai-context/claude/skills/edh-deckbuilder/SKILL.md
```

Dieser Skill dient als Claude-spezifischer Adapter auf dieselbe Projektstruktur.

---

## Bracket-System

Das Commander Bracket System liegt unter:

```text
brains/bracket/templates.md
```

Es enthält:

- Bracket 1–5
- Game Changer Regeln
- aktuelle Game Changer Liste
- Analysevorgehen
- Deckbuilding-Hinweise

Beim Deckbuilding gilt:

```text
Wenn kein Ziel-Bracket genannt wird, ist Bracket 3 der Standard.
```

---

## Wichtige Regeln

- Keine dauerhaften Informationen ohne Bestätigung speichern.
- Keine festen Nutzerpräferenzen aus bestehenden Decks ableiten.
- Decklisten und Collection getrennt behandeln.
- ManaBox-Decklisten sind der Standardinput.
- Gespeicherte KI-Ergebnisse liegen unter `data/decks/saved/`.
- Bracket-Regeln kommen aus `brains/bracket/templates.md`.
- Deckbuilding-Regeln kommen aus `brains/deckbuilding/templates.md`.
- Deckanalyse-Regeln kommen aus `brains/deck-analysis/templates.md`.

---

## Typische Testprompts

### Deckanalyse

```text
Analysiere `data/decks/decklists/vi-oh-no.txt`.

Nutze:
- `ai-context/chatgpt/anweisung.md`
- `brains/deck-analysis/templates.md`
- `brains/bracket/templates.md`

Gib Commander, Spielplan, Game Changer Check, Bracket-Einschätzung und Early/Mid/Late Gameplan aus.

Speichere noch nichts.
```

### Deckvergleich

```text
Vergleiche `ghost-of-numbers.txt`, `gwennom.txt` und `vi-oh-no.txt`.

Welche Decks wirken strategisch ähnlich?
Welche unterscheiden sich deutlich?

Leite daraus keine festen persönlichen Vorlieben ab.
```

### Deckbau

```text
Baue mir eine alternative Version von Vivi Ornitier als Burn-Deck.

Ein großer Teil der Karten soll Feuer im Artwork haben.
Ich möchte maximal 5 € zusätzlich ausgeben.
Nutze vorhandene Decklisten als Kontext, aber kopiere nicht einfach das bestehende Vivi-Deck.
```

### Speichern

```text
Passt so. Speichere die Analyse nach der definierten Projektstruktur.
```

---

## Entwicklung

Installieren:

```bash
npm install
```

Collection importieren:

```bash
npm run import:collection
```

Git Workflow:

```bash
git add .
git commit -m "..."
git push
```

---

## Status

Aktueller Projektstand:

- Projektstruktur angelegt
- ManaBox Collection Import vorhanden
- ChatGPT Adapter vorhanden
- Claude Skill vorhanden
- Bracket Brain vorhanden
- Deckanalyse Brain vorhanden
- erste Tests mit Beispieldecks durchgeführt