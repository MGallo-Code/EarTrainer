# The Wedge: Recommended Product Concept

_Research run 2026-06-15. This is the synthesized recommendation from a 3-lens design panel + judge._

# Concept Scoring

| Concept | Differentiation | Market Pull | Web-First Feasibility | Defensibility/Moat | Blow-up/Virality | Fit w/ Vision | Total |
|---|---|---|---|---|---|---|---|
| **C1: Echo** (diff/defensibility) | 4 | 3 | 5 | 4 | 2 | 5 | **23** |
| **C2: EarLoop** (virality) | 5 | 3 | 4 | 4 | 5 | 5 | **26** |
| **C3: Tonic** (pedagogy) | 4 | 3 | 5 | 4 | 2 | 4 | **22** |

**Scoring rationale (the deltas that matter):**
- **Differentiation:** All three share the same MIDI-judged by-ear core (genuine white space: 0 of 8 piano apps do by-ear, none do record/layer). C2 edges ahead because the *duet card* is a differentiated unit, not just a better drill. C1/C3 differentiate on grading quality, which is more copyable than a social format.
- **Market pull:** Tied at 3. The corpus is honest that "want to play by ear" may be a passionate-but-narrow niche vs. "play my favorite songs from falling notes," and ear-training is anchored to free/one-time (Tenuto $4.99 once). No concept has direct demand evidence; all infer it.
- **Web-first feasibility:** C1/C3 score 5 (drill + MIDI grading + smplr is all proven, low-risk). C2 scores 4 because the auto-rendered shareable video clip is genuinely unproven engineering and the corpus flags it as "existential" risk.
- **Defensibility:** Tied at 4. All three claim the same compounding moat: a longitudinal dataset of users' own graded playing to train a by-ear/improv evaluator (an explicitly unsolved problem). C2 adds "which layers stitch into popular tracks" as extra signal.
- **Blow-up/virality:** The decisive axis. C1/C3 have no organic loop (score 2) and would depend on paid CAC against a GV-backed $1B Simply. C2 has the only real growth mechanic in the set (score 5): Smule's duet loop (1M+ duets on one post) + Duolingo's streak engine (80% organic).
- **Fit with vision:** C1/C2 score 5 (record/layer is literally in the vision phrase; both nail the iOS-Web-MIDI-gap-as-hardware-wedge). C3 scores 4 (pedagogy-forward, lighter on the "record/layer/play-by-ear" record-layer half).

---

# THE SYNTHESIS: Recommended Wedge

The winner is **C2 (EarLoop)** as the spine, but it is missing the one thing that makes it defensible and honest: C3's **cadence-primed, play-it-back grading loop** is the *content* that should fill the duet card, and C1's framing of MIDI auto-alignment as "the product makes the beginner look good" is the load-bearing reason the social loop can actually work. Commit to one product that fuses all three.

## 1) The Wedge

**Loop** (working name) is the first web app where you figure out a song by ear on the MIDI keyboard you already own, and the app turns your fumbling attempt into a clean, shareable layered track that *invites the next person to find the next part by ear.* It is "Duolingo for playing by ear" with a duet button: a pedagogically serious by-ear engine (cadence-primed, functionally-graded, MIDI-exact) wrapped in a record/layer/share loop where MIDI quantization does the work of making every clip look and sound good.

## 2) The killer mechanic no incumbent has

**The By-Ear Duet Card, made shareable by MIDI auto-alignment.** One user works out a loop by ear (a bassline, a melody) on their keyboard; the app captures it as clean MIDI, *quantizes and aligns it*, renders it to good piano sound (smplr SplendidGrandPiano, MIT), and posts it as an open card: "I found the bass. Can you find the melody by ear?" The next user hears it, plays their layer back on their own keys, gets MIDI-exact grading on pitch + timing, and the two tracks stitch into a finished mini-track that auto-renders to a shareable video carrying the next open slot.

Why it is novel given the corpus, specifically:
- **No piano app has record/layer at all** (0 of 8 surveyed: Simply, Yousician, Flowkey, Skoove, Synthesia, Playground, Piano Marvel, Melodics). None teach by-ear. Melodics has MIDI-gamified timing but no ear training. The ear-trainers (Perfect Ear, Functional Ear Trainer, Tenuto) are tap-to-identify, never play-back-graded.
- **MIDI is the unlock that mic-based incumbents structurally cannot match.** Smule proved the duet-with-X loop scales (~20M videos/day, 1M+ duets on one Jessie J post) but it is *singing* — wonky pitch makes ugly clips. MIDI quantizes a beginner's sloppy timing into a clean stitch. Simply/Yousician's mic chord detection "mishears octaves or drops notes," so they could not produce clean stitches even if they bolted this on. The product, not the user, makes the clip good — that is what lets a beginner's by-ear attempt be worth sharing.
- **The grading is honest because it is functional, not note-matching.** Every card primes the key with a I-IV-V cadence first (tonal context is lab-backed: Graves & Oxenham 2017, melodic d~1.02), grades scale-degree accuracy via Web MIDI (zero-latency, polyphonic-perfect), and gates mastery Benbassat-style. That is C3's spine, and it is what makes the social object a *learning* object instead of a karaoke gimmick.

## 3) Beachhead user and expansion path

