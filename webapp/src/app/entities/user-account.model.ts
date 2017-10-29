export class UserAccountType {
    public static readonly ADMINISTRATOR = 'Administrator';
    public static readonly PROFESSIONAL = 'Professional';
    public static readonly INDIVIDUAL = 'Individual';
}

export abstract class UserAccount {

    email: string;
    cltype: string;
    password: string;
    username: string;
    uuid: string;
    registrationDate: number;
    blocked: boolean;
    lastAccessedTime: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
