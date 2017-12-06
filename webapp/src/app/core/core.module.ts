import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorHandlerService } from './error-handler.service';
import { BusinessService } from './business.service';
import { PaymentModeService } from './payment-mode.service';
import { ProfessionalService } from './professional.service';
import { CacheHandlerService } from './cache-handler.service';
import { ClientService } from './client.service';

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
    CacheHandlerService,
    ClientService]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
