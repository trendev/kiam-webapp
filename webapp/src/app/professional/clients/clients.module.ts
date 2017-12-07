import { NgModule } from '@angular/core';

import { ClientsRoutingModule } from './clients-routing.module';
import { SharedModule } from '@app/shared';
import { ClientsComponent } from './clients/clients.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';

@NgModule({
  imports: [
    SharedModule,
    ClientsRoutingModule
  ],
  declarations: [ClientsComponent, CreateClientComponent, ClientDetailComponent]
})
export class ClientsModule { }
