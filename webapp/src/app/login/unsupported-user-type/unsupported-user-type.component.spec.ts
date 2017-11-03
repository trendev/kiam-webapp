import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsupportedUserTypeComponent } from './unsupported-user-type.component';

describe('UnsupportedUserTypeComponent', () => {
  let component: UnsupportedUserTypeComponent;
  let fixture: ComponentFixture<UnsupportedUserTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsupportedUserTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsupportedUserTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
