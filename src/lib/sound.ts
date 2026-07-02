export type SoundKind = "tap" | "nav" | "action" | "toggle" | "success" | "error" | "focus";

export const SOUND_PREF_EVENT = "mohit-os-sound-change";

const SOUND_STORAGE_KEY = "mohit-os-sound";
const MASTER_GAIN = 0.055;

type SoundOptions = {
  force?: boolean;
};

type WebkitAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let audioContext: AudioContext | null = null;
let masterNode: AudioNode | null = null;
let cachedEnabled: boolean | null = null;

export function getSoundEnabled() {
  if (typeof window === "undefined") return false;
  if (cachedEnabled !== null) return cachedEnabled;

  try {
    cachedEnabled = window.localStorage.getItem(SOUND_STORAGE_KEY) !== "off";
  } catch {
    cachedEnabled = true;
  }

  return cachedEnabled;
}

export function setSoundEnabled(enabled: boolean) {
  cachedEnabled = enabled;

  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Local storage can be unavailable in private or embedded contexts.
  }

  window.dispatchEvent(new CustomEvent<boolean>(SOUND_PREF_EVENT, { detail: enabled }));
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (audioContext?.state === "closed") {
    audioContext = null;
    masterNode = null;
  }
  if (audioContext) return audioContext;

  const AudioCtor = window.AudioContext ?? (window as WebkitAudioWindow).webkitAudioContext;
  if (!AudioCtor) return null;

  audioContext = new AudioCtor();
  return audioContext;
}

function getMasterNode(ctx: AudioContext) {
  if (masterNode) return masterNode;

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -28;
  compressor.knee.value = 18;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.12;
  compressor.connect(ctx.destination);
  masterNode = compressor;

  return masterNode;
}

function chirp(
  ctx: AudioContext,
  startFreq: number,
  endFreq: number,
  duration: number,
  delay = 0,
  volume = 1,
  type: OscillatorType = "sine",
) {
  const now = ctx.currentTime + delay;
  const stop = now + duration;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(1, startFreq), now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), stop);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(MASTER_GAIN * volume, now + Math.min(0.012, duration * 0.35));
  gain.gain.exponentialRampToValueAtTime(0.0001, stop);

  osc.connect(gain);
  gain.connect(getMasterNode(ctx));
  osc.start(now);
  osc.stop(stop + 0.02);
}

function noiseClick(ctx: AudioContext, delay = 0, duration = 0.024, volume = 0.35) {
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < sampleCount; i += 1) {
    const fade = 1 - i / sampleCount;
    data[i] = (Math.random() * 2 - 1) * fade * 0.55;
  }

  const now = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = 2800;
  filter.Q.value = 7;
  gain.gain.setValueAtTime(MASTER_GAIN * volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(getMasterNode(ctx));
  source.start(now);
}

export function playUiSound(kind: SoundKind = "tap", options: SoundOptions = {}) {
  if (!options.force && !getSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  switch (kind) {
    case "nav":
      noiseClick(ctx, 0, 0.018, 0.22);
      chirp(ctx, 520, 780, 0.055, 0, 0.58, "triangle");
      chirp(ctx, 980, 1320, 0.04, 0.036, 0.34, "sine");
      break;
    case "action":
      noiseClick(ctx, 0, 0.026, 0.34);
      chirp(ctx, 360, 880, 0.085, 0, 0.72, "sawtooth");
      chirp(ctx, 880, 1380, 0.06, 0.045, 0.32, "triangle");
      break;
    case "toggle":
      chirp(ctx, 760, 520, 0.07, 0, 0.5, "triangle");
      chirp(ctx, 1120, 860, 0.052, 0.035, 0.26, "sine");
      break;
    case "success":
      chirp(ctx, 620, 980, 0.07, 0, 0.55, "triangle");
      chirp(ctx, 980, 1560, 0.07, 0.055, 0.38, "sine");
      break;
    case "error":
      noiseClick(ctx, 0, 0.036, 0.48);
      chirp(ctx, 260, 175, 0.11, 0, 0.56, "sawtooth");
      break;
    case "focus":
      chirp(ctx, 880, 720, 0.04, 0, 0.28, "triangle");
      break;
    case "tap":
    default:
      noiseClick(ctx, 0, 0.018, 0.2);
      chirp(ctx, 690, 940, 0.045, 0, 0.38, "triangle");
      break;
  }
}
