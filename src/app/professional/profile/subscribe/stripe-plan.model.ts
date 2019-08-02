export class StripePlan {
    public id: string;
    public title: string;
    public amount: number;
    public interval: string;
    public interval_count: number;
    public display = false;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
