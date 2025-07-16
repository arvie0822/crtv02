import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownRequest } from 'app/model/dropdown.model';
import { RequiredFields } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';

export interface ActionButton {
  id: string
}

@Component({
  selector: 'app-dialog-del',
  templateUrl: './dialog-del.component.html',
  styleUrls: ['./dialog-del.component.css']
})
export class DialogDelComponent implements OnInit {

    fileName: any
    dropdownRequest = new DropdownRequest
    constructor(
        public dialogRef: MatDialogRef<DialogDelComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public dataset: any,
        private message: FuseConfirmationService,
        private fb: FormBuilder,
        private coreService: CoreService,
    ) { }

    ngOnInit() {
       
    }

    cencel(){
        this.dialogRef.close({event: "", isConfrim: false})
    }

    onClick(){
        if (this.fileName == '') {
            RequiredFields.message = "Please select filename first!"
            this.message.open(RequiredFields)
            return
        }
        this.dialogRef.close({event: this.fileName, isConfrim: true});
    }
}
