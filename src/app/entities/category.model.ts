export class Category {

    id: string;
    description: string;
    name: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): Category {
        return new Category(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
