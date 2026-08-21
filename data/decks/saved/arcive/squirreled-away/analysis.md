# Squirreled Away – Analyse

## Kurzprofil

- Commander: Hazel of the Rootbloom
- Farben: Golgari
- Hauptstrategie: Squirrel-/Token-Aristocrats
- Deckgröße: 100 Karten
- Geschätztes Bracket: 2 – Core
- Erwarteter Siegzeitraum: Zug 8–10

## Legalitäts- und Regelcheck

100 Karten, Singleton und Golgari-Color-Identity sind erfüllt; keine enthaltene Karte steht auf der aktuellen Commander-Banlist.

## Spielplan und Kartenpakete

Hazel macht Token zu Manaquellen und kopiert am End Step einen Token. Academy Manufactor, Tireless Provisioner und Gilded Goose erzeugen Ressourcen; Chatterfang, Deep Forest Hermit, Chitterspitter und Squirrel Nest bauen Kreaturenmasse auf. Nadier's Nightblade, Poison-Tip Archer, Bastion of Remembrance und Zulaport Cutthroat wandeln Todesfälle in Schaden um. Skullclamp, Moldervine Reclamation, Morbid Opportunist, Idol of Oblivion und Plumb the Forbidden liefern Karten.

Beastmaster Ascension und End-Raze Forerunners schließen über Combat ab; Aristocrats-Payoffs erlauben einen zweiten Angriffsvektor. Squirrel Nest bildet ohne Earthcraft keine Endloskombo.

## Combo- und Loop-Audit

### Hazel's Brewmaster + Gourmand's Talent + Academy Manufactor + Gilded Goose

- **Boardstate:** Die drei Permanents liegen im Spiel, Hazel's Brewmaster hat Gilded Goose aus einem Friedhof ins Exil geschickt, es ist der eigene Zug und mindestens ein zusätzliches Food ist ungetappt. Für den Start werden {1}{G} benötigt.
- **Regelinteraktion:** Gourmand's Talent macht im eigenen Zug alle eigenen Artefakte zusätzlich zu Foods. Dadurch besitzen über Hazel's Brewmaster auch Clues und Treasures die beiden aktivierten Fähigkeiten von Gilded Goose.
- **Ablauf:** Ein Food wird für {1}{G} getappt, um ein Food zu erzeugen; Academy Manufactor ersetzt das durch ein Food, einen Clue und einen Treasure. Zwei dieser neuen Artefakte werden jeweils getappt und als Food geopfert, um zusammen wieder {1}{G} zu erzeugen. Das dritte Artefakt startet die nächste Wiederholung.
- **Ergebnis:** beliebig viele getappte Food-, Clue- und Treasure-Token sowie beliebig viele Artefakt-ETBs. Ohne zusätzlichen Payoff gewinnt die Schleife nicht sofort, erzeugt aber eine beliebig große Ressourcengrundlage für den nächsten Zug.
- **Commander beteiligt:** nein.
- **Interaktionspunkte:** Removal auf jedes der vier Teile, Friedhofsinteraktion vor dem Exilieren von Gilded Goose oder das Unterbinden aktivierter Fähigkeiten stoppt die Linie.
- **Auffindbarkeit:** niedrig. Vier konkrete Karten, vorbereiteter Friedhof und fehlende dichte Tutor-Suite machen sie deutlich langsamer und seltener als eine typische kompakte Combo.

## Stärken

- Viele redundante Token- und Todes-Payoffs.
- Gute Value-Engine und mehrere Finisher.
- Hazel skaliert sowohl Mana als auch Tokenqualität.

## Schwächen

- Stark board- und commanderabhängig.
- Graveyard-Hate und Exile-Sweeper umgehen viele Death-Trigger-Pläne.
- Wenig Schutz; Aufbau ist sichtbar und störbar.

## Gesamturteil

Ein starkes Precon-nahes Token-Aristocrats-Deck mit guten Synergien und einer echten, aber sehr mehrteiligen Artefakt-Token-Schleife. Ohne schnelle Combo oder Tutor-Konsistenz bleibt die Liste Bracket 2.

## Quellenstand

- `../../../../../brains/deck-analysis/templates.md`
- Commander Spellbook API 6.1.1, vollständiger Combo-Abgleich am 13. August 2026
- Entscheidende Oracle-Kartentexte über Scryfall geprüft am 13. August 2026
- Deckliste: `data/decks/decklists/squirreled-away.txt`
