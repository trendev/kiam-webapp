
import { ErrorHandlerService } from './error-handler.service';
import { LogUpdateService } from './log-update.service';
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
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { LoadingOverlayService } from './loading-overlay.service';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { httpInterceptorProviders } from './http-interceptors';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    LoadingOverlayComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    // WelcomeModule,
    LoginModule, // must be before AppRoutingModule or won't be loaded as expected
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    httpInterceptorProviders,
    LoadingOverlayService,
    LogUpdateService,
    ErrorHandlerService
  ]
})
export class AppModule { }
