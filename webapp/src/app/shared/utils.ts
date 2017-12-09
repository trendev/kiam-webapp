import { FormGroup, FormArray, AbstractControl } from '@angular/forms';

export class Utils {
    static extractArrayFromControl(form: AbstractControl, faName: string, mapperFn: (control: AbstractControl) => any) {
        const fa = form.get(faName) as FormArray;
        return fa.controls.filter(control => control.value.value).map(mapperFn);
    }
}
