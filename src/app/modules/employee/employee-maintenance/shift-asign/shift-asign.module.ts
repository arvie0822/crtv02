import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftAsignComponent } from './shift-asign.component';
import { EmployeeScheduleModule } from '../employee-schedule/employee-schedule/employee-schedule.module';
import { EmployeeScheduleComponent } from '../employee-schedule/employee-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    EmployeeScheduleModule
  ],
  declarations: [
    ShiftAsignComponent,
    ]

})
export class ShiftAsignModule { }
