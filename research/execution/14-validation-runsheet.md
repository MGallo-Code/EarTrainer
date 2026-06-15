# Validation Test Run Sheet (2026-06-15)

The cheap test that gates the expensive duet render engine. Goal: find out whether an
auto-rendered MIDI **duet clip is watchable AND whether people will actually add the
next layer by ear** (participation), before building the engine. See
[10-critique.md](../10-critique.md) and [13-next-steps.md](13-next-steps.md).

## What's already built (this repo)

- **Landing page:** `web/landing/` (hero + waitlist + how-it-works + demo-clip slot).
  Captures email + **UTM attribution** so you know which clip/channel drove each signup.
- **In-app fake-door:** the recap card's "Duet this ▸" button opens a waitlist panel.
  Both the landing page and the in-app form POST to the same endpoint.
- **Funnel logging:** first-visit → first-round → first-correct → duet-click →
  waitlist-signup (in `localStorage`: `loop_waitlist`, `loop_landing_events`, and the
  app's `progress.funnel.events`).

## Setup (do once)

1. **Wire the waitlist endpoint.** Create a free form at https://formspree.io and paste
   its URL into `web/config.js` → `WAITLIST_ENDPOINT`. Both the landing page and the
   in-app fake-door will then email you each signup. (Leave blank = demo mode, signups
   saved to localStorage only.)
2. **Deploy the landing page** (static, no backend). Easiest: deploy the whole `web/`
   folder to Netlify drop / GitHub Pages / Vercel; the landing lives at `/landing/`.
   (It references `../config.js` and `../core.js`, so keep the folder structure, or copy
   those two files into `landing/` for a standalone deploy.)
3. **Pre-commit the go/kill gate below in writing** before posting anything, so a lucky
   view spike can't trigger a false GO.

## Make the clips (no engine)

- Hand-make **10-20 duet clips** in Logic + a piano-roll visualizer (e.g. SeeMusic) or a
  `mido + Pillow + Timidity + FFmpeg` script. 9:16, 15-30s, the catchiest moment as the
  literal first sound, seamless loop, readable on mute.
- **Original / public-domain loops only** (avoid copyright takedowns).
- **End every clip with the participation CTA:** "Your turn — find the next layer by ear.
  DM me your layer and I'll stitch it." This is what tests the real bet.
- Drop the best clip into the landing page's demo-clip slot.

## Post + drive traffic

- Cross-post TikTok + IG Reels + YouTube Shorts; seed Reddit (r/piano, r/musictheory)
  with warmed accounts, posted as a genuine "trying an idea" not an ad.
- Link to the landing page **with UTM tags**, e.g.
  `…/landing/?utm_source=tiktok&utm_campaign=bassline-01`. Use a distinct campaign per
  clip so attribution tells you what worked.
- Optional $200-400 boost on the 3 best organic clips as sample-size insurance.

## The gate (decide BEFORE posting)

Weight **participation and depth over raw views** (vanity-view spikes cause false GOs):

| Signal | KILL | PIVOT | GO |
|---|---|---|---|
| Waitlist click→signup (consumer-calibrated) | <5% | 5-8% | ≥8% |
| First-3s retention | <60% | 60-70% | ≥70% |
| Participation: real "here's my layer" / DM-a-layer replies | ~none | a trickle | a repeatable stream |
| K (duet replies per clip × viewer→participant) | <0.1 | 0.1-0.3 | 0.3-0.5 |

These numbers are tunable targets, not canon; an 8% bar assumes warm/targeted traffic.
**iOS caveat:** Web MIDI is dead on iOS Safari, so iOS-driven drop-off is not a format
failure — annotate it, don't let it trigger a false KILL.

## Branch on the result

- **GO** → build the in-browser MIDI→MP4 duet render engine (the deferred big bet).
- **PIVOT** → iterate the clip aesthetic/hook/format and re-test before engineering.
- **KILL** → the duet loop isn't the wedge; ship the drill core as a standalone
  note-checker (then the deferred core enrichments become the priority).

## Where the data lands

- With the endpoint wired: emails arrive in Formspree/your inbox.
- Always (incl. demo mode): inspect `localStorage` keys `loop_waitlist` (signups, with
  UTM + source: landing vs in-app) and `loop_landing_events` / app funnel events.

## Timeline

~2 weeks, ~$0-150. Days 1-3 wire endpoint + deploy + draft clips; days 4-6 produce
clips; days 7-12 post daily + log; days 10-12 boost the best; days 13-14 tally against
the gate and write the GO/PIVOT/KILL decision.
