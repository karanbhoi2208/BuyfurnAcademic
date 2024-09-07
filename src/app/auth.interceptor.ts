import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (typeof localStorage !== 'undefined') {

    const authString = localStorage.getItem('basicAuth');
    if (authString) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: authString
        }

      });
      console.log(authString);

      return next(clonedRequest);
    }
  }

  return next(req);
};