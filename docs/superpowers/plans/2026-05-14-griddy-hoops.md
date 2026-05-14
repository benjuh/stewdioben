# Griddy Hoops Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3×3 NBA player grid game at `/griddy-hoops` — same mechanic as Griddy (NFL) with NBA teams, positions, and stat/award parameters replacing colleges.

**Architecture:** Separate CRA React app in `griddy-hoops/client/`. Players loaded via direct JSON import (no API). Vercel rewrites route `/griddy-hoops` to the built app. Hub page gets an orange game card.

**Tech Stack:** React (CRA), vanilla CSS, Vercel static + rewrite routing

---

## File Map

**Create:**
- `griddy-hoops/client/` — full CRA app (scaffold from griddy/client structure)
- `griddy-hoops/client/package.json`
- `griddy-hoops/client/public/index.html`
- `griddy-hoops/client/public/favicon.svg`
- `griddy-hoops/client/public/manifest.json`
- `griddy-hoops/client/src/index.js`
- `griddy-hoops/client/src/App.js` — loads players.json, renders Grid
- `griddy-hoops/client/src/defaults.js` — NBA teams, positions, stat param pool
- `griddy-hoops/client/src/players.json` — 500+ curated NBA players
- `griddy-hoops/client/src/Grid.js` — NBA grid with stat param logic
- `griddy-hoops/client/src/player.js` — player search (adapted from griddy)
- `griddy-hoops/client/src/Hints.js` — copied from griddy/client/src/Hints.js
- `griddy-hoops/client/src/Timer.js` — copied from griddy/client/src/Timer.js
- `griddy-hoops/client/src/styles/App.css`
- `griddy-hoops/client/src/styles/Grid.css` — orange color scheme
- `griddy-hoops/client/src/styles/Player.css`
- `griddy-hoops/client/src/styles/Timer.css` — copied from griddy/client/src/styles/Timer.css
- `griddy-hoops/client/src/styles/Hints.css`
- `griddy-hoops/client/src/styles/index.css`
- `griddy-hoops/client/src/styles/playerPhoto.css`
- `griddy-hoops/client/src/assets/User.png` — copy from griddy/client/src/assets/User.png
- `griddy-hoops/client/src/assets/NBA_TEAMS/*.svg` — 30 team logo SVGs

**Modify:**
- `vercel.json` — add /griddy-hoops rewrites
- `package.json` (root) — extend build script
- `index.html` (hub) — add Griddy Hoops game card
- `style.css` (hub) — add game-card--orange variant

---

## Task 1: Scaffold CRA app structure

**Files:**
- Create: `griddy-hoops/client/package.json`
- Create: `griddy-hoops/client/public/index.html`
- Create: `griddy-hoops/client/public/manifest.json`
- Create: `griddy-hoops/client/public/favicon.svg`
- Create: `griddy-hoops/client/src/index.js`
- Create: `griddy-hoops/client/src/styles/App.css`
- Create: `griddy-hoops/client/src/styles/index.css`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p griddy-hoops/client/public
mkdir -p griddy-hoops/client/src/styles
mkdir -p griddy-hoops/client/src/assets/NBA_TEAMS
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "griddy-hoops",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

- [ ] **Step 3: Create public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.svg?v=1" type="image/svg+xml" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="NBA player grid game" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>Griddy Hoops</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

- [ ] **Step 4: Create public/manifest.json**

```json
{
  "short_name": "Griddy Hoops",
  "name": "Griddy Hoops",
  "icons": [],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#0d0d1a"
}
```

- [ ] **Step 5: Create public/favicon.svg** (basketball icon)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="5" fill="#0d0d1a"/>
  <circle cx="16" cy="16" r="10" fill="#fb923c" stroke="#c2500a" stroke-width="0.8"/>
  <path d="M6.5 16 Q10 10 16 8 Q22 10 25.5 16 Q22 22 16 24 Q10 22 6.5 16Z" fill="none" stroke="#7c2d12" stroke-width="0.7"/>
  <line x1="6.5" y1="16" x2="25.5" y2="16" stroke="#7c2d12" stroke-width="0.7"/>
  <path d="M16 6 Q13 10 13 16 Q13 22 16 26" fill="none" stroke="#7c2d12" stroke-width="0.7"/>
  <path d="M16 6 Q19 10 19 16 Q19 22 16 26" fill="none" stroke="#7c2d12" stroke-width="0.7"/>
</svg>
```

- [ ] **Step 6: Create src/index.js**

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
```

- [ ] **Step 7: Create src/styles/index.css**

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Courier New', Courier, monospace; background: #0d0d1a; color: #fff; }
```

- [ ] **Step 8: Create src/styles/App.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;700;900&display=swap');
:root { --background: #0d0d1a; }
body, html { background-color: var(--background); font-family: 'Raleway', sans-serif; overflow-x: hidden; }
```

- [ ] **Step 9: Install dependencies**

```bash
cd griddy-hoops/client && npm install
```

Expected: packages installed, no errors.

- [ ] **Step 10: Commit**

```bash
git add griddy-hoops/
git commit -m "feat(griddy-hoops): scaffold CRA app structure"
```

---

## Task 2: NBA defaults

**Files:**
- Create: `griddy-hoops/client/src/defaults.js`

- [ ] **Step 1: Create defaults.js**

