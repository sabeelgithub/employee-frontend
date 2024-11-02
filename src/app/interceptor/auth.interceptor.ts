// token.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  
  // Get the access token
  const accessToken = localStorage.getItem('accessToken');
  
  // Clone and add token if it exists
  if (accessToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // Handle the request and catch any errors
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && accessToken) {
        // Handle expired token
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const newAccessToken = localStorage.getItem('accessToken');
            if (!newAccessToken) {
              throw new Error('No access token available after refresh');
            }
            
            // Retry the original request with new token
            const clonedRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`
              }
            });
            
            return next(clonedRequest);
          }),
          catchError((refreshError) => {
            console.error('Token refresh failed:', refreshError);
            // You might want to handle logout here
            // authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};