import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDateComponent } from './registration-date.component';
import { SharedModule } from '@app/shared';

describe('RegistrationDateComponent', () => {
  let component: RegistrationDateComponent;
  let fixture: ComponentFixture<RegistrationDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
