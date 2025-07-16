import { NGX_MAT_DATE_FORMATS, NgxMatDateFormats } from '@angular-material-components/datetime-picker';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ThemePalette } from '@angular/material/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TableRequest } from 'app/model/datatable.model';
import { DropdownOptions, DropdownRequest, SearchHierarchy } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { FilingService } from 'app/services/filingService/filing.service';
import { MasterService } from 'app/services/masterService/master.service';
import { GF } from 'app/shared/global-functions';
import _ from 'lodash';
import moment from 'moment';
import { forkJoin } from 'rxjs';


// =================== For date time picker ============================
// export const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
//     parse: {
//         dateInput: 'MM-DD-yyyy',
//     },
//     display: {
//         dateInput: 'MM-DD-yyyy', // Your desired display format
//         monthYearLabel: 'MMM YYYY',
//         dateA11yLabel: 'MMMM Do YYYY',
//         monthYearA11yLabel: 'MMMM YYYY',
//     },
// };


// =================== For date picker ============================
// const DATE_FORMAT = 'MM-DD-yyyy';
// export const MY_FORMATS = {
//     parse: {
//         dateInput: DATE_FORMAT,
//     },
//     display: {
//         dateInput: DATE_FORMAT,
//         monthYearLabel: 'MMM YYYY',
//         dateA11yLabel: DATE_FORMAT,
//         monthYearA11yLabel: 'MMMM YYYY',
//     },
// };

@Component({
    selector: 'app-pre-approve-ot',
    templateUrl: './pre-approve-ot.component.html',
    styleUrls: ['./pre-approve-ot.component.css'],
    //   template: `
    //         <ngx-mat-datetime-picker [formats]="customFormats"></ngx-mat-datetime-picker>
    //     `,
    //   providers: [
    //     {
    //         provide: MAT_DATE_FORMATS,
    //         useValue: CUSTOM_DATE_FORMATS,
    //     },
    // ],
    //   providers: [
    //     {
    //         provide: DateAdapter,
    //         useClass: MomentDateAdapter,
    //         deps: [MAT_DATE_LOCALE],
    //     },
    //     // ============= For date picker =============
    //     {
    //         useClass: MomentDateAdapter,
    //         provide: MAT_DATE_FORMATS,
    //         useValue: MY_FORMATS,
    //         deps: [MAT_DATE_LOCALE],

    //     },
    //     // ============= For date time picker =============
    //     {
    //         useClass: MomentDateAdapter,
    //         provide: NGX_MAT_DATE_FORMATS,
    //         useValue: CUSTOM_MOMENT_FORMATS,
    //         deps: [MAT_DATE_LOCALE],

    //     },

    // ],
})
export class PreApproveOtComponent implements OnInit {
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public hideTime = false;
    public color: ThemePalette = 'primary';
    resultHierarchy = new SearchHierarchy;
    isSave: boolean = false
    field_count = 0
    dataSource = [];
    dataSource2 = [];
    displayedColumns: string[] = ['action', 'date', 'emp_code', 'emp_name', 'shift', 'type', 'ot_type', 'duration', 'reason'];
    displayedColumnsrange: string[] = ['action', 'date', 'emp_code', 'emp_name', 'shift', 'type', 'ot_type', 'ot_start', 'ot_end', 'reason'];
    isLoadingResults: boolean = true;
    totalRows: number = 0
    request = new TableRequest()
    actionviewdisabled: boolean = false
    validationrequest : any
    dropdownOptions = new DropdownOptions
    dropdownFixRequest = new DropdownRequest
    dropdownRequest = new DropdownRequest
    dropdownRequestsub = new DropdownRequest
    by_range: number
    pipe = new DatePipe('en-US');
    preform: FormGroup
    mid: any
    tid: any
    failedMessage = { ...FailedMessage }
    overtimeTimingDef = []
    overtimeTimingDefdescription = []
    overtimeTypeDef = []
    datatabledate: any
    hidetable: boolean = false
    hidetablerange: boolean = false
    disableduration: boolean = false
    id: string
    disabledfield : boolean = false
    adddisabledfield : boolean = false
    shiftin: any
    shiftout: any
    action: string = ""
    disabledbutton : boolean = false
    @ViewChild('durationtable') durationtable: MatTable<any>;
    @ViewChild('range') range: MatTable<any>;
    defaultTag = [{ id: [0], type: -4 }]
    prevModule = ""
    constructor(private filingService: FilingService, private route: ActivatedRoute, private masterService: MasterService, private message: FuseConfirmationService, private router: Router,private coreService : CoreService) {
        this.preform = new FormGroup({
            datefrom: new FormControl(''), // Initial value is an empty string
            dateto: new FormControl(''),
            time: new FormControl(''),
            employeeId: new FormControl(''),
        });
    }

