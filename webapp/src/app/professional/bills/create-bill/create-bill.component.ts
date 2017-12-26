import { Component, Input } from '@angular/core';
import { Offering, PaymentMode } from '@app/entities';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss']
})
export class CreateBillComponent {
  @Input() offerings: Offering[];
  @Input() paymentModes: PaymentMode[];
  @Input() id: number;
  @Input() name: string;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    const fg = this.fb.group({});
    return fg;
  }

  revert() {
  }

  save() {
  }

}
