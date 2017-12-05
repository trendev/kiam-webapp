import { Injectable } from '@angular/core';
import { ProfessionalService } from './professional.service';
import { PaymentModeService } from './payment-mode.service';
import { BusinessService } from './business.service';

@Injectable()
export class CacheHandlerService {

  constructor(private businessService: BusinessService,
    private paymentModeService: PaymentModeService,
    private professionalService: ProfessionalService) { }

  resetCache() {
    this.businessService.resetCache();
    this.paymentModeService.resetCache();
    this.professionalService.resetCache();
  }

}
