import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ErrorAggregatorDirective, CustomValidators } from '@app/shared';
import { ProfessionalService } from '@app/core';

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
    });
    return fg;
  }

}
