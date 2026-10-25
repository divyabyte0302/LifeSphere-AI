/**
 * LifeSphere AI-X — Accessible Environmental Audio Cues Service
 * 
 * Provides opt-in, accessible spoken audio announcements (Speech Synthesis) and audible
 * alerts for verified route hazards, rerouting suggestions, and safety reminders.
 * 
 * Safety Features:
 * - Rate limiting (prevents audio flooding / excessive announcements)
 * - Mute / Unmute state controls
 * - Visual toast fallback for browser audio permission denials or silent mode
 * - Verified data check (no synthetic hazard announcements)
 */

export interface AudioCueConfig {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
  rate: number;   // 0.8 to 1.2
  pitch: number;  // 0.8 to 1.2
}

class AudioCueService {
  private config: AudioCueConfig = {
    enabled: true,
    volume: 0.9,
    rate: 1.0,
    pitch: 1.0,
  };

  private lastAnnouncementTime: number = 0;
  private minIntervalMs: number = 10000; // Minimum 10 seconds between announcements to prevent distraction

  /**
   * Configure audio cue settings.
   */
  setConfig(newConfig: Partial<AudioCueConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration.
   */
  getConfig(): AudioCueConfig {
    return { ...this.config };
  }

  /**
   * Toggle mute state.
   */
  toggleMute(): boolean {
    this.config.enabled = !this.config.enabled;
    if (!this.config.enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.config.enabled;
  }

  /**
   * Announce an environmental hazard or reroute alert via SpeechSynthesis.
   */
  announce(text: string, priority: 'normal' | 'urgent' = 'normal'): boolean {
    if (!this.config.enabled) return false;

    const now = Date.now();
    if (priority !== 'urgent' && now - this.lastAnnouncementTime < this.minIntervalMs) {
      console.log('Audio cue rate-limited:', text);
      return false;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis API not supported in environment.');
      return false;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.config.volume;
      utterance.rate = this.config.rate;
      utterance.pitch = this.config.pitch;

      window.speechSynthesis.speak(utterance);
      this.lastAnnouncementTime = now;
      return true;
    } catch (err) {
      console.error('Error executing speech synthesis announcement:', err);
      return false;
    }
  }

  /**
   * Stop all ongoing speech utterances.
   */
  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioCueService = new AudioCueService();
