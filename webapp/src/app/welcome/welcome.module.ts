import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeToolbarComponent } from './welcome/welcome-toolbar/welcome-toolbar.component';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { BannerComponent } from './banner/banner.component';
import { TitleComponent } from './banner/title/title.component';
import { SentenceComponent } from './banner/sentence/sentence.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    WelcomeRoutingModule
  ],
  declarations: [WelcomeComponent, WelcomeToolbarComponent, BannerComponent, TitleComponent, SentenceComponent]
})
export class WelcomeModule { }
