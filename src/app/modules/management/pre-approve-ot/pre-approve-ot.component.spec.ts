/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PreApproveOtComponent } from './pre-approve-ot.component';

describe('PreApproveOtComponent', () => {
  let component: PreApproveOtComponent;
  let fixture: ComponentFixture<PreApproveOtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreApproveOtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreApproveOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
