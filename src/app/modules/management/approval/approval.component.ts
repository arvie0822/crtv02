import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Approval } from 'app/model/management/approval';
import { ApprovalReasonComponent } from './approval-reason/approval-reason.component';
import { DissapproveReasonComponent } from './dissaprove-reason/dissaprove-reason.component';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { forkJoin } from 'rxjs';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { DropdownRequest } from 'app/model/dropdown.model';
import { TableRequest } from 'app/model/datatable.model';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/services/userService/user.service';
import { FilingService } from 'app/services/filingService/filing.service';
import { CoreService } from 'app/services/coreService/coreService.service';
import { GF } from 'app/shared/global-functions';
import _ from 'lodash';

enum mode {
    all = 0,
    next = 1
}

@Component({
    selector: 'app-approval',
    templateUrl: './approval.component.html',
    styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

    displayedColumns: any[] = [];
    displayedColumnsH: any[] = [];
    columnsToDisplay: string[] = [];
    columnsToDisplayH: string[] = [];
    data: any[] = [];
    dataHistory: any[] = [];
    dropdownRequest = new DropdownRequest
    dropdownRequestEmployee = new DropdownRequest
    dropdownRequestApproved = new DropdownRequest
    request = new TableRequest()
    requestHistory = new TableRequest()
    AtotalRows: number = 0
    HtotalRows: number = 0

    dialogRefreason: MatDialogRef<ApprovalReasonComponent, any>;

    columns = [
        { column: 'Code',               columnDef: 'code'                   ,view: 0   },
        { column: 'Employee',           columnDef: 'employee'               ,view: 0   },
        { column: 'Date From',          columnDef: 'dateFrom'               ,view: 0   },
        { column: 'Date To',            columnDef: 'dateTo'                 ,view: 0   },
        { column: 'Leave Type',         columnDef: 'leaveType'              ,view: 34  },//Leave
        { column: 'Leave Filing Type',  columnDef: 'leaveFilingType'        ,view: 34  },//Leave
        { column: 'Halfday Option',     columnDef: 'halfDayOption'          ,view: 34  },//Leave
        { column: 'paid',               columnDef: 'paid'                   ,view: 34  },//Leave
        { column: 'Shift Code',         columnDef: 'shiftCode'              ,view: 34  },//Leave
        { column: 'Shift Code',         columnDef: 'shiftCode'              ,view: 32  },//CS
        { column: 'Offset Hours',       columnDef: 'offsetHours'            ,view: 37  },//Offset
        { column: 'Location From',      columnDef: 'locationFrom'           ,view: 114 },//Change Location
        { column: 'Location To',        columnDef: 'locationTo'             ,view: 114 },//Change Location
        { column: 'Reason',             columnDef: 'reason'                 ,view: 0   },
        { column: 'Status',             columnDef: 'status'                 ,view: 0   },
        { column: 'Approver',           columnDef: 'approvedBy'             ,view: 0   },
        { column: 'Reviewed Date',      columnDef: 'approvalDate'           ,view: 0   },
        { column: 'Requested By',       columnDef: 'requestedBy'            ,view: 0   },
        { column: 'Request Date',       columnDef: 'requestDate'            ,view: 0   },
    ]
    // datasource
    CS_DATA = []
    CL_DATA = []
    LV_DATA = []
    OB_DATA = []
    OT_DATA = []
    OFS_DATA = []
    UH_DATA = []
    COE_DATA = []

    approvalForm: FormGroup
    historyForm: FormGroup
    binding: string;

    radiobuttons = []
    isSave = false
    _onDestroy: any
    moduleId : any
    historyId : any
    moduleIdSelected : any
    pipe = new DatePipe('en-US');
    all = [{dropdownID: 0,description: "All"}]

    employee = []
    employeeHistory = []
    codes = []
    filing = []
    selectedItem = []
    excluded = []
    late = false
    successMessage  = Object.assign({}, SuccessMessage)
    saveMessage     = Object.assign({}, SaveMessage)
    failedMessage   = Object.assign({}, FailedMessage)

    constructor(private route: ActivatedRoute,
        private tenantService: TenantService,
        private coreService: CoreService,
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private message: FuseConfirmationService,
    ) { }

    get af() { return this.approvalForm.value }
    get hf() { return this.historyForm.value }

    ngOnInit() {
        this.approvalForm = this.fb.group(new Approval())
        this.historyForm = this.fb.group(new Approval())
        this.request.Length = 20
        this.requestHistory.Length = 20

        this.loadData()
    }

    loadHistory(){
        this.displayedColumnsH = this.columns.filter(x=>x.view === 0 || x.view === this.hf.code)
        this.columnsToDisplayH = this.displayedColumnsH.map(item => item.columnDef);

        this.tenantService.getApprovalHistoryTable(this.requestHistory)
        .subscribe({
            next: (value: any) => {
                this.HtotalRows = value.payload.totalRows
                this.dataHistory = value.payload.data
            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
            }
        });
    }

    loadData(){
        forkJoin({
            tenant: this.tenantService.getApprovalPendingCount(),
            dropdownModule: this.coreService.getCoreDropdown(1028, this.dropdownRequest),
        }).subscribe({
            next: (value: any) => {
                this.moduleIdSelected = value.tenant.payload[0]?.moduleId || null
                this.radiobuttons = value.tenant.payload
                this.filing = value.dropdownModule.payload
                if (this.moduleIdSelected) {
                    this.ChangeModule(value.tenant.payload[0])
                }
            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
            }
        });
    }

    insertCol(col,T,v){
        T[col] = v
        return T
    }

    ChangeModule(mId){
        this.codes = []
        this.approvalForm.reset()
        this.request.SearchColumn = []
        this.request.SearchColumn.push({
            key : "moduleId",
            value : mId.moduleId+"",
            type : 2
        })
        this.onTable(mId)
    }

    get ApMid(){
        return GF.IsEmptyReturn(this.moduleId?.moduleId, 0)
    }

    get HisMid(){
        return GF.IsEmptyReturn(this.historyId, 0)
    }

    onTable(mId) {
        this.moduleId = mId
        this.dropdownRequestEmployee.id = []
        this.dropdownRequestEmployee.id.push({dropdownID: GF.IsEmptyReturn(mId?.moduleId, 0), dropdownTypeID: 13})
        forkJoin({
            tenant:     this.tenantService.getApprovalPendingTable(this.request),
            employees:  this.tenantService.getApprovalEmployeeDropdown(this.dropdownRequestEmployee),
        }).subscribe({
            next: (value: any) => {
                this.employee = value.employees.payload
                this.displayedColumns = this.columns.filter(x=>x.view === 0 || x.view === this.moduleId.moduleId)
                var ac = ["checkbox", "action", "attachment"]

                this.columnsToDisplay = [...ac, ...this.displayedColumns.map(item => item.columnDef).slice()];
                this.data = value.tenant.payload.data.map(function (obj) {
                    obj.checked = false;
                    return obj;
                });
                if (this.selectedItem.some(x=>x.id===0)) {
                    this.selectAll({checked:true}, mode.next)
                }
                this.AtotalRows = value.tenant.payload.totalRows
            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
            }
        });
    }

    selectEmployee(e){
        this.dropdownRequest["employeeId"] = this.af.employee

        this.tenantService.getApprovalPendingDropdown(this.dropdownRequest,this.moduleId?.encryptId||"")
        .subscribe({
            next: (value: any) => {
                this.codes = [...[{dropdownID: "",description: "All"}],...value.payload.map(k=>({
                    dropdownID: k.description,description: k.description
                }))]
            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
            }
        });
    }

    openModalDissapprove() {
        if (this.data.length === 0 || GF.IsEmpty(this.selectedItem)) {
            FailedMessage.message = "No Filing selected!"
            FailedMessage.title = "Warning!"
            this.message.open(FailedMessage);
            return
        }
        const dialogRef = this.dialog.open(DissapproveReasonComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.confirmed) {
                this.submit(result)
            }
        });
    }

    openModalApprove() {
        if (this.data.length === 0 || GF.IsEmpty(this.selectedItem)) {
            FailedMessage.message = "No Filing selected!"
            FailedMessage.title = "Warning!"
            this.message.open(FailedMessage);
            return
        }

        var obj = {
            confirmed: "",
            reason: "",
            isApproved: true
        }
        this.submit(obj)
    }

    // check box function
    selectOne(e, i) {
        var id = this.data[i].id
        var hasId = this.selectedItem.some(x=>x.id===id)
        var hasZero = this.selectedItem.some(x=>x.id===0)

        if (!hasId) {
            this.selectedItem.push({id: id, page: this.request.Start})
            var count = this.selectedItem.filter(x => x.page == this.request.Start).length
            if (count == this.data.length){
                this.selectedItem.push({id: 0, page: this.request.Start})
            }

            if (hasZero) {
                var ex = this.excluded.findIndex(x => x === id)
                if (ex > -1) {
                    this.excluded.splice(ex, 1)
                }
            }
        } else {
            var idx = this.selectedItem.findIndex(x => x.id == id && x.page == this.request.Start)
            if (idx > -1) {
                this.selectedItem.splice(idx, 1)
            }
            if (hasZero) {
                this.excluded.push(id);
            }
        }
    }

    selectAll(e, m) {
        if (e.checked) {
            var Items = []
            var data = []
            if (m === mode.next) {
                data = this.data.filter(x=>!this.excluded.includes(x.id))
            } else {
                data = this.data
            }
            Items = [...[0],...data.map(x=>x.id)].map(item=>({
                id: item,
                page: this.request.Start
            }))

            this.selectedItem = _.uniqBy([...Items,...this.selectedItem], JSON.stringify)
        } else {
            this.selectedItem = []
            this.excluded = []
        }
    }

    itemChecked(all, i){
        var id = this.data[i]?.id
        if (!id) { return }
        if (all) {
            return this.selectedItem.some(x=>x.id===0 && x.page == this.request.Start)
        } else {
            if (this.selectedItem.some(x=>x.id===0 && x.page == this.request.Start && this.excluded.includes(x.id))) {
                return true
            } else {
                return this.selectedItem.some(x=>x.id===id && x.page == this.request.Start)
            }
        }
    }
    //end of check box function

    search(){
        this.request.SearchColumn = []
        this.request.SearchColumn.push(
            {
                key : "moduleId",
                value : this.moduleId.moduleId+"",
                type : 2
            }
        )
        if ((this.af.dateFrom !== "" && this.af.dateFrom !== null) && (this.af.dateTo !== "" && this.af.dateTo !== null)) {
            this.request.SearchColumn.push({
                key : "dateFrom",
                value : this.pipe.transform(this.af.dateFrom,"MM/dd/yyyy"),
                type : 4
            },
            {
                key : "dateTo",
                value : this.pipe.transform(this.af.dateTo,"MM/dd/yyyy"),
                type : 5
            })
        }
        if (this.af.employee !== null && this.af.employee.length > 0) {
            this.af.employee.forEach(emp => {
                this.request.SearchColumn.push({
                    key : "employeeId",
                    value : emp+"",
                    type : 2
                })
            });
        }
        if (this.af.code !== "" && this.af.code !== null && this.af.code.length > 0 && !this.af.code.some(o=>o=="")) {
            this.af.code.forEach(co => {
                this.request.SearchColumn.push({
                    key : "code",
                    value : co,
                    type : 0
                })
            });
        }
        this.onTable(this.moduleId)
    }

    searchHistory(){
        this.requestHistory.SearchColumn = []
        this.requestHistory.SearchColumn.push(
            {
                key : "moduleId",
                value : this.hf.code+"",
                type : 2
            }
        )
        if ((this.hf.dateFrom !== "" && this.hf.dateFrom !== null) && (this.hf.dateTo !== "" && this.hf.dateTo !== null)) {
            this.requestHistory.SearchColumn.push({
                key : "dateFrom",
                value : this.pipe.transform(this.hf.dateFrom,"MM/dd/yyyy 12:01:00"),
                type : 4
            },
            {
                key : "dateTo",
                value : this.pipe.transform(this.hf.dateTo,"MM/dd/yyyy 23:59:00"),
                type : 5
            })
        }
        if (this.hf.employee !== null && this.hf.employee.length > 0) {
            this.hf.employee.forEach(emp => {
                this.requestHistory.SearchColumn.push({
                    key : "employeeId",
                    value : emp+"",
                    type : 2
                })
            });
        }

        this.loadHistory()
    }

    handlePageEvent(e){
        this.request.Start = e.pageIndex
        this.request.Length = e.pageSize
        this.search()
    }

    handlePageHistoryEvent(e){
        this.requestHistory.Start = e.pageIndex
        this.requestHistory.Length = e.pageSize
        this.searchHistory()
    }

    loadEmployees(){
        var mId = this.filing.find(x=>x.dropdownID == this.hf.code).dropdownID
        this.historyId = mId
        this.dropdownRequestApproved.id.push({dropdownID: GF.IsEmptyReturn(mId, 0), dropdownTypeID: 13})
        this.tenantService.getApprovalApprovedDropdown(this.dropdownRequestApproved).subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    this.employeeHistory = value.payload
                }
            },
            error: (e) => {
                console.error(e)
            }
        });
    }

    async submit(e) {
        var ds = this.selectedItem
        if (GF.IsEmpty(ds)) {return}

        const dialogRef = this.message.open(SaveMessage);

        dialogRef.afterClosed().subscribe(async(result) => {
            if (result == "confirmed") {
                var req = {
                    FilingType: this.moduleId.moduleId,
                    IsApproved: e.isApproved,
                    Remarks: e.reason,
                    Excludes: this.excluded,
                    Requests: ds.map(x=>x.id)
                }
               this.tenantService.postApprovalProcess(req, this.late).subscribe({
                    next: (value: any) => {
                        this.coreService.valid(value, this.late, ds.length, false, "", "").then((res)=>{
                            if (res.saveNow) {
                                this.late = res.lateSave
                                this.submit(e)
                                return
                            }

                            if (res.reset) {
                                this.reset()
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
        })
    }

    download(ii){
        if (this.moduleId.moduleId === 52) {
            this.coreService.directDownloadBoldRTemplate("COE v2",'',"pdf","{'EncryptedCOEID':['"+ii.encryptId+"']}", null,false,"")
        } else {
            this.coreService.downloadAttachment(ii.uploadPath.replace("C:\\fakepath\\",''), ii.id, this.moduleId.moduleId);
        }
    }

    reset(){
        this.isSave = false
        this.late = false
        this.selectedItem = []
        this.loadData()
        this.ChangeModule(this.moduleId)
    }
}
