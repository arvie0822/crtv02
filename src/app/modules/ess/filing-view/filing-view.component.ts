import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { PayrollHeader } from 'app/model/administration/payroll-category';
import { TableRequest } from 'app/model/datatable.model';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { CoreService } from 'app/services/coreService/coreService.service';
import { forkJoin } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';
import { FilingService } from 'app/services/filingService/filing.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DatePipe } from '@angular/common';
import { myData } from 'app/model/app.moduleId';
// import { AuthService2 } from "../../../services/authService/auth.service";

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS,} from '@angular-material-components/datetime-picker';
import { forEach } from 'lodash';
import { GF } from 'app/shared/global-functions';


// =================== For date time picker ============================
export const MOMENT_DATETIME_WITH_SECONDS_FORMAT = 'MM-DD-YY hh:mm A';
const CUSTOM_MOMENT_FORMATS: NgxMatDateFormats = {
    parse: {
        dateInput: MOMENT_DATETIME_WITH_SECONDS_FORMAT,
    },
    display: {
        dateInput: MOMENT_DATETIME_WITH_SECONDS_FORMAT,
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: MOMENT_DATETIME_WITH_SECONDS_FORMAT,
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


// =================== For date picker ============================
const DATE_FORMAT = 'MM-DD-yyyy';
export const MY_FORMATS = {
    parse: {
        dateInput: DATE_FORMAT,
    },
    display: {
        dateInput: DATE_FORMAT,
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: DATE_FORMAT,
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


const applications: any[] = [];
export interface PeriodicElement {
    Code: string;
    Date_from: string;
    Date_to: string;
    Shift_code : string;
    Hours : string;
    Reason: string;
    Status: string;
    Approval: string;
    Approval_date: string;
    Requested_by: string;
    Requested_date: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
    // { Code: "VL", Date_from: "sample", Date_to: "sample",Shift_code:"", Reason: "sample", Status: "sample", Approval: "sample", Approval_date: "sample", Requested_by: "sample", Requested_date: "sample" },
    // { Code: "Test Post", Date_from: "sample", Date_to: "sample", Reason: "sample", Status: "sample", Approval: "sample", Approval_date: "sample", Requested_by: "sample", Requested_date: "sample" },
    // { Code: "sample", Date_from: "sample", Date_to: "sample", Reason: "sample", Status: "sample", Approval: "sample", Approval_date: "sample", Requested_by: "sample", Requested_date: "sample" },
    // { Code: "sample", Date_from: "sample", Date_to: "sample", Reason: "sample", Status: "sample", Approval: "sample", Approval_date: "sample", Requested_by: "sample", Requested_date: "sample" },
    // { Code: "sample", Date_from: "sample", Date_to: "sample", Reason: "sample", Status: "sample", Approval: "sample", Approval_date: "sample", Requested_by: "sample", Requested_date: "sample" },
]
@Component({
    selector: 'app-filing-view',
    templateUrl: './filing-view.component.html',
    styleUrls: ['./filing-view.component.css'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        // ============= For date picker =============
        {
            provide: MAT_DATE_FORMATS,
            useValue: MY_FORMATS,
        },
        // ============= For date time picker =============
        {
            provide: NGX_MAT_DATE_FORMATS,
            useValue: CUSTOM_MOMENT_FORMATS,
        },

    ],
})
export class FilingViewComponent implements OnInit {
    @ViewChild(MatTable) matTable: MatTable<any>;
    dataSource = new MatTableDataSource<any>(applications);
    dateFrom: Date = new Date()
    dateTo: Date = new Date()
    // datasource: []
    isLoadingResults: boolean = true;
    totalRows: number = 0
    request = new TableRequest()
    dropdownOptions = new DropdownOptions
    filingrequest = new DropdownRequest
    dropdownRequestsub = new DropdownRequest
    displayedColumns: string[] = ['action', 'Code', 'Date_from', 'Date_to', 'Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
    // displayedColumns: string[] = ['action', 'Code', 'Date_from', 'Date_to','Shift_code', 'Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
    // displayedColumnsleave: string[] = ['action', 'Code', 'Date_from', 'Date_to','Leave_Type','Paid','halfday','Leave_hour','Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
    // displayedColumnsovertime: string[] = ['action', 'Code', 'Date_from', 'Date_to','Shift_Code','Type','Timing','Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
    moduleid: string = ""
    id: string = ""
    sample: string = ""
    table: any = []
    url: string = ""
    isSave: boolean = false
    pipe = new DatePipe('en-US');
    disabledbutton: boolean = false
    successMessage = {...SuccessMessage}
    globalmoduleId: boolean
    tid : any
    prevModule = ""
    myForm = new FormGroup({
        employeeId : new FormControl(null),
        filingTypes: new FormControl(null),
        dateFrom: new FormControl(null),
        dateTo: new FormControl(null),
    });
    loginId : number
    late : boolean = false
    saveMessage = {...SaveMessage}
    failedMessage = {...FailedMessage}
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(

        private router: Router,
        private coreService: CoreService,
        private route: ActivatedRoute,
        private http: HttpClient,
        public auth: AuthService,
        private message: FuseConfirmationService,
        private filingService: FilingService,
    ) {

        this.request = new TableRequest()
        this.request.Length = 20
        this.table = []
    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        // this.try()
        this.myForm.reset
        sessionStorage.setItem("action", "")
        this.initData()
        this.loadData(true)

        this.globalmoduleId = sessionStorage.getItem('moduleId') == '68' ? true : false;

        // this.id = this.route.snapshot.paramMap.get('id');

        var id = [sessionStorage.getItem("u")]
        this.coreService.encrypt_decrypt(false,id)
        .subscribe({
          next: (value: any) => {

            this.loginId = Number(value.payload[0])
          },
          error: (e) => {
            console.error(e)
          },
          complete: () => {
          }
        });
    }

    get currentModule() {
        var filinglist =  GF.IsEqual(sessionStorage.getItem('moduleId'),['68']) //sessionStorage.getItem('moduleId') == '41' ? true : false;
        if (!GF.IsEqual(this.prevModule,[sessionStorage.getItem('moduleId')])) {
            this.prevModule = sessionStorage.getItem('moduleId')
        }
        return filinglist;
    }

    handleSortEvent(e): void {
        // this.paginator.pageIndex = 0
        this.request.Start = 0
        this.request.Order = e.active
        this.request.OrderBy = e.direction
        this.loadData(false)
    }

    async search() {
        var tid = sessionStorage.getItem('u')

        if (this.myForm.value.filingTypes == 32) {
            this.displayedColumns = ['action', 'Code', 'Date_from', 'Date_to', 'Shift_code', 'Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
        } else if (this.myForm.value.filingTypes == 37) {
            this.displayedColumns = ['action', 'Code', 'Date_from', 'Date_to', 'Hours', 'Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
        } else if (this.myForm.value.filingTypes == 34) {
            this.displayedColumns = ['action', 'Code', 'Date_from', 'Date_to', 'leaveType','leaveFilingType','halfDayOption','paid', 'Shift_code', 'Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
        } else if(this.myForm.value.filingTypes == 114){
            this.displayedColumns = ['action', 'Code', 'Date', 'Locationfrom','LocationTo', 'Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
        }else {
            this.displayedColumns = ['action', 'Code', 'Date_from', 'Date_to', 'Reason', 'Status', 'Approval', 'Approval_date', 'Requested_by', 'Requested_date'];
        }

        this.request.SearchColumn = []

        if ( sessionStorage.getItem('moduleId') == '68') {
            var empid = this.myForm.value.employeeId
            var employees =  this.dropdownOptions.employeedef.filter(item=>empid.includes(item.dropdownID))
            var id = employees.map( x => x.encryptID)

            const value = await new Promise((resolve, reject) => {
                this.coreService.encrypt_decrypt(false, id).subscribe({
                    next: (data: any) => resolve(data),
                    error: (e) => reject(e)
                });
            });

            value['payload'].forEach(i => {
                this.request.SearchColumn.push({
                    "key": "employeeId",
                    "value": i + "",
                    "type": 2
                })
            });

        }else{

            // this.tid = sessionStorage.getItem('u')
            this.request.SearchColumn.push({
                "key": "employeeId",
                "value": this.loginId.toString(),
                "type": 2
            })

        }

        this.request.SearchColumn.push({
            "key": "moduleId",
            "value": this.myForm.value.filingTypes.toString(),
            "type": 2
        })

        this.request.SearchColumn.push({
            "key": "dateFrom",
            "value": this.pipe.transform(this.myForm.value.dateFrom, 'yyyy-MM-dd '),
            "type": 4
        })

        this.request.SearchColumn.push({
            "key": "dateTo",
            "value": this.pipe.transform(this.myForm.value.dateTo, 'yyyy-MM-dd'),
            "type": 5
        })


        this.loadData(true)

        //    if (this.myForm.value.filingTypes == 34) {
        //      this.displayedColumns = this.displayedColumnsleave
        //    }
        //    else if (this.myForm.value.filingTypes == 36) {
        //     this.displayedColumns = this.displayedColumnsovertime
        //   }

    }

    loadData(load): void {

        var eid = sessionStorage.getItem('u')
        // var mid = this.dropdownOptions.filingdef.find(item => item.dropdownID == this.myForm.value.filingTypes).encryptID

        // this.setParams(load)
        this.isLoadingResults = true;
        // this.request["TransactionIds"]=[]

        this.filingService.getFilingTable(this.request).subscribe(data => {

            if (data.statusCode == 200) {
                this.totalRows = data.payload.totalRows
                this.dataSource.data = data.payload.data
                // this.dataSource.paginator = this.paginator;
                this.matTable.renderRows();
                this.isLoadingResults = false;
            }
            else {
                console.log(data.stackTrace)
                console.log(data.message)
                this.isLoadingResults = false;
            }


        },
            (error: HttpErrorResponse) => {
                console.log(error.error);
                this.isLoadingResults = false;
            });
    }

    setParams(load) {
        if (!load) {
            this.request.SearchColumn = []
            this.table.filter.filter(item => item.value !== "" && item.value !== 0)
                .forEach(ee => {

                    if (ee.multiselect) {
                        this.request.SearchColumn = this.request.SearchColumn.filter(item => item.key !== ee.id);
                        ee.value.forEach(v => {
                            this.request.SearchColumn.push({
                                "key": ee.id,
                                "value": "" + v,
                                "type": 2
                            })
                        });
                    } else {
                        var ty = 0
                        if (ee.type == "select" || ee.type == "custom") {
                            ty = 1
                        }
                        this.request.SearchColumn = this.request.SearchColumn.filter(item => item.key !== ee.id);
                        this.request.SearchColumn.push({
                            "key": ee.id,
                            "value": "" + ee.value,
                            "type": ty
                        })
                    }
                });
        }
    }

    // try() {
    //     var eid = sessionStorage.getItem('u')
    //     var mid = this.dropdownOptions.filingdef.find(item => item.dropdownID == this.myForm.value.filingTypes).encryptID

    //     this.filingService.getFilingTable(this.request, eid, mid).subscribe({
    //         next: (value: any) => {
    //             if (value.statusCode == 200) {
    //                 this.totalRows = value.payload.totalRows
    //                 this.dataSource = value.payload.data
    //                 // this.dataSource.paginator = this.paginator;
    //                 this.matTable.renderRows();
    //                 this.isLoadingResults = false;

    //             }
    //         },
    //         error: (e) => {
    //             console.error(e)
    //         },
    //         complete: () => {
    //             this.setParams(true)
    //         }
    //     })
    // }


    handlePageEvent(e) {
        this.request.Start = e.pageIndex
        this.request.Length = e.pageSize
        this.search()
     }

    validation(){
        if (this.myForm.value.employeeId !== null) {
            this.initData()
        }

    }

    initData() {
        if (sessionStorage.getItem('moduleId') == '68') {
            if (this.myForm.value.employeeId == null) {
                this.tid = ""
            }else{
                var empid = this.myForm.value.employeeId
                var employees = this.dropdownOptions.employeedef.find(item => empid.includes(item.dropdownID))
                this.tid = employees.encryptID
            }

        }else{
            this.tid = sessionStorage.getItem("u")
        }
        var request = {
            moduleId: 0,
            subModuleId: 0,
            dateFrom: new Date(),
            dateTo: new Date(),
            overtimeTiming: 0,
            shiftId: 0,
            leaveFilingType: 0,
            targetId : this.tid
        }

        if (sessionStorage.getItem('moduleId') == '68') {
            forkJoin({
                employee : this.coreService.getCoreDropdown(1035, this.dropdownRequestsub),
                filing : this.coreService.getCoreDropdown(1028, this.filingrequest),
                validationtype: this.filingService.getFilingValidationOnUI(request),

            })

            .subscribe({
                next: (response) => {

                    // custom
                    this.dropdownOptions.employeedef = response.employee.payload
                    this.dropdownOptions.filingdef = response.filing.payload.filter(x => response.validationtype.payload.modules.includes(x.dropdownID))
                    this.moduleid = response.filing.payload[0].encryptID
                },

                error: (e) => {
                    console.error(e)
                },
                complete: () => {

                },

            });

        }else{
            forkJoin({

                filing : this.coreService.getCoreDropdown(1028, this.filingrequest),
                validationtype: this.filingService.getFilingValidationOnUI(request),
                // employee : this.coreService.getCoreDropdown(1035, this.dropdownRequestsub)

            })

            .subscribe({
                next: (response) => {
                    // custom
                    this.dropdownOptions.filingdef = response.filing.payload.filter(x => response.validationtype.payload.modules.includes(x.dropdownID))
                    this.moduleid = response.filing.payload[0].encryptID
                },

                error: (e) => {
                    console.error(e)
                },
                complete: () => {

                },

            });
        }
    }

    // search() {

    //     // this.id = this.route.snapshot.paramMap.get('id');
    //     // var eid = sessionStorage.getItem('u')
    //     // var mid = this.dropdownOptions.filingdef.find(item => item.dropdownID == this.myForm.value.filingTypes).encryptID
    //     // let params = new HttpParams();
    //     // params = params.append('eid', eid);
    //     // params = params.append('mid', mid);

    //     // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    //     // this.http.get('/api/filing/getFilingModulesDropdown', { headers: headers, params: params })
    //     // var need = {

    //     // }

    //     // this.id
    //     // this.sample

    // }

    loadroute() {

    }

    handleClickEvent(a, e): void {
        // if(this.table.type == "employee-schedule"){
        //     this.router.navigate([this.table.link.uri, e.encryptId, e.processType]);
        // }
        sessionStorage.setItem("action", a)
        sessionStorage.setItem("adds", this.myForm.value.filingTypes)

        if (a == "view") {
            this.router.navigate(['/detail/filing/', e.encryptId]);
            this.coreService.globaldatastate(e.employeeId)
            this.coreService.updateIdleState(e.shiftCode)
        }

        this.router.navigate(['/detail/filing/', e.encryptId]);




    }
    // handleClickEventview(a, e): void {
    //     // if(this.table.type == "employee-schedule"){
    //     //     this.router.navigate([this.table.link.uri, e.encryptId, e.processType]);
    //     // }
    //     sessionStorage.setItem("action", a)
    //     sessionStorage.setItem("adds", this.myForm.value.filingTypes)
    //     this.router.navigate(['/detail/filing/', e.encryptId]);

    //     // myData.view =

    // }

    handleCreateEvent(): void {
        sessionStorage.setItem("adds", "")
         sessionStorage.getItem('moduleId')
        this.router.navigate(['/detail/filing']);

    }

    cancel(e): void {
        // cancelChangeSchedule
        var mid = this.dropdownOptions.filingdef.find(item => item.dropdownID == this.myForm.value.filingTypes).encryptID


        // SaveMessage.message = "Are you sure you want to Cancel"
        var dialogRef = this.message.open(SaveMessage);


        dialogRef.afterClosed().subscribe((result) => {

          if (result == "confirmed") {
                var type = this.myForm.value.filingTypes
                // var uri = type === 32 ? "postCancelFiling" : type === 33 ? "postCancelFiling" : type === 34 ? "postCancelFiling": type === 35 ? "postCancelFiling":type === 36 ? "postCancelFiling":type === 37 ? "postCancelFiling":type === 52 ? "postCancelFiling":type === 64 ? "postCancelFiling": ""
                this.filingService.postCancelFiling(mid, e, this.late).subscribe({

                    next: (value: any) => {
                        this.coreService.valid(value, this.late, 1,false,"","cancellation").then((res)=>{
                            if (res.saveNow) {
                                this.late = res.lateSave
                                this.cancel(e)
                                return
                            }

                            if (res.reset) {
                                this.late = false
                                this.search()
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
        }
        );
    }

    handleClicdownload(id,empid){
        this.coreService.directDownloadBoldRTemplate("COE v2",'',"pdf","{'EncryptedCOEID':['"+id+"']}", null,false,"")
    }

}
