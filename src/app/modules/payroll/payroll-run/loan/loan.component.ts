import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TableRequest } from 'app/model/datatable.model';

export interface Loan {

    employeeId         : string;
    employeeName       : string;
    loanCode           : string;
    amortizationAmount : number;
    totalPayments      : number;
    withInterest       : number;
    principalAmount    : number;
    loanDate           : string;
    frequency          : string;
    holdFrom           : string;
    holdTo             : string;
    recurStartDate     : string;
    recurEndDate       : string;
    loanNumber         : string;
    promsryNoteNumber  : string;
    remarks            : string;
    fileName           : string;
    dateClosed         : string;
    closedBy           : string;
    createdBy          : string;
    dateCreated        : string;
    loanStatus         : string;
    totalLoans         : number;
}

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {


    loanColumns: string[] = [

        'errorLogs', 'employeeCode', 'employeeName', 'loanCode','amortizationAmount','totalPayments','withInterest','principalAmount','loanDate','frequency','isHoldFrom','isHoldTo','recurStartDate'
        ,'recurEndDate','loanNumber','promissoryNoteNum','remarks'

    ];

    loanNDColumns: string[] = [

        'employeeCode', 'employeeName', 'loanCode','amortizationAmount','totalPayments','withInterest','principalAmount','loanDate','frequency','isHoldFrom','isHoldTo','recurStartDate'
        ,'recurEndDate','loanNumber','promissoryNoteNum','remarks'
    ];

    @Input() datasource: any
    @Input() action: boolean = true
    dt = []
    tableForm: FormGroup
    option : boolean = true
    request = new TableRequest
    isLoadingResults: boolean = true;
    @Input() totalRows: number
    @Input() error: boolean = false
    @Input() searchVal: string;
    @Output() tablefilter = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {

    this.loadData()

  }

  ngOnChanges(): void {
    this.isLoadingResults = false
    this.loadData()
    this.search()
  }

  loadData(){
    // if (this.action) {
    //     this.dt  = this.datasource.map(item =>({

    //         employeeId: item["Employee ID"],
    //         employeeName: item["Employee Name"],
    //         loanCode: item["Loan Code"],
    //         amortizationAmount: item["Amortization Amount"],
    //         totalPayments: item["Total Payments"],
    //         withInterest: item["With Interest"],
    //         principalAmount: item["Principal Amount"],
    //         loanDate: item["Loan Date"],
    //         frequency: item["Frequency"],
    //         holdFrom: item["Hold From"],
    //         holdTo: item["Hold To"],
    //         recurStartDate: item["Recur Start Date"],
    //         recurEndDate: item["Recur End Date"],
    //         loanNumber: item["Loan Number"],
    //         promissoryNoteNum: item["Promsry Note Number"],
    //         remarks: item["Remarks"],
    //         fileName: item["File Name"],
    //         dateClosed: item["Date Closed"],
    //         closedBy: item["Closed By"],
    //         createdBy: item["Created By"],
    //         dateCreated: item["Date Created"],
    //         loanStatus: item["Loan Status"],
    //         totalLoans: item["Total Loans"],
    //         actionTime: true,
    //     }))
    // } else {
    //     this.dt  = this.datasource.map((item): Loan =>({

    //         employeeId: item["Employee ID"],
    //         employeeName: item["Employee Name"],
    //         loanCode: item["Loan Code"],
    //         amortizationAmount: item["Amortization Amount"],
    //         totalPayments: item["Total Payments"],
    //         withInterest: item["With Interest"],
    //         principalAmount: item["Principal Amount"],
    //         loanDate: item["Loan Date"],
    //         frequency: item["Frequency"],
    //         holdFrom: item["Hold From"],
    //         holdTo: item["Hold To"],
    //         recurStartDate: item["Recur Start Date"],
    //         recurEndDate: item["Recur End Date"],
    //         loanNumber: item["Loan Number"],
    //         promissoryNoteNum: item["Promsry Note Number"],
    //         remarks: item["Remarks"],
    //         fileName: item["File Name"],
    //         dateClosed: item["Date Closed"],
    //         closedBy: item["Closed By"],
    //         createdBy: item["Created By"],
    //         dateCreated: item["Date Created"],
    //         loanStatus: item["Loan Status"],
    //         totalLoans: item["total Loans"],


    //     }))
    // }
    this.dt  = this.datasource.map(item =>({

        errorLogs: item.errorLogs,
        employeeCode: item.employeeCode,
        employeeName: item.employeeName,
        loanCode: item.loanCode,
        amortizationAmount: item.amortizationAmount,
        totalPayments: item.totalPayments,
        withInterest: item.withInterest,
        principalAmount: item.principalAmount,
        loanDate: item.loanDate,
        frequency: item.frequency,
        isHoldFrom: item.isHoldFrom,
        isHoldTo: item.isHoldTo,
        recurStartDate: item.recurStartDate,
        recurEndDate: item.recurEndDate,
        loanNumber: item.loanNumber,
        promissoryNoteNum: item.promissoryNoteNum,
        remarks: item.remarks,
    }))
}

onEdit(){
    this.option = false
}
onSave(){
    this.option = true
}
onCancel(){
    this.option = true
}

search() {
    var value = this.searchVal.toLowerCase()
    let filtered = this.dt.filter(function (obj) {
        for (var key in obj) {
            if (obj[key] != null) {
                if (obj[key].toString().toLowerCase().includes(value)) {
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
