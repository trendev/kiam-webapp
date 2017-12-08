import { Component, OnInit, Input } from '@angular/core';
import { ClientBill } from '@app/entities';

@Component({
  selector: 'app-client-bills-list',
  templateUrl: './client-bills-list.component.html',
  styleUrls: ['./client-bills-list.component.scss']
})
export class ClientBillsListComponent implements OnInit {

  @Input() bills: ClientBill[];

  constructor() { }

  ngOnInit() {
  }

  get unpaid(): number {
    return this.bills.filter(b => !b.paymentDate).length;
  }
}
