import { FormGroup, FormArray, AbstractControl, FormBuilder } from '@angular/forms';
import { Business } from '@app/entities';

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

export const compareBusinessesFn = (b1: Business, b2: Business) => b1.designation.localeCompare(b2.designation);
