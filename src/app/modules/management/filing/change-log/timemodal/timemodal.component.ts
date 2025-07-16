import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-timemodal',
  templateUrl: './timemodal.component.html',
  styleUrls: ['./timemodal.component.css']
})
export class TimemodalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<TimemodalComponent>) { }

  ngOnInit() {
  }

  copy(e){
    this.dialogRef.close(e)
}

}
