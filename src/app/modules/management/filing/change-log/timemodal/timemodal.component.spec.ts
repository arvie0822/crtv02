/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimemodalComponent } from './timemodal.component';

describe('TimemodalComponent', () => {
  let component: TimemodalComponent;
  let fixture: ComponentFixture<TimemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimemodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
