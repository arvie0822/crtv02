import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryPayrollCutoffLocking } from 'app/model/payroll/payroll-cutoff';
import * as moment from 'moment';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
    parse: {
      dateInput: 'MM/DD/YYYY HH:mm a'
    },
    display: {
      dateInput: 'MM/DD/YYYY HH:mm a',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  };


  export const MY_FORMATS = {
    parse: {
      dateInput: 'MM/DD/YYYY',
    },
    display: {
      dateInput: 'MM/DD/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

@Component({
  selector: 'app-lock-filing',
  templateUrl: './lock-filing.component.html',
  styleUrls: ['./lock-filing.component.css'],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
              { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}],


})
export class LockFilingComponent implements OnInit {

  @ViewChild('picker') picker: any;

//   public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = true;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  pipe = new DatePipe('en-US');
  dateto : any

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required])
  })
  public dateControl = new FormControl(new Date(2021,9,4,5,6,7));
  public dateControlMinMax = new FormControl(new Date());

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  month = [
    {id: "Jan" , description : "January"},
    {id: "Feb" , description : "Febuary"},
    {id: "Mar" , description : "March"},
    {id: "Apr" , description : "April"},
    {id: "May" , description : "May"},
    {id: "Jun" , description : "June"},
    {id: "Jul", description : "July"},
    {id: "Aug" , description : "August"},
    {id: "Sep" , description : "September"},
    {id: "Oct" , description : "October"},
    {id: "Nov" , description : "November"},
    {id: "Dec", description : "December"}
  ]

  Week = [
    {id: "Week 1" , description : "Week One"},
    {id: "Week 2" , description : "Week Two"},
    {id: "Week 3" , description : "Week Three"},
    {id: "Week 4" , description : "Week Four"},
    {id: "Week 5" , description : "Week Five"},
  ]

  public listColors = ['primary', 'accent', 'warn'];
  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,
  public dialogRef: MatDialogRef<LockFilingComponent>, public dialog: MatDialog,) {
   }
  lockingform : FormGroup
    ngOnInit() {
        this.lockingform = this.fb.group(new CategoryPayrollCutoffLocking());

        if(this.data.payrolltype == 12695 || this.data.payrolltype == 12696){
            this.lockingform.get('dateFrom').disable()
            this.lockingform.get('dateTo').disable()
        }
        this.lockingform.get('approvalLockDate').disable()
        this.lockingform.get('filingLockDate').disable()


        this.lockingform.get('dateFrom').setValue(this.data.table.dateFrom)
        this.lockingform.get('dateTo').setValue(this.data.table.dateTo)
        this.lockingform.get('payout').setValue(this.data.table.payout)
        this.lockingform.get('filingLockDate').setValue(this.data.table.payout)
        this.lockingform.get('approvalLockDate').setValue(this.data.table.payout)




        if (this.data.table.filingLockDate !== null) {
            this.lockingform.get('filingLockStatus').setValue(true)
            this.lockingform.get('filingLockDate').setValue(this.data.table.filingLockDatecopy)
            this.lockingform.get('filingLockDate').enable()
            // this.disabledlocking()
        }

        if(this.data.table.approvalLockDate !== null){
            this.lockingform.get('approvalLockStatus').setValue(true)
            this.lockingform.get('approvalLockDate').setValue(this.data.table.approvalLockDatecopy)
            this.lockingform.get('approvalLockDate').enable()
        }
    }

    copyNow(){
      // if(this.data.payrolltype == 12697){
      //     if(this.data.table.monthId == ""){

      //     }
      // }
      if(this.lockingform.invalid){
          return
      }
      this.dialogRef.close(
        {
          confirmed: true,
          month : this.lockingform.value.monthId,
          week : this.lockingform.value.weekId,
          // month : this.lockingform.get('monthId').setValue(),
          datefrom :this.pipe.transform(this.lockingform.get('dateFrom').getRawValue(),"yyyy-MM-ddTHH:mm:ss"),
          dateto : this.pipe.transform(this.lockingform.get('dateTo').getRawValue(),"yyyy-MM-ddTHH:mm:ss"),
          // dateto : this.pipe.transform(this.lockingform.value.dateTo,"yyyy-MM-ddTHH:mm:ss"),
          payout : this.pipe.transform(this.lockingform.value.payout,"yyyy-MM-ddTHH:mm:ss"),
          filing :this.pipe.transform(this.lockingform.get('filingLockDate').getRawValue(),"yyyy-MM-ddTHH:mm:ss"),
          approval :this.pipe.transform(this.lockingform.get('approvalLockDate').getRawValue(),"yyyy-MM-ddTHH:mm:ss"),
          filingLockStatus : this.lockingform.value.filingLockStatus,
          approvalstatus : this.lockingform.value.approvalLockStatus
        }
      )
    }

    disabledlocking(){
        if (this.lockingform.value.filingLockStatus == true) {
           this.lockingform.get('filingLockDate').enable()
        }else{
            this.lockingform.get('filingLockDate').disable()
        }
    }

    disabledapproval(){
        if (this.lockingform.value.approvalLockStatus == true) {
           this.lockingform.get('approvalLockDate').enable()
        }else{
            this.lockingform.get('approvalLockDate').disable()
        }
    }


    locked(date){
      var today = new Date()
      var lockDate = new Date(date)
      var isLocked = today > lockDate
      return isLocked
    }










//   copyNow(){
//     if (this.data.payrolltype==12697) {
//             this.
//     }

//   }

}
