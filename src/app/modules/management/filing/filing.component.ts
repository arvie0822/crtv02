import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { setValue } from '@ngneat/transloco';
import { filingForm, ChangeLog, ChangeSched, LeaveMonitoring,
         leaveForm, otTable, officialBForm, obTable,
         OffsetMonitoring, offsetForm, offTable, lvTable,
         uhTable, unpaidForm, Overtime, coeForm} from 'app/model/administration/filing';
import { NgxMatDateFormats,NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThisReceiver } from '@angular/compiler';
// import { ModalBeforeSavingComponent } from './change-schedule/modal-before-saving/modal-before-saving.component';
import { ClModalBeforeSavingComponent } from './change-log/cl-modal-before-saving/cl-modal-before-saving.component';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
    parse: {
      dateInput: 'DD/MM/YY HH:mm a'
    },
    display: {
      dateInput: 'DD/MM/YY HH:mm a',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    }
  };

@Component({
  selector: 'app-filing',
  templateUrl: './filing.component.html',
  styleUrls: ['./filing.component.css'],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }]
})
export class FilingComponent implements OnInit {
    @Input() datasource: any
    // viewingmodal: MatDialogRef<ModalBeforeSavingComponent, any>;
    clviewingmodal: MatDialogRef<ClModalBeforeSavingComponent, any>;
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
    fileUpload: ElementRef
    ot_start: any;
    ot_end: any;
    time_incl: any;
    time_outcl: any;
    shift_codecl: any;
    @ViewChild('CLTable') CLTable: MatTable<any>;
    @ViewChild('CSTable') CSTable: MatTable<any>;
    @ViewChild('LMTable') LMTable: MatTable<any>;
    @ViewChild('LVTable') LVTable: MatTable<any>;
    @ViewChild('OTTable') OTTable: MatTable<any>;
    @ViewChild('OBTable') OBTable: MatTable<any>;
    @ViewChild('OTable') OTable: MatTable<any>;
    @ViewChild('OFFTable') OFFTable: MatTable<any>;
    @ViewChild('UHTable') UHTable: MatTable<any>;
    filingForm: FormGroup
    leaveForm: FormGroup
    overtimeForm: FormGroup
    breaktypeForm: FormGroup
    officialBForm: FormGroup
    offsetForm: FormGroup
    unpaidForm: FormGroup
    coeForm: FormGroup

    timeerror = false
    breakDeduction = [];
    id: string
    pipe = new DatePipe('en-US');
    CLSource: ChangeLog[] = [];

    LMSource: LeaveMonitoring[] = [{
        leave_type: "Vacation Leave",
        total_leave: 10,
        used_leave: 2,
        pending_approval: 1,
        pending_schedule: 0,
        available_leave: 7,
    }];
    LVSource: lvTable[] = [];
    OTSource: otTable[] = [];
    OBSource: obTable[] = [];
    OSource: OffsetMonitoring[] = [{
        // include_expired: '',
        overtime_code: 'OT-001',
        overtime: '120',
        offset_used: '30',
        offset_field: '60',
        available: '30',
        expiration: '12/31/2022',
    }];
    OFFSource: offTable[] = [];
    UHSource: uhTable[] = [];
    CSSource = [];

    csColumns: string[] = ['actioncs','datecs','shiftcs', 'new_shiftcs', 'reasoncs', 'upload_filecs',  ];
    clColumns: string[] = ['actioncl','datecl', 'shift_codecl','time_incl', 'time_outcl', 'reasoncl', 'upload_filecl',  ];
    lmColumns: string[] = ['leave_type','total_leave', 'used_leave', 'pending_approval', 'pending_schedule', 'available_leave'];
    lvColumns: string[] = ['lvDateFrom', 'lvDateTo', 'lvType', 'lvhourly', 'lvoptions', 'lvstart', 'lvend', 'lvreason', 'lvUpload_File', 'lvAction'];
    otColumns: string[] = ['otdate','otshift', 'overtime_type', 'ottiming', 'ot_start', 'ot_end', 'otreason', 'uploadFileot', 'otaction' ];
    obColumns: string[] = ['dateTimeFrom','dateTimeTo', 'reason', 'location', 'remarks', 'uploadFile', 'action'];
    oColumns: string[] = ['overtime_code', 'overtime', 'offset_used', 'offset_field', 'available', 'expiration'];
    offColumns: string[] = ['date','off_min', 'off_hrs', 'reason', 'uploadFile', 'action'];
    uhColumns: string[] = ['uhDate','uhShift', 'uhDateFrom', 'uhDateTo', 'uhReason', 'uhUpload_file', 'uhAction'];

