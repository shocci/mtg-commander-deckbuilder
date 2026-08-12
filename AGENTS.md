# MTG Commander Brain – Agent Entry Point

## Zweck

Diese Datei ist der technische Einstiegspunkt für Repository-Agenten.

Sie enthält keine MTG-Fachlogik. Die gemeinsame Fachlogik liegt unter `brains/`.

## Start

1. Lies `ai-context/chatgpt/anweisung.md`, wenn du als OpenAI-/ChatGPT-/Codex-Agent arbeitest.
2. Lies anschließend `brains/README.md`.
3. Klassifiziere den Nutzerauftrag anhand der Routing-Tabelle dort.
4. Lade nur die für den Auftrag benötigten Brains und Projektdaten.
5. Führe die Aufgabe vollständig aus.

## Schreibschutz

Projektdateien dürfen nur dauerhaft geändert werden, wenn der Nutzer dies im aktuellen Auftrag ausdrücklich verlangt oder eine vorgeschlagene Änderung ausdrücklich bestätigt.

Beispiele für eine ausdrückliche Freigabe:

- `speichern`
- `übernehmen`
- `so übernehmen`
- `final`
- `pushen`
- eine konkrete Anweisung wie `ändere die Datei ...`

Ohne Freigabe bleiben Analyse, Deckvorschlag, Bracket-Einschätzung und Gameplan Arbeitsstände.

## Grundsatz

Keine Fachregeln in dieser Datei duplizieren.

Wenn sich Fachlogik ändert, wird das zuständige Brain unter `brains/` angepasst.
