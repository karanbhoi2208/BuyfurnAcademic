import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './Service/loading.service';
import { finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.showLoading();

  if (typeof localStorage !== 'undefined') {
    const authString = localStorage.getItem('basicAuth');
    if (authString) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: authString
        }
      });
      // console.log(authString);

      return next(clonedRequest).pipe(
        finalize(() => loadingService.hideLoading())
      );
    }
  }

  return next(req).pipe(
    finalize(() => loadingService.hideLoading())
  );
};
