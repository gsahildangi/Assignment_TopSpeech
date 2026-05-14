# TopSpeech Health — Daily Lesson (PWA Prototype)

Interactive prototype of a **single daily lesson session** for a curriculum-based speech therapy flow (starting with an **rhotacism / “R” sound** track). This repository implements the **TopSpeech Health Engineer Design Assignment** deliverables: a deployable **Progressive Web App** with a Duolingo-informed but clinically appropriate tone—warm, credible, and respectful of the vulnerability of practicing speech in an app.

---

## Live demo

| Environment | URL |
|-------------|-----|
| **Production** | _Add after deployment (Vercel / Netlify / GitHub Pages)._ |

---

## Overview

Users open a short daily lesson made of **4–6 exercise cards**, move through **mid-lesson progression**, receive **correct/incorrect feedback** (mocked interactions—no real audio backend required), and finish on a **lesson-complete** screen with a **streak or XP-style reward** moment. The experience is **mobile-first** and **fully responsive**.

---

## Features

- **PWA** — Installable web app (manifest + service worker strategy per implementation).
- **Lesson flow** — Clear **start**, **in-session progression**, and **end** states.
- **Exercise cards** — At least **four cards** and **at least two distinct card types** (e.g. listen-and-repeat, word selection, mirror-mode cue).
- **Progress** — Satisfying progress indicator aligned with card advancement.
- **Motion** — At least one **animated transition** between cards.
- **Feedback** — Distinct **correct** and **incorrect** states (content may be mocked).
- **Completion** — Lesson-complete screen with **streak / XP-style** reinforcement.
- **Innovation** — One UX or interaction detail tuned for **speech therapy context** (documented below once implemented).

---

## Innovation (assignment requirement)

_Two to four sentences will go here after implementation: what we added that Duolingo-style apps typically do not, and why it fits users working through a speech challenge._

---

## Tech stack

| Layer | Choice |
|-------|--------|
| **Runtime** | _To be finalized (e.g. Vite + React + TypeScript)._ |
| **Styling** | _To be finalized (e.g. CSS modules / Tailwind)._ |
| **PWA** | _To be finalized (e.g. `vite-plugin-pwa` or equivalent)._ |
| **Hosting** | _Vercel, Netlify, or GitHub Pages._ |

---

## Repository structure

Planned layout as the application lands on `main` via feature branches (see [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)).

```text
.
├── public/                 # Static assets served as-is (icons, manifest overrides if needed)
├── src/
│   ├── assets/             # Images, fonts, shared media
│   ├── components/         # Reusable UI (buttons, layout, progress)
│   │   └── lesson/         # Lesson shell, card renderer, transitions
│   ├── content/            # Static lesson copy & exercise definitions
│   ├── hooks/              # Lesson state, preferences (e.g. reduced motion)
│   ├── styles/             # Global styles, tokens, resets
│   ├── App.tsx             # Root composition (name may vary by framework)
│   └── main.tsx            # Entry (name may vary by framework)
├── index.html              # HTML entry (if using Vite-style tooling)
├── vite.config.ts          # Build / PWA config (if applicable)
├── package.json
├── README.md
└── DEVELOPMENT_PLAN.md     # Branching convention & delivery roadmap
```

---

## Getting started

### Prerequisites

- **Node.js** LTS (check `.nvmrc` or `engines` in `package.json` once added).
- **pnpm**, **npm**, or **yarn** (project will document the preferred package manager in `package.json`).

### Install & run

_Commands will be filled in after the scaffold (`TSH-001`) is merged._

```bash
# git clone <your-repo-url>
# cd Assignment_TopSpeech
# pnpm install   # or npm install / yarn
# pnpm dev       # local development server
```

```bash
# Production build & local preview (after scaffold exists)
# pnpm build && pnpm preview
```

---

## Deployment

- **Build**: static output from the chosen toolchain (e.g. `dist/`).
- **Hosting**: connect the Git repository to **Vercel**, **Netlify**, or **GitHub Pages**; set build command and publish directory per provider docs.
- **README**: update the **Live demo** table with the production URL after first successful deploy.

---

## Design notes

Brief, reviewer-facing rationale (optional bullets once the product pass is done):

- _Duolingo-informed patterns we kept …_
- _What we changed for clinical credibility and emotional safety …_
- _Typography, color, and motion choices …_

---

## Submission checklist (TopSpeech brief)

- [ ] Deployed PWA link in this README.
- [ ] Source on GitHub (this repo).
- [ ] README **or** ≤3 minute Loom covering design choices.

---

## License

_Unless otherwise required by the hiring process, specify license here (e.g. MIT, private, or “All rights reserved”)._
