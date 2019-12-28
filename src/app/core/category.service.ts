import { CoreModule } from './core.module';

import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Category, Client } from '@app/entities';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: CoreModule
})
export class CategoryService {

  readonly api = `${environment.api}/Category`;

  constructor(private http: HttpClient) { }

  create(payload: Category): Observable<Category> {
    return this.http.post<Category>(`${this.api}`, payload).pipe(
      map(ct => new Category(ct)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: Category): Observable<Category> {
    return this.http.put<Category>(`${this.api}`, payload).pipe(
      map(ct => new Category(ct)),
      catchError(e => observableThrowError(e))
    );
  }

  remove(id: string): Observable<string> {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text' }).pipe(
      catchError(e => observableThrowError(e))
    );
  }

  getClients(id: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.api}/${id}/clients`).pipe(
      map(clients => clients.map(c => new Client(c))),
      catchError(e => observableThrowError(e))
    );
  }

  addClient(categoryid: string, clientid: string): Observable<Client> {
    return this.http.put<Client>(`${this.api}/${categoryid}/addClient/${clientid}`, null).pipe(
      map(cl => new Client(cl)),
      catchError(e => observableThrowError(e))
    );
  }

  removeClient(categoryid: string, clientid: string): Observable<Client> {
    return this.http.put<Client>(`${this.api}/${categoryid}/removeClient/${clientid}`, null).pipe(
      map(cl => new Client(cl)),
      catchError(e => observableThrowError(e))
    );
  }


}