    filing = [
        {id: 0, description: 'Change Schedule'},
        {id: 1, description: 'Change Log'},
        {id: 2, description: 'Leave'},
        {id: 3, description: 'Overtime'},
        {id: 4, description: 'Offset'},
        {id: 5, description: 'Official Business'},
        {id: 6, description: 'Unpaid Hours'},
        {id: 7, description: 'COE'},
      ]
    shiftOption = [
      {id: 0, description: 'WRD'},
      {id: 1, description: 'Multiple Shift'},
      {id: 2, description: '8Am_5Pm_S'},
      {id: 3, description: '8Am_6Pm_SS'},
      {id: 4, description: '6Am_10Am_SS'},
      {id: 5, description: '3Pm_7Pm_SS'},
    ]
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
    shiftot = [
        {id: 0, description: 'shifts'},
        {id: 1, description: '6Am_10Am_SS'},
        {id: 2, description: '3Pm_7Pm_SS'},
    ]
    ot = [
        {id: 0, description: 'Paid'},
        {id: 1, description: 'Offset'},
    ]
    timing = [
        {id: 0, description: 'Pre-shift'},
        {id: 1, description: 'Post-shift'},
        {id: 2, description: 'RD/Holiday'},
    ]
    application = [
        {id: 0, description: 'No'},
        {id: 1, description: 'Yes'},
    ]
    half = [
        {id: 0, description: '1st half'},
        {id: 1, description: '2nd half'},
    ]
    coe = [
        {id: 0, description: 'Legal'},
        {id: 1, description: 'Loan'},
        {id: 2, description: 'Local Employment'},
        {id: 3, description: 'Employment Abroad'},
        {id: 4, description: 'Mobile Plan'},
        {id: 5, description: 'Visa Application'},
        {id: 6, description: 'School Requirement'},
      ]
    official = [
        {id: 0, description: 'Client meeting'},
        {id: 1, description: 'Training'},
        {id: 2, description: 'Offsite meeting'},
        {id: 3, description: 'Team building'},
        {id: 4, description: 'Official travel'},
        {id: 5, description: 'Branch Office'},
        {id: 6, description: 'Others'},
    ]
    employee = [
        {id: 0, description: 'Employee 1'},
        {id: 1, description: 'Employee 2'},
    ]
    imageUrl: any



    constructor(private fb: FormBuilder,public dialog: MatDialog) { }
    get ff(){
      return this.filingForm.value
    }
    get lf(){
      return this.leaveForm.value
    }
    get of(){
      return this.overtimeForm.value
    }
    get ob(){
      return this.officialBForm.value
    }
    get off(){
      return this.offsetForm.value
    }
    get uh(){
        return this.unpaidForm.value
    }


    ngOnInit() {
      this.filingForm = this.fb.group(new filingForm());
      this.leaveForm = this.fb.group(new leaveForm());
      this.officialBForm = this.fb.group(new officialBForm());
      this.offsetForm = this.fb.group(new offsetForm());
      this.unpaidForm = this.fb.group(new unpaidForm());
      this.coeForm  = this.fb.group(new coeForm ());
    }
    submit(){
        this.CSmodalviewing()
        this.CLmodalviewing()
    }

    CSmodalviewing() {
        if(this.filingForm.value.filingTypes == 0){
            // this.viewing();
        }

      }
    //   viewing() {
    //     if(this.viewingmodal) {
    //       this.viewingmodal.close();
    //     }
    //     this.viewingmodal = this.dialog.open(ModalBeforeSavingComponent, {

    //         width: '50%',
    //         height : '38%',
    //         panelClass: 'app-dialog',
    //         // data : {
    //         //     // data : this.
    //         // }
    //     });
    //     console.log()

    // }

    CLmodalviewing() {
        if(this.filingForm.value.filingTypes == 1){
            this.CLviewing();
        }

      }
      CLviewing() {
        // if(this.viewingmodal) {
        //   this.viewingmodal.close();
        // }
        this.clviewingmodal = this.dialog.open(ClModalBeforeSavingComponent, {

            width: '50%',
            height : '38%',
            panelClass: 'app-dialog',
            // data : {
            //     // data : this.
            // }
        });
        console.log()

    }


    handleHoursEvent(): void {
      let eventStartTime = new Date("1900-01-01 " + this.pipe.transform(this.filingForm.value.matTimeIn, 'HH:mm:ss'));
      let eventEndTime = new Date("1900-01-01 " + this.pipe.transform(this.filingForm.value.matTimeOut, 'HH:mm:ss'));
      if (eventStartTime > eventEndTime) {
        eventEndTime.setDate(eventEndTime.getDate() + 1)
        this.filingForm.controls.timeOutDaysCover.patchValue(1);
      }
      else{
          this.filingForm.controls.timeOutDaysCover.patchValue(0);
      }
      let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
      this.filingForm.controls.totalWorkingHours.patchValue(duration / 1000 / 60 / 60);
    }

