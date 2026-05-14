# Agent Handoff — stewdioben
_Last updated: 2026-05-14_

## Repo
`/Users/benjamin/code/repos/stewdioben` — deployed on Vercel, main branch auto-deploys.
Build command (Vercel): `npm run build` in root → `cd griddy/client && npm install && CI=false npm run build`

## What was completed this session

### Bug fixes (committed: 6a0937c)
1. **Griddy favicon** — removed `favicon.ico` fallback from `griddy/client/public/index.html`, SVG sole favicon (v4)
2. **Player search ranking** — `player.js` rank fn: 0=exact, 1=name.startsWith(q), 2=token-prefix, 3=contains
3. **Stewordle dark-only** — removed `body.light` CSS, `.theme-toggle` CSS+button+JS block, `isLight` color map. Title 28→32px.
4. **Griddy timer** — 7-segment style with ghost "88:88" + overlay. White glow. Semi-transparent grey bg. See `griddy/client/src/Timer.js` + `styles/Timer.css`.

## Next task: Griddy Hoops (NBA grid game)

**Status:** Partially scaffolded. `griddy-hoops/client/` directory exists with `package.json`, `public/`, `src/` subdirs but files are NOT all written and NOT committed yet.

**Read the full plan:** `docs/superpowers/plans/2026-05-14-griddy-hoops.md`
**Read the spec:** `docs/superpowers/specs/2026-05-14-griddy-hoops-design.md`

### What still needs to be done (all of it — start fresh):

**Step 1 — Check/create scaffold files** (Tasks 1-3 in plan):
```bash
ls griddy-hoops/client/public/
ls griddy-hoops/client/src/
ls griddy-hoops/client/src/assets/NBA_TEAMS/ 2>/dev/null | wc -l
```
Any missing files from the plan should be created. Key files needed:
- `griddy-hoops/client/package.json` ✓ (may exist)
- `griddy-hoops/client/public/index.html`
- `griddy-hoops/client/public/manifest.json`
- `griddy-hoops/client/public/favicon.svg` (basketball SVG)
- `griddy-hoops/client/src/index.js`
- `griddy-hoops/client/src/styles/index.css`
- `griddy-hoops/client/src/styles/App.css`
- `griddy-hoops/client/src/defaults.js` (NBA teams, positions, stat params)
- `griddy-hoops/client/src/assets/NBA_TEAMS/*.svg` (30 team SVGs)
- `griddy-hoops/client/src/assets/User.png` (copy from `griddy/client/src/assets/User.png`)

**Step 2 — NBA player data** (Task 4): Create `griddy-hoops/client/src/players.json` with 500+ players. Schema and seed data in the plan.

**Step 3 — React components** (Tasks 5-9):
- `App.js` — imports players.json directly (no API fetch)
- `Grid.js` — NBA grid with stat param logic (key new code in plan)
- `player.js` — adapt from `griddy/client/src/player.js` (swap NFL→NBA logos, remove colleges)
- `Hints.js` + `styles/Hints.css` — copy from `griddy/client/src/`
- `Timer.js` + `styles/Timer.css` — copy from `griddy/client/src/` (7-segment style)
- CSS files — orange (#fb923c) color scheme, param boxes: `rgba(251,146,60,0.15)` bg + `rgba(251,146,60,0.5)` border

**Step 4 — Hub + routing** (Tasks 10-12):
- `index.html` (root hub): replace "MORE SOON" ghost card with orange Griddy Hoops card
- `style.css` (root): add `.game-card--orange` variant
- `vercel.json`: add `/griddy-hoops` and `/griddy-hoops/:path*` rewrites
- `package.json` (root): extend build script to also build griddy-hoops/client
- Build: `cd griddy-hoops/client && npm install && CI=false npm run build`
- Push to main

## Key design decisions (don't change these)
- Orange accent: `#fb923c`
- Param boxes: `rgba(251,146,60,0.15)` bg + `1px solid rgba(251,146,60,0.5)` border
- Timer: copy exact files from griddy (7-segment white glow, ghost "88:88")
- Side axis: 1 NBA team + 1 position (PG/SG/SF/PF/C) + 1 stat/award (one per game, NOT two)
- Stat params (exactly 11): allStar, nbaChampion, mvp, finalsMvp, dpoy, rookieOfYear, thirtyPlusGame, fortyPlusGame, twentyRebGame, fifteenAstGame, tripleDouble
- Grid solve logic: `matchesParam(player, param)` helper — clean, no giant if/else
- Players loaded via direct JSON import in App.js (not API)
- MINIMUM_SOLUTIONS = 10 per square

## After Griddy Hoops: Net-work (chain game)
Connect two athletes through shared teammates. Not yet designed — brainstorm with user first.

## Codebase structure
```
stewdioben/
  index.html          — hub page
  style.css           — hub CSS
  vercel.json         — Vercel routing
  package.json        — root build script
  stewordle/          — vanilla JS wordle (dark only now)
  griddy/client/      — CRA React NFL grid game (reference for griddy-hoops)
  griddy-hoops/client/— CRA React NBA grid game (IN PROGRESS)
  api/players.js      — Vercel serverless (NFL only, hoops doesn't need one)
  docs/
    handoff.md        — this file
    superpowers/plans/2026-05-14-griddy-hoops.md  — full implementation plan
    superpowers/specs/2026-05-14-griddy-hoops-design.md — design spec
```

## Vercel routing (current vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "redirects": [{ "source": "/stewordle", "destination": "/stewordle/", "permanent": false }],
  "rewrites": [
    { "source": "/griddy",        "destination": "/griddy/client/build/index.html" },
    { "source": "/griddy/:path*", "destination": "/griddy/client/build/:path*" }
  ]
}
```
Add the `/griddy-hoops` rewrites.

## User preferences
- Dark theme only (light theme removed from stewordle)
- Commits to main, push when ready
- Caveman communication style (terse, no filler)
