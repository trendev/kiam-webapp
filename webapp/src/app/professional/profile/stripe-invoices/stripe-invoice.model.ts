export class StripeInvoice {
    constructor(
        public id: string,
        public amount_due: number,
        public date: Date,
        public invoice_pdf: string,
        public invoice_number: string,
        public paid: boolean
    ) { }

    static build(invoice: any): StripeInvoice {
        return new StripeInvoice(
            invoice.id,
            invoice.amount_due,
            new Date(invoice.date * 1000), // converts epoch time to ms
            invoice.invoice_pdf,
            invoice.number,
            invoice.paid
        );
    }

    copy(): StripeInvoice {
        return Object.assign({}, this);
    }


}
