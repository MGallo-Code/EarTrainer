# Completeness Critic

I'll review this execution-research report as a skeptical completeness critic. Let me ground my critique in the corpus and the product context.

# Loop Execution-Research Report: Completeness Critique

## Priority 1: Load-bearing claims that are weakly sourced or unverified

- **The entire video-render "watchability" thesis rests on zero direct evidence.** The report repeatedly asserts the falling-note format is "proven" (SeeMusic, Synthesia, EchoWave), but the corpus's own verdicts undercut this: EchoWave et al. are *waveform/spectrum* visualizers, NOT MIDI falling-note renderers, and the only true falling-note prior art is SeeMusic. "The format works for Shorts" is an inference, not a measured fact. No view counts, retention numbers, or share rates for *MIDI-piano-roll duet clips specifically* exist anywhere in the corpus. This is the #1 bet and it has the thinnest evidentiary base in the whole document.

- **K-factor target (>=0.3-0.5) is borrowed from waitlist/referral contexts, not short-form virality.** The K=i×c framework comes from a single vendor blog (getlaunchlist) about product referral loops. Applying it to "duet replies per posted clip × viewer-to-participant conversion" is a reasonable *analogy* but is presented as if it's a measured benchmark. There is no source establishing what K a TikTok music-chain format actually achieves. The GO bar (K>=0.3-0.5) is essentially invented.

- **Nearly every virality multiplier is circular vendor citation.** The corpus is admirably honest that the 2.2x/2.8x retention multipliers, 84.3% hook stat, 4-7x impressions, ~20% reshare-to-like, and 8x-karma figures trace to vendor blogs citing other vendor blogs with zero primary data. The report flags this in a caveat box, but then *still uses these exact numbers in the go/kill gate tables* (e.g. ">=70% first-3s retention = GO"). A founder reading the tables will treat them as hard thresholds. The thresholds are folklore.

- **The "engagement depth > views" success criterion has no calibrated threshold.** "Strong shares + saves + 'how'd you make this' comments + duet/stitch attempts" is qualitatively right but operationally useless as a gate. How many shares per view = GO? The "5K views/200 shares beats 50K/10 shares" line is illustrative, not a decision rule. The single most important success metric is the least quantified.

- **JoyTunes/Simply "2.5x edtech retention" and "$200M revenue" are company-sourced marketing**, flagged in the corpus but used in positioning without that caveat surfacing.

## Priority 2: Gaps and missing angles (these would change the plan)

- **No copyright/licensing analysis for the actual product, only for WoZ clips.** The report notes WoZ clips should favor public-domain progressions to avoid muting. But Loop's *core product* is users working out *real pop/jazz songs* by ear and posting them. A UGC library of recognizable copyrighted songs rendered to audio and posted publicly is a far bigger legal exposure than incumbents face (incumbents license their catalogs; Loop would be hosting user-generated covers). This is a potential existential constraint that is completely unaddressed for the product itself. **If false (i.e. if this triggers takedowns/liability), it changes the entire content/sharing model.**

- **No CAC or unit-economics reality check against the cheap subscription.** Loop plans $5-8/mo ($60-96/yr) — *half* of every competitor. The report celebrates undercutting but never asks: can a freemium consumer app with high content/infra costs (audio rendering, video encoding, storage of a growing UGC library) survive at that price? The competitor data shows the market sustains $120-180/yr. Pricing 50% below the field while needing to fund a 2-8 week pre-habit retention gap (per the curriculum stream) is asserted as an advantage with no LTV/CAC model. **This is a strategic bet presented as a free win.**

- **The iOS problem is acknowledged but never resolved or sized.** It appears as a caveat in all four streams, yet the plan still says "cross-post to TikTok + IG" (iOS-heavy) and drive to a waitlist/product that iOS users *cannot use* on web. The report never estimates how much this depresses the WoZ conversion gate, nor does it propose isolating iOS traffic so the test isn't poisoned. "Segment for it" is hand-waved. The whole distribution channel (short-form) is structurally mismatched with the only working capture platform (desktop/Android web). **This contradiction sits at the center of the go/kill decision and is unresolved.**

- **No empty-network / cold-start plan.** The duet card mechanic requires a *second person* to add the next layer. At launch there is no one to duet with. The competitor stream calls the duet card "the entire wedge," but neither the curriculum nor the integrated plan addresses how the first 1,000 duet cards get answered. A social loop with no network is just a solo recording tool. This is the single biggest product-design gap.

