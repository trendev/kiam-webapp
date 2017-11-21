import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatListModule,
  MatChipsModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AddressComponent } from './address/address.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { BusinessComponent } from './business/business.component';
import { PaymentModeComponent } from './payment-mode/payment-mode.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { SocialNetworkAccountsComponent } from './social-network-accounts/social-network-accounts.component';
import { LoremIpsumComponent } from './lorem-ipsum/lorem-ipsum.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatRadioModule
  ],
  declarations: [
    PageNotFoundComponent,
    AccountInfoComponent,
    AddressComponent,
    CustomerDetailsComponent,
    BusinessComponent,
    PaymentModeComponent,
    CompanyInformationComponent,
    SocialNetworkAccountsComponent,
    LoremIpsumComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageNotFoundComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    AccountInfoComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    AddressComponent,
    MatRadioModule,
    CustomerDetailsComponent,
    BusinessComponent,
    PaymentModeComponent,
    CompanyInformationComponent,
    SocialNetworkAccountsComponent,
    LoremIpsumComponent
  ]
})

export class SharedModule { }
