import * as moment from 'moment';
import { ValidatorFn, AbstractControl, ValidationErrors, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

export class CustomValidators {
    static whiteSpaceForbidden(control: AbstractControl): ValidationErrors | null {
        return /^\S*$/.test(control.value)
            ? null : { 'whiteSpaceForbidden': { value: control.value } };
    }

    static blankStringForbidden(control: AbstractControl): ValidationErrors | null {
        return /^(\S+\s*)*$/.test(control.value)
            ? null : { 'blankStringForbidden': { value: control.value } };
    }

    static email(control: AbstractControl): ValidationErrors | null {
        return !control.value ? null : Validators.email(control);
    }

    static validComments(validators: ValidatorFn[]): ValidatorFn {

        return (control: AbstractControl): { [key: string]: any } => {
            const errors = [];
            const fa = control as FormArray;
            for (let i = 0; i < fa.length; i++) {
                const c: AbstractControl = fa.at(i);
                validators.forEach(validator => {
                    const result = validator(c);
                    if (result) {
                        c.setErrors(Object.assign(c.errors || {}, result));
                        errors.push(i + 1);
                    }
                });
            }
            return !errors.length
                ? null : { 'validComments': { value: errors } };
        };
    }

    static phoneNumber(control: AbstractControl): ValidationErrors | null {
        return /^(((00|\+)\d{2})|0)\d{9}$/.test(control.value)
            ? null : { 'phoneNumber': { value: control.value } };
    }

    static past(control: AbstractControl): ValidationErrors | null {
        return !control.value || moment(control.value).isBefore(moment())
            ? null : { 'past': { value: control.value } };
    }

    static adultOnly(control: AbstractControl): ValidationErrors | null {
        return !control.value || moment(control.value).isBefore(moment().subtract(18, 'years'))
            ? null : { 'adultOnly': { value: control.value } };
    }

    static future(control: AbstractControl): ValidationErrors | null {
        return !control.value || moment(control.value).isAfter(moment())
            ? null : { 'future': { value: control.value } };
    }

    static validCompanyID(control: AbstractControl): ValidationErrors | null {
        if (/^\d{14}$/.test(control.value)) {
            const code = control.value.split('');
            let sum = 0;
            const parity = code.length % 2;

            for (let i = 0; i < code.length - 1; i++) {
                if (i % 2 === parity) {
                    code[i] *= 2;
                    if (code[i] > 9) {
                        code[i] -= 9;
                    }
                }
                sum += +code[i];
            }

            return sum * 9 % 10 === +code[code.length - 1]
                ? null : { 'validCompanyID': { value: control.value } };
        } else {
            return { 'validCompanyID': { value: control.value } };
        }
    }

    static validVatCode(control: AbstractControl): ValidationErrors | null {
        if (/^FR\d{11}$/i.test(control.value)) {
            const code = /^FR(\d{2})(\d{9})$/i.exec(control.value);
            return ((+code[2] % 97) * 3 + 12) % 97 === +code[1] ? null : { 'validVatCode': { value: control.value } };
        } else {
            return !control.value ? null : { 'validVatCode': { value: control.value } };
        }
    }

    static computeVatCodeFromCompanyID(companyID: string): string {
        let code;
        let id = companyID;

        try {
            if (companyID.length > 9) {
                id = /^(\d{9}).*$/.exec(companyID)[1];
            }
            code = `FR${((+id % 97) * 3 + 12) % 97}${id}`;
        } catch (e) {
            console.error(e);
        }

        return code;
    }

    static validVatCodeFromCompanyID(control: FormGroup): ValidationErrors | null {
        if (control.get('companyID').valid
            && control.get('vatcode').valid
            && control.get('vatcode').value
            && CustomValidators.computeVatCodeFromCompanyID(control.get('companyID').value) !== control.get('vatcode').value) {
            return {
                'validVatCodeFromCompanyID': {
                    companyID: control.get('companyID').value,
                    vatcode: control.get('vatcode').value,
                    expectedVatCode: CustomValidators.computeVatCodeFromCompanyID(control.get('companyID').value)
                }
            };
        } else {
            return null;
        }
    }

    static selectedElementRequired(fa: FormArray): ValidationErrors | null {
        console.log(fa);
        return fa.controls.filter(c => c.value.value).length > 0 ? null : { 'selectedElementRequired': 'selection required' };
    }
}
