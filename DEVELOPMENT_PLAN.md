# Development plan — TopSpeech Health PWA assignment

**Technical setup** (stack, scripts, folders, PWA, lint/format): see [README.md](./README.md).

Step-by-step delivery roadmap for the engineer design assignment. Each item has a **task ID** used for **branch names** and merge discipline. This is a planning document, not a literal automated todo list.

---

## Progress

| ID | Status | Branch (when used) |
|----|--------|---------------------|
| **TSH-001** | Done | `feature/TSH-001-scaffold-pwa` |
| **TSH-002** | Done | `feature/TSH-002-lesson-state-machine` |
| **TSH-003** | Done | `feature/TSH-003-card-types-ui` |
| **TSH-004** | Done | `feature/TSH-004-feedback-transitions` |
| **TSH-005** | Done | `feature/TSH-005-completion-rewards` |
| **TSH-006** | Done | `feature/TSH-006-responsive-a11y` |
| **TSH-007** | Done | `feature/TSH-007-pwa-manifest-sw` |
| **TSH-008** … **TSH-009** | Not started | See task table below |

**Next recommended task:** **TSH-008** — Innovation (speech-therapy-specific differentiator + README note).

---

## TSH-002 implementation notes

Lesson shell delivered on branch `feature/TSH-002-lesson-state-machine`. Details and extension guide: [README § Lesson flow](./README.md#lesson-flow).

| Piece | Location |
|--------|----------|
| Static lesson | `src/data/lessonConfig.js` (`dailyLesson`, 3 placeholder cards) |
| State machine | `src/lib/lessonMachine.js` — phases `start` \| `card` \| `end`; actions `START_LESSON`, `NEXT`, `RESTART` |
| React hook | `src/hooks/useLessonMachine.js` |
| UI orchestration | `src/components/lesson/LessonFlow.jsx` + `StartScreen`, `CardScreen`, `EndScreen`, `LessonButton` |
| App entry | `src/App.jsx` → `<LessonFlow />` |

**Out of scope for TSH-002 (later IDs):** exercise `type` fields and per-type UI (TSH-003), correct/incorrect feedback (TSH-004), progress bar and streak/XP (TSH-005).

---

## TSH-003 implementation notes

Card types, static content, speech playback, and choose feedback. Full reference: [README § Card types](./README.md#card-types--static-content-tsh-003).

| Piece | Location |
|--------|----------|
| Type constants | `src/data/cardTypes.js` — `listen`, `repeat`, `choose` |
| Lesson content | `src/data/lessonConfig.js` — `dailyLesson`, **5 cards** |
| Type router | `src/components/lesson/cards/CardExercise.jsx` |
| Listen UI | `src/components/lesson/cards/ListenExercise.jsx` |
| Repeat UI | `src/components/lesson/cards/RepeatExercise.jsx` |
| Choose UI | `src/components/lesson/cards/ChooseExercise.jsx` |
| Play button | `src/components/lesson/PlayModelButton.jsx` |
| Speech helper | `src/lib/speechModel.js` — Web Speech API |
| Choose logic | `src/lib/chooseResult.js` — pure `getChooseResult()` |
| Feedback banner | `src/components/lesson/ExerciseFeedback.jsx` |
| Card shell | `src/components/lesson/CardScreen.jsx` — choose selection + Continue gate |

### Assignment criteria met

| Requirement | How |
|-------------|-----|
| ≥ 2 exercise types | 3 types: listen, repeat, choose |
| ≥ 4 cards | 5 cards in `dailyLesson.cards` |
| Static content module | `lessonConfig.js` + `cardTypes.js` |

### Pulled forward (not full TSH-004)

- **Choose correct/incorrect** — immediate visual + message feedback on tap; options lock until Continue.
- **Web Speech “Play model”** — no bundled audio; `modelText` uses natural words for TTS.

### Still for TSH-006+

- Recorded clinician audio (optional / innovation).

---

## TSH-004 implementation notes

Feedback cheer/encouragement and card transitions. Full reference: [README § Feedback & card transitions](./README.md#feedback--card-transitions-tsh-004).

| Piece | Location |
|--------|----------|
| Cheer / encouragement copy | `src/lib/feedbackCopy.js` — `getCorrectCheer`, `getIncorrectEncouragement` |
| Feedback banner | `src/components/lesson/ExerciseFeedback.jsx` — pop animation, 🎉 / 💪 icons |
| Choose wiring | `src/components/lesson/cards/ChooseExercise.jsx` — correct: “Correct!” + cheer; incorrect: “Keep going” + encouragement |
| Card exit before advance | `src/components/lesson/CardScreen.jsx` — `isExiting` + `ts-card-exit`, then `onNext` |
| Motion utilities | `src/styles/motion.css` — `ts-card-enter`, `ts-card-exit`, `ts-feedback-pop`, `ts-cheer-bounce` |

### Assignment criteria met

| Requirement | How |
|-------------|-----|
| Correct/incorrect feedback states | Choose card: option colors + `ExerciseFeedback` variants |
| Animated transition between cards | Exit on Continue, enter on next card (`key={currentCard.id}`) |
| Supportive tone on wrong answers | Encouragement lines; title **Keep going** (no dismissive copy) |

---

## TSH-005 implementation notes

Progress indicator and completion rewards. Full reference: [README § Completion & rewards](./README.md#completion--rewards-tsh-005).

| Piece | Location |
|--------|----------|
| Progress math | `src/lib/lessonProgress.js` — `getLessonProgress()` |
| Progress UI | `src/components/lesson/LessonProgress.jsx` — bar above cards in `LessonFlow` |
| Reward persistence | `src/lib/rewardsStore.js` — `localStorage` key `topspeech_rewards` |
| Reward logic | `src/lib/lessonRewards.js` — `completeLessonRewards()`, streak by calendar day |
| Reward tiles | `src/components/lesson/RewardStat.jsx` |
| End screen | `src/components/lesson/EndScreen.jsx` — XP + streak grid |
| Orchestration | `src/components/lesson/LessonFlow.jsx` — `handleNext` grants rewards on last card |
| Config | `src/data/lessonConfig.js` — `completion.xpReward` |
| Motion | `src/styles/motion.css` — `ts-progress-fill`, `ts-reward-stat` |

### Assignment criteria met

| Requirement | How |
|-------------|-----|
| Progress indicator through lesson | `LessonProgress` during `card` phase; fill = `cardNumber / cardCount` |
| Lesson-complete / streak–XP moment | `EndScreen` shows +XP earned, total XP, streak days, streak message |
| No backend | Streak and `totalXp` in `localStorage` |

### Design choices

- Progress bar in **`LessonFlow`**, not `CardScreen`, so it survives card remounts and animates width between steps.
- Rewards applied in **`handleNext`** when finishing the last card (not in `useEffect`) to avoid Strict Mode double-grant and satisfy `react-hooks/set-state-in-effect` lint.
- **XP every completion**; **streak** updates at most once per calendar day.

---

## TSH-006 implementation notes

Responsive layout and accessibility. Full reference: [README § Responsive layout & accessibility](./README.md#responsive-layout--accessibility-tsh-006).

| Piece | Location |
|--------|----------|
| Layout utilities | `src/styles/layout.css` — shell, safe areas, tap targets, focus ring, skip link |
| Motion disable (CSS) | `src/styles/motion.css` — `animation: none` + no progress transition under reduced motion |
| Motion duration (tokens) | `src/styles/tokens.css` — `--ts-duration-*` → `1ms` under reduced motion |
| Exit delay helper | `src/lib/motionPreference.js` — `getCardExitDelayMs()`, `CARD_EXIT_MS` |
| Reduced-motion hook | `src/hooks/useReducedMotion.js` |
| App shell | `src/App.jsx` — skip link, `ts-app-main`, `#lesson-main` |
| Lesson column | `src/components/lesson/LessonFlow.jsx` — `ts-lesson-shell`, `role="region"` |
| Card shell | `StartScreen`, `CardScreen`, `EndScreen` — `ts-lesson-card` |
| Interactive targets | `LessonButton`, `PlayModelButton`, `ChooseExercise` — `ts-tap-target`, `ts-focus-ring` |
| Choose semantics | `ChooseExercise.jsx` — `fieldset` / `legend`, `aria-pressed` |
| Card exit timer | `CardScreen.jsx` — `getCardExitDelayMs(reducedMotion)` instead of hard-coded 280ms |

### Assignment criteria met

| Requirement | How |
|-------------|-----|
| Mobile-first layout | `layout.css` defaults for small screens; safe-area padding; centered `max-width` shell |
| Sensible tap targets | `--ts-tap-min: 44px` on primary buttons, play model, choose options |
| `prefers-reduced-motion` | Tokens shorten durations; `motion.css` disables animations; JS exit delay = 0 |

### Design choices

- **Layout in CSS utilities** (`ts-*`) keeps spacing/safe-area rules out of every component; screens only add motion/structure classes.
- **JS exit delay matches CSS** so reduced-motion users are not blocked 280ms after tapping Continue.
- **Choose uses `fieldset`**, not `listbox`, because options are independent buttons (not a single listbox widget with arrow-key navigation).

---

## TSH-007 implementation notes

PWA manifest, install icons, and service worker strategy. Full reference: [README § PWA](./README.md#pwa-manifest--service-worker).

| Piece | Location |
|--------|----------|
| Manifest + Workbox | `vite.config.js` — `VitePWA({ manifest, workbox, devOptions })` |
| Icon source SVG | `public/icons/icon-source.svg` — teal brand mark (regenerate PNGs with `npm run icons`) |
| Install PNGs | `public/pwa-192.png`, `pwa-512.png`, `apple-touch-icon.png` |
| Icon script | `scripts/generate-pwa-icons.mjs` + `sharp` (devDependency) |
| SW registration | `src/lib/registerPwa.js` — lifecycle hooks; `src/main.jsx` calls it on boot |
| iOS / install meta | `index.html` — `apple-touch-icon`, `apple-mobile-web-app-*` |

### Assignment criteria met

| Requirement | How |
|-------------|-----|
| Web app manifest | Generated at build as `manifest.webmanifest` (name, colors, `standalone`, icons, `start_url`, `scope`, `id`) |
| Icons | 192 + 512 PNG (+ 180 Apple touch); separate `purpose: any` and `maskable` entries |
| Service worker | Workbox `generateSW` precaches app shell; `navigateFallback` for SPA offline |
| Installable | HTTPS + manifest + registered SW; test with `npm run build && npm run preview` |

### Design choices

- **`registerType: 'autoUpdate'`** — new deploys activate on next visit without a blocking “update” modal (good for lesson content).
- **Precache-first** — lesson UI and assets load offline after first visit; no network runtime rules needed yet (static config, no API).
- **`registerPwa.js`** — keeps `main.jsx` thin and centralizes dev logging for SW registration errors.
- **Branded icons** — source SVG matches `--ts-color-accent` / surface tokens; favicon.svg stays as dev tab icon.

---

## Legend

| Pattern | Meaning |
|---------|---------|
| **Task ID** | `TSH-###` — stable reference for commits and PR titles. |
| **Branch** | `feature/TSH-###-short-slug` — always branch from latest `main`. |
| **Merge** | Merge back to `main` when the outcome for that ID is done; then pull `main` before the next branch. |

**Naming examples**

- `feature/TSH-002-lesson-state-machine`
- `feature/TSH-004-feedback-transitions`

---

## Phases

1. **Bootstrap** — Tooling and repository layout (`TSH-001`).
2. **Lesson shell** — Start → cards → end flow and static lesson config (`TSH-002`).
3. **Card types & content** — Two or more types, four or more cards (`TSH-003`).
4. **Feedback & motion** — Correct/incorrect UI and animated transitions (`TSH-004`).
5. **Completion** — Progress indicator and lesson-complete / streak–XP moment (`TSH-005`).
6. **Responsive & accessibility** — Mobile polish, touch targets, reduced motion where sensible (`TSH-006`).
7. **PWA** — Manifest, icons, installability (`TSH-007`).
8. **Innovation** — Speech-therapy-specific differentiator + README note (`TSH-008`).
9. **Deploy & docs** — Live URL, README demo link, walkthrough (written section or Loom) (`TSH-009`).

---

## Task table

| ID | Name | Outcome | Branch name |
|----|------|---------|--------------|
| **TSH-001** | Scaffold & PWA baseline | Project scaffold (e.g. Vite ), baseline folders, lint/format if desired, dev/build scripts | `feature/TSH-001-scaffold-pwa` |
| **TSH-002** | Lesson state machine | **Done.** Start screen, sequential cards, end state; `lessonConfig.js` + `lessonMachine.js` drive the flow | `feature/TSH-002-lesson-state-machine` |
| **TSH-003** | Card types & content | **Done.** 3 types, 5 cards, static module, speech + choose feedback | `feature/TSH-003-card-types-ui` |
| **TSH-004** | Feedback & transitions | **Done.** Cheer / encouragement, feedback motion, card enter & exit on Continue | `feature/TSH-004-feedback-transitions` |
| **TSH-005** | Completion & rewards | **Done.** Progress bar, XP + streak on end screen, `localStorage` persistence | `feature/TSH-005-completion-rewards` |
| **TSH-006** | Responsive & a11y | **Done.** Mobile-first shell, 44px tap targets, focus rings, skip link, reduced motion (CSS + JS) | `feature/TSH-006-responsive-a11y` |
| **TSH-007** | PWA manifest & SW | Web app manifest, icons, service worker strategy so the app is installable | `feature/TSH-007-pwa-manifest-sw` |
| **TSH-008** | Innovation | One Duolingo-different interaction or mechanic; 2–4 sentence explanation in README | `feature/TSH-008-innovation` |
| **TSH-009** | Deploy & submission polish | Deploy to Vercel/Netlify/GitHub Pages; fill README live URL; design walkthrough | `feature/TSH-009-deploy-docs` |

---

## Git workflow

1. Ensure `main` is up to date (`git pull origin main`).
2. Create branch: `git checkout -b feature/TSH-###-short-slug`.
3. Implement and commit with clear messages (e.g. Conventional Commits: `feat:`, `fix:`, `chore:`).
4. Merge to `main` when the task outcome is complete (`git checkout main && git merge feature/...`).
5. Push `main` and repeat for the next ID in order.

Optional: open a pull request per task for review practice; for solo work, local merges are fine.

---

## Assignment alignment (quick reference)

| Brief requirement | Covered by |
|-------------------|------------|
| ≥4 cards, ≥2 types | TSH-003 ✓ |
| Choose feedback, play model | TSH-003 (early) |
| Progress, animation between cards | TSH-004 ✓ (transitions), TSH-005 ✓ (progress bar) |
| Completion / streak–XP | TSH-005 ✓ |
| Responsive PWA | TSH-006 ✓ (layout/a11y), TSH-007 (manifest/install) |
| Innovation + short note | TSH-008 |
| Live link + README | TSH-009 |

---

## Merge order recommendation

Work **in ID order** (`TSH-001` → `TSH-009`) unless a later task is intentionally batched (e.g. deploy only after core UX is stable). Pull latest `main` before each new feature branch.
