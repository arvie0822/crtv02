import { DatePipe, NgSwitchCase } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { DynamicStatutory } from 'app/model/statutory/setup';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { PayrollService } from 'app/services/payrollService/payroll.service';
import { GF } from 'app/shared/global-functions';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.css']
})

export class SetupComponent implements OnInit {

    id: string;
    isSave: boolean = false
    update: any
    sssForm: FormGroup
    sssCalcForm: FormGroup
    sssCalcFormSec: FormGroup
    taxForm: FormGroup
    hdmfForm: FormGroup
    phicForm: FormGroup
    pipe = new DatePipe('en-US');
    isEdit: boolean = false
    statutoryType: number
    check : boolean = false
    passedRequired : boolean = false

    dropdownOptions = new DropdownOptions
    dropdownFixRequest = new DropdownRequest;
    dropdownRequestsub = new DropdownRequest
    failedMessage = { ...FailedMessage}



    statutory = [
        { id: 0, description: 'SSS' },
        { id: 1, description: 'Tax' },
        { id: 2, description: 'HDMF' },
        { id: 3, description: 'PHIC' },
    ]
    types = [
        { id: 0, description: 'Monthly' },
        { id: 1, description: 'Semi-monthly' },
        { id: 2, description: 'Weekly' },
    ]
    cutoff = [

        { id: 0, description: 'Fixed' },
        { id: 1, description: 'Calculated' },
        { id: 2, description: 'Not Applicable' },
    ]
    basis = [
        { id: 0, description: 'Basic-Monthly' },
        { id: 1, description: 'Overtime' },
        { id: 2, description: 'Holiday' },
    ]
    leaves = [
        { id: 0, description: 'VL' },
        { id: 1, description: 'SL' },
        { id: 2, description: 'EL' },
        { id: 3, description: 'PTO' },
        { id: 4, description: 'SIL' },
    ]
    value = [
        { id: 0, description: 'As is' },
        { id: 1, description: 'Divided by 2' },
    ]
    attendance = [
        { id: 0, description: 'Absences' },
        { id: 1, description: 'Tardiness' },
        { id: 2, description: 'Undertime' },
        { id: 3, description: 'LWOP' },
    ]
    earnings = [
        { id: 1, description: 'MTA' },
        { id: 2, description: 'Phone' },
        { id: 3, description: '13th Month' },
    ]
    hdmf1 = [
        { id: 0, description: 'Half' },
        { id: 1, description: 'Full' },
        { id: 2, description: 'Maximum' },
    ]
    hdmf2 = [
        { id: 0, description: 'Half' },
        { id: 1, description: 'Full' },
        { id: 2, description: 'Adj from 1st cut-off' },
    ]
    taxmon = [
        { id: 0, description: 'Monthly Tax table' },
        { id: 1, description: 'Contractor 5%' },
        { id: 2, description: 'Contractor 10%' },
    ]
    taxsemi = [
        { id: 0, description: 'Semi-monthly Tax Table' },
        { id: 1, description: 'Contractor 5%' },
        { id: 2, description: 'Contractor 10%' },
        { id: 3, description: 'Monthly Tax Table' },
        { id: 4, description: 'Monthly Tax Table adj from 1st cut-off' },
    ]
    taxweek = [
        { id: 0, description: 'Weekly Tax Table' },
        { id: 1, description: 'Monthly Tax Table' },
        { id: 2, description: 'Contractor 5%' },
        { id: 3, description: 'Contractor 10%' },
    ]
    month = [
        { id: 0, description: 'January' },
        { id: 1, description: 'February' },
        { id: 2, description: 'March' },
        { id: 3, description: 'April' },
        { id: 4, description: 'May' },
        { id: 5, description: 'June' },
        { id: 6, description: 'July' },
        { id: 7, description: 'August' },
        { id: 8, description: 'September' },
        { id: 9, description: 'October' },
        { id: 10, description: 'November' },
        { id: 11, description: 'December' },
    ];
    day = [
        { id: 0, description: 1 },
        { id: 1, description: 2 },
        { id: 2, description: 3 },
        { id: 3, description: 4 },
        { id: 4, description: 5 },
        { id: 5, description: 6 },
        { id: 6, description: 7 },
        { id: 7, description: 8 },
        { id: 8, description: 9 },
        { id: 9, description: 10 },
        { id: 10, description: 11 },
        { id: 11, description: 12 },
        { id: 12, description: 13 },
        { id: 13, description: 14 },
        { id: 14, description: 15 },
        { id: 15, description: 16 },
        { id: 16, description: 17 },
        { id: 17, description: 18 },
        { id: 18, description: 19 },
        { id: 19, description: 20 },
        { id: 20, description: 21 },
        { id: 21, description: 22 },
        { id: 22, description: 23 },
        { id: 23, description: 24 },
        { id: 24, description: 25 },
        { id: 25, description: 26 },
        { id: 26, description: 27 },
        { id: 27, description: 28 },
        { id: 28, description: 29 },
        { id: 29, description: 30 },
        { id: 30, description: 31 },
    ];
    year = [
        { id: 0, description: 2023 },
        { id: 1, description: 2023 },
        { id: 2, description: 2024 },
        { id: 3, description: 2025 },
        { id: 4, description: 2026 },
        { id: 5, description: 2027 },
    ]
    tax = [
        { id: 0, description: 'dropdownFix.taxMonRateDef' },
        { id: 1, description: 'dropdownFix.taxSemiRateDef' },
        { id: 2, description: 'dropdownFix.taxWeekRateDef' },

    ]

