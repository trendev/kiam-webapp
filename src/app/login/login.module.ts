import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginGuard } from './login.guard';
import { DispatcherService } from './dispatcher.service';
import { UnsupportedUserTypeComponent } from './unsupported-user-type/unsupported-user-type.component';
import { LoginToolbarComponent } from './login/login-toolbar/login-toolbar.component';
import { LoginCardComponent } from './login/login-card/login-card.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent, RegisterFormComponent, UnsupportedUserTypeComponent, LoginToolbarComponent, LoginCardComponent],
  exports: [LoginComponent, RegisterFormComponent],
  providers: [LoginGuard, DispatcherService]
})
export class LoginModule { }
