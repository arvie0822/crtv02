import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TableRequest } from 'app/model/datatable.model';
import { DropdownOptions, DropdownRequest, SearchHierarchy } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { FilingService } from 'app/services/filingService/filing.service';
import { GF } from 'app/shared/global-functions';

@Component({
    selector: 'app-pre-approve-list',
    templateUrl: './pre-approve-list.component.html',
    styleUrls: ['./pre-approve-list.component.css']
})
export class PreApproveListComponent implements OnInit {
    dropdownOptions = new DropdownOptions
    dataSource = [];
    request = new TableRequest()
    totalRows: number = 0
    dropdownRequestsub = new DropdownRequest
    resultHierarchy = new SearchHierarchy;
    field_count = 0
    pipe = new DatePipe('en-US');
    defaultTag = [{ id: [0], type: -4 }]
    prevModule = ""
    late : boolean = false
    isSave : boolean = false
    displayedColumns: string[] = ['action', 'Code','Time','Date_from', 'Date_to', 'Reason','status', 'Requested_by', 'Requested_date'];
    constructor(private router: Router, private filingService: FilingService, private coreService: CoreService,
        private message: FuseConfirmationService,
        ) { }

    myForm = new FormGroup({
        employeeId: new FormControl(null),
        filingTypes: new FormControl(null),
        dateFrom: new FormControl(null),
        dateTo: new FormControl(null),
    });

    ngOnInit() {
        this.initData()
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

    handleSortEvent(e) { }

    handleCreateEvent(): void {
        sessionStorage.setItem("adds", "")
        sessionStorage.getItem('moduleId')
        this.router.navigate(['/detail/pre-approve-ot/']);

    }

    async search() {

        this.request.SearchColumn = []
        this.request.Length = 0

        var empid = this.myForm.value.employeeId
        var employees = this.dropdownOptions.employeedef.filter(item => empid.includes(item.dropdownID))
        var id = employees.map(x => x.encryptID)

        empid.forEach(i => {
            this.request.SearchColumn.push({
                "key": "employeeId",
                "value": i + "",
                "type": 2
            })
        });

        this.request.SearchColumn.push({
            "key": "moduleId",
            "value": '99',
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

    }

    loadData(load): void {

        this.filingService.getFilingTable(this.request).subscribe(data => {

            if (data.statusCode == 200) {
                this.totalRows = data.payload.totalRows
                this.dataSource = data.payload.data.map(x => ({
                    Code : x.code,
                    Time : x.isDuration == false ? "Duration" : "Range" ,
                    Date_from : x.dateFrom ,
                    Date_to : x.dateTo ,
                    leaveType : x.leaveType ,
                    Shift_code : x.shiftCode,
                    Hours : x.offsetHours ,
                    Reason : x.reason ,
                    status : x.status ,
                    Requested_by : x.requestedBy,
                    Requested_date : x.requestDate,
                    encryptId : x.encryptId
                })
                )
            }
            else {
                console.log(data.stackTrace)
                console.log(data.message)
            }
        },
            (error: HttpErrorResponse) => {
                console.log(error.error);
            });
    }

    initData() {


        this.coreService.getCoreDropdown(1035, this.dropdownRequestsub)



            .subscribe({
                next: (response) => {
                    // custom
                    this.dropdownOptions.employeedef = response.payload

                },

                error: (e) => {
                    console.error(e)
                },
                complete: () => {

                },

            });
    }

    handleClickEvent(a,e) {
        sessionStorage.setItem("action", a)
        this.router.navigate(['/detail/pre-approve-ot/',e.encryptId]);
    }

    handlePageEvent(e){}

    cancel(e): void {
        // cancelChangeSchedule
        var mid = "2NW9BIGRy4HSEQl7q73gRA%3d%3d"

        // SaveMessage.message = "Are you sure you want to Cancel"
        var dialogRef = this.message.open(SaveMessage);


        dialogRef.afterClosed().subscribe((result) => {

          if (result == "confirmed") {
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
}