```js
const COLORS = {
  CORRECT: '#5AD14F',
  INCORRECT: '#FA4E44',
};

const NBA_TEAMS = [
  'ATL','BOS','BKN','CHA','CHI','CLE','DAL','DEN','DET','GSW',
  'HOU','IND','LAC','LAL','MEM','MIA','MIL','MIN','NOP','NYK',
  'OKC','ORL','PHI','PHX','POR','SAC','SAS','TOR','UTA','WAS',
];

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

// One stat param is randomly chosen per game session for the side axis.
// statKey must match a boolean field name in players.json.
const STAT_PARAMS = [
  { key: 'allStar',       label: 'All-Star' },
  { key: 'nbaChampion',   label: 'NBA Champion' },
  { key: 'mvp',           label: 'League MVP' },
  { key: 'finalsMvp',     label: 'Finals MVP' },
  { key: 'dpoy',          label: 'DPOY' },
  { key: 'rookieOfYear',  label: 'Rookie of Year' },
  { key: 'thirtyPlusGame',label: '30+ Point Game' },
  { key: 'fortyPlusGame', label: '40+ Point Game' },
  { key: 'twentyRebGame', label: '20+ Rebound Game' },
  { key: 'fifteenAstGame',label: '15+ Assist Game' },
  { key: 'tripleDouble',  label: 'Triple-Double' },
];

export default { COLORS, NBA_TEAMS, POSITIONS, STAT_PARAMS };
```

- [ ] **Step 2: Commit**

```bash
git add griddy-hoops/client/src/defaults.js
git commit -m "feat(griddy-hoops): NBA defaults — teams, positions, stat param pool"
```

---

## Task 3: NBA team logo SVGs

**Files:**
- Create: `griddy-hoops/client/src/assets/NBA_TEAMS/*.svg` (30 files)

Each SVG: 64×64, team primary color background, white abbreviation text.

- [ ] **Step 1: Create all 30 team SVGs**

Run this script from the repo root to generate all logos:

```bash
mkdir -p griddy-hoops/client/src/assets/NBA_TEAMS

create_svg() {
  local code=$1 color=$2
  cat > "griddy-hoops/client/src/assets/NBA_TEAMS/${code}.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="${color}"/>
  <text x="32" y="42" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-weight="900" font-size="18">${code}</text>
</svg>
SVG
}

create_svg ATL "#C1062A"
create_svg BOS "#007A33"
create_svg BKN "#000000"
create_svg CHA "#1D1160"
create_svg CHI "#CE1141"
create_svg CLE "#860038"
create_svg DAL "#00538C"
create_svg DEN "#0E2240"
create_svg DET "#C8102E"
create_svg GSW "#1D428A"
create_svg HOU "#CE1141"
create_svg IND "#002D62"
create_svg LAC "#C8102E"
create_svg LAL "#552583"
create_svg MEM "#5D76A9"
create_svg MIA "#98002E"
create_svg MIL "#00471B"
create_svg MIN "#0C2340"
create_svg NOP "#0C2340"
create_svg NYK "#006BB6"
create_svg OKC "#007AC1"
create_svg ORL "#0077C0"
create_svg PHI "#006BB6"
create_svg PHX "#1D1160"
create_svg POR "#E03A3E"
create_svg SAC "#5A2D81"
create_svg SAS "#000000"
create_svg TOR "#CE1141"
create_svg UTA "#002B5C"
create_svg WAS "#002B5C"

echo "Created 30 NBA team SVGs"
ls griddy-hoops/client/src/assets/NBA_TEAMS/ | wc -l
```

Expected output: `30`

- [ ] **Step 2: Commit**

```bash
git add griddy-hoops/client/src/assets/NBA_TEAMS/
git commit -m "feat(griddy-hoops): NBA team logo SVGs (30 teams)"
```

---

## Task 4: NBA player data

**Files:**
- Create: `griddy-hoops/client/src/players.json`

**Schema per player:**
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

**Coverage requirements (verify before committing):**
- ≥ 500 players total
- Each of the 30 NBA teams has ≥ 25 players
- `allStar: true` ≥ 150 players
- `nbaChampion: true` ≥ 100 players
- `thirtyPlusGame: true` ≥ 200 players
- `tripleDouble: true` ≥ 150 players
- Each position (PG/SG/SF/PF/C) ≥ 80 players

**Team code mapping for relocated franchises** (use current franchise code):
- Seattle Supersonics → OKC
- New Jersey Nets / Brooklyn → BKN
- Vancouver Grizzlies → MEM
- Charlotte Bobcats → CHA
- New Orleans Hornets/Pelicans → NOP
- Kansas City Kings → SAC
- San Diego Clippers → LAC

- [ ] **Step 1: Create players.json with 500+ NBA players**

The file must be `griddy-hoops/client/src/players.json`. Use your training knowledge to populate accurate player data. Required seed entries (copy these exactly as a starting point):

