import { Category, Client } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CategoryService {

  readonly api = `${environment.api}/Category`;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  create(payload: Category): Observable<Category> {
    return this.http.post<Category>(`${this.api}`, payload, { withCredentials: true })
      .map(ct => new Category(ct))
      .catch(e => Observable.throw(e));
  }

  update(payload: Category): Observable<Category> {
    return this.http.put<Category>(`${this.api}`, payload, { withCredentials: true })
      .map(ct => new Category(ct))
      .catch(e => Observable.throw(e));
  }

  remove(id: number): Observable<string> {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text', withCredentials: true })
      .catch(e => Observable.throw(e));
  }

  getClients(id: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.api}/${id}/clients`, { withCredentials: true })
      .map(clients => clients.map(c => new Client(c)))
      .catch(e => Observable.throw(e));
  }

}
