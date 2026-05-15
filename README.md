# TopSpeech Health

Speech-therapy-style lesson practice delivered as a **mobile-first Progressive Web App (PWA)**. Built with React + Vite, Tailwind v4, design tokens, ESLint, Prettier, and a **Web App Manifest + Workbox service worker** baseline.

**Current UX:** a **lesson state machine** (`TSH-002`) drives **start → sequential cards → end**, powered by static config in `src/data/lessonConfig.js`. Card exercise types, feedback, and rewards are planned in later tasks (see [Roadmap & delivery](#roadmap--delivery)).

---

## Table of contents

1. [Stack](#stack)
2. [Prerequisites](#prerequisites)
3. [Getting started](#getting-started)
4. [NPM scripts](#npm-scripts)
5. [Project layout](#project-layout)
6. [Lesson flow](#lesson-flow)
7. [Styling & design tokens](#styling--design-tokens)
8. [PWA (manifest & service worker)](#pwa-manifest--service-worker)
9. [Linting & formatting](#linting--formatting)
10. [Roadmap & delivery](#roadmap--delivery)
11. [Troubleshooting](#troubleshooting)

---

## Stack

| Layer | Choice | Notes |
|--------|--------|--------|
| Runtime | **React 19** | Entry: `src/main.jsx`; root renders `LessonFlow` via `src/App.jsx`. |
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

Open the URL Vite prints (usually `http://localhost:5173`). You should see the **lesson start screen**; tap **Start lesson** to walk through placeholder cards, then **Practice again** to return to start.

Use **`npm run preview`** after a production build to verify the PWA and caching behavior against the real `dist/` output.

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
│   ├── assets/             # Images/audio/etc. imported from JS
│   ├── components/
│   │   └── lesson/         # StartScreen, CardScreen, EndScreen, LessonFlow, LessonButton
│   ├── data/
│   │   └── lessonConfig.js # Static `dailyLesson` — titles, cards[], completion copy
│   ├── hooks/
│   │   └── useLessonMachine.js  # useReducer wrapper for lesson navigation
│   ├── lib/
│   │   └── lessonMachine.js     # Pure reducer: start → card → end
│   ├── styles/
│   │   ├── tokens.css      # :root CSS variables (colors, radius, motion)
│   │   └── motion.css      # Shared motion / animation helpers (e.g. .ts-card-enter)
│   ├── App.jsx             # Root shell — renders `<LessonFlow />`
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

## Lesson flow

Implemented in **TSH-002**. The app is a small **finite state machine**: one phase at a time, with navigation driven by static lesson data (not hardcoded card counts in UI code).

### Phases and actions

| Phase | Screen | User action | Next phase |
|--------|--------|-------------|------------|
| `start` | `StartScreen` | Start lesson | `card` (index `0`) |
| `card` | `CardScreen` | Continue / Finish lesson | next card or `end` |
| `end` | `EndScreen` | Practice again | `start` |

Reducer actions: `START_LESSON`, `NEXT`, `RESTART` — see `src/lib/lessonMachine.js`.

### Key files

| File | Responsibility |
|------|----------------|
| `src/data/lessonConfig.js` | `dailyLesson`: `title`, `description`, `cards[]`, `completion` |
| `src/lib/lessonMachine.js` | `LESSON_PHASE`, `lessonReducer`, `getCurrentCard` |
| `src/hooks/useLessonMachine.js` | React state + `startLesson` / `next` / `restart` |
| `src/components/lesson/LessonFlow.jsx` | Renders the screen for the current phase |
| `src/components/lesson/*.jsx` | Presentational start / card / end UI |

### Extending the lesson

1. **Add or edit cards** in `lessonConfig.js` (`id`, `title`, `body` today; `type` and exercise fields in **TSH-003**).
2. **Card count** is `lesson.cards.length` — the reducer uses it so the last **NEXT** transitions to `end` automatically.
3. **New navigation** (e.g. skip, back): extend `lessonReducer` and expose actions from `useLessonMachine`; keep UI components thin.

Placeholder card copy is intentional until **TSH-003** (exercise types), **TSH-004** (feedback/transitions), and **TSH-005** (progress bar / streak–XP on the end screen).

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

Work is tracked by **task IDs** (`TSH-001` …) with suggested branch names and merge order in **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)**.

| ID | Status | Notes |
|----|--------|--------|
| TSH-001 | Done | Scaffold, tokens, PWA baseline |
| TSH-002 | Done | Lesson state machine + static config (this section) |
| TSH-003 … TSH-009 | Planned | Card types, feedback, rewards, a11y polish, deploy |

That document is the source of truth for phases and git workflow. This README focuses on **how to run and extend the codebase**; the plan tracks **what to build next**.

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
