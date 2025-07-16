import { Component,Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-date-range',
  templateUrl: './modal-date-range.component.html',
  styleUrls: ['./modal-date-range.component.sass']
})
export class ModalDateRangeComponent implements OnInit {
    @Input() label: string
    dropdownDetail = {

        id: 0,
        description: ""

    }

    placeholder: string = ""

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalDateRangeComponent>) { }

    ngOnInit() {
        this.placeholder = this.label == undefined || this.label == null || this.label == "" ? this.dropdownDetail.description : this.label
    }

    copy(e){
        this.dialogRef.close(e)
    }
}
