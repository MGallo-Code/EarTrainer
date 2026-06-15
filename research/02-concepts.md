# Candidate Concepts (3-Lens Design Panel)

_Each concept was generated under a different optimization lens, then scored and synthesized into [the wedge](01-the-wedge.md)._


---

## Lens: Differentiation & defensibility

# Wedge Concept: Differentiation & Defensibility Lens

## Working name: **Echo** (record / layer / play-by-ear loop)

**One-line pitch:** A web-first studio that listens to *your own* playing on the MIDI keyboard you already own, has you transcribe and re-play tunes by ear, and grades the performance you actually produced, not whether you hit a printed note.

## The single killer mechanic

**The "play-it-back" loop, MIDI-judged.** Echo plays a short phrase in an established key (cadence first, per the tonal-context evidence: Graves & Oxenham 2017 show context aids interval perception, Cohen's d ~0.59-1.02), the user figures it out and plays it back on their own keys, and Echo grades pitch + timing per-note off the MIDI stream. This is the capstone "transcription" skill in the by-ear stack (find tonic -> scale degrees -> chord function -> melodic/rhythm dictation -> transcription) that *no* mainstream product does. Simply Piano explicitly does not teach playing by ear or improvisation even at $169.90/yr and gives only binary right/wrong feedback. Melodics is MIDI-gamified but teaches timing, not ear. The dedicated ear-trainers (Perfect Ear, Functional Ear Trainer, Tenuto) are tap-to-identify, not play-back-graded.

## Precise beachhead user

**Adult intermediate self-learners (re-engaging "returners," ~30-55) who can already read and play repertoire but freeze when asked to play a tune by ear** — the exact, emotionally-felt gap in the corpus ("trained pianists who can perform hard pieces but can't play a simple melody without a score"). They already own a MIDI-capable digital piano (digital is ~61% of the market and the entry-level default), are on desktop/laptop where Web MIDI fully works (~80% global, Chrome/Edge/Firefox), and have proven willingness to pay $15-25/mo for Simply/Yousician. Explicitly NOT absolute beginners/kids — that segment is contested by Duolingo + the $249 Loog piano.

## MVP includes / excludes

**Includes:**
- Web MIDI play-in as the primary path ("no microphone guesswork — it knows exactly what you played"), directly countering the documented mic chord-detection failures in Simply Piano/Yousician.
- Functional ear training as the spine: cadence priming, scale-degree drills, Benbassat-style 90%-accuracy mastery gating (4 notes -> full scale -> chromatics -> new keys).
- The record/layer/playback loop: record a part, layer a second, hear it back — proven feasible in-browser (BandLab/Soundtrap), with `AudioContext.outputLatency` compensation so layers stay in time.
- Play-it-back grading: per-note pitch + timing scoring off MIDI (trivially accurate vs. mic).
- Good piano sound out of the box via smplr SplendidGrandPiano or Tone.js Piano (MIT, zero DSP work).
- The quick-win fixes ear-trainer users beg for: adjustable inter-chord gap, one-tap relisten, instant audio feedback after errors.

**Excludes (v1):**
- iOS/iPad (Safari has no Web MIDI, declined since 2020 through Safari 26.5) — this becomes the hardware hook in phase 2.
- Live real-time acoustic mic grading (research-grade: <30ms polyphonic note-onset F1 collapses to ~31-37%). Acoustic is offline "play-then-grade" only via Basic Pitch, clearly secondary.
- AI improv-creativity grading (still "a developing area with significant limitations") — flagged as roadmap, not promised.

## Why now

Web MIDI + Web Audio are mature on the ~80% non-Safari surface; AudioWorklet (~94% support) and MIT-licensed grand-piano sample libs remove the hard infra work. ByteDance/Basic Pitch make acoustic offline transcription viable as a fallback. The category leaders have explicitly *not* built by-ear, and ROLI's competing "beyond-the-notes" AI coach (launched Feb 2026) chose camera/hand-tracking, leaving the audio/harmonic by-ear dimension wide open.

## Why hard to copy

1. **A skill no incumbent has cracked:** grading what *you* play by ear, not whether you matched a score. Simply/Yousician/Melodics each leave by-ear and improv untouched; building it means reorienting their entire pedagogy and content model.
2. **A proprietary data moat that compounds:** every play-it-back attempt is a labeled sample of a real user's playing graded over time — the dataset needed to train a by-ear/improv evaluator that pure-software rivals have no equivalent of.
3. **MIDI-first + record/layer/play-by-ear is a combination no one ships together** (Melodics has MIDI but no ear; ear-trainers have neither record/layer nor play-in grading).

## Tie to hardware-later (phase 2)

The iOS Web MIDI gap *is* the hardware wedge: ship a thin native iOS/iPadOS wrapper bridging CoreMIDI to the same web codebase, and/or a sub-$200 plug-and-play Bluetooth/USB sensor bar that adds MIDI to **acoustic** pianos — the clearest white space, since PNOscan ($1,795 + technician install) prices out consumers. Either makes "buy hardware for basic access" justified on the exact surface where web-only fails, while expanding the addressable base to acoustic owners. Follow the The ONE / ROLI pattern (hardware works at basic tier without paying) — NOT the Whoop/Snap "brick it if you stop paying" model that generated backlash — with $5-8/mo (annual-framed) for full access, undercutting Simply (~$17.90/mo) and Yousician (~$19.99/mo).

## Biggest risks

1. **Segment size:** "want to play by ear" may be far smaller than "play my favorite songs from falling notes." The passionate-but-narrow niche risk is real; validate demand before betting the roadmap.
2. **Price anchor:** ear-training is anchored to free/one-time (Tenuto $4.99 once; EarMaster Cloud ~$3.65/mo), so $5-8/mo on top of hardware needs the by-ear value to be obvious and fast — or it reads as a paywall on something users expect cheap.

---

## Lens: Virality & blow-up growth

I have a rich, fact-checked corpus. Let me synthesize the virality-optimized wedge.

# Wedge Concept: Virality & Blow-Up Growth Lens

## EarLoop — "Duolingo for playing by ear, with a duet button"

**One-line pitch:** A web-first app where you figure out songs by ear on the MIDI keyboard you already own, then post your "I figured it out" clip as a layered duet challenge that anyone can stitch onto.

### The single killer mechanic: the By-Ear Duet Challenge

One person records a short loop they worked out by ear (bass line, melody, chord stab) on their keyboard. The app captures it as clean MIDI plus rendered audio, and turns it into an open "layer card": **"I laid down the bass. Can you find the melody by ear?"** The next user hears the loop, plays their layer back on their own keyboard, and the two MIDI tracks stack into a finished mini-track that auto-renders as a shareable video. That stitched clip is the unit that travels to TikTok/Instagram, and every share carries an open slot inviting the next layer.

This is the mechanic no competitor has. Smule proved music UGC scales massively on exactly this loop (~50M monthly singers, ~20M videos/day; one Jessie J post spawned 1M+ duets), but it is singing-only. BandLab proved a record/layer/share flywheel reaches 100M users. No piano-learning app (Simply, Yousician, Flowkey, Melodics) has any record-and-layer feature at all (0 of 8 surveyed), and none has play-by-ear. The duet card fuses the corpus's #1 white-space (by-ear + record/layer) with its strongest proven viral loop (duet-with-X).

Why MIDI makes it spread better than Smule: layered MIDI quantizes/aligns automatically, so a beginner's wonky timing still produces a clean, satisfying stitch. The product, not the user, makes the clip look good.

### Precise beachhead: pop/jazz adult self-learners (20-40) who own a digital keyboard and post short clips

Not absolute beginners (Duolingo + Loog's $249 piano owns kids/beginners). The wedge user is the "I can read music but freeze when asked to just play a tune" intermediate the corpus repeatedly identifies, who already has a MIDI keyboard and an existing TikTok/IG habit. They are the highest-intent persona: Skoove's keyboard-bundle conversion proves the recent-keyboard-buyer converts far above the ~2.18% freemium baseline. They use movable-do/scale-numbers (not classical fixed-do), matching the functional method the evidence favors.

### MVP includes / excludes

**Includes:**
- Web MIDI play-in on Chrome/Edge/Android (caniuse ~80% global) with a friendly first-run "connect your keyboard" wizard (Chrome 124 now prompts for all MIDI access).
- Functional ear-training core: I-IV-V cadence primes a key before every item (tonal-context priming is lab-backed), scale-degree drills, Benbassat-style 90%-mastery gating + spaced repetition over weak degrees/keys.
- The record/layer/duet loop using smplr SplendidGrandPiano for instant good sound, AudioContext.outputLatency compensation so layers stay in time, auto-rendered shareable video.
- Streak/leaderboard/Friends-Streak engine (Duolingo: streaks → 3.6x retention, leagues → +25% completion).
- Web-first Stripe checkout (keeps ~97% vs Apple's cut).

**Excludes:**
- Live real-time acoustic-mic grading (research-grade: only ~31-37% onset F1 at <30ms; do not promise it). Acoustic = turn-based "play-then-record" via offline Basic Pitch only.
- iOS Safari MIDI (Apple refuses Web MIDI; defer to the native wrapper in phase 2).
- Licensed-song covers at launch (use original/public-domain loops to dodge Smule-style licensing exposure).
- Falling-notes repertoire mode (that is the incumbents' crowded, anti-transfer lane).

### Why now
- Web MIDI + Web Audio are production-ready on the Chromium/Android majority; smplr hit v1.0 (June 2026) and in-browser DAWs (BandLab, Soundtrap) prove record/layer works client-side.
- Post-April-2025 Epic ruling lets a web-first product keep ~97% of revenue, structurally undercutting App-Store-native rivals at the same sticker.
- The pandemic digital-piano install base persists (digital pianos ~$1.1B, ~900K units/yr) so the BYO-keyboard audience exists at scale.

### Why hard to copy
- **Data moat:** a longitudinal corpus of users' own by-ear attempts + which layers stitch into popular tracks trains an improv/by-ear evaluator no incumbent has data to build (judging creative playing is explicitly unsolved).
- **Loop-on-MIDI tech:** auto-aligned MIDI duets are why beginner clips look good; mic-based incumbents (whose chord detection "mishears octaves/drops notes") cannot produce clean stitches.
- Incumbents' falling-notes architecture and mic-first pipelines are the wrong substrate for a record/layer/duet loop; bolting it on is a rebuild, not a feature.

### Ties to hardware (phase 2)
The viral clips are the demand signal that de-risks hardware (9% of crowdfunded hardware fails to deliver; validate first). Phase 2 = the lowest-BOM accessory: a wired USB-MIDI "duet bar" / class-compliant controller (avoids ~$1,500/region wireless FCC cost) bundled with 6-12 months full access (The ONE pattern) and, critically, a native iOS WebView shell bridging CoreMIDI so the same web codebase finally runs the duet loop on iPad/iPhone. "Buy hardware for basic access" is then justified on the exact platform where web-only fails. Hardware stays usable without the sub (avoid Whoop/Snap bricking backlash).

### Biggest risks
1. **Sharing-shareability risk:** an interval-quiz score is far less inherently shareable than a singing cover. If the auto-rendered duet clip is not genuinely fun to watch (visuals + sound), the viral loop dies and it is just another note-checker. This is existential and needs 5-10 rounds of tuning the clip output.
2. **Segment-size risk:** "want to play by ear/improvise" may be a passionate but narrow niche versus "play my favorite songs from falling notes" that Simply dominates; combined with ear-training's $3-6/mo price anchor (Tenuto $4.99 one-time, free web tools), the $5-8/mo ask plus hardware may face resistance unless the duet loop drives near-organic CAC the way Duolingo's loops did (~80% organic).

---

## Lens: Pedagogical effectiveness & retention

# Tonic — Product Concept (Pedagogical Effectiveness & Retention Lens)

## One-line pitch
A web-first "Duolingo for playing by ear" that, before every drill, plants a key center in your ear, then grades the scale degrees you actually play back on your own MIDI keyboard — turning recognition into real, transferable by-ear skill.

## The single killer mechanic
**Cadence-primed, call-and-response by-ear loop graded on the keys you press.** Each rep: the app plays a I-IV-V-I cadence (establishing tonic), then a short melodic/harmonic phrase; you play it back on your MIDI keyboard; it grades the exact notes and timing via Web MIDI. This is the one mechanic, and every piece of it is corpus-grounded:
- **Prime the key first.** Tonal context measurably improves pitch perception (Graves & Oxenham 2017: melodic-context Cohen's d ~1.02, harmonic ~0.59; "establish a key before each item" is explicitly validated).
- **Functional, not interval-ID.** Scale-degree-in-key representations dominate for real-music transfer in experienced listeners; the abstract-interval camp is the most-criticized-as-non-transferable mode. Lead functional (movable-do/numbers), interval mode secondary.
- **Grade what they PLAY, not what they guess.** Nearly the entire ear-training field tests hear-then-pick recognition; transcription/play-back is the capstone by-ear skill and almost no one grades it on a real instrument.

This is the wedge no incumbent holds: Simply Piano explicitly does not teach playing by ear even at $169.90/yr; Melodics is MIDI-gamified but has no functional ear training; dedicated ear-trainers (Perfect Ear, Functional Ear Trainer, Tenuto) are tap-to-identify with no MIDI play-in.

## Why MIDI-first makes the pedagogy honest
Mic-based chord detection is the field's #1 functional complaint (Simply Piano/Yousician "mishear octaves or drop notes" on chords; Playground Sessions abandoned pitch detection entirely). Web MIDI gives perfect, zero-latency, polyphonic note+timing data for free — so grading is trustworthy. False "you played it wrong" verdicts are trust-killers for the exact beginner/adult audience we target; MIDI eliminates them.

## Precise beachhead user
**The adult "returner" / intermediate (35-60) who can read and play repertoire but freezes when asked to play a tune without a score, and already owns a digital/MIDI keyboard.** Why this user:
- Owns the hardware → Web MIDI works today on their laptop/Chromebook (desktop Chromium ~80% support; iOS is Phase 2, see below).
- Feels the gap acutely (the emotional "I wish I could just sit down and play" hook is corpus-confirmed) and self-teaches outside lessons → high intent.
- Adult self-learners are an under-studied, under-served segment vs. kid-oriented gamified apps; piano background even helps non-trivially (dictation predictors: piano-lessons β=0.41).

## MVP includes
- Web MIDI device-connect wizard (Chrome/Edge/Firefox; friendly permission UX for the Chrome 124+ prompt; detect-and-nudge Safari/Firefox users).
- The cadence-primed call-and-response loop: single degrees → tonic triad (1-3-5) → short melodies → I-IV-V chord function, in C first, expanding per Benbassat (4 notes → full scale → chromatics → new keys) with a 90%-accuracy mastery gate.
- **Spaced-repetition scheduler over weak scale degrees/keys/chords** (spacing effect is evidence-backed for song retention; most apps drill randomly — an SRS that resurfaces YOUR shaky degrees is a defensible, evidence-grounded edge).
- **Rhythm-first dictation track** (attend-to-rhythm-first improves rhythm accuracy; MIDI timing makes objective rhythm grading trivial).
- Good piano sound out of the box (smplr SplendidGrandPiano, MIT) and notation via VexFlow.
- Daily streak + a "what to practice next" coach surfacing weak spots (deliberate-practice *quality* > hours; DP explains only ~21% of performance variance).
- Web checkout (Stripe ~97% kept) — not App Store IAP.

## MVP excludes
- Acoustic-piano mic transcription (Phase 1.5; offline play-then-grade only, never "live" — sub-30ms polyphonic mic grading is unsolved, ~31-37% onset F1).
- Absolute-pitch training (rare, critical-period-bound; sell relative pitch).
- AI improvisation grading (open research problem; tempting but unreliable for v1).
- Native iOS app, licensed-song library, social/UGC, teacher dashboard.

## Why now
- Web MIDI + Web Audio are production-ready on the Chromium/desktop majority; smplr/VexFlow/Tone.js make a credibly good in-browser instrument zero-DSP work.
- Post-Apr-2025 Epic ruling lets web checkout keep ~97% of revenue, structurally favoring web-first over App-Store-native incumbents.
- Pandemic digital-piano installed base is large and held; the hardware that makes Web MIDI work is already in homes.

## Why hard to copy
- **Data moat:** a longitudinal record of each user's *own* play-back graded over time trains a by-ear/transcription evaluator no recognition-only competitor has data to build.
- **Pedagogy is the product, not a feature bolt-on:** functional priming + play-back grading + SRS is an integrated loop; Simply/Yousician/Melodics would have to rebuild their core (recognition/repertoire) to match, and EarMaster's clunky breadth is the opposite of this focused loop.

## Tie to hardware (Phase 2)
Web MIDI is blocked on iOS Safari (Apple declined since 2020). That gap *is* the hardware wedge: ship a thin native iOS/iPadOS WebView shell that bridges CoreMIDI, so the same web codebase runs everywhere and "buy hardware for basic access" delivers the reliable iOS experience. The defensible hardware bet is a **sub-$200 acoustic-piano MIDI sensor bar** (PNOscan is $1,795 + technician install; no cheap consumer Bluetooth retrofit owns this) — it converts the worst-case acoustic mic problem into best-case MIDI, expanding the by-ear engine to acoustic owners.

## Two biggest risks
1. **Demand size / price anchor.** The "want to play by ear" segment may be narrower than the "play my favorite songs" segment Simply dominates, and ear-training is anchored to free/one-time pricing (Tenuto $4.99 one-time; Functional Ear Trainer free). A $5-8/mo recurring ask must prove transferable-skill value fast — the anti-plateau "still play when the lights disappear" framing is the counter.
2. **The "grade what you play" bar is hard to nail.** Functional pedagogy's transfer edge rests on modest perceptual effects (d ~0.6-1.0), not a head-to-head RCT; and individual differences (tonal working memory) mean some users plateau regardless. If the grading feels unfair or the first-90-day habit loop (where ~44% of churn happens) doesn't land, retention collapses — so onboarding-to-first-streak is the highest-leverage investment.
