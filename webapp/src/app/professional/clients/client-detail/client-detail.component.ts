import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, ClientBill, Category } from '@app/entities';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import {
  CustomValidators,
  ErrorAggregatorDirective,
  Utils,
  compareCollectiveGroupsFn,
  compareCategoriesFn,
  ClientUpdatedComponent,
  BillModel,
  BillsUtils,
  BillsRefreshedComponent
} from '@app/shared';
import { ClientService } from '@app/core';
import * as moment from 'moment';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {

  client: Client;
  clientBills: ClientBill[];
  private categories: Category[];

  form: FormGroup;

  private commentsValidators = [
    Validators.required,
    CustomValidators.blankStringForbidden,
    Validators.maxLength(200)
  ];

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {
    this.route.data.subscribe(
      (data: {
        categories: Category[],
        client: Client,
        clientBills: ClientBill[]
      }) => {
        this.categories = data.categories;
        this.client = data.client;
        this.clientBills = data.clientBills;
        this.form = this.createForm();
      });
  }

  ngOnInit() {
    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid && this.errorAggregator) {
        this.errorAggregator.viewContainerRef.clear();
      }
    });
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      email: new FormControl(this.client.email, [CustomValidators.email]),
      socialNetworkAccounts: this.fb.group({
        facebook: new FormControl(this.client.socialNetworkAccounts.facebook, [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        twitter: new FormControl(this.client.socialNetworkAccounts.twitter, [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        instagram: new FormControl(this.client.socialNetworkAccounts.instagram, [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        pinterest: new FormControl(this.client.socialNetworkAccounts.pinterest, [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ])
      }),
      customerDetails: this.fb.group({
        firstName: new FormControl(this.client.customerDetails.firstName, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        lastName: new FormControl(this.client.customerDetails.lastName, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        nickname: new FormControl(this.client.customerDetails.nickname, [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        phone: new FormControl(this.client.customerDetails.phone, [
          Validators.required,
          CustomValidators.phoneNumber
        ]
        ),
        birthdate: new FormControl(
          this.client.customerDetails.birthdate ? moment(this.client.customerDetails.birthdate) : undefined, [
            CustomValidators.past
          ]),
        sex: this.client.customerDetails.sex,
        picturePath: new FormControl({ value: this.client.customerDetails.picturePath, disabled: true }),
        comments: this.fb.array(
          this.client.customerDetails.comments || [],
          CustomValidators.validComments(this.commentsValidators))
      }),
      address: this.fb.group({
        street: new FormControl(this.client.address.street, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        optional: new FormControl(this.client.address.optional, [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        postalCode: new FormControl(this.client.address.postalCode, [
          Validators.required,
          CustomValidators.whiteSpaceForbidden,
          Validators.maxLength(5),
          Validators.minLength(5)
        ]),
        city: new FormControl(this.client.address.city, [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(75)
        ]),
        country: new FormControl({ value: this.client.address.country, disabled: true })
      }),
      categories: this.fb.array([])
    });

    Utils.initFormArray(fg,
      'categories',
      this.categories,
      ct => this.fb.group({
        id: ct.id,
        name: ct.name,
        value: this.client.categories ? this.client.categories.findIndex(_ct => _ct.id === ct.id) !== -1
          : false
      }),
      compareCategoriesFn);

    return fg;
  }

  revert() {
    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());

    // rebuilds the controls of the comments group if they have been modified/removed
    const customerDetailsFG = this.form.get('customerDetails') as FormGroup;
    customerDetailsFG.setControl('comments',
      this.fb.array(this.client.customerDetails.comments || [], CustomValidators.validComments(this.commentsValidators)));
  }

  prepareSave(): Client {
    const value = this.form.getRawValue();

    const client = new Client({
      id: this.client.id,
      email: value.email || undefined,
      address: {
        street: value.address.street || undefined,
        optional: value.address.optional || undefined,
        postalCode: value.address.postalCode || undefined,
        city: value.address.city || undefined,
        country: value.address.country || undefined
      },
      customerDetails: {
        firstName: value.customerDetails.firstName || undefined,
        lastName: value.customerDetails.lastName || undefined,
        nickname: value.customerDetails.nickname || undefined,
        phone: value.customerDetails.phone || undefined,
        birthdate: value.customerDetails.birthdate ? value.customerDetails.birthdate.valueOf() : undefined,
        sex: value.customerDetails.sex || undefined,
        picturePath: value.customerDetails.picturePath || undefined,
        comments: value.customerDetails.comments || undefined
      },
      socialNetworkAccounts: {
        facebook: value.socialNetworkAccounts.facebook || undefined,
        twitter: value.socialNetworkAccounts.twitter || undefined,
        instagram: value.socialNetworkAccounts.instagram || undefined,
        pinterest: value.socialNetworkAccounts.pinterest || undefined
      },
      categories: Utils.extractArrayFromControl(this.form, 'categories',
        fg => new Category({
          name: fg.value.name,
          id: fg.value.id
        })
      )
    });

    return client;
  }

  save() {
    const client = this.prepareSave();
    this.loadingOverlayService.start();
    this.clientService.update(client).subscribe(
      _client => {
        this.snackBar.openFromComponent(ClientUpdatedComponent, {
          duration: 2000
        });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de sauvegarder les modifications du client sur le serveur');
      });
  }

  gotoBill(bill: BillModel) {
    this.router.navigate(['/professional/bills/clientbill', { id: this.client.id, ref: bill.reference }]);
  }

  createNewBill() {
    const id = this.client.id;
    const name = `${this.client.customerDetails.firstName} ${this.client.customerDetails.lastName}`;
    this.router.navigate(['/professional/bills/create-clientbill', { id: id, name: name }]);
  }

  refreshBills() {
    this.loadingOverlayService.start();
    this.clientService.getClientBills(this.client.id)
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
        bills => {
          this.clientBills = bills.sort(BillsUtils.sortBillsFn);
          this.snackBar.openFromComponent(BillsRefreshedComponent, { duration: 2000 });
        },
        e => this.errorHandler.handle(e, 'Une erreur est survenue lors de la collecte des factures depuis le serveur'));
  }
}
