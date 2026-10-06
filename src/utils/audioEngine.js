/**
 * Self-contained Web Audio API engine for realistic racing audio.
 * Zero external asset dependencies to guarantee 100% reliability offline & on mobile.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.isMuted = false;
    this.initialized = false;

    // Engine sound nodes
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineFilter = null;
    this.engineGain = null;

    // Skid sound nodes
    this.skidSource = null;
    this.skidGain = null;
    this.skidFilter = null;

    // Nitro sound nodes
    this.nitroSource = null;
    this.nitroGain = null;
    this.nitroFilter = null;

    // Background synth music interval
    this.musicTimer = null;
    this.musicStep = 0;
  }

  init() {
    if (this.initialized) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      
      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Music Bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Setup Subsystems
      this._setupEngine();
      this._setupSkid();
      this._setupNitro();

      this.initialized = true;

      // Unlock for mobile browsers
      if (this.ctx.state === 'suspended') {
        const unlock = () => {
          this.ctx.resume().then(() => {
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
          });
        };
        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
      }
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _setupEngine() {
    if (!this.ctx) return;

    // Dual oscillator setup for deep throaty cylinder rumble
    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc1.frequency.setValueAtTime(45, this.ctx.currentTime);

    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = 'triangle';
    this.engineOsc2.frequency.setValueAtTime(22.5, this.ctx.currentTime);

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(350, this.ctx.currentTime);
    this.engineFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.engineOsc1.connect(this.engineFilter);
    this.engineOsc2.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.sfxGain);

    this.engineOsc1.start();
    this.engineOsc2.start();
  }

  _createNoiseBuffer(seconds = 2) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  _setupSkid() {
    if (!this.ctx) return;
    const noiseBuffer = this._createNoiseBuffer(2);
    if (!noiseBuffer) return;

    this.skidSource = this.ctx.createBufferSource();
    this.skidSource.buffer = noiseBuffer;
    this.skidSource.loop = true;

    this.skidFilter = this.ctx.createBiquadFilter();
    this.skidFilter.type = 'bandpass';
    this.skidFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    this.skidFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    this.skidGain = this.ctx.createGain();
    this.skidGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.skidSource.connect(this.skidFilter);
    this.skidFilter.connect(this.skidGain);
    this.skidGain.connect(this.sfxGain);

    this.skidSource.start();
  }

  _setupNitro() {
    if (!this.ctx) return;
    const noiseBuffer = this._createNoiseBuffer(2);
    if (!noiseBuffer) return;

    this.nitroSource = this.ctx.createBufferSource();
    this.nitroSource.buffer = noiseBuffer;
    this.nitroSource.loop = true;

    this.nitroFilter = this.ctx.createBiquadFilter();
    this.nitroFilter.type = 'bandpass';
    this.nitroFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    this.nitroFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.nitroGain = this.ctx.createGain();
    this.nitroGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.nitroSource.connect(this.nitroFilter);
    this.nitroFilter.connect(this.nitroGain);
    this.nitroGain.connect(this.sfxGain);

    this.nitroSource.start();
  }

  /**
   * Update continuous telemetry sound (Engine RPM, load, skidding, nitro)
   */
  updateTelemetry({ rpm, throttle, isDrifting, isNitro, speed }) {
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Engine Pitch and Filter modulation
    if (this.engineOsc1 && this.engineFilter && this.engineGain) {
      // RPM ranges ~900 to 7500 -> Base freq ranges 35Hz to 240Hz
      const targetFreq = 35 + (rpm / 7500) * 205;
      this.engineOsc1.frequency.setTargetAtTime(targetFreq, now, 0.05);
      this.engineOsc2.frequency.setTargetAtTime(targetFreq * 0.5, now, 0.05);

      // Lowpass filter opens up as throttle is pressed
      const filterCutoff = 250 + (rpm / 7500) * 1400 + (throttle ? 700 : 0);
      this.engineFilter.frequency.setTargetAtTime(filterCutoff, now, 0.06);

      // Engine volume based on throttle & speed
      const baseVol = 0.22 + (throttle ? 0.25 : 0.08) + (speed / 300) * 0.15;
      this.engineGain.gain.setTargetAtTime(baseVol, now, 0.05);
    }

    // Skid noise modulation
    if (this.skidGain) {
      const targetSkidVol = isDrifting ? Math.min(0.5, 0.15 + (speed / 180) * 0.35) : 0.0;
      this.skidGain.gain.setTargetAtTime(targetSkidVol, now, 0.08);
    }

    // Nitro sound modulation
    if (this.nitroGain) {
      const targetNitroVol = isNitro ? 0.45 : 0.0;
      this.nitroGain.gain.setTargetAtTime(targetNitroVol, now, 0.05);
    }
  }

  playCollision(intensity = 1.0) {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 * intensity, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.28);

    const hitVol = Math.min(0.8, 0.3 + intensity * 0.4);
    gain.gain.setValueAtTime(hitVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  playCheckpointChime() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const now = this.ctx.currentTime;
    const notes = [523.25, 783.99, 1046.5]; // C5 -> G5 -> C6

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.25, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.32);
    });
  }

  playNearMissChime() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  startMusic() {
    if (this.musicTimer || !this.ctx) return;

    // Upbeat cyberpunk synth sequence
    const bassline = [110, 110, 130.8, 146.8, 110, 110, 164.8, 146.8];
    const lead = [440, 523.25, 659.25, 587.33, 440, 659.25, 783.99, 659.25];

    this.musicStep = 0;
    this.musicTimer = setInterval(() => {
      if (!this.ctx || this.isMuted || this.ctx.state !== 'running') return;
      
      const now = this.ctx.currentTime;
      const bFreq = bassline[this.musicStep % bassline.length];
      const lFreq = lead[(this.musicStep * 2) % lead.length];

      // Bass note
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'sawtooth';
      bOsc.frequency.setValueAtTime(bFreq * 0.5, now);
      bGain.gain.setValueAtTime(0.08, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      bOsc.connect(bGain);
      bGain.connect(this.musicGain);
      bOsc.start(now);
      bOsc.stop(now + 0.2);

      // Lead arpeggio
      if (this.musicStep % 2 === 0) {
        const lOsc = this.ctx.createOscillator();
        const lGain = this.ctx.createGain();
        lOsc.type = 'triangle';
        lOsc.frequency.setValueAtTime(lFreq, now);
        lGain.gain.setValueAtTime(0.05, now);
        lGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        lOsc.connect(lGain);
        lGain.connect(this.musicGain);
        lOsc.start(now);
        lOsc.stop(now + 0.16);
      }

      this.musicStep++;
    }, 180);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0.0 : 0.8, this.ctx.currentTime);
    }
  }

  setSFXVolume(val) {
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  setMusicVolume(val) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }
}

export const soundManager = new AudioEngine();
