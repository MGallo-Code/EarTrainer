# EarTrainer Product Research

_Generated 2026-06-15 by a multi-agent deep-research run (10 dimensions, 32 agents, adversarial fact-checking). See [GOALS.md](../GOALS.md) for the product decisions this informs._

## Executive summary

**The wedge: "Loop" - Duolingo for playing by ear, with a duet button.**
You figure out a song by ear on the MIDI keyboard you already own; the app captures
your attempt as clean MIDI, quantizes/aligns it into a good-sounding clip, and posts
it as an open "duet card": *"I found the bass, can you find the melody by ear?"* The
next player hears it, plays their layer back on their own keys, gets MIDI-exact
grading, and the two stitch into a finished mini-track that auto-renders to a
shareable video carrying the next open slot.

**Why it's genuinely different (not just better):**
- No major piano app teaches *playing by ear*, and (directionally) none do
  record/layer. Incumbents (Simply, Yousician, Flowkey, Skoove, Synthesia,
  Playground, Melodics) are falling-notes + mic-based. That's the wrong substrate
  for a record/layer/duet loop, so they can't bolt this on as a feature.
- **MIDI is the unlock.** It's zero-latency and polyphonic-exact, so the app can
  quantize a beginner's sloppy timing into a clean, shareable clip. Mic-based rivals
  literally tell users to switch to MIDI to fix misheard chords; they can't produce
  clean stitches. The product, not the user, makes the clip look good.
- **The moat is the data:** a longitudinal dataset of real users' graded by-ear
  playing is exactly what's needed to train a by-ear/improv evaluator, an unsolved
  problem no recognition-only rival has the data for.

**Beachhead:** pop/jazz adult self-learners (~20-40) who can read music but freeze
when asked to play by ear, already own a MIDI keyboard, are on desktop/Android
(where Web MIDI works for ~80% of users), and already post clips to TikTok/IG.
Explicitly NOT absolute beginners/kids (Duolingo + the $249 Loog piano own that).

**Model:** subscription-first, freemium, **$5-8/mo billed annually**; web-first
Stripe checkout keeps ~97% (vs Apple's cut). Phase-2 hardware = a low-cost wired
USB-MIDI "duet bar" + a native iOS shell (the iOS Web MIDI gap IS the hardware
wedge), sold as a one-time purchase that bundles access. Hardware works at the basic
tier without paying (The ONE / ROLI pattern, never the Whoop "brick it" model).

**Tech reality:** Web MIDI + webmidi.js, smplr SplendidGrandPiano (MIT) for sound,
Web Audio/AudioWorklet for record/layer with latency compensation, VexFlow for
notation. Works on Chromium/Android today; iOS needs a native WebView+CoreMIDI shell
later. Live mic grading of acoustic pianos is NOT feasible (research-grade);
turn-based "play-then-grade" is fine.

### THE ONE THING TO DO FIRST (read the critic, file 10)

The whole thesis rests on one correlated, unproven bet: **that an auto-rendered MIDI
duet clip is actually fun to watch and share.** Virality, niche-size hedge, unit
economics, and the hardware bet all secretly depend on it. So before building the
real layering/render engine:

> **Run a ~2-week Wizard-of-Oz test:** hand-produce 10-20 fake duet clips from
> quantized MIDI, post to TikTok/IG with an open "find the next layer by ear" slot,
> and measure watch-through / shares / invite-accepts. If clips don't spread, the
> winning concept becomes a losing one and nothing else in this plan matters. Cheap,
> decisive, and it saves Phase-1 engineering.

**Honest risks (don't skip):** the duet niche may be small (no direct demand
evidence exists); ear-training is price-anchored to free/$4.99-once, so $5-8/mo is a
real ask; the shareable-clip render is unproven engineering; and a few load-bearing
stats (the "0 of 8 do record/layer" tally, Smule's viral numbers, Skoove conversion
lift) are inferences, not verified facts. See file 10 for the full teardown.

## Contents

1. [The Wedge (the recommendation)](01-the-wedge.md)
2. [Candidate Concepts (3-lens panel)](02-concepts.md)
3. [Market & Competition](03-market-and-competition.md)
4. [Pedagogy: what builds the skill](04-pedagogy.md)
5. [Tech: web-first MVP stack](05-tech-web-mvp.md)
6. [Acoustic detection & the hardware path](06-acoustic-detection-and-hardware.md)
7. [Business model & pricing](07-business-model-and-pricing.md)
8. [Go-to-market & growth](08-go-to-market-and-growth.md)
9. [Roadmap & risks](09-roadmap-and-risks.md)
10. [Completeness critic (read this)](10-critique.md)
11. [Verified findings corpus (raw, with sources)](11-findings-corpus.md)
12. [Sources](12-sources.md)

## Per-dimension reliability (after fact-check)

| Dimension | Reliability |
|---|---|
| ear-training-apps | medium |
| piano-learning-apps | high |
| market-sizing | medium |
| pedagogy-science | high |
| tech-web-midi-audio | high |
| tech-pitch-detection | high |
| hardware-path | medium |
| business-pricing | high |
| gtm-growth | high |
| whitespace-blowup | medium |

## Stats

- Dimensions researched: 10/10
- Unique sources: 125
