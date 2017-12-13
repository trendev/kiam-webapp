import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';
import { LoginModule } from '@app/login';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    LoginModule, // must be before AppRoutingModule or won't be loaded as expected
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
