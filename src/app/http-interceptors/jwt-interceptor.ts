import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

    // must be equivalent on the Backend side...
    public static readonly JWT_HEADER = 'JWT';

    private static KEY: string;

    private static getKey(): string {
        if (!JWTInterceptor.KEY) {
            JWTInterceptor.KEY = btoa(JWTInterceptor.JWT_HEADER);
        }
        return JWTInterceptor.KEY;
    }

    public static removeJWT() {
        localStorage.removeItem(JWTInterceptor.getKey());
    }

    constructor() { }

    /**
     * Intercept:
     * - an outgoing request and add the security token (JWT) in the "Authorization" header.
     * - incoming request with header JWT, extract the security token and store it in the local storage.
     * @param req the requets to intercept
     * @param next the next interceptors
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const jwt = this.loadJWT();

        if (jwt) {
            // request are non mutable and must be cloned
            const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + jwt } });
            return this.handle(authReq, next);

        } else {
            return this.handle(req, next);
        }
    }

    /**
     * Load the JWT from the local storage
     */
    private loadJWT(): string {
        return localStorage.getItem(JWTInterceptor.getKey());
    }

    /**
     * Save the JWT in the local storage
     * @param jwt the JWT to save
     */
    private saveJWT(jwt: string) {
        localStorage.setItem(JWTInterceptor.getKey(), jwt);
    }

    private handle(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        const jwt = event.headers.get(JWTInterceptor.JWT_HEADER);
                        if (jwt) { // the Backend responses providing the security token
                            this.saveJWT(jwt);
                        }
                    }
                })
            );
    }
}
