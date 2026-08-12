# Counter Blitz – Analyse

## Kurzprofil

- Commander: Tidus, Yuna's Guardian
- Farben: Bant
- Hauptstrategie: +1/+1-Marken, Proliferate und Combat-Value
- Deckgröße: 100 Karten
- Geschätztes Bracket: 3 – Upgraded
- Erwarteter Siegzeitraum: Zug 7–9

## Legalitäts- und Regelcheck

100 Karten, Singleton und Bant-Color-Identity sind erfüllt; keine enthaltene Karte ist aktuell in Commander gebannt. Tidus bewegt zu Beginn des eigenen Combats eine Marke zwischen zwei eigenen Kreaturen. Sein Cheer-Trigger zieht und proliferiert nur einmal pro Zug, auch wenn mehrere passende Kreaturen Kampfschaden zufügen.

## Spielplan und Kartenpakete

Hardened Scales, Forgotten Ancient, Path of Discovery, Fathom Mage, Gyre Sage und Incubation Druid bauen Marken und Ressourcen auf. Tidus verschiebt Marken auf passende Ziele und proliferiert nach Kampfschaden. Resourceful Defense, Nesting Grounds und Together Forever erhöhen die Flexibilität. Summons und größere Kreaturen bilden Payoffs; Inspiring Call und Protection Magic schützen das Board.

Farewell und Damning Verdict sind starke Resets. Walking Ballista dient als skalierbarer Removal-/Reach-Payoff und bildet mit Gatta and Luzzu sowie Hardened Scales eine verifizierte Drei-Karten-Endlosschleife.

## Combo- und Loop-Audit

### Gatta and Luzzu + Hardened Scales + Walking Ballista

- **Boardstate:** Hardened Scales und Walking Ballista mit mindestens zwei +1/+1-Marken liegen im Spiel. Gatta and Luzzu wird für {2}{W} gewirkt und wählt Walking Ballista für den ETB-Effekt; die Schleife muss noch in diesem Zug ausgeführt werden.
- **Ablauf:** Eine Marke wird von Walking Ballista entfernt, um ihr selbst 1 Schaden zuzufügen. Gatta and Luzzu verhindert den Schaden und legt stattdessen eine +1/+1-Marke; Hardened Scales erhöht das auf zwei Marken. Anschließend wird eine Marke entfernt, um einem beliebigen Ziel 1 Schaden zuzufügen. Damit ist der Ausgangszustand wiederhergestellt.
- **Ergebnis:** beliebig viel Schaden und beliebig viele +1/+1-Marken auf Walking Ballista.
- **Commander beteiligt:** nein.
- **Regelcheck:** echte, freiwillig wiederholbare Endlosschleife. Das Entfernen der Marken sind Kosten; Removal auf eine der drei Karten oder das Verhindern der aktivierten Fähigkeit unterbricht die Linie.
- **Auffindbarkeit:** gering bis mittel. Die Liste besitzt keine dichte Tutor-Suite und benötigt drei konkrete Karten; deshalb ist die Linie ein seltener Alternativsieg und kein verlässlicher früher Hauptplan.

## Stärken

- Hohe Synergiedichte und viele redundante Markenquellen.
- Kartenvorteil ist direkt mit dem normalen Combat-Plan verbunden.
- Gute flexible Interaktion und Board-Schutz.

## Schwächen

- Benötigt Kreaturen mit Marken und erfolgreichen Kampfschaden.
- Boardwipes vor dem Schutzaufbau sind schwer zu verkraften.
- Wenig Evasion; breite Tokenboards können Cheer verhindern.

## Gesamturteil

Ein aufgewertetes Marken-Precon mit einem Game Changer, guter Redundanz, solider Interaktion und einer echten, aber wenig konsistenten Drei-Karten-Endlosschleife. Die Einstufung bleibt Bracket 3, weil die Kombination nicht früh oder zuverlässig auffindbar ist und die Liste weiterhin überwiegend über Combat gewinnt.

## Quellenstand

- `brains/deck-analysis/templates.md`
- Commander Spellbook API 6.1.1, vollständiger Combo-Abgleich am 13. August 2026
- Entscheidende Oracle-Kartentexte über Scryfall geprüft am 13. August 2026
- Deckliste: `data/decks/decklists/counter-blitz.txt`
