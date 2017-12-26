import { Component, Input } from '@angular/core';
import { Offering, PaymentMode } from '@app/entities';
import { FormGroup } from '@angular/forms';

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

  form = new FormGroup({});

  constructor() { }

  revert() {
  }

  save() {
  }

}
