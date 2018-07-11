import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeToolbarComponent } from './welcome/welcome-toolbar/welcome-toolbar.component';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    WelcomeRoutingModule
  ],
  declarations: [WelcomeComponent, WelcomeToolbarComponent]
})
export class WelcomeModule { }
