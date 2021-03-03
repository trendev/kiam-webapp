import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndividualDashboardComponent } from './individual-dashboard.component';

describe('IndividualDashboardComponent', () => {
  let component: IndividualDashboardComponent;
  let fixture: ComponentFixture<IndividualDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
