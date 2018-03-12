import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { Client } from '@app/entities';
import { MatTableDataSource, MatSort, MatPaginator, MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-category-client-list',
  templateUrl: './category-client-list.component.html',
  styleUrls: ['./category-client-list.component.scss']
})
export class CategoryClientListComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() categoryClients: Client[] = [];
  @Input() clients: Client[] = [];
  clientsModel: ClientModel[];

  displayedColumns = [
    'checked', 'lastname', 'firstname'];
  datasource: MatTableDataSource<ClientModel> = new MatTableDataSource<ClientModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() add = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  clientSortFn: (cl1: ClientModel, cl2: ClientModel) => number
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
    this.initClientModel();
    this.datasource.data = this.clientsModel.sort(this.clientSortFn);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  initClientModel() {
    this.clientsModel = this.clients.map(
      cl => {
        return {
          // find the current client in the category's client list
          checked: this.categoryClients.findIndex(_cl => _cl.id === cl.id) !== -1,
          id: cl.id,
          firstname: cl.customerDetails.firstName || '',
          lastname: cl.customerDetails.lastName || ''
        };
      }
    );
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
  id: number;
}
