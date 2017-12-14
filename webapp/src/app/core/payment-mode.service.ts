import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { PaymentMode } from '@app/entities';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class PaymentModeService {

  readonly api = `${environment.api}/PaymentMode`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  get paymentModes(): Observable<PaymentMode[]> {

    return this.http.get<PaymentMode[]>(`${this.api}`,
      {
        withCredentials: true
      })
      .map(result => result.map(r => new PaymentMode(r)))
      .catch(e => this.errorHandler.handle(e));
  }

}
