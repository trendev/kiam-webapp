import { ErrorHandlerService } from '@app/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { ClientBillService } from '@app/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PaymentMode, ClientBill, Bill, Client } from '@app/entities';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material';
import { BillUpdatedComponent } from '@app/shared';
import { ExportBillService } from '../export-bill.service';

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
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService,
    private exportBillService: ExportBillService) {

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

  returnToDetail() {
    this.router.navigate(['/professional/clients', this.id]);
  }

  save(bill: Bill) {
    const cb = new ClientBill(bill);
    cb.client = this.clientBill.client;
    this.loadingOverlayService.start();
    this.clientBillService.update(cb).subscribe(
      _cb => {
        this.snackBar.openFromComponent(BillUpdatedComponent, { duration: 2000 });
        this.returnToDetail();
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Une erreur est survenue lors de la sauvegarde de la facture...');
      });
  }

  exportBill() {
    this.exportBillService.exportClientBill(this.clientBill);
  }

}
