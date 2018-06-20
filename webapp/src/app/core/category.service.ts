
import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Category, Client } from '@app/entities';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable()
export class CategoryService {

  readonly api = `${environment.api}/Category`;

  constructor(private http: HttpClient) { }

  create(payload: Category): Observable<Category> {
    return this.http.post<Category>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(ct => new Category(ct)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: Category): Observable<Category> {
    return this.http.put<Category>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(ct => new Category(ct)),
      catchError(e => observableThrowError(e))
    );
  }

  remove(id: number): Observable<string> {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text', withCredentials: true }).pipe(
      catchError(e => observableThrowError(e))
    );
  }

  getClients(id: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.api}/${id}/clients`, { withCredentials: true }).pipe(
      map(clients => clients.map(c => new Client(c))),
      catchError(e => observableThrowError(e))
    );
  }

  addClient(categoryid: number, clientid: number): Observable<Client> {
    return this.http.put<Client>(`${this.api}/${categoryid}/addClient/${clientid}`, null, { withCredentials: true }).pipe(
      map(cl => new Client(cl)),
      catchError(e => observableThrowError(e))
    );
  }

  removeClient(categoryid: number, clientid: number): Observable<Client> {
    return this.http.put<Client>(`${this.api}/${categoryid}/removeClient/${clientid}`, null, { withCredentials: true }).pipe(
      map(cl => new Client(cl)),
      catchError(e => observableThrowError(e))
    );
  }


}
