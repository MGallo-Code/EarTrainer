/* Loop - shared runtime config (loaded by both the app and the landing page).
 *
 * WAITLIST_ENDPOINT: where waitlist emails are sent. Leave "" for demo mode
 * (signups are stored in localStorage only). To capture real signups with no
 * backend, create a free form at https://formspree.io and paste its URL here,
 * e.g. "https://formspree.io/f/abcdwxyz". Formspree accepts a JSON POST and
 * emails you each submission. (Getwaitlist / Google Forms also work.)
 */
(function (root) {
  root.LOOP_CONFIG = { WAITLIST_ENDPOINT: "" };
})(typeof window !== "undefined" ? window : globalThis);
