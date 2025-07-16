import { DatePipe } from "@angular/common";
import { Validators } from "@angular/forms"
var pipe = new DatePipe('en-US');

export class PayrollLoans {

    id : number = 0
    loanTypeID : number = 0
    employeeId  : number = 0
    empId: number = 0
    amortizationAmount : number = 0
    totalPayments : number = 0
    tenure : number = 0 //new
    loanNumber : string = "" //new
    withInterest : number = 0
    principalAmount : number = 0
    loanDate  : string = new Date().toISOString().substring(0,new Date().toISOString().length-1)
    // isOneTime : boolean = false
    payrollTypeId : number  =0
    cutoffId : number = 0
    frequency : string  = ""
    recurStartDate : string = new Date().toISOString().substring(0,new Date().toISOString().length-1)
    recurEndDate : string = new Date().toISOString()
    promissoryNoteNum : string = ""
    remarks : string = ""
    payoutType : string = ""
    filename : string = ""
    closedBy : number = 0
    createdBy : number = 0
    dateCreated : string = new Date().toISOString().substring(0,new Date().toISOString().length-1)
    active : boolean = false
    loanStatus : number = 0
    dateClosed  = [new Date().toISOString().substring(0, new Date().toISOString().length - 1), Validators.required]
    isHoldFrom = [new Date().toISOString().substring(0, new Date().toISOString().length - 1), Validators.required]
    isHoldTo =  [new Date().toISOString().substring(0, new Date().toISOString().length - 1), Validators.required]

}


