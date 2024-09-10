import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './Service/loading.service';
import { finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService); // Inject the LoadingService

  const isAdminRequest = req.url.includes('/admin'); // Check if the request is for admin URLs
  // console.log(isAdminRequest);

  if (!isAdminRequest) {
    loadingService.showLoading();  // Use the injected service directly
  }

  if (typeof localStorage !== 'undefined') {
    const authString = localStorage.getItem('basicAuth');
    if (authString) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: authString // Attach Authorization header
        }
      });

      return next(clonedRequest).pipe(
        finalize(() => {
          if (!isAdminRequest) {
            loadingService.hideLoading(); // Hide loader only for non-admin requests
          }
        })
      );
    }
  }

  return next(req).pipe(
    finalize(() => {
      if (!isAdminRequest) {
        loadingService.hideLoading(); // Hide loader only for non-admin requests
      }
    })
  );
};
