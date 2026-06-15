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
  // Fold a note into [lo,hi] by octaves (same pitch class) - for displaying out-of-range chord tones.
  function foldToRange(m, lo, hi) { while (m > hi) m -= 12; while (m < lo) m += 12; return m; }
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

  // ---------- chords / harmony ----------
  // Verified: triad semitone offsets and diatonic qualities (see CHORDS-SPEC.md).
  var TRIAD_INTERVALS = { maj: [0, 4, 7], min: [0, 3, 7], dim: [0, 3, 6] };
  var DIATONIC_QUALITIES = ["maj", "min", "min", "maj", "maj", "min", "dim"]; // I..vii in major
  var ROMAN = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
  var AXIS_DEGREES = [0, 4, 5, 3]; // I-V-vi-IV (degree indices, 0-based)

  function triad(rootMidi, quality) {
    return TRIAD_INTERVALS[quality].map(function (iv) { return rootMidi + iv; });
  }
  function diatonicQuality(degIdx) { return DIATONIC_QUALITIES[((degIdx % 7) + 7) % 7]; }
  function romanNumeral(degIdx) { return ROMAN[((degIdx % 7) + 7) % 7]; }
  // Root-position diatonic triad: stack scale members at indices deg, deg+2, deg+4 (with octave wrap).
  function diatonicTriad(tonicMidi, degIdx) {
    var notes = [];
    for (var k = 0; k < 6; k += 2) {
      var idx = degIdx + k;
      var oct = Math.floor(idx / 7);
      notes.push(tonicMidi + MAJOR_SCALE[((idx % 7) + 7) % 7] + 12 * oct);
    }
    return notes;
  }
  function axisChords(tonicMidi) {
    return AXIS_DEGREES.map(function (di) { return diatonicTriad(tonicMidi, di); });
  }

  // 7th chords (semitone offsets from root). half-dim = m7b5; fully-dim = dim7.
  var SEVENTH_INTERVALS = { maj7: [0, 4, 7, 11], dom7: [0, 4, 7, 10], min7: [0, 3, 7, 10], m7b5: [0, 3, 6, 10], dim7: [0, 3, 6, 9] };
  var DIATONIC_SEVENTHS = ["maj7", "min7", "min7", "maj7", "dom7", "min7", "m7b5"]; // I..vii in major
  function seventh(rootMidi, quality) {
    return SEVENTH_INTERVALS[quality].map(function (iv) { return rootMidi + iv; });
  }
  function diatonicSeventhQuality(degIdx) { return DIATONIC_SEVENTHS[((degIdx % 7) + 7) % 7]; }
  // Root-position diatonic 7th: stack scale members at indices deg, deg+2, deg+4, deg+6.
  function diatonicSeventh(tonicMidi, degIdx) {
    var notes = [];
    for (var k = 0; k < 8; k += 2) {
      var idx = degIdx + k;
      var oct = Math.floor(idx / 7);
      notes.push(tonicMidi + MAJOR_SCALE[((idx % 7) + 7) % 7] + 12 * oct);
    }
    return notes;
  }
  // Generalized progression builder: degree indices -> chords (triads, or 7ths if useSevenths).
  function progressionChords(tonicMidi, degIdxs, useSevenths) {
    return degIdxs.map(function (di) { return useSevenths ? diatonicSeventh(tonicMidi, di) : diatonicTriad(tonicMidi, di); });
  }

  // distinct pitch classes, sorted ascending
  function pcSet(notes) {
    var seen = {}, out = [];
    for (var i = 0; i < notes.length; i++) {
      if (notes[i] == null) continue;
      var p = pc(notes[i]);
      if (!seen[p]) { seen[p] = 1; out.push(p); }
    }
    return out.sort(function (a, b) { return a - b; });
  }
  function setsEqual(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  // Inversion/octave tolerant: the played pitch-class set must equal the target's exactly.
  function gradeChord(played, target) {
    var p = pcSet(played), t = pcSet(target);
    return { correct: t.length > 0 && setsEqual(p, t), playedSet: p, targetSet: t };
  }
  // Ordered: each chord graded by set equality, in sequence.
  function gradeProgression(playedChords, targetChords) {
    var marks = [], all = targetChords.length > 0;
    for (var i = 0; i < targetChords.length; i++) {
      var ok = playedChords[i] ? gradeChord(playedChords[i], targetChords[i]).correct : false;
      marks.push(ok);
      if (!ok) all = false;
    }
    return { allCorrect: all, marks: marks };
  }

  // Group a timestamped note-on stream into chords: notes within windowMs of the
  // previous note join the same chord; a larger gap starts a new chord. Dedupes
  // repeated note numbers within a chord. events = [{ note, t }] (t in ms).
  function groupNotesByGap(events, windowMs) {
    var chords = [], cur = [], lastT = null;
    function pushCur() { if (cur.length) chords.push(cur.slice()); }
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      if (lastT === null || (e.t - lastT) <= windowMs) {
        if (cur.indexOf(e.note) === -1) cur.push(e.note);
      } else {
        pushCur(); cur = [e.note];
      }
      lastT = e.t;
    }
    pushCur();
    return chords;
  }

  return {
    NOTE_NAMES: NOTE_NAMES, DEGREE_LABEL: DEGREE_LABEL, SOLFEGE: SOLFEGE,
    MAJOR_SCALE: MAJOR_SCALE, MAJOR_KEYS: MAJOR_KEYS,
    KEYBOARD_LOW: KEYBOARD_LOW, KEYBOARD_HIGH: KEYBOARD_HIGH,
    TRIAD_INTERVALS: TRIAD_INTERVALS, DIATONIC_QUALITIES: DIATONIC_QUALITIES,
    ROMAN: ROMAN, AXIS_DEGREES: AXIS_DEGREES,
    pc: pc, noteName: noteName, isBlack: isBlack, midiToFreq: midiToFreq, foldToRange: foldToRange,
    degreeLabel: degreeLabel, solfege: solfege,
    generateMelodyDegrees: generateMelodyDegrees,
    leitnerWeights: leitnerWeights, pickWeighted: pickWeighted, promoteBox: promoteBox,
    rollingAccuracy: rollingAccuracy, isDegreeMastered: isDegreeMastered,
    degreeMasteryFraction: degreeMasteryFraction, isSeqMastered: isSeqMastered,
    seqMasteryFraction: seqMasteryFraction,
    gradeNote: gradeNote, gradeSequence: gradeSequence,
    triad: triad, diatonicQuality: diatonicQuality, romanNumeral: romanNumeral,
    diatonicTriad: diatonicTriad, axisChords: axisChords,
    SEVENTH_INTERVALS: SEVENTH_INTERVALS, DIATONIC_SEVENTHS: DIATONIC_SEVENTHS,
    seventh: seventh, diatonicSeventhQuality: diatonicSeventhQuality,
    diatonicSeventh: diatonicSeventh, progressionChords: progressionChords,
    pcSet: pcSet, gradeChord: gradeChord, gradeProgression: gradeProgression,
    groupNotesByGap: groupNotesByGap
  };
});
