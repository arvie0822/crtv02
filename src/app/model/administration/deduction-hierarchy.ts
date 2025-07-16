import { Validators } from "@angular/forms"

export class Hierarchy {

    name             : string = ''
    description      : string = ''
    minNetPay        : number = 0
    companyAdvance   : number = 0
    amountDrop       : number = 0
    amountDropp       : number = 0
    minAmount        : number = 0
    minAmount1       = [0, [Validators.min(1),Validators.max(100)]]
    maxAmount        : number = 0
    maxAmount1       = [0, [Validators.min(1),Validators.max(100)]]
    status           : number = 0

}

