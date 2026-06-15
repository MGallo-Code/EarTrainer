"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../core.js");

// deterministic rng that replays a fixed list of values
function seqRng(values) { let i = 0; return () => values[i++ % values.length]; }

// ---------- pitch utils ----------
test("pc wraps into 0..11 including negatives and octaves", () => {
  assert.equal(C.pc(60), 0);
  assert.equal(C.pc(61), 1);
  assert.equal(C.pc(72), 0);
  assert.equal(C.pc(-1), 11);
});

test("noteName maps pitch class to name", () => {
  assert.equal(C.noteName(60), "C");
  assert.equal(C.noteName(61), "C#");
  assert.equal(C.noteName(71), "B");
});

test("isBlack identifies accidentals", () => {
  assert.equal(C.isBlack(60), false); // C
  assert.equal(C.isBlack(61), true);  // C#
  assert.equal(C.isBlack(66), true);  // F#
  assert.equal(C.isBlack(65), false); // F
});

test("midiToFreq: A4 = 440Hz, C4 ~ 261.63Hz", () => {
  assert.ok(Math.abs(C.midiToFreq(69) - 440) < 1e-6);
  assert.ok(Math.abs(C.midiToFreq(60) - 261.6256) < 0.01);
});

// ---------- gradeNote ----------
test("gradeNote: exact match is correct and exact", () => {
  assert.deepEqual(C.gradeNote(60, 60), { correct: true, exact: true });
});
test("gradeNote: same pitch class different octave is correct but not exact", () => {
  assert.deepEqual(C.gradeNote(72, 60), { correct: true, exact: false });
});
test("gradeNote: wrong pitch class is incorrect", () => {
  assert.equal(C.gradeNote(61, 60).correct, false);
});
test("gradeNote: missing input is incorrect, not a crash", () => {
  assert.deepEqual(C.gradeNote(undefined, 60), { correct: false, exact: false });
});

// ---------- gradeSequence ----------
test("gradeSequence: all correct", () => {
  const r = C.gradeSequence([60, 62, 64], [60, 62, 64]);
  assert.equal(r.allCorrect, true);
  assert.deepEqual(r.marks, [true, true, true]);
  assert.equal(r.anyOctaveOff, false);
});
test("gradeSequence: octave-off counts correct but flags anyOctaveOff", () => {
  const r = C.gradeSequence([72, 62, 64], [60, 62, 64]);
  assert.equal(r.allCorrect, true);
  assert.equal(r.anyOctaveOff, true);
});
test("gradeSequence: one wrong note marks that position false", () => {
  const r = C.gradeSequence([60, 63, 64], [60, 62, 64]);
  assert.equal(r.allCorrect, false);
  assert.deepEqual(r.marks, [true, false, true]);
});
test("gradeSequence: too-few notes fails the missing positions", () => {
  const r = C.gradeSequence([60], [60, 62]);
  assert.equal(r.allCorrect, false);
  assert.deepEqual(r.marks, [true, false]);
});

// ---------- generateMelodyDegrees ----------
test("generateMelodyDegrees: stepwise stays adjacent within the degree set", () => {
  const degrees = [0, 2, 4, 5, 7, 9, 11];
  for (let iter = 0; iter < 200; iter++) {
    const seq = C.generateMelodyDegrees(degrees, 4, false);
    assert.equal(seq.length, 4);
    for (const d of seq) assert.ok(degrees.includes(d), "degree in set");
    for (let i = 1; i < seq.length; i++) {
      const a = degrees.indexOf(seq[i - 1]);
      const b = degrees.indexOf(seq[i]);
      assert.equal(Math.abs(a - b), 1, "consecutive notes are adjacent steps");
    }
  }
});
test("generateMelodyDegrees: leaps never immediately repeat a degree", () => {
  const degrees = [0, 2, 4, 5, 7, 9, 11];
  for (let iter = 0; iter < 200; iter++) {
    const seq = C.generateMelodyDegrees(degrees, 4, true);
    assert.equal(seq.length, 4);
    for (const d of seq) assert.ok(degrees.includes(d));
    for (let i = 1; i < seq.length; i++) assert.notEqual(seq[i], seq[i - 1]);
  }
});
test("generateMelodyDegrees: deterministic with injected rng", () => {
  // rng: first pick idx 0; then dir>=0.5 => +1 each step
  const seq = C.generateMelodyDegrees([0, 2, 4, 5], 3, false, seqRng([0, 0.9, 0.9]));
  assert.deepEqual(seq, [0, 2, 4]);
});

