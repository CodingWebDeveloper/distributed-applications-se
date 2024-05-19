import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  baseUrl = environment.apiUrl;

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          if (error.status === 400) {
            if (error.error.errors) {
              throw error.error;
            } else {
              this.toastr.error(error.error.message, error.status.toString());
            }
          }

          if (error.status === 401) {
            this.toastr.error(error.error.message, error.status.toString());
            this.router.navigateByUrl('/account/login');
          }

          if (error.status === 403) {
            const accountUrl = this.baseUrl + 'account';

            if (accountUrl === request.url) {
              this.router.navigateByUrl('/account/login');
            } else {
              this.toastr.error('Access forbidden');
            }
          }

          if (error.status === 404) {
            const accountUrl = this.baseUrl + 'account';

            if (accountUrl === request.url) {
              this.router.navigateByUrl('/account/login');
            } else {
              this.router.navigateByUrl('/not-found');
            }
          }

          if (error.status === 500) {
            const navigationExtras: NavigationExtras = {
              state: {
                error: error.error,
              },
            };

            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }

        return throwError(() => new Error(error.message));
      })
    );
  }
}
