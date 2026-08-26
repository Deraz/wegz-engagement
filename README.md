# Youssef & Ganna — Engagement Invitation 💍

A single-page, mobile-first engagement invitation in a handmade scrapbook style
(warm paper, red ink, taped-down cards, an envelope opening animation).

## Run it

Just open `index.html` in a browser — no build step, no dependencies.
To host it, upload the folder (minus `_reference/`) to GitHub Pages, Netlify,
Vercel, or any static host.

## Edit the details

Everything data-like lives in the `INVITE` object at the top of `script.js`:
date/time, venue, maps link. Names and the bilingual copy are in `index.html`.

## Swap the placeholders

| Slot | File to replace | Shown at |
|---|---|---|
| Hero photo | `assets/Hero.svg` → your photo | top polaroid |
| Gallery | `assets/Photo1.svg` … `Photo4.svg` | "A few favorites" |
| Venue | `assets/Venue.svg` | "Where?" card |
| Final pair | `assets/Final1.svg`, `assets/Final2.svg` | last section |

Use `.webp` or `.jpg` and update the `src` in `index.html` (or keep the same
filenames with the `.svg` extension replaced — just match what the HTML says).

**Music:** drop your song at `assets/Music.mp3` — the page prefers it
automatically over the placeholder tune (`assets/Music.wav`, a generated
sound; delete it once the real song is in).

## V2 backlog

- Send form messages to a Google Sheet (Google Apps Script endpoint under
  Youssef's Gmail) — the form currently `console.log`s the submission.
- Small admin panel to read the messages.

## Folder notes

`_reference/` holds the demo site we used as visual reference — not part of
the invitation; don't upload it.
