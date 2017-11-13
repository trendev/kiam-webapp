import { NgModule } from '@angular/core';

import { ClientsRoutingModule } from './clients-routing.module';
import { SharedModule } from '@app/shared';
import { ClientsComponent } from './clients/clients.component';

@NgModule({
  imports: [
    SharedModule,
    ClientsRoutingModule
  ],
  declarations: [ClientsComponent]
})
export class ClientsModule { }
