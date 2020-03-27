export class Business {

    designation: string;

    // TODO : add a field for support of Offerings Model autocreation

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): Business {
        return new Business(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
