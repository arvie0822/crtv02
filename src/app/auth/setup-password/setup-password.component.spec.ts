/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SetupPassword } from './setup-password.component';

describe('SetupPassword', () => {
  let component: SetupPassword;
  let fixture: ComponentFixture<SetupPassword>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPassword ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
