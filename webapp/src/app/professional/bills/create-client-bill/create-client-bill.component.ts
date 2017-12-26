import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-create-client-bill',
  templateUrl: './create-client-bill.component.html',
  styleUrls: ['./create-client-bill.component.scss']
})
export class CreateClientBillComponent implements OnInit {

  id: number;
  name: string;

  constructor(private route: ActivatedRoute,
    private router: Router) {

      this.route.paramMap.subscribe((params: ParamMap) => {
        this.id = +params.get('id');
        this.name = params.get('name');
      });
  }

  ngOnInit() {
  }

}
