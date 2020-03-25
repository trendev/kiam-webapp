import { SuccessMessageComponent, BillsUtils } from '@app/shared';
import { ErrorHandlerService } from '@app/error-handler.service';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Offering, PaymentMode, Bill, CollectiveGroupBill, CollectiveGroup, VatRates } from '@app/entities';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollectiveGroupBillService } from '@app/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-collective-group-bill',
  templateUrl: './create-collective-group-bill.component.html',
  styleUrls: ['./create-collective-group-bill.component.scss']
})
export class CreateCollectiveGroupBillComponent implements OnInit {

  id: string;
  name: string;
  rpt: string;
  offerings: Offering[];
  paymentModes: PaymentMode[];
  billsRefDate: number;
  vatRates: VatRates;

  constructor(private collectiveGroupBillService: CollectiveGroupBillService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.name = params.get('name');
      this.rpt = params.get('rpt') || undefined;
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

  returnToCollectiveGroupsDetail() {
    this.router.navigate(['/professional/collective-groups', this.id]);
  }

  save(bill: Bill) {
    const cgb = new CollectiveGroupBill(bill);
    cgb.recipient = this.rpt;
    cgb.collectiveGroup = new CollectiveGroup({
      id: this.id
    });
    this.loadingOverlayService.start();
    this.collectiveGroupBillService.create(cgb).subscribe(
      _cgb => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Facture ${BillsUtils.shrinkRef(_cgb.reference)} enregistrée`,
          duration: 2000
        });
        this.returnToCollectiveGroupsDetail();
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
