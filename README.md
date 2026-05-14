# TopSpeech Health

Speech-therapy-style lesson practice delivered as a **mobile-first Progressive Web App (PWA)**. This repository is the **TopSpeech** assignment scaffold: React + Vite, Tailwind v4, design tokens, ESLint, Prettier, and a **Web App Manifest + Workbox service worker** baseline.

---

## Table of contents

1. [Stack](#stack)
2. [Prerequisites](#prerequisites)
3. [Getting started](#getting-started)
4. [NPM scripts](#npm-scripts)
5. [Project layout](#project-layout)
6. [Styling & design tokens](#styling--design-tokens)
7. [PWA (manifest & service worker)](#pwa-manifest--service-worker)
8. [Linting & formatting](#linting--formatting)
9. [Roadmap & delivery](#roadmap--delivery)
10. [Troubleshooting](#troubleshooting)

---

## Stack

| Layer | Choice | Notes |
|--------|--------|--------|
| Runtime | **React 19** | Entry: `src/main.jsx`, root UI: `src/App.jsx`. |
| Build | **Vite 8** | Fast dev server, optimized production builds. |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` | Theme maps to CSS variables in `src/index.css` (`@theme`). |
| PWA | **vite-plugin-pwa** + **Workbox** | Manifest injection, `generateSW` precache strategy. |
| Quality | **ESLint 10** (flat config) + **Prettier** | `eslint-config-prettier` avoids style conflicts with Prettier. |

---

## Prerequisites

- **Node.js** 18+ (20+ recommended; Workbox and tooling assume a current LTS).
- **npm** (comes with Node).

---

## Getting started

```bash
git clone <your-repo-url>
cd Assignment_TopSpeech
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Use **`npm run preview`** after a production build to verify the PWA and caching behavior against the real `dist/` output.

---

## NPM scripts

| Script | What it does |
|--------|----------------|
| `npm run dev` | Starts the Vite dev server with HMR. PWA **dev** options are enabled so you can debug registration and manifest-related behavior locally. |
| `npm run build` | Production build into `dist/`. Also runs the PWA plugin: emits **`manifest.webmanifest`**, **`sw.js`**, and a **Workbox** runtime file, and precaches matched static assets. |
| `npm run preview` | Serves `dist/` locally (use this to test installability and the service worker over HTTP, same as many hosts). |
| `npm run lint` | ESLint over the repo (respects ignores such as `dist/` and `dev-dist/`). |
| `npm run format` | Prettier **write** on tracked file types (see [Linting & formatting](#linting--formatting)). |
| `npm run format:check` | Prettier **check** only (for CI). |

---

## Project layout

```
Assignment_TopSpeech/
├── public/                 # Static files copied as-is (favicon, PWA icons, …)
├── src/
│   ├── assets/             # Images/audio/etc. imported from JS (placeholders via .gitkeep)
│   ├── components/       # Reusable UI (placeholders via .gitkeep)
│   ├── hooks/              # Shared React hooks
│   ├── lib/                # Pure helpers, small modules
│   ├── styles/
│   │   ├── tokens.css      # :root CSS variables (colors, radius, motion)
│   │   └── motion.css      # Shared motion / animation helpers
│   ├── App.jsx             # Root application shell
│   ├── main.jsx            # Entry: React root + PWA `registerSW`
│   ├── index.css           # Tailwind entry + @theme mapping + global base
│   └── vite-env.d.ts       # Vite + vite-plugin-pwa client references
├── index.html              # HTML shell; meta theme-color, title
├── vite.config.js          # Vite + React + Tailwind + VitePWA
├── eslint.config.js        # Flat ESLint + Prettier compatibility
├── .prettierrc             # Prettier defaults
├── .prettierignore         # Excludes build output, lockfile, markdown, …
├── DEVELOPMENT_PLAN.md     # Task IDs (TSH-001 …), phases, git workflow
└── README.md               # This file
```

---

## Styling & design tokens

1. **`src/styles/tokens.css`** defines **`--ts-*`** variables on `:root` (surface, foreground, accent, radius, shadow, motion duration/easing). Reduced motion is handled by shortening durations under `prefers-reduced-motion: reduce`.
2. **`src/index.css`** imports tokens, then **`tailwindcss`**, then maps variables into Tailwind’s **`@theme`** block so utilities like `bg-surface`, `text-accent`, `rounded-card` stay aligned with tokens.
3. **`src/styles/motion.css`** holds shared animation utilities (e.g. card enter) used alongside Tailwind classes.

**Why tokens first:** Tailwind v4’s `@theme` resolves against CSS variables; loading tokens before `@theme` keeps utilities and raw CSS in sync.

---

## PWA (manifest & service worker)

### What is configured

| Piece | Where / how |
|--------|-------------|
| **Web App Manifest** | Generated at build time from `VitePWA({ manifest: { … } })` in `vite.config.js` (name, colors, `display: standalone`, icons, `start_url`, `scope`). |
| **Icons** | `public/pwa-192.png`, `public/pwa-512.png` (placeholders; replace with branded maskable assets when polishing install UX). |
| **Service worker** | **Workbox `generateSW`**: precache list built from `workbox.globPatterns` (JS, CSS, HTML, images, fonts). Output includes **`dist/sw.js`** and a **`dist/workbox-*.js`** helper. |
| **Registration** | `src/main.jsx` calls **`registerSW({ immediate: true })`** from `virtual:pwa-register` so the app registers the SW in dev (when enabled) and production. |
| **Types** | `src/vite-env.d.ts` references `vite-plugin-pwa/client` for editor/TS awareness of virtual modules. |

### Dev vs production

- **`devOptions.enabled: true`** (in `vite.config.js`) turns on PWA-related behavior during `npm run dev` so you can iterate without only relying on `preview`.
- A successful **`npm run build`** should end with a short **PWA** summary in the terminal (precache entry count and paths like `dist/sw.js`). Then use **`npm run preview`** to validate installation and offline behavior.

### Register type

**`registerType: 'autoUpdate'`** means when you ship a new build, the new service worker can take over without prompting the user each time (sensible default for content-style apps). You can switch to `'prompt'` later if you want explicit “new version” UX.

---

## Linting & formatting

- **ESLint** (`eslint.config.js`): recommended JS rules, React Hooks, React Refresh for Vite, browser globals. **`eslint-config-prettier/flat`** is applied last so it does not fight Prettier on formatting rules.
- **Prettier** (`.prettierrc`): no semicolons, single quotes, ES5 trailing commas. **`.prettierignore`** excludes `node_modules`, `dist`, `dev-dist`, `package-lock.json`, coverage, and **`**/*.md`** so prose/planning files are only reformatted when you choose to include them.

---

## Roadmap & delivery

Work is tracked by **task IDs** (`TSH-001` …) with suggested branch names and merge order in:

**[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)**

That document is the source of truth for phases (lesson flow, cards, feedback, PWA polish, deploy, etc.). This README stays focused on **how to run and extend the codebase**; the plan describes **what to build next**.

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| **No `dist/sw.js` after build** | Ensure the build finished completely. The PWA plugin runs Workbox after the main bundle; a failed or interrupted build can omit the SW. Re-run `npm run build` and look for the **PWA v…** log lines. |
| **Install prompt missing** | Use **HTTPS** (or `localhost`). Confirm **`manifest.webmanifest`** is linked (Vite plugin injects the link) and icon URLs return **200**. |
| **Stale UI after deploy** | With `autoUpdate`, clients pick up a new SW after a navigation; hard refresh or closing tabs can help during testing. |
| **ESLint vs Prettier disagreements** | Keep **`eslint-config-prettier`** last in `eslint.config.js`. Run `npm run format` before `npm run lint` if needed. |

---

## License

This project is **private** (`"private": true` in `package.json`). Add an explicit license file if you open-source it later.
