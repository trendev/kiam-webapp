import { Component, OnInit } from '@angular/core';
import { Bill, IndividualBill, ClientBill, CollectiveGroupBill, BillType } from '@app/entities';
import { ProfessionalService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {

  private _bills: Bill[];
  clientBills: ClientBill[] = [];
  individualBills: IndividualBill[] = [];
  collectiveGroupBills: CollectiveGroupBill[] = [];

  readonly billType = {
    'COLLECTIVE_GROUP_BILL': BillType.COLLECTIVE_GROUP_BILL,
    'CLIENT_BILL': BillType.CLIENT_BILL,
    'INDIVIDUAL_BILL': BillType.INDIVIDUAL_BILL
  };

  selectedBillType: string;

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService) {
    this.route.data.subscribe(
      (data: {
        bills: Bill[]
      }) => {
        this._bills = data.bills;
      }
    );
  }

  initBills() {

    // reset the service/pack sets
    this.clientBills = [];
    this.collectiveGroupBills = [];
    this.individualBills = [];

    // build the bills sets
    this._bills.forEach(
      b => {
        switch (b.cltype) {
          case BillType.CLIENT_BILL:
            this.clientBills.push(b as ClientBill);
            break;
          case BillType.COLLECTIVE_GROUP_BILL:
            this.collectiveGroupBills.push(b as CollectiveGroupBill);
            break;
          case BillType.INDIVIDUAL_BILL:
            this.individualBills.push(b as IndividualBill);
            break;
          default:
            throw new TypeError(`initBills(): ${b.cltype} is not a supported bill type`);
        }
      });
    this._bills = []; // reset _bills, not used after initBills()
  }

  ngOnInit() {

    this.initBills();
    // check the optional parameter bt (bill type)
    this.route.paramMap.subscribe(params => {
      this.selectedBillType = params.get('bt');
      if (!this.selectedBillType) {
        this.selectedBillType = BillType.CLIENT_BILL;
      }
    });
  }

  refreshBills() {
    this.loadingOverlayService.start();
    this.professionalService.getBills()
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
      bills => {
        this._bills = bills;
        this.initBills();
      },
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la collecte des factures sur le serveur`)
      );
  }

}
