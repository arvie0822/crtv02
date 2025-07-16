import { DataSource } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TableRequest } from 'app/model/datatable.model';
import { SuccessMessage } from 'app/model/message.constant';
import { EarningTable } from 'app/model/payroll/payroll-run';
import { forkJoin } from 'rxjs';


// var pipe = new DatePipe('en-US');

export interface Earn {
    // Emp_id: number;
    // Emp_Name: string;
    // Date: string;
    // ic: string;
    // amount: number;
    // startDate: string;
    // endDate: string;
    // frequency: string;
    // closedOn: string;
    // Remarks: string;
    errorLogs: string,
    employeeId: string;
    employeeName: string;
    earningsTypeId: number;
    earningsAmount: number;
    recurStartDate: string;
    recurEndDate: string;
    isHoldFrom: string;
    isHoldTo: string;
    frequency: string;
    remarks: string;
}

@Component({
  selector: 'app-earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.css']
})



export class EarningComponent implements OnInit {


    // request = new TableRequest()

    earningsColumns: string[] = [

        'errorLogs', 'employeeId', 'employeeName', 'earningsTypeId','earningsAmount','recurStartDate','recurEndDate','isHoldFrom','isHoldTo','frequency','remarks'

    ];

    earningsNColumns: string[] = [

        'employeeId', 'employeeName', 'earningsTypeId','earningsAmount','recurStartDate','recurEndDate','isHoldFrom','isHoldTo','frequency','remarks'

    ];

    // earningsDColumns: string[] = [

    //     'actionTime', 'errorLogs', 'employeeId', 'employeeName', 'earningsTypeId','earningsAmount','recurStartDate','recurEndDate','isHoldFrom','isHoldTo','frequency','remarks'

    // ];

    // earningsNDColumns: string[] = [

    //     'actionTime', 'employeeId', 'employeeName', 'earningsTypeId','earningsAmount','recurStartDate','recurEndDate','isHoldFrom','isHoldTo','frequency','remarks'

    // ];

    @Input() error: boolean = false
    @Input() searchVal: string;

    isLoadingResults: boolean = true;

    @Output() tablefilter = new EventEmitter<any>();
    @Input() datasource: any = []
    @Input() totalRows: number


    @ViewChild('earnT') earnT: MatTable<any>;
    tableForm: FormGroup
    option : boolean = true

    request = new TableRequest
    errorElement: any[] = []
    dt = []

    constructor(private http: HttpClient,private fb: FormBuilder, private message: FuseConfirmationService,) { }

  ngOnInit() {
    this.tableForm = this.fb.group(new EarningTable());

    this.loadData()

}

ngOnChanges(): void {
    this.isLoadingResults = false
    this.loadData()
    this.search()
  }

  loadData(){

    this.dt  = this.datasource.map(item =>({
        errorLogs: item.errorLogs,
        employeeId: item.employeeCode,
        employeeName: item.employeeName,
        earningsTypeId: item.earningsCode,
        earningsAmount: item.earningsAmount,
        recurStartDate: item.recurStartDate,
        recurEndDate: item.recurEndDate,
        isHoldFrom: item.isHoldFrom,
        isHoldTo: item.isHoldFrom,
        frequency: item.frequency,
        remarks: item.remarks,
    }))
}

onEdit(){
    this.option = false
}
onSave(){
    this.option = true
    // SuccessMessage.title = "Confirmed"
    // SuccessMessage.message = "Timekeeping Category Successfuly Confirmed!"
    // this.message.open(SuccessMessage);
    // this.formChanged.emit(this.validateData())
}
onCancel(){
    this.option = true
}

search() {
    var word = this.searchVal.toLowerCase()
    let filtered = this.dt.filter(function (obj) {
        for (var key in obj) {
            if (obj[key] != null) {
                if (obj[key].toString().toLowerCase().includes(word)) {
                    return obj;
                }
            }
        }
    });
    this.dt = filtered
}

highligthError(row: any): boolean {
    return row.errorLogs;
}

handlePageEvent(e): void {
    this.request.Start = e.pageIndex
    this.request.Length = e.pageSize
    this.isLoadingResults = true;
    this.tablefilter.emit(this.request)
  }

}

