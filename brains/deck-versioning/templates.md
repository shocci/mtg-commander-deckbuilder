# Deck Versioning Template

## Zweck

Dieses Brain definiert, wie bestehende Commander/EDH Decks versioniert werden, wenn der Nutzer eine neue Deckliste für ein bereits vorhandenes Deck einreicht.

Ziel ist, alte Hauptversionen nachvollziehbar zu archivieren, neue Hauptversionen sauber zu analysieren und unbeabsichtigtes Überschreiben zu vermeiden.

## Grundprinzipien

- Die aktuelle Hauptdeckliste liegt unter `data/decks/decklists/[deck-slug].txt`.
- Gespeicherte aktuelle Auswertungen liegen unter `data/decks/saved/[deck-slug]/`.
- Alte Hauptversionen werden unter `data/decks/saved/[deck-slug]/versions/` archiviert.
- Alternative Builds bleiben unter `data/decks/saved/[deck-slug]/variants/`.
- Versionen und Varianten sind getrennte Konzepte.
- Keine Datei darf ohne ausdrückliche Bestätigung geändert, erstellt oder überschrieben werden.

## Unterschied zwischen Version und Variante

### Version

Eine Version ist eine frühere oder spätere Entwicklungsstufe desselben Hauptdecks.

Beispiele:

- Das Vivi-Hauptdeck wurde überarbeitet.
- Die Manabase wurde geändert.
- Win Conditions wurden angepasst.
- Powerlevel oder Bracket haben sich verändert.
- Das Deck bleibt aber dieselbe Hauptidee.

Speicherort:

```text
data/decks/saved/[deck-slug]/versions/v001.md
```

## Übertragungslisten

Eine Übertragungsliste ist eine temporäre Deckliste, die als neue Hauptversion eines bestehenden Decks dienen soll.

Beispiel:

```text
data/decks/decklists/vivi-storm.txt
```

wird verwendet, um das bestehende Deck

```text
data/decks/decklists/vi-oh-no.txt
```

zu aktualisieren.

Nach erfolgreicher und bestätigter Versionierung gilt:

1. Die alte Hauptdeckliste wird unter `versions/vXXX.md` archiviert.
2. Die Übertragungsliste ersetzt die bisherige Hauptdeckliste.
3. Die Analyse-, Bracket- und Gameplan-Dateien werden aktualisiert.
4. Die Übertragungsliste wird gelöscht.
5. `docs/` wird neu generiert.

Die Übertragungsliste darf erst gelöscht werden, wenn die Versionierung bestätigt und erfolgreich übernommen wurde.

Vor dem Speichern muss die KI klar anzeigen:

```text
Wird gelöscht:
data/decks/decklists/[transfer-list].txt
```