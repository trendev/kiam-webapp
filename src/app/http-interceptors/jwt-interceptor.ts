import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

    private readonly JWT_HEADER = 'JWT';

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const jwt = this.loadJWT();

        if (jwt) {
            const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + jwt } });
            return this.handle(authReq, next);

        } else {
            return this.handle(req, next);
        }
    }

    private loadJWT(): string {
        return localStorage.getItem(this.JWT_HEADER);
    }

    private saveJWT(jwt: string) {
        if (jwt) {
            localStorage.setItem(this.JWT_HEADER, jwt);
        }
    }

    private handle(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                tap(event => {
                    console.log(`event = ${JSON.stringify(event, null, 2)}`);
                    if (event instanceof HttpResponse) {
                        const jwt = event.headers.get(this.JWT_HEADER);
                        this.saveJWT(jwt);
                    }
                })
            );
    }
}
