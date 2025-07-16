/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PerDayComponent } from './per-day.component';

describe('PerDayComponent', () => {
  let component: PerDayComponent;
  let fixture: ComponentFixture<PerDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
