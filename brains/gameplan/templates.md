# Gameplan Template

## Zweck

Dieses Brain beschreibt, wie ein vorhandenes Commander-/EDH-Deck praktisch gespielt wird.

Der Gameplan soll so strukturiert sein, dass auch jemand, der das Deck noch nicht kennt,
mit den Hinweisen sinnvoll spielen kann.

Die Ausgabe soll kompakt bleiben und keine Informationen ausführlich wiederholen,
die bereits in `analysis.md`, `bracket.md` oder `rule-zero.md` enthalten sind.

Der Gameplan ist ein Arbeitsstand und wird erst nach Nutzerbestätigung gespeichert.

---

## Grundlage

Für die Erstellung des Gameplans werden verwendet:

- die aktuelle Deckliste unter `data/decks/decklists/[deck-slug].txt`
- die Ergebnisse der Deckanalyse
- erkannte Engines und Synergien
- verifizierte Win Conditions und Combo-Linien
- `brains/rules/magic-rules.md` für regelabhängige Interaktionen

Falls Bracket-Informationen benötigt werden, gilt:

`brains/bracket/templates.md`

Bracket-Details sollen jedoch nicht ausführlich im Gameplan wiederholt werden.

---

## Pflichtprüfungen

Vor Erstellung des Gameplans müssen folgende Punkte bestimmt werden:

1. Was ist der zentrale Spielplan des Decks?
2. Welche Karten oder Kartentypen sind für eine gute Starthand wichtig?
3. Welche Hände sollten eher gemulligant werden?
4. Was sind die wichtigsten Ziele im Early Game?
5. Was sind die wichtigsten Ziele im Mid Game?
6. Was sind die wichtigsten Ziele im Late Game?
7. Welche Engines treiben den Spielplan dauerhaft an?
8. Welche Win Conditions besitzt das Deck?
9. Welche Combo-Linien sind im aktuellen Deck tatsächlich vorhanden?
10. Welche typischen Fehler oder wichtigen Entscheidungen sollte ein Spieler kennen?

---

## Starthand und Mulligan

Die Starthand-Empfehlung soll praktisch und kurz sein.

Sie soll keine feste perfekte Hand verlangen, sondern beschreiben,
welche Funktionen in einer guten Hand vorhanden sein sollten.

Beispiele für relevante Funktionen:

- ausreichende Länder oder Manaquellen
- frühes Ramp
- Card Selection oder Card Advantage
- früher Enabler
- Schutz für einen commanderabhängigen Plan
- Interaktion gegen typische Probleme
- zentrale Setup-Karten

Mulligan-Hinweise sollen nur die wichtigsten problematischen Handtypen nennen.

---

## Early Game

Der Early-Game-Abschnitt beschreibt die ersten Aufbauzüge.

Er soll beantworten:

- Was soll zuerst entwickelt werden?
- Wann sollte der Commander gespielt werden?
- Welche Ressourcen sollten nicht unnötig verbraucht werden?
- Welche Karten oder Permanents sind besonders wichtig für den späteren Plan?

Der Abschnitt soll sich auf konkrete Prioritäten konzentrieren.

---

## Mid Game

Der Mid-Game-Abschnitt beschreibt den Übergang vom Aufbau zum eigentlichen Spielplan.

Er soll beantworten:

- Welche Engine soll jetzt aktiv sein?
- Welche Synergien werden aufgebaut?
- Wann wird Druck erzeugt?
- Welche Interaktion sollte zurückgehalten werden?
- Welche Ressourcen müssen geschützt werden?

---

## Late Game

Der Late-Game-Abschnitt beschreibt, wie das Deck Spiele abschließt oder sich aus
langen Partien herausarbeitet.

Er soll beantworten:

- Welche Win Conditions werden jetzt relevant?
- Welche Ressourcen oder Engines skalieren besonders gut?
- Welche Karten sollten für den entscheidenden Zug vorbereitet werden?
- Welche Recovery-Linien existieren nach einem Boardwipe oder Rückschlag?

---

## Wichtige Engines

Nur zentrale Engines sollen hier aufgeführt werden.

