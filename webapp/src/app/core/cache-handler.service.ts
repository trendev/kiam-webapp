import { Injectable } from '@angular/core';
import { ProfessionalService } from './professional.service';
import { PaymentModeService } from './payment-mode.service';
import { BusinessService } from './business.service';

@Injectable()
export class CacheHandlerService {

  constructor(
    private paymentModeService: PaymentModeService,
    private professionalService: ProfessionalService) { }

  resetCache() {
    this.paymentModeService.resetCache();
    this.professionalService.resetCache();
  }

}
