/*
 * Procedural ambient music for each underwater world, built with the Web Audio API
 * (no audio files). Every theme is a short looping sequence scheduled slightly ahead
 * of time, routed through a soft echo and a master gain that fades in and out.
 */
export type WorldTheme = "coral" | "open" | "grass" | "rock";

type Engine = { stop: () => void };

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

export function startOceanAmbience(volume = 0.34): Engine | null {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  void ctx.resume();
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.45);
  const compressor = ctx.createDynamicsCompressor();
  master.connect(compressor).connect(ctx.destination);

  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let index = 0; index < length; index += 1) {
    last = last * 0.985 + (Math.random() * 2 - 1) * 0.055;
    data[index] = last;
  }
  const waves = ctx.createBufferSource();
  waves.buffer = buffer;
  waves.loop = true;
  const waveFilter = ctx.createBiquadFilter();
  waveFilter.type = "lowpass";
  waveFilter.frequency.value = 720;
  const waveLevel = ctx.createGain();
  waveLevel.gain.value = 0.42;
  const swell = ctx.createOscillator();
  const swellDepth = ctx.createGain();
  swell.frequency.value = 0.12;
  swellDepth.gain.value = 0.16;
  swell.connect(swellDepth).connect(waveLevel.gain);
  waves.connect(waveFilter).connect(waveLevel).connect(master);
  waves.start();
  swell.start();

  const bubbleTimers: number[] = [];
  const bubble = () => {
    if (ctx.state === "closed") return;
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = 320 + Math.random() * 430;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(start * 2.8, now + 0.16);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
    oscillator.connect(gain).connect(master);
    oscillator.start(now);
    oscillator.stop(now + 0.21);
    bubbleTimers.push(window.setTimeout(bubble, 500 + Math.random() * 1300));
  };
  bubbleTimers.push(window.setTimeout(bubble, 260));

  return {
    stop: () => {
      bubbleTimers.forEach(window.clearTimeout);
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      window.setTimeout(() => void ctx.close(), 420);
    },
  };
}

