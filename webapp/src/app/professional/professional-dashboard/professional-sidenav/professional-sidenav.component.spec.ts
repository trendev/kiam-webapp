import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalSidenavComponent } from './professional-sidenav.component';

describe('ProfessionalSidenavComponent', () => {
  let component: ProfessionalSidenavComponent;
  let fixture: ComponentFixture<ProfessionalSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionalSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
