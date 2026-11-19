import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toastService.toasts().length > 0">
      <div 
        *ngFor="let toast of toastService.toasts()" 
        class="toast"
        [ngClass]="{
          'toast-success': toast.type === 'success',
          'toast-error': toast.type === 'error',
          'toast-info': toast.type === 'info'
        }"
      >
        <div class="toast-icon">
          <span *ngIf="toast.type === 'success'">✅</span>
          <span *ngIf="toast.type === 'error'">⚠️</span>
          <span *ngIf="toast.type === 'info'">ℹ️</span>
        </div>
        <div style="flex: 1;">
          <div *ngIf="toast.title" style="font-weight: 700; font-size: 0.875rem; margin-bottom: 0.2rem;">
            {{ toast.title }}
          </div>
          <div style="font-size: 0.85rem; color: var(--slate-700);">
            {{ toast.message }}
          </div>
        </div>
        <button 
          (click)="toastService.remove(toast.id)"
          style="background: none; border: none; font-size: 1.1rem; color: var(--slate-400); cursor: pointer; padding: 0 0.25rem;"
        >
          ×
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);
}
