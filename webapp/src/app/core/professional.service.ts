import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Professional } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalService {

  readonly api = `${environment.api}/Professional`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  profile(refresh: boolean = true): Observable<Professional> {
    return this.http.get<Professional>(`${this.api}/profile`,
      {
        params: new HttpParams().set('refresh', `${refresh}`),
        withCredentials: true
      })
      .map(pro => new Professional(pro))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  put(payload: Professional): Observable<Professional> {
    return this.http.put<Professional>(`${this.api}`, payload, { withCredentials: true })
      .map(_pro => new Professional(_pro))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

}
