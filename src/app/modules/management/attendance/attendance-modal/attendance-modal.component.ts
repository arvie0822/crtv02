import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from 'app/services/coreService/coreService.service';

@Component({
  selector: 'app-attendance-modal',
  templateUrl: './attendance-modal.component.html',
  styleUrls: ['./attendance-modal.component.css']

})
export class AttendanceModalComponent implements OnInit {

    minFromDate: Date;
    maxFromDate: Date;
    @ViewChild('picker') picker: any;
    pipe = new DatePipe('en-US');


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
    dialogRef: MatDialogRef<AttendanceModalComponent, any>;



    constructor(private core: CoreService,  public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {

    }

  ngOnInit() {
    this.dataSource = this.data
    // console.log(this.dataSource)

  }


  Submit(){
    this.dataSource.forEach(element => {

        // var dds = this.pipe.transform(dd, 'HH:mm:ss')
        // console.log(dds)

        // var ddd = dd.setDate(dd.getDate())
        // var dddd = new Date(dd)
        // console.log(new Date(ddd))
        // console.log(ddd.toISOString().substring(0,ddd.toISOString().length-1))
        // element.clock = dd.toISOString().substring(0,dd.toISOString().length-1)
        var dd = new Date(element.clock)
        element.clock = this.pipe.transform(dd, 'yyyy-MM-ddTHH:mm:ss.ssss')

    });
    console.log(this.dataSource)
  }
}
