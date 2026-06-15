# EarTrainer - Product Goals & Decisions

Last updated: 2026-06-15

This is the running record of what EarTrainer is becoming and the decisions made
along the way. Update it whenever a direction changes. (Deep product research is
in progress as of 2026-06-15; findings will refine the "wedge" below.)

## Vision (one line)

Turn EarTrainer from a personal CLI interval quiz into a product people want: a
web-first app, built around a **record / layer / playback + play-by-ear** loop,
that is genuinely unique and defensible enough to make waves in the market.

## Current state (starting point)

- Python CLI app (`main.py`, `quiz.py`, `Note.py`, etc.).
- Synthesizes two notes, you type the interval, it scores you.
- No MIDI, no GUI, no recording, no layering, no lessons.
- A solid hobby prototype, not a product.

## Locked decisions

### Product form: software first, hardware later (phased)
- **Phase 1:** Software only. Works with MIDI keyboards users already own
  (USB-MIDI / Bluetooth MIDI). Optional mic-based pitch detection for acoustic
  pianos. Goal of this phase: validate demand cheaply, get real users.
- **Phase 2:** Companion hardware, designed only after software shows traction.
  Sequenced this way to keep risk and cost low up front.

### Platform: web-first
- Build one web codebase first (avoid native app dev across iOS/Android/desktop
  at the start). Web MIDI + Web Audio.
- Expand later to tablet (iPad on the music stand is the sweet spot), desktop
  (lowest latency, best for recording/layering), and phone (mass reach).

### Target users: broad, beachhead to be chosen from research
- Anyone who needs or wants the skills: adult self-learners / returning
  hobbyists, serious students, teachers/studios, and musicians/producers.
- Research is identifying the single sharpest beachhead to launch with, then the
  expansion path outward. We do NOT try to serve everyone on day one.

### Business model: subscription-first (primary), hardware bundle later
- **Primary model:** self-funded subscription (indie SaaS). Freemium app with a
  **$5-8/month** tier unlocking full features. This is the proven money model in
  this market (Flowkey, Simply Piano, Yousician).
- **Hardware (phase 2):** sold as a one-time purchase that bundles basic access;
  the monthly subscription still unlocks the full experience. So the hybrid the
  user described ("buy hardware for basic, $5-8/mo for full") sits on top of a
  subscription core, it does not replace it.
- **Why this over the alternatives:**
  - VC-scale raise: rejected for now. Trades away control and adds pressure
    before there's any traction. It's a decision to earn later, not make on day
    one. We keep the option open if growth justifies it.
  - Pay-once app: rejected as primary. One-time revenue per customer makes it
    hard to fund ongoing servers/AI/updates.
  - Open-core: rejected as primary. Slowest to monetize and easily copied.
- **Control:** Michael keeps full ownership at this stage.

## The core experience (what makes it EarTrainer, not a clone)

- The record / layer / playback loop is central: play something, capture it,
  build on it, hear it back.
- "Play by ear" training is the headline skill (transcribe, find the tonic,
  hear scale degrees and chord function), not just isolated interval drills.
- Likely differentiators under investigation: AI feedback on the user's OWN
  playing (not just multiple-choice quizzes), and eventual hardware lock-in as a
  moat. The research run will name the specific wedge.

## Success looks like

- Phase 1: a working web app that real users (the chosen beachhead) practice with
  regularly and that demonstrably improves their ear/play-by-ear skill.
- Sustainable: a few thousand paying subscribers = real monthly income.
- Distinctive enough that it spreads (shareable performances / social / creator
  mechanics are being researched as the growth engine).

## Open questions (being answered by the 2026-06-15 research run)

- Which exact beachhead user to launch with.
- The single defensible "wedge" mechanic no incumbent has.
- Web MIDI / pitch-detection feasibility limits and the right tech stack.
- The phase-2 hardware archetype and whether it's worth building.
- Pricing specifics, unit economics, and the growth/virality engine.

## How to use this file

- Treat it as the source of truth for "what are we building and why."
- When research or a decision changes direction, edit the relevant section and
  bump the "Last updated" date.
