export class CustomerDetails {
    id: string;
    firstName: string;
    lastName: string;
    nickname: string;
    phone: string;
    birthdate: number;
    sex: string;
    picturePath: string;
    comments: string[];

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
