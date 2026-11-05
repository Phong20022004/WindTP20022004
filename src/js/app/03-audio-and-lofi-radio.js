/*@file js/app/03-audio-and-lofi-radio.js
 * Âm thanh của app và Lofi Chill Radio (nhạc lofi do app tự tạo bằng WebAudio).
 */
  // src/audio.ts
  // ===== Lofi Chill Radio: 3 bài lofi không lời, do app tự tạo trên trình duyệt (không dùng file âm thanh). =====
  // chords: nốt MIDI của từng hợp âm; sec: số giây mỗi hợp âm; lp: tần số lọc thấp; arp: rải hợp âm; bass: bè trầm; crackle: tiếng đĩa than.
  var TRACKS = [
    { id: "focus", name: "Tập Trung Sâu", emoji: "\u{1F3AF}", desc: "Chậm, ấm, có tiếng đĩa than, êm dịu để tập trung lâu", sec: 5, lp: 1100, arp: false, bass: true, crackle: true, wave: ["triangle", "sine"],
      chords: [[50, 57, 60, 64], [55, 59, 65, 64], [48, 55, 59, 64], [45, 55, 60, 64]] },
    { id: "cafe", name: "Cà Phê Sáng", emoji: "☕", desc: "Nhẹ, sáng, rải từng nốt như guitar", sec: 3.5, lp: 1900, arp: true, bass: true, crackle: false, wave: ["sine", "triangle"],
      chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]] },
    { id: "rain", name: "Mưa Đêm", emoji: "\u{1F327}\uFE0F", desc: "Tiếng mưa rơi êm, thi thoảng có sấm xa — không có nhạc", rain: true, lp: 9000, sec: 0, arp: false, bass: false, crackle: false, wave: ["sine", "sine"], chords: [[60]] }
  ];
  var trackIdx = 0;
  var ctx = null, master = null, lpFilter = null, timer, step = 0, playing = false, noise = null;
  var rainNodes = [], rainTimer, thunderTimer;
  function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function curTrack() { return TRACKS[trackIdx] || TRACKS[0]; }
  function isSupported() {
    return typeof window !== "undefined" && (typeof AudioContext !== "undefined" || "webkitAudioContext" in window);
  }
  function isPlaying() { return playing; }
  function baseCtx() {
    if (!ctx) { const Ctor = window.AudioContext || window.webkitAudioContext; ctx = new Ctor(); }
    return ctx;
  }
  function ensure() {
    baseCtx();
    if (ctx && !master) {
      master = ctx.createGain();
      master.gain.value = 0.5;
      lpFilter = ctx.createBiquadFilter();
      lpFilter.type = "lowpass";
      lpFilter.frequency.value = 1400;
      master.connect(lpFilter);
      lpFilter.connect(ctx.destination);
    }
    return ctx;
  }
  function pluck(freq, at, dur, vol, type) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(1e-4, at);
    g.gain.linearRampToValueAtTime(vol, at + 0.02);
    g.gain.exponentialRampToValueAtTime(1e-4, at + dur);
    o.connect(g); g.connect(master); o.start(at); o.stop(at + dur + 0.05);
  }
  function playChord(chord) {
    if (!ctx || !master) return;
    const T = curTrack(), now = ctx.currentTime, secs = T.sec, hz = chord.map(midiHz);
    if (T.arp) {
      const order = [0, 1, 2, 3, 2, 1, 2, 3], stepT = secs / order.length;
      order.forEach((ix, i) => pluck(hz[ix] * 2, now + i * stepT, stepT * 2.2, 0.11, T.wave[0]));
      pluck(hz[0], now, secs + 0.4, 0.07, "sine");
    } else {
      hz.forEach((freq, i) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = T.wave[i % 2]; osc.frequency.value = freq; osc.detune.value = (Math.random() - 0.5) * 8;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.16, now + Math.min(1.6, secs * 0.2));
        gain.gain.linearRampToValueAtTime(1e-4, now + secs + 0.6);
        osc.connect(gain); gain.connect(master); osc.start(now); osc.stop(now + secs + 0.7);
      });
    }
    if (T.bass) pluck(hz[0] / 2, now, Math.min(secs, 3), 0.2, "sine");
    pluck(hz[Math.floor(Math.random() * hz.length)] * 2, now + secs * 0.38, 1.6, 0.12, "sine");
  }
  function startCrackle() {
    if (!ctx || !master) return;
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() < 15e-4 ? (Math.random() - 0.5) * 0.6 : 0;
    noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const g = ctx.createGain(); g.gain.value = 0.5; noise.connect(g); g.connect(master); noise.start();
  }
  // Tiếng mưa: nền "xào xạc" từ nhiễu lọc + hạt mưa lách tách ngẫu nhiên + sấm xa thỉnh thoảng (tạo trực tiếp, không dùng file).
  function noiseBuf(sec) {
    const len = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.18; }
    return buf;
  }
  function startRain() {
    const bed = ctx.createBufferSource(); bed.buffer = noiseBuf(6); bed.loop = true;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 350;
    const bp = ctx.createBiquadFilter(); bp.type = "peaking"; bp.frequency.value = 3200; bp.gain.value = 5; bp.Q.value = 0.7;
    const g = ctx.createGain(); g.gain.value = 0.9;
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.12; lg.gain.value = 0.12; lfo.connect(lg); lg.connect(g.gain); lfo.start();
    bed.connect(hp); hp.connect(bp); bp.connect(g); g.connect(master); bed.start();
    rainNodes.push(bed, lfo);
    const drop = noiseBuf(0.12);
    rainTimer = window.setInterval(() => {
      const n = 1 + Math.floor(Math.random() * 3);
      for (let k = 0; k < n; k++) {
        if (Math.random() < 0.45) continue;
        const src = ctx.createBufferSource(); src.buffer = drop;
        const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1800 + Math.random() * 5200; f.Q.value = 2 + Math.random() * 4;
        const gg = ctx.createGain(), at = ctx.currentTime + Math.random() * 0.08, dur = 0.015 + Math.random() * 0.04;
        gg.gain.setValueAtTime(0.12 + Math.random() * 0.25, at); gg.gain.exponentialRampToValueAtTime(1e-4, at + dur);
        src.connect(f); f.connect(gg); gg.connect(master); src.start(at, Math.random() * 0.05); src.stop(at + dur + 0.02);
      }
    }, 70);
    const thunder = () => {
      const src = ctx.createBufferSource(); src.buffer = noiseBuf(5);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 140 + Math.random() * 80;
      const gg = ctx.createGain(), at = ctx.currentTime + 0.1;
      gg.gain.setValueAtTime(1e-4, at); gg.gain.linearRampToValueAtTime(0.5, at + 0.9); gg.gain.exponentialRampToValueAtTime(1e-4, at + 4.6);
      src.connect(f); f.connect(gg); gg.connect(master); src.start(at); src.stop(at + 5);
      thunderTimer = window.setTimeout(thunder, 22000 + Math.random() * 30000);
    };
    thunderTimer = window.setTimeout(thunder, 12000 + Math.random() * 15000);
  }
  function stopRain() {
    if (rainTimer !== void 0) window.clearInterval(rainTimer);
    if (thunderTimer !== void 0) window.clearTimeout(thunderTimer);
    rainTimer = thunderTimer = void 0;
    rainNodes.forEach((n) => { try { n.stop(); } catch { } });
    rainNodes = [];
  }
  async function start() {
    const c = ensure();
    if (c.state === "suspended") await c.resume();
    if (playing) return true;
    playing = true; step = 0;
    const T = curTrack();
    if (lpFilter) lpFilter.frequency.value = T.lp;
    if (T.rain) { startRain(); return true; }
    playChord(T.chords[step]);
    if (T.crackle) startCrackle();
    timer = window.setInterval(() => { step = (step + 1) % T.chords.length; playChord(T.chords[step]); }, T.sec * 1e3);
    return true;
  }
  function stop() {
    playing = false;
    if (timer !== void 0) window.clearInterval(timer);
    timer = void 0;
    if (noise) { try { noise.stop(); } catch { } noise = null; }
    stopRain();
  }
  async function pickTrack(i) {
    trackIdx = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
    if (isPlaying()) { stop(); if (state.settings.sound) { setVolume(ui.volume / 100); await start(); } }
    renderEntertainment();
  }
  function setVolume(v) {
    if (master) master.gain.value = Math.min(1, Math.max(0, v));
  }
  var sfxOn = true;
  function setSfxEnabled(on) {
    sfxOn = on;
  }
  function blip(c, freq, at, dur, type, vol) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    g.gain.setValueAtTime(1e-4, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 8e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, at + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }
  function sfx(kind) {
    if (!sfxOn || !isSupported()) return;
    const ua = navigator.userActivation;
    if (ua && !ua.hasBeenActive) return;
    try {
      const c = baseCtx();
      if (c.state === "suspended") void c.resume();
      const t = c.currentTime;
      if (kind === "click") {
        blip(c, 720, t, 0.06, "triangle", 0.12);
      } else if (kind === "poke") {
        blip(c, 420, t, 0.06, "square", 0.08);
        blip(c, 840, t + 0.05, 0.1, "triangle", 0.13);
        blip(c, 1260, t + 0.12, 0.14, "sine", 0.1);
      } else if (kind === "pokeback") {
        blip(c, 988, t, 0.08, "sine", 0.1);
        blip(c, 740, t + 0.09, 0.14, "sine", 0.1);
      } else if (kind === "toggle") {
        blip(c, 520, t, 0.07, "sine", 0.14);
        blip(c, 780, t + 0.06, 0.08, "sine", 0.14);
      } else if (kind === "coin") {
        blip(c, 988, t, 0.09, "square", 0.07);
        blip(c, 1319, t + 0.08, 0.28, "square", 0.07);
      } else if (kind === "right" || kind.startsWith("right-preview-")) {
        const preset = kind.startsWith("right-preview-") ? kind.slice(-1) : (localStorage.getItem("windtp-sfx-right") || "1");
        if (preset === "1") {
          [659.25, 880].forEach((f, i) => blip(c, f, t + i * 0.09, 0.16, "sine", 0.13));
        } else if (preset === "2") {
          [523.25, 659.25, 783.99].forEach((f, i) => blip(c, f, t + i * 0.07, 0.16, "triangle", 0.14));
        } else {
          [784, 988, 1175].forEach((f, i) => blip(c, f, t + i * 0.065, 0.11, "sine", 0.12));
        }
      } else if (kind === "wrong" || kind.startsWith("wrong-preview-")) {
        const preset = kind.startsWith("wrong-preview-") ? kind.slice(-1) : (localStorage.getItem("windtp-sfx-wrong") || "1");
        if (preset === "1") {
          blip(c, 220, t, 0.18, "sawtooth", 0.08); blip(c, 165, t + 0.12, 0.24, "sawtooth", 0.08);
        } else if (preset === "2") {
          blip(c, 300, t, 0.055, "triangle", 0.09); blip(c, 240, t + 0.075, 0.055, "triangle", 0.09);
        } else {
          blip(c, 392, t, 0.10, "square", 0.055); blip(c, 294, t + 0.1, 0.17, "square", 0.055);
        }
      } else {
        blip(c, 220, t, 0.18, "sawtooth", 0.08);
        blip(c, 165, t + 0.12, 0.24, "sawtooth", 0.08);
      }
    } catch {
    }
  }
  function speechSupported() {
    return typeof window !== "undefined" && !!(window.speechSynthesis || window.webkitSpeechSynthesis) &&
      !!(window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance);
  }
  function speak(text, lang) {
    const phrase = String(text || "").trim();
    if (!phrase) return;
    const wantedLang = lang || "en-US";
    const langCode = wantedLang.toLowerCase().split("-")[0];
    const remoteSpeak = () => {
      try {
        const url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=" +
          encodeURIComponent(langCode) + "&q=" + encodeURIComponent(phrase);
        if (window.__windtpTtsAudio) { window.__windtpTtsAudio.pause(); window.__windtpTtsAudio = null; }
        const audio = new Audio(url);
        window.__windtpTtsAudio = audio;
        audio.play().catch(() => {});
      } catch {}
    };
    const synth = window.speechSynthesis || window.webkitSpeechSynthesis;
    const Utterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
    if (!synth || !Utterance) { remoteSpeak(); return; }
    try {
      synth.cancel();
      let completed = false;
      const say = () => {
        if (completed) return;
        const voices = synth.getVoices ? synth.getVoices() : [];
        const wanted = wantedLang.toLowerCase();
        const prefix = wanted.split("-")[0];
        const voice = voices.find(v => String(v.lang || "").toLowerCase() === wanted) ||
          voices.find(v => String(v.lang || "").toLowerCase().split("-")[0] === prefix);
        if (!voice) { completed = true; remoteSpeak(); return; }
        completed = true;
        const u = new Utterance(phrase);
        u.lang = wantedLang; u.voice = voice; u.rate = 0.88;
        u.onerror = () => remoteSpeak();
        synth.speak(u);
        if (typeof synth.resume === "function") synth.resume();
      };
      if (synth.getVoices && synth.getVoices().length) say();
      else {
        const onVoices = () => say();
        if (synth.addEventListener) synth.addEventListener("voiceschanged", onVoices, { once: true });
        else if (synth.onvoiceschanged !== undefined) {
          const previous = synth.onvoiceschanged;
          synth.onvoiceschanged = () => { try { if (typeof previous === "function") previous.call(synth); } finally { onVoices(); } };
        }
        setTimeout(() => { if (!completed) say(); }, 900);
      }
    } catch { remoteSpeak(); }
  }

