import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth/auth.service';


@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(
        private authService:AuthService,
        private router:Router,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (request.url.startsWith(`${environment.urlServer}/register`)) { return next.handle(request); }
        else if (request.url.startsWith(`${environment.urlServer}/login`)) { return next.handle(request); }

        return of(this.authService.getToken).pipe(
            switchMap((token) => {
                request = this.cloneBearerToken(token, request);
                return next.handle(request);
            }),
            catchError((err) => {
                if(err.status === 401 || err.status === 403){
                        this.authService.logout();
                }
                return of(err);
            })
        );
    }

    cloneBearerToken(token: string, request: HttpRequest<any>) {
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                }
            });
        }
        return request;
    }

}
