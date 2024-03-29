import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JWTInterceptor } from './jwt-interceptor';
import { UnauthorizedInterceptor } from './unauthorized-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
];
