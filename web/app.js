/* Loop - Phase 0 drill core
 * Functional play-by-ear trainer with a level ladder, Leitner spaced repetition,
 * 85%-rule adaptive mastery, melody mode, and progress persistence.
 * Dependency-free. See BUILD-NOTES.md for the research map.
 */
(function () {
  "use strict";

  // ---------- music theory ----------
  var NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var DEGREE_LABEL = { 0: "1", 2: "2", 4: "3", 5: "4", 7: "5", 9: "6", 11: "7", 12: "1↑" };
  var SOLFEGE = { 0: "Do", 2: "Re", 4: "Mi", 5: "Fa", 7: "Sol", 9: "La", 11: "Ti", 12: "Do↑" };
  var KEYBOARD_LOW = 60;   // C4
  var KEYBOARD_HIGH = 83;  // B5
  var MAJOR_KEYS = [0, 2, 4, 5, 7, 9, 11];

  // ---------- curriculum (data-driven; values are first-guess defaults, see BUILD-NOTES) ----------
  var LEVELS = [
    { id: "l1", name: "Tonic", meta: "find Do", type: "degree", degrees: [0] },
    { id: "l2", name: "Tonic + Dominant", meta: "1 & 5", type: "degree", degrees: [0, 7] },
    { id: "l3", name: "Do Re Mi", meta: "1-2-3", type: "degree", degrees: [0, 2, 4] },
    { id: "l4", name: "Pentatonic", meta: "1-2-3-5-6", type: "degree", degrees: [0, 2, 4, 7, 9] },
    { id: "l5", name: "Full Scale", meta: "1-7", type: "degree", degrees: [0, 2, 4, 5, 7, 9, 11] },
    { id: "l6", name: "Melodies: stepwise", meta: "3 notes", type: "melody", degrees: [0, 2, 4, 5, 7, 9, 11], length: 3, leaps: false },
    { id: "l7", name: "Melodies: leaps", meta: "4 notes", type: "melody", degrees: [0, 2, 4, 5, 7, 9, 11], length: 4, leaps: true }
  ];
  var MAX_BOX = 5;          // Leitner boxes 1..5
  var MASTER_BOX = 4;       // a degree item is "mastered" at box >= this
  var WINDOW = 10;          // rolling window for melody accuracy
  var MASTERY_ACC = 0.85;   // 85% rule
  var MIN_ATTEMPTS = 10;    // min attempts before a melody level can be mastered

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
  var targetSeq = [];     // array of midi notes to reproduce
  var playedSeq = [];     // user's input this attempt
  var attempts = 0;
  var session = { correct: 0, total: 0, streak: 0, best: 0 };

  // ---------- audio ----------
  var ctx = null;
  function audio() {
    if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; ctx = new AC(); }
    return ctx;
  }
  function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

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
      return piano.load;
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
  function majorTriad(root) { return [root, root + 4, root + 7]; }
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
     "replayKeyBtn", "hearAgainBtn", "redoBtn", "revealBtn", "nextBtn",
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
    if (level.type === "degree") {
      for (var i = 0; i < level.degrees.length; i++) {
        if ((lp.boxes[level.degrees[i]] || 1) < MASTER_BOX) return false;
      }
      return true;
    } else {
      if (lp.recent.length < MIN_ATTEMPTS) return false;
      var w = lp.recent.slice(-WINDOW);
      var c = w.filter(Boolean).length;
      return (c / w.length) >= MASTERY_ACC;
    }
  }
  function masteryFraction(level) {
    var lp = levelProgress(level.id);
    if (level.type === "degree") {
      var sum = 0;
      for (var i = 0; i < level.degrees.length; i++) {
        var b = Math.min(lp.boxes[level.degrees[i]] || 1, MASTER_BOX);
        sum += (b - 1) / (MASTER_BOX - 1); // box 1 = 0%, box 4 = 100%
      }
      return sum / level.degrees.length;
    } else {
      if (!lp.recent.length) return 0;
      var w = lp.recent.slice(-WINDOW);
      var acc = w.filter(Boolean).length / w.length;
      // fraction toward the 85% gate, also requiring MIN_ATTEMPTS
      var attemptFactor = Math.min(lp.recent.length / MIN_ATTEMPTS, 1);
      return Math.min(acc / MASTERY_ACC, 1) * attemptFactor;
    }
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

    if (lv.type === "degree") {
      var masteredCount = lv.degrees.filter(function (d) { return (lp.boxes[d] || 1) >= MASTER_BOX; }).length;
      els.masteryDetail.textContent = masteredCount + " / " + lv.degrees.length + " scale degrees mastered (box " + MASTER_BOX + "+)";
      // leitner distribution
      var parts = lv.degrees.map(function (d) {
        var label = DEGREE_LABEL[d] || NOTE_NAMES[(tonicMidi + d) % 12];
        return label + ":B" + (lp.boxes[d] || 1);
      });
      els.leitnerDetail.textContent = "Leitner boxes - " + parts.join("  ");
    } else {
      els.masteryDetail.textContent = lp.recent.length + " attempts (need " + MIN_ATTEMPTS + "+ at " + Math.round(MASTERY_ACC * 100) + "% to master)";
      els.leitnerDetail.textContent = "Melody levels use rolling accuracy, not Leitner boxes.";
    }

    // rolling accuracy
    var rl = lp.recent.slice(-WINDOW);
    if (rl.length) {
      var acc = Math.round((rl.filter(Boolean).length / rl.length) * 100);
      els.rollingPct.textContent = acc + "%";
      els.rollingBar.style.width = acc + "%";
    } else {
      els.rollingPct.textContent = "--";
      els.rollingBar.style.width = "0%";
    }
  }

  // ---------- keyboard rendering ----------
  function isBlack(m) { var pc = m % 12; return pc === 1 || pc === 3 || pc === 6 || pc === 8 || pc === 10; }
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
    var down = function (ev) { ev.preventDefault(); handleNoteOn(m); };
    el.addEventListener("mousedown", down);
    el.addEventListener("touchstart", down, { passive: false });
  }
  function keyEl(m) { return els.keyboard.querySelector('[data-midi="' + m + '"]'); }
  function flashKey(m) {
    var el = keyEl(m); if (!el) return;
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
    targetSeq.forEach(function (m, i) {
      var el = keyEl(m); if (!el) return;
      el.classList.add("target");
      if (!el.querySelector(".deg")) {
        var label = document.createElement("span");
        label.className = "deg";
        var deg = m - tonicMidi;
        label.textContent = (DEGREE_LABEL[deg] || NOTE_NAMES[m % 12]);
        el.appendChild(label);
      }
    });
  }

  // ---------- round flow ----------
  function leitnerPick(level) {
    var lp = levelProgress(level.id);
    // weighted random: lower box -> higher weight
    var weights = level.degrees.map(function (d) { return (MAX_BOX + 1) - (lp.boxes[d] || 1); });
    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < level.degrees.length; i++) {
      r -= weights[i];
      if (r <= 0) return level.degrees[i];
    }
    return level.degrees[level.degrees.length - 1];
  }
  function generateMelody(level) {
    var degs = level.degrees.slice();
    var seq = [];
    var idx = Math.floor(Math.random() * degs.length);
    seq.push(degs[idx]);
    for (var n = 1; n < level.length; n++) {
      if (level.leaps) {
        var ni = idx;
        while (ni === idx) ni = Math.floor(Math.random() * degs.length);
        idx = ni;
      } else {
        // stepwise: move +/-1 index, clamp
        var dir = Math.random() < 0.5 ? -1 : 1;
        if (idx + dir < 0) dir = 1;
        if (idx + dir > degs.length - 1) dir = -1;
        idx = idx + dir;
      }
      seq.push(degs[idx]);
    }
    return seq.map(function (d) { return tonicMidi + d; });
  }

  function pickTargets() {
    var lv = LEVELS[currentLevelIdx];
    if (lv.type === "degree") {
      targetSeq = [tonicMidi + leitnerPick(lv)];
    } else {
      targetSeq = generateMelody(lv);
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

  function newRound(full) {
    clearTargets();
    setFeedbackHtml("", "neutral");
    if (els.keySelect.value === "random") chooseKey();   // new key each round if random
    pickTargets();
    playedSeq = [];
    attempts = 0;
    state = "cued";
    setRoundButtons({ during: false, next: false });
    var keyName = NOTE_NAMES[tonicMidi % 12];
    var lv = LEVELS[currentLevelIdx];
    els.prompt.innerHTML = "Key of <strong>" + keyName + " major</strong>. Listen…";
    var ctxDur = playContext(full);
    var totalDur = playSequence(ctxDur);
    setTimeout(function () {
      var what = lv.type === "melody" ? ("Play back all <strong>" + targetSeq.length + " notes</strong> by ear, in order.") : "Find that note by ear and <strong>play it</strong>.";
      els.prompt.innerHTML = what;
      state = "listening";
      renderPendingMarks();
      setRoundButtons({ during: true, next: false });
    }, Math.round(totalDur * 1000) + 200);
  }

  function renderPendingMarks() {
    if (LEVELS[currentLevelIdx].type !== "melody") { setFeedbackHtml("", "neutral"); return; }
    var marks = targetSeq.map(function (_, i) { return i < playedSeq.length ? "●" : "○"; });
    setFeedbackHtml('<span class="marks mark-pending">' + marks.join(" ") + "</span>", "neutral");
  }

  function handleNoteOn(midi) {
    flashKey(midi);
    if (state === "listening") {
      playTone(midi, audio().currentTime + 0.01, 0.5, 0.8); // monitor
      playedSeq.push(midi);
      renderPendingMarks();
      if (playedSeq.length >= targetSeq.length) gradeAttempt();
    } else {
      playTone(midi, audio().currentTime + 0.01, 0.7, 0.8); // free play
    }
  }

  function gradeAttempt() {
    attempts++;
    var lv = LEVELS[currentLevelIdx];
    var lp = levelProgress(lv.id);
    var marks = [];
    var allCorrect = true;
    var anyOctaveOff = false;
    for (var i = 0; i < targetSeq.length; i++) {
      var ok = (playedSeq[i] % 12) === (targetSeq[i] % 12);
      if (ok && playedSeq[i] !== targetSeq[i]) anyOctaveOff = true;
      if (!ok) allCorrect = false;
      marks.push('<span class="' + (ok ? "mark-ok" : "mark-bad") + '">' + (ok ? "✓" : "✗") + "</span>");
    }

    // Score the round ONCE, on the first attempt only.
    if (attempts === 1) {
      session.total++;
      if (allCorrect) {
        session.correct++; session.streak++;
        if (session.streak > session.best) session.best = session.streak;
      } else {
        session.streak = 0;
      }
      lp.attempts++;
      if (allCorrect) lp.correct++;
      // Leitner update (degree levels) on first attempt
      if (lv.type === "degree") {
        var item = targetSeq[0] - tonicMidi;
        var box = lp.boxes[item] || 1;
        lp.boxes[item] = allCorrect ? Math.min(box + 1, MAX_BOX) : 1;
      } else {
        lp.recent.push(allCorrect);
        if (lp.recent.length > 200) lp.recent = lp.recent.slice(-200);
      }
      saveProgress();
      updateScoreboard();
      checkUnlock();
    }

    // feedback text
    var detail;
    if (lv.type === "degree") {
      var deg = DEGREE_LABEL[targetSeq[0] - tonicMidi] || NOTE_NAMES[targetSeq[0] % 12];
      var sol = SOLFEGE[targetSeq[0] - tonicMidi] || "";
      if (allCorrect) {
        detail = (anyOctaveOff ? "Right note (octave off). " : "Correct! ") + "Scale degree " + deg + (sol ? " (" + sol + ")" : "") + ".";
      } else {
        detail = "You played " + NOTE_NAMES[playedSeq[0] % 12] + ". It was degree " + deg + (sol ? " (" + sol + ")" : "") + ".";
      }
    } else {
      var degSeq = targetSeq.map(function (m) { return DEGREE_LABEL[m - tonicMidi] || NOTE_NAMES[m % 12]; }).join(" ");
      detail = allCorrect ? ("Nice! Melody was " + degSeq + ".") : ("Melody was " + degSeq + ". Listen and try again, or Reveal.");
    }
    var prefix = allCorrect ? (attempts > 1 ? "Got it (round counted as a miss). " : "") : "";
    var kind = allCorrect ? "good" : "bad";
    setFeedbackHtml('<span class="marks">' + marks.join(" ") + '</span><br>' + (allCorrect ? "✓ " : "✗ ") + prefix + detail, kind);

    renderProgress();
    if (allCorrect) {
      state = "feedback";
      highlightTargets();
      setRoundButtons({ during: false, next: true });
    } else {
      // allow another try without recounting; reset input
      playedSeq = [];
      state = "listening";
      setRoundButtons({ during: true, next: true });
    }
  }

  function redoAttempt() {
    if (state !== "listening" && state !== "feedback") return;
    playedSeq = [];
    clearTargets();
    state = "cued";
    setRoundButtons({ during: false, next: false });
    var ctxDur = playContext(false);
    var totalDur = playSequence(ctxDur);
    setTimeout(function () {
      renderPendingMarks();
      state = "listening";
      setRoundButtons({ during: true, next: state === "feedback" });
    }, Math.round(totalDur * 1000) + 200);
  }

  function reveal() {
    var lv = LEVELS[currentLevelIdx];
    var lp = levelProgress(lv.id);
    if (state === "listening" && attempts === 0) {
      // count as a miss
      session.total++; session.streak = 0;
      lp.attempts++;
      if (lv.type === "degree") {
        var item = targetSeq[0] - tonicMidi;
        lp.boxes[item] = 1;
      } else {
        lp.recent.push(false);
      }
      saveProgress(); updateScoreboard(); renderProgress();
    }
    highlightTargets();
    var degSeq = targetSeq.map(function (m) { return (DEGREE_LABEL[m - tonicMidi] || NOTE_NAMES[m % 12]); }).join(" ");
    var names = targetSeq.map(function (m) { return NOTE_NAMES[m % 12]; }).join(" ");
    setFeedbackHtml("Answer: " + names + "  (degrees " + degSeq + ")", "neutral");
    // replay
    state = "cued"; playSequence(0.0);
    state = "feedback";
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
    targetSeq = []; playedSeq = []; attempts = 0;
    session = { correct: 0, total: 0, streak: 0, best: 0 };
    updateScoreboard();
    clearTargets();
    setRoundButtons({ during: false, next: false });
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
            var d = msg.data; if ((d[0] & 0xf0) === 0x90 && d[2] > 0) handleNoteOn(d[1]);
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
      if (COMPUTER_KEYS.hasOwnProperty(k) && !held[k]) { held[k] = true; handleNoteOn(COMPUTER_KEYS[k]); }
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
    getTargets: function () { return targetSeq.slice(); },
    getTonic: function () { return tonicMidi; },
    getState: function () { return state; },
    getSession: function () { return session; },
    getProgress: function () { return progress; },
    getLevelIdx: function () { return currentLevelIdx; }
  };
})();
