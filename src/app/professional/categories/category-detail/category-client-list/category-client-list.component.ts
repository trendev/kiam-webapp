import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { Client } from '@app/entities';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-category-client-list',
  templateUrl: './category-client-list.component.html',
  styleUrls: ['./category-client-list.component.scss']
})
export class CategoryClientListComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() categoryClients: Client[] = [];
  @Input() clients: Client[] = [];
  private clientsModel: ClientModel[];

  displayedColumns = [
    'checked', 'lastname', 'firstname'];
  datasource: MatTableDataSource<ClientModel> = new MatTableDataSource<ClientModel>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Output() add = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  private clientSortFn: (cl1: ClientModel, cl2: ClientModel) => number
    = (cl1, cl2) => {
      if (cl1.checked === cl2.checked) {
        return cl1.lastname === cl2.lastname ?
          cl1.firstname.localeCompare(cl2.firstname)
          : cl1.lastname.localeCompare(cl2.lastname);
      } else {
        return cl1.checked < cl2.checked ? 1 : -1;
      }
    }

  constructor() { }

  ngOnChanges() {
    this.checkClientModel();
  }

  ngOnInit() {
    this.initClientModel();
    this.datasource.data = this.clientsModel.sort(this.clientSortFn);
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  initClientModel() {
    this.clientsModel = this.clients.map(
      cl => {
        return {
          // test if the client is categorized
          checked: this.categoryClients.findIndex(_cl => _cl.id === cl.id) !== -1,
          id: cl.id,
          firstname: cl.customerDetails.firstName || '',
          lastname: cl.customerDetails.lastName || ''
        };
      }
    );
  }

  checkClientModel() {
    if (this.clientsModel) {
      // preserve the order and update the checked value
      this.clientsModel.forEach(cm => {
        cm.checked = this.categoryClients.findIndex(_cl => _cl.id === cm.id) !== -1;
      });
      this.datasource.data = this.clientsModel;
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  select(event: MatCheckboxChange, element: ClientModel) {
    element.checked = event.checked;
    this.onSelection(element);
  }

  private onSelection(element: ClientModel) {
    if (element.checked) {
      this.add.emit(element.id);
    } else {
      this.remove.emit(element.id);
    }
  }

}

interface ClientModel {
  checked: boolean;
  firstname: string;
  lastname: string;
  id: string;
}
