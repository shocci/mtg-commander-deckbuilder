# Collection Brain

## Zweck

Dieses Brain definiert, wie Collection-Daten gelesen und für Commander-Auswahl, Deckbau und Besitzprüfungen verwendet werden.

## Datenquellen

Bevorzugte strukturierte Quelle:

```text
data/collection.json
```

Fallback, falls die Collection noch nicht verarbeitet wurde:

```text
imports/manabox/ManaBox_Collection.csv
```

Wenn beide existieren, ist `data/collection.json` die Arbeitsquelle. Der Raw-Import wird nur für Import-/Debug-Aufgaben oder bei erkennbar fehlenden strukturierten Daten verwendet.

## Besitzmodell

- Die Collection beschreibt physischen Besitz.
- Decklisten beschreiben geplante oder tatsächliche Deckverwendung.
- Dieselbe physische Karte darf in mehreren Decklisten geplant sein.
- Mehrfachnutzung in Decklisten reduziert den Collection-Bestand nicht automatisch.
- Wenn physische Verfügbarkeit für mehrere gleichzeitig gebaute Decks relevant ist, muss dies ausdrücklich geprüft werden.

## Kartenidentität

Wenn vorhanden, Scryfall-ID oder Oracle-ID zur Normalisierung verwenden.

Mehrere Prints derselben Karte dürfen für funktionale Deckbaufragen als dieselbe Karte erkannt werden, solange Print-spezifische Eigenschaften nicht Teil des Auftrags sind.

Print, Set, Collector Number und Foil-Status bleiben erhalten, wenn physischer Besitz oder konkrete Ausgabe relevant ist.

## Basic Lands

Folgende Basic Lands gelten für Deckbau als automatisch verfügbar, auch wenn sie nicht vollständig eingescannt wurden:

```text
Plains
Island
Swamp
Mountain
Forest
Wastes
```

Sie:

- zählen nicht als fehlende Karten,
- zählen nicht als Neukauf,
- zählen nicht gegen ein Zusatzbudget,
- dürfen verwendet werden, wenn sie zur Farbidentität passen.

## Collection-first

Wenn der Nutzer ausdrücklich sagt:

- `aus meiner Collection`
- `Collection-first`
- `nutze meine Collection`
- oder sinngleich die Kartenwahl auf vorhandene Karten begrenzt,

dann gilt:

1. passende vorhandene Karten zuerst verwenden,
2. nicht nur Staples betrachten,
3. mechanische Synergien aus Oracle-Text und Deckkontext ableiten,
4. neue Karten nur entsprechend dem Nutzerbudget oder ausdrücklich erlaubten Ergänzungen vorschlagen,
5. fehlende Karten transparent ausweisen.

## Commander aus der Collection

Wenn nur der Commander aus der Collection stammen soll, beschränkt dies nicht automatisch die restlichen 99 Karten.

Beispiel:

```text
"Baue mir ein Deck mit einem Commander aus meiner Collection."
```

Bedeutung:

- Commander muss vorhanden sein.
- Restliche Karten folgen den sonstigen Constraints.

Das ist etwas anderes als:

```text
"Baue mir ein Deck aus meiner Collection."
```

## Commander-Kandidaten bestimmen

Für eine Commander-Auswahl aus der Collection:

1. eindeutige Karten normalisieren,
2. Commander-legal spielbare Kandidaten bestimmen,
3. Color-Identity und Sonderregeln über `brains/rules/magic-rules.md` prüfen,
4. nur tatsächlich vorhandene Kandidaten berücksichtigen,
5. bei Partner-/Background-/Doctor's-Companion-ähnlichen Mechaniken Kombinationen nur bilden, wenn der Auftrag dies erfordert.

## "Beliebtester Commander"

Wenn der Nutzer ohne weitere Definition nach dem `beliebtesten`, `populärsten` oder `meistgespielten` Commander aus seiner Collection fragt, gilt als Projektstandard:

- Community-Popularität wird über aktuelle EDHREC-Commander-Daten bestimmt.
- Es werden nur Commander berücksichtigt, die laut Collection vorhanden und aktuell Commander-legal sind.
- Der bestplatzierte Kandidat wird gewählt.
- Der verwendete Popularitätsstand bzw. die Quelle wird kurz genannt.

Wenn aktuelle EDHREC-Daten nicht verfügbar sind:

1. vorhandenen lokalen Popularitäts-Cache verwenden, falls es einen eindeutig gekennzeichneten aktuellen Cache gibt;
2. andernfalls nicht raten und transparent melden, dass die Popularitätsrangfolge aktuell nicht bestimmt werden kann.

EDHREC ist hier ein Popularitätssignal, keine Regelquelle.

## Ausgabe bei Auswahl

Mindestens ausgeben:

- gewählter Commander
- Besitznachweis aus der Collection
- verwendetes Auswahlkriterium
- bei Ranglistenaufträgen die wichtigsten Alternativen
- Unsicherheiten oder Datenlücken
