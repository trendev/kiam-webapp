import * as moment from 'moment';
import { ValidatorFn, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

export class CustomValidators {
    static whiteSpaceForbidden(control: AbstractControl): ValidationErrors | null {
        return /^\S*$/.test(control.value)
            ? null : { 'whiteSpaceForbidden': { value: control.value } };
    }

    static blankStringForbidden(control: AbstractControl): ValidationErrors | null {
        return /^(\S+\s*)*$/.test(control.value)
            ? null : { 'blankStringForbidden': { value: control.value } };
    }

    static validComments(control: FormArray): ValidationErrors | null {
        const errors = [];
        for (let i = 0; i < control.length; i++) {
            if (CustomValidators.blankStringForbidden(control.at(i))
                || !control.at(i).value) {
                errors.push(i + 1);
            }
        }

        return !errors.length
            ? null : { 'validComments': { value: errors } };

    }

    static phoneNumber(control: AbstractControl): ValidationErrors | null {
        return /^(((00|\+)\d{2})|0)\d{9}$/.test(control.value)
            ? null : { 'phoneNumber': { value: control.value } };
    }

    static past(control: AbstractControl): ValidationErrors | null {
        return moment(control.value).isBefore(moment())
            ? null : { 'past': { value: control.value } };
    }

    static adultOnly(control: AbstractControl): ValidationErrors | null {
        return moment(control.value).isBefore(moment().subtract(18, 'years'))
            ? null : { 'adultOnly': { value: control.value } };
    }

    static future(control: AbstractControl): ValidationErrors | null {
        return moment(control.value).isAfter(moment())
            ? null : { 'future': { value: control.value } };
    }
}
