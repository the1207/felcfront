import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  public isSpeaking = signal(false);
  public isSupported = signal(typeof window !== 'undefined' && 'speechSynthesis' in window);
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  speak(text: string, lang = 'fr-FR', rate = 1.0) {
    if (!this.isSupported()) return;

    this.stop();

    // Clean markdown/special characters for speech
    const cleanText = text
      .replace(/#+/g, '')
      .replace(/\*+/g, '')
      .replace(/`+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanText) return;

    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance.lang = lang;
    this.currentUtterance.rate = rate;

    this.currentUtterance.onstart = () => {
      this.isSpeaking.set(true);
    };

    this.currentUtterance.onend = () => {
      this.isSpeaking.set(false);
      this.currentUtterance = null;
    };

    this.currentUtterance.onerror = () => {
      this.isSpeaking.set(false);
      this.currentUtterance = null;
    };

    window.speechSynthesis.speak(this.currentUtterance);
  }

  stop() {
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking.set(false);
    this.currentUtterance = null;
  }

  toggle(text: string) {
    if (this.isSpeaking()) {
      this.stop();
    } else {
      this.speak(text);
    }
  }
}
