import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dissapprove-reason',
  templateUrl: './dissaprove-reason.component.html',
  styleUrls: ['./dissaprove-reason.component.css']
})
export class DissapproveReasonComponent implements OnInit {
  label: string = ""
  reason: string = ""
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DissapproveReasonComponent>
  ) { }

  ngOnInit() {
  }

  confirm(e) {
    this.dialogRef.close(
      {
        confirmed: e,
        reason: this.reason,
        isApproved: false
      }
    )
  }

}
