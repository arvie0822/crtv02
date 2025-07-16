import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-date',
  templateUrl: './reset-date.component.html',
  styleUrls: ['./reset-date.component.scss']
})
export class ResetDateComponent implements OnInit {

  @Output() btnConfirmed = new EventEmitter<void>();
  effectiveDate: any = new Date();

  constructor(public dialogRef: MatDialogRef<ResetDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  confirmed(){
    this.dialogRef.close('Ok')
    this.btnConfirmed.emit(this.effectiveDate)
  }

}
