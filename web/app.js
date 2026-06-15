/* Loop - Phase 0 drill core
 * Functional play-by-ear trainer with a level ladder, Leitner spaced repetition,
 * 85%-rule adaptive mastery, melody mode, and progress persistence.
 * Dependency-free. See BUILD-NOTES.md for the research map.
 */
(function () {
  "use strict";

  // ---------- core (pure music/logic, shared with Node tests via core.js) ----------
  var C = window.LoopCore;
  var NOTE_NAMES = C.NOTE_NAMES, DEGREE_LABEL = C.DEGREE_LABEL, SOLFEGE = C.SOLFEGE;
  var MAJOR_KEYS = C.MAJOR_KEYS, KEYBOARD_LOW = C.KEYBOARD_LOW, KEYBOARD_HIGH = C.KEYBOARD_HIGH;

  // ---------- curriculum (data-driven; values are first-guess defaults, see BUILD-NOTES) ----------
  var LEVELS = [
    { id: "l1", name: "Tonic", meta: "find Do", type: "degree", degrees: [0] },
    { id: "l2", name: "Tonic + Dominant", meta: "1 & 5", type: "degree", degrees: [0, 7] },
    { id: "l3", name: "Do Re Mi", meta: "1-2-3", type: "degree", degrees: [0, 2, 4] },
    { id: "l4", name: "Pentatonic", meta: "1-2-3-5-6", type: "degree", degrees: [0, 2, 4, 7, 9] },
    { id: "l5", name: "Full Scale", meta: "1-7", type: "degree", degrees: [0, 2, 4, 5, 7, 9, 11] },
    { id: "l6", name: "Melodies: stepwise", meta: "3 notes", type: "melody", degrees: [0, 2, 4, 5, 7, 9, 11], length: 3, leaps: false },
    { id: "l7", name: "Melodies: leaps", meta: "4 notes", type: "melody", degrees: [0, 2, 4, 5, 7, 9, 11], length: 4, leaps: true },
    // Chords (pedagogy order from CHORDS-SPEC.md: quality -> primary -> +minor -> +vii deg -> progression)
    { id: "l8", name: "Triad quality", meta: "maj / min", type: "chord", itemKind: "quality", items: ["maj", "min"] }, // dim intentionally deferred (opt-in) per verified pedagogy

    { id: "l9", name: "Primary chords", meta: "I IV V", type: "chord", itemKind: "degree", items: [0, 3, 4] },
    { id: "l10", name: "Diatonic chords", meta: "I-vi", type: "chord", itemKind: "degree", items: [0, 1, 2, 3, 4, 5] },
    { id: "l11", name: "Full diatonic", meta: "+ vii°", type: "chord", itemKind: "degree", items: [0, 1, 2, 3, 4, 5, 6] },
    { id: "l12", name: "Axis progression", meta: "I-V-vi-IV", type: "progression", prog: [0, 4, 5, 3] },
    { id: "l13", name: "50s progression", meta: "I-vi-IV-V", type: "progression", prog: [0, 5, 3, 4] },
    { id: "l14", name: "7th chord quality", meta: "maj7 / 7 / m7 / m7b5", type: "chord", itemKind: "quality7", items: ["maj7", "dom7", "min7", "m7b5"] }, // dim7 deferred (not diatonic to major)
    { id: "l15", name: "Diatonic 7ths", meta: "Imaj7-viiø7", type: "chord", itemKind: "degree7", items: [0, 1, 2, 3, 4, 5, 6] },
    { id: "l16", name: "ii-V-I (7ths)", meta: "ii7 V7 Imaj7", type: "progression", prog: [1, 4, 0], sevenths: true }
  ];
  var MAX_BOX = 5;          // Leitner boxes 1..5
  var MASTER_BOX = 4;       // an item is "mastered" at box >= this
  var WINDOW = 10;          // rolling window for melody/progression accuracy
  var MASTERY_ACC = 0.85;   // 85% rule
  var MIN_ATTEMPTS = 10;    // min attempts before a rolling-accuracy level can be mastered
  var CHORD_WINDOW_MS = 75; // trailing-edge debounce to group simultaneous MIDI notes into a chord

  function levelItems(lv) { return lv.items || lv.degrees || []; }
  function usesLeitner(lv) { return lv.type === "degree" || lv.type === "chord"; }
  function isChordType(lv) { return lv.type === "chord" || lv.type === "progression"; }

  // ---------- persistence ----------
  var STORE_KEY = "loop_progress_v1";
  var progress = loadProgress();

  function loadProgress() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { version: 1, unlocked: 1, levels: {} };
  }
  function saveProgress() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
  }
  function levelProgress(id) {
    if (!progress.levels[id]) {
      progress.levels[id] = { boxes: {}, attempts: 0, correct: 0, recent: [] };
    }
    return progress.levels[id];
  }

  // ---------- state ----------
  var state = "idle"; // idle | cued | listening | feedback
  var currentLevelIdx = 0;
  var tonicMidi = 60;
  var targetSeq = [];     // flattened target notes (for playback/highlight)
  var targetChords = null;// array of chords (each an array of midi) for chord/progression levels
  var playedSeq = [];     // user's note input this attempt (note/melody levels)
  var currentItem = null; // the Leitner item this round (degree offset, quality, or degIdx)
  var attempts = 0;
  var session = { correct: 0, total: 0, streak: 0, best: 0 };

  // chord capture (chord/progression levels)
  var pendingChord = [];  // notes accumulating into the current chord
  var playedChords = [];  // finalized chords this attempt
  var chordTimer = null;
  var roundSeq = 0;       // invalidates an in-flight cue timer if the level/round changes

  // ---------- audio ----------
  var ctx = null;
  function audio() {
    if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; ctx = new AC(); }
    return ctx;
  }
  var midiToFreq = C.midiToFreq;

  // Sampled Steinway (smplr) with a built-in synth fallback if samples can't load.
  var piano = null, pianoState = "off"; // off | loading | ready | failed
  function setSoundNote() {
    if (!els.soundState) return;
    var map = { off: "Sound: synth", loading: "Sound: loading Steinway…", ready: "Sound: Steinway", failed: "Sound: synth (offline)" };
    els.soundState.textContent = map[pianoState] || "Sound: synth";
    els.soundState.className = "sound-state" + (pianoState === "ready" ? " ready" : "");
  }
  function initPiano() {
    if (pianoState !== "off") return;
    pianoState = "loading"; setSoundNote();
    import("https://esm.sh/smplr").then(function (mod) {
      piano = new mod.SplendidGrandPiano(audio());
      return piano.ready || piano.load; // v1.0 uses .ready; .load is the deprecated fallback
    }).then(function () {
      pianoState = "ready"; setSoundNote(); toast("Steinway samples loaded.");
    }).catch(function () {
      piano = null; pianoState = "failed"; setSoundNote();
    });
  }

  function playSynth(midi, when, dur, vel) {
    var ac = audio(); var t0 = when;
    var master = ac.createGain(); master.connect(ac.destination);
    var partials = [{ m: 1, g: 1 }, { m: 2, g: 0.45 }, { m: 3, g: 0.22 }, { m: 4, g: 0.1 }];
    var freq = midiToFreq(midi);
    partials.forEach(function (p) {
      var o = ac.createOscillator(); o.type = "sine"; o.frequency.value = freq * p.m;
      var g = ac.createGain(); g.gain.value = p.g; o.connect(g); g.connect(master);
      o.start(t0); o.stop(t0 + dur + 0.25);
    });
    var peak = 0.22 * vel;
    master.gain.setValueAtTime(0.0001, t0);
    master.gain.linearRampToValueAtTime(peak, t0 + 0.006);
    master.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }

  function playTone(midi, when, dur, vel) {
    vel = vel == null ? 0.85 : vel;
    if (pianoState === "ready" && piano) {
      try { piano.start({ note: midi, time: when, duration: dur, velocity: Math.round(vel * 127) }); return; }
      catch (e) { /* fall back to synth */ }
    }
    playSynth(midi, when, dur, vel);
  }
  function majorTriad(root) { return C.triad(root, "maj"); } // single-source the triad shape via core
  function playChord(midis, when, dur) { for (var i = 0; i < midis.length; i++) playTone(midis[i], when, dur, 0.7); }

  // Plays the cadence (full I-IV-V-I) or a short tonic reminder. Returns seconds to completion.
  function playContext(full) {
    var ac = audio(); var t = ac.currentTime + 0.08; var c = 0.55;
    if (full) {
      playChord(majorTriad(tonicMidi), t, c); t += c;
      playChord(majorTriad(tonicMidi + 5), t, c); t += c;
      playChord(majorTriad(tonicMidi + 7), t, c); t += c;
      playChord(majorTriad(tonicMidi), t, c); t += c;
    } else {
      playChord(majorTriad(tonicMidi), t, c); t += c;
    }
    return t - ac.currentTime;
  }
  // Plays the target sequence after the context. Returns seconds to completion of context+seq.
  function playSequence(afterSeconds) {
    var ac = audio();
    var t = ac.currentTime + afterSeconds + 0.2;
    var noteDur = 0.62;
    for (var i = 0; i < targetSeq.length; i++) {
      playTone(targetSeq[i], t, noteDur * 0.92, 0.9);
      t += noteDur;
    }
    return (t - ac.currentTime);
  }

  // ---------- DOM ----------
  function $(id) { return document.getElementById(id); }
  var els = {};
  function cacheEls() {
    ["status", "keySelect", "startBtn", "resetBtn", "levels", "prompt", "feedback",
     "replayKeyBtn", "hearAgainBtn", "redoBtn", "submitBtn", "revealBtn", "nextBtn",
     "accuracy", "streak", "best", "count", "keyboard",
     "masteryPct", "masteryBar", "masteryDetail", "rollingPct", "rollingBar", "leitnerDetail",
     "toast", "soundState"].forEach(function (id) { els[id] = $(id); });
    setSoundNote();
  }
  function setStatus(text, on) { els.status.textContent = text; els.status.className = "status " + (on ? "status--on" : "status--off"); }
  function setFeedbackHtml(html, kind) { els.feedback.innerHTML = html; els.feedback.className = "feedback" + (kind ? " " + kind : ""); }
  function setRoundButtons(o) {
    els.replayKeyBtn.disabled = !o.during;
    els.hearAgainBtn.disabled = !o.during;
    els.redoBtn.disabled = !o.during;
    els.revealBtn.disabled = !o.during;
    els.nextBtn.disabled = !o.next;
  }
  function showSubmit(on) { if (els.submitBtn) els.submitBtn.style.display = on ? "" : "none"; }
  function toast(msg) {
    els.toast.textContent = msg; els.toast.classList.add("show");
    setTimeout(function () { els.toast.classList.remove("show"); }, 2600);
  }

  function updateScoreboard() {
    var acc = session.total ? Math.round((session.correct / session.total) * 100) : 0;
    els.accuracy.textContent = acc + "%";
    els.streak.textContent = session.streak;
    els.best.textContent = session.best;
    els.count.textContent = session.total;
  }

  // ---------- curriculum / mastery ----------
  function isUnlocked(idx) { return idx < progress.unlocked; }
  function isMastered(level) {
    var lp = levelProgress(level.id);
    if (usesLeitner(level)) return C.isDegreeMastered(lp.boxes, levelItems(level), MASTER_BOX);
    return C.isSeqMastered(lp.recent, WINDOW, MASTERY_ACC, MIN_ATTEMPTS);
  }
  function masteryFraction(level) {
    var lp = levelProgress(level.id);
    if (usesLeitner(level)) return C.degreeMasteryFraction(lp.boxes, levelItems(level), MASTER_BOX);
    return C.seqMasteryFraction(lp.recent, WINDOW, MASTERY_ACC, MIN_ATTEMPTS);
  }
  // human label for a Leitner item (degree offset, chord degree index, or quality)
  function itemLabel(level, item) {
    if (level.type === "chord") {
      if (level.itemKind === "quality" || level.itemKind === "quality7") return item; // "maj" / "maj7"
      if (level.itemKind === "degree7") return seventhRoman(item);
      return C.romanNumeral(item); // diatonic triad degree
    }
    return DEGREE_LABEL[item] || NOTE_NAMES[(tonicMidi + item) % 12]; // degree levels
  }

  function renderLevels() {
    els.levels.innerHTML = "";
    LEVELS.forEach(function (lv, idx) {
      var chip = document.createElement("div");
      var cls = "level-chip ";
      if (!isUnlocked(idx)) cls += "locked";
      else cls += "unlocked";
      if (idx === currentLevelIdx) cls += " current";
      if (isMastered(lv)) cls += " mastered";
      chip.className = cls;
      chip.innerHTML = '<span class="lc-name">' + (idx + 1) + ". " + lv.name + '</span><span class="lc-meta">' + lv.meta + "</span>";
      if (isUnlocked(idx)) {
        chip.addEventListener("click", function () { selectLevel(idx); });
      }
      els.levels.appendChild(chip);
    });
  }

  function renderProgress() {
    var lv = LEVELS[currentLevelIdx];
    var lp = levelProgress(lv.id);
    var frac = masteryFraction(lv);
    els.masteryPct.textContent = Math.round(frac * 100) + "%";
    els.masteryBar.style.width = Math.round(frac * 100) + "%";

    if (usesLeitner(lv)) {
      var items = levelItems(lv);
      var noun = lv.type === "chord" ? "chords" : "degrees";
      var masteredCount = items.filter(function (d) { return (lp.boxes[d] || 1) >= MASTER_BOX; }).length;
      els.masteryDetail.textContent = masteredCount + " / " + items.length + " " + noun + " mastered (box " + MASTER_BOX + "+)";
      var parts = items.map(function (d) { return itemLabel(lv, d) + ":B" + (lp.boxes[d] || 1); });
      els.leitnerDetail.textContent = "Leitner boxes - " + parts.join("  ");
    } else {
      els.masteryDetail.textContent = lp.recent.length + " attempts (need " + MIN_ATTEMPTS + "+ at " + Math.round(MASTERY_ACC * 100) + "% to master)";
      els.leitnerDetail.textContent = "This level uses rolling accuracy, not Leitner boxes.";
    }

    // rolling accuracy
    var ra = C.rollingAccuracy(lp.recent, WINDOW);
    if (ra != null) {
      var acc = Math.round(ra * 100);
      els.rollingPct.textContent = acc + "%";
      els.rollingBar.style.width = acc + "%";
    } else {
      els.rollingPct.textContent = "--";
      els.rollingBar.style.width = "0%";
    }
  }

  // ---------- keyboard rendering ----------
  var isBlack = C.isBlack;
  function renderKeyboard() {
    var kb = els.keyboard; kb.innerHTML = "";
    var whiteW = 40, blackW = 26, whitesBefore = 0, totalWhites = 0, m;
    for (m = KEYBOARD_LOW; m <= KEYBOARD_HIGH; m++) if (!isBlack(m)) totalWhites++;
    kb.style.width = (totalWhites * whiteW) + "px";
    whitesBefore = 0;
    for (m = KEYBOARD_LOW; m <= KEYBOARD_HIGH; m++) {
      var key = document.createElement("div");
      key.setAttribute("data-midi", String(m));
      if (isBlack(m)) {
        key.className = "key black";
        key.style.left = (whitesBefore * whiteW - blackW / 2) + "px";
      } else {
        key.className = "key white";
        key.style.left = (whitesBefore * whiteW) + "px";
        whitesBefore++;
      }
      bindKey(key, m); kb.appendChild(key);
    }
  }
  function bindKey(el, m) {
    var down = function (ev) { ev.preventDefault(); handleNoteOn(m, "screen"); };
    el.addEventListener("mousedown", down);
    el.addEventListener("touchstart", down, { passive: false });
  }
  function keyEl(m) { return els.keyboard.querySelector('[data-midi="' + m + '"]'); }
  function flashKey(m) {
    var el = keyEl(C.foldToRange(m, KEYBOARD_LOW, KEYBOARD_HIGH)); if (!el) return;
    el.classList.add("active");
    setTimeout(function () { el.classList.remove("active"); }, 220);
  }
  function clearTargets() {
    var marked = els.keyboard.querySelectorAll(".key.target");
    for (var i = 0; i < marked.length; i++) {
      marked[i].classList.remove("target");
      var d = marked[i].querySelector(".deg"); if (d) d.remove();
    }
  }
  function highlightTargets() {
    clearTargets();
    targetSeq.forEach(function (m) {
      var el = keyEl(C.foldToRange(m, KEYBOARD_LOW, KEYBOARD_HIGH)); if (!el) return;
      el.classList.add("target");
      if (!el.querySelector(".deg")) {
        var label = document.createElement("span");
        label.className = "deg";
        label.textContent = degOrName(m);
        el.appendChild(label);
      }
    });
  }

  // ---------- round flow ----------
  function leitnerPick(level) {
    var lp = levelProgress(level.id);
    var items = levelItems(level);
    var weights = C.leitnerWeights(items, lp.boxes, MAX_BOX);
    return C.pickWeighted(items, weights);
  }
  function generateMelody(level) {
    return C.generateMelodyDegrees(level.degrees, level.length, level.leaps)
            .map(function (d) { return tonicMidi + d; });
  }
  // Quality recognition (L8) is key-agnostic, so it skips the cadence; everything else primes the key.
  function needsKeyContext(lv) { return !(lv.type === "chord" && (lv.itemKind === "quality" || lv.itemKind === "quality7")); }
  function listenPrompt(lv) {
    if (lv.type === "melody") return "Play back all <strong>" + targetSeq.length + " notes</strong> by ear, in order.";
    if (lv.type === "progression") return "Play back all <strong>" + targetChords.length + " chords</strong> in order. Submit each chord.";
    if (lv.type === "chord") return "Play back the <strong>chord</strong> by ear (any inversion), then Submit.";
    return "Find that note by ear and <strong>play it</strong>.";
  }

  function pickTargets() {
    var lv = LEVELS[currentLevelIdx];
    currentItem = null;
    targetChords = null;
    if (lv.type === "degree") {
      currentItem = leitnerPick(lv);
      targetSeq = [tonicMidi + currentItem];
    } else if (lv.type === "melody") {
      targetSeq = generateMelody(lv);
    } else if (lv.type === "chord") {
      currentItem = leitnerPick(lv);
      if (lv.itemKind === "quality") {
        targetChords = [C.triad(KEYBOARD_LOW + Math.floor(Math.random() * 12), currentItem)];
      } else if (lv.itemKind === "quality7") {
        targetChords = [C.seventh(KEYBOARD_LOW + Math.floor(Math.random() * 12), currentItem)];
      } else if (lv.itemKind === "degree7") {
        targetChords = [C.diatonicSeventh(tonicMidi, currentItem)];
      } else {
        targetChords = [C.diatonicTriad(tonicMidi, currentItem)];
      }
      targetSeq = targetChords[0].slice();
    } else if (lv.type === "progression") {
      targetChords = C.progressionChords(tonicMidi, lv.prog, !!lv.sevenths);
      targetSeq = targetChords.reduce(function (a, c) { return a.concat(c); }, []);
    }
  }

  function chooseKey() {
    var v = els.keySelect.value;
    var pc = (v === "random") ? MAJOR_KEYS[Math.floor(Math.random() * MAJOR_KEYS.length)] : parseInt(v, 10);
    tonicMidi = KEYBOARD_LOW + pc;
  }

  function startLevel() {
    if (audio().resume) audio().resume();
    initPiano(); // load Steinway samples on first user gesture
    session = { correct: 0, total: 0, streak: 0, best: 0 };
    updateScoreboard();
    chooseKey(); // set the key once at start (random re-rolls per round in newRound)
    els.startBtn.textContent = "Restart level";
    newRound(true);
  }

  function resetAttemptInput() {
    playedSeq = []; playedChords = []; pendingChord = []; clearChordTimer();
  }

  function newRound(full) {
    clearTargets();
    setFeedbackHtml("", "neutral");
    if (els.keySelect.value === "random") chooseKey();   // new key each round if random
    pickTargets();
    resetAttemptInput();
    attempts = 0;
    state = "cued";
    setRoundButtons({ during: false, next: false });
    showSubmit(false);
    var lv = LEVELS[currentLevelIdx];
    var keyName = NOTE_NAMES[tonicMidi % 12];
    els.prompt.innerHTML = needsKeyContext(lv) ? ("Key of <strong>" + keyName + " major</strong>. Listen…") : "Listen…";
    var ctxDur = needsKeyContext(lv) ? playContext(full) : 0;
    var totalDur = playSequence(ctxDur);
    var myRound = ++roundSeq;
    setTimeout(function () {
      if (myRound !== roundSeq) return; // a newer round/level started during the cue
      els.prompt.innerHTML = listenPrompt(lv);
      state = "listening";
      renderPending();
      setRoundButtons({ during: true, next: false });
      showSubmit(isChordType(lv));
    }, Math.round(totalDur * 1000) + 200);
  }

  function renderPending() {
    var lv = LEVELS[currentLevelIdx];
    if (lv.type === "melody") {
      var marks = targetSeq.map(function (_, i) { return i < playedSeq.length ? "●" : "○"; });
      setFeedbackHtml('<span class="marks mark-pending">' + marks.join(" ") + "</span>", "neutral");
    } else if (isChordType(lv)) {
      renderChordPending();
    } else {
      setFeedbackHtml("", "neutral");
    }
  }
  function renderChordPending() {
    var total = chordCount();
    var done = playedChords.length;
    var dots = [];
    for (var i = 0; i < total; i++) dots.push(i < done ? "●" : "○");
    var building = pendingChord.length
      ? (" building: " + pendingChord.map(function (m) { return NOTE_NAMES[m % 12]; }).join("+"))
      : "";
    var head = total > 1 ? ('<span class="marks mark-pending">' + dots.join(" ") + "</span> chord " + (done + 1) + "/" + total) : "play the chord";
    setFeedbackHtml(head + building, "neutral");
  }

  function handleNoteOn(midi, source) {
    flashKey(midi);
    if (state === "listening") {
      playTone(midi, audio().currentTime + 0.01, 0.5, 0.8); // monitor
      if (isChordType(LEVELS[currentLevelIdx])) {
        onChordNote(midi, source);
      } else {
        playedSeq.push(midi);
        renderPending();
        if (playedSeq.length >= targetSeq.length) gradeAttempt();
      }
    } else {
      playTone(midi, audio().currentTime + 0.01, 0.7, 0.8); // free play
    }
  }

  // ---------- chord capture ----------
  function clearChordTimer() { if (chordTimer) { clearTimeout(chordTimer); chordTimer = null; } }
  // Live capture: each MIDI note re-arms a CHORD_WINDOW_MS trailing-edge timer, so notes within
  // the window join one chord - the real-time equivalent of the unit-tested core.groupNotesByGap.
  function onChordNote(midi, source) {
    if (pendingChord.indexOf(midi) === -1) pendingChord.push(midi);
    renderChordPending();
    if (source === "midi") {               // auto-finalize a fast simultaneous gesture
      clearChordTimer();
      chordTimer = setTimeout(finalizeChord, CHORD_WINDOW_MS);
    }
    // non-MIDI (click/computer): the user finalizes with the Submit button
  }
  function finalizeChord() {
    clearChordTimer();
    if (!pendingChord.length) return;
    playedChords.push(pendingChord.slice());
    pendingChord = [];
    var total = chordCount();
    if (playedChords.length >= total) gradeChordAttempt();
    else renderChordPending();
  }

  // ---------- shared scoring / feedback ----------
  function markSpan(ok) { return '<span class="' + (ok ? "mark-ok" : "mark-bad") + '">' + (ok ? "✓" : "✗") + "</span>"; }
  function qualityWord(q) { return q === "maj" ? "major" : q === "min" ? "minor" : "diminished"; }
  function qualityWord7(q) { return q === "maj7" ? "major 7th" : q === "dom7" ? "dominant 7th" : q === "min7" ? "minor 7th" : q === "m7b5" ? "half-diminished 7th" : "diminished 7th"; }
  var SEVENTH_ROMAN = ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7", "viiø7"];
  function seventhRoman(deg) { return SEVENTH_ROMAN[deg]; }
  function degOrName(m) { return DEGREE_LABEL[m - tonicMidi] || NOTE_NAMES[m % 12]; }
  function progLabels(lv) { return lv.prog.map(function (di) { return lv.sevenths ? seventhRoman(di) : C.romanNumeral(di); }); }
  function chordCount() { return targetChords ? targetChords.length : 1; }
  function chordName() {
    var lv = LEVELS[currentLevelIdx];
    var rootName = NOTE_NAMES[targetChords[0][0] % 12];
    if (lv.itemKind === "quality") return rootName + " " + qualityWord(currentItem);
    if (lv.itemKind === "quality7") return rootName + " " + qualityWord7(currentItem);
    if (lv.itemKind === "degree7") return seventhRoman(currentItem) + " (" + rootName + " " + qualityWord7(C.diatonicSeventhQuality(currentItem)) + ")";
    return C.romanNumeral(currentItem) + " (" + rootName + " " + qualityWord(C.diatonicQuality(currentItem)) + ")";
  }
  function degreeDetail(allCorrect, anyOctaveOff) {
    var deg = degOrName(targetSeq[0]);
    var sol = SOLFEGE[targetSeq[0] - tonicMidi] || "";
    if (allCorrect) return (anyOctaveOff ? "Right note (octave off). " : "Correct! ") + "Scale degree " + deg + (sol ? " (" + sol + ")" : "") + ".";
    return "You played " + NOTE_NAMES[playedSeq[0] % 12] + ". It was degree " + deg + (sol ? " (" + sol + ")" : "") + ".";
  }
  function melodyDetail(allCorrect) {
    var degSeq = targetSeq.map(degOrName).join(" ");
    return allCorrect ? ("Nice! Melody was " + degSeq + ".") : ("Melody was " + degSeq + ". Listen and try again, or Reveal.");
  }
  function chordDetail(correct) {
    var name = chordName();
    return correct ? ("Correct! It was " + name + ".") : ("It was " + name + ". Listen and try again, or Reveal.");
  }
  function progressionDetail(correct) {
    var names = progLabels(LEVELS[currentLevelIdx]).join("-");
    return correct ? ("Nice! Progression was " + names + ".") : ("Progression was " + names + ". Listen and try again, or Reveal.");
  }

  function scoreRound(allCorrect) {
    var lv = LEVELS[currentLevelIdx], lp = levelProgress(lv.id);
    session.total++;
    if (allCorrect) { session.correct++; session.streak++; if (session.streak > session.best) session.best = session.streak; }
    else session.streak = 0;
    lp.attempts++; if (allCorrect) lp.correct++;
    if (usesLeitner(lv)) lp.boxes[currentItem] = C.promoteBox(lp.boxes[currentItem], allCorrect, MAX_BOX);
    else { lp.recent.push(allCorrect); if (lp.recent.length > 200) lp.recent = lp.recent.slice(-200); }
    saveProgress(); updateScoreboard(); checkUnlock();
  }

  function showAttemptFeedback(allCorrect, marks, detail) {
    var prefix = allCorrect ? (attempts > 1 ? "Got it (round counted as a miss). " : "") : "";
    setFeedbackHtml('<span class="marks">' + marks.join(" ") + '</span><br>' + (allCorrect ? "✓ " : "✗ ") + prefix + detail, allCorrect ? "good" : "bad");
    renderProgress();
    if (allCorrect) {
      state = "feedback"; highlightTargets(); showSubmit(false);
      setRoundButtons({ during: false, next: true });
    } else {
      resetAttemptInput();
      if (isChordType(LEVELS[currentLevelIdx])) renderChordPending();
      state = "listening";
      setRoundButtons({ during: true, next: true });
      showSubmit(isChordType(LEVELS[currentLevelIdx]));
    }
  }

  function gradeAttempt() {
    attempts++;
    var lv = LEVELS[currentLevelIdx];
    var g = C.gradeSequence(playedSeq, targetSeq);
    var marks = g.marks.map(markSpan);
    if (attempts === 1) scoreRound(g.allCorrect);
    var detail = lv.type === "degree" ? degreeDetail(g.allCorrect, g.anyOctaveOff) : melodyDetail(g.allCorrect);
    showAttemptFeedback(g.allCorrect, marks, detail);
  }

  function gradeChordAttempt() {
    attempts++;
    var lv = LEVELS[currentLevelIdx];
    var allCorrect, marks, detail;
    if (lv.type === "progression") {
      var gp = C.gradeProgression(playedChords, targetChords);
      allCorrect = gp.allCorrect;
      marks = gp.marks.map(markSpan);
      detail = progressionDetail(allCorrect);
    } else {
      var res = C.gradeChord(playedChords[0], targetChords[0]);
      allCorrect = res.correct;
      marks = [markSpan(allCorrect)];
      detail = chordDetail(allCorrect);
    }
    if (attempts === 1) scoreRound(allCorrect);
    showAttemptFeedback(allCorrect, marks, detail);
  }

  function redoAttempt() {
    if (state !== "listening" && state !== "feedback") return;
    resetAttemptInput();
    clearTargets();
    state = "cued";
    setRoundButtons({ during: false, next: false });
    showSubmit(false);
    var lv = LEVELS[currentLevelIdx];
    var ctxDur = needsKeyContext(lv) ? playContext(false) : 0;
    var totalDur = playSequence(ctxDur);
    var myRound = ++roundSeq;
    setTimeout(function () {
      if (myRound !== roundSeq) return; // a newer round/level started during the cue
      renderPending();
      state = "listening";
      setRoundButtons({ during: true, next: false });
      showSubmit(isChordType(lv));
    }, Math.round(totalDur * 1000) + 200);
  }

  function answerText(lv) {
    if (lv.type === "progression") {
      return progLabels(lv).join("-") + "  (" + targetChords.map(function (ch) { return NOTE_NAMES[ch[0] % 12]; }).join(" ") + ")";
    }
    if (lv.type === "chord") return chordName();
    var degSeq = targetSeq.map(degOrName).join(" ");
    var names = targetSeq.map(function (m) { return NOTE_NAMES[m % 12]; }).join(" ");
    return names + "  (degrees " + degSeq + ")";
  }
  function reveal() {
    var lv = LEVELS[currentLevelIdx];
    clearChordTimer();
    if (state === "listening" && attempts === 0) { attempts = 1; scoreRound(false); } // count as a miss, once
    renderProgress();
    highlightTargets();
    setFeedbackHtml("Answer: " + answerText(lv), "neutral");
    state = "cued"; playSequence(0.0); state = "feedback";
    showSubmit(false);
    setRoundButtons({ during: false, next: true });
  }

  function checkUnlock() {
    var lv = LEVELS[currentLevelIdx];
    if (isMastered(lv) && currentLevelIdx + 1 < LEVELS.length && progress.unlocked < currentLevelIdx + 2) {
      progress.unlocked = currentLevelIdx + 2;
      saveProgress();
      toast("Level mastered! Unlocked: " + LEVELS[currentLevelIdx + 1].name);
      renderLevels();
    }
  }

  function selectLevel(idx) {
    if (!isUnlocked(idx)) return;
    currentLevelIdx = idx;
    state = "idle";
    roundSeq++; // invalidate any in-flight cue timer from the previous level
    targetSeq = []; targetChords = null; resetAttemptInput(); attempts = 0;
    session = { correct: 0, total: 0, streak: 0, best: 0 };
    updateScoreboard();
    clearTargets();
    setRoundButtons({ during: false, next: false });
    showSubmit(false);
    els.startBtn.textContent = "Start level";
    els.prompt.innerHTML = "Level <strong>" + LEVELS[idx].name + "</strong> selected. Press <strong>Start level</strong>.";
    setFeedbackHtml("", "neutral");
    renderLevels();
    renderProgress();
  }

  function resetProgress() {
    progress = { version: 1, unlocked: 1, levels: {} };
    saveProgress();
    selectLevel(0);
    toast("Progress reset.");
  }

  // ---------- MIDI ----------
  function initMIDI() {
    if (!navigator.requestMIDIAccess) {
      setStatus("No Web MIDI in this browser. Use the on-screen or computer keys (Chrome/Edge supports MIDI).", false);
      return;
    }
    navigator.requestMIDIAccess({ sysex: false }).then(function (access) {
      function scan() {
        var inputs = access.inputs ? Array.from(access.inputs.values()) : [];
        if (inputs.length) {
          setStatus("MIDI connected: " + inputs.map(function (i) { return i.name; }).join(", "), true);
        } else {
          setStatus("Web MIDI ready, but no keyboard detected. Plug one in, or use on-screen / computer keys.", false);
        }
        inputs.forEach(function (input) {
          input.onmidimessage = function (msg) {
            var d = msg.data; if ((d[0] & 0xf0) === 0x90 && d[2] > 0) handleNoteOn(d[1], "midi");
          };
        });
      }
      scan(); access.onstatechange = scan;
    }).catch(function () {
      setStatus("MIDI permission denied. Use the on-screen or computer keys instead.", false);
    });
  }

  // ---------- computer keyboard (2 octaves) ----------
  var COMPUTER_KEYS = {
    // lower octave (C4..B4)
    z: 60, s: 61, x: 62, d: 63, c: 64, v: 65, g: 66, b: 67, h: 68, n: 69, j: 70, m: 71,
    // upper octave (C5..B5)
    q: 72, "2": 73, w: 74, "3": 75, e: 76, r: 77, "5": 78, t: 79, "6": 80, y: 81, "7": 82, u: 83
  };
  function initComputerKeys() {
    var held = {};
    document.addEventListener("keydown", function (e) {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key.toLowerCase();
      if (COMPUTER_KEYS.hasOwnProperty(k) && !held[k]) { held[k] = true; handleNoteOn(COMPUTER_KEYS[k], "computer"); }
    });
    document.addEventListener("keyup", function (e) { delete held[e.key.toLowerCase()]; });
  }

  // ---------- init ----------
  function init() {
    cacheEls();
    renderKeyboard();
    // resume highest unlocked level by default
    currentLevelIdx = Math.min(progress.unlocked - 1, LEVELS.length - 1);
    if (currentLevelIdx < 0) currentLevelIdx = 0;
    renderLevels();
    renderProgress();
    updateScoreboard();
    els.startBtn.addEventListener("click", startLevel);
    els.resetBtn.addEventListener("click", resetProgress);
    els.replayKeyBtn.addEventListener("click", function () { playContext(true); });
    els.hearAgainBtn.addEventListener("click", function () { playSequence(0.0); });
    els.redoBtn.addEventListener("click", redoAttempt);
    els.submitBtn.addEventListener("click", function () {
      if (state !== "listening") return;
      if (!pendingChord.length) { toast("Play the chord first, then Submit."); return; }
      finalizeChord();
    });
    els.revealBtn.addEventListener("click", reveal);
    els.nextBtn.addEventListener("click", function () { newRound(false); });
    initComputerKeys();
    initMIDI();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // ---------- test hook ----------
  window.__loop = {
    start: function () { startLevel(); },
    selectLevel: selectLevel,
    play: function (m) { handleNoteOn(m); },
    playSeq: function (arr) { arr.forEach(function (m) { handleNoteOn(m); }); },
    // play a chord's notes then finalize it deterministically (for tests/non-MIDI)
    playChord: function (notes) { notes.forEach(function (n) { handleNoteOn(n, "screen"); }); finalizeChord(); },
    submitChord: function () { finalizeChord(); },
    midiNote: function (m) { handleNoteOn(m, "midi"); }, // exercises the 75ms debounce path
    getTargets: function () { return targetSeq.slice(); },
    getTargetChords: function () { return targetChords ? targetChords.map(function (c) { return c.slice(); }) : null; },
    getCurrentItem: function () { return currentItem; },
    getTonic: function () { return tonicMidi; },
    getState: function () { return state; },
    getSession: function () { return session; },
    getProgress: function () { return progress; },
    getLevelIdx: function () { return currentLevelIdx; }
  };
})();