export function startAmbientMusic(theme: WorldTheme, volume = 0.22): Engine | null {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  void ctx.resume();

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.6);
  const compressor = ctx.createDynamicsCompressor();
  master.connect(compressor).connect(ctx.destination);

  // Soft echo gives every world a sense of being underwater.
  const echo = ctx.createDelay(1);
  echo.delayTime.value = theme === "open" ? 0.42 : 0.3;
  const feedback = ctx.createGain();
  feedback.gain.value = theme === "open" ? 0.42 : 0.26;
  const echoTone = ctx.createBiquadFilter();
  echoTone.type = "lowpass";
  echoTone.frequency.value = 1800;
  const wet = ctx.createGain();
  wet.gain.value = 0.32;
  echo.connect(echoTone).connect(feedback).connect(echo);
  echoTone.connect(wet).connect(master);

  const bus = ctx.createGain();
  bus.connect(master);
  bus.connect(echo);

  const envelope = (gain: GainNode, t: number, peak: number, attack: number, decay: number) => {
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  };

  const osc = (
    type: OscillatorType,
    freq: number,
    t: number,
    peak: number,
    attack: number,
    decay: number,
    destination: AudioNode = bus,
  ) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    envelope(g, t, peak, attack, decay);
    o.connect(g).connect(destination);
    o.start(t);
    o.stop(t + attack + decay + 0.05);
    return o;
  };

  const instruments = {
    marimba: (note: number, t: number, level = 0.3) => {
      osc("sine", hz(note), t, level, 0.005, 0.55);
      osc("sine", hz(note) * 4, t, level * 0.18, 0.003, 0.12);
    },
    piano: (note: number, t: number, level = 0.16) => {
      osc("triangle", hz(note), t, level, 0.01, 2.2);
      osc("sine", hz(note) * 2, t, level * 0.25, 0.01, 1.2);
    },
    strings: (notes: number[], t: number, length: number, level = 0.045) => {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 900;
      filter.connect(bus);
      notes.forEach((note) => {
        [-7, 7].forEach((cents) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sawtooth";
          o.frequency.value = hz(note);
          o.detune.value = cents;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(level, t + length * 0.4);
          g.gain.linearRampToValueAtTime(0.0001, t + length + 1.2);
          o.connect(g).connect(filter);
          o.start(t);
          o.stop(t + length + 1.3);
        });
      });
    },
    pluck: (note: number, t: number, level = 0.2) => {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3200, t);
      filter.frequency.exponentialRampToValueAtTime(500, t + 0.5);
      filter.connect(bus);
      osc("triangle", hz(note), t, level, 0.004, 1.3, filter);
      osc("sawtooth", hz(note), t, level * 0.25, 0.004, 0.35, filter);
    },
    pizzicato: (note: number, t: number, level = 0.22) => {
      osc("triangle", hz(note), t, level, 0.003, 0.22);
      osc("sine", hz(note) * 2, t, level * 0.2, 0.002, 0.08);
    },
    bell: (note: number, t: number, level = 0.08) => {
      osc("sine", hz(note), t, level, 0.01, 2.8);
      osc("sine", hz(note) * 2.76, t, level * 0.35, 0.01, 1.4);
    },
    bubble: (t: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const start = 260 + Math.random() * 260;
      o.type = "sine";
      o.frequency.setValueAtTime(start, t);
      o.frequency.exponentialRampToValueAtTime(start * 3.2, t + 0.11);
      envelope(g, t, 0.05, 0.01, 0.12);
      o.connect(g).connect(bus);
      o.start(t);
      o.stop(t + 0.18);
    },
    whale: (t: number) => {
      const o = ctx.createOscillator();
      const vibrato = ctx.createOscillator();
      const vibratoDepth = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(190, t);
      o.frequency.exponentialRampToValueAtTime(410, t + 1.4);
      o.frequency.exponentialRampToValueAtTime(240, t + 3.2);
      vibrato.frequency.value = 4.5;
      vibratoDepth.gain.value = 7;
      vibrato.connect(vibratoDepth).connect(o.frequency);
      filter.type = "lowpass";
      filter.frequency.value = 1000;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.9);
      g.gain.linearRampToValueAtTime(0.0001, t + 3.4);
      o.connect(filter).connect(g).connect(bus);
      o.start(t);
      vibrato.start(t);
      o.stop(t + 3.5);
      vibrato.stop(t + 3.5);
    },
    woodblock: (t: number) => {
      osc("square", 1600, t, 0.025, 0.001, 0.04);
    },
  };

  // Gentle filtered noise that swells like a sea current.
  let current: AudioBufferSourceNode | null = null;
  let currentSwell: OscillatorNode | null = null;
  if (theme === "grass" || theme === "open") {
    const length = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.2;
    }
    current = ctx.createBufferSource();
    current.buffer = buffer;
    current.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = theme === "grass" ? 520 : 320;
    const level = ctx.createGain();
    level.gain.value = theme === "grass" ? 0.16 : 0.08;
    currentSwell = ctx.createOscillator();
    currentSwell.frequency.value = 0.09;
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = level.gain.value * 0.7;
    currentSwell.connect(swellDepth).connect(level.gain);
    current.connect(filter).connect(level).connect(master);
    current.start();
    currentSwell.start();
  }

  const _ = null;
  const songs: Record<
    WorldTheme,
    { bpm: number; perBeat: number; play: (step: number, t: number, stepLength: number) => void }
  > = {
    // Cheerful soft marimba in C major pentatonic with bubbles.
    coral: {
      bpm: 100,
      perBeat: 2,
      play: (step, t) => {
        const melody = [
          72,
          _,
          76,
          79,
          76,
          _,
          74,
          72,
          69,
          _,
          72,
          76,
          74,
          _,
          72,
          _,
          72,
          _,
          74,
          76,
          79,
          _,
          81,
          79,
          76,
          _,
          74,
          72,
          74,
          _,
          _,
          _,
        ];
        const bass = [48, 45, 41, 43];
        const note = melody[step % melody.length];
        if (note) instruments.marimba(note, t);
        if (step % 8 === 0) instruments.marimba(bass[Math.floor(step / 8) % 4], t, 0.34);
        if (step % 8 === 4) instruments.marimba(bass[Math.floor(step / 8) % 4] + 7, t, 0.18);
        if (Math.random() < 0.16) instruments.bubble(t + Math.random() * 0.2);
      },
    },
    // Calm piano over string chords, with soft whale songs.
    open: {
      bpm: 60,
      perBeat: 1,
      play: (step, t, stepLength) => {
        const chords = [
          [57, 60, 64],
          [53, 57, 60],
          [48, 55, 64],
          [55, 59, 62],
        ];
        const chord = chords[Math.floor(step / 4) % 4];
        if (step % 4 === 0) instruments.strings(chord, t, stepLength * 4);
        const arpeggio = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 12];
        if (step % 2 === 0 || Math.random() < 0.4) instruments.piano(arpeggio[step % 4], t);
        if (step % 24 === 6) instruments.whale(t);
      },
    },
    // Quiet acoustic picking in G major over the swaying current.
    grass: {
      bpm: 72,
      perBeat: 2,
      play: (step, t) => {
        const chords = [
          [55, 59, 62],
          [52, 55, 59],
          [48, 52, 55],
          [50, 54, 57],
        ];
        const [root, third, fifth] = chords[Math.floor(step / 8) % 4];
        const pattern = [root - 12, fifth, third + 12, fifth, root + 12, fifth, third + 12, fifth];
        instruments.pluck(pattern[step % 8], t, step % 8 === 0 ? 0.24 : 0.15);
      },
    },
    // Playful, slightly mysterious pizzicato in D dorian.
    rock: {
      bpm: 112,
      perBeat: 2,
      play: (step, t) => {
        const melody = [
          62,
          _,
          65,
          69,
          _,
          67,
          65,
          _,
          64,
          _,
          67,
          71,
          _,
          69,
          67,
          _,
          62,
          _,
          65,
          69,
          72,
          _,
          71,
          69,
          67,
          _,
          65,
          64,
          62,
          _,
          _,
          _,
        ];
        const bass = [38, 36, 34, 33];
        const note = melody[step % melody.length];
        if (note) instruments.pizzicato(note, t);
        if (step % 4 === 0) instruments.pizzicato(bass[Math.floor(step / 8) % 4], t, 0.26);
        if (step % 8 === 6) instruments.woodblock(t);
        if (step % 32 === 0) instruments.bell(74, t + 0.02);
      },
    },
  };

  const song = songs[theme];
  const stepLength = 60 / song.bpm / song.perBeat;
  let step = 0;
  let nextTime = ctx.currentTime + 0.15;
  const timer = window.setInterval(() => {
    while (nextTime < ctx.currentTime + 0.6) {
      song.play(step, nextTime, stepLength);
      step += 1;
      nextTime += stepLength;
    }
  }, 60);

  let stopped = false;
  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      window.clearInterval(timer);
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.5);
      window.setTimeout(() => {
        current?.stop();
        currentSwell?.stop();
        void ctx.close();
      }, 650);
    },
  };
}

