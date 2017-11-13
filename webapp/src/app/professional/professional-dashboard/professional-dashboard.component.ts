import { Professional } from '@app/entities';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-professional-dashboard',
  templateUrl: './professional-dashboard.component.html',
  styleUrls: ['./professional-dashboard.component.scss']
})
export class ProfessionalDashboardComponent implements OnInit {

  professional: Professional;

  links: LinkItem[] = [
    { name: 'Accueil', url: 'welcome' },
    { name: 'Clients', url: 'clients' },
    { name: 'Factures', url: '.' },
    { name: 'Dépenses', url: '.' },
    { name: 'Catégories', url: '.' },
    { name: 'Groupes', url: '.' },
    { name: 'Profil', url: '.' }
  ];

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.professional = new Professional(this.authenticationService.user);
  }

}

interface LinkItem {
  name: string;
  url: string;
}
