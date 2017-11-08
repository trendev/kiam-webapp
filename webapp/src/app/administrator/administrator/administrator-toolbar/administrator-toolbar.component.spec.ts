import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorToolbarComponent } from './administrator-toolbar.component';

describe('AdministratorToolbarComponent', () => {
  let component: AdministratorToolbarComponent;
  let fixture: ComponentFixture<AdministratorToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