/* ---------- One-shot sound effects (shared, lazily created context) ---------- */

export type SoundEffect = "bubbles" | "whale" | "chime" | "swish" | "munch" | "pop";

let effectsContext: AudioContext | null = null;

function getEffectsContext() {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!effectsContext || effectsContext.state === "closed") effectsContext = new AudioCtx();
  void effectsContext.resume().catch(() => {});
  return effectsContext;
}

function blip(
  ctx: AudioContext,
  output: AudioNode,
  t: number,
  from: number,
  to: number,
  length: number,
  level: number,
  type: OscillatorType = "sine",
) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + length);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + Math.min(0.02, length / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  o.connect(g).connect(output);
  o.start(t);
  o.stop(t + length + 0.05);
}

export function playEffect(effect: SoundEffect) {
  const ctx = getEffectsContext();
  if (!ctx) return;
  const out = ctx.createGain();
  out.gain.value = 0.6;
  out.connect(ctx.destination);
  const t = ctx.currentTime + 0.02;

  if (effect === "bubbles") {
    for (let i = 0; i < 7; i += 1) {
      const start = 280 + Math.random() * 320;
      blip(ctx, out, t + i * 0.07 + Math.random() * 0.04, start, start * 3, 0.12, 0.08);
    }
  } else if (effect === "pop") {
    blip(ctx, out, t, 420, 1300, 0.1, 0.1);
  } else if (effect === "chime") {
    [76, 79, 84].forEach((note, i) => blip(ctx, out, t + i * 0.09, hz(note), hz(note), 0.6, 0.07));
  } else if (effect === "swish") {
    blip(ctx, out, t, 300, 1200, 0.35, 0.05, "triangle");
    blip(ctx, out, t + 0.25, 1200, 500, 0.3, 0.04, "triangle");
  } else if (effect === "munch") {
    [0, 0.16, 0.32].forEach((d) => blip(ctx, out, t + d, 180, 120, 0.08, 0.09, "square"));
  } else if (effect === "whale") {
    const o = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const depth = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(200, t);
    o.frequency.exponentialRampToValueAtTime(460, t + 1);
    o.frequency.exponentialRampToValueAtTime(260, t + 2.4);
    vibrato.frequency.value = 5;
    depth.gain.value = 8;
    vibrato.connect(depth).connect(o.frequency);
    filter.type = "lowpass";
    filter.frequency.value = 1100;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.14, t + 0.5);
    g.gain.linearRampToValueAtTime(0.0001, t + 2.6);
    o.connect(filter).connect(g).connect(out);
    o.start(t);
    vibrato.start(t);
    o.stop(t + 2.7);
    vibrato.stop(t + 2.7);
  }
}

/*
 * Bubbling sound for the entrance curtain: starts with the bubbles rising and its
 * volume fades smoothly to silence by the end of the animation.
 */
export function playBubbleIntro(durationSeconds: number) {
  const ctx = getEffectsContext();
  if (!ctx) return;
  const requested = performance.now();
  const begin = () => {
    // Browsers may block sound before the first tap; then the curtain stays silent.
    if (ctx.state !== "running") return;
    const remaining = durationSeconds - (performance.now() - requested) / 1000;
    if (remaining > 0.6) scheduleBubbleIntro(ctx, remaining);
  };
  if (ctx.state === "running") begin();
  else void ctx.resume().then(begin, () => {});
}

function scheduleBubbleIntro(ctx: AudioContext, durationSeconds: number) {
  const out = ctx.createGain();
  const t = ctx.currentTime + 0.02;
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.5, t + 0.25);
  out.gain.linearRampToValueAtTime(0.0001, t + durationSeconds);
  out.connect(ctx.destination);
  const bubbles = Math.round(durationSeconds * 14);
  for (let i = 0; i < bubbles; i += 1) {
    const at = t + (i / bubbles) * (durationSeconds - 0.2) + Math.random() * 0.05;
    const start = 240 + Math.random() * 420;
    blip(ctx, out, at, start, start * (2.4 + Math.random()), 0.09 + Math.random() * 0.06, 0.06);
  }
}
