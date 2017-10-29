export class Address {

    id: number;
    street: string;
    optional: string;
    postalCode: string;
    city: string;
    country: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): Address {
        return new Address(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
