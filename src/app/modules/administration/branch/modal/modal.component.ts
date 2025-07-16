import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
    // checked : boolean = true
    // dialogRef: any;
    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        public dialog: MatDialog) {}
    Branchinfo: boolean = false;
    Address: boolean = false;
    Govinfo: boolean = false;
    ContactInfo: boolean = false;
    branchsettinginfo : boolean = false

    branchinformation  : boolean = false
    contactinformation : boolean = false
    govermentinfo      : boolean = false
    addressinformation : boolean = false
    branchsettings     : boolean = false

    copyNow(){
        this.dialogRef.close(
            {
                confirmed: true,
                branchinformation: this.branchinformation,
                contactinformation: this.contactinformation,
                govermentinfo: this.govermentinfo,
                addressinformation: this.addressinformation,
                branchsettings : this.branchsettings
            }
        )
    }


    ngOnInit() {
    }



}
