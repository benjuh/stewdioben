# stewdioben Game Hub — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cosmic-dark game hub at stewdioben.com with a grid of game cards, each linking to its game at a subpath (`/stewordle`, `/griddy`).

**Architecture:** Single Vercel project (`stewdioben` GitHub repo). Hub is pure static HTML/CSS/JS. Stewordle static files live at `/stewordle/`. Griddy React app is built from `/griddy/client/` via root `package.json`. A Vercel serverless function at `api/players.js` serves player data so griddy's fetch URL stays unchanged.

**Tech Stack:** HTML/CSS/JS (hub), React 18 / CRA (griddy client), Vercel serverless functions, Vercel static hosting, Raleway font (Google Fonts)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `.gitignore` | Create | Exclude build artifacts and OS files |
| `package.json` | Create | Root build script (builds griddy client) |
| `vercel.json` | Create | Route `/griddy/*` to CRA build output |
| `index.html` | Create | Hub landing page |
| `style.css` | Create | Hub cosmic-dark styles |
| `stewordle/index.html` | Copy from benjuh/stewordle | Game file |
| `stewordle/script.js` | Copy from benjuh/stewordle | Game file |
| `stewordle/style.css` | Copy from benjuh/stewordle | Game file |
| `griddy/client/` | Copy from benjuh/griddy | React app |
| `griddy/server/players.json` | Copy from benjuh/griddy | Player data |
| `griddy/client/package.json` | Modify | Add `"homepage": "/griddy"` |
| `api/players.js` | Create | Vercel fn — serves players.json |
| `api/players.test.js` | Create | Jest test for serverless fn |

---

## Task 1: Initialize repo and .gitignore

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Run git init in the stewdioben directory**

```bash
git init
```

Expected: `Initialized empty Git repository in .../stewdioben/.git/`

- [ ] **Step 2: Create .gitignore**

```
node_modules/
griddy/client/build/
griddy/client/node_modules/
.DS_Store
.superpowers/
*.log
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: init repo with .gitignore"
```

---

## Task 2: Copy stewordle static files

**Files:**
- Create: `stewordle/index.html`, `stewordle/script.js`, `stewordle/style.css`

- [ ] **Step 1: Clone stewordle into a temp directory**

```bash
git clone https://github.com/benjuh/stewordle.git /tmp/stewordle-src
```

Expected: Cloning into `/tmp/stewordle-src`... done.

- [ ] **Step 2: Create stewordle/ folder and copy game files**

```bash
mkdir stewordle
cp /tmp/stewordle-src/index.html stewordle/index.html
cp /tmp/stewordle-src/script.js stewordle/script.js
cp /tmp/stewordle-src/style.css stewordle/style.css
rm -rf /tmp/stewordle-src
```

- [ ] **Step 3: Verify files exist**

```bash
ls stewordle/
```

Expected output:
```
index.html  script.js  style.css
```

- [ ] **Step 4: Open stewordle/index.html in a browser and verify game loads**

```bash
open stewordle/index.html
```

Game should be fully playable — all 4 modes (Classic, Quad, Octo, 16) must work.

- [ ] **Step 5: Commit**

```bash
git add stewordle/
git commit -m "feat: add stewordle static game files"
```

---

## Task 3: Copy griddy files

**Files:**
- Create: `griddy/client/`, `griddy/server/players.json`

- [ ] **Step 1: Clone griddy into a temp directory**

```bash
git clone https://github.com/benjuh/griddy.git /tmp/griddy-src
```

- [ ] **Step 2: Copy client and server/players.json**

```bash
mkdir -p griddy/server
cp -r /tmp/griddy-src/client griddy/client
cp /tmp/griddy-src/server/players.json griddy/server/players.json
rm -rf /tmp/griddy-src
```

- [ ] **Step 3: Verify structure**

```bash
ls griddy/
ls griddy/client/src/
```

Expected `griddy/`:
```
client/  server/
```

Expected `griddy/client/src/`:
```
Grid.js  Timer.js  index.js  styles/
```

- [ ] **Step 4: Commit**

```bash
git add griddy/
git commit -m "feat: add griddy client and player data"
```

---

## Task 4: Configure griddy client for /griddy subpath

**Files:**
- Modify: `griddy/client/package.json`

