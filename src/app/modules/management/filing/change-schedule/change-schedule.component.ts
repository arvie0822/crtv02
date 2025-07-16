import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { labels } from 'app/mock-api/apps/mailbox/data';
import { coeForm, leaveForm,ChangeSched, ChangeLog, filingForm, otTable} from 'app/model/administration/filing';
// import { ModalBeforeSavingComponent } from './modal-before-saving/modal-before-saving.component';
import { ModalDateRangeComponent } from './modal-date-range/modal-date-range.component';
import { ModalReasonComponent } from './modal-reason/modal-reason.component';


@Component({
  selector: 'app-change-schedule',
  templateUrl: './change-schedule.component.html',
  styleUrls: ['./change-schedule.component.css']
})
export class ChangeScheduleComponent implements OnInit {
    @Input() datasource: any
    filingForm: FormGroup
    @ViewChild('CSTable') CSTable: MatTable<any>;
    // @ViewChild('OTTable') OTTable: MatTable<any>;
    dialogRef: MatDialogRef<ModalDateRangeComponent, any>;
    dialogRefreason: MatDialogRef<ModalReasonComponent, any>;
    imageUrl : any
    coeForm: FormGroup
    leaveForm : FormGroup
    // CSSource =
    // [
    //     {actioncs: '', datecs: "01/01/2022", shiftcs: "0800AM_0600PM_SS", new_shiftcs: {id:null, child: []}, reasoncs: '', upload_filecs: '',},
    //     {actioncs: '', datecs: "01/01/2022", shiftcs: "0800AM_0600PM_SS", new_shiftcs: {id:null, child: []}, reasoncs: '', upload_filecs: '',}


    // ];
      CLSource: ChangeLog[] = [{
        datecl: "01/01/2022",
        // shift_type: "Regular",
        shift_codecl: "0800AM_0600PM_SS",
        sched_incl: "8:00 Am",
        sched_outcl: "6:00 Pm",
        time_incl: '',
        time_outcl: '',
        reasoncl: '',
        upload_filecl: '',
       clstatus : '',

    }];

     OTSource: otTable[] = [{
        otdate: '',
        otshift: '',
        overtime_type: '',
        ottiming:'',
        ot_start:'',
        ot_end:'',
        otreason: '',
        uploadFileot : '',
        status: '',
    }];
    csColumns: string[] = ['actioncs','datecs','shiftcs', 'new_shiftcs', 'reasoncs', 'upload_filecs',];
    shiftOption = [
        {id: 0, description: 'WRD'},
        {id: 1, description: 'Multiple Shift'},
        {id: 2, description: '8Am_5Pm_S'},
        {id: 3, description: '8Am_6Pm_SS'},
        {id: 4, description: '6Am_10Am_SS'},
        {id: 5, description: '3Pm_7Pm_SS'},
      ]
    constructor(private fb: FormBuilder,
                public dialog: MatDialog) { }
    get c(){
        return this.coeForm.value
    }
    get ff(){
        return this.filingForm.value
      }

  ngOnInit() {
    this.coeForm  = this.fb.group(new coeForm ());
    this.leaveForm = this.fb.group(new leaveForm());
    this.filingForm = this.fb.group(new filingForm());





  }

    submit(){

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

    modal(e,i) {
        if (i == 0 && this.datasource.length > 1) {
            if(this.dialogRef) {
                this.dialogRef.close();
              }
              this.dialogRef = this.dialog.open(ModalDateRangeComponent, {
                  width: '20%',
                  height : '15%',
              })

              this.dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    for (let ii = 1; ii < this.datasource.length; ii++) {
                        this.datasource[ii].new_shiftcs.id = e.value
                    }
                        // this.CSTable.renderRows()
                  }
              })
        }
    }

    reasonmodal(e,i){
        if (i == 0) {
            if (i == 0 && this.datasource.length > 1) {
                if(this.dialogRefreason) {
                    this.dialogRefreason.close();
                  }
                  this.dialogRefreason = this.dialog.open(ModalReasonComponent, {
                      width: '20%',
                      height : '15%',
                  })

                  this.dialogRefreason.afterClosed().subscribe(result => {
                      if (result) {
                        for (let ii = 1; ii < this.datasource.length; ii++) {
                            this.datasource[ii].reasoncs = e.target.value
                        }
                            // this.CSTable.renderRows()
                      }
                  })
            }
        }
    }
    // openreason() {
    //   if(this.dialogRefreason) {
    //     this.dialogRefreason.close();
    //   }
    //   this.dialogRefreason = this.dialog.open(ModalReasonComponent, {

    //       width: '20%',
    //       height : '15%',
    //   });
    //   console.log()

    // }

    handleDeleteBreak(index){
        this.datasource.splice(index, 1);
        this.CSTable.renderRows();

    }

}
