# stewdioben.com Game Hub — Design Spec
Date: 2026-05-13

## Goal
Build a game hub landing page at stewdioben.com that displays a grid of games (starting with stewordle and griddy), with each game accessible at a subpath. The hub is extensible — new games can be added later with minimal effort.

## Architecture

Single Vercel project linked to the `stewdioben` GitHub repo. Monorepo structure:

```
stewdioben/
├── index.html              # hub landing page
├── style.css               # hub styles
├── stewordle/              # static files from benjuh/stewordle
│   ├── index.html
│   ├── script.js
│   └── style.css
├── griddy/                 # cloned from benjuh/griddy
│   ├── client/             # CRA React app
│   │   └── package.json    # "homepage": "/griddy" added for subpath deploy
│   └── server/
│       └── players.json    # static data file — update via git push
├── api/
│   └── players.js          # Vercel serverless function
├── package.json            # root — build script for griddy client
└── vercel.json             # routing rewrites
```

## Routing (vercel.json)

| URL | Serves |
|-----|--------|
| `stewdioben.com/` | hub `index.html` |
| `stewdioben.com/stewordle` | `stewordle/index.html` (static) |
| `stewdioben.com/griddy` | `griddy/client/build/index.html` |
| `stewdioben.com/griddy/*` | `griddy/client/build/*` (assets) |
| `stewdioben.com/api/players` | Vercel serverless fn → returns `players.json` |

## Build

Root `package.json` build command:
```
cd griddy/client && npm install && npm run build
```

Vercel runs this on every push. Stewordle needs no build (pure static).

## Players Data Flow

- `griddy/server/players.json` is committed to the repo
- Griddy React client fetches `/api/players` (unchanged)
- `api/players.js` serverless function reads `players.json` and returns it
- To update players: run fetch scripts locally → commit updated `players.json` → push → Vercel rebuilds

## Hub Page Design

**Visual style:** Cosmic Dark
- Background: `#0d0d1a` (matches stewordle's `--bg`)
- Font: Raleway (matches stewordle)
- Header: "STEWDIOBEN" — purple `#a78bfa`, letter-spaced, top-left

**Game grid:**
- CSS Grid, `auto-fill` columns, `minmax(280px, 1fr)` — 2 columns desktop, 1 mobile
- Each card: dark gradient background, per-game colored border glow, hover lift + glow pulse animation
- Game accent colors:
  - stewordle → purple `#a78bfa`
  - griddy → blue `#60a5fa`
  - future games → add new accent color per game
- Card contents: game title (all-caps, letter-spaced), short description, mini pixel preview of game UI
- Click card → navigates to game subpath
- "More coming soon" ghost card at end (dashed border, dimmed text)

## Griddy Config Change

`griddy/client/package.json` gets `"homepage": "/griddy"` added. This tells CRA to prefix all asset paths with `/griddy` in the build output. No UI or logic changes.

## Game Layout Policy

Games (stewordle, griddy) are not modified visually or functionally. No "back to hub" button is added. Games are standalone pages accessed via subpath navigation.

## Deployment

- Domain: stewdioben.com (Squarespace DNS → Vercel)
- Trigger: any push to GitHub main branch rebuilds and deploys
- Each new game: add files to repo, add card to hub `index.html`, add rewrite to `vercel.json`
