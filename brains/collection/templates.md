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

Beim Analysieren und Speichern eines Decks erzeugt die KI aus der
unveränderten ManaBox-Deckliste eine angereicherte Deckansicht.

Die originale Deckliste unter

```text
data/decks/decklists/[deck-slug].txt
```

bleibt dabei unverändert und ist weiterhin die Quelle für den
Deckinhalt.

Die KI legt die angereicherte Ansicht unter

```text
data/decks/saved/[deck-slug]/deck-view.json
```

ab.

`deck-view.json` ist abgeleitete Darstellungsinformation und keine
zweite Deckliste.

Die Erzeugung ist Teil des KI-gesteuerten Deckanalyse-/Speicherprozesses.
Sie darf nicht voraussetzen, dass `build-deck-view.ts` oder ein anderes
separates Generierungsskript ausgeführt wird. Ebenso besteht keine
Abhängigkeit von einer separaten Scryfall-API-, Bulk-Data- oder
Cache-Pipeline. Benötigte aktuelle Kartendaten ermittelt und prüft die KI
unmittelbar während dieses Prozesses. Dafür werden keine vollständigen
Scryfall-Datensätze im Projekt zwischengespeichert.

## Abgleich

Die KI verarbeitet jede Karte der Deckliste einzeln und:

1. löst Kartenname und Kartenidentität eindeutig auf,
2. liest die benötigte Anzahl aus der Deckliste,
3. prüft die vorhandene Anzahl direkt gegen `data/collection.json`,
4. behandelt Basic Lands gemäß der Basic-Land-Regel automatisch als
   vollständig vorhanden,
5. berechnet die tatsächlich fehlende und zu kaufende Anzahl,
6. ermittelt die für die Kartendarstellung benötigten Daten,
7. ordnet die Karte einer Kategorie der grafischen Deckansicht zu,
8. schreibt das Ergebnis in
   `data/decks/saved/[deck-slug]/deck-view.json`.

Zu den benötigten Kartendarstellungsdaten gehören mindestens:

- Kartenname und Kartenidentität
- benötigte, vorhandene und fehlende Anzahl
- Besitzstatus
- direkter Scryfall-Link
- geeignetes Kartenbild und, falls eindeutig verfügbar, Rückseitenbild
- aktueller EUR-Preis pro fehlendem Exemplar, wenn zuverlässig verfügbar
- Gesamtpreis der fehlenden Exemplare, wenn der Einzelpreis bekannt ist
- Kartenkategorie für die grafische Ansicht

Wenn Kartendaten nicht eindeutig oder zuverlässig bestimmt werden können,
darf die KI sie nicht raten. Sie setzt die betroffenen optionalen Werte auf
`null` und erhält die Unsicherheit für die weitere Verarbeitung.

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

Die KI verwendet ausschließlich verlässliche, zum Zeitpunkt des
Deckanalyse-/Speicherprozesses aktuelle EUR-Preise. Preise dürfen weder
geschätzt noch aus einer anderen Währung pauschal umgerechnet werden.

Wenn ein aktueller EUR-Preis zuverlässig verfügbar ist, werden angegeben:

- Preis pro fehlendem Exemplar
- Gesamtpreis der fehlenden Exemplare

Wenn kein verlässlicher aktueller EUR-Preis verfügbar ist, darf kein Preis
geraten werden. Dann werden `priceEur` und `missingTotalEur` in
`deck-view.json` als `null` gespeichert und in der Einkaufsliste
`Preis unbekannt` ausgegeben.

Preise sind nur eine Momentaufnahme des Analyse-/Speicherzeitpunkts und
keine persistente Preisquelle des Projekts.

---

# Einkaufsliste

Beim selben Deckanalyse-/Speicherprozess erzeugt die KI zusätzlich:

```text
data/decks/saved/[deck-slug]/shopping-list.md
```

Die Datei enthält ausschließlich Karten, die nach dem Abgleich mit
`data/collection.json` tatsächlich gekauft werden müssen. Eine Karte wird
aufgenommen, wenn ihre fehlende Anzahl größer als null ist. Automatisch
verfügbare Basic Lands und vollständig vorhandene Karten werden nicht
aufgeführt.

Für jede zu kaufende Karte enthält die Tabelle:

- Karte
- benötigt
- vorhanden
- kaufen
- Preis pro Stück
- Gesamtpreis

`kaufen` entspricht immer der fehlenden Anzahl. Der Kartenname wird mit der
eindeutig ermittelten direkten Scryfall-Kartenseite verlinkt. Kann kein
eindeutiger Scryfall-Link bestimmt werden, bleibt der Kartenname unverlinkt
und die Unsicherheit wird kenntlich gemacht; ein Link darf niemals geraten
werden.

Die Einkaufsliste verwendet dieses Format:

```md
# Einkaufsliste: [Deckname]

Stand: [YYYY-MM-DD]

| Karte | Benötigt | Vorhanden | Kaufen | Preis/Stk. | Gesamt |
|---|---:|---:|---:|---:|---:|
| [Rhystic Study](https://scryfall.com/...) | 1 | 0 | 1 | 39,50 € | 39,50 € |
| [Beispielkarte](https://scryfall.com/...) | 2 | 1 | 1 | Preis unbekannt | Preis unbekannt |

## Geschätzte Gesamtkosten

**Bekannte Zwischensumme: 39,50 €**

Für 1 zu kaufendes Exemplar fehlt ein verlässlicher aktueller EUR-Preis.
Die tatsächlichen Gesamtkosten sind daher nicht vollständig bekannt.
```

Für die Summierung gelten zwingend folgende Regeln:

- Die bekannte Zwischensumme enthält nur Positionen mit verlässlichem
  aktuellem EUR-Preis.
- Positionen mit `Preis unbekannt` werden nicht mit `0,00 €` angesetzt.
- Sobald mindestens ein Preis fehlt, wird die Summe als
  `Bekannte Zwischensumme` bezeichnet und ausdrücklich darauf hingewiesen,
  dass die tatsächlichen Gesamtkosten nicht vollständig bekannt sind.
- Nur wenn alle Preise bekannt sind, darf die Summe als
  `Geschätzte Gesamtkosten` ohne Einschränkung ausgewiesen werden.
- Preise und Summen werden niemals geschätzt.

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