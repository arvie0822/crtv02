import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { TableRequest } from 'app/model/datatable.model';
import { DropdownID, DropdownOptions, DropdownRequest, SearchHierarchy } from 'app/model/dropdown.model';
import { EmployeeAttendance } from 'app/model/employee/employee-attendance';
import { AttendanceService } from 'app/services/attendanceService/attendance.service';
import { EmployeeAttendanceModalComponent } from './employee-attendance-modal/employee-attendance-modal.component';
import { CoreService } from 'app/services/coreService/coreService.service';
import { identifierName } from '@angular/compiler';


@Component({
    selector: 'app-employee-attendance',
    templateUrl: './employee-attendance.component.html',
    styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    resultHierarchy = new SearchHierarchy;
    pipe = new DatePipe('en-US');
    IsMissingLogs: boolean
    request = new TableRequest()
    attendanceForm: FormGroup
    displayedColumns: string[] = ['action', 'code', 'name', 'date', 'schedin', 'schedout', 'timein', 'timeout', 'hrswork', 'remarks'];
    dataSource = [];
    dialogRef: MatDialogRef<EmployeeAttendanceModalComponent, any>;
    field_count = 0
    isLoadingResults: boolean = true;
    totalRows: number = 0
    globalmoduleId: boolean
    dropdownOptions = new DropdownOptions
    dropdownRequestsub = new DropdownRequest
    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private attendanceService: AttendanceService,
        private coreService: CoreService,
    ) { }

    ngOnInit() {
        this.attendanceForm = this.fb.group(new EmployeeAttendance());
        this.initData()
        // this.globalmoduleId = sessionStorage.getItem('moduleId') == '41' ? true : false;

    }

    get currentModule() {
        return sessionStorage.getItem('moduleId') == '41' ? true : false;
    }
    modal(model,i) {

        var date = model.date
        var tmein = model.timeIn
        var out = model.timeOut
        var ids = model.encryptId

        this.attendanceService.getAttendanceLogs(date, ids).subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    if (this.dialogRef) {
                        this.dialogRef.close();
                    }
                    this.dialogRef = this.dialog.open(EmployeeAttendanceModalComponent, {
                        width: '70%',
                        panelClass: 'app-dialog',
                        data: {
                            values: value.payload,
                            date : model.date,
                            index : i,
                            in : tmein,
                            out : out,
                            datas : model
                        }

                    });
                }
                else {
                    console.log(value.stackTrace)
                    console.log(value.message)
                    this.isLoadingResults = false;
                }
            },
            error: (e) => {
                console.error(e)
                this.isLoadingResults = false;
            }
        });
    }

    Search(ex) {
        this.request.SearchColumn = []
        this.attendanceForm.markAllAsTouched();
        if (this.attendanceForm.valid) {
            this.request.SearchColumn.push({
                "key": "DateFrom",
                "value": this.pipe.transform(this.attendanceForm.value.dateFrom, 'yyyy-MM-ddT00:00:00'),
                "type": 4
            })

            this.request.SearchColumn.push({
                "key": "DateTo",
                "value": this.pipe.transform(this.attendanceForm.value.dateTo, 'yyyy-MM-ddT23:59:00'),
                "type": 5
            })

            this.request.SearchColumn.push({
                "key": "MissingLogs",
                "value": this.attendanceForm.value.missingLogs + "",
                "type": 3
            })

            if (sessionStorage.getItem('moduleId') == '41') {
                var id = this.attendanceForm.value.employeeId
                var empid = this.dropdownOptions.employeedef.filter(item => id.includes(item.dropdownID))
                var tid = empid.map(x => x.dropdownID)

                tid.forEach(element => {

                    this.request.SearchColumn.push({
                        "key": "EmployeeID",
                        "value": element.toString(),
                        "type": 2
                    })

                });

                this.loadData()

            } else {
                if (this.resultHierarchy.Search.length > 0) {
                    this.resultHierarchy.Search.forEach(element => {
                        if (Array.isArray(element.Value)) {
                            element.Value.forEach(val => {
                                this.request.SearchColumn.push({
                                    "key": element.Key,
                                    "value": val + "",
                                    "type": element.Type
                                })
                            });
                        } else {
                            this.request.SearchColumn.push({
                                "key": element.Key,
                                "value": element.Value + "",
                                "type": element.Type
                            })
                        }
                    });
                }
            }

            if (ex) {
                this.coreService.exportAll(this.request,'128','1')
            } else {
                this.loadData()
            }
        }
    }

    handlePageEvent(e): void {
        this.request.Start = e.pageIndex
        this.request.Length = e.pageSize
        this.loadData()
    }

    handleSortEvent(e): void {
        this.paginator.pageIndex = 0
        this.request.Start = 0
        this.request.Order = e.active
        this.request.OrderBy = e.direction
        this.loadData()
    }

    loadData(): void {
        this.request.Order = "EmployeeCode"
        this.isLoadingResults = true;
        this.attendanceService.getEmployeeAttendanceTable(this.request,this.currentModule).subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    console.log(value.payload.data)
                    this.dataSource = value.payload.data
                    this.totalRows = value.payload.totalRows
                    this.isLoadingResults = false;
                }
                else {
                    console.log(value.stackTrace)
                    console.log(value.message)
                    this.isLoadingResults = false;
                }
            },
            error: (e) => {
                console.error(e)
                this.isLoadingResults = false;
            }
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
}
