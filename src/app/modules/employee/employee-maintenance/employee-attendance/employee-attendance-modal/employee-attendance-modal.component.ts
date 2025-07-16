import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FailedMessage, SuccessMessage } from 'app/model/message.constant';
import { AttendanceService } from 'app/services/attendanceService/attendance.service';
import { CoreService } from 'app/services/coreService/coreService.service';
import { forEach } from 'lodash';
enum CheckBoxType { APPLY_FOR_JOB, MODIFY_A_JOB, NONE };


@Component({
  selector: 'app-employee-attendance-modal',
  templateUrl: './employee-attendance-modal.component.html',
  styleUrls: ['./employee-attendance-modal.component.css']

})
export class EmployeeAttendanceModalComponent implements OnInit {

    check_box_type = CheckBoxType;
    currentlyChecked: CheckBoxType;

    minFromDate: Date;
    maxFromDate: Date;
    @ViewChild('picker') picker: any;
    pipe = new DatePipe('en-US');
    selectedCount: number = 2;

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
    public defaultTime = [new Date().getHours(), 0 , 0]
    failedMessage = { ...FailedMessage }

    // public formGroup = new FormGroup({
    //     date: new FormControl(null, [Validators.required]),
    //     date2: new FormControl(null, [Validators.required])
    //   })
    //   public dateControl = new FormControl(new Date(2021,9,4,5,6,7));
    //   public dateControlMinMax = new FormControl(new Date());

      // public options = [
      //   { value: true, label: 'True' },
      //   { value: false, label: 'False' }
      // ];

      // public listColors = ['primary', 'accent', 'warn'];

      // public stepHours = [1, 2, 3, 4, 5];
      // public stepMinutes = [1, 5, 10, 15, 20, 25];
      // public stepSeconds = [1, 5, 10, 15, 20, 25];

    displayedColumns: string[] = ['day', 'date', 'inout', 'time' ,'source' ,'use'];
    dataSource = [];
    dialogRef: MatDialogRef<EmployeeAttendanceModalComponent, any>;



    constructor(private attendanceService: AttendanceService,
        private message: FuseConfirmationService,
        public dialog: MatDialog, @Inject(MAT_DIALOG_DATA)
        public data: any,
    ) {}

    ngOnInit() {
        this.data
        var i = this.data.index
        var timein = this.data.in
        var timeout = this.data.out
        this.dataSource = this.data.values
        // var date =  this.pipe.transform(this.data.values[i].dateDisplay,'yyyy-MM-dd')
        debugger
        if (this.data.date != '') {
            debugger
            this.dataSource.forEach(ele => {
                ele.active = false
                var date = this.pipe.transform(ele.date, 'yyyy-MM-dd HH:mm')
                this.data.datas

                if (timein == date && ele.day === 'Current' || timeout == date && ele.day === 'Current') {
                    ele.active = true
                }
                else {
                    ele.active = false
                }

            });




        }
    }

    onCheckboxChange(i){
       var sample =  this.dataSource.filter(ac => ac.active)
        if (sample.length > 2) {
            this.failedMessage.message = 'please uncheck the previous logs that you want to change'
            this.message.open(this.failedMessage);
            // ev.checked = false
            setTimeout(() => {
                this.dataSource[i].active = false
            }, 1000);
        }
    }

  Submit(){

    var save = this.dataSource.filter(ac => ac.active == true )
    save.forEach(elem => {
            elem.date = this.pipe.transform(elem.date,'yyyy-MM-ddTHH:mm')
    });
    this.attendanceService.postAttendanceLogsManual(save).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
            var dialogRef = this.message.open(SuccessMessage);
            dialogRef.afterClosed().subscribe((result) => {
                if (result == "confirmed") {
                    this.dialog.closeAll();

                }
            })
        }
        else {
          FailedMessage.message = value.message
          this.message.open(FailedMessage);
          this.dialog.closeAll();
          console.log(value.stackTrace)
          console.log(value.message)
        }
      },
      error: (e) => {
        console.error(e)
      }
    });
  }
}
