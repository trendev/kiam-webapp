import { NgModule } from '@angular/core';

import { OfferingsRoutingModule } from './offerings-routing.module';
import { SharedModule } from '@app/shared';
import { OfferingsComponent } from './offerings/offerings.component';

@NgModule({
  imports: [
    SharedModule,
    OfferingsRoutingModule
  ],
  declarations: [OfferingsComponent]
})
export class OfferingsModule { }
