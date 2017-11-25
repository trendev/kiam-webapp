import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    static whiteSpaceForbidden(control: AbstractControl): ValidationErrors | null {
            return /^\S*$/i.test(control.value) ? null : { 'whiteSpaceForbidden': { value: control.value } };
    }
}
