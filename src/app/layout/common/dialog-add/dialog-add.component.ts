import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { RequiredFields } from 'app/model/message.constant';
import { MasterService } from 'app/services/masterService/master.service';
import { GF } from 'app/shared/global-functions';
import { forkJoin } from 'rxjs';
import _ from 'lodash';
import { CoreService } from 'app/services/coreService/coreService.service';
import { DatePipe } from '@angular/common';

export interface ActionButton {
  id: string
}

@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.css']
})
export class DialogAddComponent implements OnInit {

    userForm: FormGroup
    accountTypeOptions: any = []
    
    dropdownFixRequest = new DropdownRequest
    dropdownOptions = new DropdownOptions
    subcompany = new DropdownRequest
    branch = new DropdownRequest
    isEdit: Boolean = false
    pipe = new DatePipe('en-US');

    constructor(
        public dialogRef: MatDialogRef<DialogAddComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private message: FuseConfirmationService,
        private fb: FormBuilder,
        private masterService: MasterService,
        private coreService: CoreService,
    ) { }

    get uf(){
        return this.userForm.value
    }

    ngOnInit() {
        this.userForm = this.fb.group({
            companyId: 0,
            encryptId: "",
            employeeId: 0,
            employeeCode: ["", [Validators.required,Validators.pattern('^[a-zA-Z0-9-_ ]+$')]],
            firstName: ["", [Validators.required,Validators.pattern('^[a-zA-Z-.\' ]+$')]],
            middleName: ["",[Validators.pattern('^[a-zA-Z-.\' ]+$')]],
            lastName: ["", [Validators.required,Validators.pattern('^[a-zA-Z-.\' ]+$')]],
            suffix: 0,
            birthDay: "",
            birthDate: ["", [Validators.required]],
            idSubCompany: 0,
            site: ["", [Validators.required]],
            accountType: [null, [Validators.required]],
            employeeTin: "",
            uploadType: 31161 // Single Default
        });

        this.isEdit = Object.entries(this.data).length > 0
        if (this.isEdit) {
            this.userForm.patchValue(this.data)
            this.userForm.get("suffix").setValue(this.data.suffixId)
            this.userForm.get("accountType").setValue(this.data.accountTypeId)
            this.userForm.get("employeeTin").setValue(this.data.tin)
        }

        this.dropdownFixRequest.id.push({ dropdownID: 0, dropdownTypeID: 30 }) 
        this.dropdownFixRequest.id.push({ dropdownID: 0, dropdownTypeID: 173 }) 
        
        forkJoin({
            dropdownFix: this.masterService.getDropdownFix(this.dropdownFixRequest),
            // subCompany: this.coreService.getCoreDropdown(1001, this.subcompany),
        }).subscribe({
            next: (response) => {
                this.dropdownOptions.suffixDef           = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 30)   , JSON.stringify)
                // this.dropdownOptions.subCompanyDef       = _.uniqBy(response.subCompany.payload   , JSON.stringify)
                this.accountTypeOptions                  = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 173)   , JSON.stringify)


                this.dropdownOptions.suffixDef.unshift({ dropdownID: -1, description: "-"})
            },
            error: (e) => {
                console.error(e)
            }
        });

    }

    cencel(){
        this.dialogRef.close({confirm: false})
    }

    onClick(){
        this.userForm.markAllAsTouched()
        if (this.userForm.valid) {
            if (this.userForm.value.suffix < 0) {
                this.userForm.get("suffix").setValue(0)
            }
            var final = this.userForm.value
            if (GF.IsEmpty(this.userForm.value.employeeTin)) {
                //NAEBI10171993
                var fn = this.userForm.value.firstName.substring(0,1);
                var mn = this.userForm.value.middleName.substring(0,1);
                var ln = this.userForm.value.lastName.substring(0,1);
                var bday = this.pipe.transform(this.userForm.value.birthDate,"MMddyyyy")
                var tin = "NA" + fn + mn + ln + bday
                final.employeeTin = tin;
            }
            this.dialogRef.close({confirm: true, data: final});
        }
    }

    valideName(col,fi){
        return this.userForm.controls[col].hasError('pattern') ? "Please enter a valid "+fi+"." : ""
    }

}
