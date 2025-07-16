import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-effective-date',
  templateUrl: './effective-date.component.html',
  styleUrls: ['./effective-date.component.scss']
})
export class EffectiveDateComponent implements OnInit {

  @Output() btnConfirmed = new EventEmitter<void>();
  effectiveDate: any

  constructor(public dialogRef: MatDialogRef<EffectiveDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  confirmed(){
    this.dialogRef.close('Ok')
    this.btnConfirmed.emit(this.effectiveDate)
  }

}
