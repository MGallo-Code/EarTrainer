# Loop - Phase 0 Build Notes & Research Map

Last updated: 2026-06-15

This maps every implemented mechanic to its research source, and flags what still
needs our own playtesting/decisions. It is the "noting all required research" log.
Research lives in `../research/` and `../research/execution/`.

## What this build is

The de-risked Phase 0 "drill core": functional, play-it-back ear training with a
real curriculum, spaced repetition, and adaptive difficulty. This ships regardless
of the duet/validation-test outcome (the curriculum science is settled; the duet
loop is the separate, gated bet). See `../research/execution/05-integrated-plan.md`.

## Implemented mechanics -> research source

| Mechanic | What we built | Grounded in |
|---|---|---|
| Functional ear training | Cadence (I-IV-V-I) primes the key before every item; grade by scale degree | `execution/03-curriculum.md`, `execution/05-integrated-plan.md` (Benbassat functional method; tonal context aids recognition) |
| Level ladder | Tonic -> +Dominant -> Do-Re-Mi -> Pentatonic -> Full scale -> 3-note melodies -> 4-note + leaps | `execution/05` step ladder: degrees one at a time -> stepwise melodies -> dictation with leaps |
| Spaced repetition | Leitner box system (boxes 1-5), low boxes reviewed more often | `execution/05`: "ship Leitner now (no training data needed); upgrade to FSRS once per-user history exists" |
| Adaptive difficulty | 85% Rule: rolling accuracy target band; level mastery gated near ~85% | `execution/05`: 85% Rule (~85% success) as the single difficulty knob; converges with Anki 80-90%, Rosenshine ~82% |
| Mastery gating | Degree level mastered when all degree-items reach box >=4; melody level at >=85% over last 10 | `execution/03` mastery gating; `execution/05` 85% rule |
| Grade on input timing | Grade against the player's actual key event, not the synth callback | `execution/05`: grade against Web MIDI `event.timeStamp`, NEVER smplr `onStart` (fires ~200ms early) |
| Rhythm-before-pitch (noted) | Melody grading is pitch-sequence for now; rhythm sub-score is a TODO | `execution/05`: scaffold/grade rhythm first, then pitch (only direction with proven gain) |
| Progress persistence | localStorage per level (boxes, attempts, rolling results) | Habit/retention (streaks, continuity) - `execution/03` retention |
| 2-octave input | Computer keys now span both rendered octaves (Z-row lower, Q-row upper) | UX consistency fix (the rendered keyboard is 2 octaves) |
| Sampled piano sound | smplr SplendidGrandPiano (Steinway, MIT) via esm.sh, loads on first Start, with synth fallback when offline | `research/05-tech-web-mvp.md` (smplr SplendidGrandPiano, 4 velocity layers, MIT) |

## Decisions made (committing, per "you take the reins")

- **Leitner now, not FSRS.** FSRS needs per-user grade+timing history we do not have
  yet. Leitner is the right Phase 0 choice; FSRS is a later upgrade with desired
  retention 0.85-0.88. (`execution/05`)
- **Grade by pitch class (octave-tolerant).** Functional recognition = right scale
  degree in any octave. Exact-octave is noted in feedback but not required.
- **Chords / full-song-by-ear deferred.** Levels stop at melodies for Phase 0;
  chord input/grading and the transcription flow are the next content tranche.

## Open questions / required research & playtesting (NOT yet resolved)

These are flagged by the research itself as undocumented and needing our own tuning
(expect 5-10 rounds per the dev process):

1. **Per-level note counts, ranges, tempos.** `execution/10-critique.md`: "no public
   source gives per-level note counts, ranges, or tempos" - every level boundary and
   pacing decision is ours to playtest. Current values are first-guess defaults.
2. **Mastery thresholds.** Box>=4 and 85%-over-10 are reasonable starting points, not
   validated for this domain. Tune against real retention.
3. **Rhythm grading for melodies.** Deferred. Needs a timing-capture design that works
   for click/computer input (MIDI gives clean timestamps; mouse/keys are noisier).
4. **FSRS upgrade.** When we have per-user history, swap Leitner -> FSRS.
5. **smplr sound - DONE (2026-06-15).** smplr SplendidGrandPiano (Steinway, MIT) wired
   in via esm.sh with a synth fallback when samples can't load. Loads on first Start.
   Open: pin a version and self-host samples for offline/iOS reliability later.
6. **Cold-start, copyright, iOS, unit economics.** Product-level risks from
   `execution/10-critique.md` - out of scope for the drill core, tracked for the duet
   loop and business model.

## Update (2026-06-15): chords + test infrastructure

- **Pure logic extracted to `core.js`** (works in browser + Node) so it is unit-testable;
  `app.js` is now DOM/audio/MIDI glue that calls it.
- **Harmony extension (L13-L16):** 50s progression (I-vi-IV-V), 7th-chord quality
  (maj7/dom7/m7/m7b5; dim7 deferred, not diatonic to major), diatonic 7ths (Imaj7-viiø7),
  and ii-V-I (7ths). Progression engine generalized to a `prog` degree-array + `sevenths`
  flag. All theory accuracy-verified (`../research/`) and unit-tested with explicit
  pitch-class sets. 12-bar blues intentionally skipped (too long for playback).
- **Tests: `node --test` (built-in, zero deps).** `npm test` from `web/` runs the suite
  (58 tests): theory (triads, 7th chords, diatonic qualities, Axis), pitch-class-set grading
  (inversion/octave tolerant, extra/missing/dupe, empty-target guard), chord-capture
  grouping, melody generation, Leitner, mastery, octave-fold. UI/integration stays on
  Playwright (no useless DOM-glue unit tests).
- **Chord curriculum (L8-L12)** added per the verified accuracy run
  (`../research/chords/` decisions): triad quality -> primary chords -> diatonic ->
  +vii° -> Axis progression. Grading by pitch-class set; capture via 75ms MIDI
  trailing-edge debounce + a Submit button for click/computer input; smplr plays chords
  (one `start()` per tone at a shared `time`); `piano.ready` (deprecated `.load` fallback).
- **Code review applied** (multi-agent, adversarial): fixed the orphaned cue-timer
  (round-token guard so a mid-cue level switch can't wedge/crash the UI), octave-folding
  of out-of-range chord tones for highlight, empty-target grading guard, and dedupe
  helpers. Skipped pure-cosmetic nits (inline `noteName` sites, defensive mod-7 guards).

## How to run
```bash
cd ~/Documents/Projects/EarTrainer/web && python3 -m http.server 8123
# open http://localhost:8123  (Chrome/Edge for MIDI)
```

## Test
```bash
cd ~/Documents/Projects/EarTrainer/web && npm test   # node --test, 58 tests
```
