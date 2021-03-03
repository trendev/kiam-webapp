import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnsupportedUserTypeComponent } from './unsupported-user-type.component';
import { SharedModule } from '@app/shared';
import { AuthenticationService, CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

describe('UnsupportedUserTypeComponent', () => {
  let component: UnsupportedUserTypeComponent;
  let fixture: ComponentFixture<UnsupportedUserTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, AppRoutingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService],
      declarations: [UnsupportedUserTypeComponent]
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
