"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../core.js");

test("seventh: chord shapes (semitones from root)", () => {
  assert.deepEqual(C.seventh(60, "maj7"), [60, 64, 67, 71]); // C E G B
  assert.deepEqual(C.seventh(60, "dom7"), [60, 64, 67, 70]); // C E G Bb
  assert.deepEqual(C.seventh(60, "min7"), [60, 63, 67, 70]); // C Eb G Bb
  assert.deepEqual(C.seventh(60, "m7b5"), [60, 63, 66, 70]); // C Eb Gb Bb (half-diminished)
  assert.deepEqual(C.seventh(60, "dim7"), [60, 63, 66, 69]); // C Eb Gb Bbb
});

test("diatonicSeventhQuality: I-vii in major", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(C.diatonicSeventhQuality),
    ["maj7", "min7", "min7", "maj7", "dom7", "min7", "m7b5"]);
});

test("diatonicSeventh: correct pitch-class sets in C major", () => {
  const expect = {
    0: [0, 4, 7, 11],  // Imaj7  C E G B
    1: [0, 2, 5, 9],   // ii7    D F A C
    2: [2, 4, 7, 11],  // iii7   E G B D
    3: [0, 4, 5, 9],   // IVmaj7 F A C E
    4: [2, 5, 7, 11],  // V7     G B D F
    5: [0, 4, 7, 9],   // vi7    A C E G
    6: [2, 5, 9, 11]   // viiø7  B D F A
  };
  for (let deg = 0; deg <= 6; deg++) {
    assert.deepEqual(C.pcSet(C.diatonicSeventh(60, deg)), expect[deg], "degree " + deg);
  }
});

test("diatonicSeventh: V7 is a dominant 7th (root-relative [0,4,7,10])", () => {
  const notes = C.diatonicSeventh(60, 4); // G B D F
  const root = notes[0];
  assert.deepEqual(notes.map(n => n - root), [0, 4, 7, 10]);
});

test("diatonicSeventh: vii is half-diminished (root-relative [0,3,6,10])", () => {
  const notes = C.diatonicSeventh(60, 6); // B D F A
  const root = notes[0];
  assert.deepEqual(notes.map(n => n - root), [0, 3, 6, 10]);
});

test("progressionChords: ii-V-I as triads (pitch-class sets in C)", () => {
  const ch = C.progressionChords(60, [1, 4, 0]).map(C.pcSet);
  assert.deepEqual(ch, [[2, 5, 9], [2, 7, 11], [0, 4, 7]]); // Dm, G, C
});

test("progressionChords: ii-V-I as 7th chords when requested", () => {
  const ch = C.progressionChords(60, [1, 4, 0], true).map(C.pcSet);
  assert.deepEqual(ch, [[0, 2, 5, 9], [2, 5, 7, 11], [0, 4, 7, 11]]); // Dm7, G7, Cmaj7
});

test("progressionChords: axis matches axisChords helper", () => {
  const a = C.progressionChords(60, C.AXIS_DEGREES).map(C.pcSet);
  const b = C.axisChords(60).map(C.pcSet);
  assert.deepEqual(a, b);
});