    ngOnInit() {
        this.adddisabledfield = true
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id !== "") {
            this.action = sessionStorage.getItem("action")
            this.filingService.getPreApprovedOT(this.id).subscribe({

                next: (value: any) => {
                    if (value.statusCode == 200) {
                            if (this.action == 'edit') {
                                // value.payload.forEach(element => {

                                // });
                            }else if(this.action == 'view'){
                                this.disabledfield = true
                                this.adddisabledfield = false

                                this.dropdownFixRequest.id.push(
                                    { dropdownID: 0, dropdownTypeID: 52 },
                                    { dropdownID: 0, dropdownTypeID: 70 }
                                )
                                forkJoin({
                                    fix: this.masterService.getDropdownFix(this.dropdownFixRequest),

                                })
                                .subscribe({
                                    next: (response) => {
                                       debugger
                                        this.overtimeTimingDef = response.fix.payload
                                        this.overtimeTypeDef = response.fix.payload
                                        // for description
                                        this.overtimeTimingDefdescription = response.fix.payload
                                    },
                                    error: (e) => {
                                        console.error(e)
                                    },
                                    complete: () => {
                                    },
                                });
                            }

                        if (value.payload.isDuration == false) {
                            this.preform.get('time').setValue(false)
                            this.disableduration = true

                            this.dataSource.push({
                                action: [{ id: "" }],
                                employeeId: [{ id: value.payload.employeeId }],
                                date: [{ id: this.pipe.transform(value.payload.date, 'MM-dd-yyyy') }],
                                emp_code: [{ id: value.payload.employeeCode }],
                                emp_name: [{ id: value.payload.displayName }],
                                shift: [{ id: value.payload.shiftName }],
                                type: [{ id: value.payload.timingId }],
                                ot_type: [{ id: value.payload.overtimeTypeId }],
                                duration: [{ id: value.payload.duration }],
                                reason: [{ id: value.payload.reason }],
                                transactionId: [{ id: value.payload.overtimeId }],
                                isDuration: [{ id: value.payload.isDuration }],
                                shiftId: [{ id: value.payload.shiftId }],
                                approved: [{ id: value.payload.approved }],
                            })

                            this.hidetable = true
                            this.hidetablerange = false


                        } else {
                            this.preform.get('time').setValue(true)
                            this.disableduration = true
                            this.dataSource2.push({
                                action: [{ id: "" }],
                                employeeId: [{ id: value.payload.employeeId }],
                                date: [{ id: this.pipe.transform(value.payload.date, 'MM-dd-yyyy') }],
                                emp_code: [{ id: value.payload.employeeCode }],
                                emp_name: [{ id: value.payload.displayName }],
                                shift: [{ id: value.payload.shiftName }],
                                type : [{id : value.payload.timingId}],
                                ot_type: [{ id: value.payload.overtimeTypeId}],
                                reason: [{ id: value.payload.reason }],
                                ot_start: [{ id: value.payload.otStart }],
                                ot_end: [{ id: value.payload.otEnd }],
                                transactionId: [{ id: value.payload.overtimeId }],
                                isDuration: [{ id: value.payload.isDuration }],
                                shiftId: [{ id: value.payload.shiftId }],
                                approved: [{ id: value.payload.approved }],
                            })
                            this.hidetablerange = true
                            this.hidetable = false
                        }
                    }
                }
            })
        }

        this.dropdownFixRequest.id.push(
            { dropdownID: 0, dropdownTypeID: 52 },
            { dropdownID: 0, dropdownTypeID: 70 }
        )

