import { NgModule } from '@angular/core';

import { OfferingsRoutingModule } from './offerings-routing.module';
import { SharedModule } from '@app/shared';
import { OfferingsComponent } from './offerings/offerings.component';
import { ServicesComponentComponent } from './services-component/services-component.component';
import { PacksComponentComponent } from './packs-component/packs-component.component';
import { PackDetailComponent } from './pack-detail/pack-detail.component';

@NgModule({
  imports: [
    SharedModule,
    OfferingsRoutingModule
  ],
  declarations: [OfferingsComponent, ServicesComponentComponent, PacksComponentComponent, PackDetailComponent]
})
export class OfferingsModule { }