```json
[
  {"name":"LeBron James","teams":["CLE","MIA","LAL"],"position":["SF","PF"],"yearsPlayed":[2003,2024],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Michael Jordan","teams":["CHI","WAS"],"position":["SG"],"yearsPlayed":[1984,2003],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Kobe Bryant","teams":["LAL"],"position":["SG","SF"],"yearsPlayed":[1996,2016],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Shaquille O'Neal","teams":["ORL","LAL","MIA","PHX","CLE","BOS"],"position":["C"],"yearsPlayed":[1992,2011],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Magic Johnson","teams":["LAL"],"position":["PG"],"yearsPlayed":[1979,1996],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Larry Bird","teams":["BOS"],"position":["SF"],"yearsPlayed":[1979,1992],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Tim Duncan","teams":["SAS"],"position":["PF","C"],"yearsPlayed":[1997,2016],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Kareem Abdul-Jabbar","teams":["MIL","LAL"],"position":["C"],"yearsPlayed":[1969,1989],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Kevin Durant","teams":["OKC","GSW","BKN","PHX","SAS"],"position":["SF","PF"],"yearsPlayed":[2007,2024],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Stephen Curry","teams":["GSW"],"position":["PG"],"yearsPlayed":[2009,2024],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Giannis Antetokounmpo","teams":["MIL"],"position":["PF","C"],"yearsPlayed":[2013,2024],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Nikola Jokic","teams":["DEN"],"position":["C"],"yearsPlayed":[2015,2024],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"James Harden","teams":["OKC","HOU","BKN","PHI","LAC"],"position":["SG","PG"],"yearsPlayed":[2009,2024],"allStar":true,"nbaChampion":false,"mvp":true,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Russell Westbrook","teams":["OKC","HOU","WAS","IND","LAL","LAC","UTA"],"position":["PG"],"yearsPlayed":[2008,2024],"allStar":true,"nbaChampion":false,"mvp":true,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":true,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Kawhi Leonard","teams":["SAS","TOR","LAC"],"position":["SF"],"yearsPlayed":[2011,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":true,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Chris Paul","teams":["NOP","LAC","OKC","HOU","PHX","PHI","MIL","GSW","WAS","SAS"],"position":["PG"],"yearsPlayed":[2005,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Dwyane Wade","teams":["MIA","CHI","CLE","MIA"],"position":["SG"],"yearsPlayed":[2003,2019],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Dirk Nowitzki","teams":["DAL"],"position":["PF"],"yearsPlayed":[1998,2019],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Charles Barkley","teams":["PHI","PHX","HOU"],"position":["PF"],"yearsPlayed":[1984,2000],"allStar":true,"nbaChampion":false,"mvp":true,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Allen Iverson","teams":["PHI","DEN","DET","MEM"],"position":["PG","SG"],"yearsPlayed":[1996,2010],"allStar":true,"nbaChampion":false,"mvp":true,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"John Stockton","teams":["UTA"],"position":["PG"],"yearsPlayed":[1984,2003],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Karl Malone","teams":["UTA","LAL"],"position":["PF"],"yearsPlayed":[1985,2004],"allStar":true,"nbaChampion":false,"mvp":true,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Hakeem Olajuwon","teams":["HOU","TOR"],"position":["C"],"yearsPlayed":[1984,2002],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":true,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Kevin Garnett","teams":["MIN","BOS","BKN"],"position":["PF","C"],"yearsPlayed":[1995,2016],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":false,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Paul Pierce","teams":["BOS","BKN","WAS","LAC","NYK"],"position":["SF"],"yearsPlayed":[1998,2017],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Ray Allen","teams":["MIL","OKC","BOS","MIA"],"position":["SG"],"yearsPlayed":[1996,2014],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"David Robinson","teams":["SAS"],"position":["C"],"yearsPlayed":[1989,2003],"allStar":true,"nbaChampion":true,"mvp":true,"finalsMvp":false,"dpoy":true,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Patrick Ewing","teams":["NYK","OKC","ORL","IND","WAS","MIL"],"position":["C"],"yearsPlayed":[1985,2002],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Scottie Pippen","teams":["CHI","HOU","POR"],"position":["SF","PG"],"yearsPlayed":[1987,2004],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Dennis Rodman","teams":["DET","SAS","CHI","LAL","DAL"],"position":["PF","C"],"yearsPlayed":[1986,2000],"allStar":false,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Clyde Drexler","teams":["POR","HOU"],"position":["SG","SF"],"yearsPlayed":[1983,1998],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Isiah Thomas","teams":["DET"],"position":["PG"],"yearsPlayed":[1981,1994],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Vince Carter","teams":["TOR","NJN","ORL","PHX","DAL","ORL","PHX","MEM","SAC","ATL","MEM"],"position":["SG","SF"],"yearsPlayed":[1998,2020],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Tracy McGrady","teams":["TOR","ORL","HOU","NYK","DET","ATL","SAS"],"position":["SG","SF"],"yearsPlayed":[1997,2013],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Dwight Howard","teams":["ORL","LAL","HOU","ATL","CHA","WAS","PHI","MEM","TAH","LAL"],"position":["C"],"yearsPlayed":[2004,2022],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Paul George","teams":["IND","OKC","LAC"],"position":["SF","SG"],"yearsPlayed":[2010,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Kyrie Irving","teams":["CLE","BOS","BKN","DAL","PHX"],"position":["PG"],"yearsPlayed":[2011,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Anthony Davis","teams":["NOP","LAL"],"position":["PF","C"],"yearsPlayed":[2012,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Damian Lillard","teams":["POR","MIL","MIA"],"position":["PG"],"yearsPlayed":[2012,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Luka Doncic","teams":["DAL","LAL"],"position":["PG","SF"],"yearsPlayed":[2018,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Joel Embiid","teams":["PHI"],"position":["C"],"yearsPlayed":[2016,2024],"allStar":true,"nbaChampion":false,"mvp":true,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Ja Morant","teams":["MEM"],"position":["PG"],"yearsPlayed":[2019,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Zion Williamson","teams":["NOP"],"position":["PF"],"yearsPlayed":[2019,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Jayson Tatum","teams":["BOS"],"position":["SF","PF"],"yearsPlayed":[2017,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Jaylen Brown","teams":["BOS"],"position":["SG","SF"],"yearsPlayed":[2016,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Jimmy Butler","teams":["CHI","MIN","PHI","MIA","GSW"],"position":["SF","SG"],"yearsPlayed":[2011,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Devin Booker","teams":["PHX"],"position":["SG"],"yearsPlayed":[2015,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Trae Young","teams":["ATL"],"position":["PG"],"yearsPlayed":[2018,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Donovan Mitchell","teams":["UTA","CLE"],"position":["SG"],"yearsPlayed":[2017,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Draymond Green","teams":["GSW"],"position":["PF","C"],"yearsPlayed":[2012,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Klay Thompson","teams":["GSW","DAL"],"position":["SG"],"yearsPlayed":[2011,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Pau Gasol","teams":["MEM","LAL","CHI","SAS","MIL","POR"],"position":["C","PF"],"yearsPlayed":[2001,2021],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Marc Gasol","teams":["MEM","TOR","LAL","MEM"],"position":["C"],"yearsPlayed":[2008,2021],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Mike Conley","teams":["MEM","UTA","MIN"],"position":["PG"],"yearsPlayed":[2007,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Rudy Gobert","teams":["UTA","MIN"],"position":["C"],"yearsPlayed":[2013,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Karl-Anthony Towns","teams":["MIN","NYK"],"position":["C","PF"],"yearsPlayed":[2015,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Kemba Walker","teams":["CHA","BOS","OKC","NYK","PHI"],"position":["PG"],"yearsPlayed":[2011,2022],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Bradley Beal","teams":["WAS","PHX","MIA"],"position":["SG"],"yearsPlayed":[2012,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"CJ McCollum","teams":["POR","NOP","PHX"],"position":["SG","PG"],"yearsPlayed":[2013,2024],"allStar":false,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"De'Aaron Fox","teams":["SAC"],"position":["PG"],"yearsPlayed":[2017,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Shai Gilgeous-Alexander","teams":["LAC","OKC"],"position":["PG","SG"],"yearsPlayed":[2018,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Anthony Edwards","teams":["MIN"],"position":["SG","SF"],"yearsPlayed":[2020,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":true,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Tyrese Haliburton","teams":["SAC","IND"],"position":["PG"],"yearsPlayed":[2020,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Bam Adebayo","teams":["MIA"],"position":["C","PF"],"yearsPlayed":[2017,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Myles Turner","teams":["IND"],"position":["C"],"yearsPlayed":[2015,2024],"allStar":false,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Lauri Markkanen","teams":["CHI","CLE","UTA"],"position":["PF","C"],"yearsPlayed":[2017,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Zach LaVine","teams":["MIN","CHI","SAC"],"position":["SG","PG"],"yearsPlayed":[2014,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"DeMar DeRozan","teams":["TOR","SAS","CHI","SAC"],"position":["SG","SF"],"yearsPlayed":[2009,2024],"allStar":true,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Pascal Siakam","teams":["TOR","IND"],"position":["PF","SF"],"yearsPlayed":[2016,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Fred VanVleet","teams":["TOR","HOU","CLE"],"position":["PG"],"yearsPlayed":[2016,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"OG Anunoby","teams":["TOR","NYK"],"position":["SF"],"yearsPlayed":[2017,2024],"allStar":false,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Kyle Lowry","teams":["MEM","HOU","TOR","MIA","PHI","MIL"],"position":["PG"],"yearsPlayed":[2006,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Serge Ibaka","teams":["OKC","ORL","TOR","LAC","MIL","LAL"],"position":["PF","C"],"yearsPlayed":[2009,2022],"allStar":false,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Chris Bosh","teams":["TOR","MIA"],"position":["PF","C"],"yearsPlayed":[2003,2017],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Udonis Haslem","teams":["MIA"],"position":["PF","C"],"yearsPlayed":[2003,2023],"allStar":false,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Shane Battier","teams":["MEM","HOU","MIA","MEM"],"position":["SF"],"yearsPlayed":[2001,2014],"allStar":false,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Mike Miller","teams":["ORL","MEM","MIA","MIN","WAS","CLE","DEN"],"position":["SF","SG"],"yearsPlayed":[2000,2016],"allStar":false,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Alonzo Mourning","teams":["CHA","MIA","NJN","TOR","MIA"],"position":["C"],"yearsPlayed":[1992,2008],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":true,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Gary Payton","teams":["OKC","MIL","BOS","LAL","MIA"],"position":["PG"],"yearsPlayed":[1990,2007],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Jason Kidd","teams":["DAL","PHX","NJN","NYK"],"position":["PG"],"yearsPlayed":[1994,2013],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":true,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":true},
  {"name":"Steve Nash","teams":["PHX","DAL","LAL"],"position":["PG"],"yearsPlayed":[1996,2015],"allStar":true,"nbaChampion":false,"mvp":true,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":true,"tripleDouble":true},
  {"name":"Manu Ginobili","teams":["SAS"],"position":["SG","SF"],"yearsPlayed":[2002,2018],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Tony Parker","teams":["SAS","CHA"],"position":["PG"],"yearsPlayed":[2001,2019],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":true,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Boris Diaw","teams":["ATL","PHX","SAS","CHA","UTA"],"position":["PF","C"],"yearsPlayed":[2003,2016],"allStar":false,"nbaChampion":true,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Kawhi Leonard","teams":["SAS","TOR","LAC"],"position":["SF"],"yearsPlayed":[2011,2024],"allStar":true,"nbaChampion":true,"mvp":false,"finalsMvp":true,"dpoy":true,"rookieOfYear":false,"thirtyPlusGame":true,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false},
  {"name":"Steph Curry duplicate - skip this entry in real data","teams":[],"position":[],"yearsPlayed":[0,0],"allStar":false,"nbaChampion":false,"mvp":false,"finalsMvp":false,"dpoy":false,"rookieOfYear":false,"thirtyPlusGame":false,"fortyPlusGame":false,"twentyRebGame":false,"fifteenAstGame":false,"tripleDouble":false}
]
```

