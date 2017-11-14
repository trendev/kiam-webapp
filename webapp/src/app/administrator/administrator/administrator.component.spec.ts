import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorComponent } from './administrator.component';
import { SharedModule } from '@app/shared';
import { CoreModule, AuthenticationService } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { AdministratorModule } from '@app/administrator/administrator.module';
import { APP_BASE_HREF } from '@angular/common';


describe('AdministratorComponent', () => {
  let component: AdministratorComponent;
  let fixture: ComponentFixture<AdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        AdministratorModule,
        AppRoutingModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
