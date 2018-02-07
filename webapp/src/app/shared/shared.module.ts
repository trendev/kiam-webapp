import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
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
  MatRadioModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatSnackBarModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AddressComponent } from './address/address.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { BusinessesComponent } from './businesses/businesses.component';
import { PaymentModesComponent } from './payment-modes/payment-modes.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { SocialNetworkAccountsComponent } from './social-network-accounts/social-network-accounts.component';
import { LoremIpsumComponent } from './lorem-ipsum/lorem-ipsum.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ErrorAggregatorDirective } from './error-aggregator.directive';
import { CollectiveGroupsComponent } from './collective-groups/collective-groups.component';
import { CategoriesComponent } from './categories/categories.component';
import { ErrorComponent } from './error/error.component';
import { CommentsComponent } from './comments/comments.component';
import { PhoneComponent } from './phone/phone.component';
import { PhonePipe } from './phone.pipe';
import { PasswordChangedComponent } from './snack-messages/password-changed/password-changed.component';
import { SuccessMessageComponent } from './snack-messages/success-message/success-message.component';
import { ErrorMessageComponent } from './snack-messages/error-message/error-message.component';
import { UnauthorizedAccessComponent } from './snack-messages/unauthorized-access/unauthorized-access.component';
import { SlowUnstableConnectionComponent } from './snack-messages/slow-unstable-connection/slow-unstable-connection.component';
import { ProfileRefreshedComponent } from './snack-messages/profile-refreshed/profile-refreshed.component';
import { ProfileSavedComponent } from './snack-messages/profile-saved/profile-saved.component';
import { ClientsListRefreshedComponent } from './snack-messages/clients-list-refreshed/clients-list-refreshed.component';
import { ClientCreatedComponent } from './snack-messages/client-created/client-created.component';
import { ClientUpdatedComponent } from './snack-messages/client-updated/client-updated.component';
import { BillCreatedComponent } from './snack-messages/bill-created/bill-created.component';
import { BillUpdatedComponent } from './snack-messages/bill-updated/bill-updated.component';
import { BillsRefreshedComponent } from './snack-messages/bills-refreshed/bills-refreshed.component';

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
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    OverlayModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  declarations: [
    PageNotFoundComponent,
    AccountInfoComponent,
    AddressComponent,
    CustomerDetailsComponent,
    BusinessesComponent,
    PaymentModesComponent,
    CompanyInformationComponent,
    SocialNetworkAccountsComponent,
    LoremIpsumComponent,
    ChangePasswordComponent,
    ErrorAggregatorDirective,
    CollectiveGroupsComponent,
    CategoriesComponent,
    ErrorComponent,
    CommentsComponent,
    PhoneComponent,
    PhonePipe,
    PasswordChangedComponent,
    SuccessMessageComponent,
    ErrorMessageComponent,
    UnauthorizedAccessComponent,
    SlowUnstableConnectionComponent,
    ProfileRefreshedComponent,
    ProfileSavedComponent,
    ClientsListRefreshedComponent,
    ClientCreatedComponent,
    ClientUpdatedComponent,
    BillCreatedComponent,
    BillUpdatedComponent,
    BillsRefreshedComponent],
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
    BusinessesComponent,
    PaymentModesComponent,
    CompanyInformationComponent,
    SocialNetworkAccountsComponent,
    LoremIpsumComponent,
    ChangePasswordComponent,
    ErrorAggregatorDirective,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CollectiveGroupsComponent,
    CategoriesComponent,
    ErrorComponent,
    MatProgressBarModule,
    CommentsComponent,
    MatSelectModule,
    OverlayModule,
    MatProgressSpinnerModule,
    PhoneComponent,
    PhonePipe,
    MatSnackBarModule,
    PasswordChangedComponent,
    SuccessMessageComponent,
    ErrorMessageComponent,
    UnauthorizedAccessComponent,
    SlowUnstableConnectionComponent,
    ProfileRefreshedComponent,
    ProfileSavedComponent,
    ClientsListRefreshedComponent,
    ClientCreatedComponent,
    ClientUpdatedComponent,
    BillCreatedComponent,
    BillUpdatedComponent,
    BillsRefreshedComponent
  ],
  entryComponents: [
    PasswordChangedComponent,
    UnauthorizedAccessComponent,
    SlowUnstableConnectionComponent,
    ProfileRefreshedComponent,
    ProfileSavedComponent,
    ClientsListRefreshedComponent,
    ClientCreatedComponent,
    ClientUpdatedComponent,
    BillCreatedComponent,
    BillUpdatedComponent,
    BillsRefreshedComponent
  ]
})

export class SharedModule { }
