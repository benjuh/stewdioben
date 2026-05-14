# Handoff: Next Features for stewdioben.com

## Project State

stewdioben.com is live. Monorepo at github.com/benjuh/stewdioben, deployed on Vercel.

Structure:
- `/` → hub (index.html + style.css, cosmic dark theme, Raleway font)
- `/stewordle/` → stewordle game (vanilla HTML/CSS/JS, stewordle/index.html + script.js + style.css)
- `/griddy` → griddy game (React 18 CRA, griddy/client/, built at griddy/client/build/)
- `/api/players` → Vercel serverless fn (api/players.js reads griddy/server/players.json)
- `vercel.json` → routing (redirects /stewordle → /stewordle/, rewrites /griddy/* → build output)
- `package.json` → root build: `cd griddy/client && CI=false npm run build`

Stewordle v2 is the current version (cyan header, pill mode tabs top-right). Griddy is React CRA app.

---

## Feature 1: Back-to-Hub Button

Add a "← stewdioben" link in the top-left of both game headers that navigates to `/`.

### Stewordle

File: `stewordle/index.html`

The header currently looks like:
```html
<header class="header">
  <div class="header-left">
    <span class="title">Stewordle</span>
    <button class="theme-toggle" id="theme-toggle">&#9788; Light</button>
  </div>
  <nav class="mode-tabs" id="mode-tabs">
    ...
  </nav>
</header>
```

Add a back link BEFORE the title in `.header-left`:
```html
<a class="hub-back" href="/">← stewdioben</a>
```

Style in `stewordle/style.css` (match the existing color scheme — purple `#a78bfa`):
```css
.hub-back {
  color: #a78bfa;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.hub-back:hover { opacity: 1; }
```

### Griddy

File: `griddy/client/src/` — find the top-level App.js or equivalent header component.

Add an `<a href="/">← stewdioben</a>` link in the top-left of the header. Style to match griddy's existing UI (blue accent).

---

## Feature 2: Griddy UI Overhaul + Speed Optimizations

### UI Overhaul

Griddy currently uses default CRA styling. Bring it in line with the stewdioben cosmic dark aesthetic:
- Dark background matching `#0d0d1a`
- Blue accent `#60a5fa` for interactive elements
- Raleway font (or match whatever font griddy currently uses)
- Card/grid cells with border-radius, subtle borders, hover states
- Mobile-first responsive layout

Key files to modify:
- `griddy/client/src/styles/Grid.css`
- `griddy/client/src/styles/Hints.css`
- Any inline styles in `griddy/client/src/Grid.js`, `griddy/client/src/Hints.js`

### Speed Optimizations

Griddy loads/processes player data. Common issues to look for:
- `griddy/client/src/Grid.js` — check if player filtering runs on every render (should use `useMemo`)
- `griddy/client/src/player.js` — check if player image fetching is eager (should be lazy/on-demand)
- `griddy/server/players.json` (3MB) served via `/api/players` serverless fn — consider if data can be trimmed (remove unused fields per player object to reduce payload)
- Add `React.memo` to pure display components in Grid/Hints
- Check for unnecessary re-renders with React DevTools

---

## Feature 3: Stewordle Mode Tabs Bigger

The mode tabs (Classic, Quad, Octo, 16) are currently small pill buttons in the top-right of the header.

File: `stewordle/style.css`

Find the `.mode-tab` and `.mode-tabs` rules. Increase font size, padding, and gap between tabs. Example direction:
```css
.mode-tab {
  font-size: 0.85rem;   /* was likely 0.7rem or similar */
  padding: 0.4rem 1rem; /* was likely smaller */
}
```

Also consider: on mobile, the tabs overflow the header. They may need to wrap or the header may need flex-wrap.

---

## Dev Workflow

```bash
# Test stewordle locally
open stewordle/index.html

# Run griddy locally
npm run dev:griddy   # starts CRA dev server on :3000, proxies /api to :3001
# For full stack: also run `node griddy/server/index.js` on :3001

# Run tests
npm test

# Deploy: just push to main
git push origin main  # Vercel auto-redeploys
```

## Notes

- Do NOT use `git add -A` — avoid accidentally committing `griddy/client/build/` or `node_modules/`
- CRA build must use `CI=false npm run build` (set in package.json) — Vercel env sets CI=true which makes ESLint errors fail the build
- Stewordle game files (script.js, style.css) are the authoritative source — they were copied from github.com/benjuh/stewordle. If stewordle is updated upstream, re-copy the 3 files.
