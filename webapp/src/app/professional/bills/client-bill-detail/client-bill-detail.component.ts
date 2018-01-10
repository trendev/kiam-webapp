import { Component, OnInit } from '@angular/core';
import { ClientBillService } from '@app/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PaymentMode, ClientBill, Bill, Client } from '@app/entities';
import { LoadingOverlayService } from '@app/loading-overlay.service';

@Component({
  selector: 'app-client-bill-detail',
  templateUrl: './client-bill-detail.component.html',
  styleUrls: ['./client-bill-detail.component.scss']
})
export class ClientBillDetailComponent implements OnInit {

  id: number;
  name: string;
  paymentModes: PaymentMode[];
  clientBill: ClientBill;

  constructor(private clientBillService: ClientBillService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingOverlayService: LoadingOverlayService) {

    this.route.data.subscribe(
      (data: {
        paymentModes: PaymentMode[],
        clientBill: ClientBill
      }) => {
        this.paymentModes = data.paymentModes;
        this.clientBill = data.clientBill;
        this.id = this.clientBill.client.id;
        this.name = `${this.clientBill.client.customerDetails.firstName} ${this.clientBill.client.customerDetails.lastName}`;
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
    cb.client = this.clientBill.client;
    this.loadingOverlayService.start();
    this.clientBillService.update(cb).subscribe(
      _cb => this.returnToClientDetail(),
      // TODO: handle this (check the status code, etc)
      e => {
        this.loadingOverlayService.stop();
        console.error('Impossible de sauvegarder la facture modifiée du client sur le serveur');
      });
  }

}
