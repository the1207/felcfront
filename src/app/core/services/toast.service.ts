import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  public toasts = this.toastsSignal.asReadonly();
  private nextId = 1;

  show(type: 'success' | 'error' | 'info', message: string, title?: string, durationMs = 4000) {
    const id = this.nextId++;
    const newToast: Toast = { id, type, title, message };
    this.toastsSignal.update(toasts => [...toasts, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  success(message: string, title = 'Succès') {
    this.show('success', message, title);
  }

  error(message: string, title = 'Erreur') {
    this.show('error', message, title, 6000);
  }

  info(message: string, title = 'Information') {
    this.show('info', message, title);
  }

  remove(id: number) {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }
}
