import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reasonmodal',
  templateUrl: './reasonmodal.component.html',
  styleUrls: ['./reasonmodal.component.css']
})
export class ReasonmodalComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReasonmodalComponent>) { }

    ngOnInit() {
    }

    copy(e){
      this.dialogRef.close(e)
    }
}
