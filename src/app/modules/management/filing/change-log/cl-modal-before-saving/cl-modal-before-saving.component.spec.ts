/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClModalBeforeSavingComponent } from './cl-modal-before-saving.component';

describe('ClModalBeforeSavingComponent', () => {
  let component: ClModalBeforeSavingComponent;
  let fixture: ComponentFixture<ClModalBeforeSavingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClModalBeforeSavingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClModalBeforeSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
