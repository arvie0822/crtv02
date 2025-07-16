/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EarningComponent } from './earning.component';

describe('EarningComponent', () => {
  let component: EarningComponent;
  let fixture: ComponentFixture<EarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
