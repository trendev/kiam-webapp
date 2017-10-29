export class UserGroup {

    name: string;
    description: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): UserGroup {
        return new UserGroup(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
