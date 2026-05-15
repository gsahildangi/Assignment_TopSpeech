# Development plan — TopSpeech Health PWA assignment

**Technical setup** (stack, scripts, folders, PWA, lint/format): see [README.md](./README.md).

Step-by-step delivery roadmap for the engineer design assignment. Each item has a **task ID** used for **branch names** and merge discipline. This is a planning document, not a literal automated todo list.

---

## Progress

| ID | Status | Branch (when used) |
|----|--------|---------------------|
| **TSH-001** | Done | `feature/TSH-001-scaffold-pwa` |
| **TSH-002** | Done | `feature/TSH-002-lesson-state-machine` |
| **TSH-003** … **TSH-009** | Not started | See task table below |

**Next recommended task:** **TSH-003** — card types and richer static content (≥2 types, ≥4 cards).

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
| **TSH-003** | Card types & content | At least **two** exercise types and **four** cards total; static content module | `feature/TSH-003-card-types-ui` |
| **TSH-004** | Feedback & transitions | Correct/incorrect feedback states; at least one animated transition between cards | `feature/TSH-004-feedback-transitions` |
| **TSH-005** | Completion & rewards | Progress indicator through lesson; lesson-complete screen with streak or XP-style reward | `feature/TSH-005-completion-rewards` |
| **TSH-006** | Responsive & a11y | Mobile-first layout; sensible tap targets; optional `prefers-reduced-motion` handling | `feature/TSH-006-responsive-a11y` |
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
| ≥4 cards, ≥2 types | TSH-003 |
| Progress, animation, feedback | TSH-004, TSH-005 |
| Completion / streak–XP | TSH-005 |
| Responsive PWA | TSH-006, TSH-007 |
| Innovation + short note | TSH-008 |
| Live link + README | TSH-009 |

---

## Merge order recommendation

Work **in ID order** (`TSH-001` → `TSH-009`) unless a later task is intentionally batched (e.g. deploy only after core UX is stable). Pull latest `main` before each new feature branch.
