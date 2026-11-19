import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSaverService {
  private STORAGE_KEY = 'felc_data_saver_mode';
  private SAVED_MB_KEY = 'felc_data_saver_saved_mb';

  public isEnabled = signal<boolean>(false);
  public savedMegabytes = signal<number>(14.6);

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const isInitial = stored === 'true';
      this.isEnabled.set(isInitial);
      this.applyClass(isInitial);

      const savedMb = localStorage.getItem(this.SAVED_MB_KEY);
      if (savedMb) {
        this.savedMegabytes.set(parseFloat(savedMb));
      }
    }
  }

  toggle() {
    const next = !this.isEnabled();
    this.isEnabled.set(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, String(next));
      this.applyClass(next);
      if (next) {
        // Increment saved data counter
        const current = this.savedMegabytes() + 1.8;
        this.savedMegabytes.set(Math.round(current * 10) / 10);
        localStorage.setItem(this.SAVED_MB_KEY, String(this.savedMegabytes()));
      }
    }
  }

  private applyClass(enabled: boolean) {
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.body.classList.add('data-saver-mode');
      } else {
        document.body.classList.remove('data-saver-mode');
      }
    }
  }
}
