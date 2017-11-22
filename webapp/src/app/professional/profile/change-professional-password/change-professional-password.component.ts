import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-professional-password',
  templateUrl: './change-professional-password.component.html',
  styleUrls: ['./change-professional-password.component.scss']
})
export class ChangeProfessionalPasswordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  save() {
    console.warn(`cool now we can save the password`);
  }

}
