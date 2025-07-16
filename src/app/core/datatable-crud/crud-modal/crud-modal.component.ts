import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownRequest } from 'app/model/dropdown.model';
import { SaveMessage } from 'app/model/message.constant';



@Component({
    selector: 'app-crud-modal',
    templateUrl: './crud-modal.component.html',
    styleUrls: ['./crud-modal.component.scss'],

})
export class CrudModalComponent implements OnInit {
    dynamicForm: FormGroup
    template = []
    options: any = []
    dropdownFix = new DropdownRequest
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private message: FuseConfirmationService) { }

    ngOnInit() {
        this.template = this.data.data.form.filter(x => x.visible == true)
        this.settings(this.data.data.form)
        this.mapDropdown(this.data.data.form.filter(x => x.type == "select"), this.data.dropdowns)
    }

    mapDropdown(list, data){
        console.log(data)
        list.forEach((element) => {
            if(element.dropdownType.type == "fix"){
                element.options = data.dropdownFix.payload.filter(x => x.dropdownTypeID == element.dropdownType.uri)
            }
        });
    }

    settings(data) {
        this.dynamicForm = new FormGroup({});
        data.forEach((element) => {
            this.dynamicForm.addControl(element.key, new FormControl(element.value));
            const CONTROL = this.dynamicForm.controls[element.key];

            if(element.required != false){
                let controlValidators = [];
                controlValidators.push(Validators.required);
                CONTROL.setValidators(controlValidators);
            }
        });

    }

    submit(): void {
        this.dynamicForm.markAllAsTouched();
        if (this.dynamicForm.valid) {
          const dialogRef = this.message.open(SaveMessage);
            console.log(this.dynamicForm.value)
            dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {

            //   this.tenantService.postBranch(this.branchForm.value).subscribe({
            //     next: (value: any) => {
            //       if (value.statusCode == 200) {
            //         this.message.open(SuccessMessage);
            //         this.isSave = false,
            //         this.router.navigate(['/search/branch']);
            //       }
            //       else {
            //         this.message.open(FailedMessage);
            //         console.log(value.stackTrace)
            //         console.log(value.message)
            //       }
            //     },
            //     error: (e) => {
            //       this.isSave = false
            //       this.message.open(FailedMessage);
            //       console.error(e)
            //     }
            //   });
            }
          });
        }
      }
}
