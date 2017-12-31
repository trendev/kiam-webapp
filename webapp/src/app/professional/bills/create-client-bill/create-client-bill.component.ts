import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Offering, PaymentMode, Bill, ClientBill, Client } from '@app/entities';

@Component({
  selector: 'app-create-client-bill',
  templateUrl: './create-client-bill.component.html',
  styleUrls: ['./create-client-bill.component.scss']
})
export class CreateClientBillComponent implements OnInit {

  id: number;
  name: string;
  offerings: Offering[];
  paymentModes: PaymentMode[];
  billsRefDate: number;

  constructor(private route: ActivatedRoute,
    private router: Router) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
      this.name = params.get('name');
    });

    this.route.data.subscribe(
      (data: {
        offerings: Offering[],
        paymentModes: PaymentMode[],
        billsRefDate: number
      }) => {
        this.offerings = data.offerings;
        this.paymentModes = data.paymentModes;
        this.billsRefDate = data.billsRefDate;
      }
    );
  }

  ngOnInit() {
  }

  returnToClientDetail() {
    this.router.navigate(['/professional/clients', this.id]);
  }

  save(bill: Bill) {
    const cb = new ClientBill(bill);
    cb.client = new Client({
      id: this.id
    });
    console.log(cb);
    this.returnToClientDetail();
  }

}
