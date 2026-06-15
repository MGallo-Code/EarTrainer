# Loop - Next Steps Research (2026-06-15)

Confirmed. The corpus's code claims are accurate: `initMIDI()` is called at line 713 inside `init()`, which fires on `DOMContentLoaded` (line 716), and `requestMIDIAccess({sysex:false})` is at line 653. Note one nuance worth flagging: the existing `session.streak` is a within-session correct-answer counter, NOT a daily-return streak. That's a real, useful detail for the plan. I have everything I need.

## Loop - Next Steps (ranked)

**Bottom line:** Run a barbell, not a single bet. Ship a tiny "retention + postable artifact" slice of the drill core *and* stand up the fake-door duet validation in the same session, then gate the expensive duet render engine behind the validation result. The lean canon is unambiguous: validate the riskiest, most-correlated assumption (duet clip watchability + by-ear participation) before engineering it [source: https://medium.com/@nachiketpatel/how-to-validate-your-leap-of-faith-assumptions-b1ad62957076], and "optimize after PMF, not before" [source: https://medium.com/lean-stack/pivot-before-product-market-fit-optimize-after-91e28b631768]. But the counter-principle disciplines the barbell: viral mechanics are "lipstick on a pig" if the core doesn't retain, and retention is the metric closest to PMF [source: https://medium.com/lean-stack/pivot-before-product-market-fit-optimize-after-91e28b631768]. So the core work that earns its place pre-gate is *only* the slice that makes the validation test trustworthy: a retainable loop, instrumentation, and a postable end-of-session artifact.

One code reality that sharpens the plan: Loop's existing `session.streak` (app.js line 76/518) is a within-session correct-answer counter, not a daily-return streak. The retention work below is genuinely net-new, not a rename.

---

### 1. Build now (this session)

Three items. All are vanilla-JS, reuse existing Leitner/localStorage, need no backend, and each either makes the drill core retainable or cheaply advances the duet validation. None competes with the validation test; they feed it (more activated, returning users = a more trustworthy participation signal).

**BUILD NOW #1 - "Today" home screen with session-complete recap (drill-core retention)**
- **What:** On load, compute the day's session from existing Leitner data = items *due for review* + current-level new items, ordered weakest/most-overdue first, framed as a single CTA ("Start today's 5-minute practice"). End every session on a one-screen recap: this-session accuracy, levels touched, what improved ("you got stronger at diatonic 7ths"), daily-goal-met ring, and ONE highlighted next action.
- **Why highest-leverage:** Loop already computes due/weak state via Leitner but surfaces none of it. Surfacing the daily commitment is the single highest-evidence retention lever, and end-of-session is the exact moment Duolingo found its biggest placement win (moving the prompt to after the lesson lifted DAUs ~20%) [source: https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker/]. A "due today" queue ordered weakest-first is the pattern every SR app and ear-training competitor converges on [source: https://migaku.com/blog/language-fun/spaced-repetition-in-2026-how-it-actually-works]. Critically, this recap screen is the natural future home for the duet/share CTA, so it advances the drill core AND the strategic wedge at once.
- **Scope (M):** New "Today" view + recap card; sort existing per-item accuracy/box data weakest-first into the session queue; reuse localStorage. Mostly view + a selection/sort change, not new infra.
- **Verification:** Unit (node:test) - session-builder pulls due+weak items in correct weakest-first order from a seeded Leitner state; recap aggregates accuracy/levels correctly. Playwright - load app, complete a session, assert "due today" count renders, weak-item-first label shows, recap card appears at session end with the next-action button.

**BUILD NOW #2 - Daily-return streak (decoupled from goal) + grace/freeze (drill-core retention)**
- **What:** A real daily-return streak that advances on ANY completed session (rename/repurpose away from the within-session counter), with a low user-settable daily goal (default 5 min / one level-set) shown as a separate progress ring. Add a streak freeze / rest-day and a local-timezone day boundary. Milestone callout at 7/30/100 on the recap card.
- **Why highest-leverage:** Decoupling daily goal from streak is Duolingo's clearest published win (+3.3% Day-14 retention; ~40% of daily-active non-streakers had the over-high goal) [source: https://blog.duolingo.com/improving-the-streak]. A high forced goal is itself the habit barrier, and bingeing predicts churn, so a low default is correct [source: https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/]. Matches the ToneGym/Melodics 5-min pattern [source: https://support.melodics.com/en/articles/6777043-what-are-streaks]. The freeze is what keeps the streak alive past the first missed day (Weekend Amulet: +4% week-later return, ~5% less streak loss) [source: https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/] - this matters acutely for Loop's irregular-schedule adult beachhead. Note: corpus verdict corrected the streak-wager figure to **+14% Day-7** (not Day-14), and treat the freeze as helpful-but-not-mandatory; ship it anyway because a bare streak that breaks is a known quit trigger.
- **Scope (S-M):** localStorage-only. Add lastActiveDate + freeze count + goal target; goal ring + streak counter on Today/recap; day-boundary logic. No backend.
- **Verification:** Unit - streak advances on minimal completion, holds across a frozen day, rolls over correctly at local midnight, breaks after grace exhausted; goal completion is independent of streak. Playwright - complete one minimal session, assert streak increments and goal ring fills independently; simulate a skipped day with freeze and assert streak survives.

**BUILD NOW #3 - In-app duet fake door + first-session postable artifact (validation track)**
- **What:** (a) Add a non-functional "Record your layer / Duet this" button on the recap screen that opens a "Coming soon - join the waitlist" panel and logs click-through (localStorage + console event). (b) Make the recap card a screen-recordable "result card" (a small shareable artifact), not just a number.
- **Why highest-leverage:** This directly measures the say-do gap on the #1 unproven, concept-inverting assumption the critic flagged - *will people actually add the next layer by ear* - behaviorally, inside the product, at near-zero build cost [source: https://userpilot.com/blog/fake-door-testing/]. Behavioral click data beats stated preference. Ending the session in a postable artifact ensures the validation campaign exercises the *real* wedge, not a hypothetical one. Under-building this makes the whole validation test invalid.
- **Scope (S):** One button + one coming-soon panel + one event log; style the existing recap card for capture. No render engine, no MIDI-to-video.
- **Verification:** Unit - fake-door click logs a structured event; activation funnel events (first-visit -> first-round -> first-correct -> duet-click) record in order. Playwright - click "Duet this," assert coming-soon panel renders and event is logged; assert result card renders captured-ready.

> Out-of-session companion (not code, do in parallel this session): stand up the fake-door **landing page + waitlist** (Carrd/Framer + GetWaitlist) and hand-make 5-10 duet clips in Logic + a free piano-roll visualizer (no engine), with the go/kill gate pre-committed in writing before posting [source: https://userpilot.com/blog/fake-door-testing/]. This is the cheapest path to the answer that gates everything (~$0-150, 1-2 weeks). If a single agent session must pick code only, ship #1-#3; #3's in-app fake door pairs with this campaign.

---

### 2. Ranked backlog (ordered by leverage)

| # | Step | Impact | Effort | Rationale |
|---|------|--------|--------|-----------|
| 1 | "Today" home: due+weak-first queue + session recap card | High | S-M | Highest-evidence retention lever; surfaces existing Leitner; end-of-session is the +20% DAU placement and the future duet-CTA home [source: https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker/] |
| 2 | Daily-return streak decoupled from low daily goal + grace/freeze | High | S-M | +3.3% Day-14 from decoupling; freeze keeps habit alive for irregular adult schedules [source: https://blog.duolingo.com/improving-the-streak] |
| 3 | In-app duet fake door + postable result card | High | S | Behavioral test of the #1 unproven participation assumption; near-zero cost [source: https://userpilot.com/blog/fake-door-testing/] |
| 4 | Fake-door landing page + 5-10 hand-made duet clips + pre-committed gate | High | S | Validates the riskiest correlated bet before the expensive engine; ~$0-150/1-2wk [source: https://medium.com/lean-stack/pivot-before-product-market-fit-optimize-after-91e28b631768] |
| 5 | Funnel instrumentation (first-visit -> round -> correct -> duet-click; D1/D7 return) | Med-High | S | Tells you which symptom you have (retention vs acquisition); the duet test needs these metrics too [source: https://xianli.substack.com/p/a-simple-prioritization-framework] |
| 6 | No-setup "Try it" first-run (skip table, guided 2-3 step by-ear micro-round) | High | M | Manufactures one meaningful action <60s; the aha is buried below setup chrome [source: https://www.junoschool.org/article/duolingo-onboarding-experience/] |
| 7 | Defer MIDI permission behind a "Connect keyboard (optional)" gesture button | High | S | Chrome 124+ fires a permission prompt for ALL Web MIDI on the current on-load `initMIDI()` (app.js 653/713) before any value [source: https://developer.chrome.com/blog/web-midi-permission-prompt] |
| 8 | 3-tap self-placement ("New / Know some / Advanced") jumping to a gated level | High | S | Duolingo-style 1-tap placement; beachhead bounces if forced through scale-degree 101 [source: https://www.junoschool.org/article/duolingo-onboarding-experience/] |
| 9 | 16-level mastery map (green/amber/locked tiles + per-level bar + next-up highlight) | High | M | Proven motivating layout; goal-gradient bars raise persistence; data already exists via 85% rule [source: https://www.miloriano.com/a-student-friendly-progress-dashboard-that-motivates/] |
| 10 | Optional adaptive placement check (3-5 items) for "know some/advanced" | Med | M | Self-report alone mis-places; short adaptive check is more accurate, reuses grading. Keep optional [source: https://www.junoschool.org/article/duolingo-onboarding-experience/] |
| 11 | Mastery-tied achievement set (level cleared, 100 weak items retired, 7/30/100-day) | Med | M | Badges raise engagement ~25% but only when tied to real mastery, not vanity [source: https://academic-publishing.org/index.php/ejel/article/view/3563] |
| 12 | Per-skill accuracy/trend view (2-week accuracy + avg response time, EarMaster-style) | Med | M | Table stakes for a credible ear trainer; passes metric-to-action. Defer - most chart-heavy [source: https://www.earmaster.com/download/EM_userguide_english.pdf] |
| 13 | Endowed-progress onboarding seed + growth-framed, high-contrast, older-user copy pass | Med | S | Pre-filled progress measurably raises completion (Nunes & Dreze 34% vs 19%); serves the older beachhead [source: https://academic.oup.com/jcr/article-abstract/32/4/504/1787425] |
| 14 | Session settings (tempo, cadence toggle, key range, rounds) | Med | M | Polishes a solution whose growth hypothesis is unvalidated; high-value only post-gate or on PIVOT |
| 15 | In-browser MIDI->MP4 render/duet-layering engine (Mediabunny/WebCodecs/Worker) | High | L | The big bet. Highest-risk build; the validation test exists precisely to gate it. Build only on GO |
| 16 | Rhythm training | Med | L | Real curriculum value but doesn't move the one correlated risk; sequence later |
| 17 | Chord inversions | Low-Med | M | Drill enrichment; not a wedge mover |
| 18 | "Play a real song by ear" / transcription mode | Med | L | Compelling but heavy; build only when the duet layer or a standalone-product decision needs it |
| 19 | Accounts / cloud sync | Med | L | Needed eventually (localStorage streaks die on cache-clear) but blocks nothing pre-gate |
| 20 | PWA/offline + mobile/touch polish | Low | L | Web MIDI is blocked on iOS Safari, so the capture mechanic is dead there until a native shell; lowest pre-gate leverage |
| 21 | Full stats dashboard, leaderboards, per-item heatmaps, vanity totals | Low (neg) | L | Explicitly DON'T - fail the metric-to-action test, clutter older-user clarity, split solo-dev effort [source: https://www.miloriano.com/a-student-friendly-progress-dashboard-that-motivates/] |

---

### 3. Drill-core vs duet/validation - the sequence

**Recommendation: barbell now, then gate.** Do NOT choose between them this session; do the small slice of each that is mutually reinforcing, then gate everything expensive on the validation result.

- **The risk that matters is not "can we build drills."** That's done and de-risked by 5+ free competitors and settled pedagogy. The unproven, concept-inverting risk is the growth hypothesis: will a MIDI duet clip get watched/shared AND will people add the next layer by ear. Lean canon says test the riskiest leap-of-faith assumption first because everything depends on it [source: https://medium.com/@nachiketpatel/how-to-validate-your-leap-of-faith-assumptions-b1ad62957076].
- **But you cannot validate the wedge on an unretained core.** Viral mechanics amplify existing value; they can't fix a product that churns, and a validation test run on a non-retaining loop measures a hypothetical wedge [source: https://www.reforge.com/guides/discover-viral-growth-loops]. That is exactly why the pre-gate core work is scoped to *only* retention + instrumentation + postable artifact (build-now #1-#3), all reusing existing Leitner/localStorage so they ship fast and strengthen, not compete with, the test.
- **Gate the engine.** The in-browser render/duet pipeline is the highest-effort, highest-risk build and the single thing the validation exists to gate. Building it before the clip format is proven is the core sequencing error both your internal plan and the lean canon warn against [source: https://medium.com/lean-stack/pivot-before-product-market-fit-optimize-after-91e28b631768]. The asymmetry is decisive: validation is ~$0-150 / 1-2 weeks; the engine is weeks-to-months and is wasted if the clip doesn't spread.
- **Caveats from the corpus to bake into the gate:** weight shares/saves/"here's my layer" comments and the in-app fake-door click-through over raw views (vanity-view spikes cause false GOs); annotate Wizard-of-Oz results for iOS drop-off (Web MIDI is dead on iOS Safari, so iOS-driven drop is not a format failure); the numeric gates (KILL <5% / PIVOT 5-8% / GO >=8%, first-3s >=70%, K 0.3-0.5) are your own tunable targets, not canon, and an 8% GO bar implicitly assumes warm/targeted traffic [source: https://getlaunchlist.com/blog/viral-coefficient-k-factor-guide].
- **Branch on outcome:** On GO, build the render engine (backlog #15). On PIVOT toward a standalone note-checker, the deferred core enrichment (onboarding #6-#8, settings #14, mastery map #9) becomes the high-value first batch because the drill core then *is* the product.

---

### 4. What to explicitly NOT do yet (and why)

- **The in-browser MIDI->MP4 render/duet engine.** It's the most expensive, riskiest build and the exact thing the cheap validation test exists to gate. Building it blind is the textbook "optimize before PMF" error [source: https://medium.com/lean-stack/pivot-before-product-market-fit-optimize-after-91e28b631768].
- **Full stats dashboard, leaderboards, per-item heatmaps, multi-metric charts, vanity totals ("total notes played").** They fail the metric-to-action test, clutter the screen against the older-adult clarity need, and divert solo-dev time from the recap/streak/map that actually drive retention [source: https://www.miloriano.com/a-student-friendly-progress-dashboard-that-motivates/]. The session recap + mastery map cover the real motivation surface.
- **Rhythm, chord inversions, "play a real song"/transcription, deep session settings.** All are real drill-core value, but each is weeks of work that does NOT move the one correlated risk the thesis rests on. Doing them now polishes a solution whose growth hypothesis is unvalidated and yields "nice app!" praise instead of "this solves my problem" [source: https://www.curiosum.com/blog/stop-overdesigning-what-to-skip-before-product-market-fit]. Queue settings/onboarding as the first post-gate batch, especially on a PIVOT.
- **Accounts / cloud sync, PWA/offline, mobile/touch polish.** Flag cloud sync as the eventual dependency (localStorage streaks die on cache-clear), but it blocks nothing pre-gate. iOS/mobile polish is the lowest-leverage pre-gate work because Web MIDI is blocked on iOS Safari, so the capture mechanic is dead there until a native shell ships [source: https://developer.chrome.com/blog/web-midi-permission-prompt].
- **Aggressive/compulsive streak framing.** Keep the default goal low, ship the grace/freeze, and consider an optional weekly mode; an anxiety-driven "never miss a day" streak backfires for irregular-schedule adult learners [source: https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/].

**Relevant files:** app source at `/Users/michael/Documents/Projects/EarTrainer/web/app.js` (MIDI init line 653/713; within-session streak line 76/518 to repurpose), `/Users/michael/Documents/Projects/EarTrainer/web/core.js`, tests in `/Users/michael/Documents/Projects/EarTrainer/web/test/`; strategy docs in `/Users/michael/Documents/Projects/EarTrainer/research/` (esp. `10-critique.md`, `13-validation-test-plan.md`, `execution/05-integrated-plan.md`); product goals in `/Users/michael/Documents/Projects/EarTrainer/GOALS.md`.

## Sources

- [Improving the streak / Daily Goal — Duolingo blog & community](https://blog.duolingo.com/improving-the-streak) `Vendor/Docs`
- [How Streaks keep Duolingo learners committed to their language goals](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/) `Vendor/Docs`
- [Designing A Streak System: The UX And Psychology Of Streaks — Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-streak-system-ux-psychology/) `Community`
- [Spaced Repetition in 2026: How It Actually Works (Migaku) + Anki FSRS](https://migaku.com/blog/language-fun/spaced-repetition-in-2026-how-it-actually-works) `Community`
- [What are Streaks? (Melodics Support) + ToneGym homepage](https://support.melodics.com/en/articles/6777043-what-are-streaks) `Vendor/Docs`
- [Analysing the Impact of Gamification Techniques on Engagement, Motivation, and Knowledge Retention (SEM study)](https://www.researchgate.net/publication/385569718_Analysing_the_Impact_of_Gamification_Techniques_on_Enhancing_Learner_Engagement_Motivation_and_Knowledge_Retention_A_Structural_Equation_Modelling_Approach) `Peer-Reviewed`
- [Duolingo gamification explained](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo) `Community/Industry analysis`
- [EarMaster - Ear Training, Sight-Singing and Rhythm Training App](https://www.earmaster.com/products/ear-training-sight-singing/earmaster-software.html) `Vendor/Docs`
- [A Student-Friendly Progress Dashboard That Motivates](https://www.miloriano.com/a-student-friendly-progress-dashboard-that-motivates/) `Community/Practitioner`
- [Lean Startup Principles: Vanity Metrics and Actionable Metrics](https://effectivesoftwaredesign.com/2021/03/23/lean-startup-principles-vanity-metrics-and-actionable-metrics/) `Community/Practitioner`
- [The Endowed Progress Effect: How Artificial Advancement Increases Effort](https://www.researchgate.net/publication/23547282_The_Endowed_Progress_Effect_How_Artificial_Advancement_Increases_Effort) `Peer-Reviewed`
- [A Guide To Interface Design for Older Adults](https://adchitects.co/blog/guide-to-interface-design-for-older-adults) `Community/Practitioner`
- [Session Recap | Knack Help Center](https://help.joinknack.com/en/articles/9524445-session-recap) `Vendor/Docs`
- [How Motivation Dashboards Improve Study Habits](https://www.quizcat.ai/blog/how-motivation-dashboards-improve-study-habits) `Community/Practitioner`
- [The First 60 Seconds / Mobile App Onboarding Best Practices (activation + retention data)](https://rubyroidlabs.com/blog/2026/02/ux-onboarding-first-60-seconds/) `Community`
- [The First 60 Seconds: What's Trending in Apps Right Now (2026)](https://appinstitute.com/the-first-60-seconds-whats-trending-in-apps-right-now-2026/) `Community`
- [The Duolingo Onboarding Experience: A 5-Minute Masterclass in User Value](https://www.junoschool.org/article/duolingo-onboarding-experience/) `Community`
- [Access to MIDI devices now requires user permission (Chrome for Developers)](https://developer.chrome.com/blog/web-midi-permission-prompt) `Vendor/Docs`
- [Yousician setup / Simply Piano microphone requirements (support + reviews)](https://support.yousician.com/hc/en-us/articles/204799551-Choosing-your-set-up-for-piano) `Vendor/Docs`
- [A Guide to Interface Design for Older Adults (Toptal) + Appcues aha-moment tour data](https://www.toptal.com/designers/ui/ui-design-for-older-adults) `Community`
- [Streamlining Placement Testing with an Adaptive, Branched Exam (UCF TOPR)](https://topr.online.ucf.edu/streamlining-placement-testing-with-an-adaptive-branched-exam/) `Community`
- [12 Apps with Great User Onboarding (2026 Examples) + App Onboarding 5 Best Practices](https://uxcam.com/blog/10-apps-with-great-user-onboarding/) `Community`
- [How to Validate your Leap of Faith Assumptions](https://medium.com/@nachiketpatel/how-to-validate-your-leap-of-faith-assumptions-b1ad62957076) `Community`
- [Pivot Before Product/Market Fit, Optimize After (Ash Maurya)](https://medium.com/lean-stack/pivot-before-product-market-fit-optimize-after-91e28b631768) `Community`
- [A Simple Prioritization Framework for Solo Founders](https://xianli.substack.com/p/a-simple-prioritization-framework) `Community`
- [Viral Loops: Engineering Growth Into The Product DNA / Growth Loops guidance](https://www.superbusinessmanager.com/viral-loops-engineering-growth-into-the-product-dna/) `Community`
- [How to Run a Smoke Test Landing Page to Prove Demand + Fake Door Testing](https://userpilot.com/blog/fake-door-testing/) `Community`
- [Stop overdesigning: what to skip before Product-Market Fit (Curiosum)](https://www.curiosum.com/blog/stop-overdesigning-what-to-skip-before-product-market-fit) `Community`
- [Traction/validation over distribution (search synthesis, multiple sources)](https://www.shopify.com/blog/validate-product-ideas) `Community`
