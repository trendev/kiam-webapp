import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
@Component({
  selector: 'app-twitter-svg-icon',
  template: `
  <mat-icon svgIcon="twitter-icon"></mat-icon>
  `,
  styles: [
    `.mat-icon {
      height: 30px;
      margin: 4px;
  }`  ]
})
export class TwitterSvgIconComponent {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'twitter-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/logos/twitter.svg'));
  }

}
