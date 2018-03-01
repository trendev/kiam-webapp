import { Client, Bill } from '@app/entities';

export class ClientBillModel {
    constructor(public reference: string,
        public deliveryDate: number,
        public amount: number,
        public currency: string,
        public client: Client,
        public bill: Bill) {
      }
}