The CRA build must prefix all asset paths with `/griddy` so that when served at `stewdioben.com/griddy`, JavaScript and CSS files resolve correctly. Without this, the built `index.html` references `./static/...` but the browser is at `/griddy` so assets 404.

- [ ] **Step 1: Add `homepage` field to griddy/client/package.json**

Open `griddy/client/package.json` and add `"homepage": "/griddy"` as a top-level field:

```json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "homepage": "/griddy",
  "proxy": "http://localhost:3001",
  ...
}
```

- [ ] **Step 2: Verify the field is present**

```bash
grep '"homepage"' griddy/client/package.json
```

Expected: `"homepage": "/griddy",`

- [ ] **Step 3: Commit**

```bash
git add griddy/client/package.json
git commit -m "chore: set griddy CRA homepage to /griddy for subpath deploy"
```

---

## Task 5: Create Vercel serverless function for players API

**Files:**
- Create: `api/players.js`
- Create: `api/players.test.js`

The griddy React client fetches `/api/players` (unchanged from its original Express setup). This serverless function replaces the Express route and reads `players.json` directly from the repo.

- [ ] **Step 1: Write the failing test first**

Create `api/players.test.js`:

```js
const handler = require('./players');

describe('GET /api/players', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      _data: null,
      json(data) { this._data = data; }
    };
  });

  test('responds with object containing message key', () => {
    handler(req, res);
    expect(res._data).toHaveProperty('message');
  });

  test('message is an array', () => {
    handler(req, res);
    expect(Array.isArray(res._data.message)).toBe(true);
  });

  test('players array is non-empty', () => {
    handler(req, res);
    expect(res._data.message.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Create root package.json with Jest configured**

```json
{
  "name": "stewdioben",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "cd griddy/client && npm install && npm run build",
    "test": "jest",
    "dev:griddy": "cd griddy/client && npm start"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  },
  "jest": {
    "testEnvironment": "node",
    "testPathPattern": "api/"
  }
}
```

- [ ] **Step 3: Install jest**

```bash
npm install
```

- [ ] **Step 4: Run test — expect it to FAIL**

```bash
npm test
```

Expected: `Cannot find module './players'`

- [ ] **Step 5: Create api/players.js**

```js
const players = require('../griddy/server/players.json');

module.exports = (req, res) => {
  res.json({ message: players });
};
```

- [ ] **Step 6: Run test — expect it to PASS**

```bash
npm test
```

Expected:
```
PASS api/players.test.js
  GET /api/players
    ✓ responds with object containing message key
    ✓ message is an array
    ✓ players array is non-empty
