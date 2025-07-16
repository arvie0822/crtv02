import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { filingForm, leaveForm, LeaveMonitoring, lvTable } from 'app/model/administration/filing';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = true;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color = 'color' ;
    leaveForm: FormGroup
    filingForm : FormGroup
    imageUrl: any
    LVSource: lvTable[] = [];
    @ViewChild('LVTable') LVTable: MatTable<any>;

    lvColumns: string[] = ['lvAction','lvDateFrom', 'lvDateTo', 'lvType', 'lvhourly', 'lvoptions', 'lvstart', 'lvend', 'lvreason', 'lvUpload_File'];
    lmColumns: string[] = ['leave_type','total_leave', 'used_leave', 'pending_approval', 'pending_schedule', 'available_leave'];

    leave = [
        {id: 0, description: 'Vacation Leave'},
        {id: 1, description: 'Sick Leave'},
        {id: 2, description: 'Emergency Leave'},
    ]

    hour = [
        {id: 0, description: 'Whole day'},
        {id: 1, description: 'Half day'},
        {id: 2, description: 'Hourly'},
    ]

    application = [
        {id: 0, description: 'No'},
        {id: 1, description: 'Yes'},
    ]

    half = [
        {id: 0, description: '1st half'},
        {id: 1, description: '2nd half'},
    ]


    LMSource: LeaveMonitoring[] = [{
        leave_type: "Vacation Leave",
        total_leave: 10,
        used_leave: 2,
        pending_approval: 1,
        pending_schedule: 0,
        available_leave: 7,
    }];s


  constructor(private fb: FormBuilder,public dialog: MatDialog) { }
  get lf(){
    return this.leaveForm.value
  }
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

   addLV(){
    this.leaveForm.markAllAsTouched()
    // if (this.leaveForm.valid) {
        console.log(this.leaveForm.value.upload_filelv)
        // if (this.leaveForm.value.upload_filelv !== null) {
            this.LVSource.push({
                lvDateFrom: this.leaveForm.value.dateFromlv,
                lvDateTo: this.leaveForm.value.dateTolv,
                lvType: this.leave.find(item=>item.id==this.leaveForm.value.typelv).description,
                lvhourly: this.hour.find(item=>item.id==this.leaveForm.value.hourlylv).description,
                lvoptions: this.leaveForm.value.hourlylv == 0 ||  this.leaveForm.value.hourlylv == 2 ? "" : this.half.find(item=>item.id==this.leaveForm.value.optlv).description,
                lvstart: this.leaveForm.value.leaveStartlv,
                lvend: this.leaveForm.value.leaveEndlv,
                // lvpay: this.application.find(item=>item.id==this.leaveForm.value.withPaylv).description,
                lvreason: this.leaveForm.value.reasonlv,
                lvUpload_File: this.leaveForm.value.upload_filelv,
                });
        this.LVTable.renderRows();
        this.leaveForm.reset()
    }

    lvDelete(index) {
        this.LVSource.splice(index, 1);
        this.LVTable.renderRows();
    }


}
