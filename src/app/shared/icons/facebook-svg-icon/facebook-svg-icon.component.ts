import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-facebook-svg-icon',
  template: `
  <mat-icon svgIcon="facebook-icon"></mat-icon>
  `,
  styles: [
    `.mat-icon {
      height: 30px;
      margin: 4px;
  }`  ]
})
export class FacebookSvgIconComponent {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'facebook-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/logos/facebook.svg'));
  }


}
