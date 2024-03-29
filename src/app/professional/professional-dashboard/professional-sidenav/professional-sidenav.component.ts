import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-professional-sidenav',
  templateUrl: './professional-sidenav.component.html',
  styleUrls: ['./professional-sidenav.component.scss'],
})
export class ProfessionalSidenavComponent implements OnInit {

  @Input() email: string;

  @Input() sidenav: MatSidenav;

  links: LinkItem[] = [
    // { name: 'Accueil', url: 'dashboard', icon: 'dashboard'},
    { name: 'Offres', url: 'offerings', icon: 'local_offer' },
    { name: 'Clients', url: 'clients', icon: 'perm_contact_calendar' },
    { name: 'Groupes / Collectivités', url: 'collective-groups', icon: 'group'},
    { name: 'Catégories', url: 'categories', icon: 'label_outline'},
    { name: 'Facturier', url: 'bills', icon: 'receipt' },
    // { name: 'Dépenses', url: 'expenses', icon: 'trending_down'},
  ];

  constructor() { }

  ngOnInit() {
    // this.links.sort((l1, l2) => l1.name.localeCompare(l2.name));
  }

}

interface LinkItem {
  name: string;
  url: string;
  icon: string;
}
