# Commander Bracket System

## Regelbasis

Regelabhängige Combo- und Interaktionsbewertungen müssen
`brains/rules/magic-rules.md` entsprechen.

## Zweck

Dieses Brain dient zwei Aufgaben:

1. Analyse vorhandener Commander-Decks
2. Orientierung beim Erstellen neuer Commander-Decks

Die Bracket-Einschätzung soll nicht nur einzelne starke Karten bewerten, sondern das gesamte erwartete Spielerlebnis:

- Spieltempo
- Deckabsicht
- Konsistenz
- Win Conditions
- Interaktion
- Game Changers
- Combo-Potenzial
- Mass Land Denial
- Extra Turns
- cEDH-Orientierung

## Quellen

Aktuelle Referenzen:

- https://magic.wizards.com/de/news/announcements/introducing-commander-brackets-beta
- https://magic.wizards.com/de/news/announcements/commander-brackets-beta-update-october-21-2025
- https://magic.wizards.com/en/formats/commander

Bei Analysen mit Internetzugriff sollen diese Quellen oder offizielle Nachfolgeseiten erneut geprüft werden, da Brackets und Game Changers aktualisiert werden können.

---

# Bracket Übersicht

## Bracket 1: Exhibition / Zurschaustellung

Ziel:

Ein stark thematisches, ungewöhnliches oder experimentelles Deck, bei dem Konzept und Präsentation wichtiger sind als Powerlevel.

Erwartung:

- Thema steht über Effizienz
- Siegbedingungen sind thematisch oder bewusst schwächer
- das Deck soll seine Idee zeigen können
- sehr casual
- erwartete Partiezeit: mindestens ungefähr 9 Züge

Deckbau-Richtlinie:

- keine Game Changers, außer ausdrücklich per Rule-0-Kontext gewünscht
- keine schnellen oder geplanten Zwei-Karten-Endloskombos
- keine Mass Land Denial Strategie
- keine wiederholbaren Extra-Turn-Schleifen
- Powerlevel ist zweitrangig

Geeignet für:

- Flavor-Decks
- Artwork-Themen
- Lore-Decks
- absurde Einschränkungen
- experimentelle Deckideen

---

## Bracket 2: Core / Basisstufe

Ziel:

Ein einfaches, nicht voll optimiertes Commander-Deck mit erkennbarem Spielplan und sozialem, entspanntem Spielgefühl.

Erwartung:

- nicht vollständig optimiert
- einige Karten können aus Kreativitäts-, Flavor- oder Spaßgründen enthalten sein
- Win Conditions sind sichtbar, inkrementell und störbar
- wenig Druck
- jedes Deck soll seinen Plan zeigen können
- erwartete Partiezeit: mindestens ungefähr 8 Züge

Deckbau-Richtlinie:

- keine Game Changers
- keine schnellen oder geplanten Zwei-Karten-Endloskombos
- keine Mass Land Denial Strategie
- keine wiederholbaren Extra-Turn-Schleifen
- keine cEDH-orientierte Optimierung

Geeignet für:

- Casual Decks
- thematische Commander
- leicht verbesserte Decks
- Decks mit bewusstem Powerlimit

---

## Bracket 3: Upgraded / Aufgewertet

Ziel:

Ein stärkeres Commander-Deck mit klarer Synergie, höherer Kartenqualität und aktivem Spielplan, aber noch nicht vollständig optimiert.

Erwartung:

- starke Synergien
- hohe Kartenqualität
- effektive Interaktion möglich
- Game Changers können vorkommen
- große, spielentscheidende Turns sind möglich
- proaktive und reaktive Spielzüge
- erwartete Partiezeit: mindestens ungefähr 6 Züge

Deckbau-Richtlinie:

- bis zu 3 Game Changers
- keine typischen frühen Zwei-Karten-Endloskombos
- keine Mass Land Denial Strategie
- Extra Turns nur, wenn sie nicht als wiederholbare Schleife geplant sind
- nicht vollständig auf maximale Effizienz optimiert

Geeignet für:

- bewusst verbesserte Commander-Decks
- starke Synergiedecks
- viele persönliche Commander-Brews
- Decks mit einzelnen starken Staples
- nicht-cEDH High-Casual

---

## Bracket 4: Optimized / Optimiert

Ziel:

Ein sehr starkes, konsistentes und schnelles Commander-Deck, das nicht zwingend cEDH-Metagame-orientiert ist.

Erwartung:

- tödlich, konstant und schnell
- effiziente Win Conditions
- starke Tutoren möglich
- schnelles Mana möglich
- Free Interaction möglich
- viele oder unbegrenzte Game Changers möglich
- explosive Spielverläufe
- erwartete Partiezeit: mindestens ungefähr 4 Züge

Deckbau-Richtlinie:

- Game Changers unbegrenzt erlaubt
- starke Kombos erlaubt
- Mass Land Denial möglich
- effiziente Tutoren möglich
- Fast Mana möglich
- nicht zwingend cEDH-Metagame-optimiert

Geeignet für:

- starke optimierte Casual-Decks
- High-Power Commander
- schnelle Combo-/Engine-Decks
- Decks mit vielen effizienten Staples

---

## Bracket 5: cEDH

Ziel:

Kompetitives Commander mit Fokus auf Metagame, Effizienz, optimierte Lines und Gewinnmaximierung.

Erwartung:

- auf cEDH-Metagame abgestimmt
- maximale Effizienz
- sehr hohe Konsistenz
- schnelle oder stark geschützte Win Conditions
- geringe Fehlertoleranz
- kompetitive Mentalität
- Partien können in jedem Zug enden

Deckbau-Richtlinie:

