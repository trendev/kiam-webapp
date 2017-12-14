import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorHandlerService } from './error-handler.service';
import { BusinessService } from './business.service';
import { PaymentModeService } from './payment-mode.service';
import { ProfessionalService } from './professional.service';
import { ClientService } from './client.service';
import { CollectiveGroupsResolverService } from './collective-groups-resolver.service';
import { CategoriesResolverService } from './categories-resolver.service';
import { BusinessesResolverService } from './businesses-resolver.service';
import { PaymentModesResolverService } from './payment-modes-resolver.service';
import { ClientsResolverService } from './clients-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientXsrfModule
  ],
  declarations: [],
  providers: [
    AuthenticationService,
    ErrorHandlerService,
    BusinessService,
    PaymentModeService,
    ProfessionalService,
    ClientService,
    CollectiveGroupsResolverService,
    CategoriesResolverService,
    BusinessesResolverService,
    PaymentModesResolverService,
    ClientsResolverService]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
