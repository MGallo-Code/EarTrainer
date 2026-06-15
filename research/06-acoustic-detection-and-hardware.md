I'll write this section grounded entirely in the corpus. Let me identify the relevant dimensions: `tech-pitch-detection`, `tech-web-midi-audio`, `hardware-path`, `business-pricing`, and the chosen wedge (Loop/EarLoop, MIDI-first).

## Acoustic-Piano Detection & The Hardware Path

The wedge ("Loop") is MIDI-first by design: zero-latency, polyphonic-perfect, velocity-aware capture from the keyboard the user already owns. But two large user pools sit outside that path: acoustic-piano players (no MIDI out) and iOS/iPadOS users (no Web MIDI, ever). This section covers (1) whether mic-based pitch/transcription can grade acoustic playing well enough for the MVP, and (2) the Phase-2 hardware device that turns both gaps into the basic-access wedge.

### Part 1 — Mic-Based Pitch & Transcription Feasibility

#### The accuracy/latency/runtime triangle

Listening to an acoustic piano by microphone and grading it is feasible, but it splits cleanly into three regimes with very different maturity.

| Regime | Best published result | Realistic for MVP? |
|---|---|---|
| **Offline / batch** (record a phrase, then score it) | ByteDance high-res model: 96.72% note-onset F1, 82.47% note F1-with-offset on clean MAESTRO [source: https://ar5iv.labs.arxiv.org/html/2010.01815]; Magenta Onsets-and-Frames 94.8% note F1 [source: https://arxiv.org/pdf/1710.11153] | Yes — turn-based "play-then-grade" |
| **Streaming, near-offline accuracy** | 96.52% onset F1 but at **380ms latency** [source: https://arxiv.org/html/2503.01362]; Mobile-AMT cuts compute ~83% but still ~174ms [source: https://eurasip.org/Proceedings/Eusipco/Eusipco2024/pdfs/0000036.pdf] | Borderline; fine for turn-based, too slow to feel live |
| **Live polyphonic (<30ms, the latency musicians feel)** | Collapses: onset F1 only ~31.55% at 10ms tolerance, ~37.38% at 30ms (2025 causal-AMT) [source: https://arxiv.org/html/2509.07586] | **No — research-grade R&D bet, not a v1 promise** |

The takeaway: real-time polyphonic acoustic grading at the latency a player actually perceives is essentially unsolved as of mid-2026. The product must frame acoustic grading as **turn-based** ("play the phrase, then get scored"), not live.

#### The only in-browser option: Spotify Basic Pitch

Basic Pitch is the only production-grade in-browser polyphonic transcriber. It is tiny (16,782 params), runs via Web Audio with a published TypeScript build, and is instrument-agnostic [source: https://ar5iv.labs.arxiv.org/html/2203.09893]. But two caveats matter:

- It is **batch/offline**: it decodes an AudioBuffer and runs a single `evaluateModel()` pass over the whole clip; it can window long files but is not a live mic stream [source: https://github.com/spotify/basic-pitch-ts].
- Because it is one-size-fits-all, it is **much weaker on piano** than piano-specialized models: only ~70.9% no-offset F-measure vs ~95.2% for Onsets-and-Frames [source: https://ar5iv.labs.arxiv.org/html/2203.09893].
- "Lightweight" refers to model size, not RAM: the paper reports a ~951MB peak-memory measurement on a ~7:45 file, so runtime memory is the real in-browser constraint [source: https://ar5iv.labs.arxiv.org/html/2203.09893].

The heavy, accurate models (ByteDance ~20M params; Google MT3 transformer-scale, ~0.80 onset-offset F1, multi-instrument) are server-side only [source: https://ar5iv.labs.arxiv.org/html/2111.03017]. That naturally supports a two-tier split: cheap on-device Basic-Pitch for free/basic, server-side ByteDance/MT3-class for a paid "deep analysis" tier.

#### Monophonic is solved; polyphonic is the hard part

Single-note ear-training (one note at a time) is effectively solved in-browser and needs no server, no model download, and works on Safari/iOS where Web MIDI fails:

- CREPE hits 0.999/0.999/0.995 raw-pitch accuracy at 50/25/10-cent thresholds **on clean synthetic audio**; on real-instrument audio it drops to ~0.967/0.953/0.909, so expect the real-world end [source: https://ar5iv.labs.arxiv.org/html/1802.06182]. Google SPICE matches CREPE (~90.7% RPA, self-supervised) [source: https://ar5iv.labs.arxiv.org/html/1802.06182].
- Classic YIN/autocorrelation runs fully client-side with cent-level accuracy and zero model download — ideal for a free-tier single-note/interval mode that works everywhere [source: https://alexanderell.is/posts/tuner/].

This is a useful hedge for Loop: a monophonic, fully-client-side ear-training mode is a launch-ready free hook that even covers iOS.

#### The real-world reality check

Every headline number above comes from clean studio recordings. Models "severely overfit to acoustic properties of training data," so a living-room phone mic, reverberant room, and out-of-tune piano will score materially lower. Reverb and pitch-shift augmentation recover only modest out-of-distribution F1 (single-digit-percent gains); additive-noise augmentation barely helps [source: https://arxiv.org/abs/2402.01424]. False negatives ("you played it wrong" when the user didn't) are trust-killers for the beginner/by-ear persona.

The incumbents already concede this. Simply Piano and Yousician mic-detect acoustic notes but "mishear octaves or drop notes" on chords; Simply's own help center tells users to switch to MIDI to fix chord recognition [source: https://piano-help.hellosimply.com/en/articles/6210608-ways-to-improve-note-recognition-in-simply-piano-for-ios-keyboard-electronic-piano]. flowkey acknowledges mic detection is condition-sensitive and recommends 440Hz tuning, low background noise, and repositioning the device / opening the lid [source: https://help.flowkey.com/en/articles/651003-can-i-use-an-acoustic-piano-with-flowkey]. This matters doubly for Loop's killer mechanic: **MIDI is what lets the duet card produce a clean stitch.** Mic pipelines that drop notes structurally cannot quantize a beginner's sloppy attempt into a shareable clip, which is exactly why incumbents could not bolt on the loop even if they tried.

#### MVP recommendation for acoustic detection

- **Primary path stays MIDI** (perfect, free, zero-latency, polyphonic) — make "plug in your keyboard" the frictionless onboarding. This is the spine of the duet/stitch mechanic.
- **Acoustic = turn-based "play-then-grade"** via an offline Basic-Pitch pass over a recorded phrase. Set expectations: ~70-90% piano F1, scored after the phrase, not live. Do **not** promise live acoustic feedback (the <30ms regime is ~31-37% F1).
- **Ship a fully-client-side monophonic mode first** (YIN/CREPE) as a free hook that also works on iOS/Safari.
- **Reserve the heavy server-side transcriber** (ByteDance/MT3-class, with velocity ~80.9% and pedal ~91.9% F1 [source: https://ar5iv.labs.arxiv.org/html/2010.01815]) as a paid tier, where compute cost justifies the price.

Acoustic mic grading is a fallback that broadens reach, not the foundation. The clean-stitch duet loop needs MIDI.

### Part 2 — Phase-2 Hardware

#### The recommended archetype: a thin iOS shell + lowest-BOM wired "duet bar"

The hardware bet should not be a flagship LED keyboard. The corpus points to a far cheaper, more defensible wedge anchored to a real platform gap.

**The gap that justifies hardware: iOS has no Web MIDI, permanently.** Web MIDI is unsupported in Safari (desktop and iOS) through Safari 26.5, declined since 2020 over fingerprinting concerns, capping global support at ~80.15% [source: https://caniuse.com/midi]. It works in Chrome 43+, Edge 79+, Firefox 108+ — i.e. the desktop/Android-Chromium majority — but no browser on iPhone/iPad can do Web MIDI natively [source: https://caniuse.com/midi]. The only existing iOS Web-MIDI browsers are unreliable (the original "Web MIDI Browser" app is last-updated 2016, rated 3.3/5) [source: https://apps.apple.com/us/app/web-midi-browser/id953846217].

So Phase 2 is two parts:

1. **A thin native iOS/iPadOS WebView shell** that bridges CoreMIDI to the same web codebase, so the duet loop finally runs on iPhone/iPad. This is the platform-level unlock.
2. **The lowest-BOM accessory: a wired, class-compliant USB-MIDI "duet bar."** Wired USB avoids the wireless certification tax and BLE flakiness. Class-compliant USB-MIDI is the most reliable cross-browser path [source: https://caniuse.com/midi]. Paired with the native iOS shell, this gives the most reliable cross-platform story.

There's also a defensible white-space adjacent to this: a **sub-$200 consumer sensor bar that adds MIDI to an acoustic piano.** The pro option, QRS PNOscan III, is $1,795 and technician-installed [source: https://shop.qrsmusic.com/79317C-PNOscan-III-w-adapter]; DIY communities build optical sensor bars, but no cheap, polished consumer Bluetooth retrofit owns the space [source: https://forum.modartt.com/viewtopic.php?id=760]. Such a device would turn the worst-case acoustic mic problem into the best-case MIDI case and bring acoustic owners into the duet loop — but it carries far higher BOM/cert/install risk than the wired duet bar, so it is a later bet.

#### Who already does it (the archetypes)

| Product | Archetype | Price | Note |
|---|---|---|---|
| The ONE Piano Hi-Lite | 88-key LED light bar over your own keys | not confirmed on official page | Closest "works with your keyboard" analog; adds MIDI, Bluetooth 4.0 [source: https://www.amazon.com/ONE-Music-Group-Beginners-TOH1/dp/B075XLPBQT] |
| ROLI Lumi Keys / Piano M | Illuminated MPE keyboard | $249 (24-key Lumi, Mar 2024) [source: https://morningsideschoolofmusic.co.uk/roli-lumi-keys/] | Non-standard compact keys (9.67–19.4mm) don't build technique [source: https://morningsideschoolofmusic.co.uk/roli-lumi-keys/] |
| McCarthy Illuminating Piano | 61-key RGB LED MIDI controller | $499.99 (2015) [source: https://www.geekwire.com/2015/new-illuminating-piano-works-ipad-windows-light-way-aspiring-pianists/] | Needed a Hal Leonard 1,000-song license to compete |
| QRS PNOscan III | Acoustic MIDI-retrofit strip | $1,795, technician install [source: https://shop.qrsmusic.com/79317C-PNOscan-III-w-adapter] | The expensive, install-gated white space |
| Roadie 4 | Focused low-cost accessory | $89 super-early-bird [source: https://newatlas.com/music/roadie-4-smart-automated-guitar-tuner/] | Proof a small, cheap, single-purpose accessory wins across generations |

The lesson from the archetypes: a light-guide **over the user's own full-size 88 keys** is pedagogically superior to a mini illuminated controller, and the ~$89-100 focused-accessory price point (Roadie) is the realistic anchor — not a $249-599 flagship.

#### BOM / cert / MOQ / inventory realities

Hardware is genuinely hard, and the corpus quantifies the risk:

- **Crowdfunding failure base rate:** ~9% of *funded* Kickstarter hardware campaigns fail to deliver; in a 25-project study totaling $26,074,576 raised, design issues and hardware issues each affected >50% of failed campaigns [source: https://dtusciencepark.com/article/26-million-lost-why-crowdfunded-hardware-projects-fail/]. A software-first team is exactly the profile that underestimates firmware/contract-manufacturing.
- **Certification (the wireless tax):** going wireless multiplies cost and time. Combined FCC SDoC + FCC-ID for a Bluetooth device runs roughly **~$1,500 and ~4 weeks per region** [source: https://www.jjrlab.com/news/bluetooth-fcc-certification-cost.html]; CE adds ~$750+; a non-wireless FCC SDoC is only ~$250-450 [source: https://www.jjrlab.com/news/how-much-does-product-certification-cost-fcc-ce.html]. A **wired USB-only** first product dramatically cuts cert cost. (Note: Bluetooth SIG declaration adds ~$4,000-8,000 if not using a pre-certified module — another reason to start wired.)
- **MOQ / tooling:** electronics MOQs typically run 100-5,000 units; injection-molded plastics 500-5,000; moving from 500 to 2,000 units cuts unit price ~15-25% [source: http://www.cosmosourcing.com/blog/what-does-minimum-order-quantity-moq-mean-for-manufacturing]. Custom tooling means committing to hundreds-to-thousands of units of inventory before knowing demand. Use off-the-shelf enclosures and low-MOQ assembly for v1; defer custom tooling until demand is proven.

#### Crowdfunding case studies

- **Roadie (Band Industries)** — the positive case: original funded on Kickstarter in 2013 ($178,613 from 2,002 backers), and the company has shipped four generations; Roadie 4 (a focused $89-139 single-purpose tuner) validates the "small, cheap, focused accessory" path over an ambitious flagship [source: https://newatlas.com/music/roadie-4-smart-automated-guitar-tuner/].
- **PopuMusic Populele 2 Pro** — LED-guide instrument + companion app crowdfunded **$919,796** on Indiegogo (Aug–Oct 2021), pledges from $109/$149, showing the hardware+app bundle scales into the high six figures [source: https://newatlas.com/music/populele-2-pro-smart-learning-ukulele/].
- **Triggertrap Ada** — the cautionary case: a software-strong team's small-electronics device shipped ~12 months late with battery far below spec (~20 hours vs a 6-12 month target), and the company ultimately shut down — the exact failure mode a software-first team faces adding firmware/CM [source: https://medium.com/triggertrap-playbook/hardware-is-hard-getting-a-kickstarter-project-shipped-59c9596bdd7f].

The pragmatic sequence: the viral duet clips are themselves the demand signal that de-risks the hardware bet. Validate demand via crowdfunding/pre-orders **before** any injection-mold tooling spend, given the >50% design/hardware failure rate.

#### How hardware unlocks basic access in the pricing model

Hardware is an onboarding funnel and a churn anchor, **not** a profit center.

- **Follow The ONE / ROLI pattern, NOT Whoop/Snap.** The ONE keeps baseline content free forever for owners and bundles 6-12 months of premium with the keyboard [source: https://theonemusic.com/]. ROLI explicitly tells subscription-averse users to buy the hardware and use it as a plain MIDI controller — hardware works without the sub [source: https://roli.com/blog/everything-you-need-to-know-about-lumi-membership]. Avoid the "brick it if you stop paying" models: Whoop's hardware is unusable without an active membership and triggered a 2025 backlash [source: https://www.circuly.io/blog/case-study-whoop-business-strategy-device-as-a-success], and Snap Spectacles are rental-only ($99/mo dev, return the device if you stop) [source: https://roadtovr.com/snapchat-spectacles-24-ar-glasses-specs-price-release-date/]. For Loop, **hardware grants "basic access forever" that fully works unpaid; the $5-8/mo sub only adds the full feature set.**
- **The device is a near-breakeven CAC engine.** Peloton is the benchmark hybrid: hardware runs ~14.3% gross margin, subscription ~69%, with monthly connected-fitness churn of just 1.2-1.8% [source: https://www.pymnts.com/earnings/2025/peloton-sees-decline-in-subscription-churn-to-1-2-in-q3-raises-full-year-guidance/]. The hardware-tether effect is direct: Peloton's app-only churn was 8.1% monthly vs 1.2% for device-tethered, and app-only subs are shrinking (-15% YoY) [source: https://www.sec.gov/Archives/edgar/data/1639825/000163982525000077/q32025shareholderletter.htm]. Selling the duet bar at/near cost makes it effectively negative-CAC.
- **The hardware buyer pre-qualifies as a converter.** Freemium download-to-paid is only ~2.18% median; a hard paywall converts ~12.11% [source: https://www.revenuecat.com/state-of-subscription-apps-2025/]. A hardware purchase is a hard-paywall-equivalent signal of intent, so device owners should convert far above the freemium baseline — the economic core of the bundle. This mirrors the proven keyboard-bundle channel: buying a Kawai/Alesis piano grants 3 free months of Skoove, putting the app in front of a high-intent buyer at near-zero CAC [source: https://kawai.com.au/ca-piano-bonus-offer/].
- **Web-first checkout protects margin.** After the April 30, 2025 Epic v. Apple ruling, US iOS apps could link to external web checkout at ~0% Apple commission, keeping ~97% via Stripe (2.9% + $0.30) vs Apple's 15-30% [source: https://www.revenuecat.com/blog/growth/apple-anti-steering-ruling-monetization-strategy/]. **Caveat:** the Dec 11, 2025 Ninth Circuit ruling remanded the "reasonable fee" question to district court (with a SCOTUS petition pending), so the 0% window is legally unsettled — design for web checkout but don't assume 0% is permanent [source: https://www.macrumors.com/2025/12/11/apple-app-store-fees-external-payment-links/].

**Net:** the iOS Web-MIDI gap *is* the hardware wedge. Phase 2 ships a thin CoreMIDI WebView shell plus a wired USB-MIDI duet bar (lowest BOM, no wireless cert) that grants basic access for free and runs the same duet loop everywhere. Acoustic owners are served first by turn-based mic grading and later, optionally, by a consumer MIDI-retrofit bar. Hardware's job is to lengthen lifetime and fund acquisition, not to lock users out — and the viral clips de-risk the bet before any tooling is committed.
