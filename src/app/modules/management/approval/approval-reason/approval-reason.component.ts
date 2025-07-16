import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-approval-reason',
  templateUrl: './approval-reason.component.html',
  styleUrls: ['./approval-reason.component.css']
})
export class ApprovalReasonComponent implements OnInit {
  label: string = ""
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApprovalReasonComponent>
  ) { }

  ngOnInit() {
  }

  confirm(e) {
    this.dialogRef.close(
      {
        confirmed: e,
        reason: "",
        isApproved: true
      }
    )
  }

}
