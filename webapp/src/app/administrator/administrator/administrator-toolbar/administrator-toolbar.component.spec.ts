import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorToolbarComponent } from './administrator-toolbar.component';
import { SharedModule } from '@app/shared';
import { AuthenticationService, CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

describe('AdministratorToolbarComponent', () => {
  let component: AdministratorToolbarComponent;
  let fixture: ComponentFixture<AdministratorToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CoreModule,
        AppRoutingModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService],
      declarations: [AdministratorToolbarComponent]
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
