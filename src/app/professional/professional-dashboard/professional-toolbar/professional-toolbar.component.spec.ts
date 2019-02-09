import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalToolbarComponent } from './professional-toolbar.component';
import { SharedModule } from '@app/shared';
import { CoreModule, AuthenticationService } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

describe('ProfessionalToolbarComponent', () => {
  let component: ProfessionalToolbarComponent;
  let fixture: ComponentFixture<ProfessionalToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, AppRoutingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthenticationService],
      declarations: [ProfessionalToolbarComponent]
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
