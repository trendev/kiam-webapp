export class VatRates {

    countryId: string;
    country: string;
    rates: number[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): VatRates {
        return new VatRates(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
