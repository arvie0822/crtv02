import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DatePipe } from '@angular/common';
import { PayrollRunComponent } from '../payroll-run.component';



export interface PeriodicElement {
    Date: string;
    Sched_in: string;
    Sched_out: string;
    Time_in: string;
    Time_out: string;
  }

  const ELEMENT_DATA: PeriodicElement[] = [
    // {Date: "01/01/23", Sched_in: '0800AM_0600PM_SS', Sched_out: "8AM_5PM_SS", Time_in : "", Time_out: "",},
    // {Date: "01/02/23", Sched_in: '0800AM_0600PM_SS', Sched_out: "8AM_5PM_SS", Time_in : "", Time_out: "",},
    // {Date: "01/03/23", Sched_in: '0800AM_0600PM_SS', Sched_out: "8AM_5PM_SS", Time_in : "", Time_out: "",},
  ];



@Component({
    providers: [PayrollRunComponent],
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
    displayedColumns: string[] = ['Date', 'Sched_in', 'Sched_out','Time_in','Time_out'];
    dataSource = ELEMENT_DATA;
    pipe = new DatePipe('en-US');

    constructor( public dialogRef: MatDialogRef<DialogComponent>,private cs: PayrollRunComponent,
        @Inject(MAT_DIALOG_DATA) public filingtypedropdown: any, public dialog: MatDialog) { }

  ngOnInit() {

    this.dataSource  = this.filingtypedropdown.ds.map(x=>({
        Date :  this.pipe.transform(x.date, "MM/dd/yyyy"),
        Sched_in : x.sched_incl,
        Sched_out : x.sched_outcl,
        // Time_in_display : this.pipe.transform(x.Time_in, "MM/dd/yyyy HH:mm"),
        // Time_out_display :this.pipe.transform(x.Time_out, "MM/dd/yyyy HH:mm"),
        Time_in : this.pipe.transform(x.timeIn, "MM/dd/yyyy HH:mm"),
        Time_out :this.pipe.transform(x.timeOut, "MM/dd/yyyy HH:mm"),
     }))



  }

  copy(e){
    this.dialogRef.close(e)
    // this.submit()
  }


}
