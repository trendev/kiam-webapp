import { FormGroup, FormArray, AbstractControl, FormBuilder } from '@angular/forms';
import { Business, CollectiveGroup, Category, PaymentMode } from '@app/entities';

export class Utils {
    static extractArrayFromControl<T>(form: AbstractControl, faName: string, mapperFn: (control: AbstractControl) => T): T[] {
        const fa = form.get(faName) as FormArray;
        return fa.controls.filter(control => control.value.value).map(mapperFn);
    }

    static getBusinesses(businesses: Business[]): string {
        return !businesses.length ? '' : businesses.map(b => b.designation).sort().join();
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
}

export const compareBusinessesFn =
    (b1: Business, b2: Business) => b1.designation.localeCompare(b2.designation);

export const compareCollectiveGroupsFn =
    (cg1: CollectiveGroup, cg2: CollectiveGroup) => cg1.groupName.localeCompare(cg2.groupName);

export const compareCategoriesFn =
    (ct1: Category, ct2: Category) => ct1.name.localeCompare(ct2.name);

export const comparePaymentModesFn =
    (pm1: PaymentMode, pm2: PaymentMode) => pm1.name.localeCompare(pm2.name);
