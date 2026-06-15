# Spec: Chord-Recognition Curriculum (Loop Phase 0)

Status: draft 2026-06-15. Open questions resolved by the accuracy-verification run
(see `../research/chords/`). Built on the existing `web/app.js` curriculum engine.

## Objective

Extend the play-by-ear drill core from single notes/melodies to **chords**: hear a
chord (or progression) in an established key, then find and **play it back by ear**.
MIDI-exact, functional, consistent with the existing level/Leitner/85%-rule engine.

Success = a learner can practice triad quality, diatonic chords, and the Axis
progression with the same "hear it -> play it back -> graded" loop, and the new
levels gate/unlock like the existing ones.

## Tech stack

Same as the prototype: dependency-free vanilla JS, Web Audio + Web MIDI, smplr
SplendidGrandPiano (with synth fallback). No new dependencies.

## Scope: new levels (as shipped, appended to L1-L7)

- **L8 - Triad quality:** hear an isolated root-position triad (random root, no key
  cadence), play it back. Major vs minor (diminished deferred/opt-in per the verified
  pedagogy). Item = quality.
- **L9 - Primary chords:** diatonic I, IV, V in the established key. Item = degree.
- **L10 - Diatonic chords:** I, ii, iii, IV, V, vi. Item = degree.
- **L11 - Full diatonic:** adds vii° (diminished enters last). Item = degree.
- **L12 - Axis progression:** hear I-V-vi-IV (4 chords) in the key, play back in order.
  Rolling-accuracy mastery like the melody levels.

L8-L11 use Leitner spaced repetition (per-item boxes); L12 uses rolling accuracy.

## Capture model (the key design decision)

A **chord** = the set of notes entered within a short gap window, finalized by either
(a) no new note for `CHORD_GAP` ms, or (b) a "Submit chord" button.
- Handles MIDI (simultaneous note-ons fall in one window) and click/computer
  (press several keys quickly, or press then Submit).
- A **progression** = an ordered list of chord-sets; finalize N chords then grade.

## Grading

- **Pitch-class set match** (octave-tolerant, voicing/inversion/order independent):
  the set of distinct pitch classes the user plays must equal the target chord's
  pitch-class set. (Confirm inversion-tolerance vs root-position-only in research.)
- Per-chord correctness; progression graded chord-by-chord, in order.
- Score the round once on the first finalized attempt (consistent with existing rule).

## Engine integration

- Reuse Leitner (L8/L9 item boxes), 85%-rule rolling accuracy (L10), mastery gating,
  unlock, persistence, smplr playback (chords = multiple simultaneous `start` calls).
- New level `type: "chord"` (single chord) and `type: "progression"`.

## Code style

Match `app.js`: ES5-ish vanilla, small pure helpers, data-driven `LEVELS`,
`window.__loop` test hooks extended for chord input.

## Testing / verification

- Playwright drive: play correct pitch-class set -> correct; wrong note -> incorrect
  with marks; inversion/octave accepted; progression graded in order; Leitner/unlock;
  smplr chord playback; no regression to degree/melody levels. Console clean.

## Boundaries

- Always: verify music theory + APIs against sources before coding; keep existing
  levels working; grade on captured input timing, not smplr `onStart`.
- Ask first: any new dependency; changing the persistence schema in a breaking way.
- Never: break existing levels; commit without live verification.

## Success criteria (testable)

1. Correct pitch-class set for a heard triad grades correct in any inversion/octave.
2. One wrong note in the triad grades incorrect, with clear per-chord feedback.
3. Axis level plays 4 chords; user plays back 4 chords; graded in order.
4. L8/L9 use Leitner boxes; L10 uses rolling accuracy; mastery unlocks the next level.
5. Chords sound via smplr (synth fallback); no new console errors.
6. Degree and melody levels still pass their existing tests.

## Open questions -> resolved by `../research/chords/` accuracy run

- Inversion-tolerant vs root-position-only grading for early chord levels?
- Pedagogy ordering: quality-first vs function-first; when to add diminished?
- `CHORD_GAP` window value and best practice for grouping simultaneous note-ons.
- smplr chord-playback specifics / gotchas.
