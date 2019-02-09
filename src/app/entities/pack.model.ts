import { Offering, OfferingType } from './offering.model';

export class Pack extends Offering {

    offerings: Offering[];

    constructor(values: Object = {}) {
        super(values);
        this.cltype = OfferingType.PACK;
    }

    copy(): Pack {
        return new Pack(this);
    }
}
