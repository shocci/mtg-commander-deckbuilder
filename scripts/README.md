# Scripts

Dieser Ordner enthält Automatisierungen für das MTG Commander Brain Projekt.

Scripts sollen wiederholbare Aufgaben übernehmen, z. B.:

- ManaBox Collection importieren
- Rohdaten normalisieren
- Projektdateien erzeugen
- spätere Checks oder Exporte ausführen

Die Scripts sind Hilfswerkzeuge. Die eigentlichen Projektregeln liegen in den `brains/`-Ordnern.

---

## Aktuelle Scripts

### `import-manabox.ts`

Importiert die ManaBox Collection CSV aus:

```text
imports/manabox/ManaBox_Collection.csv
```

und erzeugt daraus:

```text
data/collection.json
```

Ausführen mit:

```bash
npm run import:collection
```

---

## Erwarteter Workflow

1. Collection in ManaBox aktualisieren.
2. ManaBox Collection als CSV exportieren.
3. CSV ablegen unter:

```text
imports/manabox/ManaBox_Collection.csv
```

4. Import ausführen:

```bash
npm run import:collection
```

5. Ergebnis prüfen:

```text
data/collection.json
```

6. Änderungen committen:

```bash
git add imports/manabox/ManaBox_Collection.csv data/collection.json
git commit -m "data: ManaBox Collection aktualisieren"
git push
```

---

## Wichtige Regeln

- Scripts sollen keine dauerhaften Analysen oder Deckbewertungen ohne Nutzerbestätigung speichern.
- Scripts sollen Rohdaten nicht ungefragt überschreiben, außer der Workflow ist eindeutig dafür gedacht.
- Generierte Dateien müssen nachvollziehbar sein.
- Collection-Daten und Decklisten bleiben getrennt.
- Decklisten werden nicht automatisch aus der Collection abgeleitet.
- Karten dürfen in mehreren Decklisten vorkommen, auch wenn sie nur einmal in der Collection vorhanden sind.

---

## Dokumentation bauen

`build-docs.ts` erzeugt die statische Deckübersicht und die Detailseiten aus
Decklisten, gespeicherten Auswertungen und Collection-Daten:

```bash
npm run build:docs
```

Ausgabe:

```text
docs/index.html
docs/decks/*.html
```

Die HTML-Dateien sind generiert und sollen nicht manuell bearbeitet werden.
`docs/assets/style.css` und `docs/_config.yml` werden dagegen manuell gepflegt.

## Geplante Scripts

Mögliche spätere Erweiterungen:

```text
check-decklist.ts
```

Prüft eine ManaBox-Deckliste gegen die Collection.

```text
export-ai-context.ts
```

Erzeugt kompakte Kontextdateien für KI-Tools.

```text
normalize-decklist.ts
```

Normalisiert ManaBox-Decklisten in ein einheitliches internes Format.

```text
compare-decks.ts
```

Vergleicht mehrere Decklisten auf Überschneidungen und strategische Nähe.

```text
find-shared-cards.ts
```

Findet Karten, die in mehreren Decklisten vorkommen.

---

## Namenskonvention

Scripts sollen sprechende Namen verwenden:

```text
import-manabox.ts
check-decklist.ts
compare-decks.ts
export-ai-context.ts
```

Keine generischen Namen wie:

```text
script.ts
test.ts
main.ts
```

---

## Technische Hinweise

Das Projekt nutzt TypeScript mit `tsx`.

Ein Script wird über `package.json` verfügbar gemacht:

```json
{
  "scripts": {
    "import:collection": "tsx scripts/import-manabox.ts"
  }
}
```

Neue Scripts sollten ebenfalls dort eingetragen werden.

---

## Fehlerbehandlung

Scripts sollen bei fehlenden Dateien klare Fehlermeldungen ausgeben.

Beispiel:

```text
ManaBox CSV nicht gefunden:
imports/manabox/ManaBox_Collection.csv
```

Keine stillen Fehler.

Keine leeren Ausgabedateien erzeugen, wenn der Import fehlschlägt.
