import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Offering, PaymentMode, OfferingType } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss']
})
export class CreateBillComponent {
  @Input() offerings: Offering[];
  @Input() paymentModes: PaymentMode[];
  @Output() cancel = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      information: this.fb.group({}),
      purchasedOfferings: this.fb.group({
        content: new FormControl([]),
        selectedOfferingType: new FormControl(OfferingType.SERVICE),
      }),
      payments: this.fb.group({
        content: new FormControl([])
      }),
    });
    return fg;
  }

  revert() {
  }

  save() {
  }

  cancelBillCreation() {
    this.cancel.emit();
  }

}