**Note:** The above list is a starting seed (~80 players). Before committing, expand to 500+ players using your training knowledge. Focus on:
- All 30 NBA teams having representation
- Recent players (2010–2024) to maximize multi-team coverage
- Veterans who played for 3+ teams (maximize grid intersection possibilities)
- A mix of All-Stars and solid rotation players

Remove the placeholder "Kawhi Leonard" duplicate and "skip this entry" object. Ensure no player appears twice.

**Verify coverage before committing:**
```bash
node -e "
const p = require('./griddy-hoops/client/src/players.json');
const teams = {};
p.forEach(pl => pl.teams.forEach(t => { teams[t] = (teams[t]||0)+1; }));
const low = Object.entries(teams).filter(([t,c])=>c<15).map(([t,c])=>t+':'+c);
console.log('Total:', p.length);
console.log('Low-coverage teams:', low.join(', ') || 'none');
console.log('All-Stars:', p.filter(x=>x.allStar).length);
console.log('Champions:', p.filter(x=>x.nbaChampion).length);
console.log('30+ game:', p.filter(x=>x.thirtyPlusGame).length);
"
```

Expected: Total ≥ 500, no low-coverage teams, All-Stars ≥ 150.

- [ ] **Step 2: Commit**

```bash
git add griddy-hoops/client/src/players.json
git commit -m "feat(griddy-hoops): NBA player data (500+ players)"
```