    // addOT(){
    //     this.OTSource.push({
    //         otdate:  this.overtimeForm.value.overtimeDate,
    //         otshift: this.shiftot.find(item=>item.id==this.overtimeForm.value.ot_shifts).description,
    //         overtime_type: this.ot.find(item=>item.id==this.overtimeForm.value.overtime_typef).description,
    //         ottiming: this.timing.find(item=>item.id==this.overtimeForm.value.ot_timing).description,
    //         ot_start:  this.overtimeForm.value.otStart,
    //         ot_end:  this.overtimeForm.value.otEnd,
    //         otreason:  this.overtimeForm.value.ot_reason,
    //     });
    //     this.OTTable.renderRows();
    //     this.overtimeForm.reset()
    //     console.log(this.addOT)
    // }
    // otDelete(index): void {
    //     // this.OTSource.splice(index, 1);
    //     this.OTTable.renderRows();
    // }
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
            // }
        // }
    }

    lvDelete(index): void {
        this.LVSource.splice(index, 1);
        this.LVTable.renderRows();
    }
    addOFF(){
        this.OFFSource.push({
            date: this.offsetForm.value.dateo,
            off_min: this.offsetForm.value.off_mino,
            off_hrs: this.offsetForm.value.off_hrso,
            reason: this.offsetForm.value.reasono,
            uploadFile: this.offsetForm.value.uploadFileo,
        });
        this.OFFTable.renderRows();
        this.offsetForm.reset()
    }

    offDelete(index): void {
        this.OFFSource.splice(index, 1);
        this.OFFTable.renderRows();
    }

    // addOB(){
    //     this.OBSource.push({
    //         dateTimeFrom:  this.officialBForm.value.obdTFrom,
    //         dateTimeTo: this.officialBForm.value.obdTTo,
    //         reason: this.official.find(item=>item.id==this.officialBForm.value.obreason).description,
    //         location: this.officialBForm.value.oblocation,
    //         remarks: this.officialBForm.value.obremarks,
    //         uploadFile: this.officialBForm.value.obupload_file,
    //     });
    //     this.OBTable.renderRows();
    //     this.officialBForm.reset()
    // }

    obDelete(index): void {
        this.OBSource.splice(index, 1);
        this.OBTable.renderRows();
    }
    addUH(){
        this.UHSource.push({
            uhDate: this.unpaidForm.value.dateuh,
            uhShift: this.shiftOption.find(item=>item.id==this.unpaidForm.value.shiftuh).description,
            uhDateFrom: this.unpaidForm.value.dateFromuh,
            uhDateTo: this.unpaidForm.value.dateTouh,
            uhReason: this.official.find(item=>item.id==this.unpaidForm.value.reasonuh).description,
            uhUpload_file: this.unpaidForm.value.upload_fileuh,
        });
        this.UHTable.renderRows();
        this.unpaidForm.reset()
    }

    uhDelete(index): void {
        this.UHSource.splice(index, 1);
        this.UHTable.renderRows();
    }

    convertMins(){
     var off = this.offsetForm.get('off_mino').value
     var hours = Math.floor(off / 60);
     var total = hours.toString();
    //  .padStart(2, '0')
     this.offsetForm.get('off_hrso').setValue(total)
    }


    date(){
        let date1 = new Date(this.leaveForm.value.dateFrom).getDate();
        let date2 = new Date(this.leaveForm.value.dateTo).getDate();

        if (date1 > date2) {

          console.log("Date1 is less than Date2 in terms of year");
        } else if (date1 < date2) {
          console.log("Date1 is greater than Date2 in terms of year");
        } else {
          console.log(`Both years are equal`);
        }
    }
    timevalidators(){
        this.timeerror = false

        var time1 = this.leaveForm.value.leaveStartlv
        var time2 = this.leaveForm.value.leaveEndlv

    const t1 =this.pipe.transform(time1, 'HH:mm a')
    const t2 =this.pipe.transform(time2, 'HH:mm a')
    let time_s = [];
    let time_e = [];
    time_s = t1.split(':');
    time_e = t2.split(':');
    if (time_s > time_e) {
        this.leaveForm.get("leaveEndlv").setValue(""),
        this.timeerror = true
    }

    }
    // timevalidatorsOT(i){
    //     this.timeerror = false

    //     var time1 = this.OTSource[i].ot_start
    //     var time2 = this.OTSource[i].ot_end

    //     const t1 =this.pipe.transform(time1, 'HH:mm a')
    //     const t2 =this.pipe.transform(time2, 'HH:mm a')

    //     let time_s = [];
    //     let time_e = [];
    //     time_s = t1.split(':');
    //     time_e = t2.split(':');

    //     if (time_s > time_e) {
    //         this.OTSource[i].ot_end == "",
    //         this.timeerror = true
    //     }
    //     // console.log(timevalidatorsOT(i))

    // }

    change(index,shift){
        this.CSSource[index][shift].child = []
        if(this.CSSource[index][shift].id == 3){
            this.CSSource[index][shift].child.push({id:null},{id:null})
        }else if(this.CSSource[index][shift].id == 2){
            this.CSSource[index][shift].child.push({id:null})
        }

    }

    onClick(event){
        if (this.fileUpload)
        this.fileUpload.nativeElement.click()
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
    handleTimeEvent() {
    // if (this.crudtable.type == "shift") {
        if (this.time_incl != null) {
        const name = this.pipe.transform(this.time_incl, 'hh') + ":" + this.pipe.transform(this.time_incl, 'mm') + this.pipe.transform(this.time_incl, 'a').substring(0, 1)

        this.shift_codecl.patchValue(name);
        }
    // }
    }
    // uploadFile(event) {
    //     let reader = new FileReader(); // HTML5 FileReader API
    //     let file = event.target.files[0];
    //     let element: HTMLElement = document.querySelector("#displayMe") as HTMLElement;
    //     let fileName = event.target.files[0].name;
    //     element.setAttribute('value', fileName)
    //     if (event.target.files && event.target.files[0]) {
    //       reader.readAsDataURL(file);

    //       // When file uploads set it to file formcontrol
    //       reader.onload = () => {
    //         this.imageUrl = reader.result;
    //         this..patchValue({
    //           file: reader.result
    //         });

    //       }
    //       // ChangeDetectorRef since file is loading outside the zone
    //       this.cd.markForCheck();
    //     }

    //   }

    addRow(){
        var start = new Date(this.filingForm.value.dateFrom)
        var end = new Date(this.filingForm.value.dateTo)

        if(this.filingForm.value.filingTypes == 0){


        this.CSSource = []
        for (let x = start.getDate(); x <= end.getDate(); x++){
        var cs = {
            datecs: (start.getMonth() + 1) +"/" + x.toString() + "/"+start.getFullYear(),
            shiftcs: "1230P_0930P",
            new_shiftcs: {id:null, child: []},
            reasoncs: '',
            upload_filecs: '',
            actioncs: ''
        }
          this.CSSource.push(cs)
        }
        //    this.CSTable.renderRows()
        } else if (this.filingForm.value.filingTypes == 1) {

            this.CLSource = []
            for (let x = start.getDate(); x <= end.getDate(); x++){
            var cl = {
                datecl: (start.getMonth() + 1) +"/" + x.toString() + "/"+start.getFullYear(),
                shift_codecl: "1230P_0930P",
                time_incl: '',
                time_outcl: '',
                reasoncl: '',
                upload_filecl: '',
                sched_incl: "0800AM_0600PM_SS",
                sched_outcl: '0800AM_0600PM_SS',
                clstatus: '',
            }
              this.CLSource.push(cl)
            }
            this.CLTable.renderRows()
        } else if (this.filingForm.value.filingTypes == 3) {

            this.OTSource = []
            for (let x = start.getDate(); x <= end.getDate(); x++){
            var ot = {
                otdate: (start.getMonth() + 1) +"/" + x.toString() + "/"+start.getFullYear(),
                otshift: '',
                overtime_type: '',
                ottiming:'',
                ot_start:'',
                ot_end:'',
                otreason: '',
                uploadFileot : '',
                status: '',
            }
              this.OTSource.push(ot)
            }
            this.OTTable.renderRows()

        } else if (this.filingForm.value.filingTypes == 5) {

            this.OBSource = []
            for (let x = start.getDate(); x <= end.getDate(); x++){
            var ob = {
                date: (start.getMonth() + 1) +"/" + x.toString() + "/"+start.getFullYear(),
                dateTimeFrom: '',
                dateTimeTo: '',
                reason:'',
                location:'',
                remarks:'',
                uploadFile: '',
            }
              this.OBSource.push(ob)
            }
            this.OBTable.renderRows()
        }


    }

    clear(e){
        if (this.filingForm.value.filingTypes == 0 || this.filingForm.value.filingTypes == 1 || this.filingForm.value.filingTypes == 3
          || this.filingForm.value.filingTypes == 4 || this.filingForm.value.filingTypes == 5 || this.filingForm.value.filingTypes == 6 || this.filingForm.value.filingTypes == 7) {
            this.filingForm.get('dateFrom').setValue('')
            this.filingForm.get('dateTo').setValue('')
            this.filingForm.get('includeExpiry').setValue('')

        }
        if (e == 1) {
            this.datasource = []
        }

    }


}