- Game Changers unbegrenzt erlaubt
- effiziente Kombos erlaubt
- Fast Mana erlaubt
- Free Interaction erlaubt
- starke Tutoren erlaubt
- Deckbau orientiert sich an cEDH-Metagame, etablierten Listen oder kompetitiven Tools

Geeignet für:

- cEDH
- Turnierorientierte Listen
- maximale Optimierung
- keine Casual-Rücksichtnahme außerhalb der offiziellen Banlist

---

# Game Changers

## Funktion

Game Changers sind Karten, die Commander-Partien stark verzerren können.

Sie können:

- enorme Ressourcen erzeugen
- Partien stark beschleunigen
- Gegner am Spielen hindern
- sehr effizient nach den besten Karten suchen
- Spielpläne stark vereinheitlichen
- Casual-Partien deutlich unangenehmer machen

## Bracket-Regel

- Bracket 1: keine Game Changers
- Bracket 2: keine Game Changers
- Bracket 3: maximal 3 Game Changers
- Bracket 4: unbegrenzt
- Bracket 5: unbegrenzt

## Aktuelle Game-Changer-Liste

Die aktuelle Game-Changer-Liste liegt unter:

`data/reference/commander/game-changers.json`

Diese Datei wird über `npm run update:rules` aus einer offiziellen
Wizards-Quelle aktualisiert.

Die Liste darf nicht aus älteren Brain-Inhalten oder Modellwissen
rekonstruiert werden.

---

# Analyse-Anweisung

Wenn ein Deck analysiert wird, prüfe:

## 1. Game Changers

- Welche Game Changers sind enthalten?
- Wie viele sind enthalten?
- Sind sie zentrale Teile des Spielplans oder nur einzelne starke Karten?
- Verschieben sie das Deck automatisch in Bracket 3 oder höher?

## 2. Spieltempo

Schätze, ab welchem Zug das Deck realistisch relevant gewinnen oder das Spiel stark dominieren kann.

Orientierung:

- Bracket 1: ca. Zug 9+
- Bracket 2: ca. Zug 8+
- Bracket 3: ca. Zug 6+
- Bracket 4: ca. Zug 4+
- Bracket 5: jeder Zug möglich

## 3. Win Conditions

Prüfe:

- inkrementelle Win Conditions
- großer Finisher-Turn
- Zwei-Karten-Endloskombo
- Commander Damage
- Aristocrats
- Burn
- Storm
- Reanimator
- Combat Overrun
- Alternative Win Condition
- Thassa's Oracle / Lab-Maniac-artige Win Condition

## 4. Konsistenz

Prüfe:

- Wie zuverlässig findet das Deck seine Engines?
- Wie abhängig ist das Deck vom Commander?
- Gibt es redundante Effekte?
- Gibt es viele Karten, die denselben Plan unterstützen?
- Gibt es effiziente Tutoren oder starke Card-Selection?

Hinweis:

Tutoren sind nicht mehr pauschal eingeschränkt. Effiziente Tutoren zählen aber als Game Changers, wenn sie auf der offiziellen Liste stehen.

## 5. Interaktion

Prüfe:

- Removal
- Boardwipes
- Counterspells
- Protection
- Free Interaction
- Stax-Effekte
- Mass Land Denial

## 6. Deckabsicht

Die Absicht ist relevant.

Ein Deck kann technisch starke Karten enthalten, aber thematisch oder experimentell gebaut sein. Trotzdem müssen Game Changers, schnelle Kombos und erwartete Siegzüge transparent benannt werden.

---

# Ausgabeformat für Analysen

# Bracket Einschätzung: [Deckname]

## Ergebnis

**Geschätztes Bracket:** [1–5]  
**Sicherheit:** [niedrig / mittel / hoch]

## Kurzbegründung

[2–4 Sätze]

## Game Changer Check

Anzahl Game Changers: [X]

Gefundene Game Changers:

- ...

Auswirkung:

- ...

## Spielplan

[Kurze Beschreibung, wie das Deck vermutlich gewinnen möchte.]

## Geschwindigkeit

Erwarteter relevanter Sieg-/Dominanzbereich:

- ca. Zug [X]

## Faktoren, die das Bracket erhöhen

- ...

## Faktoren, die das Bracket senken

- ...

## Unsicherheiten

- ...

## Empfehlung

Dieses Deck sollte aktuell als Bracket [X] kommuniziert werden.

Falls es für ein niedrigeres Bracket gebaut werden soll:

- ...
- ...

Falls es für ein höheres Bracket optimiert werden soll:

- ...
- ...

## Rückfrage

Passt diese Einschätzung für dich und soll sie gespeichert werden?

---

# Ausgabeformat für Deckbau

# Bracket-Ziel für neues Deck

## Ziel-Bracket

[Bracket 1–5]

## Erlaubt

- Game Changers: [0 / bis zu 3 / unbegrenzt]
- Fast Mana: [nein / eingeschränkt / ja]
- effiziente Tutoren: [nein / eingeschränkt / ja]
- Zwei-Karten-Endloskombos: [nein / spät / ja]
- Mass Land Denial: [nein / ja]
- Extra-Turn-Schleifen: [nein / ja]

## Deckbau-Leitlinie

[Wie das Deck gebaut werden soll, damit es zum Ziel-Bracket passt.]

## Konflikte mit Nutzerwunsch

Falls der Nutzerwunsch nicht zum Ziel-Bracket passt, klar benennen.

Beispiel:

Der Nutzer möchte Bracket 2, aber die Liste enthält Jeska's Will und Rhystic Study. Dadurch ist das Deck nach Game-Changer-Regel mindestens Bracket 3.