---

## Task 5: App.js

**Files:**
- Create: `griddy-hoops/client/src/App.js`

- [ ] **Step 1: Create App.js**

```js
import React from 'react';
import './styles/App.css';
import Grid from './Grid';
import players from './players.json';

function App() {
  return (
    <div>
      <Grid players={players} />
    </div>
  );
}

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add griddy-hoops/client/src/App.js
git commit -m "feat(griddy-hoops): App root component with direct JSON import"
```

---

## Task 6: Grid.js

**Files:**
- Create: `griddy-hoops/client/src/Grid.js`

Key differences from `griddy/client/src/Grid.js`:
1. Imports NBA team SVGs (not PNG), no college imports
2. `solveSquare` uses a single `matchesParam` helper instead of giant if/else
3. `generateParameters` picks stat param instead of college
4. Orange param box styling class `param-box`

- [ ] **Step 1: Create Grid.js**

Create `griddy-hoops/client/src/Grid.js` with this content:

```js
import React, { useEffect } from 'react';
import './styles/Grid.css';
import Player from './player';
import defaults from './defaults';
import Hints from './Hints';
import Timer from './Timer';

// NBA team logo SVG imports
import ATL from './assets/NBA_TEAMS/ATL.svg';
import BOS from './assets/NBA_TEAMS/BOS.svg';
import BKN from './assets/NBA_TEAMS/BKN.svg';
import CHA from './assets/NBA_TEAMS/CHA.svg';
import CHI from './assets/NBA_TEAMS/CHI.svg';
import CLE from './assets/NBA_TEAMS/CLE.svg';
import DAL from './assets/NBA_TEAMS/DAL.svg';
import DEN from './assets/NBA_TEAMS/DEN.svg';
import DET from './assets/NBA_TEAMS/DET.svg';
import GSW from './assets/NBA_TEAMS/GSW.svg';
import HOU from './assets/NBA_TEAMS/HOU.svg';
import IND from './assets/NBA_TEAMS/IND.svg';
import LAC from './assets/NBA_TEAMS/LAC.svg';
import LAL from './assets/NBA_TEAMS/LAL.svg';
import MEM from './assets/NBA_TEAMS/MEM.svg';
import MIA from './assets/NBA_TEAMS/MIA.svg';
import MIL from './assets/NBA_TEAMS/MIL.svg';
import MIN from './assets/NBA_TEAMS/MIN.svg';
import NOP from './assets/NBA_TEAMS/NOP.svg';
import NYK from './assets/NBA_TEAMS/NYK.svg';
import OKC from './assets/NBA_TEAMS/OKC.svg';
import ORL from './assets/NBA_TEAMS/ORL.svg';
import PHI from './assets/NBA_TEAMS/PHI.svg';
import PHX from './assets/NBA_TEAMS/PHX.svg';
import POR from './assets/NBA_TEAMS/POR.svg';
import SAC from './assets/NBA_TEAMS/SAC.svg';
import SAS from './assets/NBA_TEAMS/SAS.svg';
import TOR from './assets/NBA_TEAMS/TOR.svg';
import UTA from './assets/NBA_TEAMS/UTA.svg';
import WAS from './assets/NBA_TEAMS/WAS.svg';

const teamLogoMap = {
  ATL,BOS,BKN,CHA,CHI,CLE,DAL,DEN,DET,GSW,
  HOU,IND,LAC,LAL,MEM,MIA,MIL,MIN,NOP,NYK,
  OKC,ORL,PHI,PHX,POR,SAC,SAS,TOR,UTA,WAS,
};

function Grid({ players }) {
  const MINIMUM_SOLUTIONS = 10;
  const CORRECT = defaults.COLORS.CORRECT;
  const INCORRECT = defaults.COLORS.INCORRECT;

  const [isOpen, setModalOpen] = React.useState(false);
  const [gridContent, setGridContent] = React.useState(Array(9).fill(null));
  const [currentSquare, setCurrentSquare] = React.useState(0);
  const [hintsOpen, setHintsOpen] = React.useState(false);
  const [hintsSquare, setHintsSquare] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [gameMode, setGameMode] = React.useState('easy');
  const [solutionsPerSquare, setSolutionsPerSquare] = React.useState(Array(9).fill(0));
  const [solutions, setSolutions] = React.useState([]);
  const [parameters, setParameters] = React.useState(Array(6).fill({ is_image: false, content: '' }));

  const openHintsSquare = (n) => { setHintsOpen(true); setHintsSquare(n); };
  const closeHints = () => { setHintsOpen(false); setHintsSquare(null); };
  const openModal = (num) => { setModalOpen(true); setCurrentSquare(num); };
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (!players) return;
    generateParameters();
  }, [players]);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.isComposing || e.keyCode === 27) { closeModal(); setSearch(''); }
    };
    window.addEventListener('keydown', handler, false);
    return () => window.removeEventListener('keydown', handler, false);
  }, []);

  const matchesParam = (player, param) => {
    if (param.paramType === 'teams') return player.teams.includes(param.team);
    if (param.paramType === 'position') return player.position.includes(param.content);
    if (param.paramType === 'stat') return player[param.statKey] === true;
    return false;
  };

  const solveSquare = (player, param1, param2) =>
    matchesParam(player, param1) && matchesParam(player, param2);

  const canSolveGrid = (params) => {
    const sqs = [[], [], [], [], [], [], [], [], []];
    const sps = Array(9).fill(0);
    // param layout: [top0, top1, top2, side0, side1, side2]
    // squares: row0=[top0×side0, top1×side0, top2×side0] etc.
    const pairs = [
      [0,3],[1,3],[2,3],
      [0,4],[1,4],[2,4],
      [0,5],[1,5],[2,5],
    ];
    players.forEach(player => {
      pairs.forEach(([ti, si], idx) => {
        if (solveSquare(player, params[ti], params[si])) {
          sqs[idx].push(player);
          sps[idx]++;
        }
      });
    });
    if (sps.some(n => n < MINIMUM_SOLUTIONS)) return false;
    const sorted = sqs.map(sq => sq.sort((a, b) => b.yearsPlayed[1] - a.yearsPlayed[1]));
    setSolutionsPerSquare(sps);
    setSolutions(sorted);
    return true;
  };

  const generateParameters = () => {
    (async () => {
      for (let attempt = 0; attempt < 2000; attempt++) {
        if (attempt > 0 && attempt % 50 === 0) {
          await new Promise(r => setTimeout(r, 0));
        }

        // Pick 4 unique teams
        const teamSet = new Set();
        while (teamSet.size < 4) {
          teamSet.add(defaults.NBA_TEAMS[Math.floor(Math.random() * defaults.NBA_TEAMS.length)]);
        }
        const [t0, t1, t2, t3] = [...teamSet].map(code => ({
          is_image: true,
          team: code,
          content: teamLogoMap[code],
          paramType: 'teams',
        }));

        // Pick 1 position
        const posCode = defaults.POSITIONS[Math.floor(Math.random() * defaults.POSITIONS.length)];
        const posParam = { is_image: false, content: posCode, paramType: 'position' };

        // Pick 1 stat
        const stat = defaults.STAT_PARAMS[Math.floor(Math.random() * defaults.STAT_PARAMS.length)];
        const statParam = { is_image: false, content: stat.label, statKey: stat.key, paramType: 'stat' };

        const params = [t0, t1, t2, t3, posParam, statParam];
        if (canSolveGrid(params)) {
          setParameters(params);
          return;
        }
      }
    })();
  };

  const changeSquare = (player, square) => {
    const new_grid = [...gridContent];
    if (solutions[square - 1] && solutions[square - 1].some(p => p.name === player.name)) {
      new_grid[square - 1] = player;
    } else {
      new_grid[square - 1] = null;
    }
    setGridContent(new_grid);
    setSearch('');
  };

  const isLoading = !players || solutionsPerSquare.every(n => n === 0);

  const WinScreen = () => !gridContent.includes(null) && (
    <div className="win-modal">
      <div><h1>You Win!</h1><h2>Refresh the page to play again :)</h2></div>
    </div>
  );

  const GameMode = () => (
    <div className="game-mode">
      <div className="game-mode-buttons">
        {['easy', 'hard'].map(m => (
          <div key={m} className={`game-button ${gameMode === m ? 'selected' : 'default'}`}
            onClick={() => setGameMode(m)}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderParam = (param) =>
    param.is_image
      ? <img src={param.content} alt={param.team} />
      : <h1>{param.content}</h1>;

  const squareIds = [1,2,3,4,5,6,7,8,9];

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">Setting up game…</p>
        </div>
      )}
      <WinScreen />
      <div className="griddy-header">
        <a href="/" className="hub-back">← Hub</a>
        <h1 className="griddy-title">GRIDDY HOOPS</h1>
        <Timer />
      </div>
      <Hints solutions={solutions} hintsOpen={hintsOpen} hintsSquare={hintsSquare} closeHints={closeHints} />
      <GameMode />
      {isOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="search-container">
              <input type="text" placeholder="" className="searchbar" id="search"
                autoFocus onChange={e => setSearch(e.target.value)} value={search} />
            </div>
            <Player players={players} searched={search} currentSquare={currentSquare}
              changeSquare={changeSquare} closeModal={closeModal} />
          </div>
        </div>
      )}
      <div className="grid-container">
        <div className="grid-item" id="blank"></div>
        {[0,1,2].map(i => (
          <div key={i} className="grid-item param" id={`param${i+1}`}>{renderParam(parameters[i])}</div>
        ))}
        {squareIds.map((sq, idx) => {
          const rowParam = parameters[3 + Math.floor(idx / 3)];
          const isFirstInRow = idx % 3 === 0;
          return (
            <React.Fragment key={sq}>
              {isFirstInRow && (
                <div className="grid-item param" id={`param${4 + Math.floor(idx / 3)}`}>
                  {renderParam(rowParam)}
                </div>
              )}
              <div
                style={gridContent[idx] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
                className="grid-item clickable"
                onClick={() => openModal(sq)}
              >
                <h1>{solutionsPerSquare[idx]}</h1>
                {!gridContent[idx] && !solutionsPerSquare.includes(0) && gameMode !== 'hard' && (
                  <button className="hint-btn" onClick={e => { e.stopPropagation(); openHintsSquare(idx); }}>?</button>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Grid;
```

