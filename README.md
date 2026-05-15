# TopSpeech Health

Speech-therapy-style lesson practice delivered as a **mobile-first Progressive Web App (PWA)**. Built with React + Vite, Tailwind v4, design tokens, ESLint, Prettier, and a **Web App Manifest + Workbox service worker** baseline.

**Current UX:** a **lesson state machine** (`TSH-002`) drives **start → sequential cards → end**, powered by static config in `src/data/lessonConfig.js`. **Three exercise types** (`listen`, `repeat`, `choose`) with **five cards**, **Web Speech playback**, and **choose-card correct/incorrect feedback** are implemented (`TSH-003` + early choose feedback). Progress bar, animated transitions, and streak/XP are planned next (see [Roadmap & delivery](#roadmap--delivery)).

---

## Table of contents

1. [Stack](#stack)
2. [Prerequisites](#prerequisites)
3. [Getting started](#getting-started)
4. [NPM scripts](#npm-scripts)
5. [Project layout](#project-layout)
6. [Lesson flow](#lesson-flow)
7. [Card types & static content (TSH-003)](#card-types--static-content-tsh-003)
8. [Speech model playback](#speech-model-playback)
9. [Choose exercise feedback](#choose-exercise-feedback)
10. [Styling & design tokens](#styling--design-tokens)
11. [PWA (manifest & service worker)](#pwa-manifest--service-worker)
12. [Linting & formatting](#linting--formatting)
13. [Roadmap & delivery](#roadmap--delivery)
14. [Troubleshooting](#troubleshooting)

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

Open the URL Vite prints (usually `http://localhost:5173`). You should see the **lesson start screen**; tap **Start lesson** to walk through **listen → repeat → listen → choose → repeat** cards, then **Practice again** to return to start.

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
│   ├── assets/             # Images/audio/etc. imported from JS (future recorded models)
│   ├── components/
│   │   └── lesson/
│   │       ├── cards/      # ListenExercise, RepeatExercise, ChooseExercise, CardExercise
│   │       ├── LessonFlow.jsx, CardScreen.jsx, StartScreen.jsx, EndScreen.jsx
│   │       ├── LessonButton.jsx, PlayModelButton.jsx, ExerciseFeedback.jsx
│   ├── data/
│   │   ├── lessonConfig.js # Static `dailyLesson` — all copy and card payloads
│   │   └── cardTypes.js    # CARD_TYPE constants (listen | repeat | choose)
│   ├── hooks/
│   │   └── useLessonMachine.js
│   ├── lib/
│   │   ├── lessonMachine.js  # Pure reducer: start → card → end
│   │   ├── speechModel.js    # Web Speech API helper for Play model
│   │   └── chooseResult.js   # Pure helper for choose-card answered state
│   ├── styles/
│   │   ├── tokens.css
│   │   └── motion.css
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── vite.config.js
├── eslint.config.js
├── DEVELOPMENT_PLAN.md
└── README.md
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
| `src/data/lessonConfig.js` | `dailyLesson`: metadata, `cards[]`, `completion` |
| `src/data/cardTypes.js` | `CARD_TYPE` enum used in config and UI routing |
| `src/lib/lessonMachine.js` | `LESSON_PHASE`, `lessonReducer`, `getCurrentCard` |
| `src/lib/speechModel.js` | `speakModel`, `stopModelSpeech`, voice selection |
| `src/lib/chooseResult.js` | `getChooseResult(card, selectedId)` for choose feedback |
| `src/hooks/useLessonMachine.js` | React state + `startLesson` / `next` / `restart` |
| `src/components/lesson/LessonFlow.jsx` | Phase orchestration |
| `src/components/lesson/CardScreen.jsx` | Card chrome + choose selection state |
| `src/components/lesson/cards/CardExercise.jsx` | Maps `card.type` → exercise component |

### Extending navigation

1. **Card count** is `lesson.cards.length` — the reducer uses it so the last **NEXT** transitions to `end` automatically.
2. **New navigation** (skip, back): extend `lessonReducer` and expose actions from `useLessonMachine`; keep UI components thin.

---

## Card types & static content (TSH-003)

All lesson content lives in **`src/data/lessonConfig.js`**. Components do not hardcode card copy or counts.

### Exercise types

Defined in `src/data/cardTypes.js`:

| Constant | Value | UI component | Purpose |
|----------|-------|--------------|---------|
| `CARD_TYPE.LISTEN` | `listen` | `ListenExercise` | Hear a model sound (display target + play) |
| `CARD_TYPE.REPEAT` | `repeat` | `RepeatExercise` | Repeat syllable or phrase (display + optional play) |
| `CARD_TYPE.CHOOSE` | `choose` | `ChooseExercise` | Multiple choice — pick the word that matches |

`CardExercise.jsx` maps `card.type` to the correct component (**strategy pattern**). Unknown types render a fallback message.

### Current lesson (`dailyLesson`)

Five cards in order:

1. **Listen** — vowel “ah” (plays example word `father`)
2. **Repeat** — syllable `ma`
3. **Listen** — vowel “ee” (plays `see`)
4. **Choose** — which word uses “ee”? (`see` / `say` / `so`)
5. **Repeat** — phrase `I see the sea`

### Card config schema

**Lesson root**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Lesson identifier |
| `title` | string | Shown on start screen |
| `description` | string | Subtitle on start screen |
| `cards` | array | Ordered exercise cards |
| `completion.title` | string | End screen heading |
| `completion.message` | string | End screen body |

**Shared card fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Stable key (used as React `key`) |
| `type` | `listen` \| `repeat` \| `choose` | yes | Routes to exercise UI |
| `title` | string | yes | Card heading |
| `prompt` | string | yes | Instruction body |

**Listen & repeat**

| Field | Type | Description |
|-------|------|-------------|
| `target` | string | Large display text (glyph on screen) |
| `modelText` | string | Spoken on **Play model** (defaults to `target`) |
| `modelRate` | number | Speech rate (0.9 typical; optional) |
| `phonetic` | string \| null | IPA hint under target |
| `hint` | string | Listen-only footer tip |
| `tip` | string | Repeat-only coaching tip |

**Choose**

| Field | Type | Description |
|-------|------|-------------|
| `vowelHint` | string | Used in correct-feedback copy |
| `options` | array | `{ id, label, isCorrect }` — exactly one `isCorrect: true` |

### Adding a new card

```js
// src/data/lessonConfig.js
import { CARD_TYPE } from './cardTypes.js'

// Inside dailyLesson.cards:
{
  id: 'card-listen-oh',
  type: CARD_TYPE.LISTEN,
  title: 'Listen: “Oh”',
  prompt: 'Round your lips slightly.',
  target: 'oh',
  modelText: 'go',      // natural word for TTS
  modelRate: 0.9,
  phonetic: '/oʊ/',
  hint: 'As in “go”.',
}
```

No reducer changes needed unless you add new navigation rules.

### Adding a new exercise type

1. Add constant in `cardTypes.js`.
2. Create `src/components/lesson/cards/MyExercise.jsx`.
3. Register in `CardExercise.jsx` `EXERCISE_BY_TYPE` map.
4. Add cards with the new `type` in `lessonConfig.js`.

---

## Speech model playback

**File:** `src/lib/speechModel.js`  
**UI:** `PlayModelButton.jsx` (used by listen and repeat cards)

### Why Web Speech API?

There are no bundled `.mp3` assets yet. The browser’s **`speechSynthesis`** speaks `modelText` on tap without a server or extra dependencies. Good for prototyping; production speech therapy apps often swap in **recorded clinician audio** per card.

### Behavior

| Function | Role |
|----------|------|
| `isSpeechModelSupported()` | Feature detect |
| `speakModel(text, { rate, pitch })` | Cancel prior utterance, speak text, return a Promise |
| `stopModelSpeech()` | Cancel on unmount |

**Important:** `speechSynthesis.speak()` runs **synchronously in the click handler** (no `await` before `speak`). Mobile Safari can block playback if speech starts outside the user gesture.

### Voice selection

`pickEnglishVoice()` prefers high-quality system voices when available (e.g. Samantha, Google US English, Microsoft Aria). Falls back to any `en-US` / `en` voice.

### Natural pronunciation

Isolated vowels (`"ah"`, `"ee"`) often sound robotic. Config uses **`modelText`** with real words:

| Display (`target`) | Spoken (`modelText`) |
|--------------------|----------------------|
| `ah` | `father` |
| `ee` | `see` |
| `ma` | `ma` |
| `I see the sea` | full phrase |

Listen cards show **“Play example: father”** when `modelText !== target`.

### Replacing with real audio (later)

```js
// Future pattern in PlayModelButton or a dedicated hook:
const audio = new Audio(`/audio/${card.id}.mp3`)
await audio.play()
```

Keep `modelText` / `audioUrl` in config so content stays data-driven.

---

## Choose exercise feedback

**Files:** `ChooseExercise.jsx`, `ExerciseFeedback.jsx`, `chooseResult.js`  
**State:** `CardScreen` holds `chooseSelection`; options lock after first tap.

### Flow

1. User taps an option → `onSelect(optionId)`.
2. `getChooseResult(card, selectedId)` returns `{ answered, isCorrect, selected, correct }`.
3. UI updates:
   - **Correct pick:** green styling + “Correct!” banner (`role="status"`, `aria-live="polite"`).
   - **Wrong pick:** red on selection, **green on the correct option**, “Not quite.” banner with the right answer.
4. All option buttons `disabled` until **Continue**.
5. Continue enabled only after a selection (`CardScreen`).

### Styling tokens

Uses Tailwind utilities mapped from tokens: `text-success`, `bg-success/10`, `text-danger`, `border-danger`, etc. (see `tokens.css`).

### Scope vs TSH-004

Choose cards have **immediate** correct/incorrect feedback. **TSH-004** will add animated transitions between cards and may extend feedback to other types or post-Continue states.

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
| TSH-002 | Done | Lesson state machine + static config |
| TSH-003 | Done | 3 exercise types, 5 cards, speech playback, choose feedback |
| TSH-004 … TSH-009 | Planned | Card transitions, progress bar, rewards, deploy |

That document is the source of truth for phases and git workflow. This README focuses on **how to run and extend the codebase**; the plan tracks **what to build next**.

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| **Play model does nothing** | Use Chrome, Safari, or Edge (not all browsers support `speechSynthesis`). Ensure volume is up and the tab is not muted. Tap must come from a real click (required on iOS). |
| **Play model sounds odd** | TTS quality varies by OS/voice. Set `modelText` to a natural word in `lessonConfig.js` (see [Speech model playback](#speech-model-playback)). |
| **Choose card: no feedback** | You must tap an option first; feedback appears immediately, then **Continue**. Refresh if HMR left stale state. |
| **No `dist/sw.js` after build** | Ensure the build finished completely. The PWA plugin runs Workbox after the main bundle; a failed or interrupted build can omit the SW. Re-run `npm run build` and look for the **PWA v…** log lines. |
| **Install prompt missing** | Use **HTTPS** (or `localhost`). Confirm **`manifest.webmanifest`** is linked (Vite plugin injects the link) and icon URLs return **200**. |
| **Stale UI after deploy** | With `autoUpdate`, clients pick up a new SW after a navigation; hard refresh or closing tabs can help during testing. |
| **ESLint vs Prettier disagreements** | Keep **`eslint-config-prettier`** last in `eslint.config.js`. Run `npm run format` before `npm run lint` if needed. |

---

## License

This project is **private** (`"private": true` in `package.json`). Add an explicit license file if you open-source it later.
