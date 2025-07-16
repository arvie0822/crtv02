import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
    parse: {
        dateInput: 'MMM DD',
      },
      display: {
        dateInput: 'MMM DD',
        monthYearLabel: 'MMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
  };

@Component({
  selector: 'app-month-date',
  templateUrl: './month-date.component.html',
  styleUrls: ['./month-date.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MonthDateComponent implements OnInit {
    @Input() label: string
    @Input() control: AbstractControl = new FormControl();
    minDate: Date;
    maxDate: Date;
  constructor() { }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear, 0, 1);
    this.maxDate = new Date(currentYear + 1, 0, 1);
    this.maxDate.setDate(this.maxDate.getDate() - 1);
  }

}
