# Agent Handoff — stewdioben
_Last updated: 2026-05-14_

## Repo
`/Users/benjamin/code/repos/stewdioben` — deployed on Vercel, main branch auto-deploys.

## What was completed this session

### Bug fixes (committed: 6a0937c)
1. **Griddy favicon** — removed `favicon.ico` fallback from `griddy/client/public/index.html`, SVG now sole favicon (v4)
2. **Player search ranking** — `player.js` rank fn now: 0=exact, 1=name.startsWith(q), 2=token-prefix, 3=contains
3. **Stewordle dark-only** — removed `body.light` CSS block, `.theme-toggle` CSS, toggle `<button>` from HTML, theme toggle JS block (lines ~17598-17609), and `isLight` color map in `_updateKeyboard`. Hardcoded dark colors. Title enlarged 28→32px, letter-spacing 6→8px.
4. **Griddy timer** — 7-segment style: ghost "88:88" + actual digits overlay. White text with white glow. Semi-transparent grey bg. See `Timer.js` + `styles/Timer.css` in `griddy/client/src/`.

### Build note
Griddy client is NOT committed — Vercel builds it on deploy via root `package.json` `build` script (`cd griddy/client && npm install && CI=false npm run build`).

## Next tasks (in order)

### 1. Griddy Hoops — NBA grid game
**Status:** Spec written and approved. Ready to implement.
**Spec:** `docs/superpowers/specs/2026-05-14-griddy-hoops-design.md`

Summary:
- New CRA React app at `griddy-hoops/client/`
- Route `/griddy-hoops`, orange/amber accent `#fb923c`
- Grid params: 3 NBA teams (top) + 1 NBA team + 1 position + 1 stat/award (side)
- Stat/award pool: All-Star, NBA Champ, MVP, Finals MVP, DPOY, ROTY, 30+/40+ pt game, 20+ reb game, 15+ ast game, triple-double
- Hand-curated `players.json` (~300 NBA players)
- Timer: copy `Timer.js` + `Timer.css` from `griddy/client/src/` (7-segment white glow)
- Param box style: `rgba(251,146,60,0.15)` bg + `rgba(251,146,60,0.5)` border
- Files to modify: `vercel.json`, root `package.json` build script, hub `index.html` + `style.css`

**Key griddy files to clone/adapt:**
- `griddy/client/src/Grid.js` — main game logic
- `griddy/client/src/player.js` — player search
- `griddy/client/src/Timer.js` + `styles/Timer.css` — copy as-is
- `griddy/client/src/defaults.js` — replace with NBA defaults
- `griddy/client/src/styles/` — adapt CSS colors to orange

### 2. Net-work — chain/connection game
**Status:** Not yet designed. Do after Griddy Hoops ships.

Concept: Connect two athletes through shared teammates (Six Degrees of Kevin Bacon for sports).
- User picks Player A and Player B
- App finds shortest chain of shared teammates
- No spec written yet — brainstorm with user first

## Codebase structure
```
stewdioben/
  index.html          — hub page (lists games)
  style.css           — hub CSS
  vercel.json         — routing (griddy rewrites, stewordle redirect)
  package.json        — root build: builds griddy/client
  stewordle/          — vanilla JS wordle game
    index.html, script.js, style.css, favicon.svg
  griddy/
    client/           — CRA React app (NFL grid game)
      src/Grid.js, player.js, Timer.js, defaults.js, App.js
      src/styles/*.css
      public/index.html, favicon.svg
    server/           — local dev only, not deployed
      players.json    — NFL player data
  api/
    players.js        — Vercel serverless function (NFL players)
```

## Vercel routing
- `/stewordle` → redirect to `/stewordle/`
- `/griddy` → `griddy/client/build/index.html`
- `/griddy/:path*` → `griddy/client/build/:path*`
- Add same pattern for `/griddy-hoops`

## Hub color variants
- Stewordle card: `game-card--purple`
- Griddy card: `game-card--blue`
- Griddy Hoops card: `game-card--orange` (add to `style.css`)

## User preferences
- Dark theme only (removed light theme from stewordle)
- Terse caveman communication style (drop articles/filler)
- Commits welcome, push when ready