```

- [ ] **Step 7: Commit**

```bash
git add api/ package.json package-lock.json
git commit -m "feat: add Vercel serverless function for players API"
```

---

## Task 6: Create vercel.json routing config

**Files:**
- Create: `vercel.json`

Vercel serves static files automatically — `stewordle/index.html` is served at `/stewordle` without any special config. Only griddy needs rewrites because its build output lives at `griddy/client/build/` but must be served under `/griddy/`.

- [ ] **Step 1: Create vercel.json**

```json
{
  "buildCommand": "npm run build",
  "rewrites": [
    { "source": "/griddy", "destination": "/griddy/client/build/index.html" },
    { "source": "/griddy/:path*", "destination": "/griddy/client/build/:path*" }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "require('./vercel.json'); console.log('valid JSON')"
```

Expected: `valid JSON`

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "chore: add Vercel routing config for griddy subpath"
```

---

## Task 7: Build the hub page — HTML

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>stewdioben</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="site-logo">STEWDIOBEN</div>
    <div class="site-tagline">game studio</div>
  </header>

  <main class="game-grid">

    <a class="game-card game-card--purple" href="/stewordle">
      <div class="game-preview">
        <div class="preview-wordle">
          <div class="wrow">
            <span class="wt correct">S</span>
            <span class="wt present">T</span>
            <span class="wt absent">A</span>
            <span class="wt absent">R</span>
            <span class="wt correct">T</span>
          </div>
          <div class="wrow">
            <span class="wt absent">P</span>
            <span class="wt correct">L</span>
            <span class="wt present">A</span>
            <span class="wt correct">C</span>
            <span class="wt absent">E</span>
          </div>
          <div class="wrow">
            <span class="wt correct">S</span>
            <span class="wt correct">L</span>
            <span class="wt correct">A</span>
            <span class="wt correct">C</span>
            <span class="wt correct">K</span>
          </div>
        </div>
      </div>
      <div class="game-info">
        <h2 class="game-title">STEWORDLE</h2>
        <p class="game-desc">Word puzzle with 4 modes — Classic, Quad, Octo, and 16</p>
        <span class="game-cta">Play →</span>
      </div>
    </a>

    <a class="game-card game-card--blue" href="/griddy">
      <div class="game-preview">
        <div class="preview-grid">
          <div class="gcell filled"></div>
          <div class="gcell"></div>
          <div class="gcell filled"></div>
          <div class="gcell"></div>
          <div class="gcell filled"></div>
          <div class="gcell"></div>
          <div class="gcell filled"></div>
          <div class="gcell"></div>
          <div class="gcell filled"></div>
        </div>
      </div>
      <div class="game-info">
        <h2 class="game-title">GRIDDY</h2>
        <p class="game-desc">Daily NFL player grid — pick players that fit two categories at once</p>
        <span class="game-cta">Play →</span>
      </div>
    </a>

    <div class="game-card game-card--ghost">
      <div class="game-info">
        <h2 class="game-title">MORE SOON</h2>
        <p class="game-desc">New games in the works</p>
      </div>
    </div>

  </main>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify structure looks correct**

```bash
open index.html
```

Page should load with header and 3 game card slots visible (CSS not yet applied — unstyled is expected here).

- [ ] **Step 3: Commit HTML only**

```bash
git add index.html
git commit -m "feat: add hub page HTML structure"
```

---

## Task 8: Build the hub page — CSS

**Files:**
- Create: `style.css`

- [ ] **Step 1: Create style.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800;900&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg:          #0d0d1a;
  --card-bg:     #13131f;
  --purple:      #a78bfa;
  --blue:        #60a5fa;
  --green:       #22c55e;
  --amber:       #f59e0b;
  --absent:      #2c2c3a;
  --text:        #ffffff;
  --text-muted:  #888888;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  min-height: 100vh;
  padding: 2.5rem 2rem;
}

/* ── Header ── */
.site-header {
  margin-bottom: 3rem;
}

.site-logo {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 0.35em;
  color: var(--purple);
}

.site-tagline {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  margin-top: 0.3rem;
}

/* ── Grid ── */
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 960px;
}

