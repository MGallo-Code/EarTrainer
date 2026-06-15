## Integrated Execution Plan & Priorities

This plan sequences all four research streams (marketing, duet engine, curriculum, competitor) into one ~1-3 month roadmap for Loop. The organizing logic: **one cheap, fast test gates the most expensive build.** The #1 unproven, correlated bet is whether an auto-rendered MIDI duet clip is fun to watch and share. Everything downstream of the engine waits on that answer; everything in the curriculum and positioning lanes proceeds in parallel because it is de-risked already.

### The single most important next action

**Run the 2-week Wizard-of-Oz validation test with ZERO renderer built.** Hand-make the duet clips (do not build the in-browser pipeline yet) and post them across TikTok + IG Reels + YouTube Shorts + Reddit. The engine research is unambiguous that the renderer is not the bottleneck and should be decoupled from the existential question: build no renderer for the test, hand-make clips in SeeMusic (MIDI/keyboard to falling-note video, exports ready for Shorts) [source: https://www.seemusicapp.com/], or a `mido + Pillow + Timidity + FFmpeg` batch script [source: https://pappubahry.com/misc/piano_diaries/synthesia/], add a watermark/CTA in any editor, and ship. The existential question is "is the clip fun to share," not "can we render it."

### How the validation test gates the engine build

The expensive, highest-risk engineering (the in-browser MIDI-to-MP4 renderer with audio/video sync) must not start until the WoZ test passes. The renderer is feasible but the A/V sync is "the highest-effort, highest-risk part of an in-browser pipeline" [source: https://mediabunny.dev/guide/introduction], so spending that effort before knowing the clip format works is the core sequencing error to avoid.

**Pre-committed go/kill gate (decide BEFORE the campaign, in writing):**

| Metric | KILL | PIVOT | GO |
|---|---|---|---|
| Waitlist click-to-signup (consumer-calibrated) | <5% | 5-8% | >=8% [source: https://getwaitlist.com/blog/waitlist-benchmarks-conversion-rates] |
| Engagement depth | weak share/save | mixed | strong shares + saves + "how'd you make this" comments + duet/stitch attempts [source: https://stormy.ai/blog/social-media-startup-validation-guide] |
| First-3-second retention | <60% | 60-70% | >=70% [source: https://insights.ttsvibes.com/tiktok-first-3-seconds-hook-retention-rate/] |
| K (duet replies per clip x viewer-to-participant conversion) | <0.1 | 0.1-0.3 | >=0.3-0.5 [source: https://getlaunchlist.com/blog/viral-coefficient-k-factor-guide] |

Use the consumer-app 4-8% waitlist baseline, not the generic 10-20% [source: https://getwaitlist.com/blog/waitlist-benchmarks-conversion-rates]. Weight share/save over raw views: views are vanity; a 5K-view clip with 200 shares beats a 50K-view clip with 10 shares [source: https://stormy.ai/blog/social-media-startup-validation-guide]. Sustained K>1 is unrealistic for organic clips, so do not set the bar there [source: https://getlaunchlist.com/blog/viral-coefficient-k-factor-guide].

- **GO** -> build the renderer with Mediabunny (WebCodecs, H.264 + AAC in MP4, CanvasSource + AudioBufferSource, encode in a Web Worker with OffscreenCanvas), NOT MediaRecorder (real-time-only, fails on large canvases on Android Chrome) and NOT ffmpeg.wasm (~8x slower, no GPU, 2GB+ RAM) [source: https://mediabunny.dev/guide/introduction] [source: https://github.com/w3c/mediacapture-record/issues/213] [source: https://github.com/remotion-dev/webcodecs-benchmark]. Target 720x1280 at 30fps first to sidestep Android large-canvas encode failures [source: https://www.freecodecamp.org/news/the-webcodecs-handbook-native-video-processing-in-the-browser/].
- **PIVOT** -> iterate the clip aesthetic/hook/format (slideshow variant, "guess the song," different render style) and re-test before committing engineering.
- **KILL** -> the auto-rendered duet clip is not the wedge; do not build the renderer.

### What to ship into Phase 0 regardless of the test outcome

The curriculum and grading engine are de-risked by convergent literature and run in parallel with the WoZ test. These ship no matter what the clips do, because Phase 0 already has a functional ear-training drill core and the science is settled.

**Ship the by-ear level ladder verbatim from the convergent sources:**
1. Scale degrees: tonic alone in random keys (cadence every time), master before adding any degree, then add degrees 2-7 one at a time, then chromatics [source: https://advancingmusician.com/functional-ear-training/]. Use the I-IV-V-I functional cadence to match user expectations from the canonical Functional Ear Trainer [source: https://tonedear.com/ear-training/functional-solfege-scale-degrees].
2. Short stepwise diatonic melodies -> melodic dictation with leaps -> longer [source: https://apcentral.collegeboard.org/courses/ap-music-theory/classroom-resources/sight-singing-your-key-success-melodic-dictation].
3. Diatonic chords and progressions (the I-V-vi-IV "Axis" progression as a high-value target for the pop beachhead, presented as such rather than as a documented "canonical first" since that ordering was not supported by the cited source).
4. Full-song layer-by-ear (scaffold the transcription flow: hear the head/melody first, optionally hum, then play in phrase-by-phrase) [source: https://mattmrosphere.com/2024/06/04/beginners-5-step-guide-to-transcribing-solos/].

**Grading and difficulty mechanics (build these into Phase 0):**
- Grade against the captured Web MIDI `event.timeStamp` (same domain as `performance.now()`), NEVER against smplr's `onStart` callback, which fires up to 200ms early due to its default lookahead [source: https://github.com/danigb/smplr] [source: https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API]. This is a code-review enforcement item.
- For the polyphonic duet layer, scaffold and grade **rhythm first, then pitch** (the only direction with a proven accuracy gain), producing separate rhythm and pitch sub-scores [source: https://journals.sagepub.com/doi/10.2307/3345426].
- Tune live difficulty to the 85% Rule (~85% success / 15.87% failure) as the single difficulty knob and the antidote to the "too hard -> quit" cliff [source: https://pmc.ncbi.nlm.nih.gov/articles/PMC6831579/]. This converges with the Anki 80-90% target and Rosenshine's ~82% [source: https://eshapard.github.io/anki/target-an-80-90-percent-success-rate-in-anki.html].
- Scheduler: ship the Leitner box system now (no training data needed); upgrade to FSRS once per-user grade+timing history exists, with desired retention set to 0.85-0.88 for casual adults (90->95% roughly doubles daily review load) [source: https://e-student.org/leitner-system/] [source: https://expertium.github.io/Retention.html].
- Separate engines: spaced repetition for recognition; deliberate-practice-with-immediate-feedback for the physical playing layer, since spacing effects are weak/absent for complex motor skills [source: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0182986].
- Persist each layer as `@tonejs/midi` JSON with PPQ-relative ticks; convert velocity at the boundary (Web MIDI/smplr 0-127 vs `@tonejs/midi` 0-1) [source: https://github.com/Tonejs/Midi/blob/master/src/Note.ts].

Treat the drill itself as table stakes: 5+ free competitors already offer cadence-primed scale-degree drills, so the curriculum serves the duet/social loop rather than being the product [source: https://tonedear.com/ear-training/functional-solfege-scale-degrees].

### How competitor gaps shape positioning (informs every test asset and the pricing page)

The teardown found two universal, uncontested gaps that define the wedge:

| Gap | Evidence | Loop's move |
|---|---|---|
| No rival teaches by-ear as a creative loop | 0 of 5 major learning apps do; Melodics review points users to a separate app for by-ear [source: https://deviantnoise.net/education/piano/melodics-review/] | Lead with "grades by ear, with MIDI accuracy" |
| No rival has a social/duet/share primitive | Yousician removed all user-generated content in Oct 2018 [source: https://en.wikipedia.org/wiki/Yousician] | Make the open duet card the entire wedge |
| Mic detection is acknowledged-broken | Simply Piano's own docs say MIDI gives "perfect note recognition" [source: https://piano-help.hellosimply.com/en/articles/6210608-ways-to-improve-note-recognition-in-simply-piano-for-ios-keyboard-electronic-piano] | Headline zero-latency, polyphonic MIDI-exact grading |
| Auto-renewal billing is the loudest churn driver | Yousician 1.2/5 on PissedConsumer, $139.99 charged twice [source: https://yousician.pissedconsumer.com/review.html] | "We'll never silently auto-charge you" pledge on the pricing page |

- **Price:** $5-8/mo billed annually ($60-96/yr) undercuts every paid rival (Melodics $149.88/yr, Simply Piano $169.90/yr, Yousician Premium+ $139.99/yr) [source: https://deviantnoise.net/education/piano/melodics-review/] [source: https://pianoers.com/simply-piano-review-the-honest-truth-about-learning-piano-with-an-app/] [source: https://www.guitarchalk.com/yousician-cost/]. The one rival you do not dramatically undercut is ToneGym (~$74.95/yr) [source: https://www.tonegym.co/shop/index]; differentiate on the duet product there, not price.
- **Free tier:** do NOT gate the shareable clip (it is the acquisition engine). Gate on creations/day or advanced grading modes instead [source: https://www.guitarchalk.com/yousician-cost/].
- **Fast-follow risk:** Melodics and Yousician already capture MIDI/audio and could bolt on a duet layer. Move fast to own the "open duet card" format and a recognizable smplr render aesthetic before they copy it.

### Single prioritized action list

| # | Action | Stream | Gate / Dependency |
|---|---|---|---|
| **1** | **Pre-commit the go/kill gate in writing** (waitlist >=8%, strong share/save, K>=0.3-0.5), so a lucky view spike can't trigger a false GO [source: https://stormy.ai/blog/social-media-startup-validation-guide] | Marketing | Before campaign |
| **2** | Stand up the smoke-test stack: Carrd/Framer page + GetWaitlist ($15/mo) + free GA4/Clarity + TikTok/Meta pixel; add a "refer to unlock duet credits" loop; UTM-tag every link [source: https://founderfaqs.com/blogs/how-to-run-a-smoke-test-landing-page-to-prove-demand] [source: https://www.nocode.mba/articles/carrd-pricing] | Marketing | Days 1-3 |
| **3** | Seed and warm Reddit accounts NOW (2-4 weeks ahead, 10-20 non-promo comments) for r/piano, r/musictheory, r/WeAreTheMusicMakers; pre-built karma yields ~8x engagement [source: https://www.chartlex.com/blog/marketing/reddit-music-promotion-strategy-2026] | Marketing | Start immediately (longest lead time) |
| **4** | Hand-make 2-4 duet clips/day for 14 days (~28-56 assets) in SeeMusic; cross-post to TikTok + IG + YT Shorts; build NO renderer [source: https://www.seemusicapp.com/] [source: https://buffer.com/resources/how-often-should-you-post-on-tiktok/] | Marketing + Engine | Core test |
| **5** | Engineer clips: catchiest musical moment as literal first sound (frame 0), 6-10-word text overlay, 15-30s, natural loop, end EVERY clip with "your turn, add the melody, Duet this" [source: https://insights.ttsvibes.com/tiktok-first-3-seconds-hook-retention-rate/] [source: https://www.shortimize.com/blog/compare-watch-time-tiktok-vs-reels-vs-shorts] | Marketing | During campaign |
| **6** | Run multi-account posting (5-10 small accounts); single fresh accounts get throttled (~23% small-account view decline YoY) [source: https://www.socialinsider.io/social-media-benchmarks/tiktok] | Marketing | During campaign |
| **7** | Budget $200-400 TikTok boost (CPV ~$0.01-0.03 = ~15-40K views) as insurance to hit the >=300-visitor sample [source: https://quimbydigital.com/tiktok-ad-costs-2025-average-cpm-cpc-roi/] | Marketing | Insurance |
| **8** | In parallel, ship Phase 0 curriculum: scale-degree ladder + Leitner scheduler + 85% Rule difficulty + rhythm-first sub-scores; grade against `event.timeStamp`, not smplr `onStart` [source: https://advancingmusician.com/functional-ear-training/] [source: https://github.com/danigb/smplr] | Curriculum + Engine | Runs regardless of test |
| **9** | Onboarding: first session must end in a finished, postable clip, not just a score (this directly tests the #1 bet during WoZ) [source: https://www.omarimc.com/simply-piano-vs-yousician-vs-flowkey-review/] | Competitor + Engine | After test, before launch |
| **10** | On GO: build the renderer (Mediabunny + WebCodecs + OffscreenCanvas Worker, 720x1280/30fps, H.264+AAC MP4); hold Remotion Lambda (~$0.001-0.02/clip + ~$100/mo license) as Phase-2 iOS/batch fallback [source: https://mediabunny.dev/guide/introduction] [source: https://www.remotion.dev/docs/lambda/cost-example] | Engine | Gated on test PASS |

### Sequencing logic and the iOS caveat

The order is driven by dependency, not preference: Reddit seeding (#3) has the longest lead time so it starts first; the gate (#1) must be locked before any clip posts so virality doesn't self-deceive; the renderer (#10) is last and conditional because it is the most expensive build and the test exists precisely to gate it. Phase 0 curriculum (#8) is fully parallel because the literature already de-risked it.

One structural constraint shapes all of this: Web MIDI does not work on iOS Safari (Apple blocks it by policy), so the capture mechanic is dead on iOS web until the Phase-2 native shell ships [source: https://caniuse.com/midi] [source: https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API]. This creates a capture-vs-distribution split: the loudest short-form audience (TikTok/IG) is iOS-heavy, but those viewers hit a dead end on the web-only product. Note this in the WoZ analysis so iOS-driven drop-off isn't misread as the clip format failing.

---

Files referenced for wiki context: `/Users/michael/Documents/Wiki/index.md`, `/Users/michael/Documents/Wiki/CLAUDE.md` (project structure only; this section draws entirely from the provided corpus, not existing wiki pages).
