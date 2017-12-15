import { Component, OnInit } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Offering, Service, Pack, OfferingType } from '@app/entities';

@Component({
  selector: 'app-offerings',
  templateUrl: './offerings.component.html',
  styleUrls: ['./offerings.component.scss'],
})
export class OfferingsComponent implements OnInit {

  private _offerings: Offering[];
  services: Service[] = [];
  packs: Pack[] = [];
  _selectedOfferingType = OfferingType.SERVICE;
  offeringsTypes = [
    {
      type: OfferingType.SERVICE,
      label: 'Service'
    },
    {
      type: OfferingType.PACK,
      label: 'Forfait'
    }
  ];

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        offerings: Offering[]
      }) => {
        this._offerings = data.offerings;
      }
    );
  }

  initOfferings() {
    this.services = [];
    this.packs = [];
    this._offerings.forEach(
      o => {
        switch (o.cltype) {
          case OfferingType.SERVICE:
            this.services.push(o as Service);
            break;
          case OfferingType.PACK:
            this.packs.push(o as Pack);
            break;
          default:
            throw new TypeError(`initOfferings(): ${o.cltype} is not a supported offering type`);
        }
      });
    this._offerings = []; // reset the _offerings, not used after initOfferings()
  }

  ngOnInit() {
    this.initOfferings();
  }

  get selectedOfferingType(): string {
    return this._selectedOfferingType;
  }

  set selectedOfferingType(value: string){
    this._selectedOfferingType = value;
  }


}
