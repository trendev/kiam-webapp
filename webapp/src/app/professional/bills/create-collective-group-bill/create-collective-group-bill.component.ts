import { ErrorHandlerService } from '@app/error-handler.service';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Offering, PaymentMode } from '@app/entities';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CollectiveGroupBillService } from '@app/core';

@Component({
  selector: 'app-create-collective-group-bill',
  templateUrl: './create-collective-group-bill.component.html',
  styleUrls: ['./create-collective-group-bill.component.scss']
})
export class CreateCollectiveGroupBillComponent implements OnInit {

  id: number;
  name: string;
  rpt: string;
  offerings: Offering[];
  paymentModes: PaymentMode[];
  billsRefDate: number;

  constructor(private collectiveGroupBillService: CollectiveGroupBillService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
  }

}