        this.employeeinit(0)
    }

    get currentModule() {
        var mgmt = GF.IsEqual(sessionStorage.getItem('moduleId'), ['99'])
        this.defaultTag = mgmt ? [{ id: [0], type: -2 }, { id: [], type: -3 }, { id: [], type: -4 }] : []
        if (!GF.IsEqual(this.prevModule, [sessionStorage.getItem('moduleId')])) {
            this.prevModule = sessionStorage.getItem('moduleId')
            this.dataSource = []
        }
        return mgmt;
    }

    add(i) {

        if (this.preform.value.time == false) {

            this.dataSource[i].action.push({id: null})
            this.dataSource[i].date.push({id: this.dataSource[i].date[0].id})
            this.dataSource[i].emp_code.push({id:  this.dataSource[i].emp_code[0].id})
            this.dataSource[i].emp_name.push({id: this.dataSource[i].emp_name[0].id})
            this.dataSource[i].shift.push({id: this.dataSource[i].shift[0].id})
            this.dataSource[i].type.push({id: 0 ,disabled : false})
            this.dataSource[i].ot_type.push({id: 0 ,disabled : false})
            this.dataSource[i].duration.push({id: 0 ,disabled : false})
            this.dataSource[i].reason.push({id: "" ,disabled : false})
            this.dataSource[i].isDuration.push({id: this.preform.value.time })
            this.dataSource[i].transactionId.push({id: 0})
            this.dataSource[i].shiftId = this.dataSource[i].shiftId
            this.dataSource[i].approved.push({id: false})
            this.dataSource[i].employeeId = this.dataSource[i].employeeId[0].id
            // =========================

            this.durationtable.renderRows()

        } else {
            this.dataSource2[i].action.push({ id: null })
            this.dataSource2[i].date.push({ id: this.dataSource2[i].date[0].id })
            this.dataSource2[i].emp_code.push({ id: this.dataSource2[i].emp_code[0].id })
            this.dataSource2[i].emp_name.push({ id: this.dataSource2[i].emp_name[0].id })
            this.dataSource2[i].shift.push({ id: this.dataSource2[i].shift[0].id })
            this.dataSource2[i].type.push({ id: 0 })
            this.dataSource2[i].ot_type.push({ id: 0 })
            this.dataSource2[i].ot_start.push({ id: "" })
            this.dataSource2[i].ot_end.push({ id: "" })
            this.dataSource2[i].reason.push({ id: "" })
            this.dataSource2[i].employeeId = this.dataSource2[i].employeeId[0].id
            this.dataSource2[i].isDuration.push({ id: this.preform.value.time })
            this.dataSource2[i].transactionId.push({ id: 0 })
            this.dataSource2[i].shiftId =this.dataSource2[i].shiftId[i].id
            this.dataSource2[i].approved.push({id : false})
            // =========================
            this.range.renderRows()
        }
    }

    submit() {


        var e = this.preform.value.time == false ? this.dataSource : this.dataSource2
        var final = [];
        var fl = []
        e.forEach(ems => {
            var keys = Object.keys(ems);

            var maxLength = Math.max(...keys.map(key => Array.isArray(ems[key]) ? ems[key].length : 1));

            for (var i = 0; i < maxLength; i++) {

                // if (maxLength <= 0) {
                var obj = {};
                keys.forEach(key => {
                    if (Array.isArray(e[0][key])) {
                        obj[key] = key == "ot_start" || key == "ot_end" ? this.pipe.transform(ems[key][i].id, "yyyy-MM-ddTHH:mm:ss") : ems[key][i].id;
                    }
                    //   else if (Array.isArray(e[key])) {
                    //       on[key].forEach((dso, k) => {
                    //           ds[key] = key == "ot_start" || key == "ot_end" ? this.pipe.transform(dso.id, "yyyy-MM-ddTHH:mm:ss") : dso.id;
                    //           final[k] = final[k] || {};
                    //           final[k][key] = ds[key];
                    //       });

                    //   }
                    else {
                        obj[key] = key == "ot_start" || key == "ot_end" ? this.pipe.transform(ems[key], "yyyy-MM-ddTHH:mm:ss") : ems[key];
                    }
                });

                final.push(obj);
            }

        });


        if (this.preform.value.time == false) {
            this.datatabledate = final.map(x => ({
                action: x.action,
                employeeId: x.employeeId,
                date: x.date,
                emp_code: x.emp_code,
                emp_name: x.emp_name,
                shiftCode: x.shift,
                shiftId: x.shiftId,
                timingId: x.type,
                overtimeTypeId: x.ot_type,
                duration: x.duration,
                reason: x.reason,
                transactionId: x.transactionId,
                isDuration: this.preform.value.time,
                approved: x.approved
            }))
        } else if (this.preform.value.time == true) {
            this.datatabledate = final.map(x => ({

                action: x.action,
                employeeId: x.employeeId,
                date: x.date,
                emp_code: x.emp_code,
                emp_name: x.emp_name,
                shiftCode: x.shift,
                shiftId: x.shiftId,
                oTStart: x.ot_start,
                oTEnd: x.ot_end,
                timingId: x.type,
                overtimeTypeId: x.ot_type,
                reason: x.reason,
                transactionId: x.transactionId,
                isDuration: this.preform.value.time,
                approved: x.approved

            }))
        }

        var save = this.datatabledate.filter(x => x.approved == false && x.overtimeTypeId !==0)

        save.forEach(element => {
            element.date = this.pipe.transform(element.date, 'yyyy-MM-dd')
            // element.oTStart = this.pipe.transform(element.oTStart, 'yyyy-MM-ddTHH:mm')
            // element.oTEnd = this.pipe.transform(element.oTEnd, 'yyyy-MM-ddTHH:mm')
        });

        // var tid = sessionStorage.getItem('moduleId')

        const dialogRef = this.message.open(SaveMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.filingService.postPreApprovedOT(save).subscribe({

                    next: (value: any) => {
                        if (value.statusCode == 200) {

                            this.message.open(SuccessMessage);
                            this.isSave = false,
                                this.router.navigate(['/detail/pre-approve-list']);
                        }
                        else {
                            this.failedMessage.message = value.message
                            this.message.open(this.failedMessage);
                            console.log(value.stackTrace)
                            console.log(value.message)
                        }
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

    search() {

        this.preform.value.datefrom
        this.preform.value.dateto
        this.preform.value.time
        this.request.SearchColumn = []
        this.request.Order = "EmployeeCode"
        this.request.Length = 0
        // Length

        this.request.SearchColumn.push({

            "key": "DateFrom",
            "value": this.pipe.transform(this.preform.value.datefrom, "MM/dd/yyyy"),
            "type": 4
        })

        this.request.SearchColumn.push({

            "key": "DateTo",
            "value": this.pipe.transform(this.preform.value.dateto, "MM/dd/yyyy"),
            "type": 5
        })

        this.request.SearchColumn.push({

            "key": "isDuration",
            "value": this.preform.value.time + "",
            "type": 3
        })

        if (this.resultHierarchy.Search.length > 0) {
            this.resultHierarchy.Search.forEach(element => {
                if (Array.isArray(element.Value)) {
                    element.Value.forEach(val => {
                        this.request.SearchColumn.push({
                            "key": element.Key,
                            "value": val + "",
                            "type": element.Type
                        })
                    this.tid = val
                    this.employeeinit(val)

                    });
                } else {
                    this.request.SearchColumn.push({
                        "key": element.Key,
                        "value": element.Value + "",
                        "type": element.Type
                    })
                    this.tid = element.Value
                    this.employeeinit(element.Value)
                }
            });
        }

        this.loadData()
    }

    loadData(): void {

        this.validationrequest = {
            moduleId: 99,
            subModuleId: 0,
            dateFrom: new Date(),
            dateTo: new Date(),
            overtimeTiming: 0,
            shiftId: 0,
            leaveFilingType: 0,
            targetId: this.dropdownOptions.employeedef.find(x => x.dropdownID == this.tid).encryptID,
            date :  this.pipe.transform(new Date() , 'yyyy-MM-dd')
        }

        forkJoin({
            fix: this.masterService.getDropdownFix(this.dropdownFixRequest),
            validationtype: this.filingService.getFilingValidationOnUI(this.validationrequest),

        })

            .subscribe({
                next: (response) => {
                   debugger

                    this.overtimeTimingDef = response.fix.payload.filter(x => response.validationtype.payload.otTiming.includes(x.dropdownID))
                    this.overtimeTypeDef = response.fix.payload.filter(x => response.validationtype.payload.overtimeType.includes(x.dropdownID))

                    // for description

                    this.overtimeTimingDefdescription = response.fix.payload

                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                },

            });


        this.filingService.getPreApprovetOTTable(this.request).subscribe({
            next: (value: any) => {

                if (this.preform.value.time == false) {
                    this.dataSource = value.payload.data.map(x => ({

                        action: [{ id: x.action }],
                        employeeId: [{ id: x.employeeId }],
                        date: [{ id: x.date }],
                        emp_code: [{ id: x.employeeCode }],
                        emp_name: [{ id: x.displayName }],
                        shift: [{ id: x.shiftCode }],
                        type: [{ id: x.timingId ,disabled : x.approved }],
                        ot_type: [{ id: x.overtimeTypeId,disabled : x.approved }],
                        duration: [{ id: x.duration ,disabled : x.approved }],
                        reason: [{ id: x.reason ,disabled : x.approved}],
                        transactionId: [{ id: x.transactionId }],
                        isDuration: [{ id: this.preform.value.time }],
                        shiftId : x.shiftId,
                        approved : [{ id: x.approved }],
                    }))

                    this.hidetable = true
                    this.hidetablerange = false

                    // this.dataSource.forEach(ment => {
                    //     if (ment.approved[0].id == true) {
                    //         this.disabledfield = true
                    //     }else{
                    //         this.disabledfield = false
                    //     }
                    // });
                    // this.dataSource.push
                } else if (this.preform.value.time == true) {
                    this.dataSource2 = value.payload.data.map(x => ({

                        action: [{ id: x.action }],
                        employeeId: [{ id: x.employeeId }],
                        date: [{ id: x.date }],
                        emp_code: [{ id: x.employeeCode }],
                        emp_name: [{ id: x.displayName }],
                        shift: [{ id: x.shiftCode }],
                        type: [{ id: x.timingId ,disabled : x.approved}],
                        ot_type: [{ id: x.overtimeTypeId ,disabled : x.approved}],
                        reason: [{ id: x.reason,disabled : x.approved}],
                        ot_start: [{ id: x.startTime == "0001-01-01T00:00:00" ? this.pipe.transform(x.date, "yyyy-MM-dd HH:mm") : x.startTime,disabled : x.approved}],
                        ot_end: [{ id: x.endTime == "0001-01-01T00:00:00" ? this.pipe.transform(x.date, "yyyy-MM-dd HH:mm") : x.endTime,disabled : x.approved}],
                        transactionId: [{ id: x.transactionId }],
                        isDuration: [{ id: this.preform.value.time }],
                        shiftId : [{id: x.shiftId}],
                        approved : [{ id: x.approved }],


                    }))
                    this.hidetablerange = true
                    this.hidetable = false

                    // this.dataSource2.forEach(ment => {
                    //     if (ment.approved[0].id == true) {
                    //         this.disabledfield = true
                    //     }else{
                    //         this.disabledfield = false
                    //     }
                    // });

                    // this.dataSource2.push
                }

            }
        })
    }

    handlePageEvent(e): void {
        this.request.Start = e.pageIndex
        this.request.Length = e.pageSize
        // this.loadData()
    }

    initData() {


    }

    deleterow(i,x) {

        if (this.preform.value.time == false) {
            if (x !== 0) {
                this.dataSource[i].action.splice(x, 1)
                this.dataSource[i].date.splice(x, 1)
                this.dataSource[i].emp_code.splice(x, 1)
                this.dataSource[i].emp_name.splice(x, 1)
                this.dataSource[i].shift.splice(x, 1)
                this.dataSource[i].type.splice(x, 1)
                this.dataSource[i].ot_type.splice(x, 1)
                this.dataSource[i].duration.splice(x, 1)
                this.dataSource[i].reason.splice(x, 1)
                this.dataSource[i].transactionId.splice(x, 1)
                this.dataSource[i].isDuration.splice(x, 1)
                this.dataSource[i].approved.splice(x, 1)
                this.durationtable.renderRows()

            }else{
                this.dataSource.splice(i, 1)
                this.durationtable.renderRows()
            }
        } else {
            if (x !== 0) {
                this.dataSource2[i].action.splice(x, 1)
                this.dataSource2[i].date.splice(x, 1)
                this.dataSource2[i].emp_code.splice(x, 1)
                this.dataSource2[i].emp_name.splice(x, 1)
                this.dataSource2[i].shift.splice(x, 1)
                this.dataSource2[i].type.splice(x, 1)
                this.dataSource2[i].ot_type.splice(x, 1)
                this.dataSource2[i].ot_start.splice(x, 1)
                this.dataSource2[i].ot_end.splice(x, 1)
                this.dataSource2[i].reason.splice(x, 1)
                this.dataSource2[i].transactionId.splice(x, 1)
                this.dataSource2[i].isDuration.splice(x, 1)
                this.dataSource2[i].approved.splice(x, 1)
                this.range.renderRows()

            }else{
                this.dataSource2.splice(i, 1)
                this.range.renderRows()
            }
        }

    }

    date_min_max(e, x, isMin) {
        //parent
        var datemin = new Date(e.date[x].id + ' 00:00')
        var datemax = new Date(e.date[x].id + ' 23:59')

        //child
        var datemin = new Date(e.date[x].id + ' 00:00')
        var datemax = new Date(e.date[x].id + ' 23:59')

        //parent
        var min = new Date(datemin.setDate(datemin.getDate() - 1))
        var max = new Date(datemax.setDate(datemax.getDate() + 1))

        //child
        var min = new Date(datemin.setDate(datemin.getDate() - 1))
        var max = new Date(datemax.setDate(datemax.getDate() + 1))
        return isMin ? min : max

    }

    timevalidation(e, i, x, f) {
        if (f == 'ottype' && x == 0 &&  GF.IsEmpty(this.dataSource2[i].ot_start[x].id)) {
            // this.dataSource2[i].ot_start[x].id = this.pipe.transform(e.date[0].id , 'yyyy-MM-dd 00:00')
        }else if(f == 'ottype' && x !== 0){
            if (this.dataSource2[i].type[x].id == 12699 ) {
                // start time child
                if (x == 1) {
                    var starttiming = new Date(this.dataSource2[i].ot_end[i].id)
                    var plushours = new Date(starttiming.setHours(starttiming.getHours() + 1))
                    this.dataSource2[i].ot_start[x].id = plushours

                    // end time child
                    var endstarttime = new Date(this.dataSource2[i].ot_start[x].id)
                    var plusend = new Date(endstarttime.setHours(endstarttime.getHours() + 1))
                    this.dataSource2[i].ot_end[x].id = plusend
                }else if(x > 1){
                    var starttiming = new Date(this.dataSource2[i].ot_end[x-1].id)
                    var plushours = new Date(starttiming.setHours(starttiming.getHours() + 1))
                    this.dataSource2[i].ot_start[x].id = plushours

                    // end time child
                    var endstarttime = new Date(this.dataSource2[i].ot_start[x].id)
                    var plusend = new Date(endstarttime.setHours(endstarttime.getHours() + 1))
                    this.dataSource2[i].ot_end[x].id = plusend
                }
            }else if(this.dataSource2[i].type[x].id == 12698){
                // start time child
                var starttiming = new Date(this.dataSource2[i].ot_start[i].id)
                var plushours = new Date(starttiming.setHours(starttiming.getHours() - 1))
                this.dataSource2[i].ot_start[x].id = plushours

                // end time child
                var endstarttime = new Date(this.dataSource2[i].ot_start[x].id)
                var plusend = new Date(endstarttime.setHours(endstarttime.getHours() + 1))
                this.dataSource2[i].ot_end[x].id = plusend
            }
        }


        // shiftcode overlaping ++++++++++++++++++++++++++++++++
        // var shiftcode = e.shift[0].id
        if (e.shift[0].id == 'RD') {

        }else{
            var shiftsplit = e.shift[0].id.split("_");

            let timePerShiftCode: string[] = shiftsplit.map((shiftsplit) => {
                // Extract hours and minutes from the shift code
                let hours: number = parseInt(shiftsplit.slice(0, 2), 10);
                let minutes: number = parseInt(shiftsplit.slice(2, 4), 10);

                // Check if it's AM (A) or PM (P) and adjust hours accordingly
                if (shiftsplit[4] === 'P') {
                    if (hours < 12) {
                        hours += 12;
                    }
                } else if (shiftsplit[4] === 'A') {
                    if (hours === 12) {
                        shiftsplit = 0;
                    }
                }

                // Convert to time format
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            });
            this.shiftin = timePerShiftCode[0];
            this.shiftout = timePerShiftCode[1];
        }


        var shiftindate = new Date(this.pipe.transform(e.date[0].id , 'yyyy-MM-dd '+this.shiftin))
        var shiftoutdate = new Date(this.pipe.transform(e.date[0].id , 'yyyy-MM-dd '+this.shiftout))

        var starttime = new Date(this.pipe.transform(e.ot_start[x].id, 'yyyy-MM-dd HH:mm'))
        var endtime = new Date(this.pipe.transform(e.ot_end[x].id, 'yyyy-MM-dd HH:mm'))

        // shiftcode overlaping ++++++++++++++++++++++++++++++++
        var from = this.pipe.transform( this.dataSource2[i].ot_start[x].id, e.date[0].id + ' HH:mm')
        var to = this.pipe.transform( this.dataSource2[i].ot_end[x].id, e.date[0].id + ' HH:mm')

        // parent validation ===================
        if (f == 'datefrom' && x == 0) {
            var starttiming = new Date(this.dataSource2[i].ot_start[x].id)
            var plushours = new Date(starttiming.setHours(starttiming.getHours() + 1))
            this.dataSource2[i].ot_end[x].id = plushours

            if (starttime > shiftindate && starttime < shiftoutdate) {
                this.failedMessage.title = "Warning!"
                var timing = this.overtimeTimingDefdescription.find(name => name.dropdownID == this.dataSource2[i].ot_type[x].id).description
                this.failedMessage.message = "can't File " + timing + " between your shift "
                this.message.open(this.failedMessage);
                this.dataSource2[i].ot_start[x].id = ""
                this.dataSource2[i].ot_end[x].id = ""
            }
            else if (starttime < endtime || endtime > starttime) {
                this.failedMessage.title = "Warning"
                this.failedMessage.message = "datefrom cannot overlap in dateTo"
                this.message.open(this.failedMessage)
            }else if(starttime == endtime){
                this.dataSource2[i].ot_start[i].id = this.pipe.transform(e.date[0].id , 'yyyy-MM-dd 00:00')
                this.failedMessage.title = "Warning!"
                this.failedMessage.message = "invalid same date"
                this.message.open(this.failedMessage);
            }

            var tf = this.pipe.transform(this.dataSource2[i].ot_start[x].id, 'yyyy-MM-dd HH:mm')
            var tt = this.pipe.transform(this.dataSource2[i].ot_end[x].id, 'yyyy-MM-dd HH:mm')

            this.dataSource2.forEach(element => {
                element["ot_start"].forEach((ele,) => {
                    element["ot_end"].forEach((elem, ii) => {

                        if (ii == x) {

                        } else {

                            var dateF = this.pipe.transform(ele.id, 'yyyy-MM-dd HH:mm')
                            var dateT = this.pipe.transform(elem.id, 'yyyy-MM-dd HH:mm')
                            if (dateF == tf && dateT == tt) {
                                this.failedMessage.title = "Warning!"
                                this.failedMessage.message = "can't file OB at same date and time"
                                this.message.open(this.failedMessage);
                                return
                            } else if (tf < dateT) {
                                if (tf == dateF) {
                                    this.failedMessage.title = "Warning!"
                                    this.failedMessage.message = "can't file OB you have already schedule " + tf
                                    this.message.open(this.failedMessage);
                                    return
                                }
                                this.failedMessage.title = "Warning!"
                                this.failedMessage.message = "" + tf + "cannot be Greater than  to " + tt
                                this.message.open(this.failedMessage);
                                this.dataSource2[i].ot_start[x].id = this.pipe.transform(this.dataSource2[i].ot_start[x].id, 'yyyy-MM-dd 00:00')
                                return

                            } else if (tt == dateT) {
                                this.failedMessage.title = "Warning!"
                                this.failedMessage.message = "can't file OB you have already schedule " + tt
                                this.message.open(this.failedMessage);
                                return
                            }

                        }
                    })
                })
            })

        } else if (f == 'dateto' && x == 0) {
            if (endtime < starttime) {
                this.failedMessage.title = "Warning"
                this.failedMessage.message = "dateto cannot overlap in datefrom"
                var starttiming = new Date(this.dataSource2[i].ot_start[x].id)
                var plushours = new Date(starttiming.setHours(starttiming.getHours() + 1))
                this.dataSource2[i].ot_end[x].id = plushours
                this.message.open(this.failedMessage)
            }else if(starttime > shiftindate && endtime < shiftoutdate){
                this.failedMessage.title = "Warning!"
                this.failedMessage.message = "can't File " + this.overtimeTimingDefdescription.find(name => name.dropdownID == this.dataSource2[i].type[x].id).description + " between your shift "
                this.message.open(this.failedMessage);
            }else if(starttime == endtime){
                this.dataSource2[i].ot_end[i].id = this.pipe.transform(e.date[0].id , 'yyyy-MM-dd 00:00')
                this.failedMessage.title = "Warning!"
                this.failedMessage.message = "invalid same date"
                this.message.open(this.failedMessage);
            }
        }else if(f == 'datefrom' && x !== 0){
            var starttiming = new Date(this.dataSource2[i].ot_start[x].id)
            var plushours = new Date(starttiming.setHours(starttiming.getHours() + 1))
            this.dataSource2[i].ot_end[x].id = plushours

            var starttimechild = new Date(this.dataSource2[i].ot_start[x].id)
            var endtimechild = new Date(this.dataSource2[i].ot_end[x].id)

            var starttimeparent = new Date(this.dataSource2[i].ot_start[i].id)
            var endtimeparent = new Date(this.dataSource2[i].ot_end[i].id)

            if(f == 'datefrom' && x >= 0){
                this.dataSource2.forEach(element => {
                    element.ot_start.forEach(start => {
                            var starts = new Date(start.id)
                        element.ot_end.forEach(end => {
                            var ends = new Date(end.id)
                            if (starttimechild < ends &&  starttimechild > starts) {
                                this.failedMessage.title = "Warning"
                                this.failedMessage.message = "DateFrom cannot overlap to other schedule!!"
                                this.dataSource2[i].ot_start[x].id = ""
                                this.dataSource2[i].ot_end[x].id = ""
                                this.message.open(this.failedMessage)
                            }
                        });
                    });
                });
            }
            // this.dataSource2[i].ot_end[x].id = this.pipe.transform(e.date[0].id , 'yyyy-MM-dd 00:00')
        }else if(f == 'dateto' && x !== 0){
            var datechildfrom = this.pipe.transform(this.dataSource2[i].ot_start[x].id , 'yyyy-MM-dd HH:mm')
            var datechildto = this.pipe.transform(this.dataSource2[i].ot_end[x].id , 'yyyy-MM-dd HH:mm')
            var datefromchild = this.pipe.transform(this.dataSource2[i].ot_end[x].id , 'yyyy-MM-dd 00:00')

            var date = new Date(datefromchild)
            if (endtime < starttime) {
                this.failedMessage.title = "Warning"
                this.failedMessage.message = "dateto cannot overlap in datefrom"
                var starttiming = new Date(this.dataSource2[i].ot_start[x].id)
                var plushours = new Date(starttiming.setHours(starttiming.getHours() + 1))
                this.dataSource2[i].ot_end[x].id = plushours
                this.message.open(this.failedMessage)
            }else if (datechildfrom == datechildto) {
                this.failedMessage.title = "Warning!"
                this.failedMessage.message = "invalid same date"
                this.message.open(this.failedMessage);
                var datemoment = moment(this.pipe.transform(e.date[0].id , 'yyyy-MM-dd 00:00'))
                this.dataSource2[i].ot_end[x].id = datemoment
                return moment(datemoment)
            }
        }
    }

    // this validation is for overlaping and set the date from and date to to null and when click the toggle
    // they set the date autmatic like element.date
    copydate(a,e,i,x){
        if (a == 'start' && GF.IsEmpty(this.dataSource2[i].ot_start[x].id)) {
            var date = this.pipe.transform(e.date[0].id, 'yyyy-MM-dd 00:00')
            this.dataSource2[i].ot_start[x].id = date
        }else if(a == 'end' && GF.IsEmpty(this.dataSource2[i].ot_end[x].id)){
            var date = this.pipe.transform(e.date[0].id, 'yyyy-MM-dd 00:00')
            this.dataSource2[i].ot_end[x].id = date
        }
    }

    employeeinit(id){

        this.dropdownRequestsub.id.push(
            { dropdownID: id, dropdownTypeID: 0 },
        )
        forkJoin({
            empdrop : this.coreService.getCoreDropdown(1035, this.dropdownRequestsub),

        })

            .subscribe({
                next: (response) => {
                    this.dropdownOptions.employeedef = response.empdrop.payload
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                },

            });
    }

    validation(timing,el,x,i){
        debugger

        var dates = new Date(el.date[0].id)
        this.validationrequest = {
            date : new Date(dates.setDate(dates.getDate() + 1)),
            moduleId: 99,
            subModuleId: 0,
            dateFrom: new Date(),
            dateTo: new Date(),
            overtimeTiming: timing == 0 ? 0 : timing,
            shiftId: el.shiftId,
            leaveFilingType: 0,
            targetId: this.dropdownOptions.employeedef.find(x => x.dropdownID == this.tid).encryptID,
            isDuration : this.preform.value.time
        }

        forkJoin({
            validationtype: this.filingService.getFilingValidationOnUI(this.validationrequest),

        })

            .subscribe({
                next: (response) => {
                    var validation = response.validationtype.payload
                    if (this.preform.value.time) {
                        if (x > 0) {
                            if(validation.enableMultiPreShift == false && el.ot_type[i].id == el.ot_type[x].id){
                                this.failedMessage.message = "can't File multiple pre-Shift"
                                this.message.open(this.failedMessage);
                                this.dataSource2[i].ot_type[x].id = 0
                            }else if(validation.enableMultiPostShift == false && el.ot_type[i].id == el.ot_type[x].id){
                                this.failedMessage.message = "can't File multiple post-Shift"
                                this.message.open(this.failedMessage);
                                this.dataSource2[i].ot_type[x].id = 0
                            }else if(validation.enableMultiRDHD == false && el.ot_type[i].id == el.ot_type[x].id){
                                this.failedMessage.message = "can't File multiple RD/HD"
                                this.message.open(this.failedMessage);
                                this.dataSource2[i].ot_type[x].id = 0
                            }
                            // else  if(validation.isPreOTInvalid && el.ot_type[x].id == 12699){
                            //     this.failedMessage.message = "can't File Post-OT in Range"
                            //     this.message.open(this.failedMessage);
                            //     this.dataSource2[i].ot_type[x].id = 0
                            // }else  if(validation.isPreOTInvalid && el.ot_type[x].id == 12698){
                            //     this.failedMessage.message = "can't File Pre-OT in Range"
                            //     this.message.open(this.failedMessage);
                            //     this.dataSource2[i].ot_type[x].id = 0
                            // }
                        }else{
                            // if(validation.isPreOTInvalid && el.ot_type[i].id == 12699){
                            //     this.failedMessage.message = "can't File Post-OT in Range"
                            //     this.message.open(this.failedMessage);
                            //     this.dataSource2[i].ot_type[x].id = 0
                            // }else  if(validation.isPreOTInvalid && el.ot_type[i].id == 12698){
                            //     this.failedMessage.message = "can't File Pre-OT in Range"
                            //     this.message.open(this.failedMessage);
                            //     this.dataSource2[i].ot_type[x].id = 0
                            // }
                        }
                    }else{
                        if(x > 0){
                            if(validation.enableMultiPreShift == false && el.ot_type[i].id == el.ot_type[x].id){
                                this.failedMessage.message = "can't File multiple pre-Shift"
                                this.message.open(this.failedMessage);
                                this.dataSource[i].ot_type[x].id = 0
                            }else if(validation.enableMultiPostShift == false && el.ot_type[i].id == el.ot_type[x].id){
                                this.failedMessage.message = "can't File multiple post-Shift"
                                this.message.open(this.failedMessage);
                                this.dataSource[i].ot_type[x].id = 0
                            }else if(validation.enableMultiRDHD == false && el.ot_type[i].id == el.ot_type[x].id){
                                this.failedMessage.message = "can't File multiple RD/HD"
                                this.message.open(this.failedMessage);
                                this.dataSource[i].ot_type[x].id = 0
                            }
                            // else  if(validation.isPreOTInvalid && el.ot_type[x].id == 12699){
                            //     this.failedMessage.message = "can't File Post-OT in Duration"
                            //     this.message.open(this.failedMessage);
                            //     this.dataSource[i].ot_type[x].id = 0
                            // }else  if(validation.isPreOTInvalid && el.ot_type[x].id == 12698){
                            //     this.failedMessage.message = "can't File Pre-OT in Duration"
                            //     this.message.open(this.failedMessage);
                            //     this.dataSource[i].ot_type[x].id = 0
                            // }
                        }else{
                            // if(validation.isPreOTInvalid && el.ot_type[i].id == 12699){
                            //     this.failedMessage.message = "can't File Post-OT in Duration"
                            //     this.message.open(this.failedMessage);
                            //     this.dataSource[i].ot_type[x].id = 0
                            // }else  if(validation.isPreOTInvalid && el.ot_type[i].id == 12698){
                            //     this.failedMessage.message = "can't File Pre-OT in Duration"
                            //     this.message.open(this.failedMessage);
                            //     this.dataSource[i].ot_type[x].id = 0
                            // }

                        }
                    }
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                },

            });
    }

    cleartable(){
        if (this.preform.value.time) {
            this.hidetable = false
            this.dataSource = []
        }else {
            this.hidetablerange = false
            this.dataSource2 = []
        }
    }
}
