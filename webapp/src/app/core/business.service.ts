import { Injectable, Optional } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { Business } from '@app/entities';

@Injectable()
export class BusinessService {

  readonly api = `${environment.api}/Business`;

  private _businesses: Business[];

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  get businesses(): Observable<Business[]> {
    if (this._businesses) {
      return Observable.of(this._businesses);
    } else {
      return this.http.get<Business[]>(`${this.api}`,
        {
          withCredentials: true
        })
        .map(result => {
          this._businesses = result.map(r => new Business(r));
          return this._businesses;
        })
        .catch(e => this.errorHandler.handle(e));
    }
  }

  resetBusinesses() { this._businesses = undefined; }
}
