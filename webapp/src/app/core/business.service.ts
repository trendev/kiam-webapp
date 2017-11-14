import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable()
export class BusinessService {

  readonly api = `${environment.api}/Business`;

  constructor() { }

}
