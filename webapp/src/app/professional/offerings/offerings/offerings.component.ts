import { Component, OnInit } from '@angular/core';
import { ProfessionalService, PackService } from '@app/core';
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

  // link between the local variable and the offerings type
  // OfferingType cannot be accessed from the html template
  readonly offeringType = {
    'SERVICE': OfferingType.SERVICE,
    'PACK': OfferingType.PACK
  };

  _selectedOfferingType: string;

  constructor(private professionalService: ProfessionalService,
    private packService: PackService,
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

    // reset the service/pack sets
    this.services = [];
    this.packs = [];

    // build the service/pack set
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

    // check the optional parameter ot (offering type)
    this.route.paramMap.subscribe(params => {
      this._selectedOfferingType = params.get('ot');
      if (!this._selectedOfferingType) {
        this._selectedOfferingType = OfferingType.SERVICE;
      }
    });
  }

  get selectedOfferingType(): string {
    return this._selectedOfferingType;
  }

  set selectedOfferingType(value: string) {
    this._selectedOfferingType = value;
  }

  refreshOfferings() {
    this.professionalService.getOfferings().subscribe(
      offerings => {
        this._offerings = offerings;
        this.initOfferings();
      },
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la collecte des offres sur le serveur`)
    );
  }

  buildModelOfferings() {
    this.packService.buildModelOfferings().subscribe(
      offerings => {
        this._offerings = offerings;
        this.initOfferings();
      },
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la création automatique d'offres sur le serveur`)
    );
  }

}
