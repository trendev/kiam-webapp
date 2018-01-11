import { Utils } from './utils';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    return Utils.formatPhoneNumber(value);
  }

}
