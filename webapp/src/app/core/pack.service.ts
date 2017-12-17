import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Offering, OfferingType, Service, Pack } from '@app/entities';

@Injectable()
export class PackService {

  readonly api = `${environment.api}/Pack`;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  getParentPacks(id: number): Observable<Offering[]> {
    return this.http.get<Offering[]>(`${this.api}/${id}/parentPacks`, { withCredentials: true })
      .map(offerings => offerings.map(o => {
        switch (o.cltype) {
          case OfferingType.SERVICE:
            return new Service(o);
          case OfferingType.PACK:
            return new Pack(o);
        }
      }))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

}
