# Loop - Phase 0 Prototype (web)

A dependency-free web prototype of the functional play-by-ear trainer described in
[../research/01-the-wedge.md](../research/01-the-wedge.md).

**What it does:** establishes a key with a I-IV-V-I cadence, plays a target note,
and you find it by ear and play it back. It grades your answer by scale degree using
Web MIDI (or the on-screen / computer keyboard if you have no MIDI device).

This is the seed of "Phase 0 - the drill core." It deliberately does NOT include the
duet/record/layer/share loop yet; that is the "existential bet" gated behind the
[validation test](../research/13-validation-test-plan.md).

## Run it

```bash
cd web
python3 -m http.server 8123
# then open http://localhost:8123
```

Use Chrome or Edge for MIDI keyboard support (Safari does not support Web MIDI). No
keyboard? Click the on-screen keys or use computer keys `A W S E D F T G Y H U J K`.

## Stack notes (from the research)
- **Web MIDI** for zero-latency, polyphonic-exact input (no mic guessing).
- Built-in **Web Audio** synth for sound in this prototype; the planned upgrade is
  **smplr `SplendidGrandPiano`** (MIT) so clips sound good enough to share.
- Grading is **functional** (scale degree in key context), which the pedagogy
  research favors over isolated-interval drills.

## Known limits (intentional for Phase 0)
- Single notes only (no melodies/chords yet).
- Synth sound, not sampled piano.
- No accounts, no streaks-across-sessions, no duet loop.
- iOS needs a native WebView+CoreMIDI shell later (the iOS Web MIDI gap is the
  hardware wedge).
