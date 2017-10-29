export class SocialNetworkAccounts {
    id: number;
    facebook: string;
    twitter: string;
    instagram: string;
    pinterest: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): SocialNetworkAccounts {
        return new SocialNetworkAccounts(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
