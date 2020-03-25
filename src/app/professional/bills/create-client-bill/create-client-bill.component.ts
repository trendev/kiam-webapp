import { SuccessMessageComponent, BillsUtils } from '@app/shared';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Offering, PaymentMode, Bill, ClientBill, Client, VatRates } from '@app/entities';
import { ClientBillService } from '@app/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-create-client-bill',
  templateUrl: './create-client-bill.component.html',
  styleUrls: ['./create-client-bill.component.scss']
})
export class CreateClientBillComponent implements OnInit {

  id: string;
  name: string;
  offerings: Offering[];
  paymentModes: PaymentMode[];
  billsRefDate: number;
  vatRates: VatRates;

  constructor(private clientBillService: ClientBillService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.name = params.get('name');
    });

    this.route.data.subscribe(
      (data: {
        offerings: Offering[],
        paymentModes: PaymentMode[],
        billsRefDate: number,
        vatRates: VatRates
      }) => {
        this.offerings = data.offerings;
        this.paymentModes = data.paymentModes;
        this.billsRefDate = data.billsRefDate;
        this.vatRates = data.vatRates;
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
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Facture ${BillsUtils.shrinkRef(_cb.reference)} enregistrée`, duration: 2000
        });
        this.returnToClientDetail();
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Une erreur est survenue lors de la sauvegarde de la facture...');
        if (e instanceof HttpErrorResponse && e.status === 409) {
          this.billsRefDate = +e.error.error.deliveryDate;
          this.errorHandler.handle(e, `Tu ne peux pas créer une facture antérieure à la date limite de facturation !`);
        }
      }
    );
  }

}
