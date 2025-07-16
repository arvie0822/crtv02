import { OverlayRef } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.css']
})
export class DialogboxComponent implements OnInit {

    date = new Date
    code: number
    pipe = new DatePipe('en-US');

constructor(@Inject(MAT_DIALOG_DATA) public data: any,
public dialogRef: MatDialogRef<DialogboxComponent>) { }


ngOnInit() {
}

  submit(){
    this.dialogRef.close({
        date: this.date,
        code: this.code
    })
  }

  closeModal(): void{
    this.dialogRef.close()
  }

}
