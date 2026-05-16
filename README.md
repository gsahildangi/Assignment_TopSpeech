# TopSpeech Health

Speech-therapy-style lesson practice delivered as a **mobile-first Progressive Web App (PWA)**. Built with React + Vite, Tailwind v4, design tokens, ESLint, Prettier, and a **Web App Manifest + Workbox service worker** baseline.

**Current UX:** a **lesson state machine** (`TSH-002`) drives **start → sequential cards → end**, powered by static config in `src/data/lessonConfig.js`. **Three exercise types** (`listen`, `repeat`, `choose`) with **five cards**, **Web Speech playback**, **choose-card feedback with cheer and encouragement**, **animated card enter/exit transitions**, a **lesson progress bar**, **XP + streak rewards** on completion (`TSH-003`–`TSH-005`), **mobile-first layout with tap targets, keyboard focus, and reduced-motion support** (`TSH-006`), and **installable PWA manifest + service worker** (`TSH-007`) are implemented. Innovation and deploy are next (see [Roadmap & delivery](#roadmap--delivery)).

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
10. [Feedback & card transitions (TSH-004)](#feedback--card-transitions-tsh-004)
11. [Completion & rewards (TSH-005)](#completion--rewards-tsh-005)
12. [Responsive layout & accessibility (TSH-006)](#responsive-layout--accessibility-tsh-006)
13. [Styling & design tokens](#styling--design-tokens)
14. [PWA (manifest & service worker)](#pwa-manifest--service-worker)
15. [Linting & formatting](#linting--formatting)
16. [Roadmap & delivery](#roadmap--delivery)
17. [Troubleshooting](#troubleshooting)

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

Open the URL Vite prints (usually `http://localhost:5173`). You should see the **lesson start screen**; tap **Start lesson** to walk through **listen → repeat → listen → choose → repeat** cards (watch the **progress bar** advance), then see **XP and streak** on the completion screen. Tap **Practice again** to return to start.

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
| `npm run icons` | Regenerate `public/pwa-*.png` and `apple-touch-icon.png` from `public/icons/icon-source.svg`. |

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
│   │       ├── LessonProgress.jsx, RewardStat.jsx
│   │       ├── LessonButton.jsx, PlayModelButton.jsx, ExerciseFeedback.jsx
│   ├── data/
│   │   ├── lessonConfig.js # Static `dailyLesson` — all copy and card payloads
│   │   └── cardTypes.js    # CARD_TYPE constants (listen | repeat | choose)
│   ├── hooks/
│   │   ├── useLessonMachine.js
│   │   └── useReducedMotion.js # OS prefers-reduced-motion for JS timers
│   ├── lib/
│   │   ├── lessonMachine.js  # Pure reducer: start → card → end
│   │   ├── speechModel.js    # Web Speech API helper for Play model
│   │   ├── chooseResult.js   # Pure helper for choose-card answered state
│   │   ├── feedbackCopy.js   # Cheer / encouragement lines for choose feedback
│   │   ├── lessonProgress.js # Pure progress fraction for the lesson bar
│   │   ├── lessonRewards.js  # XP + streak on lesson completion
│   │   ├── rewardsStore.js   # localStorage persistence for rewards
│   │   └── motionPreference.js # Card exit delay synced with reduced motion
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── layout.css        # Shell, safe areas, tap targets, focus ring
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
| `src/components/lesson/LessonFlow.jsx` | Phase orchestration, progress bar, reward grant on last card |
| `src/components/lesson/LessonProgress.jsx` | Progress bar during `card` phase |
| `src/components/lesson/CardScreen.jsx` | Card chrome, choose selection, exit transition before `NEXT` |
| `src/components/lesson/EndScreen.jsx` | Completion copy + XP / streak reward tiles |
| `src/lib/lessonProgress.js` | `getLessonProgress(cardNumber, cardCount)` |
| `src/lib/lessonRewards.js` | `completeLessonRewards()` — XP and streak rules |
| `src/lib/rewardsStore.js` | `loadRewards` / `saveRewards` via `localStorage` |
| `src/components/lesson/ExerciseFeedback.jsx` | Correct/incorrect banner with cheer or encouragement |
| `src/lib/feedbackCopy.js` | `getCorrectCheer`, `getIncorrectEncouragement` (stable per attempt) |
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
| `completion.xpReward` | number | XP granted when the lesson finishes (default `20` if omitted) |

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
   - **Wrong pick:** red on selection, **green on the correct option**, supportive banner (see [TSH-004](#feedback--card-transitions-tsh-004)).
4. All option buttons `disabled` until **Continue**.
5. Continue enabled only after a selection (`CardScreen`).

### Styling tokens

Uses Tailwind utilities mapped from tokens: `text-success`, `bg-success/10`, `text-danger`, `border-danger`, etc. (see `tokens.css`).

---

## Feedback & card transitions (TSH-004)

**Goal:** reinforce correct answers with cheer, keep learners motivated after a wrong pick, and animate movement between cards.

### Key files

| File | Responsibility |
|------|----------------|
| `src/lib/feedbackCopy.js` | Rotating **cheer** (correct) and **encouragement** (incorrect) lines; stable per `card.id` + selection |
| `src/components/lesson/ExerciseFeedback.jsx` | Banner UI: icon, title, cheer line, detail copy; `ts-feedback-pop` animation |
| `src/components/lesson/cards/ChooseExercise.jsx` | Wires feedback copy into choose results |
| `src/components/lesson/CardScreen.jsx` | `ts-card-exit` on Continue, then calls `onNext` after motion duration |
| `src/styles/motion.css` | `ts-card-enter`, `ts-card-exit`, `ts-feedback-pop`, `ts-cheer-icon` |

### Choose feedback copy

After a tap, `ExerciseFeedback` shows:

| Outcome | Title | Second line (`cheer` prop) | Detail (`children`) |
|---------|--------|----------------------------|---------------------|
| Correct | **Correct!** 🎉 | Random cheer from `getCorrectCheer()` | Vowel explanation (e.g. which sound the word uses) |
| Incorrect | **Keep going** 💪 | Random encouragement from `getIncorrectEncouragement()` | Correct answer + short contrast note |

Copy is chosen with a small hash of `cardId` + `selectedId` so it does not change on re-render. Edit lines in `feedbackCopy.js` to tune tone.

### Card transition flow

1. User taps **Continue** (or **Finish lesson** on the last card).
2. `CardScreen` sets `isExiting` → applies **`ts-card-exit`** (fade up, 280ms, matches `--ts-duration-normal`).
3. Timer fires → `onNext()` → `lessonReducer` advances `cardIndex` or moves to `end`.
4. `LessonFlow` remounts `CardScreen` with `key={currentCard.id}` → **`ts-card-enter`** on the next card.

Reduced motion: see [Responsive layout & accessibility (TSH-006)](#responsive-layout--accessibility-tsh-006) — durations shorten in `tokens.css`, animations disable in `motion.css`, and `CardScreen` skips the exit wait in JS.

### Definitions

| Term | Meaning |
|------|---------|
| **Feedback state** | `{ answered, isCorrect, selected, correct }` from `getChooseResult()` |
| **Cheer** | Positive line on a correct choose answer |
| **Encouragement** | Supportive line on an incorrect choose answer (not a score or judgment) |
| **Enter / exit transition** | CSS animations on card mount vs. before `NEXT` |

Listen and repeat cards do not use `ExerciseFeedback` yet; only the choose type has scored feedback.

---

## Completion & rewards (TSH-005)

**Goal:** show learners how far they are through the lesson and celebrate completion with Duolingo-style **XP** and a **streak**, without a backend.

### Key files

| File | Responsibility |
|------|----------------|
| `src/lib/lessonProgress.js` | Pure `getLessonProgress(cardNumber, cardCount)` — fraction, percent, label |
| `src/components/lesson/LessonProgress.jsx` | Bar + “Card X of Y” + `role="progressbar"` |
| `src/lib/rewardsStore.js` | Read/write `{ streak, totalXp, lastPracticeDate }` in `localStorage` |
| `src/lib/lessonRewards.js` | `completeLessonRewards({ xpReward })` — streak rules + XP grant |
| `src/components/lesson/RewardStat.jsx` | Single reward tile (icon, label, value, detail) |
| `src/components/lesson/EndScreen.jsx` | Completion message + two reward tiles |
| `src/components/lesson/LessonFlow.jsx` | Renders `LessonProgress` in `card` phase; calls rewards on last **Continue** |
| `src/styles/motion.css` | `ts-progress-fill` (bar width transition), `ts-reward-stat` (staggered pop-in) |

### Progress bar

- Rendered in **`LessonFlow`** above `CardScreen` (not inside the card), so it **does not remount** when `key={currentCard.id}` changes — the fill can animate smoothly between cards.
- **Fill** = `cardNumber / cardCount` (1-based card number from `useLessonMachine`). Card 1 of 5 → 20%; card 5 of 5 → 100%.
- Duplicate “Card X of Y” text was removed from `CardScreen`; the progress component owns that label.

### Rewards flow

1. User taps **Finish lesson** on the last card → `CardScreen` exit animation → `handleNext` in `LessonFlow`.
2. If `cardIndex >= cardCount - 1`, **`completeLessonRewards()`** runs **before** `next()` dispatches to `end` (avoids double-award in React Strict Mode and keeps side effects out of `useEffect`).
3. Result is stored in React state and passed to **`EndScreen`** as `rewards`.
4. **Practice again** clears reward state and dispatches `RESTART`.

### Streak rules

Uses **local calendar days** (`YYYY-MM-DD` via `toPracticeDateKey()`):

| `lastPracticeDate` vs today | Streak behavior |
|----------------------------|-----------------|
| Same day | Streak unchanged; XP still added |
| Yesterday | Streak + 1 |
| `null` (first ever) | Streak → 1 |
| Older gap | Streak resets to 1 |

**XP** is added on **every** lesson completion (`totalXp` accumulates). Streak copy is returned as `streakMessage` for the streak tile detail line.

### Config

In `lessonConfig.js`:

```js
completion: {
  title: 'Lesson complete',
  message: 'Nice work on today’s vowel warm-up. Your practice counts toward your streak.',
  xpReward: 25,
},
```

### Storage key

`localStorage` key: **`topspeech_rewards`**. Clear site data in dev tools to reset streak/XP during testing.

### Definitions

| Term | Meaning |
|------|---------|
| **Lesson progress** | Position in `dailyLesson.cards`; UI percent = current 1-based card index ÷ total cards |
| **XP** | Points per completion from `completion.xpReward`; persisted as `totalXp` |
| **Streak** | Consecutive calendar days with at least one completed lesson |
| **`lastPracticeDate`** | Date key of the most recent completion; drives streak increment vs reset |
| **`completeLessonRewards()`** | Side-effecting helper: updates storage, returns snapshot for the end screen |

---

## Responsive layout & accessibility (TSH-006)

**Goal:** polish the lesson UI for phones and touch, keep controls easy to tap, respect **Reduce motion** OS settings, and improve baseline keyboard/screen-reader support.

### Key files

| File | Responsibility |
|------|----------------|
| `src/styles/layout.css` | `ts-app-main`, `ts-lesson-shell`, `ts-lesson-card`, `ts-tap-target`, `ts-focus-ring`, skip link |
| `src/styles/motion.css` | `@media (prefers-reduced-motion: reduce)` — disables enter/exit, feedback pop, cheer bounce, reward stagger, progress transition |
| `src/styles/tokens.css` | Shortens `--ts-duration-*` under reduced motion (fallback for anything still timed) |
| `src/lib/motionPreference.js` | `getCardExitDelayMs()` — `0` vs `280ms` for card advance after exit |
| `src/hooks/useReducedMotion.js` | Subscribes to `matchMedia('(prefers-reduced-motion: reduce)')` |
| `src/App.jsx` | Skip link → `#lesson-main`; `ts-app-main` shell with safe-area padding |
| `src/components/lesson/LessonFlow.jsx` | `ts-lesson-shell` + `role="region"` |
| `src/components/lesson/LessonButton.jsx` | Primary actions — tap target + focus ring |
| `src/components/lesson/PlayModelButton.jsx` | Full-width on mobile, min 44px height |
| `src/components/lesson/cards/ChooseExercise.jsx` | `fieldset` / `legend`, `aria-pressed` on options |
| `src/components/lesson/CardScreen.jsx` | `ts-lesson-card`; exit timer uses `getCardExitDelayMs()` |

### Layout utilities

| Class | Purpose |
|-------|---------|
| **`ts-app-main`** | Page shell: `min-height: 100dvh`, padding uses `max(gutter, env(safe-area-inset-*))` so content clears notches and home indicators |
| **`ts-lesson-shell`** | Centered column (`max-width: 28rem`), vertical gap between progress + cards |
| **`ts-lesson-card`** | Shared card surface (padding, radius, shadow) on start, card, and end screens |
| **`ts-tap-target`** | `min-height: 44px` (WCAG 2.5.5 target size) + `touch-action: manipulation` |
| **`ts-focus-ring`** | Visible `:focus-visible` outline (keyboard users) |
| **`ts-skip-link`** | Off-screen until focused; jumps to `#lesson-main` |

Base layout is **mobile-first**: default gutters/padding target small screens; `640px+` adds slightly more spacing.

### Reduced motion (three layers)

1. **CSS tokens** — `tokens.css` sets `--ts-duration-fast` and `--ts-duration-normal` to `1ms` when `prefers-reduced-motion: reduce`.
2. **CSS animations** — `motion.css` sets `animation: none` on lesson motion classes and removes progress-bar width transition and reward stagger delay.
3. **JavaScript timer** — `CardScreen` calls `onNext()` after `getCardExitDelayMs()` (`0` when reduced, else `280ms`) so the app does not wait on an invisible exit animation.

**Test in Chrome DevTools:** Rendering → enable **Emulate CSS media feature `prefers-reduced-motion`**. Card changes should feel instant; cheer bounce and card slide should not run.

### Accessibility choices

| Area | Approach |
|------|----------|
| **Skip link** | First Tab stop: “Skip to lesson” → main landmark |
| **Landmarks** | `<main id="lesson-main">`; lesson flow `role="region"` + `aria-label` |
| **Choose options** | `fieldset` + visually hidden `legend` (not `listbox`/`option`, which imply arrow-key list semantics) |
| **Choose selection** | `aria-pressed` on each option button |
| **Progress** | Existing `role="progressbar"` + `aria-valuenow` (TSH-005); bar slightly taller on mobile |

### Definitions

| Term | Meaning |
|------|---------|
| **Mobile-first** | Default CSS targets small screens; wider breakpoints add polish, not fixes |
| **Safe area** | Screen region not covered by notch, status bar, or home indicator (`env(safe-area-inset-*)`) |
| **Tap target** | Minimum touchable area; here **44×44px** via `--ts-tap-min` |
| **`prefers-reduced-motion`** | OS/media-query signal to reduce or skip motion (vestibular sensitivity) |
| **a11y** | Accessibility — keyboard, screen readers, contrast, touch size, motion preferences |
| **Focus ring** | Visible outline when navigating with Tab (`:focus-visible`) |
| **`getCardExitDelayMs()`** | JS delay before `onNext` after card exit; `0` when reduced motion is on |

---

## Styling & design tokens

1. **`src/styles/tokens.css`** defines **`--ts-*`** variables on `:root` (surface, foreground, accent, radius, shadow, motion duration/easing). Reduced motion shortens durations there; see [TSH-006](#responsive-layout--accessibility-tsh-006) for full motion handling.
2. **`src/index.css`** imports tokens, then **`tailwindcss`**, then **`layout.css`**, then **`motion.css`**, and maps variables into Tailwind’s **`@theme`** block so utilities like `bg-surface`, `text-accent`, `rounded-card` stay aligned with tokens.
3. **`src/styles/layout.css`** holds the lesson shell, safe-area padding, tap-target and focus-ring utilities (TSH-006).
4. **`src/styles/motion.css`** holds shared animation utilities (card enter/exit, feedback pop, cheer icon bounce, progress bar fill, reward stat pop-in) used alongside Tailwind classes.

**Why tokens first:** Tailwind v4’s `@theme` resolves against CSS variables; loading tokens before `@theme` keeps utilities and raw CSS in sync.

---

## PWA (manifest & service worker)

**Goal (TSH-007):** make the app **installable** on phones and desktops — home-screen icon, standalone window, and offline-capable shell after the first visit.

### Key files

| File | Responsibility |
|------|----------------|
| `vite.config.js` | `VitePWA` plugin — manifest fields, Workbox precache + SPA fallback |
| `public/icons/icon-source.svg` | Master icon art (teal + speech bubble); edit then run `npm run icons` |
| `public/pwa-192.png`, `pwa-512.png`, `apple-touch-icon.png` | Generated install icons (committed so CI/build does not require Sharp) |
| `scripts/generate-pwa-icons.mjs` | Renders SVG → PNG via **sharp** |
| `src/lib/registerPwa.js` | Registers SW on boot; dev-only lifecycle logging |
| `src/main.jsx` | Calls `registerPwa()` before React render |
| `index.html` | `theme-color`, Apple web-app meta, `apple-touch-icon` link |

### What is configured

| Piece | Where / how |
|--------|-------------|
| **Web App Manifest** | Emitted as **`dist/manifest.webmanifest`** from `vite.config.js` — `name`, `short_name`, `description`, `theme_color`, `background_color`, `display: standalone`, `start_url`, `scope`, `id`, `categories`, icon list with separate **`any`** and **`maskable`** purposes. |
| **Icons** | **192** and **512** PNG for install prompts; **180** `apple-touch-icon.png` for iOS home screen. Regenerate after art changes: **`npm run icons`**. |
| **Service worker** | Workbox **`generateSW`**: precaches hashed JS/CSS/HTML and static assets matching `globPatterns`. **`navigateFallback: 'index.html'`** serves the SPA shell for client routes when offline. **`cleanupOutdatedCaches: true`** drops old precache buckets after deploy. |
| **Registration** | **`registerType: 'autoUpdate'`** — new builds activate on the next page load without a blocking update modal. |
| **Types** | `src/vite-env.d.ts` references `vite-plugin-pwa/client` for `virtual:pwa-register`. |

### Installability checklist

Browsers require (simplified):

1. **HTTPS** (or `localhost` for local testing).
2. Valid **manifest** linked from HTML (Vite plugin injects `<link rel="manifest">` on build).
3. **Icons** at least **192×192** and **512×512** returning HTTP 200.
4. **Registered service worker** with a `fetch` handler (Workbox provides this).

**Test locally:**

```bash
npm run build
npm run preview
```

Open the preview URL → DevTools → **Application** → Manifest / Service Workers. On mobile Chrome: menu → **Install app** or **Add to Home screen**.

### Dev vs production

- **`devOptions.enabled: true`** — SW + manifest behavior during `npm run dev` (type `module` for the dev SW). Check the console for `[PWA] Service worker registered`.
- **Production** — run **`npm run build`** then **`npm run preview`** for the real `dist/sw.js` and precache list.

### Service worker strategy (why precache + navigate fallback)

| Strategy | What we use | Why |
|----------|-------------|-----|
| **Precache** | All built static assets | Lesson UI, CSS, and JS load instantly and work offline after first visit. |
| **Navigate fallback** | `index.html` for document navigations | Single-page app: any “page” URL still boots React from cache when offline. |
| **No runtime API cache** | — | Lesson data is static in `lessonConfig.js`; rewards use `localStorage` only. No CDN/API rules needed yet. |

### Definitions

| Term | Meaning |
|------|---------|
| **PWA** | Progressive Web App — a website that meets install + offline criteria and can behave like a native app. |
| **Web App Manifest** | JSON file (`manifest.webmanifest`) describing name, icons, colors, and how the OS should launch the app (`standalone`, `start_url`, etc.). |
| **Service worker (SW)** | A background script the browser runs separately from your page; can intercept network requests and cache assets. |
| **Workbox** | Google’s library (used via **vite-plugin-pwa**) that generates a SW with precaching and routing recipes. |
| **Precache** | Assets listed at build time and downloaded into cache when the SW installs. |
| **`registerType: 'autoUpdate'`** | When you deploy a new build, the new SW installs in the background and takes over on the next navigation. |
| **`display: standalone`** | Opens without the browser URL bar (feels like an installed app). |
| **`scope` / `start_url`** | Which URLs belong to the PWA and which URL opens on launch (both `/` here). |
| **`purpose: maskable`** | Icon safe zone for Android adaptive icons (cropped to circle/squircle). |
| **`navigateFallback`** | Offline document requests fall back to cached `index.html` so the SPA still loads. |
| **Install prompt** | Browser UI to “Install” or “Add to Home screen”; only appears when manifest + SW + engagement rules pass. |

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
| TSH-004 | Done | Cheer / encouragement copy, feedback animations, card enter & exit transitions |
| TSH-005 | Done | Lesson progress bar, XP + streak on end screen, `localStorage` persistence |
| TSH-006 | Done | Mobile-first shell, 44px tap targets, focus rings, skip link, reduced motion (CSS + JS) |
| TSH-007 | Done | Manifest, branded icons, Workbox precache + SPA offline fallback |
| TSH-008 … TSH-009 | Planned | Innovation, deploy |

That document is the source of truth for phases and git workflow. This README focuses on **how to run and extend the codebase**; the plan tracks **what to build next**.

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| **Play model does nothing** | Use Chrome, Safari, or Edge (not all browsers support `speechSynthesis`). Ensure volume is up and the tab is not muted. Tap must come from a real click (required on iOS). |
| **Play model sounds odd** | TTS quality varies by OS/voice. Set `modelText` to a natural word in `lessonConfig.js` (see [Speech model playback](#speech-model-playback)). |
| **Choose card: no feedback** | You must tap an option first; feedback appears immediately, then **Continue**. Refresh if HMR left stale state. |
| **Streak / XP look wrong** | Rewards live in `localStorage` (`topspeech_rewards`). Clear site data or use a private window to reset. Same-day replays add XP but do not increment streak again. |
| **Progress bar stuck** | Bar only shows in the `card` phase. Finish the current card with **Continue**; fill updates when the next card mounts. |
| **No `dist/sw.js` after build** | Ensure the build finished completely. The PWA plugin runs Workbox after the main bundle; a failed or interrupted build can omit the SW. Re-run `npm run build` and look for the **PWA v…** log lines. |
| **Install prompt missing** | Use **HTTPS** (or `localhost`). Confirm **`manifest.webmanifest`** is linked (Vite plugin injects the link) and icon URLs return **200**. |
| **Stale UI after deploy** | With `autoUpdate`, clients pick up a new SW after a navigation; hard refresh or closing tabs can help during testing. |
| **Animations still playing** | Enable **prefers-reduced-motion** in OS settings or DevTools (Rendering). With emulation on, card exit should be instant and `motion.css` classes should not animate. |
| **Skip link not visible** | It is off-screen until focused — press **Tab** once on load. |
| **ESLint vs Prettier disagreements** | Keep **`eslint-config-prettier`** last in `eslint.config.js`. Run `npm run format` before `npm run lint` if needed. |

---

## License

This project is **private** (`"private": true` in `package.json`). Add an explicit license file if you open-source it later.
