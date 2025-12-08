// Sound effects utility for the learning app

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Success/correct answer sound
  playSuccess() {
    if (!this.enabled) return;
    this.playTone([523.25, 659.25, 783.99], 0.15, 'sine');
  }

  // Error/wrong answer sound
  playError() {
    if (!this.enabled) return;
    this.playTone([200, 150], 0.2, 'sawtooth');
  }

  // Click/tap sound
  playClick() {
    if (!this.enabled) return;
    this.playTone([800], 0.05, 'sine');
  }

  // Level up celebration
  playLevelUp() {
    if (!this.enabled) return;
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone([freq], 0.1, 'sine'), i * 80);
    });
  }

  // Star earned sound
  playStar() {
    if (!this.enabled) return;
    this.playTone([880, 1108.73, 1318.51], 0.2, 'sine');
  }

  // Game start sound
  playGameStart() {
    if (!this.enabled) return;
    this.playTone([440, 554.37, 659.25], 0.15, 'triangle');
  }

  // Timer tick sound
  playTick() {
    if (!this.enabled) return;
    this.playTone([1000], 0.02, 'sine');
  }

  // Bonus/combo sound
  playBonus() {
    if (!this.enabled) return;
    this.playTone([659.25, 783.99, 987.77, 1174.66], 0.1, 'sine');
  }

  // Complete/finish sound
  playComplete() {
    if (!this.enabled) return;
    const melody = [523.25, 659.25, 783.99, 1046.5];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone([freq], 0.2, 'sine'), i * 150);
    });
  }

  private playTone(frequencies: number[], duration: number, type: OscillatorType) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, now);
        
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(now + i * 0.05);
        oscillator.stop(now + duration + i * 0.05);
      });
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  }
}

export const soundManager = new SoundManager();
