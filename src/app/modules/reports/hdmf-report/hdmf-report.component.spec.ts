/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HdmfReportComponent } from './hdmf-report.component';

describe('HdmfReportComponent', () => {
  let component: HdmfReportComponent;
  let fixture: ComponentFixture<HdmfReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HdmfReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdmfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
