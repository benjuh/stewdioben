# Griddy Hoops — Design Spec
_2026-05-14_

## Overview
NBA player grid game. Same concept as Griddy (NFL) — pick a player that satisfies two intersecting parameters. Separate app, orange/amber accent color, stat/award parameters replace colleges.

## Architecture
- New directory: `griddy-hoops/client/` (CRA React app, cloned from `griddy/client/`)
- Route: `/griddy-hoops`
- Vercel rewrites added for `/griddy-hoops` and `/griddy-hoops/:path*`
- Root `package.json` build script extended to also build `griddy-hoops/client`
- Hub `index.html` gets new orange game card

## Grid Parameters
4×4 grid with 3 top-axis + 3 side-axis parameters:

**Top axis (3 slots):** NBA teams (logos)

**Side axis (3 slots):**
1. 1 NBA team (logo)
2. 1 position: PG | SG | SF | PF | C
3. 1 stat/award (one picked randomly per game from pool below)

**Stat/Award pool:**
- All-Star (named to ≥1 All-Star team)
- NBA Champion (won ≥1 title)
- MVP (league MVP award)
- Finals MVP
- DPOY (Defensive Player of Year)
- Rookie of the Year
- 30+ point game (had ≥1 in career)
- 40+ point game (had ≥1 in career)
- 20+ rebound game (had ≥1 in career)
- 15+ assist game (had ≥1 in career)
- Triple-double game (had ≥1 in career)

Constraint: never pick 2 stat/award params in same game — always exactly 1.

## Player Data
File: `griddy-hoops/client/src/players.json`
~300 notable NBA players across eras.

Schema per player:
```json
{
  "name": "LeBron James",
  "teams": ["CLE", "MIA", "LAL"],
  "position": ["SF", "PF"],
  "yearsPlayed": [2003, 2024],
  "allStar": true,
  "nbaChampion": true,
  "mvp": true,
  "finalsMvp": true,
  "dpoy": false,
  "rookieOfYear": true,
  "thirtyPlusGame": true,
  "fortyPlusGame": true,
  "twentyRebGame": false,
  "fifteenAstGame": false,
  "tripleDouble": true
}
```

NBA team codes: ATL, BOS, BKN, CHA, CHI, CLE, DAL, DEN, DET, GSW, HOU, IND, LAC, LAL, MEM, MIA, MIL, MIN, NOP, NYK, OKC, ORL, PHI, PHX, POR, SAC, SAS, TOR, UTA, WAS

## Visual Design
- Accent color: `#fb923c` (orange/amber)
- Background: `#0d0d1a` (same dark as Griddy)
- Parameter boxes: `rgba(251,146,60,0.15)` bg + `rgba(251,146,60,0.5)` border
- Play cells: `#1a1a2e` bg + `#2a2a4a` border (dark, distinct from param boxes)
- Correct cell fill: `#22c55e`
- Timer: 7-segment white-glow style (copied from updated Griddy Timer.js + Timer.css)
- Header: "← Hub" back button (orange), title "GRIDDY HOOPS"
- Minimum solutions per square: 10 (same threshold as Griddy)

## Game Logic
Same as Griddy:
- Generate params, validate all 9 squares have ≥10 solutions
- Retry up to 2000× with async yields every 50 attempts
- Player search with ranked results (name.startsWith first, then token-prefix)
- Easy/Hard mode toggle (Hard hides solution counts)
- Hint system per square
- Win screen when all 9 filled

Intersection logic additions for stat params:
- `allStar`, `nbaChampion`, etc. are boolean fields — player qualifies if `player[statKey] === true`
- Position check: `player.position.includes(param.content)`

## Files to Create
- `griddy-hoops/client/` — full CRA app (copy griddy structure)
- `griddy-hoops/client/src/players.json` — curated NBA player data
- `griddy-hoops/client/src/defaults.js` — NBA teams, positions, stat params
- `griddy-hoops/client/src/Grid.js` — adapted grid with stat param support
- `griddy-hoops/client/src/player.js` — player search (same logic)
- `griddy-hoops/client/src/Timer.js` — copied from updated griddy
- `griddy-hoops/client/src/styles/Timer.css` — copied from updated griddy
- NBA team logo assets (30 teams)

## Files to Modify
- `vercel.json` — add griddy-hoops rewrites
- `package.json` (root) — extend build script
- `index.html` (hub) — add Griddy Hoops card (orange)
- `style.css` (hub) — add `game-card--orange` variant
