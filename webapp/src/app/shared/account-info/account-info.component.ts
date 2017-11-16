import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormControl, Form } from '@angular/forms';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AccountInfoComponent implements OnInit {

  constructor(parent: FormGroupDirective) {
  }

  ngOnInit() {
  }

}
