"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../core.js");

// ---------- triads ----------
test("triad: major/minor/diminished semitone shapes", () => {
  assert.deepEqual(C.triad(60, "maj"), [60, 64, 67]); // C E G
  assert.deepEqual(C.triad(60, "min"), [60, 63, 67]); // C Eb G
  assert.deepEqual(C.triad(60, "dim"), [60, 63, 66]); // C Eb Gb
});

// ---------- diatonic theory ----------
test("diatonicQuality: I-vii qualities in major", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(C.diatonicQuality),
    ["maj", "min", "min", "maj", "maj", "min", "dim"]);
});

test("romanNumeral: I ii iii IV V vi vii°", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(C.romanNumeral),
    ["I", "ii", "iii", "IV", "V", "vi", "vii°"]);
});

test("diatonicTriad: correct pitch-class sets in C major", () => {
  const expect = {
    0: [0, 4, 7],   // I  C E G
    1: [2, 5, 9],   // ii D F A
    2: [4, 7, 11],  // iii E G B
    3: [0, 5, 9],   // IV F A C
    4: [2, 7, 11],  // V  G B D
    5: [0, 4, 9],   // vi A C E
    6: [2, 5, 11]   // vii B D F
  };
  for (let deg = 0; deg <= 6; deg++) {
    assert.deepEqual(C.pcSet(C.diatonicTriad(60, deg)), expect[deg], "degree " + deg);
  }
});

test("diatonicTriad: vii is a diminished triad (root-relative [0,3,6])", () => {
  const notes = C.diatonicTriad(60, 6); // B D F
  const root = notes[0];
  assert.deepEqual(notes.map(n => n - root), [0, 3, 6]);
});

test("diatonicTriad: transposes correctly to G major (V = D major triad)", () => {
  // G major, degree 4 (V) -> D major triad: D F# A => pcs {2,6,9}
  assert.deepEqual(C.pcSet(C.diatonicTriad(67, 4)), [2, 6, 9]);
});

test("axisChords: I-V-vi-IV in C major", () => {
  const ch = C.axisChords(60).map(C.pcSet);
  assert.deepEqual(ch, [
    [0, 4, 7],  // I  C
    [2, 7, 11], // V  G
    [0, 4, 9],  // vi Am
    [0, 5, 9]   // IV F
  ]);
});

// ---------- gradeChord (pitch-class set, inversion/octave tolerant) ----------
test("gradeChord: exact root-position triad is correct", () => {
  assert.equal(C.gradeChord([60, 64, 67], [60, 64, 67]).correct, true);
});
test("gradeChord: first inversion of the same triad is correct", () => {
  // C major first inversion E-G-C
  assert.equal(C.gradeChord([64, 67, 72], [60, 64, 67]).correct, true);
});
test("gradeChord: octave doubling of chord tones is correct", () => {
  assert.equal(C.gradeChord([60, 64, 67, 72], [60, 64, 67]).correct, true);
});
test("gradeChord: a missing chord tone is incorrect", () => {
  assert.equal(C.gradeChord([60, 64], [60, 64, 67]).correct, false);
});
test("gradeChord: an extra non-chord tone is incorrect", () => {
  assert.equal(C.gradeChord([60, 64, 67, 62], [60, 64, 67]).correct, false);
});
test("gradeChord: major vs minor are distinguished", () => {
  assert.equal(C.gradeChord([60, 63, 67], [60, 64, 67]).correct, false);
});

// ---------- gradeProgression (ordered) ----------
test("gradeProgression: correct order, inversion-tolerant per chord", () => {
  const target = C.axisChords(60);
  const played = target.map(ch => ch.map(n => n + 12)); // all up an octave
  const r = C.gradeProgression(played, target);
  assert.equal(r.allCorrect, true);
  assert.deepEqual(r.marks, [true, true, true, true]);
});
test("gradeProgression: wrong order fails the swapped chords", () => {
  const target = C.axisChords(60);                 // I V vi IV
  const played = [target[1], target[0], target[2], target[3]]; // V I vi IV
  const r = C.gradeProgression(played, target);
  assert.equal(r.allCorrect, false);
  assert.deepEqual(r.marks, [false, false, true, true]);
});
test("gradeProgression: missing chords are incorrect, not a crash", () => {
  const target = C.axisChords(60);
  const r = C.gradeProgression([target[0]], target);
  assert.deepEqual(r.marks, [true, false, false, false]);
});

// ---------- groupNotesByGap (chord capture rule) ----------
test("groupNotesByGap: near-simultaneous notes form one chord", () => {
  const ev = [{ note: 60, t: 0 }, { note: 64, t: 10 }, { note: 67, t: 20 }];
  assert.deepEqual(C.groupNotesByGap(ev, 75), [[60, 64, 67]]);
});
test("groupNotesByGap: a slow arpeggio splits into separate notes", () => {
  const ev = [{ note: 60, t: 0 }, { note: 64, t: 100 }, { note: 67, t: 200 }];
  assert.deepEqual(C.groupNotesByGap(ev, 75), [[60], [64], [67]]);
});
test("groupNotesByGap: two chords separated by a gap", () => {
  const ev = [
    { note: 60, t: 0 }, { note: 64, t: 10 }, { note: 67, t: 20 },
    { note: 67, t: 400 }, { note: 71, t: 410 }, { note: 74, t: 420 }
  ];
  assert.deepEqual(C.groupNotesByGap(ev, 75), [[60, 64, 67], [67, 71, 74]]);
});
test("groupNotesByGap: repeated note numbers within a chord are deduped", () => {
  const ev = [{ note: 60, t: 0 }, { note: 60, t: 10 }, { note: 64, t: 20 }];
  assert.deepEqual(C.groupNotesByGap(ev, 75), [[60, 64]]);
});

// ---------- empty-target grading guards ----------
test("gradeChord: empty target is not vacuously correct", () => {
  assert.equal(C.gradeChord([], []).correct, false);
  assert.equal(C.gradeChord([60], []).correct, false);
});
test("gradeProgression: empty target is not vacuously correct", () => {
  assert.equal(C.gradeProgression([], []).allCorrect, false);
});

// ---------- foldToRange (out-of-range chord tones for display) ----------
test("foldToRange: folds notes above the range down by octaves", () => {
  // high diatonic/axis tones (e.g. 85, 88) fold into the 60..83 keyboard
  assert.equal(C.foldToRange(85, 60, 83), 73);
  assert.equal(C.foldToRange(88, 60, 83), 76);
});
test("foldToRange: folds notes below the range up, leaves in-range untouched", () => {
  assert.equal(C.foldToRange(55, 60, 83), 67);
  assert.equal(C.foldToRange(67, 60, 83), 67);
});
test("foldToRange: preserves pitch class", () => {
  for (let m = 40; m <= 100; m++) {
    assert.equal(C.pc(C.foldToRange(m, 60, 83)), C.pc(m));
  }
});