- **WoZ test validates the wrong thing relative to the product.** Hand-made clips test "is a duet clip watchable." They do NOT test: (a) will people actually *play the next layer by ear* (the hard, friction-heavy core action), (b) will the auto-render look as good as hand-made (corpus flags this false-positive risk but the plan doesn't mitigate it), or (c) whether the *capture-and-play* experience is fun. The test de-risks shareability of the artifact but not the participation mechanic that produces it. The plan treats "fun to watch" and "fun to make/duet" as one bet; they are two.

- **No definition of who actually answers a duet during the WoZ test.** The hand-made clips are posted by the founder. When someone wants to "add the next layer," there is no product. The test measures intent-to-participate (comments, stitch attempts) as a proxy but cannot measure real participation conversion — which is half of K.

- **Curriculum stream never connects to the duet card mechanic concretely.** It produces an excellent solo ear-training ladder, but the product's wedge is *collaborative layer-building*. How does a Leitner/FSRS recognition schedule interact with "find the bass layer someone else posted"? The two halves of the product (drill core + duet loop) are researched in isolation and never integrated.

## Priority 3: Internal contradictions

- **Posting cadence: "front-load volume, 2-4 clips/day" vs. "keep hand-made clips deliberately close to auto-render quality."** Producing 28-56 hand-made-but-deliberately-rough clips in 14 days, each engineered with tested hooks, seamless loops, and per-song hook variants, across 5-10 accounts, is a massive content-production load for what's implied to be a solo founder. The marketing stream's own creator-outreach section assumes a solo founder (recommends DMs over a team). These labor assumptions collide.

- **"Build NO renderer for the WoZ test" vs. "keep clips close to real auto-render quality."** You cannot ensure fidelity to an auto-render you haven't built. Either you build enough of the renderer to know what it looks like (contradicting "build zero"), or you guess — risking the exact false-positive the corpus warns about.

- **Multi-account strategy (5-10 accounts, 3-10x/day) vs. Reddit's strict authenticity rules.** Running account networks is the kind of inauthentic-amplification behavior that gets accounts banned on the very platforms (and adjacent communities like r/piano) where the highest-intent audience lives. The report treats these as independent tactics; they share reputational risk.

- **Free tier: "do NOT gate the shareable clip" vs. subscription-first model.** If the acquisition engine (the clip) must stay free and ungated to drive virality, and the curriculum says users need 2-8 weeks before habit forms, then the thing people would pay for is unclear. "Gate on creations/day" is offered, but if creation drives virality you don't want to throttle it either. The monetization surface is squeezed from both sides and never resolved.

## Priority 4: Over-optimistic assumptions

- **Video-render feasibility is over-sold as "solidly feasible."** The corpus's own risk list ranks A/V sync as "the highest-effort, highest-risk part," flags Android large-canvas encode failures on the *core beachhead platform*, and notes mobile GPUs are weaker. "Feasible for an MVP" is fair; "the renderer is not the bottleneck" is repeated as reassurance while the same section enumerates four hard, platform-specific failure modes. The engine is feasible but not easy, and the report's confident tone undersells the Android encode risk specifically.

- **Curriculum effort is dramatically understated.** "Ship the spine almost verbatim" and "the science is settled" obscures that the corpus explicitly says *no public source gives per-level note counts, ranges, or tempos* — meaning every level boundary, difficulty curve, and pacing decision must be set by Loop's own playtesting (5-10+ rounds, per the user's own dev process). Authoring a graded ladder is also large content work (EarMaster's comparable course = 500 exercises / 63 chapters). "Verbatim" hides months of content authoring and tuning.

- **Virality benchmarks assume the tail will pay off.** The Buffer data the report leans on says the *median stays flat at ~500 views regardless of cadence* — all gains are in the 90th-percentile tail. The plan's logic ("more lottery tickets") is sound, but 28-56 clips is a *small* number of lottery tickets against a tail that, for sub-5K accounts, now averages ~350 views/post (down 23% YoY). The realistic expected outcome of a 2-week, low-volume, multi-fresh-account organic push is *no viral hit*, which would force reliance on the $200-400 paid boost — turning an organic-virality test into a paid-acquisition test that doesn't validate the same thing.

- **"K=0.5 still eventually doubles the base" is irrelevant on a 2-week timeline.** K<1 means the loop decays; "eventually doubles" describes asymptotic cumulative reach over many cycles, not 14 days. Citing it as encouraging for a 2-week test is a misread of the math.

## Priority 5: What would change the plan if false

1. **If recognizable-song UGC creates copyright liability** → the entire UGC duet library model (the wedge) is unviable as designed; must pivot to original/public-domain progressions, which kills the "work out songs you love" appeal.
2. **If the auto-render can't match hand-made clip quality** → a GO on the WoZ test is a false positive and the renderer build is wasted.
3. **If iOS drop-off dominates the funnel** → the WoZ conversion gate is structurally depressed and may read as KILL when the format is actually fine; or the addressable market is too small to support the cheap subscription.
4. **If nobody answers duet cards (cold-start)** → the social loop never ignites regardless of clip quality; K=0 by construction at launch.
5. **If "fun to watch" ≠ "fun to make"** → clips go viral, waitlist fills, but activation/retention collapses because the core play-by-ear action is too hard, and the curriculum's own 90-100% mastery gate compounds the friction.

## The single most important thing to get right

**Redesign the WoZ test so it isolates participation, not just watchability — and pre-commit, in writing, to a participation threshold, not a views/waitlist threshold.** The report's framing collapses two distinct bets into one: "is the clip fun to watch" and "will someone actually find the next layer by ear and add it." Only the second creates the duet chain that makes Loop a product instead of a novelty clip generator. A clip can be highly shareable and still produce zero duets if the by-ear participation action is too hard or has nowhere to happen. The test as designed can return a confident GO on a format that has no working loop underneath it. Build the test to force a real "I tried to add the next layer" action (even a crude Wizard-of-Oz: "DM us your layer and we'll add it"), measure that conversion explicitly, and treat *that* number — not views, not waitlist signups — as the gate. Everything downstream (the renderer, the curriculum, the cheap subscription) is justified only if the participation loop closes.