- [ ] **Step 2: Commit**

```bash
git add griddy-hoops/client/src/Grid.js
git commit -m "feat(griddy-hoops): Grid component with NBA stat param logic"
```

---

## Task 7: player.js + Hints.js

**Files:**
- Create: `griddy-hoops/client/src/player.js`
- Create: `griddy-hoops/client/src/Hints.js`

- [ ] **Step 1: Copy and adapt player.js from griddy**

Copy `griddy/client/src/player.js` to `griddy-hoops/client/src/player.js`. Then make these changes:
1. Replace all NFL team imports with NBA team SVG imports (same pattern as Grid.js above — import from `./assets/NBA_TEAMS/*.svg` using `teamLogoMap`)
2. Remove all college imports and the college `switch` block in `generateLogos`
3. In `generateLogos`, return only `[teamLogos, null]` (no college logo)
4. In the render, remove the college logo display

The `rank` function, search logic, and image-reveal batching copy unchanged.

Simplified `generateLogos` for Griddy Hoops:
```js
const generateLogos = (player) => {
  const team_logos = player.teams.map(t => teamLogoMap[t]).filter(Boolean);
  return [team_logos];
};
```

And in `renderPlayers`, use `logos[0]` for team logos, remove college logo display.

- [ ] **Step 2: Copy Hints.js**

