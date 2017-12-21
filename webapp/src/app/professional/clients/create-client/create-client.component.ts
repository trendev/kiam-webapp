import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ErrorAggregatorDirective, CustomValidators, Utils, compareCollectiveGroupsFn, compareCategoriesFn } from '@app/shared';
import { ClientService } from '@app/core';
import { Client, CollectiveGroup, Category } from '@app/entities';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {

  form: FormGroup;
  private collectiveGroups: CollectiveGroup[];
  private categories: Category[];

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
        categories: Category[]
      }) => {
        this.collectiveGroups = data.collectiveGroups;
        this.categories = data.categories;
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
      email: new FormControl('', [CustomValidators.email]),
      socialNetworkAccounts: this.fb.group({
        facebook: new FormControl('', [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        twitter: new FormControl('', [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        instagram: new FormControl('', [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ]),
        pinterest: new FormControl('', [
          Validators.maxLength(150),
          CustomValidators.blankStringForbidden
        ])
      }),
      customerDetails: this.fb.group({
        firstName: new FormControl('', [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        lastName: new FormControl('', [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        nickname: new FormControl('', [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(50)
        ]),
        phone: new FormControl('', [
          Validators.required,
          CustomValidators.phoneNumber
        ]
        ),
        birthdate: new FormControl(
          undefined, [
            CustomValidators.past
          ]),
        sex: 'F',
        picturePath: new FormControl({ value: '', disabled: true }),
        comments: this.fb.array(
          [],
          CustomValidators.validComments(this.commentsValidators))
      }),
      address: this.fb.group({
        street: new FormControl('', [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        optional: new FormControl('', [
          CustomValidators.blankStringForbidden,
          Validators.maxLength(100)
        ]),
        postalCode: new FormControl('', [
          Validators.required,
          CustomValidators.whiteSpaceForbidden,
          Validators.maxLength(5),
          Validators.minLength(5)
        ]),
        city: new FormControl('', [
          Validators.required,
          CustomValidators.blankStringForbidden,
          Validators.maxLength(75)
        ]),
        country: new FormControl({ value: 'France', disabled: true })
      }),
      collectiveGroups: this.fb.array([]),
      categories: this.fb.array([])
    });

    Utils.initFormArray(fg,
      'collectiveGroups',
      this.collectiveGroups,
      cg => this.fb.group({
        id: cg.id,
        groupName: cg.groupName,
        value: false
      }),
      compareCollectiveGroupsFn);

    Utils.initFormArray(fg,
      'categories',
      this.categories,
      ct => this.fb.group({
        id: ct.id,
        name: ct.name,
        value: false
      }),
      compareCategoriesFn);

    return fg;
  }

  revert() {
    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());

    // rebuilds the controls of the comments group if they have been modified/removed
    const customerDetailsFG = this.form.get('customerDetails') as FormGroup;
    customerDetailsFG.setControl('comments', this.fb.array([], CustomValidators.validComments(this.commentsValidators)));
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

    return client;
  }

  save() {
    const client = this.prepareSave();
    this.clientService.create(client).subscribe(
      _client => this.router.navigate(['../', _client.id], { relativeTo: this.route }),
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de sauvegarder le nouveau client sur le serveur'));
  }

}
