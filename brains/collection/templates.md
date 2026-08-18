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

---

# Decklisten-Abgleich

Für gespeicherte oder darzustellende Decks kann aus der unveränderten
ManaBox-Deckliste eine angereicherte Deckansicht erzeugt werden.

Die originale Deckliste unter

```text
data/decks/decklists/[deck-slug].txt
```

bleibt dabei unverändert und ist weiterhin die Quelle für den
Deckinhalt.

Die angereicherte Ansicht wird unter

```text
data/decks/saved/[deck-slug]/deck-view.json
```

abgelegt.

`deck-view.json` ist abgeleitete Darstellungsinformation und keine
zweite Deckliste.

## Abgleich

Für jede Karte der Deckliste wird geprüft:

- Kartenname und Kartenidentität
- benötigte Anzahl
- vorhandene Anzahl in `data/collection.json`
- fehlende Anzahl
- automatische Verfügbarkeit als Basic Land
- Scryfall-Kartenseite
- Kartenbild
- aktueller EUR-Preis für fehlende Karten, wenn zuverlässig verfügbar
- Kartenkategorie für die grafische Ansicht

Die Collection wird für jedes Deck unabhängig geprüft.

Karten, die bereits in anderen Decklisten verwendet werden, gelten
nicht automatisch als dort physisch gebunden.

## Besitzstatus

Für die Darstellung werden folgende Zustände verwendet:

```text
collection
basic-land
partial
missing
```

Bedeutung:

- `collection`: benötigte Anzahl ist vollständig in der Collection vorhanden
- `basic-land`: Karte gilt gemäß Basic-Land-Regel automatisch als verfügbar
- `partial`: nur ein Teil der benötigten Anzahl ist vorhanden
- `missing`: benötigte Karte ist nicht ausreichend vorhanden

Bei `partial` und `missing` muss die fehlende Anzahl angegeben werden.

## Preise

Preise werden nur für fehlende Karten bzw. fehlende Exemplare benötigt.

Wenn ein aktueller EUR-Preis zuverlässig verfügbar ist, können angegeben
werden:

- Preis pro fehlendem Exemplar
- Gesamtpreis der fehlenden Exemplare

Wenn kein verlässlicher aktueller EUR-Preis verfügbar ist, darf kein Preis
geraten werden.

Dann wird der Preis als `null` gespeichert.

Preise sind nur eine Momentaufnahme und keine persistente Preisquelle des
Projekts.

## Scryfall-Links

Jede eindeutig aufgelöste Karte erhält einen direkten Link auf ihre
Scryfall-Kartenseite.

Ein Link darf nicht geraten werden.

Wenn keine eindeutige Scryfall-Karte bestimmt werden kann, bleibt der
Link `null` und die Unsicherheit muss erhalten bleiben.

## Kartenbilder

Für die grafische Deckansicht soll nach Möglichkeit eine geeignete
Scryfall-Bild-URI gespeichert werden.

Bei doppelseitigen Karten soll mindestens die Vorderseite verfügbar sein.

Wenn eine Rückseiten-URI eindeutig vorhanden ist, kann sie zusätzlich
gespeichert werden.

Bilder werden nicht als Projektdateien kopiert.

---

# Kategorien für die grafische Deckansicht

Die grafische Ansicht verwendet diese Hauptkategorien:

```text
Commander
Creatures
Artifacts
Instants
Sorceries
Enchantments
Lands
```

Jede Karte wird genau einer Kategorie zugeordnet.

Priorität:

1. Commander
2. Land → `Lands`
3. Creature → `Creatures`
4. Artifact → `Artifacts`
5. Instant → `Instants`
6. Sorcery → `Sorceries`
7. Enchantment → `Enchantments`

Dadurch wird zum Beispiel eine `Artifact Creature` unter `Creatures`
und ein `Artifact Land` unter `Lands` angezeigt.

Falls eine Karte in keine dieser Kategorien fällt, darf zusätzlich
`Other` verwendet werden.

`Other` wird nur erzeugt, wenn tatsächlich eine nicht zuordenbare Karte
im Deck vorhanden ist.

---

# Format von deck-view.json

Die Datei soll mindestens folgende Struktur unterstützen:

```json
{
  "deckSlug": "[deck-slug]",
  "sourceDecklist": "data/decks/decklists/[deck-slug].txt",
  "cards": {
    "Commander": [],
    "Creatures": [],
    "Artifacts": [],
    "Instants": [],
    "Sorceries": [],
    "Enchantments": [],
    "Lands": []
  }
}
```

Ein Karteneintrag soll mindestens enthalten:

```json
{
  "name": "Rhystic Study",
  "quantity": 1,
  "ownedQuantity": 0,
  "missingQuantity": 1,
  "availability": "missing",
  "scryfallUri": "https://scryfall.com/...",
  "imageUri": "https://...",
  "backImageUri": null,
  "priceEur": 39.5,
  "missingTotalEur": 39.5
}
```

Für eine vollständig vorhandene Karte:

```json
{
  "name": "Arcane Signet",
  "quantity": 1,
  "ownedQuantity": 1,
  "missingQuantity": 0,
  "availability": "collection",
  "scryfallUri": "https://scryfall.com/...",
  "imageUri": "https://...",
  "backImageUri": null,
  "priceEur": null,
  "missingTotalEur": null
}
```

Für automatisch verfügbare Basic Lands:

```json
{
  "name": "Island",
  "quantity": 8,
  "ownedQuantity": 8,
  "missingQuantity": 0,
  "availability": "basic-land",
  "scryfallUri": "https://scryfall.com/...",
  "imageUri": "https://...",
  "backImageUri": null,
  "priceEur": null,
  "missingTotalEur": null
}
```

Die konkrete Print-Ausgabe einer Basic-Land-Grafik ist für die
Besitzprüfung nicht relevant.

---

# Darstellungsprinzip

`deck-view.json` enthält nur Daten für die Darstellung.

Die eigentliche grafische, Moxfield-artige Kartenansicht wird durch den
Docs-Build erzeugt.

Dabei sollen:

- Karten nach Kategorie gruppiert werden,
- Karten innerhalb einer Kategorie überlappend dargestellt werden,
- Kartenbilder anklickbar sein,
- der Klick zur Scryfall-Kartenseite führen,
- vorhandene Karten als Collection markiert werden,
- bei fehlenden Karten der Preis angezeigt werden.

Die originale ManaBox-Deckliste wird dafür nicht verändert.