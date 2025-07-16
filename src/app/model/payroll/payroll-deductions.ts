import { DatePipe } from "@angular/common";
import { Validators } from "@angular/forms"
var pipe = new DatePipe('en-US');

export class PayrollDeduction {

    id : number = 0
    employeeId : number = 0
    employeecode :number = 0
    deductionsTypeID : number = 0
    deductionsAmount : number = 0
    // isOneTime : boolean = false
    payrollTypeId  : number =0
    cutoffId : number = 0
    frequency : string = ""
    recurStartDate = pipe.transform(new Date,"yyyy-MM-dd")
    recurEndDate = pipe.transform(new Date,"yyyy-MM-dd")
    remarks : string = ""
    // payoutType : string = ""
    filename : string = ""
    closedBy : number = 0
    createdBy : number = 0
    dateCreated = pipe.transform(new Date,"yyyy-MM-dd")
    active : boolean = false
    status : number = 0
    dateClosed  = [new Date().toISOString().substring(0, new Date().toISOString().length - 1), Validators.required]
    isHoldFrom = [new Date().toISOString().substring(0, new Date().toISOString().length - 1), Validators.required]
    isHoldTo =  [new Date().toISOString().substring(0, new Date().toISOString().length - 1), Validators.required]


}