Für jede relevante Engine:

### [Engine-Name]

**Kernkarten:**

- ...

**Funktion:**

[Kurze Erklärung, was die Engine erzeugt oder ermöglicht.]

**Wichtig beim Spielen:**

- ...

Keine vollständige Kartenanalyse wiederholen.

---

## Win Conditions

Hier werden die tatsächlichen Wege beschrieben, über die das Deck ein Spiel gewinnen kann.

Für jede relevante Win Condition:

### [Win Condition]

**Benötigt:**

- ...

**Ablauf:**

[Kurze Erklärung.]

**Worauf achten:**

- ...

Win Conditions sollen nach praktischer Relevanz geordnet werden.

---

## Combos

Nur verifizierte Combo-Linien des aktuellen Decks dürfen hier als Combos ausgegeben werden.

Synergie-Linien oder Burst-/Finisher-Linien dürfen nicht als Combos bezeichnet werden.

Für jede relevante Combo:

### [Combo-Name]

**Karten:**

- ...
- ...

**Voraussetzungen:**

- ...

**Ablauf:**

1. ...
2. ...
3. ...

**Ergebnis:**

- ...

**Unterbrechbar durch:**

- ...

Wenn der Commander Teil der Combo ist, muss dies klar genannt werden.

Regelabhängige Combo-Linien müssen gemäß

`brains/rules/magic-rules.md`

verifiziert sein.

Wenn keine verifizierte Combo im aktuellen Deck erkannt wurde, soll stattdessen stehen:

`Keine verifizierte Combo im aktuellen Deckstand erkannt.`

---

## Wichtige Spielhinweise

Dieser Abschnitt enthält nur Hinweise, die beim tatsächlichen Spielen einen deutlichen Unterschied machen.

Geeignet sind zum Beispiel:

- wichtige Timing-Regeln
- typische Sequencing-Fehler
- wann der Commander besser zurückgehalten wird
- welche Engine besonders geschützt werden sollte
- welche Karten nicht zu früh eingesetzt werden sollten
- wichtige Interaktionen zwischen eigenen Karten

Der Abschnitt soll kurz bleiben.

---

# Ausgabeformat

# Gameplan: [Deckname]

## Kurz erklärt

[2–4 Sätze zum zentralen Spielplan.]

## Starthand und Mulligan

**Bevorzugt behalten:**

- ...
- ...
- ...

**Eher Mulligan bei:**

- ...
- ...

## Early Game

**Ziel:**

[Kurze Beschreibung.]

**Prioritäten:**

1. ...
2. ...
3. ...

## Mid Game

**Ziel:**

[Kurze Beschreibung.]

**Prioritäten:**

1. ...
2. ...
3. ...

## Late Game

**Ziel:**

[Kurze Beschreibung.]

**Prioritäten:**

1. ...
2. ...
3. ...

## Wichtige Engines

### [Engine-Name]

**Kernkarten:**

- ...

**Funktion:**

- ...

**Wichtig beim Spielen:**

- ...

## Win Conditions

### [Win Condition]

**Benötigt:**

- ...

**Ablauf:**

- ...

**Worauf achten:**

- ...

## Combos

### [Combo-Name]

**Karten:**

- ...

**Voraussetzungen:**

- ...

**Ablauf:**

1. ...
2. ...
3. ...

**Ergebnis:**

- ...

**Unterbrechbar durch:**

- ...

## Wichtige Spielhinweise

- ...
- ...
- ...

---

## Ausgabeprinzipien

Der Gameplan soll:

- praktisch statt analytisch formuliert sein
- auch für einen neuen Spieler verständlich sein
- möglichst konkrete Prioritäten nennen
- kompakt bleiben
- keine vollständige Deckanalyse wiederholen
- keine ausführliche Bracket-Einschätzung enthalten
- keinen Rule-0-Hinweis duplizieren

---

## Speichern

Nach Nutzerbestätigung wird der Gameplan unter

```text
data/decks/saved/[deck-slug]/gameplan.md
```

gespeichert.

Ohne Nutzerbestätigung werden keine Dateien verändert.