    constructor(
        private fb: FormBuilder,
        private masterService: MasterService,
        private message: FuseConfirmationService,
        private payrollService: PayrollService,
        private router: Router,
        private route: ActivatedRoute,
        private coreService: CoreService,
    ) { }

    get sssF(){ return this.sssForm.value }
    get phicF(){ return this.phicForm.value }
    get hdmfF(){ return this.hdmfForm.value }
    // get sss(){ return this.sssCalcForm.value }
    // get sssSec(){ return this.sssCalcFormSec.value }


    ngOnInit() {

        this.id = this.route.snapshot.paramMap.get('id');

        this.sssForm = this.fb.group(new DynamicStatutory());
        this.taxForm = this.fb.group(new DynamicStatutory());
        this.hdmfForm = this.fb.group(new DynamicStatutory());
        this.phicForm = this.fb.group(new DynamicStatutory());

        var adds = sessionStorage.getItem("adds")
        var link =
        adds === "SSS" ? "getDynamicSSS" :
            adds === "TAX" ? "getDynamicTAX" :
                adds === "HDMF" ? "getDynamicHDMF" :
                    adds === "PHIC" ? "getDynamicPHIC" : ""

        if (this.id !== "") {
            this.payrollService.getStatutory(this.id,link)
            .subscribe({
                next: (value: any) => {

                    this.dropdownFixRequest.id.push(
                        { dropdownID: GF.IsEmptyReturn(value.payload?.statutory, 0),             dropdownTypeID: 125 },
                        { dropdownID: GF.IsEmptyReturn(value.payload?.firstCutOff, 0),           dropdownTypeID: 126 },
                        { dropdownID: GF.IsEmptyReturn(value.payload?.firstCalc?.basic, 0),      dropdownTypeID: 127 },
                        { dropdownID: GF.IsEmptyReturn(value.payload?.firstCalc?.basicvalue, 0), dropdownTypeID: 128 },
                        { dropdownID: GF.IsEmptyReturn(value.payload?.firstCalc, 0),             dropdownTypeID: 130 },
                        { dropdownID: GF.IsEmptyReturn(value.payload?.firstCalc, 0),             dropdownTypeID: 129 },
                    )
                    const basic = [30391, 30392, 30393, 30394]
                    switch (adds) {
                        case "SSS":
                            this.sssForm.patchValue(JSON.parse(JSON.stringify(value.payload)))
                            this.sssForm.get('basic').setValue([
                                value.payload.basic_Current_Month ? 30391 : 0,
                                value.payload.basic_Monthly ? 30392 : 0,
                                value.payload.overtime ? 30393 : 0,
                                value.payload.holiday ? 30394 : 0,
                            ]);
                            const SSS = basic.every(value => this.sssForm.value.basic.includes(value));
                            this.sssForm.get('basic').setValue(SSS ? [...this.sssForm.value.basic.map(x => x), 0] : this.sssForm.value.basic.filter(value => value !== 0));
                            break;
                        case "TAX":
                            this.taxForm.patchValue(JSON.parse(JSON.stringify(value.payload)))
                            break;
                        case "PHIC":
                            this.phicForm.patchValue(JSON.parse(JSON.stringify(value.payload)))
                            this.phicForm.get('basic').setValue([
                                value.payload.basic_Current_Month ? 30391 : 0,
                                value.payload.basic_Monthly ? 30392 : 0,
                                value.payload.overtime ? 30393 : 0,
                                value.payload.holiday ? 30394 : 0,
                            ]);
                            const PHIC = basic.every(value => this.phicForm.value.basic.includes(value));
                            this.phicForm.get('basic').setValue(PHIC ? [...this.phicForm.value.basic.map(x => x), 0] : this.phicForm.value.basic.filter(value => value !== 0));
                            console.log(this.phicForm.value.basic)
                            break;
                        case "HDMF":
                            this.hdmfForm.patchValue(JSON.parse(JSON.stringify(value.payload)))
                            this.hdmfForm.get('basic').setValue([
                                value.payload.basic_Current_Month ? 30391 : 0,
                                value.payload.basic_Monthly ? 30392 : 0,
                                value.payload.overtime ? 30393 : 0,
                                value.payload.holiday ? 30394 : 0,
                            ]);
                            const HDMF = basic.every(value => this.hdmfForm.value.basic.includes(value));
                            this.hdmfForm.get('basic').setValue(HDMF ? [...this.hdmfForm.value.basic.map(x => x), 0] : this.hdmfForm.value.basic.filter(value => value !== 0));
                            break;
                    }

                    this.initData()
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                    this.isSave = false
                    this.sssForm.enable();
                    // this.sssCalcForm.enable();
                    // this.sssCalcFormSec.enable();
                    this.taxForm.enable();
                    this.taxForm.enable();
                    this.hdmfForm.enable();
                    this.phicForm.enable();

                }
            });

        } else {
            this.dropdownFixRequest.id.push(
                { dropdownID: 0, dropdownTypeID: 69 },
                { dropdownID: 0, dropdownTypeID: 125 },
                { dropdownID: 0, dropdownTypeID: 126 },
                { dropdownID: 0, dropdownTypeID: 127 },
                { dropdownID: 0, dropdownTypeID: 128 },
                { dropdownID: 0, dropdownTypeID: 129 },
                { dropdownID: 0, dropdownTypeID: 130 },
            )

            this.initData()

        }
    }

