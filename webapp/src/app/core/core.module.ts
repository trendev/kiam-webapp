import { CategoryService } from './category.service';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { BusinessService } from './business.service';
import { PaymentModeService } from './payment-mode.service';
import { ProfessionalService } from './professional.service';
import { ClientService } from './client.service';
import { CollectiveGroupsResolverService } from './collective-groups-resolver.service';
import { CategoriesResolverService } from './categories-resolver.service';
import { BusinessesResolverService } from './businesses-resolver.service';
import { PaymentModesResolverService } from './payment-modes-resolver.service';
import { ClientsResolverService } from './clients-resolver.service';
import { OfferingsResolverService } from './offerings-resolver.service';
import { PackService } from './pack.service';
import { ProfessionalBusinessesResolverService } from './professional-businesses-resolver.service';
import { ServiceService } from './service.service';
import { ProfessionalPaymentModesResolverService } from './professional-payment-modes-resolver.service';
import { ProfessionalBillsRefDateResolverService } from './professional-bills-ref-date-resolver.service';
import { ClientBillService } from './client-bill.service';
import { ProfessionalBillsResolverService } from './professional-bills-resolver.service';
import { CollectiveGroupService } from './collective-group.service';
import { CollectiveGroupBillService } from './collective-group-bill.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientXsrfModule
  ],
  declarations: [],
  providers: [
    AuthenticationService,
    BusinessService,
    PaymentModeService,
    ProfessionalService,
    ClientService,
    CollectiveGroupsResolverService,
    CategoriesResolverService,
    BusinessesResolverService,
    PaymentModesResolverService,
    ClientsResolverService,
    OfferingsResolverService,
    PackService,
    ProfessionalBusinessesResolverService,
    ServiceService,
    ProfessionalPaymentModesResolverService,
    ProfessionalBillsRefDateResolverService,
    ClientBillService,
    ProfessionalBillsResolverService,
    CollectiveGroupService,
    CollectiveGroupBillService,
    CategoryService]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
