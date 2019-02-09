export class Business {

    designation: string;

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
