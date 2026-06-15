"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../core.js");

// ---------- daysBetween ----------
test("daysBetween: same day is 0, consecutive is 1", () => {
  assert.equal(C.daysBetween("2026-06-15", "2026-06-15"), 0);
  assert.equal(C.daysBetween("2026-06-15", "2026-06-16"), 1);
  assert.equal(C.daysBetween("2026-06-15", "2026-06-17"), 2);
});
test("daysBetween: crosses month and year boundaries", () => {
  assert.equal(C.daysBetween("2026-06-30", "2026-07-01"), 1);
  assert.equal(C.daysBetween("2026-12-31", "2027-01-01"), 1);
});

// ---------- updateStreak ----------
test("updateStreak: first ever practice starts a streak of 1", () => {
  const s = C.updateStreak({}, "2026-06-15");
  assert.equal(s.streak, 1);
  assert.equal(s.best, 1);
  assert.equal(s.lastDay, "2026-06-15");
});
test("updateStreak: same-day repeat is idempotent (no double count)", () => {
  const prev = { lastDay: "2026-06-15", streak: 3, best: 5, freezes: 0 };
  const s = C.updateStreak(prev, "2026-06-15");
  assert.equal(s.streak, 3);
  assert.equal(s.changed, false);
});
test("updateStreak: consecutive day advances and updates best", () => {
  const s = C.updateStreak({ lastDay: "2026-06-15", streak: 5, best: 5, freezes: 0 }, "2026-06-16");
  assert.equal(s.streak, 6);
  assert.equal(s.best, 6);
});
test("updateStreak: one missed day with no freeze resets to 1 but keeps best", () => {
  const s = C.updateStreak({ lastDay: "2026-06-15", streak: 9, best: 9, freezes: 0 }, "2026-06-17");
  assert.equal(s.streak, 1);
  assert.equal(s.best, 9);
});
test("updateStreak: one missed day with a freeze continues the streak", () => {
  const s = C.updateStreak({ lastDay: "2026-06-15", streak: 9, best: 9, freezes: 1 }, "2026-06-17");
  assert.equal(s.streak, 10);
  assert.equal(s.freezes, 0);
  assert.equal(s.usedFreeze, true);
});
test("updateStreak: gap larger than available freezes resets to 1", () => {
  const s = C.updateStreak({ lastDay: "2026-06-15", streak: 9, best: 9, freezes: 1 }, "2026-06-19");
  assert.equal(s.streak, 1); // missed 3 days, only 1 freeze
});

// ---------- weakestFirst ----------
test("weakestFirst: lowest Leitner box first, missing box treated as 1", () => {
  assert.deepEqual(C.weakestFirst([0, 7, 4], { 0: 4, 7: 2, 4: 1 }), [4, 7, 0]);
  assert.deepEqual(C.weakestFirst([0, 7], { 0: 3 }), [7, 0]); // 7 missing -> box 1 -> first
});
test("weakestFirst: stable order for equal boxes", () => {
  assert.deepEqual(C.weakestFirst([2, 5, 9], { 2: 2, 5: 2, 9: 2 }), [2, 5, 9]);
});
