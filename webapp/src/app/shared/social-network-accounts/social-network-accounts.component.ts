import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-social-network-accounts',
  templateUrl: './social-network-accounts.component.html',
  styleUrls: ['./social-network-accounts.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SocialNetworkAccountsComponent implements OnInit {

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() { }

}
