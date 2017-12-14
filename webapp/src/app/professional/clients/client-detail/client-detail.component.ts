import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, ClientBill, Category, CollectiveGroup } from '@app/entities';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { CustomValidators, ErrorAggregatorDirective, Utils } from '@app/shared';
import { ClientService } from '@app/core';
import * as moment from 'moment';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {

  client: Client;
  clientBills: ClientBill[];
  private collectiveGroups: CollectiveGroup[];
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
    private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        collectiveGroups: CollectiveGroup[],
        categories: Category[],
        client: Client,
        clientBills: ClientBill[]
      }) => {
        this.collectiveGroups = data.collectiveGroups;
        this.categories = data.categories;
        this.client = data.client;
        this.clientBills = data.clientBills;
        this.form = this.createForm();
      }
    );
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
      collectiveGroups: this.fb.array([]),
      categories: this.fb.array([])
    });

    const collectiveGroupsFA = fg.get('collectiveGroups') as FormArray;
    this.collectiveGroups.forEach(cg =>
      collectiveGroupsFA.push(this.fb.group({
        id: cg.id,
        groupName: cg.groupName,
        value: false
      })));

    const categoriesFA = fg.get('categories') as FormArray;
    this.categories.forEach(ct =>
      categoriesFA.push(this.fb.group({
        id: ct.id,
        name: ct.name,
        value: false
      })));

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
      collectiveGroups: Utils.extractArrayFromControl(this.form, 'collectiveGroups',
        fg => new CollectiveGroup({
          id: fg.value.id,
          groupName: fg.value.groupName
        })
      ),
      categories: Utils.extractArrayFromControl(this.form, 'categories',
        fg => new Category({
          name: fg.value.name,
          id: fg.value.id
        })
      )
    });

    // set the id
    client.id = this.client.id;

    return client;
  }

  private extractArrayFromControl(faName: string, mapperFn: (fg: FormGroup) => any) {
    const fa = this.form.get(faName) as FormArray;
    return fa.controls.filter(fg => fg.value.value).map(mapperFn);
  }

  save() {
    const client = this.prepareSave();
    this.clientService.update(client).subscribe(
      _client => this.router.navigate(['../'], { relativeTo: this.route }),
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de sauvegarder le nouveau client sur le serveur'));
  }

}
