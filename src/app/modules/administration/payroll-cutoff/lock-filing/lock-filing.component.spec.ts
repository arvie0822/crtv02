/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LockFilingComponent } from './lock-filing.component';

describe('LockFilingComponent', () => {
  let component: LockFilingComponent;
  let fixture: ComponentFixture<LockFilingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockFilingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockFilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
