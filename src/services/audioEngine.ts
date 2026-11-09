/**
 * Echo Music High-Fidelity Web Audio & Synthesis Engine
 * Features:
 * - 64-band AnalyserNode for real-time fluid visualizer
 * - 5-band Graphic Equalizer (BiquadFilterNodes)
 * - Varispeed tape pitch and playback rate control
 * - Real audio file playback + adaptive generative synthesizer chords/drums
 */

export interface EQBands {
  bass: number; // 60Hz (-12 to +12 dB)
  lowMid: number; // 250Hz
  mid: number; // 1kHz
  highMid: number; // 4kHz
  treble: number; // 12kHz
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private eqFilters: {
    bass: BiquadFilterNode;
    lowMid: BiquadFilterNode;
    mid: BiquadFilterNode;
    highMid: BiquadFilterNode;
    treble: BiquadFilterNode;
  } | null = null;

  private isPlaying = false;
  private synthInterval: number | null = null;
  private currentBpm = 118;
  private audioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.82;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Setup 5-band EQ
    const bass = this.ctx.createBiquadFilter();
    bass.type = 'lowshelf';
    bass.frequency.value = 60;

    const lowMid = this.ctx.createBiquadFilter();
    lowMid.type = 'peaking';
    lowMid.frequency.value = 250;
    lowMid.Q.value = 1.0;

    const mid = this.ctx.createBiquadFilter();
    mid.type = 'peaking';
    mid.frequency.value = 1000;
    mid.Q.value = 1.0;

    const highMid = this.ctx.createBiquadFilter();
    highMid.type = 'peaking';
    highMid.frequency.value = 4000;
    highMid.Q.value = 1.0;

    const treble = this.ctx.createBiquadFilter();
    treble.type = 'highshelf';
    treble.frequency.value = 12000;

    // Chain: EQ filters -> Analyser -> Master Gain -> Destination
    bass.connect(lowMid);
    lowMid.connect(mid);
    mid.connect(highMid);
    highMid.connect(treble);
    treble.connect(this.analyser);
    this.analyser.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.eqFilters = { bass, lowMid, mid, highMid, treble };
  }

  public setVolume(val: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.03);
    }
  }

  public setEQ(bands: EQBands) {
    this.initContext();
    if (!this.eqFilters || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.eqFilters.bass.gain.setTargetAtTime(bands.bass, t, 0.05);
    this.eqFilters.lowMid.gain.setTargetAtTime(bands.lowMid, t, 0.05);
    this.eqFilters.mid.gain.setTargetAtTime(bands.mid, t, 0.05);
    this.eqFilters.highMid.gain.setTargetAtTime(bands.highMid, t, 0.05);
    this.eqFilters.treble.gain.setTargetAtTime(bands.treble, t, 0.05);
  }

  public setPlaybackRate(rate: number) {
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  public playCustomAudio(url: string, onEnded?: () => void) {
    this.initContext();
    if (!this.ctx || !this.eqFilters) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopSynth();

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      this.audioSourceNode = this.ctx.createMediaElementSource(this.audioElement);
      this.audioSourceNode.connect(this.eqFilters.bass);
    }

    if (onEnded) {
      this.audioElement.onended = onEnded;
    }

    this.audioElement.src = url;
    this.audioElement.play().catch(() => {
      // Fallback to generative synthesis
      this.startSynth(this.currentBpm);
    });
    this.isPlaying = true;
  }

  public playTrack(bpm = 118, customAudioUrl?: string, onEnded?: () => void) {
    this.initContext();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }

    this.currentBpm = bpm;

    if (customAudioUrl) {
      this.playCustomAudio(customAudioUrl, onEnded);
      return;
    }

    // High quality procedural synthesizer for rich ambient playback
    this.isPlaying = true;
    this.startSynth(bpm);
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynth();
  }

  public resume() {
    this.initContext();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    if (this.audioElement && this.audioElement.src) {
      this.audioElement.play().catch(() => this.startSynth(this.currentBpm));
    } else {
      this.startSynth(this.currentBpm);
    }
  }

  private startSynth(bpm: number) {
    this.stopSynth();
    if (!this.ctx || !this.eqFilters) return;

    const intervalMs = (60 / bpm) * 1000 * 0.5; // 8th note pulse

    const chords = [
      [220.0, 261.63, 329.63, 392.0], // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23], // G7
      [164.81, 196.0, 246.94, 293.66], // Em7
    ];

    let step = 0;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx || !this.eqFilters) return;
      const t = this.ctx.currentTime;
      const chord = chords[Math.floor((step / 4) % chords.length)];

      // Rich pad voice
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.eqFilters) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.045 / chord.length, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

        osc.connect(gain);
        gain.connect(this.eqFilters.bass);

        osc.start(t);
        osc.stop(t + 0.75);
      });

      // Warm analog bass note on downbeats
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(chord[0] / 2, t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, t);
        filter.frequency.exponentialRampToValueAtTime(90, t + 0.35);

        bassGain.gain.setValueAtTime(0.08, t);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

        bassOsc.connect(filter);
        filter.connect(bassGain);
        bassGain.connect(this.eqFilters.bass);

        bassOsc.start(t);
        bassOsc.stop(t + 0.4);
      }

      step++;
    };

    playChordStep();
    this.synthInterval = window.setInterval(playChordStep, intervalMs);
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new AudioEngine();
