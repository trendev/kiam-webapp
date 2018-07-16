import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeToolbarComponent } from './welcome/welcome-toolbar/welcome-toolbar.component';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { SloganComponent } from './slogan/slogan.component';
import { TitleComponent } from './slogan/title/title.component';
import { SentenceComponent } from './slogan/sentence/sentence.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    WelcomeRoutingModule
  ],
  declarations: [WelcomeComponent, WelcomeToolbarComponent, SloganComponent, TitleComponent, SentenceComponent]
})
export class WelcomeModule { }
