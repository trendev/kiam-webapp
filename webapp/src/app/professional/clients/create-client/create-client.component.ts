import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ErrorAggregatorDirective, CustomValidators } from '@app/shared';
import { ProfessionalService } from '@app/core';
import { Client, CollectiveGroup, Category } from '@app/entities';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {

  form: FormGroup;

  private commentsValidators = [
    Validators.required,
    CustomValidators.blankStringForbidden,
    Validators.maxLength(200)
  ];

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private professionalService: ProfessionalService,
    private fb: FormBuilder) {
    this.form = this.createForm();
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
      email: new FormControl('', [Validators.email]),
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

    this.professionalService.getCollectiveGroups().subscribe(
      collectiveGroups => {
        const collectiveGroupsFA = fg.get('collectiveGroups') as FormArray;
        collectiveGroups.forEach(cg =>
          collectiveGroupsFA.push(this.fb.group({
            id: cg.id,
            groupName: cg.groupName,
            value: false
          })));
      },
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de charger les groupes/collectivités du professionel depuis le serveur')
    );

    this.professionalService.getCategories().subscribe(
      categories => {
        const categoriesFA = fg.get('categories') as FormArray;
        categories.forEach(ct =>
          categoriesFA.push(this.fb.group({
            id: ct.id,
            name: ct.name,
            value: false
          })));
      },
      // TODO: handle this (check the status code, etc)
      e => console.error('Impossible de charger les catégories du professionel depuis le serveur')
    );

    return fg;
  }

  revert() {
    // rebuilds the controls of the comments group if they have been modified/removed
    const customerDetailsFG = this.form.get('customerDetails') as FormGroup;
    customerDetailsFG.setControl('comments', this.fb.array([], CustomValidators.validComments(this.commentsValidators)));

    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());
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
      collectiveGroups: this.extractArrayFromControl('collectiveGroups',
        fg => new CollectiveGroup({
          id: fg.value.id,
          groupName: fg.value.groupName
        })
      ),
      categories: this.extractArrayFromControl('categories',
        fg => new Category({
          name: fg.value.name,
          id: fg.value.id
        })
      )
    });

    return client;
  }

  private extractArrayFromControl(faName: string, mapperFn: (fg: FormGroup) => any) {
    const fa = this.form.get(faName) as FormArray;
    return fa.controls.filter(fg => fg.value.value).map(mapperFn);
  }

  save() {
    console.log(this.prepareSave());
  }

}
