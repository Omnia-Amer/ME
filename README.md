# Omnia Amer — Portfolio v2

**Live:** <https://omnia-amer.vercel.app>

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

**Production is Vercel** — `vercel.json` (zero-config Vite, SPA rewrite), served at
<https://omnia-amer.vercel.app>. Connect this repo under the project's
*Settings → Git* for push-to-deploy, or run `vercel --prod` from a logged-in CLI.

`.github/workflows/deploy.yml` also builds for **GitHub Pages** with
`VITE_BASE=/<repo>/` (adds `404.html` + `.nojekyll`) if you'd rather host there;
`vite.config.ts` reads `VITE_BASE` so the same build serves both.

## Adding a component from 21st.dev

```bash
npx shadcn@latest add "https://21st.dev/r/<author>/<component>"
```

Files land in `src/components/ui/`. `cn()` lives in `src/lib/utils.ts`.