// ---------- Leitner ----------
test("leitnerWeights: lower box gets higher weight", () => {
  assert.deepEqual(C.leitnerWeights([0, 7], { 0: 1, 7: 4 }, 5), [5, 2]);
});
test("leitnerWeights: missing box defaults to 1 (max weight)", () => {
  assert.deepEqual(C.leitnerWeights([0], {}, 5), [5]);
});
test("promoteBox: correct increments and caps at maxBox", () => {
  assert.equal(C.promoteBox(1, true, 5), 2);
  assert.equal(C.promoteBox(4, true, 5), 5);
  assert.equal(C.promoteBox(5, true, 5), 5);
  assert.equal(C.promoteBox(undefined, true, 5), 2);
});
test("promoteBox: wrong answer resets to box 1", () => {
  assert.equal(C.promoteBox(4, false, 5), 1);
});
test("pickWeighted: respects weights and skips zero-weight items", () => {
  assert.equal(C.pickWeighted(["a", "b"], [3, 1], () => 0), "a");
  assert.equal(C.pickWeighted(["a", "b"], [3, 1], () => 0.99), "b");
  assert.equal(C.pickWeighted(["a", "b", "c"], [0, 1, 0], () => 0.5), "b");
});

// ---------- mastery ----------
test("rollingAccuracy: fraction over the trailing window", () => {
  assert.equal(C.rollingAccuracy([true, false, true, true], 10), 0.75);
  assert.equal(C.rollingAccuracy([false, false, true], 2), 0.5); // last 2 only
  assert.equal(C.rollingAccuracy([], 10), null);
});
test("isDegreeMastered: all items must reach masterBox", () => {
  assert.equal(C.isDegreeMastered({ 0: 4, 7: 4 }, [0, 7], 4), true);
  assert.equal(C.isDegreeMastered({ 0: 4, 7: 3 }, [0, 7], 4), false);
  assert.equal(C.isDegreeMastered({}, [0], 4), false);
});
test("degreeMasteryFraction: box 1 = 0%, masterBox = 100%, capped", () => {
  assert.equal(C.degreeMasteryFraction({ 0: 1 }, [0], 4), 0);
  assert.equal(C.degreeMasteryFraction({ 0: 4 }, [0], 4), 1);
  assert.ok(Math.abs(C.degreeMasteryFraction({ 0: 2 }, [0], 4) - 1 / 3) < 1e-9);
  assert.equal(C.degreeMasteryFraction({ 0: 5 }, [0], 4), 1); // capped at masterBox
});
test("isSeqMastered: needs min attempts AND accuracy at/above threshold", () => {
  const nine = Array(10).fill(true); nine[0] = false; // 9/10
  assert.equal(C.isSeqMastered(nine, 10, 0.85, 10), true);
  const eight = Array(10).fill(true); eight[0] = false; eight[1] = false; // 8/10
  assert.equal(C.isSeqMastered(eight, 10, 0.85, 10), false);
  assert.equal(C.isSeqMastered(Array(5).fill(true), 10, 0.85, 10), false); // too few
});
test("seqMasteryFraction: scales by accuracy and attempt count", () => {
  assert.equal(C.seqMasteryFraction([], 10, 0.85, 10), 0);
  assert.equal(C.seqMasteryFraction(Array(10).fill(true), 10, 0.85, 10), 1);
  assert.ok(Math.abs(C.seqMasteryFraction(Array(5).fill(true), 10, 0.85, 10) - 0.5) < 1e-9);
});
