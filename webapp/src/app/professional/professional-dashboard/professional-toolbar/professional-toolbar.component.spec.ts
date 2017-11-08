import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalToolbarComponent } from './professional-toolbar.component';

describe('ProfessionalToolbarComponent', () => {
  let component: ProfessionalToolbarComponent;
  let fixture: ComponentFixture<ProfessionalToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionalToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
