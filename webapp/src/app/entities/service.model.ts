import { Offering, OfferingType } from './offering.model';

export class Service extends Offering {

    constructor(values: Object = {}) {
        super(values);
        this.cltype = OfferingType.SERVICE;
    }

    copy(): Service {
        return new Service(this);
    }
}