```bash
cp griddy/client/src/Hints.js griddy-hoops/client/src/Hints.js
cp griddy/client/src/styles/Hints.css griddy-hoops/client/src/styles/Hints.css
```

- [ ] **Step 3: Copy User asset**

```bash
cp griddy/client/src/assets/User.png griddy-hoops/client/src/assets/User.png
```

- [ ] **Step 4: Commit**

```bash
git add griddy-hoops/client/src/player.js griddy-hoops/client/src/Hints.js \
  griddy-hoops/client/src/styles/Hints.css griddy-hoops/client/src/assets/
git commit -m "feat(griddy-hoops): player search, hints, user asset"
```

---

## Task 8: Timer

**Files:**
- Create: `griddy-hoops/client/src/Timer.js`
- Create: `griddy-hoops/client/src/styles/Timer.css`

- [ ] **Step 1: Copy Timer files from griddy**

```bash
cp griddy/client/src/Timer.js griddy-hoops/client/src/Timer.js
cp griddy/client/src/styles/Timer.css griddy-hoops/client/src/styles/Timer.css
```

(These are the updated 7-segment white-glow versions.)

- [ ] **Step 2: Verify Timer.js content**

Confirm `griddy-hoops/client/src/Timer.js` renders `.timer-bg` and `.timer-fg` spans (not the old single-text version).

- [ ] **Step 3: Commit**

```bash
git add griddy-hoops/client/src/Timer.js griddy-hoops/client/src/styles/Timer.css
git commit -m "feat(griddy-hoops): 7-segment timer (copied from griddy)"
```

---

## Task 9: CSS — orange color scheme

**Files:**
- Create: `griddy-hoops/client/src/styles/Grid.css`
- Create: `griddy-hoops/client/src/styles/Player.css`
- Create: `griddy-hoops/client/src/styles/playerPhoto.css`

Copy the CSS files from `griddy/client/src/styles/` and apply these color substitutions:
- `#60a5fa` → `#fb923c` (blue accent → orange accent)
- `.hub-back` border/color: change from purple/blue tones to orange: `rgba(251,146,60,0.8)`, `rgba(251,146,60,0.08)`, `rgba(251,146,60,0.25)`
- `.hub-back:hover`: `#fb923c`, `rgba(251,146,60,0.15)`, `rgba(251,146,60,0.5)`
- `.griddy-title` color: `#fb923c`

**Add param box style** to Grid.css. The `.param` class should use:
```css
.grid-item.param {
  background: rgba(251, 146, 60, 0.15);
  border: 1px solid rgba(251, 146, 60, 0.5);
}
```

- [ ] **Step 1: Copy and adapt Grid.css**

```bash
cp griddy/client/src/styles/Grid.css griddy-hoops/client/src/styles/Grid.css
```

Open `griddy-hoops/client/src/styles/Grid.css` and:
1. Find `.grid-item.param` (or wherever param styling lives) and set:
   ```css
   background: rgba(251, 146, 60, 0.15);
   border: 1px solid rgba(251, 146, 60, 0.5);
   ```
2. Change `.hub-back` colors from purple/blue to orange values listed above.
3. Change `.griddy-title` color to `#fb923c`.
4. Change any `#60a5fa` references to `#fb923c`.

- [ ] **Step 2: Copy Player.css and playerPhoto.css**

```bash
cp griddy/client/src/styles/Player.css griddy-hoops/client/src/styles/Player.css
cp griddy/client/src/styles/playerPhoto.css griddy-hoops/client/src/styles/playerPhoto.css
```

- [ ] **Step 3: Commit**

```bash
git add griddy-hoops/client/src/styles/
git commit -m "feat(griddy-hoops): orange CSS color scheme"
```

