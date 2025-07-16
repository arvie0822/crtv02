import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ChangeLog, filingForm, leaveForm } from 'app/model/administration/filing';
import { TimekeepingGenerationComponent } from 'app/modules/employee/employee-setup/timekeeping-generation/timekeeping-generation.component';
import { ModalReasonComponent } from '../change-schedule/modal-reason/modal-reason.component';
import { ReasonmodalComponent } from './reasonmodal/reasonmodal.component';
import { TimemodalComponent } from './timemodal/timemodal.component';
import { TimeoutmodalComponent } from './timeoutmodal/timeoutmodal.component';

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.css']
})
export class ChangeLogComponent implements OnInit {
    @Input() datasource : any
    @ViewChild('CLTable') CLTable: MatTable<any>;
    dialogRefreason: MatDialogRef<ReasonmodalComponent, any>;
    dialogReftime: MatDialogRef<TimemodalComponent, any>;
    dialogReftimeout: MatDialogRef<TimeoutmodalComponent, any>;
    imageUrl : any
    leaveForm : FormGroup
    filingForm: FormGroup
    CLSource = [];

    clColumns: string[] = ['actioncl','datecl', 'shift_codecl','sched_incl','sched_outcl','time_incl', 'time_outcl', 'reasoncl', 'upload_filecl','clstatus'];

    constructor(private fb: FormBuilder, public dialog: MatDialog) { }
    get ff(){
      return this.filingForm.value
    }



    ngOnInit() {
      this.filingForm = this.fb.group(new filingForm());
      this.leaveForm = this.fb.group(new leaveForm());

    }

    uploadFile(event,id) {
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        console.log(id)
        let element: HTMLElement = document.querySelector("#"+id) as HTMLElement;
        let fileName = event.target.files[0].name;
        element.setAttribute('value', fileName)
            if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(file);

            // When file uploads set it to file formcontrol
            reader.onload = () => {
                this.imageUrl = reader.result;
                this.leaveForm.patchValue({
                file: reader.result
                });

            }
            // ChangeDetectorRef since file is loading outside the zone
            //   this.cd.markForCheck();
        }
    }

    reasonmodal(e,i){
        if (i == 0 && this.datasource.length > 1) {
            if(this.dialogRefreason) {
                this.dialogRefreason.close();
              }
              this.dialogRefreason = this.dialog.open(ReasonmodalComponent, {
                  width: '20%',
                  height : '15%',
              })

              this.dialogRefreason.afterClosed().subscribe(result => {
                  if (result) {
                    for (let ii = 1; ii < this.datasource.length; ii++) {
                        this.datasource[ii].reasoncl = e.target.value
                    }
                        // this.CSTable.renderRows()
                  }
              })
        }
    }
    openreason(e,i) {
        if (i == 0 && this.datasource.length > 1) {
            if(this.dialogReftime) {
                this.dialogReftime.close();
              }
              this.dialogReftime = this.dialog.open(ReasonmodalComponent, {
                  width: '20%',
                  height : '15%',
              })

              this.dialogReftime.afterClosed().subscribe(result => {
                  if (result) {
                    for (let ii = 1; ii < this.datasource.length; ii++) {
                        this.datasource[ii].reasoncl = e.target.value
                    }
                        // this.CSTable.renderRows()
                  }
              })
        }
    }

    timemodal(e,i){
        if (i == 0 && this.datasource.length > 1) {
            if(this.dialogReftime) {
                this.dialogReftime.close();
              }
              this.dialogReftime = this.dialog.open(TimemodalComponent, {
                  width: '20%',
                  height : '15%',
              })

              this.dialogReftime.afterClosed().subscribe(result => {
                  if (result) {
                    for (let ii = 1; ii < this.datasource.length; ii++) {
                        this.datasource[ii].time_incl = e
                    }
                        // this.CSTable.renderRows()
                  }
              })
        }
    }


    timeoutmodal(e,i){
        if (i==0) {
            if (i == 0 && this.datasource.length > 1) {
                if(this.dialogReftime) {
                    this.dialogReftime.close();
                  }
                  this.dialogReftime = this.dialog.open(TimemodalComponent, {
                      width: '20%',
                      height : '15%',
                  })

                  this.dialogReftime.afterClosed().subscribe(result => {
                      if (result) {
                        for (let ii = 1; ii < this.datasource.length; ii++) {
                            this.datasource[ii].time_outcl = e
                        }
                            // this.CSTable.renderRows()
                      }
                  })
            }
        }
    }

    handleDeleteBreak(index){
        this.datasource.splice(index, 1);
        this.CLTable.renderRows();

    }

}
