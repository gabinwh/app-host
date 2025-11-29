import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    private authService = inject(AuthService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getUserToken();
        let authReq = req;
        if (token) {
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
        }
        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {

                // Backend disse que o token é inválido ou expirou
                if (err.status === 401 || err.status === 403) {
                    this.authService.logout();
                }

                return throwError(() => err);
            })
        );
    }
}