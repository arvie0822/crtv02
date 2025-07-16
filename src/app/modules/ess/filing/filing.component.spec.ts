/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FilingComponent } from './filing.component';

describe('FilingComponent', () => {
  let component: FilingComponent;
  let fixture: ComponentFixture<FilingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
