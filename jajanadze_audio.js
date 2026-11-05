// Jajanadze Flix - Audio Engine (Web Audio API & Speech Synthesis)

class JajanadzeAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlayingMusic = false;
    this.musicVolume = 0.35;
    this.tempo = 118; // BPM for talk show groove
    this.musicTimer = null;
    this.step = 0;
    this.masterGain = null;
    this.isMuted = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.musicVolume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // 1. Netflix Iconic "TA-DUM" Sound Effect Synthesizer
  playTadum() {
    this.initContext();
    const now = this.audioCtx.currentTime;

    // A. Sub-bass boom (80Hz -> 30Hz punch)
    const subOsc = this.audioCtx.createOscillator();
    const subGain = this.audioCtx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);
    
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(1.0, now + 0.04);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 2.6);

    // B. Second Bass Strike (The "DUM" hit at 0.4s)
    const hitOsc = this.audioCtx.createOscillator();
    const hitGain = this.audioCtx.createGain();
    hitOsc.type = 'triangle';
    hitOsc.frequency.setValueAtTime(120, now + 0.38);
    hitOsc.frequency.exponentialRampToValueAtTime(40, now + 1.8);

    hitGain.gain.setValueAtTime(0.001, now);
    hitGain.gain.setValueAtTime(0.001, now + 0.38);
    hitGain.gain.linearRampToValueAtTime(0.9, now + 0.42);
    hitGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

    hitOsc.connect(hitGain);
    hitGain.connect(this.masterGain);
    hitOsc.start(now + 0.38);
    hitOsc.stop(now + 2.9);

    // C. Metallic Gong / Cinematic Anvil high shimmer
    const shimmerOsc = this.audioCtx.createOscillator();
    const shimmerFilter = this.audioCtx.createBiquadFilter();
    const shimmerGain = this.audioCtx.createGain();

    shimmerOsc.type = 'sawtooth';
    shimmerOsc.frequency.setValueAtTime(360, now + 0.38);
    shimmerOsc.frequency.exponentialRampToValueAtTime(180, now + 2.5);

    shimmerFilter.type = 'bandpass';
    shimmerFilter.frequency.setValueAtTime(1200, now + 0.38);
    shimmerFilter.Q.setValueAtTime(4.0, now + 0.38);

    shimmerGain.gain.setValueAtTime(0.001, now);
    shimmerGain.gain.setValueAtTime(0.001, now + 0.38);
    shimmerGain.gain.linearRampToValueAtTime(0.4, now + 0.45);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    shimmerOsc.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(this.masterGain);
    shimmerOsc.start(now + 0.38);
    shimmerOsc.stop(now + 3.3);
  }

  // 2. Play Notification Ping (Gmail code arrival)
  playNotificationPing() {
    this.initContext();
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.setValueAtTime(1320, now + 0.08); // E6

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.65);
  }

  // 3. UI Click Sound
  playClick() {
    this.initContext();
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 4. Jajanidze Custom Theme Soundtrack (Talkshow Funk & Synth Groove)
  startMusic() {
    if (this.isPlayingMusic) return;
    this.initContext();
    this.isPlayingMusic = true;
    this.step = 0;

    const secondsPerBeat = 60.0 / this.tempo;
    const stepDuration = secondsPerBeat / 4; // 16th notes

    // Bass notes progression (Am - F - C - G)
    const bassScale = [
      110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83,
      87.31, 87.31, 110, 130.81, 130.81, 130.81, 146.83, 98.0
    ];

    // Synth Melody notes
    const melodyScale = [
      440, 0, 523.25, 0, 659.25, 587.33, 523.25, 0,
      392, 0, 440, 523.25, 0, 659.25, 587.33, 440
    ];

    this.musicTimer = setInterval(() => {
      if (!this.isPlayingMusic || !this.audioCtx) return;
      const t = this.audioCtx.currentTime;
      const currentStep = this.step % 16;

      // Kick on 0, 4, 8, 12
      if (currentStep % 4 === 0) {
        this.playDrumKick(t);
      }
      // Snare on 4, 12
      if (currentStep === 4 || currentStep === 12) {
        this.playDrumSnare(t);
      }
      // Hi-hat on every odd step
      if (currentStep % 2 === 0) {
        this.playHiHat(t, 0.05);
      } else {
        this.playHiHat(t, 0.02);
      }

      // Bass note
      const bassFreq = bassScale[currentStep];
      if (bassFreq > 0) {
        this.playBassNote(t, bassFreq, stepDuration * 1.5);
      }

      // Melody lead
      const melodyFreq = melodyScale[currentStep];
      if (melodyFreq > 0 && Math.random() > 0.15) {
        this.playMelodyLead(t, melodyFreq, stepDuration * 1.8);
      }

      this.step++;
    }, stepDuration * 1000);
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  toggleMusic() {
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  setVolume(val) {
    this.musicVolume = parseFloat(val);
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.audioCtx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.audioCtx.currentTime);
    }
    return this.isMuted;
  }

  // Instrument helpers
  playDrumKick(t) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.1);
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playDrumSnare(t) {
    // Noise buffer
    const bufferSize = this.audioCtx.sampleRate * 0.1;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, t);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 0.15);
  }

  playHiHat(t, volume) {
    const osc = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(7500, t);
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, t);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  playBassNote(t, freq, duration) {
    const osc = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.exponentialRampToValueAtTime(150, t + duration);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + duration);
  }

  playMelodyLead(t, freq, duration) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + duration);
  }

  // 5. Speech Synthesis Helper with Natural Georgian & Phonetic Fallback
  speak(text, onEnd = null) {
    if (!('speechSynthesis' in window)) {
      console.warn("SpeechSynthesis not supported");
      if (onEnd) onEnd();
      return;
    }

    // Cancel ongoing speech to ensure immediate playback
    window.speechSynthesis.cancel();

    // Map common phrases to clear phonetic pronunciation if English voice is used
    const phoneticMap = {
      "დიდება ცირეკლიძე ჯაჯანაძეს ინგლისურის მცოდნეს": "Dideba Tsireklidze Jajanadzes inglisuris mtsodnes",
      "დათოა სულელი ტვინიკოსი": "Datoa soolelee tveen-eekosee"
    };

    const voices = window.speechSynthesis.getVoices();
    const georgianVoice = voices.find(v => v.lang.toLowerCase().includes('ka') || v.lang.toLowerCase().includes('geo'));
    
    let textToSpeak = text;
    let selectedVoice = null;
    let selectedLang = 'ka-GE';

    if (georgianVoice) {
      selectedVoice = georgianVoice;
      selectedLang = 'ka-GE';
      textToSpeak = text;
    } else {
      // Pick best English voice for clear phonetic speech
      selectedVoice = voices.find(v => v.lang.includes('en') || v.default) || null;
      selectedLang = 'en-US';
      textToSpeak = phoneticMap[text] || text;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedLang;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    // If voices are not yet loaded, wait for onvoiceschanged
    if (voices.length === 0 && 'onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  }
}

// Global audio singleton
const jajanadzeAudio = new JajanadzeAudioEngine();
