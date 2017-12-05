import { CreateClientComponent } from './create-client/create-client.component';
import { ClientsComponent } from './clients/clients.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-client',
    component: CreateClientComponent
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
