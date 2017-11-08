import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdministratorGuard } from './administrator.guard';
import { AdministratorToolbarComponent } from './administrator/administrator-toolbar/administrator-toolbar.component';

@NgModule({
  imports: [
    SharedModule,
    AdministratorRoutingModule
  ],
  declarations: [AdministratorComponent, AdministratorToolbarComponent],
  providers: [AdministratorGuard]
})
export class AdministratorModule { }
