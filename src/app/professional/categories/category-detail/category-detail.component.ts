import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Category, Client } from '@app/entities';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from '@app/error-handler.service';
import { CustomValidators, SuccessMessageComponent } from '@app/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {

  category: Category;
  clients: Client[];
  categoryClients: Client[];

  form: FormGroup;

  constructor(private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {
    this.route.data.subscribe(
      (data: {
        category: Category;
        clients: Client[];
        categoryClients: Client[];
      }) => {

        this.category = data.category;
        this.clients = data.clients;
        this.categoryClients = data.categoryClients;
        this.form = this.createForm();
      });
  }

  ngOnInit() {
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      description: new FormControl(this.category.description, [
        Validators.required,
        CustomValidators.blankStringForbidden,
        Validators.maxLength(150)
      ]),
      name: new FormControl(this.category.name, [
        Validators.required,
        CustomValidators.blankStringForbidden,
        Validators.maxLength(50)
      ])
    });

    return fg;
  }

  revert() {
    // resets the form field based on the raw value, value alone will ignore disabled field (uuid,registrationDate...)
    this.form.reset(this.createForm().getRawValue());

  }

  prepareSave(): Category {
    const value = this.form.getRawValue();

    const ct = new Category({
      id: this.category.id,
      description: value.description || undefined,
      name: value.name || undefined
    });

    return ct;
  }

  save() {
    const ct = this.prepareSave();
    this.loadingOverlayService.start();
    this.categoryService.update(ct).subscribe(
      _ct => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `La catégorie ${_ct.name} a été modifiée`,
          duration: 2000
        });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de sauvegarder les modifications de la catégorie sur le serveur');
      });
  }

  remove() {
    this.loadingOverlayService.start();
    this.categoryService.remove(this.category.id).subscribe(
      resp => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `La catégorie ${this.category.name} a été supprimée`,
          duration: 2000
        });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de supprimer la catégorie sur le serveur');
      });
  }

  /**
   * Add a client in the category
   * @param clientid the client's id
   */
  addClient(clientid: string) {
    this.manageAssociation(clientid,
      this.categoryService.addClient,
      `a été ajouté à`,
      `d'ajouter le client à`,
      cl => this.categoryClients.push(cl));
  }

  /**
   * Remove a client from the category
   * @param clientid the client's id
   */
  removeClient(clientid: string) {
    this.manageAssociation(clientid,
      this.categoryService.removeClient,
      `a été supprimé de`,
      `de supprimer le client de`,
      cl => {
        // remove the client from the list
        // avoid to filter/set a new list and emit a change
        const index = this.categoryClients.findIndex(_cl => _cl.id === cl.id);
        if (index !== -1) {
          this.categoryClients.splice(index, 1);
        }
      });
  }

  /**
   * Factorized method used to create/delete a client & category association
   * @param clientid the id of the client to add/remove
   * @param actionCallback the callback action (should be this.categoryService.addClient() or this.categoryService.removeClient() )
   * @param successmsg the message to display if the callback successfully finished
   * @param errmsg the error message to display
   * @param updateCategoryClients operations to perform on the client list of the category, use to update the model if an error occurs
   */
  private manageAssociation(clientid: string,
    actionCallback: (categoryid: string, clientid: string) => Observable<Client>,
    successmsg: string,
    errmsg: string,
    updateCategoryClients: (client: Client) => void) {

    this.loadingOverlayService.start();
    const categoryid = this.category.id;
    // apply the action callback on the category service with the specified parameters
    actionCallback.apply(this.categoryService, [categoryid, clientid])
    .pipe(finalize(() => this.loadingOverlayService.stop()))
      .subscribe(
        client => {
          this.snackBar.openFromComponent(SuccessMessageComponent, {
            data: `Le client ${client.customerDetails.lastName} ${client.customerDetails.firstName} `
              + successmsg + ` la catégorie ${this.category.name}`,
            duration: 2000
          });
          // add/remove the client from the client list of the category
          updateCategoryClients(client);
        },
        e => {
          this.errorHandler.handle(e, `Impossible ` + errmsg + ` la catégorie`);
          // provoke a change event
          // TODO : use an Observer instead...
          this.categoryClients = this.categoryClients.slice();
        });
  }

}
