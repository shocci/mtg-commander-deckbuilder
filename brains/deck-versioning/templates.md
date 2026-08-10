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