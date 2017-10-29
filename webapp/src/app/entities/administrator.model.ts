import { UserAccount, UserAccountType } from './user-account.model';

export class Administrator extends UserAccount {

    constructor(values: Object = {}) {
        super(values);
        this.cltype = UserAccountType.ADMINISTRATOR;
    }

    copy(): Administrator {
        return new Administrator(this);
    }
}
