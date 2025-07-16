import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { leaveForm, uhTable, UnpaidBreak, unpaidForm } from 'app/model/administration/filing';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { FilingService } from 'app/services/filingService/filing.service';

@Component({
  selector: 'app-unpaid-hours',
  templateUrl: './unpaid-hours.component.html',
  styleUrls: ['./unpaid-hours.component.css']
})
export class UnpaidHoursComponent implements OnInit {
    @ViewChild('UHTable') UHTable: MatTable<any>;
    @Input() datasource : any
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
    leaveForm : FormGroup
    unpaidForm: FormGroup
    isSave : boolean = false
    imageUrl : any
    editing = false
    index = 0
    id : string = ""
    failedMessage = { ...FailedMessage}
    saveMessage = { ...SaveMessage}
    late : boolean = false
    shiftOption = [
        {id: 0, description: 'WRD'},
        {id: 1, description: 'Multiple Shift'},
        {id: 2, description: '8Am_5Pm_S'},
        {id: 3, description: '8Am_6Pm_SS'},
        {id: 4, description: '6Am_10Am_SS'},
        {id: 5, description: '3Pm_7Pm_SS'},
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
    UHSource = [];
    uhColumns: string[] = ['uhAction','uhDate','uhShift', 'uhDateFrom', 'uhDateTo', 'uhReason', 'uhUpload_file'];

  constructor(private fb: FormBuilder,private message: FuseConfirmationService,private route: ActivatedRoute,private coreService : CoreService,
    private router: Router,
    private filingService : FilingService) { }
    get uh(){
        return this.unpaidForm.value
    }


    ngOnInit() {


        this.id = this.route.snapshot.paramMap.get('id');
        this.unpaidForm = this.fb.group(new UnpaidBreak());
        this.leaveForm = this.fb.group(new leaveForm());
        this.unpaidForm.reset()

        if (this.id !== "") {

                //fetch edit data here
                this.filingService.getUnpaidBreak(this.id).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.datasource.push({
                                date : value.payload.date,
                                shiftIddecrip : this.shiftOption.find(item => item.id == value.payload.shiftId)?.description || "",
                                shiftId : value.payload.shiftId,
                                dateTimeFrom : value.payload.dateTimeFrom,
                                dateTimeTo : value.payload.dateTimeTo,
                                reasonId : value.payload.reasonId,
                                reasonIddescrip : this.official.find(item => item.id == value.payload.shiftId)?.description || "",
                                uploadPath : value.payload.uploadPath,
                                unpaidBreakId : value.payload.unpaidBreakId,
                                employeeId : value.payload.employeeId
                            })
                            this.UHTable.renderRows()
                        }
                        else {
                            console.log(value.stackTrace)
                            console.log(value.message)
                        }
                    },
                    error: (e) => {
                        console.error(e)
                    }
                });
            }
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

    addUH(){
        if (this.editing) {

                this.editing = false
                this.datasource[this.index]. date = this.unpaidForm.value.date,
                this.datasource[this.index]. shiftId = this.unpaidForm.value.shiftId,
                this.datasource[this.index]. shiftIddecrip = this.shiftOption.find(item=>item.id==this.unpaidForm.value.shiftId).description,
                this.datasource[this.index]. dateTimeFrom = this.unpaidForm.value.dateTimeFrom,
                this.datasource[this.index]. dateTimeTo = this.unpaidForm.value.dateTimeTo,
                this.datasource[this.index]. reasonId = this.unpaidForm.value.reasonId,
                this.datasource[this.index]. reasonIddescrip = this.official.find(item=>item.id==this.unpaidForm.value.reasonId).description,
                this.datasource[this.index]. uploadPath = this.unpaidForm.value.uploadPath
                this.datasource[this.index].employeeId = 1

            }else{
                this.datasource.push({
                    date: this.unpaidForm.value.date,
                    shiftId: this.unpaidForm.value.shiftId,
                    shiftIddecrip: this.shiftOption.find(item=>item.id==this.unpaidForm.value.shiftId).description,
                    dateTimeFrom: this.unpaidForm.value.dateTimeFrom,
                    dateTimeTo: this.unpaidForm.value.dateTimeTo,
                    reasonId: this.unpaidForm.value.reasonId,
                    reasonIddescrip: this.official.find(item=>item.id==this.unpaidForm.value.reasonId).description,
                    uploadPath: this.unpaidForm.value.uploadPath,
                    employeeId : 1
                });
            }
        this.UHTable.renderRows();
        this.unpaidForm.reset()
    }

    uhDelete(index): void {
        this.datasource.splice(index, 1);
        this.UHTable.renderRows();
    }


    public async submit(e) {

        //    var shiftId = e.map(x=>x.shift.id)
        // e.forEach(o => {
        //     o["shiftId"] = o.shiftId.id
        // });
        // console.log(e)
        var tid = sessionStorage.getItem('u')

        var cancelsave =  await this.coreService.required(tid,e,'64',0)
        if (cancelsave) {
            return
        }

        const dialogRef = this.message.open(SaveMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.filingService.postUnpaidBreak(e,tid,this.late).subscribe({

                    next: (value: any) => {
                         //   Error lock cannot file ==============================
                        this.coreService.valid(value, this.late, e.length,true,['/detail/filing-view'],"").then((res)=>{
                        if (res.saveNow) {
                            this.late = res.lateSave
                            this.submit(e)
                        }
                    })
                    },
                    error: (e) => {
                        this.isSave = false
                        this.message.open(FailedMessage);
                        console.error(e)
                    }
                });
            }
        });


    }

    edit(e,i){

        this.index = i
        // this.officialBForm.get('date').setValue(e.date)
        this.unpaidForm.get('date').setValue(new Date(e.date))
        this.unpaidForm.get('shiftId').setValue(e.shiftId)
        this.unpaidForm.get('dateTimeFrom').setValue(new Date(e.dateTimeFrom))
        this.unpaidForm.get('dateTimeTo').setValue(new Date(e.dateTimeTo))
        this.unpaidForm.get('reasonId').setValue(e.reasonId)
        this.unpaidForm.get('uploadPath').setValue(e.uploadPath)

        this.editing = true
    }
}
