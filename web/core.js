/* Loop - core music/logic (pure, no DOM/audio/MIDI).
 * Shared by the browser app (window.LoopCore) and Node tests (module.exports).
 * Everything here is deterministic given its inputs (rng is injectable), so it is
 * unit-testable. DOM/audio/MIDI glue stays in app.js.
 */
(function (factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.LoopCore = api;
})(function () {
  "use strict";

  // ---------- constants ----------
  var NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var DEGREE_LABEL = { 0: "1", 2: "2", 4: "3", 5: "4", 7: "5", 9: "6", 11: "7", 12: "1↑" };
  var SOLFEGE = { 0: "Do", 2: "Re", 4: "Mi", 5: "Fa", 7: "Sol", 9: "La", 11: "Ti", 12: "Do↑" };
  var MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11]; // semitone offsets of scale degrees 1..7
  var MAJOR_KEYS = [0, 2, 4, 5, 7, 9, 11];
  var KEYBOARD_LOW = 60;   // C4
  var KEYBOARD_HIGH = 83;  // B5

  // ---------- pitch utils ----------
  function pc(m) { return ((m % 12) + 12) % 12; }                 // pitch class 0..11
  function noteName(m) { return NOTE_NAMES[pc(m)]; }
  function isBlack(m) { var p = pc(m); return p === 1 || p === 3 || p === 6 || p === 8 || p === 10; }
  function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function degreeLabel(deg) { return DEGREE_LABEL.hasOwnProperty(deg) ? DEGREE_LABEL[deg] : null; }
  function solfege(deg) { return SOLFEGE.hasOwnProperty(deg) ? SOLFEGE[deg] : null; }

  // ---------- generation (rng injectable for determinism in tests) ----------
  // Returns an array of scale-degree semitone offsets (caller maps to MIDI with a tonic).
  function generateMelodyDegrees(degrees, length, leaps, rng) {
    rng = rng || Math.random;
    var degs = degrees.slice();
    var seq = [];
    var idx = Math.floor(rng() * degs.length);
    seq.push(degs[idx]);
    for (var n = 1; n < length; n++) {
      if (leaps) {
        var ni = idx;
        while (ni === idx) ni = Math.floor(rng() * degs.length); // avoid immediate repeat
        idx = ni;
      } else {
        var dir = rng() < 0.5 ? -1 : 1; // stepwise: adjacent index, clamped
        if (idx + dir < 0) dir = 1;
        if (idx + dir > degs.length - 1) dir = -1;
        idx = idx + dir;
      }
      seq.push(degs[idx]);
    }
    return seq;
  }

  // ---------- Leitner spaced repetition ----------
  function leitnerWeights(degrees, boxes, maxBox) {
    return degrees.map(function (d) { return (maxBox + 1) - ((boxes && boxes[d]) || 1); });
  }
  function pickWeighted(items, weights, rng) {
    rng = rng || Math.random;
    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var r = rng() * total;
    for (var i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
  function promoteBox(box, correct, maxBox) {
    box = box || 1;
    return correct ? Math.min(box + 1, maxBox) : 1;
  }

  // ---------- mastery ----------
  function rollingAccuracy(recent, win) {
    if (!recent || !recent.length) return null;
    var w = recent.slice(-win);
    var c = w.filter(Boolean).length;
    return c / w.length;
  }
  function isDegreeMastered(boxes, degrees, masterBox) {
    for (var i = 0; i < degrees.length; i++) {
      if (((boxes && boxes[degrees[i]]) || 1) < masterBox) return false;
    }
    return true;
  }
  function degreeMasteryFraction(boxes, degrees, masterBox) {
    if (!degrees.length) return 0;
    var sum = 0;
    for (var i = 0; i < degrees.length; i++) {
      var b = Math.min((boxes && boxes[degrees[i]]) || 1, masterBox);
      sum += (b - 1) / (masterBox - 1); // box 1 = 0%, box masterBox = 100%
    }
    return sum / degrees.length;
  }
  function isSeqMastered(recent, win, acc, minAttempts) {
    if (!recent || recent.length < minAttempts) return false;
    return rollingAccuracy(recent, win) >= acc;
  }
  function seqMasteryFraction(recent, win, acc, minAttempts) {
    if (!recent || !recent.length) return 0;
    var a = rollingAccuracy(recent, win);
    var attemptFactor = Math.min(recent.length / minAttempts, 1);
    return Math.min(a / acc, 1) * attemptFactor;
  }

  // ---------- grading (notes / melodies) ----------
  function gradeNote(played, target) {
    if (played == null) return { correct: false, exact: false };
    return { correct: pc(played) === pc(target), exact: played === target };
  }
  // Compares a played sequence against the target by pitch class (octave-tolerant).
  function gradeSequence(played, target) {
    var marks = [], allCorrect = true, anyOctaveOff = false;
    for (var i = 0; i < target.length; i++) {
      var g = gradeNote(played[i], target[i]);
      marks.push(g.correct);
      if (g.correct && !g.exact) anyOctaveOff = true;
      if (!g.correct) allCorrect = false;
    }
    return { allCorrect: allCorrect, marks: marks, anyOctaveOff: anyOctaveOff };
  }

  return {
    NOTE_NAMES: NOTE_NAMES, DEGREE_LABEL: DEGREE_LABEL, SOLFEGE: SOLFEGE,
    MAJOR_SCALE: MAJOR_SCALE, MAJOR_KEYS: MAJOR_KEYS,
    KEYBOARD_LOW: KEYBOARD_LOW, KEYBOARD_HIGH: KEYBOARD_HIGH,
    pc: pc, noteName: noteName, isBlack: isBlack, midiToFreq: midiToFreq,
    degreeLabel: degreeLabel, solfege: solfege,
    generateMelodyDegrees: generateMelodyDegrees,
    leitnerWeights: leitnerWeights, pickWeighted: pickWeighted, promoteBox: promoteBox,
    rollingAccuracy: rollingAccuracy, isDegreeMastered: isDegreeMastered,
    degreeMasteryFraction: degreeMasteryFraction, isSeqMastered: isSeqMastered,
    seqMasteryFraction: seqMasteryFraction,
    gradeNote: gradeNote, gradeSequence: gradeSequence
  };
});
