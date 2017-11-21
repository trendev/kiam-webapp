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

  private _paymentModes: PaymentMode[];

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  get paymentModes(): Observable<PaymentMode[]> {

    if (this._paymentModes !== undefined) {
      return Observable.of(this._paymentModes);
    } else {
      return this.http.get<PaymentMode[]>(`${this.api}`,
        {
          withCredentials: true
        })
        .map(result => {
          this._paymentModes = result.map(r => new PaymentMode(r));
          return this._paymentModes;
        })
        .catch(e => this.errorHandler.handle(e));
    }

  }

}
