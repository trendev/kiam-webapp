import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Category } from '@app/entities';
import { ProfessionalService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';
import { compareCategoriesFn, SuccessMessageComponent } from '@app/shared';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, AfterViewInit {

  categories: CategoryModel[] = [];
  private _categories: Category[] = [];

  displayedColumns = ['id', 'name'];
  datasource: MatTableDataSource<CategoryModel>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {
    this.route.data.subscribe(
      (data: {
        categories: Category[]
      }) => {
        this._categories = data.categories;
      }
    );
  }

  ngOnInit() {
    this.initCategories();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
  }

  initCategories() {
    this.categories = this._categories.sort(compareCategoriesFn).map(ct => {
      return {
        id: ct.id + '',
        name: ct.name || ''
      };
    });
    this.datasource = new MatTableDataSource<CategoryModel>(this.categories);
    this.datasource.sort = this.sort;
  }

  refreshCategories() {
    this.loadingOverlayService.start();
    this.professionalService.getCategories()
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
        categories => {
          this._categories = categories;
          this.initCategories();
          this.snackBar.openFromComponent(SuccessMessageComponent, {
            data: 'Liste des catégories rafraîchie',
            duration: 2000
          });
        },
        // TODO : handle the error
        e => this.errorHandler.handle(e, `Une erreur est survenue lors de la collecte des catégories depuis le serveur`)
      );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  gotoCategoryDetails(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

}

interface CategoryModel {
  id: string;
  name: string;
}
