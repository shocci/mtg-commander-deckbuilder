# ChatGPT Anweisung – MTG Commander Brain

## Rolle

Du arbeitest in einem lokalen, modularen MTG-Commander-Projekt.

Diese Datei ist nur der ChatGPT-/OpenAI-Adapter. Sie enthält keine eigene Deckbau-, Bracket-, Collection- oder Versionierungslogik.

Die gemeinsame Fachlogik liegt unter:

```text
brains/
```

## Boot-Reihenfolge

Bei einem neuen Auftrag:

1. Projektwurzel bestimmen.
2. `brains/README.md` lesen.
3. Nutzerauftrag klassifizieren.
4. Laut Routing-Tabelle nur die benötigten Brains laden.
5. Benötigte Dateien aus `data/` oder `imports/` lesen.
6. Falls aktuelle externe Daten erforderlich sind, passende aktuelle Quellen prüfen.
7. Aufgabe ausführen.
8. Dauerhafte Änderungen nur bei ausdrücklicher Freigabe schreiben.

Nicht vorsorglich alle Brains und alle Decklisten laden.

## Priorität

Bei Konflikten gilt:

1. aktuelle Nutzeranforderung für Ziel, Stil und Constraints
2. projektweite Regeln aus `brains/`
3. konkrete Projektdaten aus `data/`
4. Rohimporte aus `imports/`
5. aktuelle offizielle MTG-Daten und Oracle-Texte für externe Fakten
6. allgemeines MTG-Wissen
7. Community-Quellen

Für Regelkonformität, Legalität, Color Identity und Karteninteraktionen gelten zusätzlich die Prioritäten aus `brains/rules/magic-rules.md`. Nutzerwünsche dürfen offizielle Magic-Regeln nicht in eine falsche Legalitätsaussage umdeuten.

## Projektpfade

```text
brains/      gemeinsame Regeln, Workflows und Bewertungslogik
data/        persistente Projektdaten
imports/     externe Rohdaten
scripts/     Import-, Build- und Automatisierungsskripte
ai-context/  KI-spezifische Adapter
```

Decklisten liegen primär unter:

```text
data/decks/decklists/
```

Gespeicherte Deckauswertungen liegen unter:

```text
data/decks/saved/[deck-slug]/
```

Collection-Daten liegen bevorzugt unter:

```text
data/collection.json
```

Fallback für noch nicht verarbeitete ManaBox-Daten:

```text
imports/manabox/ManaBox_Collection.csv
```

## Decklisten-Parsing

ManaBox-Decklisten können Sektionen mit `//` enthalten.

Für Commander gilt:

- `// COMMANDER` startet den Commander-Bereich.
- Kartenzeilen bis zur nächsten Leerzeile oder Sektion gehören zum Commander-Bereich.
- Mehrere Commander sind zulässig, wenn die Regeln dies erlauben.
- Kartenzeilen haben typischerweise das Format `[Anzahl] [Kartenname]`.
- `//` innerhalb eines doppelseitigen Kartennamens ist kein Sektionswechsel.
- Sonstige Kommentar- und Sektionszeilen sind keine Karten.

Regelkonformität mehrerer Commander wird über `brains/rules/magic-rules.md` geprüft.

## Externe Daten

Aktuelle externe Daten nur dann abrufen, wenn der Auftrag sie benötigt.

Typische Quellen:

- offizielle Wizards-Seiten für Comprehensive Rules, Commander-Regeln, Banlist und Brackets
- Scryfall für Oracle-Text, Color Identity, Legalität, Prints und Preise
- EDHREC als Community-Signal für Commander-Popularität und typische Synergien

Community-Daten ersetzen keine offiziellen Regeln.

Bei dynamischen Daten wie Preisen, Brackets, Game Changers, Banlist oder Popularität immer den Aktualitätsstand beachten.

## Schreibregel

Lesen, analysieren und Vorschläge erstellen ist ohne zusätzliche Freigabe erlaubt.

Persistente Änderungen an `data/`, `brains/`, `imports/`, `docs/` oder Git erfolgen nur, wenn der Nutzer sie ausdrücklich verlangt oder einen zuvor gezeigten Änderungsvorschlag bestätigt.

Bei einer neuen Hauptversion eines bestehenden Decks zusätzlich immer `brains/deck-versioning/templates.md` verwenden.

## Antwortstil

- direkt und sachlich
- keine KI-Floskeln
- keine ungefragten Nutzerpräferenzen ableiten
- keine fehlenden Fakten erfinden
- Konflikte zwischen Auftrag, Daten, Budget, Bracket oder Regeln klar benennen
- bei vollständigen Deckbauaufträgen nicht nach Dingen fragen, für die im zuständigen Brain bereits ein definierter Standard existiert

## Beispielrouting

Auftrag:

```text
Baue mir ein Deck mit dem beliebtesten Commander in meiner Collection.
```

Erwarteter Ablauf:

1. `brains/README.md`
2. `brains/project/philosophy.md`
3. `brains/collection/templates.md`
4. `brains/deckbuilding/templates.md`
5. `brains/bracket/templates.md`
6. `brains/rules/magic-rules.md`
7. Collection laden
8. legale Commander-Kandidaten bestimmen
9. Popularität nach Collection-Brain bestimmen
10. Commander auswählen
11. Deck nach Deckbuilding-Brain bauen
12. Bracket prüfen
13. Ergebnis ausgeben
14. nur auf ausdrückliche Anweisung speichern
