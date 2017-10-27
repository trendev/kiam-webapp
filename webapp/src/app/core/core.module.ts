import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientXsrfModule
  ],
  declarations: [],
  providers: [AuthenticationService]
})
export class CoreModule { }
