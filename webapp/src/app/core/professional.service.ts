import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Professional, Client, CollectiveGroup, Category } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalService {

  readonly api = `${environment.api}/Professional`;
  private _clients: Client[];
  private _collectiveGroups: CollectiveGroup[];
  private _categories: Category[];

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  resetCache() {
    this._clients = undefined;
    this._collectiveGroups = undefined;
    this._categories = undefined;
  }

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

  getClients(refresh = false): Observable<Client[]> {

    if (this._clients && !refresh) {
      return Observable.of(this._clients);
    } else {
      return this.http.get<Client[]>(`${this.api}/clients`,
        {
          withCredentials: true
        })
        .map(result => {
          this._clients = result.map(r => new Client(r)); // request cached
          return this._clients;
        })
        .catch(e => this.errorHandler.handle(e));
    }
  }

  getCollectiveGroups(refresh = false): Observable<CollectiveGroup[]> {
    if (this._collectiveGroups && !refresh) {
      return Observable.of(this._collectiveGroups);
    } else {
      return this.http.get<CollectiveGroup[]>(`${this.api}/collectiveGroups`,
        {
          withCredentials: true
        })
        .map(result => {
          this._collectiveGroups = result.map(r => new CollectiveGroup(r)); // request cached
          return this._collectiveGroups;
        })
        .catch(e => this.errorHandler.handle(e));
    }
  }

  getCategories(refresh = false): Observable<Category[]> {
    if (this._categories && !refresh) {
      return Observable.of(this._categories);
    } else {
      return this.http.get<Category[]>(`${this.api}/categories`,
        {
          withCredentials: true
        })
        .map(result => {
          this._categories = result.map(r => new Category(r)); // request cached
          return this._categories;
        })
        .catch(e => this.errorHandler.handle(e));
    }
  }

}
