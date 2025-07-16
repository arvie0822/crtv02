import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';



export interface PeriodicElement {
    Date: string;
    Sched_in: string;
    Sched_out: string;
    Time_in: string;
    Time_out: string;
  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {Date: "01/01/23", Sched_in: '0800AM_0600PM_SS', Sched_out: "8AM_5PM_SS", Time_in : "", Time_out: "",},
    {Date: "01/02/23", Sched_in: '0800AM_0600PM_SS', Sched_out: "8AM_5PM_SS", Time_in : "", Time_out: "",},
    {Date: "01/03/23", Sched_in: '0800AM_0600PM_SS', Sched_out: "8AM_5PM_SS", Time_in : "", Time_out: "",},
  ];



@Component({
  selector: 'app-cl-modal-before-saving',
  templateUrl: './cl-modal-before-saving.component.html',
  styleUrls: ['./cl-modal-before-saving.component.css']
})
export class ClModalBeforeSavingComponent implements OnInit {
    displayedColumns: string[] = ['Date', 'Sched_in', 'Sched_out','Time_in','Time_out'];
    dataSource = ELEMENT_DATA;
    constructor( public dialogRef: MatDialogRef<ClModalBeforeSavingComponent>) { }

  ngOnInit() {
  }

  copy(e){
    this.dialogRef.close(e)
  }

}
