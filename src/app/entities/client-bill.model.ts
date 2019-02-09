import { Client } from './client.model';
import { Bill, BillType } from './bill.model';

export class ClientBill extends Bill {

    client: Client;

    constructor(values: Object = {}) {
        super(values);
        this.cltype = BillType.CLIENT_BILL;
    }

    copy(): ClientBill {
        return new ClientBill(this);
    }
}
