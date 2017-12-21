import { NgModule } from '@angular/core';

import { OfferingsRoutingModule } from './offerings-routing.module';
import { SharedModule } from '@app/shared';
import { OfferingsComponent } from './offerings/offerings.component';
import { ServicesComponentComponent } from './services-component/services-component.component';
import { PacksComponentComponent } from './packs-component/packs-component.component';
import { PackDetailComponent } from './pack-detail/pack-detail.component';
import { PackDetailResolverService } from './pack-detail-resolver.service';
import { PackParentPacksResolverService } from './pack-parent-packs-resolver.service';
import { PackContentComponent } from './pack-content/pack-content.component';
import { ParentPacksComponent } from './parent-packs/parent-packs.component';
import { CreatePackComponent } from './create-pack/create-pack.component';

@NgModule({
  imports: [
    SharedModule,
    OfferingsRoutingModule
  ],
  declarations: [
    OfferingsComponent,
    ServicesComponentComponent,
    PacksComponentComponent,
    PackDetailComponent,
    PackContentComponent,
    ParentPacksComponent,
    CreatePackComponent
  ],
  providers: [PackDetailResolverService, PackParentPacksResolverService]
})
export class OfferingsModule { }
