import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-professional-sidenav',
  templateUrl: './professional-sidenav.component.html',
  styleUrls: ['./professional-sidenav.component.scss'],
})
export class ProfessionalSidenavComponent implements OnInit {

  @Input() email: string;

  links: LinkItem[] = [
    { name: 'Accueil', url: 'welcome', icon: 'home' },
    { name: 'Référentiel client', url: 'clients', icon: 'perm_contact_calendar' },
    { name: 'Groupes / Collectivités', url: 'groups', icon: 'group' },
    { name: 'Facturier', url: 'bills', icon: 'receipt' },
    { name: 'Dépenses', url: 'expenses', icon: 'trending_down' },
    { name: 'Catégories', url: 'categories', icon: 'group_work' },
    { name: 'Offres / Catalogues', url: 'offerings', icon: 'local_offer' },
  ];

  constructor() { }

  ngOnInit() {
  }

}

interface LinkItem {
  name: string;
  url: string;
  icon: string;
}
