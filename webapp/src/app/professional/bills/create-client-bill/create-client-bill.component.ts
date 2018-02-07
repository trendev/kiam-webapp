import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Offering, PaymentMode, Bill, ClientBill, Client } from '@app/entities';
import { ClientBillService } from '@app/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material';
import { BillCreatedComponent } from '@app/shared';

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

  constructor(private clientBillService: ClientBillService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar) {

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
    this.loadingOverlayService.start();
    this.clientBillService.create(cb).subscribe(
      _cb => {
        this.snackBar.openFromComponent(BillCreatedComponent, { duration: 2000 });
        this.returnToClientDetail();
      },
      // TODO: handle this (check the status code, etc)
      e => {
        this.loadingOverlayService.stop();
        console.error('Impossible de sauvegarder la nouvelle facture du client sur le serveur');
        if (e instanceof HttpErrorResponse && e.status === 409) {
          this.billsRefDate = +e.error.error.deliveryDate;
        }
      }
    );
  }

}
