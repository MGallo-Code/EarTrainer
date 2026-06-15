"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../core.js");

test("parseQuery: parses UTM params with or without leading '?'", () => {
  assert.deepEqual(C.parseQuery("?utm_source=tiktok&utm_campaign=duet1"),
    { utm_source: "tiktok", utm_campaign: "duet1" });
  assert.deepEqual(C.parseQuery("a=1&b=2"), { a: "1", b: "2" });
});
test("parseQuery: empty input yields an empty object", () => {
  assert.deepEqual(C.parseQuery(""), {});
  assert.deepEqual(C.parseQuery("?"), {});
});
test("parseQuery: decodes percent- and plus-encoding", () => {
  assert.deepEqual(C.parseQuery("q=hello%20world"), { q: "hello world" });
  assert.deepEqual(C.parseQuery("q=a+b"), { q: "a b" });
});
test("parseQuery: a key with no value becomes empty string", () => {
  assert.deepEqual(C.parseQuery("flag&x=1"), { flag: "", x: "1" });
});
