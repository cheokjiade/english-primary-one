# Primary One English — worksheet generator

Printable, **self-marking** English practice sheets for Primary One. Each sheet starts with a short
lesson (a "Let's learn" block), then generated exercises. Every sheet is built from a **seed** — the
same seed always produces the same sheet, so you can reprint or reshare an exact worksheet.

It's plain static HTML with a tiny shared engine — **no build step, no server, no dependencies**.
Double-click any `.html` file to use it, or host the folder on GitHub Pages.

## Quick start

- **Use a worksheet:** open `index.html` (or `beginning-sounds.html`) in a browser. Adjust the
  options, click **Generate**, let the child answer, then **Submit & Mark** or **Print**.
- **Share an exact sheet:** copy the URL — the seed and settings are in it
  (`beginning-sounds.html?seed=tiger&first=4&…`).

## Make a new worksheet from a workbook photo

This is the main workflow. Hand the photo (and, ideally, this repo) to a person or an AI agent and
point them at **[`AGENTS.md`](AGENTS.md)** — the step-by-step guide. In short: copy
`beginning-sounds.html`, turn the page's lesson into a `WS.teach(...)` block and each exercise into a
generator, add a card for the unit in `index.html`, then run the verifier
(`cd verify && npm run verify` — every unit must mark correctly with no duplicate questions).
Put source photos in an `input/` folder (git-ignored); if they are
HEIC (most phone photos), convert them to JPG first — see [`AGENTS.md`](AGENTS.md) *Step 0* (`ffmpeg`
mis-decodes iPhone HEICs; use `pillow-heif`).

## Layout

```
index.html              landing page (one card per unit)
beginning-sounds.html   the reference unit — COPY THIS to build a new one
assets/
  worksheet.js          the shared engine (global WS): seeding, marking, panel, teaching blocks
  worksheet.css         shared styles + print rules
  twemoji/              bundled picture icons (Twemoji, CC-BY 4.0)
verify/                 browser-driven checker: `npm run verify` → "happy N/N, probe <N/N, dups 0"
specs/
  conventions.md        the engine contract & the reasoning behind the rules (deep reference)
  _template.md          spec template for a new unit
  beginning-sounds.md   spec for the reference unit
AGENTS.md               how to build a unit from a photo (read this first)
```

## Verify

```
cd verify
npm install     # first time only — installs playwright-core, drives your installed Chrome/Edge
npm run verify
```

Every unit must mark itself to full marks, drop marks when an answer is wrong, and contain no
duplicate questions across seeds. See [`AGENTS.md`](AGENTS.md#verify-before-youre-done).

## Deploy (GitHub Pages)

Push the repo to GitHub and enable Pages (Settings → Pages → deploy from the default branch, root).
Because everything is static and offline-safe, no configuration is needed — the units and `assets/`
are served as-is.

## Credits

Picture icons are [Twemoji](https://github.com/twitter/twemoji) by Twitter, licensed
**CC-BY 4.0**. The engine and worksheets are adapted from a sibling maths-worksheet project that
shares the same design.
