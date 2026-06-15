I'll write this section grounded in the corpus, focusing primarily on the GTM dimension (`gtm-growth`) plus the virality/blow-up evidence from `whitespace-blowup` and pricing/channel facts from the other dimensions. Let me give it the verified treatment, applying corrected verdicts where the corpus flags them.

## Go-to-Market, Growth & Virality

The chosen wedge is **Loop** ("Duolingo for playing by ear" with a duet button). Its GTM must do two things at once: (1) survive against a GV-backed, ~$1B Simply that outspends on paid acquisition [source: https://en.globes.co.il/en/article-joytunes-raising-50m-at-1b-valuation-1001375306], and (2) ship a self-propagating UGC loop, because paid-only is the losing game in this category. The plan below leans on the one mechanic no incumbent has, then layers the proven low-CAC channels (manufacturer bundles, creators, teachers) on top.

### How incumbents actually grew (the playbook to beat)

Music-learning apps scaled on a **mostly paid playbook, not virality**:
- **Flowkey** scaled primarily through Apple Search Ads, doubling ROAS and growing downloads 80% in one year (900% in Asia) while raising spend 70% [source: https://splitmetrics.com/cases/flowkey-apple-search-ads-optimization/].
- **Yousician** went global via YouTube TrueView app-promotion ads placed in front of large music creators, plus Google/Meta paid; ~20M monthly users across Yousician + GuitarTuna (combined, not the learning app alone) [source: https://getlatka.com/companies/yousician].
- **Simply Piano** still leans on heavy paid (its recognizable TV/video creative) and remains the revenue leader: Sensor Tower estimates ~400K US App Store downloads and ~$5M US App Store revenue in a recent month [source: https://app.sensortower.com/overview/1019442026?country=US].

The two genuine organic/UGC engines in the broader space are **Duolingo** (product-led) and **Smule** (music UGC). Loop's strategy is to be the first piano-adjacent app to import both.

### The virality / network-effect mechanic: the By-Ear Duet Card

The blow-up bet is the **duet card**: a self-propagating unit where MIDI auto-alignment makes a beginner's by-ear attempt clean enough to be worth sharing. The grounding for why this can scale:

- **Smule proves music UGC scales.** Smule reports ~50M monthly users and ~20M songs/performances per day; its core loop is the "sing-with-X" / duet invite [source: https://www.entrepreneur.com/en-in/technology/smule-a-music-app-connects-50-million-users-globally/329972]. Critically, **Smule's scale figures date to ~2018-2019**, so treat them as historical proof-of-concept, not current scale.
- **MIDI is the unlock mic-based rivals structurally lack.** Smule's loop is singing, where wonky pitch makes ugly clips; MIDI quantizes a beginner's sloppy timing into a clean stitch. The product, not the user, makes the clip good.
- **No piano-learning app has a record/layer/share loop.** Across the major learning apps, none market multitrack record+layer as a core feature (directionally supported; the precise "0 of 8" tally traces to a single survey, so cite it as a survey claim, not a hard fact) [source: https://www.toptenreviews.com/piano-apps-to-advance-your-learning-practice-tracking-notation-and-backing-track-software]. Melodics owns gamified MIDI timing but includes no by-ear/ear training and is theory-light [source: https://melodics.com/midi-keyboard].
- **BandLab confirms a social-creation flywheel reaches massive scale in music** (100M users by March 2024) [source: https://www.musicbusinessworldwide.com/music-making-app-bandlab-surpasses-100-million-users/]. The caution: BandLab's revenue per user is thin (the ~$48M ARR is a single-aggregator estimate, unverified), so **the social loop is reach, not revenue** — keep monetization in the paid skill core.

### The retention engine that compounds the loop

A viral loop without retention leaks. Loop ports Duolingo's proven mechanics, which are the engine behind its ~80% organic acquisition [source: https://www.adexchanger.com/strategy/organic-marketing-is-duolingos-lingua-franca/]:

| Mechanic | Verified effect | Source |
|---|---|---|
| Streaks (first-week) | First-week-active users 3.6x more likely to keep learning | [source: https://foundercoho.substack.com/p/inside-duolingos-6b-playbook-gamification] |
| Leagues | ~25% lift in lesson completion | [source: https://foundercoho.substack.com/p/inside-duolingos-6b-playbook-gamification] |
| Leaderboards | Users on XP leaderboards complete 40% more lessons/week | [source: https://foundercoho.substack.com/p/inside-duolingos-6b-playbook-gamification] |
| Streaks at scale (durability) | Churn cut from 47% (2020) to 28% (2024, Western markets); ~10M users with 365+ day streaks (~a quarter of DAU) | [source: https://www.pocketgamer.biz/more-than-10-million-duolingo-users-have-a-365-day-streak/] |

Ear training is uniquely suited to 5-minute daily reps, so this engine transfers cleanly. Note Duolingo's conversion ceiling is the aspiration, not the expectation: ~8% of MAU convert to paid (it rose from ~3% in 2020 to ~8.8% in 2024) [source: https://foundercoho.substack.com/p/inside-duolingos-6b-playbook-gamification]; a new entrant should plan for 2-4% freemium conversion at launch.

### The beachhead channel: keyboard-manufacturer bundles

The **single highest-intent, near-zero-CAC channel** is the keyboard-manufacturer bundle, and it is the recommended beachhead. Buying a digital piano grants free months of an app via a registration code at the exact moment of purchase:

- Skoove gives 3 months free Premium with Alesis and Kawai keyboards; **Kawai stacks Skoove + Tomplay + Piano Marvel codes on one registration** [source: https://kawai.com.au/ca-piano-bonus-offer/]. The card is captured at signup and charged only after the trial — converting a buyer who just spent hundreds at near-zero CAC.
- The channel is **contested but not saturated**: 6+ apps run keyboard bundles (Skoove, Tomplay, Piano Marvel, Playground Sessions, Pianote, ROLI) [source: https://www.playgroundsessions.com/store/keyboard-bundles].

**Loop's differentiated pitch to Casio/Roland/Alesis/Yamaha:** a web-first "scan QR on the box, play instantly, no app install" bundle. This removes install friction *and* the App Store 15-30% cut, giving partners better unit economics than Skoove's app-store-taxed deal. Web-first checkout keeps ~97% of revenue via Stripe (2.9% + $0.30) versus losing 15-30% to IAP [source: https://www.revenuecat.com/blog/growth/apple-anti-steering-ruling-monetization-strategy/]. This is the persona that converts: recent keyboard buyers are the highest-intent segment, and digital is the dominant entry-level choice [source: https://www.cognitivemarketresearch.com/digital-piano-market-report].

### Creator / influencer + ASO

- **Creator affiliate program with long-term revenue share**, copying Flowkey's model, which targets musician YouTube creators with recurring commissions and is free to join. The rates are partially public (~$25 per trial registration, ~$30 per full-access registration, plus recurring commissions and a lifetime cookie — re-verify before relying) [source: https://www.flowkey.com/en/affiliate-partner]. Give each creator a custom challenge/leaderboard URL for trackable referrals.
- **YouTube/TikTok creator ad placements**, following Yousician's TrueView model in front of large music creators [source: https://getlatka.com/companies/yousician].
- **ASO/paid as the scalable base**, because consumer EdTech has favorable CAC economics: roughly ~$42 CAC and ~3.8-month payback on ~$12 ARPU (single-source benchmark, treat as directional) [source: https://www.saas.wtf/p/2024-customer-acquisition-benchmarks]. But cap dependence on paid — a hobby-scale entrant cannot outspend Simply.

### Teacher / studio B2B2C (acquisition funnel, not revenue)

Treat teachers as **distribution, not a monetizer**. The evidence is explicit:
- Duolingo for Schools blitz-scaled (10K+ teachers and 25K+ students in week 1, 2015) but is **being sunset in July 2027** because the free classroom tier did not justify itself versus consumer monetization [source: https://www.classcentral.com/report/duolingo-for-schools-shutting-down/].

The wedge no incumbent's pipeline can serve: a free, branded teacher dashboard where **by-ear duets become auto-graded homework**. Existing studio tools (My Music Staff, Tonara, AmpliTeach) assign and track practice; note that **Tonara already auto-grades pitch/rhythm/tempo/fluency against a reference recording** [source: https://www.tonara.com/studio-teacher-benefits/], so the precise white space is narrower: **by-ear and improvisation grading**, which no surveyed tool does. Seed classrooms/studios, then convert students and parents to the consumer tier.

### The manufacturer-bundle vs. beginner-hardware lane

A giant already occupies the absolute-beginner hardware bundle: **Duolingo partnered with Loog on a $249, 37-key piano** (shipped ~Nov 2024) feeding its gamified Music course [source: https://musically.com/2024/09/25/duolingo-will-soon-be-selling-a-249-piano-for-its-music-course/]. This pushes Loop toward the **adult by-ear/intermediate segment they ignore**, not absolute beginners — exactly where the wedge lives.

### Phased channel plan

| Phase | Primary channels | Goal / mechanic | Grounding |
|---|---|---|---|
| **Phase 0 — Wedge (desktop/Android-Chromium)** | ASO/Apple Search Ads + Meta paid; SEO on "play by ear" pain | Land the daily habit with the streak/league core where Web MIDI fully works (~80% global; Safari/iOS excluded) | ASA workhorse [source: https://splitmetrics.com/cases/flowkey-apple-search-ads-optimization/]; Web MIDI support gap [source: https://caniuse.com/midi]; streak retention [source: https://foundercoho.substack.com/p/inside-duolingos-6b-playbook-gamification] |
| **Phase 1 — Ignite the loop** | Organic TikTok/IG via the duet card; YouTube/TikTok music-creator affiliate program | Every rendered duet clip carries an open slot, pulling in adjacent keyboard owners; converts the niche-demand risk into top-of-funnel | Smule UGC loop [source: https://www.entrepreneur.com/en-in/technology/smule-a-music-app-connects-50-million-users-globally/329972]; BandLab flywheel [source: https://www.musicbusinessworldwide.com/music-making-app-bandlab-surpasses-100-million-users/]; Flowkey affiliate [source: https://www.flowkey.com/en/affiliate-partner] |
| **Phase 2 — Beachhead bundle** | Keyboard-manufacturer bundles (Casio/Roland/Alesis/Yamaha): web-first "scan QR, play instantly" | Near-zero-CAC capture of recent buyers at point of purchase; better partner economics than app-store-taxed rivals | Skoove/Kawai bundle [source: https://kawai.com.au/ca-piano-bonus-offer/]; web checkout margin [source: https://www.revenuecat.com/blog/growth/apple-anti-steering-ruling-monetization-strategy/] |
| **Phase 3 — B2B2C + iOS expansion** | Teacher/studio dashboard (auto-graded by-ear homework); thin native iOS/iPadOS WebView shell | Sticky distribution channel + reach iPad/iPhone where web-only Web MIDI fails | Teacher channel funnel [source: https://www.classcentral.com/report/duolingo-for-schools-shutting-down/]; iOS Web MIDI gap [source: https://caniuse.com/midi] |

### Honest GTM risks

- **Shareability is existential and unproven.** An auto-rendered MIDI duet clip may not be fun to *watch* the way a singing cover is; assuming ear-training "blows up" like Duolingo (general learning) or Smule (singing) is speculative — a singing cover is inherently more shareable than an interval-quiz score [from corpus: gtm-growth risks; whitespace-blowup risks].
- **Segment-size risk.** "Want to play by ear" may be a passionate-but-narrow niche versus "play my favorite songs from falling notes" that Simply dominates; the share loop is the hedge, but a too-small niche caps even organic growth.
- **UGC licensing exposure.** A successful share loop invites covers of copyrighted songs (Smule's ongoing problem). The MVP should lean on original/public-domain loops, which may dampen the very virality that justifies the bet.
- **Paid-acquisition dependence.** Blended CAC has risen ~10% since 2022 [source: https://www.saas.wtf/p/2024-customer-acquisition-benchmarks]; Loop cannot win a paid bidding war against a $1B Simply, so the organic loop must carry growth, not paid.
- **Bundle channel is contested.** Skoove, Tomplay, Piano Marvel, Playground Sessions, Pianote, and ROLI already hold manufacturer relationships, and a maker may limit one app per box [source: https://www.playgroundsessions.com/store/keyboard-bundles] — the web-first/better-economics pitch is the differentiator that wins a slot.