---

## Task 10: Hub page — Griddy Hoops card

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Add orange card variant to style.css**

Read `style.css` to find `.game-card--blue` and add `.game-card--orange` next to it with orange colors:
```css
.game-card--orange {
  background: linear-gradient(135deg, #1a0f00 0%, #0d0d1a 100%);
  border-color: rgba(251, 146, 60, 0.3);
}
.game-card--orange .game-title { color: #fb923c; }
.game-card--orange .game-cta   { color: #fb923c; }
.game-card--orange:hover        { border-color: rgba(251, 146, 60, 0.7); box-shadow: 0 8px 32px rgba(251,146,60,0.15); }
.game-card--orange .wt.correct  { background: #fb923c; }
```

- [ ] **Step 2: Add Griddy Hoops card to index.html**

In `index.html`, find the `"MORE SOON"` ghost card and replace it with the Griddy Hoops card, then add a new ghost card after:

```html
<a class="game-card game-card--orange" href="/griddy-hoops">
  <div class="game-preview">
    <div class="preview-grid">
      <div class="gcell filled" style="background:#fb923c;"></div>
      <div class="gcell"></div>
      <div class="gcell filled" style="background:#fb923c;"></div>
      <div class="gcell"></div>
      <div class="gcell filled" style="background:#fb923c;"></div>
      <div class="gcell"></div>
      <div class="gcell filled" style="background:#fb923c;"></div>
      <div class="gcell"></div>
      <div class="gcell filled" style="background:#fb923c;"></div>
    </div>
  </div>
  <div class="game-info">
    <h2 class="game-title">GRIDDY HOOPS</h2>
    <p class="game-desc">Daily NBA player grid — pick players that fit two categories at once</p>
    <span class="game-cta">Play →</span>
  </div>
</a>

<div class="game-card game-card--ghost" aria-hidden="true">
  <div class="game-info">
    <h2 class="game-title">MORE SOON</h2>
    <p class="game-desc">New games in the works</p>
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: add Griddy Hoops orange card to hub"
```

---

## Task 11: Vercel routing + build config

**Files:**
- Modify: `vercel.json`
- Modify: `package.json` (root)

- [ ] **Step 1: Update vercel.json**

Add griddy-hoops rewrites to the `rewrites` array in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "redirects": [
    { "source": "/stewordle", "destination": "/stewordle/", "permanent": false }
  ],
  "rewrites": [
    { "source": "/griddy",          "destination": "/griddy/client/build/index.html" },
    { "source": "/griddy/:path*",   "destination": "/griddy/client/build/:path*" },
    { "source": "/griddy-hoops",        "destination": "/griddy-hoops/client/build/index.html" },
    { "source": "/griddy-hoops/:path*", "destination": "/griddy-hoops/client/build/:path*" }
  ]
}
```

- [ ] **Step 2: Update root package.json build script**

Change the `build` script to also build griddy-hoops:

```json
"build": "cd griddy/client && npm install && CI=false npm run build && cd ../../griddy-hoops/client && npm install && CI=false npm run build"
```

- [ ] **Step 3: Commit**

```bash
git add vercel.json package.json
git commit -m "feat: add griddy-hoops Vercel routing and build script"
```

---

## Task 12: Build and verify

- [ ] **Step 1: Install griddy-hoops deps and build locally**

```bash
cd griddy-hoops/client && npm install && CI=false npm run build 2>&1 | tail -20
```

Expected: `The build folder is ready to be deployed.`

- [ ] **Step 2: Verify build output**

```bash
ls griddy-hoops/client/build/
```

Expected: `asset-manifest.json  favicon.svg  index.html  manifest.json  robots.txt  static/`

- [ ] **Step 3: Spot-check players.json coverage**

```bash
node -e "
const p = require('./griddy-hoops/client/src/players.json');
const teams = {};
p.forEach(pl => pl.teams.forEach(t => { teams[t] = (teams[t]||0)+1; }));
const low = Object.entries(teams).filter(([,c])=>c<15).map(([t,c])=>t+':'+c);
console.log('Total players:', p.length);
console.log('Low-coverage teams:', low.join(', ')||'none');
console.log('All-Stars:', p.filter(x=>x.allStar).length);
"
```

Expected: Total ≥ 500, no low teams.

- [ ] **Step 4: Push to deploy**

```bash
git push origin main
```

- [ ] **Step 5: Verify on Vercel**

Navigate to `/griddy-hoops` on the deployed URL. Confirm:
- Orange accent color throughout
- Grid generates with NBA teams, positions, and one stat label
- Player search works and returns ranked results
- Timer shows 7-segment white-glow style
- "← Hub" returns to hub
- Hub page shows orange Griddy Hoops card

---

## Self-Review

**Spec coverage check:**
- ✅ Separate CRA app at `/griddy-hoops`
- ✅ Orange/amber `#fb923c` accent
- ✅ Parameter boxes: orange tint bg + orange border
- ✅ 3 NBA teams top axis + 1 team + 1 position + 1 stat side axis
- ✅ Stat pool: 11 categories in defaults.js
- ✅ Exactly 1 stat param per game (generateParameters picks one)
- ✅ Timer: 7-segment white-glow (copied)
- ✅ Hub page: orange card + routing
- ✅ Vercel rewrites + build script
- ✅ Hand-curated players.json with coverage requirements

**Placeholder scan:** Task 4 player data requires agent expansion — requirements are explicit (500+ players, coverage thresholds, verification script). Not a placeholder.

**Type consistency:** `statKey` field set in `generateParameters` stat param → used in `matchesParam` → matches boolean keys in players.json schema. ✅
