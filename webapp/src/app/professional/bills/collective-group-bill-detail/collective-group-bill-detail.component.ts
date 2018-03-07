import { Component, OnInit } from '@angular/core';
import { PaymentMode, CollectiveGroupBill, Bill } from '@app/entities';
import { CollectiveGroupBillService } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material';
import { ErrorHandlerService } from '@app/error-handler.service';
import { BillUpdatedComponent } from '@app/shared';
import { ExportBillService } from '../export-bill.service';

@Component({
  selector: 'app-collective-group-bill-detail',
  templateUrl: './collective-group-bill-detail.component.html',
  styleUrls: ['./collective-group-bill-detail.component.scss']
})
export class CollectiveGroupBillDetailComponent implements OnInit {

  id: number;
  name: string;
  rpt: string;
  paymentModes: PaymentMode[];
  collectiveGroupBill: CollectiveGroupBill;

  constructor(private collectiveGroupBillService: CollectiveGroupBillService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService,
    private exportBillService: ExportBillService) {

    this.route.data.subscribe(
      (data: {
        paymentModes: PaymentMode[],
        collectiveGroupBill: CollectiveGroupBill;
      }) => {
        this.paymentModes = data.paymentModes;
        this.collectiveGroupBill = data.collectiveGroupBill;
        this.id = this.collectiveGroupBill.collectiveGroup.id;
        this.name = this.collectiveGroupBill.collectiveGroup.groupName;
        this.rpt = this.collectiveGroupBill.recipient;
      }
    );
  }

  ngOnInit() {
  }

  returnToDetail() {
    this.router.navigate(['/professional/collective-groups', this.id]);
  }

  save(bill: Bill) {
    const cgb = new CollectiveGroupBill(bill);
    cgb.collectiveGroup = this.collectiveGroupBill.collectiveGroup;
    this.loadingOverlayService.start();
    // recipient cannot be changed
    this.collectiveGroupBillService.update(cgb).subscribe(
      _cgb => {
        this.snackBar.openFromComponent(BillUpdatedComponent, { duration: 2000 });
        this.returnToDetail();
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Une erreur est survenue lors de la sauvegarde de la facture...');
      });
  }

  exportBill() {
    this.exportBillService.exportCollectiveGroupBill(this.collectiveGroupBill);
  }

}
