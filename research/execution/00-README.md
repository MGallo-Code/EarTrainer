# Loop - Execution Research

_Generated 2026-06-15 by a multi-agent run (8 dimensions across 4 streams, adversarially
fact-checked). Follow-on to [../00-README.md](../00-README.md). See
[../../GOALS.md](../../GOALS.md) for product decisions._

## Executive summary

Four streams, one sequencing rule: **one cheap test gates the most expensive build.**

**Marketing (how to run the validation test):**
- Hand-make 2-4 duet clips/day for 14 days (~28-56 assets), build NO renderer. Tools:
  SeeMusic (MIDI to falling-note video) or a `mido + Pillow + Timidity + FFmpeg` script.
- Clip spec: catchiest moment as the literal first sound (frame 0), 15-30s, seamless
  loop, faceless, readable on mute, 6-10 word overlay, and **end every clip with
  "your turn, add the melody, Duet this."**
- Distribution: cross-post TikTok + IG Reels + YT Shorts; seed Reddit accounts NOW
  (longest lead time); optional $200-400 boost as sample-size insurance.
- Pre-commit the go/kill gate in writing (waitlist >=8% consumer-calibrated, strong
  shares/saves, retention >=70% first-3s). Weight depth over raw views.

**Duet engine (build only on GO):**
- Capture MIDI events (not mic) - sidesteps every latency/Android-audio gotcha.
  Quantize layers to the first layer's locked tempo; "Tale of Two Clocks" scheduler.
- Render with **Mediabunny (WebCodecs)**, NOT MediaRecorder or ffmpeg.wasm. 720x1280/30fps
  to dodge Android large-canvas encode failures.
- Grade against captured `event.timeStamp`, never smplr's `onStart` (fires ~200ms early).

**Curriculum (ship into Phase 0 regardless - it's de-risked):**
- Level ladder: scale degrees -> stepwise melodies -> dictation -> chords (Axis
  progression for pop) -> full-song layer-by-ear.
- Mechanics: 85% Rule difficulty, Leitner now / FSRS later (retention 0.85-0.88),
  rhythm-graded-before-pitch, separate SR (recognition) from deliberate practice (motor).

**Competitor gaps (the wedge, uncontested):** 0 of 5 rivals teach by-ear as a creative
loop; none have a social/duet primitive (Yousician killed UGC in 2018); mic detection is
admitted-broken. Price $5-8/mo undercuts all paid rivals; never gate the shareable clip.

### The critic's correction (important - read file 10)

The plan as written tests the wrong half of the bet. Key fixes before you run the test:
1. **Test participation, not just watchability.** "Fun to watch" =/= "fun to make." Force
   a real "I tried to add the next layer" action (even crude: "DM us your layer, we'll add
   it") and make THAT conversion the gate, not views or signups.
2. **Cold-start is unsolved.** A duet card needs a second person. Who answers the first
   1,000 cards? A social loop with no network is a solo recorder. Needs a plan.
3. **Copyright exposure on the real product** (not just the test): a public UGC library of
   recognizable copyrighted songs is bigger legal risk than incumbents (who license).
4. **iOS poisons the funnel:** TikTok/IG are iOS-heavy, but Web MIDI is dead on iOS Safari,
   so those viewers hit a dead end. Segment iOS out or the gate misreads as KILL.
5. **Unit economics:** $5-8/mo is ~half the field while carrying render/storage costs and a
   2-8 week pre-habit retention gap. No LTV/CAC model exists yet.

## Contents
1. [Validation-Test Marketing Playbook](01-marketing-playbook.md)
2. [Duet Record/Layer + Video Render Engine](02-duet-engine.md)
3. [By-Ear Curriculum & Retention](03-curriculum.md)
4. [Competitor Teardown & Positioning](04-competitor-teardown.md)
5. [Integrated Execution Plan & Priorities](05-integrated-plan.md)
6. [Completeness Critic](10-critique.md)
7. [Verified Findings Corpus](11-findings-corpus.md)
8. [Sources](12-sources.md)

## Per-dimension reliability (after fact-check)

| Dimension | Stream | Reliability |
|---|---|---|
| mkt-virality | marketing | medium |
| mkt-distribution | marketing | medium |
| tech-multitrack | duet_engine | high |
| tech-video-render | duet_engine | medium |
| cur-progression | curriculum | high |
| cur-retention | curriculum | high |
| comp-teardown | competitor | medium |
| comp-gaps | competitor | medium |

## Stats
- Dimensions researched: 8/8
- Unique sources: 94
- Sections missing (need re-run): none
