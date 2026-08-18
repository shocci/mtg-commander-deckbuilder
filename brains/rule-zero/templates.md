# Rule-0-Kommunikation

## Zweck

Dieses Brain erstellt eine kurze, verständliche und ehrliche Rule-0-Beschreibung
eines Commander-Decks für die Kommunikation vor einer Partie.

Die Ausgabe soll so formuliert sein, dass sie am Tisch direkt vorgelesen oder
sinngemäß gesagt werden kann.

Rule 0 ist ein eigener Bestandteil jedes gespeicherten Decks und soll für alle
Decks möglichst gleich aufgebaut sein.

Die Rule-0-Kommunikation ersetzt keine Bracket-Einschätzung, Deckanalyse,
Regelprüfung oder ausführliche Combo-Beschreibung.

---

## Quellen

Für die Rule-0-Zusammenfassung sollen verwendet werden:

- aktuelle Deckanalyse
- aktueller Gameplan
- `brains/bracket/templates.md`
- `brains/rules/magic-rules.md`
- erkannte und verifizierte Combo-Linien
- aktuelle Game Changers
- relevante ungewöhnliche oder einschränkende Spielmuster

Aussagen dürfen nur aus tatsächlich geprüften Informationen abgeleitet werden.

---

## Pflichtangaben

Die Rule-0-Kommunikation soll nach Möglichkeit immer folgende Punkte abdecken:

- geschätztes Bracket
- Hauptstrategie
- Game Changers
- Infinite- oder Loop-Combos
- Anzahl der Karten einer relevanten Combo
- Mass Land Denial
- wiederholbare Extra-Turn-Loops

Zusätzlich nennen, wenn für das Spielerlebnis relevant:

- Commander-gestützte Combo-Linien
- starke Tutor-Dichte für zentrale Combo-Teile
- Fast Mana
- Stax
- ungewöhnliche Win Conditions
- andere starke Rule-0-relevante Besonderheiten

Nicht jeden einzelnen Deckinhalt aufzählen.

---

## Bracket-Format

Das Bracket muss immer im standardisierten Format angegeben werden:

```text
Bracket X – Name
```

Beispiele:

```text
Bracket 1 – Exhibition
Bracket 2 – Core
Bracket 3 – Upgraded
Bracket 4 – Optimized
Bracket 5 – cEDH
```

Nicht verwenden:

```text
Upper Bracket 3
Lower Bracket 3
Bracket 3+
oberes Bracket 3
unteres Bracket 3
```

---

## Combo-Kommunikation

Wenn eine verifizierte Infinite- oder Loop-Combo erkannt wurde, darf niemals
behauptet werden, das Deck spiele ohne Endloskombo.

Die Combo soll kurz und verständlich beschrieben werden.

Dabei sollen mindestens genannt werden:

- Anzahl der benötigten Karten
- ob der Commander beteiligt ist
- was die Combo grundsätzlich erzeugt oder bewirkt

Beispiele:

```text
Das Deck enthält eine Drei-Karten-Endloskombo, die beliebig viele Tokens erzeugt.
```

```text
Das Deck enthält eine commander-gestützte Zwei-Karten-Endloskombo.
```

```text
Das Deck enthält mehrere kompakte Combo-Linien.
```

Die vollständige technische Combo-Anleitung gehört in den Gameplan und wird in
Rule 0 nicht wiederholt.

Wenn keine verifizierte Infinite- oder Loop-Combo erkannt wurde, soll formuliert
werden:

```text
Keine verifizierte Endloskombo im aktuellen Deckstand erkannt.
```

Nicht pauschal behaupten:

```text
ohne Endloskombo
```

wenn die Combo-Prüfung nicht zuverlässig durchgeführt wurde.

---

## Game-Changer-Kommunikation

Game Changers dürfen nur gezählt oder genannt werden, wenn sie anhand der
aktuellen Projektdaten geprüft wurden.

Die aktuelle Liste liegt unter:

```text
data/reference/commander/game-changers.json
```

Bevorzugte Formulierungen:

```text
Das Deck enthält 3 Game Changers.
```

oder:

```text
Das Deck enthält keine Game Changers.
```

Die konkreten Karten müssen in Rule 0 nur genannt werden, wenn sie für die
Einschätzung des Spielerlebnisses besonders relevant sind.

---

## Tischkommunikation

Die Rule-0-Ausgabe soll kurz genug sein, um sie vor einer Partie tatsächlich
sagen zu können.

Sie soll keine technische Analyse sein.

Bevorzugte Struktur:

1. Bracket und Strategie
2. wichtige Power- oder Spielmuster
3. Combos
4. besonders relevante Einschränkungen oder Besonderheiten

Die Standardausgabe soll in der Regel aus einem kurzen Absatz und wenigen
Stichpunkten bestehen.

---

# Ausgabeformat

# Rule 0: [Deckname]

## Tisch-Hinweis

Dieses Deck spielt auf **Bracket [X] – [Name]**.

Es ist ein [Hauptstrategie]-Deck und versucht hauptsächlich über
[kurze Beschreibung des Spielplans oder der wichtigsten Win Condition]
zu gewinnen.

Enthalten sind:

- Game Changers: [X]
- Early 2-Card Infinite Combos: [X]
- weitere verifizierte Infinite-/Loop-Combos: [X]
- Mass Land Denial: [ja / nein]
- wiederholbare Extra-Turn-Loops: [ja / nein]

[Wenn relevant: ein kurzer Satz zu Fast Mana, Stax, Tutoren oder einer
ungewöhnlichen Win Condition.]

## So kann ich es am Tisch sagen

„Ich spiele ein Bracket-[X]-[Strategie]-Deck mit [wichtigste Besonderheiten].
[Kurzer verständlicher Combo-Hinweis, falls vorhanden.]
[Kurzer Hinweis auf andere Rule-0-relevante Spielmuster, falls vorhanden.]“

---

## Ausgabeprinzipien

Die Rule-0-Kommunikation soll:

- kurz bleiben
- leicht verständlich sein
- direkt sprechbar sein
- keine vollständige Deckanalyse wiederholen
- keine ausführliche Bracket-Begründung wiederholen
- keine technische Combo-Anleitung wiederholen
- keine Optimierungsempfehlungen enthalten
- keine nicht geprüften Aussagen enthalten

Die Struktur soll für alle Decks möglichst gleich bleiben.

Nicht relevante Sonderpunkte werden weggelassen, ohne die Grundstruktur zu ändern.

---

## Keine erfundenen Aussagen

Die Rule-0-Zusammenfassung darf nur Eigenschaften nennen, die tatsächlich geprüft
wurden.

Insbesondere dürfen Aussagen wie:

- keine Endloskombo
- keine Tutoren
- kein Fast Mana
- keine Game Changers
- kein Mass Land Denial
- keine Extra-Turn-Loops

nur gemacht werden, wenn diese Punkte zuverlässig geprüft wurden.

Wenn eine Prüfung nicht zuverlässig möglich war, muss dies neutral formuliert
werden, statt eine absolute Aussage zu erfinden.

---

## Speichern

Nach Nutzerbestätigung wird die Rule-0-Kommunikation unter

```text
data/decks/saved/[deck-slug]/rule-zero.md
```

gespeichert.

Ohne Nutzerbestätigung werden keine Dateien verändert.