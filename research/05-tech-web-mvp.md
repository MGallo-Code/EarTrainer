I'll write this section now. The key sources are in the `tech-web-midi-audio` and `tech-pitch-detection` corpus dimensions, with cross-references to the wedge (C2/Loop), business-pricing (App Store cut), and pedagogy (cadence priming). Let me ground every claim and apply the verified corrections.

## Technical Architecture: Web-First MVP

The wedge is **Loop**: figure out a song by ear on a MIDI keyboard, capture it as clean quantized MIDI, render it to good piano sound, and stitch two layers into a shareable duet clip. This stack is chosen to make that loop work on the surface where it actually works today (desktop/Android-Chromium), to render and grade with zero-latency MIDI precision, and to avoid the App-Store cut. The single hardest constraint to plan around is iOS, covered in its own subsection.

### Recommended stack at a glance

| Layer | Recommendation | Why / known limit |
|---|---|---|
| MIDI input | Web MIDI API, wrapped by **webmidi.js (v3+)** | Fully supported Chrome 43+, Edge 79+, Firefox 108+, Opera, Samsung Internet, Android Chrome; ~80.15% global support; **not** Safari/iOS [source: https://caniuse.com/midi] |
| Sampled piano | **smplr** `SplendidGrandPiano` (MIT) | 4 velocity layers, no setup, samples hosted online, actively maintained (v1.0 2026-06-13) [source: https://github.com/danigb/smplr] |
| Recording / layering | Web Audio + AudioWorklet | Proven in browser DAWs (BandLab, Soundtrap); needs latency compensation [source: https://jewelmusic.art/blog/web-audio-apis-browser-daws/] |
| Notation | **VexFlow** (low-level), **OpenSheetMusicDisplay** for MusicXML | OSMD renders MusicXML on top of VexFlow [source: https://github.com/opensheetmusicdisplay/opensheetmusicdisplay] |
| Grading | Web MIDI (zero-latency, polyphonic-perfect) | Avoids the mic chord-detection problem incumbents admit [source: https://piano-help.hellosimply.com/en/articles/6210608-ways-to-improve-note-recognition-in-simply-piano-for-ios-keyboard-electronic-piano] |
| Acoustic fallback | **Spotify Basic Pitch** (offline, batch) | Browser TS build; piano-weak (70.9% F vs 95.2% for piano-specialized models) [source: https://ar5iv.labs.arxiv.org/html/2203.09893] |
| Monetization | Web-first checkout (Stripe) | ~97% kept vs Apple's cut; legally unsettled [source: https://www.revenuecat.com/blog/growth/apple-anti-steering-ruling-monetization-strategy/] |

### MIDI input: Web MIDI, webmidi.js, BLE-MIDI

- **Web MIDI works on the launch surface.** Supported in Chrome 43+, Edge 79+, Firefox 108+, Opera 30+, Samsung Internet, and Android Chrome, for ~80.15% of users globally [source: https://caniuse.com/midi]. That is exactly the desktop/Android-Chromium population the wedge targets (pop/jazz adults on laptops, Android phones, Chromebooks).
- **Use webmidi.js (v3+)** as the abstraction over raw Web MIDI: it handles note on/off, channels, and device enumeration, ships TypeScript definitions, and supports Node 8.5+. It does **not** add Safari support; Safari is only reachable via the effectively-dead Jazz-Plugin [source: https://webmidijs.org/docs/getting-started/].
- **Plan a permission-prompt UX from day one.** As of Chrome 124 (rolling out from April 2024, full by Chrome 125), **all** Web MIDI access is gated behind a user permission prompt, not just SysEx. The app must call `requestMIDIAccess()` in try/catch and handle `SecurityError` on denial [source: https://developer.chrome.com/blog/web-midi-permission-prompt]. For the beachhead's older/casual users, ship a guided "connect your keyboard" wizard rather than relying on the raw browser dialog.
- **Firefox is supported but painful.** Since Firefox 108, Web MIDI ships enabled, but `requestMIDIAccess()` rejects until the user installs a one-time per-site permission add-on (except on localhost) [source: https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/108]. Detect Firefox and either guide the add-on install or steer users to Chrome/Edge.
- **BLE-MIDI works on Chrome/Android/Mac, not Safari/iOS.** Wireless keyboards appear as standard MIDI inputs once paired, on the same Chromium browsers that support Web MIDI [source: https://learn.adafruit.com/web-ble-midi/web-midi]. **Fallback / preference:** treat class-compliant **USB-MIDI over a cable/adapter as the reliable default** and BLE as a convenience, since BLE inherits the iOS gap and adds pairing friction.

### Safari / iOS: the hard wall (and the hardware wedge)

This is the one architectural constraint, not a temporary gap.

- **Apple does not support Web MIDI in any Safari version through Safari 26.5**, and has declined to implement it since 2020, citing fingerprinting/privacy. Because all iOS browsers are forced onto WebKit, **no** browser on iPhone/iPad can do Web MIDI natively [source: https://caniuse.com/midi].
- **PWAs do not fix it**, and iOS Safari additionally starts `AudioContext` suspended (requires a user tap to unlock) and **suspends Web Audio on screen lock or backgrounding** [source: https://9to5mac.com/2024/03/01/apple-home-screen-web-apps-ios-17-eu/]. (Note: the EU PWA removal scare was reversed before stable iOS 17.4 shipped, so standalone PWAs still exist.) For a foreground practice tool both behaviors are manageable; any background/passive-listening feature is impossible in-browser on iOS.
- **Do not depend on third-party "Web MIDI" browsers.** The original "Web MIDI Browser" app was last updated 2016-03-23, rated 3.3/5, with device-incompatibility and battery-drain complaints; a newer "MIDIWeb Browser" exists but is not a dependable production path [source: https://apps.apple.com/us/app/web-midi-browser/id953846217].
- **The fallback is the hardware wedge.** Phase 2 ships a thin native iOS/iPadOS WebView shell that bridges CoreMIDI into the same web codebase, so the duet loop finally runs on iPad/iPhone. The iOS Web-MIDI gap is precisely why "buy the hardware/app shell for the platform where web-only fails" is a coherent ask rather than a paywall. One residual caveat: even inside a WKWebView, Apple's documented bug prevents Web Audio from resuming after screen lock, so the native shell still cannot promise locked/background playback.

### Audio: recording, layering, and latency

- **Web Audio is mature and multitrack record/overdub is proven.** Browser DAWs (BandLab, Soundtrap) run full client-side multitrack recording, MIDI sequencing, and effects via Web Audio; the hard parts are latency compensation and UX, not raw capability [source: https://jewelmusic.art/blog/web-audio-apis-browser-daws/].
- **AudioWorklet for low-latency DSP, but keep mobile light.** AudioWorklet (off-main-thread PCM processing) is supported at ~94% of users: Chrome 66+, Firefox 76+, Edge 79+, Safari 14.1+/iOS 14.5+ [source: https://caniuse.com/mdn-api_audioworklet]. The mandated 128-sample render quantum (~2.66ms at 48kHz) causes glitching/distortion on many mobile devices, so reserve heavy real-time DSP for desktop and keep phone audio to playback + metronome + simple synthesis.
- **Latency is fine for the loop, with compensation.** Output latency reads ~24ms in Chrome and ~15.4ms in Firefox [source: https://www.jamieonkeys.dev/posts/web-audio-api-output-latency/]; real-world round-trip on a desktop Mac with a proper interface and a 128-sample buffer lands ~19-23ms. For "play a note, hear a note" this is imperceptible-to-minor. **For the duet stitch, implement latency compensation using `AudioContext.outputLatency` from day one** so layered parts align in time. Most hobby web-MIDI tools skip this, so "record and layer that actually stays in time" is a real quality differentiator. Caveat: Bluetooth audio output and cheap built-in laptop audio degrade latency badly, so set expectations and prefer a wired interface for tight overdub.
- **MIDI quantization carries the loop's quality.** Because MIDI capture is zero-latency and polyphonic-exact, the app can quantize and align a beginner's sloppy timing into a clean stitch. This is the substrate advantage mic-first incumbents structurally lack: Simply Piano's own help center tells users to switch to MIDI to fix chord/polyphonic misrecognition [source: https://piano-help.hellosimply.com/en/articles/6210608-ways-to-improve-note-recognition-in-simply-piano-for-ios-keyboard-electronic-piano], and Playground Sessions deliberately abandoned pitch detection because it fails on polyphonic chords [source: https://www.musicradar.com/reviews/playground-sessions-review].

### Notation

- **VexFlow for the staves you control, OSMD if you need MusicXML import.** VexFlow gives precise low-level engraving; OpenSheetMusicDisplay renders MusicXML on top of VexFlow with far less manual work, and abcjs covers lightweight text notation [source: https://github.com/opensheetmusicdisplay/opensheetmusicdisplay]. For Loop's short cards (degree labels, melody/bass fragments, the rendered duet score) VexFlow directly is likely enough; add OSMD for MusicXML interop only if the teacher/studio tier needs to round-trip with MuseScore/Finale/Sibelius.

### Sampled piano

- **smplr `SplendidGrandPiano` is the default.** MIT-licensed, 4 velocity layers from Steinway samples, no setup, samples hosted online, actively maintained (v1.0 released 2026-06-13, ~302 GitHub stars) [source: https://github.com/danigb/smplr]. This is what renders a fumbled by-ear attempt into a clip worth sharing, with zero DSP work.
- **Tone.js Piano (Salamander Grand, Yamaha C5) is the richer alternative**, sampling 88 keys every 3rd note with up to 16 velocity levels [source: https://github.com/danigb/smplr]. Note 16 is the configurable ceiling, not a default; apps typically load 1-5 layers to cut download size. **Offline fix:** cache samples via a service worker so practice and rendering work without re-downloading each session.

### Acoustic fallback (hard; keep it turn-based)

The wedge is MIDI-first, but acoustic-piano owners need a path. Be honest about what is feasible:

- **Live polyphonic mic grading is unsolved at the latency musicians feel.** At a 10ms tolerance, causal real-time piano transcription scores only ~31.55% note-onset F1; at 30ms, ~37.38% [source: https://arxiv.org/html/2509.07586]. Do **not** promise live acoustic grading.
- **Offline/turn-based "play-then-grade" is good.** Over a recorded phrase, transcription is strong: ByteDance's offline model hits 96.72% onset F1 on clean MAESTRO [source: https://ar5iv.labs.arxiv.org/html/2010.01815], and the best streaming system reaches 96.52% onset F1 but at 380ms latency, fine for turn-based, too slow to feel live [source: https://arxiv.org/html/2503.01362].
- **Basic Pitch is the only mature in-browser option, and it is weak on piano.** Spotify Basic Pitch runs in-browser via Web Audio (resamples to 22,050Hz, mono, batch single-pass), is tiny (16,782 params), but is instrument-agnostic and scores only 70.9% no-offset F-measure on piano vs 95.2% for piano-specialized Onsets-and-Frames [source: https://ar5iv.labs.arxiv.org/html/2203.09893]. Its small size suits a WASM in-browser deploy (TF.js WASM is 10-30x faster than JS-CPU) [source: https://blog.tensorflow.org/2020/03/introducing-webassembly-backend-for-tensorflow-js.html].
- **Monophonic ear-training is fully solvable in-browser today**, even on Safari/iOS where Web MIDI fails: classic YIN/autocorrelation tuners run entirely client-side with no model download, and CREPE reaches ~0.999 raw-pitch accuracy on clean audio [source: https://ar5iv.labs.arxiv.org/html/1802.06182]. Ship single-note/interval modes as a Safari-compatible free-tier hook.
- **All transcription numbers are clean-studio numbers.** Models overfit MAESTRO and degrade on noisy living-room phone mics; reverb and pitch-shift augmentation give only modest out-of-distribution gains [source: https://arxiv.org/abs/2402.01424]. Grading false-negatives are trust-killers, so keep acoustic grading offline and tolerant. Two-tier architecture is the natural paywall: on-device Basic Pitch for free/basic, server-side ByteDance/MT3-class for the paid "deep analysis" tier.

### PWA / offline

- **Service-worker offline caching** for piano samples and core assets makes practice work without re-downloading, on the Chromium surface.
- **iOS PWA is not a path to MIDI**: PWAs cannot use Web MIDI, and iOS Safari suspends Web Audio on lock/background [source: https://9to5mac.com/2024/03/01/apple-home-screen-web-apps-ios-17-eu/]. Treat the PWA as a desktop/Android enhancement, and the native WebView shell as the iOS answer.

### App-Store-cut avoidance

- **Go web-first checkout via Stripe.** After the April 30, 2025 Epic v. Apple ruling, US iOS apps can link to external web checkout at 0% Apple commission (vs 30% standard / 15% Small Business), keeping ~97% of revenue (Stripe 2.9% + $0.30) [source: https://www.revenuecat.com/blog/growth/apple-anti-steering-ruling-monetization-strategy/]. On a $5-8/mo sub, that is the difference between Apple taking $0.75-2.40 and Stripe taking ~$0.45-0.53.
- **Design for a possible partial fee returning.** The December 11, 2025 Ninth Circuit ruling held Apple may charge a "reasonable fee" on external links but set no rate, remanding to district court (with a SCOTUS bid reported around mid-2026) [source: https://www.macrumors.com/2025/12/11/apple-app-store-fees-external-payment-links/]. Build monetization around web checkout, but do not assume 0% is permanent. Web-first also gives keyboard-manufacturer bundle partners better economics than Skoove's app-store-taxed deal, via a "scan QR, play instantly, no install" pitch.

---

**Files referenced:** corpus dimensions `tech-web-midi-audio`, `tech-pitch-detection`, `business-pricing` (App Store cut), `piano-learning-apps` (mic-detection admissions). No wiki files were read or written for this section.
