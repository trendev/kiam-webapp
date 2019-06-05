import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
@Injectable()
export class JWTInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // TODO : load the token from the localstorage
        const jwt = 'my_fake_token';

        const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + jwt } });
        return next.handle(authReq);
    }
}
