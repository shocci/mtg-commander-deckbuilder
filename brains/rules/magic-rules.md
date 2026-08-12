# Magic Comprehensive Rules

## Zweck

Diese Datei definiert die verbindliche Regelbasis für alle Magic:
The Gathering bezogenen Prüfungen im Projekt.

Sie gilt insbesondere für:

- Deckbau
- Deckanalyse
- Combo-Prüfungen
- Karteninteraktionen
- Commander-Legalität
- Color Identity
- Partner und andere Multi-Commander-Mechaniken
- Timing und Priority
- Trigger
- Replacement Effects
- State-Based Actions
- Layers
- Copy Effects
- alternative und zusätzliche Kosten
- X-Kosten
- Commander-Zonenwechsel
- Infinite Loops

## Lokale Regelkopie

Die automatisch aktualisierte lokale Kopie der Comprehensive Rules liegt unter:

`imports/wizards/rules/comprehensive-rules.txt`

Metadaten zur verwendeten Version liegen unter:

`imports/wizards/rules/metadata.json`

Für Regelprüfungen soll diese lokale Datei verwendet werden, sofern die
Metadaten bestätigen, dass sie erfolgreich aus der offiziellen
Wizards-Quelle aktualisiert wurde.

## Verbindliche Quelle

Für Regelfragen ist immer die aktuell veröffentlichte Version der
Magic: The Gathering Comprehensive Rules von Wizards of the Coast
maßgeblich.

Offizielle Einstiegsseite:

https://magic.wizards.com/en/rules

Es soll nicht dauerhaft auf eine datierte PDF-Version verwiesen werden.

Wenn eine aktuelle Regelprüfung notwendig ist, muss die jeweils aktuell
veröffentlichte Fassung der Comprehensive Rules verwendet werden.

## Quellenpriorität

Bei der Prüfung einer Karteninteraktion gilt folgende Reihenfolge:

1. aktueller Oracle-Text der betroffenen Karten
2. aktuelle Magic Comprehensive Rules
3. aktuelle Commander-Formatregeln
4. aktuelle Commander-Banlist und Sonderbeschränkungen
5. offizielle Karten-Rulings
6. eigene Interpretation

Eine eigene Interpretation darf den offiziellen Regeln oder dem
aktuellen Oracle-Text nicht widersprechen.

Offizielle Commander-Übersicht einschließlich aktueller Banlist:

https://magic.wizards.com/en/formats/commander

Formatlegalität und Sonderbeschränkungen müssen getrennt von der
allgemeinen Kartenlegalität geprüft werden. Dazu gehören insbesondere
Einschränkungen wie `banned as companion`.

Das Commander-Bracket-System ist eine optionale Einordnung des
erwarteten Spielerlebnisses. Es ersetzt weder Comprehensive Rules noch
Formatregeln oder Banlist.

## Regelprüfung

Wenn eine Deckanalyse, Deckbauentscheidung oder Combo von einer
bestimmten Regelinteraktion abhängt, muss diese Interaktion geprüft
werden.

Bei relevanten oder nicht offensichtlichen Interaktionen soll nach
Möglichkeit die entsprechende Regelnummer angegeben werden.

Wenn eine Interaktion nicht eindeutig verifiziert werden kann, darf sie
nicht als sicher funktionierend dargestellt werden.

## Aktualität

Die Regeln sind nicht statisch.

Bei Regelprüfungen muss deshalb immer berücksichtigt werden, dass sich
die Comprehensive Rules seit einer früheren Analyse geändert haben
können.

Eine lokal gespeicherte Regelkopie darf nur verwendet werden, wenn
sichergestellt ist, dass sie der aktuell veröffentlichten Fassung
entspricht.
