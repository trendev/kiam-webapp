import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    static whiteSpaceForbidden(control: AbstractControl): ValidationErrors | null {
        return /^\S*$/.test(control.value)
            ? null : { 'whiteSpaceForbidden': { value: control.value } };
    }

    static blankStringForbidden(control: AbstractControl): ValidationErrors | null {
        return /^(\S+\s*)*$/.test(control.value)
            ? null : { 'blankStringForbidden': { value: control.value } };
    }

    static phoneNumber(control: AbstractControl): ValidationErrors | null {
        return /^(((00|\+)\d{2})|0)\d{9}$/.test(control.value)
            ? null : { 'phoneNumber': { value: control.value } };
    }
}
