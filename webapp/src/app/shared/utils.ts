import { FormGroup, FormArray, AbstractControl, FormBuilder } from '@angular/forms';
import { Business, CollectiveGroup, Category, PaymentMode, Payment } from '@app/entities';

export class Utils {
    static extractArrayFromControl<T>(form: AbstractControl, faName: string, mapperFn: (control: AbstractControl) => T): T[] {
        const fa = form.get(faName) as FormArray;
        return fa.controls.filter(control => control.value.value).map(mapperFn);
    }

    static getBusinesses(businesses: Business[]): string {
        return !businesses.length ? '' : businesses.map(b => b.designation).sort().join(', ');
    }

    static initFormArray<T>(form: AbstractControl,
        faName: string,
        values: T[],
        createGroupFn: (v: T) => FormGroup,
        sortFn?: (a: T, b: T) => number) {

        const fa = form.get(faName) as FormArray;
        values.sort(sortFn)
            .forEach(v =>
                fa.push(createGroupFn(v))
            );
    }

    // converts first in integer
    static totalPayments(payments: Payment[]): number {
        return payments.map(p => p.amount).reduce((a, b) => (a * 10 * 10 + b * 10 * 10) / (10 * 10), 0);
    }

    static xnorFn(val1: boolean, val2: boolean): boolean {
        return val1 === val2;
    }

    static hasPayments(form: FormGroup): boolean {
        return form.get('payments').get('content').value.length !== 0;
    }

    static hasPaymentDate(form: FormGroup): boolean {
        return form.get('information').get('dates').get('paymentDate').value !== null;
    }

    static hasValidPaymentState(form: FormGroup): boolean {
        return !(
            (Utils.hasPaymentDate(form)
                && (Utils.totalPayments(form.get('payments').get('content').value)
                    < form.get('information').get('amount').value))
            // allows to save bills if the payment is not trusted/confirmed
            // ||
            // (!Utils.hasPaymentDate(form) && (Utils.totalPayments(form.get('payments').get('content').value)
            //     === form.get('information').get('amount').value))
        );
    }

    static shrinkPhoneNumber(value: string): string {
        return value.trim().replace(/[\-\s]/g, '');
    }

    static isValidPhoneNumber(value: string): boolean {
        if (!value) {
            return false;
        }
        const val = Utils.shrinkPhoneNumber(value);
        return /^(((00|\+)\d{2})|0)\d{9}$/.test(val);
    }

    static formatPhoneNumber(value: string): string {
        if (!value) {
            return value;
        }

        const val = Utils.shrinkPhoneNumber(value)
            .replace(/^((?:(?:(?:00|\+)\d{2})|0)\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')
            .replace(/^((?:(?:(?:00|\+)\d{2})|0)\d)(\d{2})(\d{2})(\d{2})(\d\d?)$/, '$1 $2 $3 $4 $5')
            .replace(/^((?:(?:(?:00|\+)\d{2})|0)\d)(\d{2})(\d{2})(\d\d?)$/, '$1 $2 $3 $4')
            .replace(/^((?:(?:(?:00|\+)\d{2})|0)\d)(\d{2})(\d\d?)$/, '$1 $2 $3')
            .replace(/^((?:(?:(?:00|\+)\d{2})|0)\d)(\d\d?)$/, '$1 $2')
            .replace(/^((?:(?:(?:00|\+)\d{2})|0)\d)$/, '$1');
        return val === Utils.shrinkPhoneNumber(value) ? value.trim() : val;
    }
}

export const compareBusinessesFn =
    (b1: Business, b2: Business) => b1.designation.localeCompare(b2.designation);

export const compareCollectiveGroupsFn =
    (cg1: CollectiveGroup, cg2: CollectiveGroup) => cg1.groupName.localeCompare(cg2.groupName);

export const compareCategoriesFn =
    (ct1: Category, ct2: Category) => ct1.name.localeCompare(ct2.name);

export const comparePaymentModesFn =
    (pm1: PaymentMode, pm2: PaymentMode) => pm1.name.localeCompare(pm2.name);
