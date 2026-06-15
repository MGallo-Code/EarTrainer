# Validation Test Plan: Does the By-Ear Duet Clip Actually Spread?

_Created 2026-06-15. This is the single highest-leverage action from the research.
See [10-critique.md](10-critique.md): the whole "Loop" thesis rests on one
unproven, correlated bet, and this test attacks it for ~$0 before any hard
engineering._

## The one hypothesis we are testing

> **An auto-rendered, MIDI-clean "duet card" is something people actually want to
> watch, and enough of them will try to add the next layer by ear that the loop
> self-propagates (viral coefficient K approaching or above 1).**

Everything downstream depends on this: niche size (the share loop is the hedge for
it), unit economics (paid acquisition alone fails 3:1 at this price), and the
hardware bet (viral clips are the demand signal). If the clip does not spread, the
"winning" concept collapses into "just another note-checker" that the research says
loses the paid-spend war against a $1B incumbent. So we test the clip **before** we
build the engine that makes clips.

## Why Wizard-of-Oz (fake it before you build it)

The real product needs an auto-render + latency-compensated layering engine the
research calls "genuinely unproven engineering." We do NOT build that yet. We
hand-produce the clips and test the only thing that matters first: do people watch,
share, and try? This is the standard de-risking move and it is cheap and decisive.

## What to produce: 15-20 "duet card" clips

Each clip is a short vertical video (TikTok / IG Reels / YouTube Shorts format,
9:16, 15-30s) that:

1. **Plays a short musical loop** (bass line OR melody OR chords) on a clean piano
   sound, with a simple, attractive visualizer (falling/standing note blocks, a
   piano roll, or a keyboard lighting up). The audio is quantized and tight, this is
   the whole point: it must look and sound good even though a "beginner" made it.
2. **Shows an open slot** with a clear call to action overlaid: *"I found the bass.
   Can you find the melody by ear? Stitch your layer."* or *"Find the chords by ear
   and duet this."*
3. **Ends with a hook**: the half-finished track sounds incomplete on purpose, so
   the viewer wants to hear it resolved.

Make a few "completed" examples too (two layers stitched into a satisfying mini
track) so people see the payoff of participating.

### Content rules (avoid the licensing trap)
- **Original or public-domain loops ONLY.** A successful cover loop invites the exact
  copyright problem Smule still fights. Use simple original riffs and public-domain
  melodies (folk tunes, classical themes out of copyright). This also keeps the test
  honest about the MVP's real constraint.

### How to make them without the engine
You already have the tools:
- **Logic Pro** (you have it): play/quantize the loop, render with a good piano
  instrument, export audio.
- **Visualizer:** use a free piano-roll/visualizer (e.g., a MIDI-to-video tool) or
  even the Phase 0 prototype's on-screen keyboard screen-recorded. It does not need
  to be the final design, just clean.
- **Captions/CTA:** add in CapCut or any editor.
- Budget a day or two to make all 15-20. Reuse a template.

## Where to post
Post the same clips across channels to find where the loop lives:
- **TikTok** and **Instagram Reels** (primary, this is where the format spreads).
- **YouTube Shorts** (secondary).
- **Reddit**: r/piano, r/musictheory, r/WeAreTheMusicMakers (post as a genuine
  "trying an idea, can you add a layer?" not an ad).
- Optional: a tiny **$50-100 paid boost** on the 3 best-performing organic clips to
  see if reach scales or dies.

## What to measure (per clip + in aggregate)

Capture these in a simple spreadsheet:

| Signal | What it tells you | Why it matters |
|---|---|---|
| **Watch-through / completion %** | Is the clip even watchable? | The #1 unknown: a quantized piano clip may not hold attention like a singing cover |
| **Shares + saves** | Does it spread passively? | Shares are the closest proxy to virality |
| **Comments saying "I tried"/"here's mine"** | **The duet intent signal** | This is the real K input: do people want to ADD a layer? |
| **Profile clicks / link clicks** | Pull-through to learn more | Funnel intent |
| **Waitlist signups** (see below) | Hard demand | First-party proof, not inference |
| **Reddit: top-comment quality** | Qualitative pull | Are people excited or indifferent? |

**Pair it with a smoke-test landing page + waitlist** (one page: "Figure out songs by
ear on the keyboard you already own. Join the waitlist."). Every clip links to it.
This simultaneously probes niche size (risk R2) and gives you a real CAC number,
instead of relying on the refuted "15% adult returners" stat.

**Optional price probe (risk R5):** on the waitlist confirmation, A/B a soft price
question: "$5-8/mo billed annually" vs "one-time unlock." See which the high-intent
cohort prefers. This pre-tests the free/$4.99-once anchor problem.

## Go / Pivot / Kill thresholds

These are starting heuristics, not gospel. The point is to commit to a decision rule
**before** you see the data, so you do not rationalize a weak result.

- **STRONG GO** (build the duet engine): multiple clips exceed ~30-40% completion AND
  you get organic "here's my layer / I tried this" responses on more than a couple of
  clips AND the waitlist converts clicks at a healthy rate. The loop has a pulse.
- **WEAK / PIVOT** (most likely outcome, plan for it): clips get decent views but the
  duet-intent signal is thin (people watch, few try). Then the virality engine is
  K<1. Pivot toward the **C1/C3 posture**: a paid-acquisition by-ear note-checker
  with the drill core (Phase 0) as the product, and reconsider whether the niche
  justifies the spend. Do NOT build the render engine.
- **KILL the social bet**: clips flop on watch-through across channels even after a
  paid boost and reformatting. The format does not carry. Keep the drill core as a
  smaller product or stop.

The critic's framing: R1 (shareability) and R2 (niche) are not independent risks,
they share one root cause (the loop). So a clean signal here moves the whole plan;
a null result here saves you from the most expensive part of the build.

## Two-week timeline

- **Days 1-3:** Build the smoke-test landing page + waitlist. Draft 5 clip concepts
  and a reusable template.
- **Days 4-6:** Produce 15-20 clips (Logic + visualizer + captions).
- **Days 7-12:** Post daily across channels. Engage authentically on Reddit. Log
  metrics each day.
- **Days 10-12:** Boost the 3 best clips with a small paid spend.
- **Days 13-14:** Tally against thresholds. Write the go/pivot/kill decision. If GO,
  the next build is the real duet render engine. If PIVOT, the next build is the
  Phase 0 drill core into a shippable note-checker.

## What this costs you
- ~$0-150 (optional paid boost), plus ~1 week of part-time effort.
- Versus weeks-to-months building an "existential," unproven render pipeline blind.

That asymmetry is the entire reason to do this first.

## Related
- [01-the-wedge.md](01-the-wedge.md) - the concept this validates
- [10-critique.md](10-critique.md) - why this is the make-or-break test
- [09-roadmap-and-risks.md](09-roadmap-and-risks.md) - where this sits in the plan
