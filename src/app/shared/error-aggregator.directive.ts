import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appErrorAggregator]'
})
export class ErrorAggregatorDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