/* ── Cards ── */
.game-card {
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.game-card--purple { border-color: rgba(167, 139, 250, 0.2); }
.game-card--blue   { border-color: rgba(96, 165, 250, 0.2); }

.game-card--purple:hover {
  transform: translateY(-5px);
  border-color: var(--purple);
  box-shadow: 0 8px 40px rgba(167, 139, 250, 0.18);
}

.game-card--blue:hover {
  transform: translateY(-5px);
  border-color: var(--blue);
  box-shadow: 0 8px 40px rgba(96, 165, 250, 0.18);
}

.game-card--ghost {
  border: 1px dashed rgba(255, 255, 255, 0.08);
  opacity: 0.35;
  cursor: default;
  justify-content: center;
  min-height: 100px;
}

/* ── Preview area ── */
.game-preview {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  min-height: 110px;
}

/* Wordle mini */
.preview-wordle {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wrow {
  display: flex;
  gap: 4px;
}

.wt {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 900;
  border-radius: 4px;
}

.wt.correct { background: var(--green);  color: #fff; }
.wt.present { background: var(--amber);  color: #fff; }
.wt.absent  { background: var(--absent); color: #555; }

/* Griddy mini */
.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  width: 96px;
}

.gcell {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background: #1a2a3f;
}

.gcell.filled {
  background: var(--blue);
  opacity: 0.75;
}

/* ── Info area ── */
.game-info {
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.game-title {
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.game-card--purple .game-title { color: var(--purple); }
.game-card--blue   .game-title { color: var(--blue); }
.game-card--ghost  .game-title { color: var(--text-muted); }

.game-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.55;
}

.game-cta {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-top: 0.25rem;
}

.game-card--purple .game-cta { color: var(--purple); }
.game-card--blue   .game-cta { color: var(--blue); }

/* ── Responsive ── */
@media (max-width: 400px) {
  body { padding: 1.5rem 1rem; }
  .game-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Open index.html in browser, verify full design**

```bash
open index.html
```

Verify:
- Dark `#0d0d1a` background
- Purple "STEWDIOBEN" logo, letter-spaced
- "game studio" tagline dimmed below
- 2-column grid on desktop (resize to verify 1-column on narrow)
- Stewordle card: purple border/glow on hover, mini wordle tiles in preview, purple "STEWORDLE" title
- Griddy card: blue border/glow on hover, 3×3 mini grid in preview, blue "GRIDDY" title
- Ghost "MORE SOON" card: dashed border, 35% opacity

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add hub cosmic dark styles"
```

---

## Task 9: Verify griddy build

**Files:** none new — just a build smoke test

- [ ] **Step 1: Install griddy client dependencies**

```bash
cd griddy/client && npm install
```

Expected: Dependencies installed with no errors.

- [ ] **Step 2: Run the griddy build**

```bash
npm run build
```

Expected final lines:
```
The build folder is ready to be deployed.
```

Build output will be at `griddy/client/build/`. Verify `index.html` in that folder references `/griddy/static/...` paths (not `./static/...`):

```bash
grep 'src=' griddy/client/build/index.html | head -3
```

Expected: paths starting with `/griddy/static/`

- [ ] **Step 3: Return to root**

```bash
cd ../..
```

- [ ] **Step 4: Confirm build output is gitignored**

```bash
git status
```

`griddy/client/build/` must NOT appear in the untracked list.

- [ ] **Step 5: No commit needed** — build output is gitignored. Vercel runs the build on deploy.

---

## Task 10: Full commit and push to GitHub

- [ ] **Step 1: Verify everything is staged correctly**

```bash
git status
git diff --stat HEAD
```

Untracked/modified should only show `node_modules/` (if any leaked through).

- [ ] **Step 2: Run tests one final time**

```bash
npm test
```

Expected: All 3 tests pass.

- [ ] **Step 3: Create a GitHub repo named `stewdioben`**

Go to github.com → New repository → name: `stewdioben` → Private or Public as preferred → **do not** initialize with README.

- [ ] **Step 4: Add remote and push**

```bash
git remote add origin https://github.com/benjuh/stewdioben.git
git branch -M main
git push -u origin main
```

---

## Task 11: Vercel setup and domain

- [ ] **Step 1: Import repo in Vercel**

Go to vercel.com → Add New Project → Import `benjuh/stewdioben`.

Framework preset: **Other** (not Next.js, not CRA).

Build & Output Settings:
- Build Command: `npm run build` (Vercel reads this from `vercel.json` — confirm it's pre-filled)
- Output Directory: leave blank (root is served)

Click **Deploy**.

- [ ] **Step 2: Verify deployment**

After deploy completes, open the `.vercel.app` preview URL and check:
- `<url>/` → hub grid loads
- `<url>/stewordle` → stewordle game loads and is playable
- `<url>/griddy` → griddy loads and player data appears (fetched from `/api/players`)

- [ ] **Step 3: Connect Squarespace domain**

In Vercel → Project → Settings → Domains → Add `stewdioben.com`.

Vercel will show DNS records to add. In Squarespace → Domains → stewdioben.com → DNS Settings:
- Add the `A` record Vercel provides (points to `76.76.21.21`)
- Add the `CNAME` record for `www` if desired

DNS propagation: up to 48h but usually ~15 min.

- [ ] **Step 4: Verify on custom domain**

Open `stewdioben.com` and repeat the checks from Step 2.

---

## Adding Future Games (Reference)

When you build a new game and want to add it to the hub:

1. Copy game files into a new folder (e.g., `newgame/`)
2. If it's a React app, add `"homepage": "/newgame"` to its `package.json`
3. Add a new build step to root `package.json` `build` script
4. Add a rewrite in `vercel.json` if needed (static games need no rewrite)
5. Add a new `<a class="game-card game-card--COLOR" href="/newgame">` block in `index.html` with a new accent color CSS variable
6. Push to GitHub — Vercel redeploys automatically
