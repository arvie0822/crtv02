import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TableRequest } from 'app/model/datatable.model';
import { DropdownRequest } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';



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
    request: any = []
    uri: string
    pipe = new DatePipe('en-US');
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CrudModalComponent>,
        private message: FuseConfirmationService,
        private coreService: CoreService
    ) { }

    ngOnInit() {
        // this.template = this.data.data.form.filter(x => x.visible == true)
        // this.settings(this.data.data.form)
        // this.mapDropdown(this.data.data.form.filter(x => x.type == "select"), this.data.dropdowns)
        // this.request = new TableRequest()
        this.template = this.data.data.modal.filter(x => x.visible == true && this.data.form.form.includes(x.key))
        this.uri = this.data.data.api[this.data.form.key]
    }

    // mapDropdown(list, data){
    //     console.log(data)
    //     list.forEach((element) => {
    //         if(element.dropdownType.type == "fix"){
    //             element.options = data.dropdownFix.payload.filter(x => x.dropdownTypeID == element.dropdownType.uri)
    //         }
    //     });
    // }

    // settings(data) {
    //     this.dynamicForm = new FormGroup({});
    //     data.forEach((element) => {
    //         this.dynamicForm.addControl(element.key, new FormControl(element.value));
    //         const CONTROL = this.dynamicForm.controls[element.key];

    //         if(element.required != false){
    //             let controlValidators = [];
    //             controlValidators.push(Validators.required);
    //             CONTROL.setValidators(controlValidators);
    //         }
    //     });

    // }

    // submit(): void {
    //     this.dynamicForm.markAllAsTouched();
    //     if (this.dynamicForm.valid) {
    //       const dialogRef = this.message.open(SaveMessage);
    //         console.log(this.dynamicForm.value)
    //         dialogRef.afterClosed().subscribe((result) => {
    //         if (result == "confirmed") {

    //         //   this.tenantService.postBranch(this.branchForm.value).subscribe({
    //         //     next: (value: any) => {
    //         //       if (value.statusCode == 200) {
    //         //         this.message.open(SuccessMessage);
    //         //         this.isSave = false,
    //         //         this.router.navigate(['/search/branch']);
    //         //       }
    //         //       else {
    //         //         this.message.open(FailedMessage);
    //         //         console.log(value.stackTrace)
    //         //         console.log(value.message)
    //         //       }
    //         //     },
    //         //     error: (e) => {
    //         //       this.isSave = false
    //         //       this.message.open(FailedMessage);
    //         //       console.error(e)
    //         //     }
    //         //   });
    //         }
    //       });
    //     }
    //   }

    getDataNeeded(){
        var obj = {}
        this.data.data.param.forEach(item => {

            if (item.id == "_menu") {
                obj[item.key] = this.data.form._value

            } else if (item.id == "_default") {
                obj[item.key] = this.setValue(item._value,item.type)

            } else if (item.id.includes(".")) {
                var sp = item.id.split(".")
                if (sp[0] == "rows") {
                    obj[item.key] = this.data.ds[sp[1]]
                } else {
                    this.data.data[sp[0]].filter(ii=>ii.key==sp[1]).forEach(el => {
                        obj[item.key] = this.setValue(el._value,item.type)
                    });
                }
            }
        });
        // console.log(obj)
        return obj
    }

    setValue(v, t){
        var out: any = v
        switch (t) {
            case "date":
                out = this.pipe.transform(v,"yyyy-MM-dd")
                break;
            case "time":
                out = this.pipe.transform(v,"HH:mm:ss")
                break;
        }
        return out
    }

    close(){
        this.dialogRef.close()
    }

    submit(){
        var obj = this.getDataNeeded()
        const dialogRef = this.message.open(SaveMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                console.log(result)
                this.coreService.postData(this.uri, obj).subscribe({
                    next: (value: any) => {
                      if (value.statusCode == 200) {
                        this.message.open(SuccessMessage);
                      }
                      else {
                        this.message.open(FailedMessage);
                        console.log(value.stackTrace)
                        console.log(value.message)
                      }
                    },
                    error: (e) => {
                      this.message.open(FailedMessage);
                      console.error(e)
                    }
                  });
            }
        })
    }
}
