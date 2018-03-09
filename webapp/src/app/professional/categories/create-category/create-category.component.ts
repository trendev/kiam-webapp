import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ErrorAggregatorDirective, CustomValidators, SuccessMessageComponent } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { MatSnackBar } from '@angular/material';
import { ErrorHandlerService } from '@app/error-handler.service';
import { Category } from '@app/entities';
import { CategoryService } from '@app/core';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {
    this.form = this.createForm();
  }

  ngOnInit() {
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      description: new FormControl('', [
        Validators.required,
        CustomValidators.blankStringForbidden,
        Validators.maxLength(50)
      ]),
      name: new FormControl('', [
        Validators.required,
        CustomValidators.blankStringForbidden,
        Validators.maxLength(150)
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
      description: value.description || undefined,
      name: value.name || undefined
    });

    return ct;
  }

  save() {
    const ct = this.prepareSave();
    this.loadingOverlayService.start();
    this.categoryService.create(ct).subscribe(
      _ct => {
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `La catégorie ${_ct.name} est créée`,
          duration: 2000
        });
        this.router.navigate(['../', _ct.id], { relativeTo: this.route });
      },
      // TODO: handle this (check the status code, etc)
      e => {
        this.loadingOverlayService.stop();
        this.errorHandler.handle(e, 'Impossible de sauvegarder la nouvelle catégorie sur le serveur');
      });
  }

}
