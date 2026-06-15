/* Loop landing page - waitlist capture + UTM attribution for the validation test.
 * Posts to LOOP_CONFIG.WAITLIST_ENDPOINT (see ../config.js); falls back to
 * localStorage-only "demo" mode when no endpoint is set. Logs view + signup events.
 */
(function () {
  "use strict";
  var ENDPOINT = (window.LOOP_CONFIG && window.LOOP_CONFIG.WAITLIST_ENDPOINT) || "";
  var C = window.LoopCore;
  var utm = C ? C.parseQuery(window.location.search) : {};

  function logEvent(name, extra) {
    try {
      var k = "loop_landing_events";
      var arr = JSON.parse(localStorage.getItem(k) || "[]");
      arr.push(Object.assign({ name: name, ts: new Date().toISOString() }, utm, extra || {}));
      if (arr.length > 500) arr = arr.slice(-500);
      localStorage.setItem(k, JSON.stringify(arr));
    } catch (e) { /* ignore */ }
    try { console.log("[landing]", name, utm); } catch (e) { /* ignore */ }
  }
  function saveSignup(payload) {
    try {
      var k = "loop_waitlist";
      var arr = JSON.parse(localStorage.getItem(k) || "[]");
      arr.push(payload); localStorage.setItem(k, JSON.stringify(arr));
    } catch (e) { /* ignore */ }
  }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

  function submitWaitlist(email) {
    var payload = Object.assign({ email: email, source: "landing", ts: new Date().toISOString() }, utm);
    saveSignup(payload);
    logEvent("waitlist-signup", { email: email });
    if (ENDPOINT) {
      return fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { return { ok: r.ok }; }).catch(function () { return { ok: false, offline: true }; });
    }
    return Promise.resolve({ demo: true });
  }

  function wireForm(formId, emailId, noteId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById(noteId);
      var email = (document.getElementById(emailId).value || "").trim();
      if (!validEmail(email)) { note.style.color = "#fb7185"; note.textContent = "Please enter a valid email."; return; }
      note.style.color = "";
      note.textContent = "Joining…";
      submitWaitlist(email).then(function (res) {
        note.textContent = (res && res.ok === false && !res.demo) ? "Saved — we'll retry sending." : "Thanks! You're on the list.";
        form.reset();
      });
    });
  }

  logEvent("landing-view");
  wireForm("heroForm", "heroEmail", "heroNote");
  wireForm("footForm", "footEmail", "footNote");

  window.__landing = {
    getUTM: function () { return utm; },
    getSignups: function () { try { return JSON.parse(localStorage.getItem("loop_waitlist") || "[]"); } catch (e) { return []; } },
    endpointConfigured: function () { return !!ENDPOINT; }
  };
})();
