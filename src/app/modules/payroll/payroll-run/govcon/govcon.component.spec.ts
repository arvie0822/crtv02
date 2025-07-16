/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GovconComponent } from './govcon.component';

describe('GovconComponent', () => {
  let component: GovconComponent;
  let fixture: ComponentFixture<GovconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
