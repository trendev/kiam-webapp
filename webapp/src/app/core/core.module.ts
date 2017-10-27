import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientXsrfModule
  ],
  declarations: [],
  providers: [AuthService]
})
export class CoreModule { }
