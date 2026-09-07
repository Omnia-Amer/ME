# Omnia Amer — Portfolio v2

**Live:** <https://omnia-amer.vercel.app> · **Mirror:** <https://omnia-amer.github.io/ME/>

A ground-up redesign of [omnia-amer.github.io/portfolio](https://omnia-amer.github.io/portfolio/),
rebuilt as a React application with real motion design. Dark theme only for now
(the light theme is built but the toggle is disabled).

**Stack**

| | |
|---|---|
| Framework | React 19 + Vite 8 + TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens, dark-first + light) |
| Motion | [`framer-motion`](https://www.framer.com/motion/) — page transitions, scroll reveals, magnetic buttons, accordions, screenshot lightbox |
| Components | [21st.dev](https://21st.dev) / MagicUI registry via `shadcn` (see `src/components/ui/`) |
| Routing | `react-router-dom` (HashRouter — works on any static host) |
| i18n | English + Arabic with full RTL, porting the legacy `i18n-ar.js` dictionary |
| Design intelligence | UI/UX Pro Max skill (`uipro-cli`), installed for Antigravity **and** Claude Code — see `.agent/` and `.claude/skills/`, generated system in `design-system/` |

## Content

All copy, case studies (18), captions, and the Arabic dictionary are **ported verbatim**
from the legacy hand-authored site. `scripts/extract-content.mjs` parses
`../portfolio/index.html` and emits `src/content/*.generated.ts`. Re-run after any change
to the legacy source:

```bash
node scripts/extract-content.mjs
```

## Develop

```bash
npm install
npm run dev
```

- `?static` in the URL (`localhost:5173/?static#/`) forces the fully-visible,
  no-entrance-animation render — useful for screenshots, and the automatic mode
  for `prefers-reduced-motion` and non-painting environments.

## Build

```bash
npm run build      # tsc + vite build -> dist/
npm run preview
```

## Deploy

Both targets auto-deploy on every push to `main`:

- **Vercel** (`vercel.json`) — <https://omnia-amer.vercel.app>. Connected to the
  Vercel project; PRs also get preview URLs.
- **GitHub Pages** (`.github/workflows/pages.yml`) — <https://omnia-amer.github.io/ME/>.
  `VITE_BASE` comes from `actions/configure-pages`, so it tracks the repo name;
  the workflow adds a `404.html` SPA fallback and `.nojekyll`.

`vite.config.ts` reads `VITE_BASE` so one build serves any base path.

## Adding a component from 21st.dev

```bash
npx shadcn@latest add "https://21st.dev/r/<author>/<component>"
```

Files land in `src/components/ui/`. `cn()` lives in `src/lib/utils.ts`.
