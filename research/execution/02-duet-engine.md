## Duet Record/Layer + Video Render Engine

Loop's duet engine has two halves: **capturing/aligning a played layer** and **rendering a shareable 9:16 clip from it**. Both are feasible for an MVP, and the architecture choices that matter are already settled by the corpus. The single most important decision frees you from most of the hard problems: **go MIDI-first, not audio-first.** Because the user plays a MIDI keyboard, you capture discrete note events with high-resolution timestamps instead of fighting microphone latency and recording bugs [source: https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API].

A critical scoping note up front: **for the 2-week Wizard-of-Oz test, build neither half.** The existential question is "is the auto-rendered duet clip fun to watch/share," not "can we render it." Hand-make validation clips in SeeMusic (MIDI/keyboard to falling-note video, exports for Shorts) and post them; decouple validation from engineering [source: https://www.seemusicapp.com/]. Everything below is the post-validation build plan.

### Part 1: In-browser multitrack record/layer + MIDI quantize/align

#### Capture: MIDI events, not audio

`navigator.requestMIDIAccess()` (HTTPS/secure context required, prompts for permission) yields `MIDIInput` ports. Each `onmidimessage` event carries `event.data` (a Uint8Array: `[0x90, note, velocity]` = noteOn, `[0x80, note, vel]` = noteOff) and `event.timeStamp`, a `DOMHighResTimeStamp` in the **same time domain as `performance.now()`** with sub-ms precision [source: https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API]. Record `(timeStamp, note, velocity, on/off)` tuples. No mic, no round-trip latency.

Why this matters: in-browser **audio** overdub has a hard latency floor. Spotify's Soundtrap browser DAW hits only ~30ms best-case round-trip latency (native target is ~10ms), and the web platform exposes input latency poorly, so recordings need round-trip compensation just to align [source: https://www.w3.org/2021/03/media-production-workshop/talks/ulf-hammarqvist-audio-latency.html]. Worse, the low-level `AudioWorklet` recording path has documented severe distortion on mobile, including "unusable recordings on Chrome Android" tied to the mandated 128-sample render quantum [source: https://github.com/WebAudio/web-audio-api/issues/2632]. Chrome Android is Loop's beachhead, so this would hit your core platform directly. MIDI-event capture sidesteps all of it.

Two hard capture gotchas:
- **MIDI "running status":** a Note On with velocity 0 (`0x90` ... `0` ) is a Note Off. A naive handler that only checks for `0x80` will record stuck/never-released notes [source: https://github.com/WebAudio/web-audio-api/issues/2632].
- **iOS Safari has no Web MIDI** (Apple blocked it in 2020 over fingerprinting; all iOS browsers are forced onto WebKit) [source: https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API]. The keyboard-capture mechanic is dead on iOS web until the phase-2 native shell. Plan a fallback (on-screen/touch keyboard) for Apple users.

#### Tempo lock, then quantize

The corpus is explicit: **lock tempo before quantizing.** Inferring tempo from sparse by-ear playing is unreliable, and a loose first layer poisons every subsequent quantized layer so duets won't stack. The duet card's first layer should define BPM + bar count; quantize incoming onsets against that fixed grid [risk noted in tech-multitrack].

Quantization should be a **strength-percentage snap, not a hard 100% snap**, reusing standard DAW semantics (Steinberg/Cubase Q-Strength is a real 0-100% parameter alongside Swing and Randomize controls) [source: https://archive.steinberg.help/cubase_pro_artist/v9/en/cubase_nuendo/topics/quantizing_midi_audio/quantizing_quantizing_panel_options_musical_grid_r.html]. Note the corpus marks the exact percentage bands as engineering rules of thumb, not spec constants, so treat these as defaults to tune:
- Default ~80-100% strength to a 1/8 or 1/16 grid for pop tightness so two players' layers line up.
- Expose swing (~50-66%) for the jazz segment.
- Add an "exclude within" deadzone so already-tight notes aren't yanked.

#### Storage format

Persist each layer as **@tonejs/midi JSON** with PPQ-relative ticks (tempo-independent) plus the tempo/timeSignature header. The model: `header.PPQ`, `header.tempos[]`, `header.timeSignatures[]`, and `tracks[].notes[]` with `{midi: 0-127, time: seconds (onset), ticks, duration: seconds, velocity: 0-1}` [source: https://github.com/Tonejs/Midi/blob/master/src/Note.ts].

**Watch the velocity unit mismatch:** Web MIDI and smplr use velocity **0-127**; @tonejs/midi normalizes to **0-1**. Convert at the boundary or you get silent or blown-out notes [source: https://github.com/Tonejs/Midi/blob/master/src/Note.ts].

#### Playback, scheduling, and the alignment "duet"

Playback is the easy half. **smplr** (Loop's chosen renderer) schedules notes at an absolute `audioContext.currentTime` and is sample-accurate: `start({note, velocity: 0-127, time, duration, onEnded})` where `time` is seconds against the audio clock [source: https://github.com/danigb/smplr]. Stacking a new layer over existing ones is just scheduling both against the same shared AudioContext clock.

Use the **"Tale of Two Clocks" look-ahead scheduler** for all playback and the cadence-prime metronome: a `setTimeout`/`setInterval` loop running every **25ms** that schedules every note within a **100ms** look-ahead window at absolute `audioContext.currentTime`. Naive `setTimeout`-per-note jitters by "tens of milliseconds" when the main thread stalls on layout/GC; the overlap window absorbs it [source: https://web.dev/articles/audio-scheduling].

#### The single most dangerous gotcha: grade against captured timestamps, never smplr's callback

smplr's `onStart` callback **fires up to 200ms early** (default scheduler `lookaheadMs: 200`, `intervalMs: 50`) [source: https://github.com/danigb/smplr]. If a developer uses `onStart` as the "note played" moment for grading, MIDI-exact grading silently breaks by up to 200ms. **Enforce in code review:** grade the player's captured `event.timeStamp` against the expected scale-degree/grid targets. Treat the audible piano purely as monitoring. (The scheduled AudioContext start time IS sample-accurate, so that is the safe alternative reference.)

For aligning the **heard** count-off/metronome with the on-screen grid, read `AudioContext.outputLatency` (Chrome/Edge 102+, Firefox 70+, Safari 18.4+) and warn or auto-offset for Bluetooth output, which adds large variable latency that makes users feel "off the grid" even when MIDI capture is perfect [source: https://web.dev/articles/audio-output-latency].

#### What to skip

**Do not adopt Web Audio Modules (WAM) or build a general browser DAW.** WAM is a real MIDI-capable plugin standard but requires host/plugin machinery and SharedArrayBuffer + cross-origin isolation (COOP/COEP) headers, buying nothing for Loop's one-instrument-per-layer mechanic until you offer user-selectable instruments or effect chains [source: https://www.webaudiomodules.com/docs/intro/]. BandLab proves browser multitrack works but reveals the cloud-latency tax Loop's async, one-layer-at-a-time model avoids: it records only **2 tracks simultaneously** (16 total free / 32 paid, per verdict correction) and forces manual re-syncing [source: https://help.bandlab.com/hc/en-us/articles/360010046854-Multitrack-Recording]. **Tone.js Transport** is optional: adopt it only if you later need loopable previews/swing beyond your own scheduler [source: https://github.com/Tonejs/Tone.js/wiki/Transport].

### Part 2: Rendering a shareable 9:16 video from MIDI

#### Recommended approach: canvas + Mediabunny (WebCodecs), in a Worker

Render the piano-roll on a canvas and encode in-browser with **Mediabunny**, a pure-TypeScript WebCodecs toolkit (MPL-2.0, free for closed-source commercial use, zero deps) that supersedes the author's older mp4-muxer/webm-muxer [source: https://mediabunny.dev/guide/introduction]. The pattern:

```
Output({ format: new Mp4OutputFormat(), target: new BufferTarget() })
  .addVideoTrack(new CanvasSource(canvas, { codec, bitrate, ... }))
  .addAudioTrack(new AudioBufferSource(...))   // fed the smplr-rendered AudioBuffer
```

It uses hardware-accelerated WebCodecs and produces H.264 video + AAC audio in MP4. Call `canEncodeVideo()` / `canEncodeAudio()` at runtime to feature-gate [source: https://mediabunny.dev/guide/introduction].

This is needed because **WebCodecs does not do muxing** (and does not "guarantee" any codec; check `isConfigSupported()`) — you bring your own muxer, which is exactly Mediabunny's job. Note the corpus correction: WebCodecs *does* include `AudioEncoder`/`AudioDecoder`; only container muxing is out of scope [source: https://webcodecsfundamentals.org/basics/muxing/].

Run the encode in a **Web Worker with OffscreenCanvas** (`canvas.transferControlToOffscreen()`), creating `VideoFrame(canvas, {timestamp})` and encoding inside the worker. This runs faster-than-real-time, survives background-tab throttling (workers don't throttle; `requestAnimationFrame` does), and never freezes the UI. VideoFrame timestamps are in microseconds [source: https://medium.com/@chemsabd/how-to-recorded-canvas-in-react-without-browser-throttling-using-web-workers-and-webcodecs-792446d21f10].

#### What NOT to use

- **MediaRecorder + `canvas.captureStream()`:** wall-clock real-time only (a 60s clip takes 60s+), writes dropped frames verbatim (choppy), and **fails to encode large canvases (e.g. 1280x720) on Android Chrome** while 640x480 works (Chromium bug 897727) — directly on Loop's beachhead [source: https://github.com/w3c/mediacapture-record/issues/213]. Also: `OffscreenCanvas + captureStream()` is unsupported in any browser as of early 2026, so it can't even be the worker path.
- **ffmpeg.wasm as the primary encoder:** sandboxed WASM cannot reach hardware codecs, making it materially slower. Per the corpus verdict, use the *directional* claim — roughly **5-10x slower than WebCodecs** and order-of-magnitude slower than native — and drop the unsupported "8x / 25fps vs 200fps / 2GB RAM" specifics [source: https://github.com/remotion-dev/webcodecs-benchmark]. Keep ffmpeg.wasm only for non-hot-path post-processing (burn-in captions, GIF preview).

#### Browser support is a non-issue on Loop's platforms

WebCodecs `VideoEncoder` ships in Chrome/Edge 94+ (Sept 2021) [source: https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API]. Safari was video-only 16.4-18.7 and got full support (incl. audio) in Safari 26 (2025); desktop Firefox shipped full WebCodecs in **130** (per corpus correction; the brief's "Firefox 147" conflated Android Chrome) [source: https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API]. Since capture already requires Web MIDI (Chromium desktop/Android, not iOS Safari), the iOS WebCodecs gap is moot — the same devices that can record can encode.

#### Encoder config

Use H.264 `avc1` codec strings: `avc1.42001f` (baseline, up to 720p, ~99.6% device support) or `avc1.4d0034` (main profile, up to 4K, ~98.9%) [source: https://www.freecodecamp.org/news/the-webcodecs-handbook-native-video-processing-in-the-browser/]. Practical MVP settings (note the corpus flags 9:16 vertical and the bitrate range as reasonable synthesis, since the freeCodeCamp example is actually 1280x720 *landscape* at 1 Mbps with keyframes every 60th frame):
- **Target 720x1280 @ 30fps for the MVP**; bump to 1080x1920 only if quality demands it. The smaller canvas sidesteps Android large-canvas encode failures and halves encode time.
- Bitrate: 1 Mbps is too low for crisp vertical 1080p; **4-8 Mbps** is more typical for 1080x1920@30, so favor the upper end if you go full-res.
- Set explicit keyframes (e.g. every 60 frames / 2s) and assign microsecond timestamps so audio and visuals stay synced — **A/V drift is the most likely "looks broken" failure mode** in a duet clip.

#### Visual layer

Render the piano-roll **yourself on canvas** for full control of branding, the duet-card watermark, the "find the next layer" CTA overlay, and color-matching to the card art. Use **html-midi-player** (Magenta.js; piano-roll/waterfall/staff modes) only as a prototyping reference — its waterfall is basic, not Shorts-quality [source: https://cifkao.github.io/html-midi-player/]. None of these libraries encode video; pair with Mediabunny/WebCodecs.

The format itself is proven but commoditized: **SeeMusic** already turns MIDI/keyboard into 4K falling-note videos marketed for YouTube/Shorts (so it's also your WoZ clip-maker) [source: https://www.seemusicapp.com/], and dozens of waveform-visualizer SaaS (EchoWave 50+ templates, etc.) export 9:16 MP4 [source: https://echowave.io/tools/music-visualizer/]. **Loop's defensible novelty is the open duet card + by-ear MIDI grading, not the renderer** — build the renderer just well enough to be watchable; if clips look like generic Synthesia output they won't stand out.

#### Server-side fallback

Hold **Remotion Lambda** (React frames → headless Chromium → MP4) as the Phase-2 fallback for iOS and guaranteed-consistent batch renders. Costs ~$0.001/simple render (7.56s warm / 11.02s cold) to ~$0.017-0.021 for a 1-minute video; the company license is free up to 3 people, then ~$25/dev/mo with a **$100/mo floor (~$1200/yr, per corpus correction — not $1000/yr)** [source: https://www.remotion.dev/docs/lambda/cost-example]. Don't default to it; the free in-browser Mediabunny path avoids the recurring cost. A no-build batch alternative for mass-producing WoZ clips: **mido + Pillow + Timidity + FFmpeg** in Python [source: https://pappubahry.com/misc/piano_diaries/synthesia/].

### Recommended stack

| Layer | Pick | Why / key detail |
|---|---|---|
| MIDI capture | Web MIDI API (`onmidimessage`, `event.timeStamp`) | Sub-ms timestamps in `performance.now()` domain; no audio latency [source: https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API] |
| Scheduling | "Tale of Two Clocks" (25ms interval, 100ms look-ahead) | Absorbs main-thread jitter of "tens of ms" [source: https://web.dev/articles/audio-scheduling] |
| Sound render | smplr (shared AudioContext) | Sample-accurate; grade vs MIDI timestamp, NOT `onStart` (200ms early) [source: https://github.com/danigb/smplr] |
| Quantize | Strength-% snap (DAW Q-Strength semantics) | Default ~80-100% to 1/8 or 1/16; swing for jazz [source: https://archive.steinberg.help/cubase_pro_artist/v9/en/cubase_nuendo/topics/quantizing_midi_audio/quantizing_quantizing_panel_options_musical_grid_r.html] |
| Storage | @tonejs/midi JSON (PPQ ticks) | Tempo-relative; convert velocity 0-127 ↔ 0-1 [source: https://github.com/Tonejs/Midi/blob/master/src/Note.ts] |
| Latency align | `AudioContext.outputLatency` | Auto-offset Bluetooth output [source: https://web.dev/articles/audio-output-latency] |
| Visual | Custom canvas (html-midi-player as reference only) | Full control of branding/CTA [source: https://cifkao.github.io/html-midi-player/] |
| Encode | Mediabunny (WebCodecs) in Worker + OffscreenCanvas | Faster-than-real-time, H.264/AAC MP4, background-safe [source: https://mediabunny.dev/guide/introduction] |
| Codec | `avc1.42001f` (≤720p) or `avc1.4d0034` (4K) | ~99.6% / ~98.9% support [source: https://www.freecodecamp.org/news/the-webcodecs-handbook-native-video-processing-in-the-browser/] |
| WoZ clips | SeeMusic (or mido+Pillow+Timidity+FFmpeg) | Build zero renderer for validation [source: https://www.seemusicapp.com/] |
| Server fallback | Remotion Lambda (Phase 2) | ~$0.001-0.02/clip; license floor ~$1200/yr [source: https://www.remotion.dev/docs/lambda/cost-example] |

### The hardest parts (rank-ordered)

1. **A/V sync in the in-browser pipeline.** WebCodecs muxing/audio-video alignment is non-trivial plumbing the API doesn't cover; getting smplr audio perfectly aligned with falling-note visuals via microsecond timestamps is the highest-effort, highest-risk piece. Lean on Mediabunny's abstractions [source: https://webcodecsfundamentals.org/basics/muxing/].
2. **The 200ms smplr-callback grading trap.** Easy to get wrong, silently corrupts MIDI-exact grading. Enforce "grade against captured `event.timeStamp`" in code review [source: https://github.com/danigb/smplr].
3. **Tempo lock from sparse by-ear input.** A loose first layer makes every later quantized layer fail to stack; fix the grid from the duet card, don't infer it [risk noted in tech-multitrack].
4. **Android encode limits.** Mobile GPUs are weaker and `captureStream` historically failed on large canvases; test encode time/success at 1080x1920 on mid-range Android before committing, and default to 720x1280 [source: https://github.com/w3c/mediacapture-record/issues/213].
5. **The non-technical existential bet.** None of this de-risks "is the auto-rendered MIDI clip watchable enough to hold ~70% retention on TikTok." The renderer is not the bottleneck — validate with hand-made clips first, build the engine second.
