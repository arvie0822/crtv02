import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-reason',
  templateUrl: './modal-reason.component.html',
  styleUrls: ['./modal-reason.component.css']
})
export class ModalReasonComponent implements OnInit {
    label: string = ""
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalReasonComponent>
  ) { }

  ngOnInit() {
  }

  copy(e){
    this.dialogRef.close(e)
}

}
