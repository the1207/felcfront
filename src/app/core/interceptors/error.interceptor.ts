import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inattendue est survenue.';

      if (error.error && typeof error.error === 'object') {
        if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.errors) {
          // Validation errors map
          errorMessage = Object.values(error.error.errors).join(', ');
        }
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }

      if (error.status === 401) {
        // Token expiré ou absent
        if (authService.isLoggedIn()) {
          toastService.error('Votre session a expiré. Veuillez vous reconnecter.');
          authService.logout();
        }
      } else if (error.status === 403) {
        toastService.error(errorMessage || 'Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      } else if (error.status === 502) {
        toastService.error(errorMessage || 'Le service externe (IA Claude ou GitHub) est momentanément indisponible.');
      }

      return throwError(() => error);
    })
  );
};
