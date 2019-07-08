export class StripeInvoice {

    public id: string;
    public amount_due: number;
    public date: Date;
    public invoice_pdf: string;
    public invoice_number: string;
    public paid: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    static build(invoice: any): StripeInvoice {
        return new StripeInvoice({
            id: invoice.id,
            amount_due: invoice.amount_due,
            date: new Date(invoice.created * 1000), // converts epoch time to ms
            invoice_pdf: invoice.invoice_pdf,
            invoice_number: invoice.number,
            paid: invoice.paid
        }
        );
    }

    copy(): StripeInvoice {
        return Object.assign({}, this);
    }


}
