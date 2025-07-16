import { Validators } from "@angular/forms"

export class PayCodes {


}

export class EarningForm {
    id                   : number = 	0
    code                 : string = 	""
    description          : string = 	""
    categoryID           : number = 	0
    fixed                : boolean = 	false
    earnOrDeduct         : number = 	0
    attendance           : any = 	[]
    formula              : string = 	""
    type                 : number = 	0
    isTaxable            : boolean = false
    isDeductfromTaxable  : boolean = 	false
    isHidePayslip        : boolean = 	false
    isAddtoGross         : boolean = 	false
    isHidePayreg         : boolean = 	false
    jeCodeId             : number = 	0
    jeAccountCode        : number = 	0
    jeAccountId          : number = 	0
    debitOrCredit        : number = 	0
    costOrHr             : number = 	0
    createdBy            : number = 	0
    dateCreated          : string = new Date().toISOString().substring(0,new Date().toISOString().length-1)
    active               : boolean = 	true
    isView               : boolean = 	true
}

export class LoanForm {
    id               : number   = 0
    code             : string   = ""
    description      : string   = ""
    categoryId       : number   = 0
    jeTypeId         : number   = 0
    jeAccountCodeId  : number   = 0
    jeAccountId      : number   = 0
    debitOrCredit    : number   = 0
    costOrHr         : number   = 0
    createdBy        : number   = 0
    dateCreated      : string   = new Date().toISOString().substring(0,new Date().toISOString().length-1)
    active           : boolean  = false
    isView           : boolean = 	true
}

export class DeductionForm {
    id             : number =  0
    code           : string =  ""
    description    : string =  ""
    categoryID     : number =  0
    beforeTax      : boolean =  false
    fixed          : boolean =  false
    fixedAmount    : number =  0
    isHidePayslip  : boolean =  false
    isAddtoGross   : boolean =  false
    isHidePayreg   : boolean =  false
    jeCodeId       : number =  0
    jeAccountCode  : number =  0
    jeAccountName  : string =  ""
    jeAccountId    : number =  0
    debitOrCredit  : number =  0
    costOrHr       : number =  0
    createdBy      : number =  0
    dateCreated    : string = new Date().toISOString().substring(0,new Date().toISOString().length-1)
    active         : boolean =  false
    isView         : boolean = 	true
}
