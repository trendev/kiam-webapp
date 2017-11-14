import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginToolbarComponent } from './login-toolbar.component';
import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';

describe('LoginToolbarComponent', () => {
  let component: LoginToolbarComponent;
  let fixture: ComponentFixture<LoginToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, CoreModule
      ],
      declarations: [LoginToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
