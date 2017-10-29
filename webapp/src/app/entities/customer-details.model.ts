export class CustomerDetails {
    id: number;
    firstName: string;
    lastName: string;
    nickname: string;
    phone: string;
    birthdate: any;
    sex: any;
    picturePath: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): CustomerDetails {
        return new CustomerDetails(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