**Beachhead:** Pop/jazz adult self-learners, roughly 20-40, who (a) can read/play repertoire but freeze when asked to play a tune by ear (the corpus's repeatedly-named emotional gap), (b) already own a MIDI-capable digital keyboard (digital is ~61% of the market), (c) are on desktop/Android-Chromium where Web MIDI fully works (~80% global), and (d) already post short clips to TikTok/IG. This is the highest-intent persona: Skoove's keyboard-bundle conversion proves recent-keyboard-buyers convert far above the ~2.18% freemium baseline, and they use movable-do/scale-numbers, matching the functional method the evidence favors. Explicitly NOT absolute beginners/kids — Duolingo + the $249 Loog piano own that, and a giant is in that lane.

**Wedge-to-mainstream path:**
1. **Wedge:** Win the by-ear adult on desktop/Android web. Land the daily habit with C3's drill core (streaks: first-week streak = 3.6x retention per Duolingo).
2. **Expand via the share loop:** Every rendered duet clip on TikTok/IG carries an open slot, pulling in *adjacent* keyboard owners who didn't think of themselves as "by-ear learners." This converts the niche-demand risk into a top-of-funnel asset.
3. **Mainstream-ward:** Add a "play your favorite song by ear" mode (still by-ear, not falling notes) to bridge toward the larger "play songs I love" demand Simply dominates — but on the transferable-skill side of it.
4. **B2B2C:** Teacher/studio tier where by-ear duets become auto-graded homework (a channel no incumbent's mic pipeline can grade), and keyboard-manufacturer bundles (the proven near-zero-CAC channel) with a web-first "scan QR, play instantly, no install" pitch that gives partners better economics than Skoove's app-store-taxed deal.

## 4) Why it can blow up, and why it is hard to copy

**Growth/virality mechanic:** The duet card is a self-propagating unit. Smule's duet-with-X loop is the proof it scales; Duolingo's streak/league engine (drove churn 47%→28%, ~80% organic) is the proof the retention layer compounds it. Critically, MIDI auto-alignment removes the single thing that would kill the loop — beginner clips that are embarrassing to share. Each clip is both content and an invitation, so growth is near-organic CAC the way Duolingo's was, which is the only way to survive against a GV-backed $1B Simply that outspends on paid.

**Moat (three layers, in order of durability):**
1. **Compounding data moat:** Every duet attempt is a labeled sample of a real user's by-ear playing, graded over time, *plus* a signal of which layers stitch into popular tracks. That is the exact dataset needed to train a by-ear/improv evaluator — explicitly an unsolved problem, and one no recognition-only or mic-based rival has the data to build.
2. **Wrong-substrate lock-in for incumbents:** Falling-notes architectures and mic-first pipelines are the wrong foundation for a record/layer/duet loop. Bolting it on is a rebuild of their core pedagogy and content model, not a feature.
3. **Format + craft:** The fused combination (functional by-ear grading + MIDI record/layer + shareable duet) ships together nowhere; replicating the *clean-stitch* output is real, tuned engineering, not a checkbox.

**Hardware-later fit:** The iOS Web-MIDI gap *is* the hardware wedge (Apple has declined Web MIDI since 2020, still absent through Safari 26.5). Phase 2 ships a thin native iOS/iPadOS WebView shell bridging CoreMIDI so the same web codebase finally runs the duet loop on iPad/iPhone, and the lowest-BOM accessory (a wired USB-MIDI "duet bar," avoiding ~$1,500/region wireless FCC cost). Follow the The ONE / ROLI pattern (hardware works at basic tier without paying), NOT the Whoop/Snap "brick it if you stop paying" model. Web-first checkout keeps ~97% (post-Epic ruling) vs Apple's cut. The viral clips are themselves the demand signal that de-risks the hardware bet (9% of crowdfunded hardware fails to deliver — validate first).

## 5) Honest reasons it might NOT work

- **Shareability is existential and unproven.** An auto-rendered MIDI duet clip may simply not be fun to *watch* the way a singing cover is. If the clip output isn't genuinely engaging (visuals + sound), the viral loop dies and it collapses into "just another note-checker." The corpus flags this as the #1 risk, needing 5-10 rounds of tuning the clip itself. This is the bet.
- **Segment-size risk is real and unquantified.** "Want to play by ear" may be a passionate-but-narrow niche vs. "play my favorite songs from falling notes." No concept has direct demand evidence; the share loop is the hedge, but if the niche is too small, even organic growth has a low ceiling.
- **Price anchor fights the category.** Ear-training is anchored to free/one-time (Tenuto $4.99 once, free web tools). A $5-8/mo ask (even annual-framed) plus eventual hardware needs the by-ear value to be obvious and fast, or it reads as a paywall on something users expect cheap.
- **Engineering surface is the widest of the three.** C2 bundles the riskiest piece (auto-rendered video + latency-compensated layering via `AudioContext.outputLatency`) on top of the by-ear engine. C1/C3 are simpler and lower-risk; choosing C2 trades feasibility for upside.
- **Incumbents can extend, and one already is moving.** ROLI launched an AI music coach (Feb 2026) — they chose camera/hand-tracking, leaving the audio/by-ear dimension open, but it proves incumbents are probing "beyond the notes." The data moat must be built before a giant with distribution + the streak engine (Duolingo) decides by-ear is worth owning.
- **Licensing exposure if it works.** A successful share loop invites covers of copyrighted songs (Smule's ongoing problem). MVP must lean on original/public-domain loops, which may dampen the very virality that justified the bet.
