/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoeComponent } from './coe.component';

describe('CoeComponent', () => {
  let component: CoeComponent;
  let fixture: ComponentFixture<CoeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
