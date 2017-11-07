export class Credentials {

    username: string;
    password: string;
    rememberMe: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
