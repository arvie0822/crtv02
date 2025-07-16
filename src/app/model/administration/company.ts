import { Validators } from "@angular/forms"

export class Company {
    apiKeys : string = ""
    companyId: number = 0
    companyCode: string = ""
    companyName = [null, [Validators.required]]
    companyLogo: string = ""
    seriesCode = [{value: null, disabled: true},[]]
    createdBy: number = 0
    dateCreated: string = ""
    active: boolean = true
    isEmail: boolean = true
    telephone: string = ""
    emailAddress= [null, [Validators.email,Validators.required]]
    isPwExpires: boolean = null
    daysPwExpires: number = null
    restrictPreviousPw: boolean = null
    daysRemindPwExpires: number = null
}
