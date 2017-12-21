import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Offering, OfferingType, Pack } from '@app/entities';

@Injectable()
export class PackService {

  readonly api = `${environment.api}/Pack`;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  getParentPacks(id: number): Observable<Pack[]> {
    return this.http.get<Offering[]>(`${this.api}/${id}/parentPacks`, { withCredentials: true })
      .map(offerings => offerings
        .filter(o => o.cltype === OfferingType.PACK)
        .map(o => new Pack(o))
      )
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  create(payload: Pack): Observable<Pack> {
    return this.http.post<Pack>(`${this.api}`, payload, { withCredentials: true })
      .map(pack => new Pack(pack))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  update(payload: Pack): Observable<Pack> {
    return this.http.put<Pack>(`${this.api}`, payload, { withCredentials: true })
      .map(pack => new Pack(pack))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  remove(id: number): Observable<string> {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text', withCredentials: true })
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }
}
