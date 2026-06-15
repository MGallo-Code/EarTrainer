## By-Ear Teaching Curriculum & Retention

Loop's curriculum is not the moat (the cadence-primed scale-degree drill is commoditized and free across 5+ apps: TonedEar, ToneSavvy, ToneGym, Musical U, PitchFit [source: https://tonedear.com/ear-training/functional-solfege-scale-degrees]), but it is table stakes that must be correct. The good news: a strong, convergent literature consensus exists, so Loop can ship a near-verbatim level ladder and spend its novelty budget on the duet loop instead. Every parameter below is grounded in functional-method pedagogy (Benbassat, Arnold) and the two market-leading academic apps (EarMaster, Auralia).

### The Level Ladder (ship this spine)

The convergent sequence across Benbassat's Functional Ear Trainer, Bruce Arnold's "Ear Training One Note" (required text at NYU and Princeton [source: https://www.amazon.com/Ear-Training-Note-Complete-Method/dp/1890944475]), EarMaster, and Auralia is a single ladder Loop can adopt directly.

| Tier | Skill | Sequencing rule | Grounding |
|------|-------|-----------------|-----------|
| 1 | Scale degrees | I-IV-V-I cadence, then a single note to ID by function. Start with **tonic alone** in random keys, master before adding any other degree; introduce degrees 2-7 **one at a time**; then add chromatics in major+minor. Octave/key/mode randomize freely (function is invariant). | Benbassat method [source: https://advancingmusician.com/functional-ear-training/]; the canonical cadence is specifically I-IV-V-I, not "any short progression" |
| 2 | Short melodies | Stepwise diatonic fragments, 3-5 notes | University melodic-dictation pedagogy [source: https://apcentral.collegeboard.org/courses/ap-music-theory/classroom-resources/sight-singing-your-key-success-melodic-dictation] |
| 3 | Melodic dictation | Add leaps, then length. Raise the 4 difficulty knobs (pitch motion, rhythm, harmonic implication, length) **one at a time** | Order: stepwise -> few leaps -> longer -> chromatic [source: https://apcentral.collegeboard.org/courses/ap-music-theory/classroom-resources/sight-singing-your-key-success-melodic-dictation] |
| 4 | Intervals in context | Notes/intervals recognized key-relative, never as isolated interval distances | Arnold's contextual approach [source: https://www.amazon.com/Ear-Training-Note-Complete-Method/dp/1890944475] |
| 5 | Chords & progressions | Single-chord-quality recognition, then progression recognition. Make **I-V-vi-IV (the Axis progression)** a high-value early target since it underpins most pop songs | Interval -> chord quality -> progression [source: https://www.learnjazzstandards.com/blog/learning-jazz/ear-training/ear-training-chord-progressions/] |
| 6 | Full song / layer by ear | Hear the melody/head first -> optionally hum/sing it -> play the layer in MIDI **phrase-by-phrase** -> verify. Start on short (1-3 chorus), clear, simple-form material (blues, 8-16 bar pop loops); learn heads before solos | Jazz transcription method [source: https://mattmrosphere.com/2024/06/04/beginners-5-step-guide-to-transcribing-solos/] |

Map Tiers onto Arnold's clean 3-tier macro-structure (Beginning / Intermediate / Advanced [source: https://www.amazon.com/Ear-Training-Note-Complete-Method/dp/1890944475]) for world/section layout. EarMaster confirms the production pattern of "many small graded lessons grouped into themed modules" (its RCM Voice course is 500 exercises across 63 chapters, ~6-7 per level [source: https://www.earmaster.com/products/ear-training-sight-singing/earmaster-software.html]) and Auralia confirms the same 5 trainable axes via 59 topics in 7 groups [source: https://www.risingsoftware.com/auralia/topics]. Optionally align Loop's tiers to ABRSM Aural 1-5 / RCM grades (as EarMaster does) so adult self-learners get legible "I'm at Grade 3" progress signaling [source: https://www.earmaster.com/products/ear-training-sight-singing/earmaster-software.html].

**One correction the corpus flags:** the structured "introduce chords I, V, vi, IV one at a time, 2-chord -> 3-chord -> 4-chord" ladder is *not* prescribed by the Learn Jazz Standards source (verdict: refuted). That source's actual method is interval recognition -> single-chord-quality recognition -> progression recognition [source: https://www.learnjazzstandards.com/blog/learning-jazz/ear-training/ear-training-chord-progressions/]. Use the interval->quality->progression order as the citable spine; treat I-V-vi-IV as a genuinely ubiquitous high-payoff target to lead with, not as a documented "canonical first."

### Interleaved Rhythm

- **Train rhythm and pitch in isolation first, then combine.** Ship a separate rhythm-only dictation track in parallel with the pitch track; only fuse them at higher tiers [source: https://apcentral.collegeboard.org/courses/ap-music-theory/classroom-resources/sight-singing-your-key-success-melodic-dictation].
- **Constrain every dictation pool to already-mastered material** ("what we sing is what we write," a Kodaly-influenced principle): never test a degree or rhythm in dictation that the user hasn't passed in isolation [source: https://apcentral.collegeboard.org/courses/ap-music-theory/classroom-resources/sight-singing-your-key-success-melodic-dictation].
- **Rhythm-first for the polyphonic duet.** Loop's multi-layer mechanic is polyphonic by definition. Beckett (1997), "Directing Student Attention during Two-Part Dictation" (n=60), found rhythm-first attention produced significantly higher rhythm accuracy, while pitch-first produced *no* matching pitch gain. Rhythm-first is the only direction with a proven benefit [source: https://journals.sagepub.com/doi/10.2307/3345426]. **Implementable now:** Loop's MIDI capture already yields exact onsets, so grade rhythm and pitch as *separate sub-scores* per layer and scaffold "lock the rhythm first" when a user adds a layer over existing ones.

### Mastery Gating

- **Streak-based gate, not a single pass.** The functional method's explicit rule: require ~90-100% accuracy sustained "for a few days in a row" before unlocking the next degree/level [source: https://advancingmusician.com/functional-ear-training/]. This prevents premature progression that kills by-ear confidence.
- **Escape valve required.** A strict 90-100% streak gate risks stalling casual adult users (Loop's beachhead posts to TikTok for fun). Add a "skip ahead / practice mode" so gating doesn't drive churn (corpus risk).
- **Interleave on top of linear unlock.** After mastering a level, periodically re-inject earlier degrees/intervals/chords. The clarinetist study (n=10) showed blocked-practice gains *declined* Day 1->Day 2 (p=0.02) while interleaved practice held [source: https://pmc.ncbi.nlm.nih.gov/articles/PMC4989027]. UX warning: interleaving feels harder in-session, so don't tune levels to "feels-easy" fluency, and frame it or it reads as "the app got worse."

### The Retention Engine

**Scheduler choice: Leitner now, FSRS next.**

| Phase | Scheduler | Why |
|-------|-----------|-----|
| Phase 0/1 (no data yet) | **Leitner box** (3-5 boxes; correct promotes, wrong drops to Box 1) | Trivial to implement, needs zero training data. Day intervals are implementation-defined (e.g. Box 1 daily / Box 2 ~3 days / Box 3 ~5 days is one valid config, not canonical) [source: https://e-student.org/leitner-system/] |
| Phase 2+ (have grade+timing history) | **FSRS** (open-source Python/Rust optimizer, the Anki default) | Lower log-loss than SM-2 for ~99.5% of users; ~20-30% fewer reviews at equal retention (simulation, not RCT) [source: https://deepwiki.com/open-spaced-repetition/fsrs-optimizer/7.3-comparison-with-sm-2] |

Adopt the FSRS optimizer rather than building a scheduler. FSRS-6 uses a 3-variable DSR model (Difficulty 1-10, Stability = days until 90% recall, Retrievability = current recall prob) with 21 trainable parameters [source: https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm]. **Schedule at the item level** - each scale degree / interval / chord-in-key is its own card with its own DSR state, not per-session.

**Desired retention: set 0.85-0.88, not 0.90+.** Desired retention is FSRS's single most important setting; the cost curve is nonlinear, so 90% -> 95% roughly *doubles* daily review burden and >97% becomes overwhelming [source: https://expertium.github.io/Retention.html]. For Loop's casual adults who quit when overloaded, lean low to keep sessions short.

**Adaptive difficulty: the 85% Rule.** Hold live drill difficulty so the learner succeeds ~85% / fails ~15.87% - the mathematically optimal training accuracy (Wilson et al., *Nature Communications* 2019) [source: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6831579/]. This is the single difficulty knob and doubles as the "too hard -> quit" cliff guard. Scope caveat: the 85% figure is derived for gradient-descent learners, so use it as a heuristic - but it converges with the 80-90% Anki target and Rosenshine's ~82% in top classrooms [source: https://eshapard.github.io/anki/target-an-80-90-percent-success-rate-in-anki.html], which strengthens it.

**Critical split: two engines, not one.** Spacing effects are weak/absent for complex motor/timing skills - a PLOS One piano study found *no* spacing effect for accuracy, key-pressure, or timing [source: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0182986]. Loop grades both *recognition* (functional scale-degree ID) and *motor* (MIDI-exact playing). **SRS-schedule only the recognition items; treat the physical playing-by-ear layer as deliberate practice with immediate feedback.** Do not put scheduled "reviews" on motor skill - it won't help and will feel pointless.

**Session design:** short ~5-10 min daily reps spread across days. The spacing effect rewards distributed over massed practice [source: https://cognitiveresearchjournal.springeropen.com/articles/10.1186/s41235-021-00345-7]; for ear-training, item-level scheduling matters more than session length. Surface a "good place to stop" nudge at ~10 min to respect ear fatigue [source: https://advancingmusician.com/functional-ear-training/].

### Streak & Habit Design (copy Duolingo selectively)

Streaks are Duolingo's single biggest growth driver; 9M+ users hold year-plus streaks and retention flattens then climbs after **day 7**, with the 1->2 day jump being the largest [source: https://x.com/lennysan/status/1868330119833813056]. Obsessively instrument the zero-to-7-day window.

Copy these proven primitives precisely:
- **Two streak freezes** (empirically beat one; three adds nothing) [source: https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks].
- **Free earn-back / streak repair** - a documented retention winner because users feel they earned it back [source: https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks].
- **Commitment-framed CTAs** - Duolingo's "Commit to my goal" beat "Continue," and copy tweaks moved DAU ~5-8% [source: https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth]. (Note: the "Perfect Streak unlocked at day 7" and "+10,000 DAU from one copy change" specifics are unverified per the corpus - use percentage-based copy wins instead.)
- **Leagues lifted learning time 17%** [source: https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth] - but make Loop's social unit the *duet card*, not a solo leaderboard.

**Don't punish a single miss.** Habits take a *mean* ~66 days to form (range 18-254, n=96), and missing a single day does not reduce the chance of forming the habit [source: https://www.surrey.ac.uk/news/does-it-really-take-66-days-form-habit-we-asked-expert-dr-pippa-lally]. The 2-freeze + earn-back design already aligns with this. Set expectations that the habit engine must retain users through a ~2-8 week pre-habit window before practice self-sustains - which directly pressures the subscription-first model to survive that gap.

**Two guardrails:**
1. **Streaks only work atop genuine daily value.** Duolingo's own PM warns streaks "distract from what really matters" if the app isn't worth using daily, and the team keeps a "sanctity of the streak" keeper who blocks even positive experiments that cheapen it [source: https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame]. Loop's defensible line: loss-aversion that creates *real* value (you actually worked out a layer), not anxiety with no benefit. A small team lacks Duolingo's guardrails, so cap reminders and add opt-outs from day one.
2. **Make gamification visible but skippable.** Yousician proves real-time grading + streaks + leaderboards build daily habits [source: https://www.stuff.tv/sponsored/best-piano-learning-apps-2026-how-to-pick-up-the-piano-in-no-time-at-all/], but a chunk of serious adult learners (Loop's exact beachhead) dislike heavy gamification. Offer a lower-noise "serious mode" that keeps SRS scheduling without the loud streak theater.

### Concrete Phase 0 Next Steps

1. **Wrap the existing drill core in the Tier 1 ladder logic:** tonic-only in random keys with the I-IV-V-I cadence, unlock one degree at a time, gated by a 90-100%-over-several-days streak counter plus a skip-ahead escape valve.
2. **Add a Leitner box state per item** (degree/interval/chord-in-key) - 3-5 boxes, wrong resets to Box 1. This is the cheapest possible retention engine and needs no history.
3. **Implement the 85% adaptive-difficulty controller** as the single difficulty knob across the live drill and the review queue.
4. **Split the codebase into recognition (spaced) vs playing (deliberate-practice) paths now**, before either is built out, so motor skill never gets SRS-scheduled.
5. **Emit separate rhythm and pitch sub-scores** from MIDI capture (Loop's MIDI-exact grading makes this free) and scaffold rhythm-first on any layer added over existing layers.
6. **Ship the 2-freeze + free earn-back streak primitive** and instrument the day-0-to-7 funnel as the top retention metric. Cap reminders, add opt-out.
7. **Defer FSRS** until per-user grade+timing logs exist; the Leitner -> FSRS swap is the planned upgrade.

**Open risk to validate in playtesting:** no public source gives the exact per-level note counts, ranges, or tempos for Functional Ear Trainer or EarMaster, so Loop's specific level boundaries must be set and tuned by its own playtesting, not copied [source: https://advancingmusician.com/functional-ear-training/].
