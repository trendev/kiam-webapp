import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';
import { Service, Pack, Offering, OfferingType } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class ServiceService {

  readonly api = `${environment.api}/Service`;

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

  create(payload: Service): Observable<Service> {
    return this.http.post<Service>(`${this.api}`, payload, { withCredentials: true })
      .map(service => new Service(service))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  update(payload: Service): Observable<Service> {
    return this.http.put<Service>(`${this.api}`, payload, { withCredentials: true })
      .map(service => new Service(service))
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