    initData() {

        var adds = sessionStorage.getItem("adds")
        this.isEdit = adds == undefined || adds == null || adds == "" ? false : true
        this.statutoryType = adds === "SSS" ? 30379 : adds === "TAX" ? 30380 : adds === "HDMF" ? 30381 : adds === "PHIC" ? 30382 : 0
        console.log()
        this.sssForm.get("statutory").setValue(this.statutoryType)

        forkJoin({
            dropdownFix: this.masterService.getDropdownFix(this.dropdownFixRequest),
            attendance: this.coreService.getCoreDropdown(1020,this.dropdownRequestsub),
            leave: this.coreService.getCoreDropdown(1032,this.dropdownRequestsub),
            earning: this.coreService.getCoreDropdown(1022,this.dropdownRequestsub),
            // category: this.coreService.getCoreDropdown(1007,this.dropdownRequestsub),

        }).subscribe({
            next: (response) => {

                // MASTER
                this.dropdownOptions.statutoryDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 125 && [30379, 30380, 30381, 30382].includes(x.dropdownID))
                // this.dropdownOptions.statutoryDef       = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 125)
                this.dropdownOptions.calculationTypeDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 126)
                this.dropdownOptions.sssBasisDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 127)
                this.dropdownOptions.sssValueDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 129 && x.dropdownID !== 30400)
                this.dropdownOptions.hdmfFirstCalcDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 129 && x.dropdownID !== 30400)
                this.dropdownOptions.hdmfSecondCalcDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 129 && x.dropdownID !== 30399)
                this.dropdownOptions.taxMonRateDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 130 && x.dropdownID !== 30402 && x.dropdownID !== 30403)
                this.dropdownOptions.taxSemiRateDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 130 && x.dropdownID !== 30401 && x.dropdownID !== 30403 )
                this.dropdownOptions.taxWeekRateDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 130 && x.dropdownID !== 30401 && x.dropdownID !== 30402 )
                this.dropdownOptions.taxSemiCustomDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 130 && x.dropdownID !== 30403 )
                this.dropdownOptions.payoutTypeDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID === 69)


                  //API
                  this.dropdownOptions.attendanceStatutoryDef = response.attendance.payload
                  this.dropdownOptions.leaveStatutoryDef = response.leave.payload
                  this.dropdownOptions.earningsDef = response.earning.payload
                //   this.dropdownOptions.categoryDef        = response.category.payload


            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
                this.isSave = false
                this.sssForm.enable();
                // this.sssCalcForm.enable();
                // this.sssCalcFormSec.enable();
                this.taxForm.enable();
                this.hdmfForm.enable();
                this.phicForm.enable();
            },
        });

    }


    taxOption() {
        var out = []
        switch (this.taxForm.value.frequency) {
            case 0:
                out = this.dropdownOptions.taxMonRateDef
                break;
            case 1:
                out = this.dropdownOptions.taxSemiRateDef
                break;
            case 2:
                out = this.dropdownOptions.taxWeekRateDef
                break;
        }
        return out
    }

    filing_restrict(e: FormGroup, v, d) {
        var before = e.get(v).value
        var after = e.get(d).value


        if (before == 0 || before == 2) {
            // if (o==1) {
            e.get(d).enable()
            e.get('basic').disable()
            e.get('attendance').disable()
            e.get('leave').disable()
            e.get('earnings').disable()
            e.get('basicvalue').disable()
            // }
            // if (o==2) {
            //     this.categoryForm.get(v).disable()
            // }
            // if (o==3) {
            //     this.categoryForm.get(v).disable()
            // }
            // if (o==4) {
            //     this.categoryForm.get(v).disable()
            // }
            // if (o==5) {
            //     this.categoryForm.get(v).disable()
            // }
            // if (o==6) {
            //     this.categoryForm.get(v).disable()
            // }
        } else if (before == 1) {
            e.get(d).enable()
            this.hdmfForm.get('firstMax').disable()
            this.phicForm.get('firstMax').disable()
            e.get('basic').enable()
            e.get('attendance').enable()
            e.get('leave').enable()
            e.get('earnings').enable()
            e.get('basicvalue').enable()
        }
    }

    reset() {
        this.sssForm.get('firstCutOff').setValue(0)
        this.sssForm.get('secondCutoff').setValue(0)
        this.taxForm.get('firstCutOff').setValue(0)
        this.taxForm.get('secondCutoff').setValue(0)
    }
    headeReset() {
        this.hdmfForm.get('firstCutOff').setValue(0)
        this.hdmfForm.get('secondCutoff').setValue(0)
        this.hdmfForm.get('firstMax').setValue(0)
        this.hdmfForm.get('secondMax').setValue(0)
        this.hdmfForm.get('firstCalc').setValue(0)
        this.hdmfForm.get('secondCalc').setValue(0)

        this.phicForm.get('firstCutOff').setValue(0)
        this.phicForm.get('secondCutoff').setValue(0)
        this.phicForm.get('firstMax').setValue(0)
        this.phicForm.get('secondMax').setValue(0)
        this.phicForm.get('firstCalc').setValue(0)
        this.phicForm.get('secondCalc').setValue(0)
    }

    //  showhide(e){
    //         return e == 0 || 1 ? false : true
    //  }
    statutoryReset() {
        this.sssForm.get('frequency').setValue(0)
        this.sssForm.get('name').setValue("")
        this.sssForm.get('description').setValue("")
        // this.sssForm.get('active').setValue(0)
        this.sssForm.get('firstCutOff').setValue(0)
        this.sssForm.get('secondCutoff').setValue(0)

        this.taxForm.get('frequency').setValue(0)
        this.taxForm.get('name').setValue("")
        this.taxForm.get('description').setValue("")
        this.taxForm.get('firstCutOff').setValue(0)
        this.taxForm.get('secondCutoff').setValue(0)

        this.hdmfForm.get('frequency').setValue(0)
        this.hdmfForm.get('name').setValue("")
        this.hdmfForm.get('description').setValue("")
        this.hdmfForm.get('firstCutOff').setValue(0)
        this.hdmfForm.get('secondCutoff').setValue(0)

        this.phicForm.get('firstCutOff').setValue(0)
        this.phicForm.get('secondCutoff').setValue(0)
        this.phicForm.get('frequency').setValue(0)
        this.phicForm.get('name').setValue("")
        this.phicForm.get('description').setValue("")

    }

    hdmiPHICReset(){
        this.hdmfForm.get('firstMax').setValue(0)
        this.hdmfForm.get('firstCalc').setValue(0)

        this.phicForm.get('firstMax').setValue(0)
        this.phicForm.get('firstCalc').setValue(0)
    }

    hdmiPHICReset1(){
        this.hdmfForm.get('secondMax').setValue(0)
        this.hdmfForm.get('secondCalc').setValue(0)

        this.phicForm.get('secondMax').setValue(0)
        this.phicForm.get('secondCalc').setValue(0)
    }

    sssReset() {
        this.sssForm.get('firstMax').setValue(0)
        this.sssForm.get('firstCalc').setValue(0)
        // this.sssForm.get('attendance').setValue([0])
        // this.sssForm.get('leave').setValue([0])
        // this.sssForm.get('earnings').setValue([0])
        this.sssForm.get('basic_Current_Month').setValue(false)
        this.sssForm.get('basic_Monthly').setValue(false)
        this.sssForm.get('overtime').setValue(false)
        this.sssForm.get('holiday').setValue(false)
    }
    sssReset1(){
        this.sssForm.get('secondMax').setValue(0)
        this.sssForm.get('secondCalc').setValue(0)
    }
    calcReset(){
        this.sssForm.get('firstMax').setValue(0)
    }
    calcReset1(){
        this.sssForm.get('secondMax').setValue(0)
    }

    // sssReset1() {
    //     this.sssForm.get('secondMax').setValue(0)
    //     this.sssForm.reset()
    // }



    taxReset() {
        this.taxForm.get('firstMax').setValue(0)
        this.taxForm.get('firstCalc').setValue(0)

    }
    taxReset1(){
        this.taxForm.get('secondMax').setValue(0)
        this.taxForm.get('secondCalc').setValue(0)
    }

    checkForm(name, description) {
        if (GF.IsEmpty(name) || GF.IsEmpty(description)) {
            this.failedMessage.message = "Please Select Name and Description";
            this.message.open(this.failedMessage);
            this.passedRequired = false
            return;
        } else{
            this.passedRequired = true
        }
    }

    submit(): void {
        const form = {
            30379: { form: this.sssForm, service: this.payrollService.postDynamicSSS.bind(this.payrollService), data: this.sssForm.value },
            30380: { form: this.taxForm, service: this.payrollService.postDynamicTAX.bind(this.payrollService), data: this.taxForm.value },
            30381: { form: this.hdmfForm, service: this.payrollService.postDynamicHDMF.bind(this.payrollService), data: this.hdmfForm.value },
            30382: { form: this.phicForm, service: this.payrollService.postDynamicPHIC.bind(this.payrollService), data: this.phicForm.value }
        };

        const statutory = this.sssForm.value.statutory;
        const selectedForm = form[statutory];

        if (selectedForm) {
            const validation = selectedForm.form.valid;
            selectedForm.form.markAllAsTouched();

            if (validation) {
                const dialogRef = this.message.open(SaveMessage);
                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        this.isSave = true;
                        selectedForm.service(selectedForm.data).subscribe({
                            next: (value: any) => {
                                if (value.statusCode === 200) {
                                    this.message.open(SuccessMessage);
                                    this.isSave = false;
                                    this.router.navigate(['/detail/statutory-view']);
                                } else {
                                    this.message.open(FailedMessage);
                                    console.log(value.stackTrace);
                                    console.log(value.message);
                                }
                            },
                            error: (e) => {
                                this.isSave = false;
                                this.message.open(FailedMessage);
                                console.error(e);
                            }
                        });
                    }
                });
            }
        }

    }

    checkEm() {

        var name = this.sssForm.get('name').value
            if (name === null || name === undefined ) {
                  console.log("name is null or undefined");
            }
            else{
                  console.log("name has value");
            }

        var desc =  this.sssForm.get('description').value
            if (desc === null || desc === undefined ) {
                  console.log("desc is null or undefined");
            }
            else{
                  console.log("desc has value");
            }

        var frequency =  this.sssForm.get('frequency').value
            if (frequency === null || frequency === undefined ) {
                  console.log("frequency is null or undefined");
            }
            else{
                  console.log("frequency has value");
            }

        var firstCutOff =  this.sssForm.get('firstCutOff').value
            if (firstCutOff === null || firstCutOff === undefined ) {
                  console.log("firstCutOff is null or undefined");
            }
            else{
                  console.log("firstCutOff has value");
            }

        var firstMax =  this.sssForm.get('firstMax').value
            if (firstMax === null || firstMax === undefined ) {
                  console.log("firstMax is null or undefined");
            }
            else{
                  console.log("firstMax has value");
            }

        var secondCutoff =  this.sssForm.get('secondCutoff').value
            if (secondCutoff === null || secondCutoff === undefined ) {
                  console.log("secondCutoff is null or undefined");
            }
            else{
                  console.log("secondCutoff has value");
            }

        var secondMax =  this.sssForm.get('secondMax').value
            if (secondMax === null || secondMax === undefined ) {
                  console.log("secondMax is null or undefined");
            }
            else{
                  console.log("secondMax has value");
            }

        var active =  this.sssForm.get('active').value
            if (active === null || active === undefined ) {
                  console.log("active is null or undefined");
            }
            else{
                  console.log("active has value");
            }

        var basic =  this.sssForm.get('basic').value
            if (basic === null || basic === undefined ) {
                  console.log("basic is null or undefined");
            }
            else{
                  console.log("basic has value");
            }

        var basicvalue =  this.sssForm.get('basicvalue').value
            if (basicvalue === null || basicvalue === undefined ) {
                  console.log("basicvalue is null or undefined");
            }
            else{
                  console.log("basicvalue has value");
            }

        var attendance =  this.sssForm.get('attendance').value
            if (attendance === null || attendance === undefined ) {
                  console.log("attendance is null or undefined");
            }
            else{
                  console.log("attendance has value");
            }

        var leave =  this.sssForm.get('leave').value
            if (leave === null || leave === undefined ) {
                  console.log("leave is null or undefined");
            }
            else{
                  console.log("leave has value");
            }

        var earnings =  this.sssForm.get('earnings').value
            if (earnings === null || earnings === undefined ) {
                  console.log("earnings is null or undefined");
            }
            else{
                  console.log("earnings has value");
            }

        var earnings =  this.sssForm.get('earnings').value
            if (earnings === null || earnings === undefined ) {
                  console.log("earnings is null or undefined");
            }
            else{
                  console.log("earnings has value");
            }

            var basic =  this.sssForm.get('basic').value
            if (basic === null || basic === undefined ) {
                  console.log("basic2 is null or undefined");
            }
            else{
                  console.log("basic2 has value");
            }

        var basicvalue =  this.sssForm.get('basicvalue').value
            if (basicvalue === null || basicvalue === undefined ) {
                  console.log("basicvalue2 is null or undefined");
            }
            else{
                  console.log("basicvalue2 has value");
            }

        var attendance =  this.sssForm.get('attendance').value
            if (attendance === null || attendance === undefined ) {
                  console.log("attendance2 is null or undefined");
            }
            else{
                  console.log("attendance2 has value");
            }

        var leave =  this.sssForm.get('leave').value
            if (leave === null || leave === undefined ) {
                  console.log("leave2 is null or undefined");
            }
            else{
                  console.log("leave2 has value");
            }

        var earnings =  this.sssForm.get('earnings').value
            if (earnings === null || earnings === undefined ) {
                  console.log("earnings2 is null or undefined");
            }
            else{
                  console.log("earnings2 has value");
            }



      }

      filteredOption(form,fg) {
            // 30387 "Fixed"
            // 30388 "Calculated"
            // 30389 "ADJ from 1st cut-off"
            // 30390 "Not Applicable"
        var out = []
            switch (fg.value.frequency) {
                case 0:
                    out = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30389)
                    break;
                case 1:

                var oo = []

                    var drop = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30389);
                    var drop2 = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30387 && x.dropdownID !== 30388 && x.dropdownID !== 30390);

                    if(fg.value.firstCutOff == 30390){ // 1stcutoff Not Applicable then 2ndcutoff fixed & calc
                        var drop3 = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30389);
                        oo = form ? drop : drop3
                    } else
                    if(fg.value.firstCutOff == 30387 || fg.value.firstCutOff == 30388) { // fixed or calc then 2ndcutoff adj and not applicable
                        var drop4 = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30387 && x.dropdownID !== 30388);
                        oo = form ? drop : drop4
                    }
                    else {
                         fg.get('secondCutoff').setValue(30389)
                         oo = form ? drop : drop2
                    }
                    out = oo
                    break;
                case 2 :
                    out = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30389)
                    break;
            }
            return out
        }

     calcFull(form){

        switch (form.value.frequency) {
            case 0:

            if(form.value.firstCutOff == 30390)
                form.get('secondCalc').setValue(30397)

                break;

            case 1:

                if (form.value.firstCutOff == 30390 && form.value.secondCutoff == 30388) {
                    form.get('secondCalc').setValue(30397)
                }

                break;
        }
     }

         taxOpt(form) {
            // 30387 "Fixed"
            // 30388 "Calculated"
            // 30389 "ADJ from 1st cut-off"
            // 30390 "Not Applicable"

            var out = []
            switch (this.taxForm.value.frequency) {
                case 0:
                    out = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30389)
                    break;
                case 1:

                var oo = []

                    var drop = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30389); //no adj
                    var drop2 = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30387 && x.dropdownID !== 30388); // no fix and calc

                    if(this.taxForm.value.firstCutOff == 30388){ // 1stcutoff Calculated then 2ndcutoff calculated
                        var drop3 = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30387 && x.dropdownID !== 30389 && x.dropdownID !== 30390); // no fix and calc
                        this.taxForm.get('secondCutoff').setValue(30388)
                        oo = form ? drop : drop3
                    } else
                    if(this.taxForm.value.firstCutOff == 30387) { // 1st fixed then 2ndcutoff adj
                        var drop4 = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30387 && x.dropdownID !== 30388);
                        this.taxForm.get('secondCutoff').setValue(30389)
                        oo = form ? drop : drop4
                    }
                    else {
                        var drop5 = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30387 && x.dropdownID !== 30389); // not applicable
                        oo = form ? drop : drop5
                    }
                    out = oo
                    break;
                case 2 :
                    out = this.dropdownOptions.calculationTypeDef.filter(x => x.dropdownTypeID === 126 && x.dropdownID !== 30389)
                    break;
            }
            return out
        }

        taxRate(form) {
            // 30401  Monthly Tax Rate
            // 30402  Semi-Monthly Tax Rate
            // 30403  Weekly Tax Rate
            // 30404  Annual Tax Rate
            // 30405  Contractor 5%
            // 30406  Contractor 10%
            var out = []
            switch (this.taxForm.value.frequency) {
                case 0:
                    out = this.dropdownOptions.taxMonRateDef
                    break;
                case 1:

                var oo = []

                    var drop = this.dropdownOptions.taxSemiRateDef
                    var drop4 = this.dropdownOptions.taxSemiCustomDef.filter(x => x.dropdownTypeID === 130 && x.dropdownID !== 30402 && x.dropdownID !== 30403);

                    if(this.taxForm.value.firstCalc == 30405){ // 1st contractor 5% then 2nd 5%
                        var drop1 = this.dropdownOptions.taxSemiRateDef.filter(x => x.dropdownTypeID === 130 && x.dropdownID !== 30401 && x.dropdownID !== 30402 && x.dropdownID !== 30403 && x.dropdownID !== 30404 && x.dropdownID !== 30406);
                        this.taxForm.get('secondCalc').setValue(30405)
                        oo = form ? drop : drop1
                    } else
                    if(this.taxForm.value.firstCalc == 30406) { // 1st contractor 10% then 2nd 10%
                        var drop2 = this.dropdownOptions.taxSemiRateDef.filter(x => x.dropdownTypeID === 130 && x.dropdownID !== 30401 && x.dropdownID !== 30402 && x.dropdownID !== 30403 && x.dropdownID !== 30404 && x.dropdownID !== 30405);
                        this.taxForm.get('secondCalc').setValue(30406)
                        oo = form ? drop : drop2
                    }else
                    if(this.taxForm.value.firstCalc == 30402) { // 1st semi then 2nd month,semi,annual
                        var drop3 = this.dropdownOptions.taxSemiCustomDef.filter(x => x.dropdownTypeID === 130 && x.dropdownID !== 30403 && x.dropdownID !== 30405 && x.dropdownID !== 30406);
                        oo = form ? drop : drop3
                    }
                    else
                    { // 2nd adj then tax rate month,annual,contractor 5%, contractor 10%
                        oo = form ? drop : drop4
                    }
                    out = oo
                    break;
                case 2 :
                    out = this.dropdownOptions.taxWeekRateDef
                    break;
            }
            return out
        }



    select(formGroup) {
        // 30391 basic current
        //     // 30392 basic_monthly
        //     // 30393 overtime
        //     // 30394 holiday
        if (formGroup.value.basic) {

            formGroup.get('basic_Current_Month').setValue(formGroup.value.basic.some(x => x === 30391)),
            formGroup.get('basic_Monthly').setValue(formGroup.value.basic.some(x => x === 30392)),
            formGroup.get('overtime').setValue(formGroup.value.basic.some(x => x === 30393)),
            formGroup.get('holiday').setValue(formGroup.value.basic.some(x => x === 30394))

        }

    }

}
