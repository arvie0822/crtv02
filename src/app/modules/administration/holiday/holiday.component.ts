import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HeaderForm, HolidayForm } from 'app/model/administration/holiday';

export interface PeriodicElement {
  holiday_name: string;
  holiday_type: string;
  date: string;
  working: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {holiday_name: "New Year's Day",   holiday_type: 'Regular Holiday', date: '01/01/2021', working: 'No', action: ''},
  {holiday_name: "Cebu Charter Day", holiday_type: 'Regular Holiday', date: '01/01/2021', working: 'No', action: ''},
];

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css']
})
export class HolidayComponent implements OnInit {
  displayedColumns: string[] = ['holiday_name', 'holiday_type', 'date', 'working', 'action'];
  dataSource = ELEMENT_DATA;

  headerForm: FormGroup;
  holidayForm: FormGroup;
  branch = []
  isSave: boolean = false

  constructor(private fb: FormBuilder) { }

  get headf(){
    return this.headerForm.value
  }

  get holf(){
    return this.holidayForm.value
  }

  ngOnInit() {
    this.headerForm = this.fb.group(new HeaderForm());
    this.holidayForm = this.fb.group(new HolidayForm());
  }

  submit(){
    
  }

}
