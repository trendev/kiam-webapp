import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-professional-sidenav',
  templateUrl: './professional-sidenav.component.html',
  styleUrls: ['./professional-sidenav.component.scss'],
})
export class ProfessionalSidenavComponent implements OnInit {

  links: LinkItem[] = [
    { name: 'Accueil', url: 'welcome' },
    { name: 'Clients', url: 'clients' },
    { name: 'Factures', url: 'bills' },
    { name: 'Dépenses', url: 'expenses' },
    { name: 'Catégories', url: 'categories' },
    { name: 'Groupes', url: 'groups' },
    { name: 'Profil', url: 'profile' }
  ];

  constructor() { }

  ngOnInit() {
  }

}

interface LinkItem {
  name: string;
  url: string;
}
