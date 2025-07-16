import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownID, DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { CategoryEmployee } from 'app/model/employee/category';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CategoryService } from 'app/services/categoryService/category.service';
import { CoreService } from 'app/services/coreService/coreService.service';
import { LeaveService } from 'app/services/leaveService/leave.service';
import { MasterService } from 'app/services/masterService/master.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { forkJoin } from 'rxjs';
import { GF } from 'app/shared/global-functions'

export interface PeriodicElement {
    module: string;
    sub_module: string;
    approval_process: string;
}

@Component({
    selector: 'app-category-detail',
    templateUrl: './category-detail.component.html',
    styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
    categoryForm: FormGroup
    isSave: boolean = false
    isLinear = false;
    dropdownOptions = new DropdownOptions
    orient: string = "horizontal"
    dropdownFixRequest = new DropdownRequest
    dropdownRequest = new DropdownRequest
    dropdownDefRequest = new DropdownRequest
    workflowDropdownRequest = new DropdownRequest
    empcatdropdownDefRequest = new DropdownRequest
    leavetyperequest = new DropdownRequest
    bundyId = []
    overtimeTypeId = []
    leaveTypeId = []
    id: string;
    disabled: boolean = true;
    readonly: boolean = true;

    disableTextbox = false;
    disablepostshift = false;
    disablepretshift = false;
    isPreErr = false;
    isPostErr = false;
    isRDErr = false;
    leaveLateFilling: any

    displayedColumns: string[] = ['module', 'sub_module', 'approval_process'];
    dataSource = [];

    LeaveList = []
    Leavelistedit = []

    constructor(
        private fb: FormBuilder,
        private tenantService: TenantService,
        private masterService: MasterService,
        private router: Router,
        private route: ActivatedRoute,
        private leaveService: LeaveService,
        private message: FuseConfirmationService,
        private coreService: CoreService,
        private categoryService: CategoryService,
        private changeDetector: ChangeDetectorRef) { }

    ngOnInit() {

        this.id = this.route.snapshot.paramMap.get('id')
        this.categoryForm = this.fb.group(new CategoryEmployee())

        // this.categoryForm.disable();

        if (this.id !="") {
            this.categoryService.getCategory(this.id).subscribe({
                next: (value: any) => {
                    if (value.statusCode == 200) {
                        this.categoryForm.patchValue(value.payload)
                        this.categoryForm.get('multiplePostShift').setValue(value.payload.multiplePostShift)
                        const patchValue = JSON.parse(JSON.stringify(value.payload))
                        this.Leavelistedit = patchValue.categoryEmployeeLeave
                        const overtime = (patchValue.overtimeTypeId.length > 0 ? patchValue.overtimeTypeId.map(item => ({
                            dropdownID: item,
                            dropdownTypeID: 52,
                        })) : [{ dropdownID: 0, dropdownTypeID: 52 }])
                        const bundy = (patchValue.categoryBundyType !== null && patchValue.categoryBundyType.length > 0 ? patchValue.categoryBundyType.map(item => ({
                            dropdownID: item,
                            dropdownTypeID: 68,
                        })) : [{ dropdownID: 0, dropdownTypeID: 68 }])

                        const leave = (patchValue.categoryEmployeeLeave.length > 0 ? patchValue.categoryEmployeeLeave.map(item => ({
                            dropdownID: item,
                            dropdownTypeID: 0,
                        })) : [{ dropdownID: 0, dropdownTypeID: 0 }])

                        // this.dropdownFixRequest.id.push(
                        //     { dropdownID: value.payload.coeLateFilling, dropdownTypeID: 131},

                        // )
                        this.dropdownFixRequest.id = [
                            this.dropdownFixRequest.id,
                            ...overtime,
                            ...bundy,
                            ...[
                                { dropdownID: 0, dropdownTypeID: 131 },
                                { dropdownID: 0, dropdownTypeID: 78 },
                                { dropdownID: 0, dropdownTypeID: 68 },
                                { dropdownID: 0, dropdownTypeID: 118 },
                                { dropdownID: 0, dropdownTypeID: 149 },
                                { dropdownID: 0, dropdownTypeID: 171 },
                                // { dropdownID: patchValue.preShiftExpirationBasis, dropdownTypeID: 78 },

                            ]
                        ].filter(x => x.dropdownID != undefined)

                        this.dropdownRequest.id.push(
                            { dropdownID: patchValue.accessLevelId, dropdownTypeID: 0 },
                            { dropdownID: patchValue.approvalLevelId, dropdownTypeID: 0 })

                        // this.dropdownRequest.id.push(
                        //     { dropdownID: 0, dropdownTypeID: 14 },
                        //     { dropdownID: 0, dropdownTypeID: 17 })



                        forkJoin({
                            dropdownFix: this.masterService.getDropdownFix(this.dropdownFixRequest),
                            dropdown: this.tenantService.getDropdown(this.dropdownRequest),
                            timekeeping: this.coreService.getCoreDropdown(1012, this.empcatdropdownDefRequest),
                            payroll: this.coreService.getCoreDropdown(1013, this.empcatdropdownDefRequest),
                            access: this.coreService.getCoreDropdown(1008, this.empcatdropdownDefRequest),
                            holiday: this.coreService.getCoreDropdown(1030, this.empcatdropdownDefRequest),
                            leaveType: this.leaveService.getLeaveTypeDropdown(this.dropdownDefRequest),
                            workflow: this.tenantService.getApprovalWorkflowDropdown(this.workflowDropdownRequest),
                            approval: this.tenantService.getApprovalModules(this.id)
                        }).subscribe({
                            next: (response) => {
                                this.dropdownOptions.AccessControldef = response.access.payload
                                this.dropdownOptions.payrollTypeDef = response.timekeeping.payload
                                this.dropdownOptions.empcatpayrolldef = response.payroll.payload

                                // for multiple dropdown only
                                const uniqueDropdownFix: any = [...new Map(response.dropdownFix.payload.map(item =>
                                    [item["dropdownID"], item])).values()];

                                this.dropdownOptions.leaveTypeDef = [...new Map(response.leaveType.payload.map(item =>
                                    [item["dropdownID"], item])).values()];

                                // For fix
                                this.dropdownOptions.holidayBasedDef = uniqueDropdownFix.filter(x => x.dropdownTypeID == 20)
                                this.dropdownOptions.overtimeTypeDef = uniqueDropdownFix.filter(x => x.dropdownTypeID == 52)
                                this.dropdownOptions.bundydef = uniqueDropdownFix.filter(x => x.dropdownTypeID == 68)
                                this.dropdownOptions.offsetTypepDef = uniqueDropdownFix.filter(x => x.dropdownTypeID == 78)
                                this.dropdownOptions.allowedfilingdef = uniqueDropdownFix.filter(x => x.dropdownTypeID == 131)
                                this.dropdownOptions.emprequirdef = uniqueDropdownFix.filter(x => x.dropdownTypeID == 171)
                                this.dropdownOptions.accessLevelDef = response.dropdown.payload.filter(x => x.dropdownTypeID == 14)
                                this.dropdownOptions.approvalGroupDef = response.dropdown.payload.filter(x => x.dropdownTypeID == 17)
                                this.dropdownOptions.beyondLogs = uniqueDropdownFix.filter(x => x.dropdownTypeID == 149)

                                this.dropdownOptions.usetiful = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 118)
                                // For Custom

                                this.dataSource = response.approval.payload;
                                // this.dropdownOptions.approvalDef = response.workflow.payload
                                 this.dropdownOptions.approvalDef = response.workflow.payload.map(item => ({
                                    dropdownID: item.dropdownID,
                                    description: item.description,
                                }))


                                this.dropdownOptions.approvalDef.unshift({
                                    dropdownID: -1,
                                    description: 'Auto Approved',
                                    active : true,
                                    deleted : false,
                                    dropdownTypeID : 0,
                                    encryptID : '',
                                })


                                // For Approval
                                // this.dropdownOptions.approvalDef = response.workflow.payload.map(item => ({
                                //     dropdownID: item.dropdownID,
                                //     description: item.description,
                                // }))





                                // this.dropdownOptions.approvalDef.push({
                                //     dropdownID: 0,
                                //     description: "Auto Approved",
                                // })




                            },
                            error: (e) => {
                                console.error(e)
                            },
                            complete: () => {
                                this.dropdownOptions.leaveTypeDef.forEach(element => {
                                    var ll = this.Leavelistedit.find(x => x.dropdownId == element.dropdownID)
                                    var has = GF.IsEmpty(ll)
                                    var obj = {
                                        leaveName:             element.description,
                                        enableLeave:           has ? false : ll.enableLeave,
                                        categoryId:            has ? 0     : ll.categoryId,
                                        dropdownId:            has           || element.dropdownID === 0 ? element.dropdownID : ll.dropdownId,
                                        leaveApprovalLevelId:  has ? 0     : ll.leaveApprovalLevelId,
                                        categoryLeaveBefore:   has ? 0     : ll.categoryLeaveBefore,
                                        leaveDescription:      has ? ""    : ll.leaveDescription,
                                        categoryLeaveAfter:    has ? 0     : ll.categoryLeaveAfter,
                                        leaveLateFilling:      has ? 0     : ll.leaveLateFilling,
                                        leaveLateCancellation: has ? 0     : ll.leaveLateCancellation,
                                        categoryLeaveRequired:         has ? 0     : ll.categoryLeaveRequired
                                    }
                                    this.LeaveList.push(obj)
                                });

                                this.categoryForm.enable()
                                this.Disablerd(['changeScheduleBefore', 'changeScheduleAfter', 'changeScheduleLateFilling', 'changeScheduleLateCancellation','enableChangeSchedule','changeScheduleRequired'], this.categoryForm.get('enableChangeSchedule'))
                                this.Disablerd(['changeLogBefore', 'changeLogAfter', 'changeLogLateFilling', 'changeLogLateCancellation','enableChangeLog','changeLogRequired'], this.categoryForm.get('enableChangeLog'))
                                this.Disablerd(['officialBusinessBefore', 'officialBusinessAfter', 'officialBusinessLateFilling', 'officialBusinessLateCancellation','enableOfficialBusiness','officialBusinessRequired'], this.categoryForm.get('enableOfficialBusiness'))
                                this.Disablerd(['overtimeBefore', 'overtimeAfter', 'overtimeLateFilling', 'overtimeLateCancellation','enableOvertime','overtimeRequired'], this.categoryForm.get('enableOvertime'))
                                this.Disablerd(['offsetBefore', 'offsetAfter', 'offsetLateFilling', 'offsetLateCancellation','enableOffset','offsetRequired'], this.categoryForm.get('enableOffset'))
                                this.Disablerd(['coeBefore', 'coeAfter', 'coeLateFilling', 'coeLateCancellation','enableCOE','coeRequired'], this.categoryForm.get('enableCOE'))
                                this.Disablerd(['multiplePreShift', 'preShiftMinimumDays', 'preShiftMaximumDays', 'preShiftStepDays', 'preShiftNumberOfDaysExpiration', 'preShiftExpirationBasis','preOtSetup','enablePreShift'], this.categoryForm.get('enablePreShift'))
                                this.Disablerd(['multiplePostShift', 'postShiftMinimumDays', 'postShiftMaximumDays', 'postShiftStepDays', 'postShiftNumberOfDaysExpiration', 'postShiftExpirationBasis','postOtSetup','enablePostShift'], this.categoryForm.get('enablePostShift'))
                                this.Disablerd(['multipleRDHoliday', 'rdHolidayMinimumDays', 'rdHolidayMaximumDays', 'rdHolidayStepDays', 'rdHolidayNumberOfDaysExpiration', 'rdHolidayRDHolidayExpirationBasis','rdOtSetup','enableRDHoliday'], this.categoryForm.get('enableRDHoliday'))
                                this.Disablerd(['locationBefore', 'locationAfter', 'locationLateFilling', 'locationLateCancellation','enableLocation','locationRequired'], this.categoryForm.get('enableLocation'))

                            },
                        });
                    }
                }
            })
        }else {

            this.dropdownFixRequest.id.push(
                { dropdownID: 0, dropdownTypeID: 20 },
                { dropdownID: 0, dropdownTypeID: 52 },
                { dropdownID: 0, dropdownTypeID: 68 },
                { dropdownID: 0, dropdownTypeID: 78 },
                { dropdownID: 0, dropdownTypeID: 131 },
                { dropdownID: 0, dropdownTypeID: 118 },
                { dropdownID: 0, dropdownTypeID: 149},
                { dropdownID: 0, dropdownTypeID: 171},
                )

            this.dropdownRequest.id.push(
                { dropdownID: 0, dropdownTypeID: 14 },
                { dropdownID: 0, dropdownTypeID: 17 })

            this.dropdownDefRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
            this.workflowDropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })

            forkJoin({
                dropdownFix: this.masterService.getDropdownFix(this.dropdownFixRequest),
                dropdown: this.tenantService.getDropdown(this.dropdownRequest),
                leaveType: this.leaveService.getLeaveTypeDropdown(this.leavetyperequest),
                timekeeping: this.coreService.getCoreDropdown(1012, this.empcatdropdownDefRequest),
                payroll: this.coreService.getCoreDropdown(1013, this.empcatdropdownDefRequest),
                approval: this.tenantService.getApprovalModules(this.id),
                workflow: this.tenantService.getApprovalWorkflowDropdown(this.workflowDropdownRequest),
                access: this.coreService.getCoreDropdown(1008, this.empcatdropdownDefRequest),

            }).subscribe({
                next: (response) => {
                    // for fix
                    this.dropdownOptions.accessLevelDef = response.dropdown.payload.filter(x => x.dropdownTypeID == 14)
                    this.dropdownOptions.approvalGroupDef = response.dropdown.payload.filter(x => x.dropdownTypeID == 17)
                    this.dropdownOptions.holidayBasedDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 20)
                    this.dropdownOptions.overtimeTypeDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 52)
                    this.dropdownOptions.bundydef = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 68)
                    this.dropdownOptions.offsetTypepDef = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 78)
                    this.dropdownOptions.allowedfilingdef = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 131)
                    this.dropdownOptions.emprequirdef = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 171)
                    this.dropdownOptions.usetiful = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 118)
                    this.dropdownOptions.beyondLogs = response.dropdownFix.payload.filter(x => x.dropdownTypeID == 149)


                    // For Custom
                    this.dropdownOptions.payrollTypeDef = response.timekeeping.payload
                    this.dropdownOptions.empcatpayrolldef = response.payroll.payload
                    this.dropdownOptions.leaveTypeDef = response.leaveType.payload
                    this.dropdownOptions.AccessControldef = response.access.payload

                    // For Approval

                    this.dataSource = response.approval.payload;
                    this.dropdownOptions.approvalDef = response.workflow.payload.map(item => ({
                        dropdownID: item.dropdownID,
                        description: item.description,
                    }))

                    this.dropdownOptions.approvalDef.push({
                        dropdownID: -1,
                        description: 'Auto Approved',
                        active : true,
                        deleted : false,
                        dropdownTypeID : 0,
                        encryptID : '',
                    })
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                    if ( this.categoryForm.value.enablePreShift == false ||
                        this.categoryForm.value.enablePostShift == false ||
                        this.categoryForm.value.enableRDHoliday == false ||
                        this.categoryForm.value.enableChangeSchedule == false ||
                        this.categoryForm.value.enableChangeLog == false ||
                        this.categoryForm.value.enableOfficialBusiness == false ||
                        this.categoryForm.value.enableOvertime == false ||
                        this.categoryForm.value.enableOffset == false ||
                        this.categoryForm.value.enableCOE == false ||
                        this.categoryForm.value.enableLocation == false) {

                        this.Disablerd(['multiplePreShift','preShiftMinimumDays','preShiftMaximumDays','preShiftStepDays','preShiftNumberOfDaysExpiration','preShiftExpirationBasis','preOtSetup','enablePreShift'], this.categoryForm.get('enablePreShift'))
                        this.Disablerd(['multiplePostShift','postShiftMinimumDays','postShiftMaximumDays','postShiftStepDays','postShiftNumberOfDaysExpiration','postShiftExpirationBasis','postOtSetup','enablePostShift'], this.categoryForm.get('enablePostShift'))
                        this.Disablerd(['multipleRDHoliday','rdHolidayMinimumDays','rdHolidayMaximumDays','rdHolidayStepDays','rdHolidayNumberOfDaysExpiration','rdHolidayRDHolidayExpirationBasis','rdOtSetup','enablePostShift','enableRDHoliday'], this.categoryForm.get('enableRDHoliday'))
                        this.Disablerd(['changeScheduleBefore','changeScheduleAfter','changeScheduleLateFilling', 'changeScheduleLateCancellation','enableChangeSchedule','changeScheduleRequired'], this.categoryForm.get('enableChangeSchedule'))
                        this.Disablerd(['changeLogBefore','changeLogAfter','changeLogLateFilling','changeLogLateCancellation','enableChangeLog','changeLogRequired'], this.categoryForm.get('enableChangeLog'))
                        this.Disablerd(['officialBusinessBefore','officialBusinessAfter','officialBusinessLateFilling','officialBusinessLateCancellation','enableOfficialBusiness','officialBusinessRequired'], this.categoryForm.get('enableOfficialBusiness'))
                        this.Disablerd(['overtimeBefore','overtimeAfter','overtimeLateFilling','overtimeLateCancellation','enableOvertime','overtimeRequired'], this.categoryForm.get('enableOvertime'))
                        this.Disablerd(['offsetBefore','offsetAfter','offsetLateFilling','offsetLateCancellation','enableOffset','offsetRequired'], this.categoryForm.get('enableOffset'))
                        this.Disablerd(['coeBefore','coeAfter','coeLateFilling', 'coeLateCancellation','enableCOE','coeRequired'], this.categoryForm.get('enableCOE'))
                        this.Disablerd(['locationBefore','locationAfter', 'locationLateFilling','locationLateCancellation','enableLocation','locationRequired'], this.categoryForm.get('enableLocation'))
                    }
                    this.categoryForm.get('overtimeTypeId').enable()
                    this.dropdownOptions.leaveTypeDef.forEach(element => {
                        var obj = {
                            leaveName: element.description,
                            enableLeave: true,
                            categoryId: 0,
                            dropdownId: element.dropdownID,
                            leaveApprovalLevelId: 0,
                            categoryLeaveBefore: 0,
                            leaveDescription: element.description,
                            categoryLeaveAfter: 0,
                            leaveLateFilling: 0,
                            leaveLateCancellation: 0,
                            categoryLeaveRequired: 0
                        }
                        this.LeaveList.push(obj)
                    });
                },
            });
        }
    }

    overtimeHandler(e) {
        if (!e.checked) {
            this.categoryForm.controls.categoryAllowedOvertime.patchValue([]);
        }
    }

    stepChanged(event: StepperSelectionEvent) {
        if (event.selectedIndex == 4) {
            event.selectedStep.interacted = false
        }
    }

    changeOrient() {
        if (this.orient == "vertical") {
            this.orient = "horizontal"
        } else {
            this.orient = "vertical"
        }
    }

    submit(): void {
        debugger
        // this.handleDetailMapping()
        this.categoryForm.markAllAsTouched()
        this.categoryForm.get("categoryEmployeeLeave").setValue(this.LeaveList)
        this.categoryForm.get("categoryApproval").setValue(this.dataSource)
        this.categoryForm.get('locationApprovalLevelId').setValue(0)
        this.categoryForm.get('usetiful').setValue(0)
         var form = this.categoryForm.getRawValue()
        if (this.categoryForm.valid) {
            const dialogRef = this.message.open(SaveMessage);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == "confirmed") {
                    this.isSave = true
                    this.categoryService.postCategory(form).subscribe({
                        next: (value: any) => {
                            if (value.statusCode == 200) {
                                this.message.open(SuccessMessage);
                                this.isSave = false,
                                    this.router.navigate(['/search/category-list']);
                            }
                            else {
                                this.message.open(FailedMessage);
                                console.log(value.stackTrace)
                                console.log(value.message)
                            }
                        },
                        error: (e) => {
                            this.isSave = false
                            this.message.open(FailedMessage);
                            console.error(e)
                        }
                    });
                }
            });
        }
    }

    handleDetailMapping() {
        this.categoryForm.controls.categoryAllowedOvertime.patchValue(
            this.categoryForm.value.overtimeTypeId.map(item => ({
                categoryEmployeeLeaveId: 0,
                categoryId: 0,
                dropdownId: item,
            }))
        )
        this.categoryForm.controls.categoryAllowedBundy.patchValue(
            this.categoryForm.value.bundyId.map(item => ({
                categoryAllowedBundyId: 0,
                categoryId: 0,
                dropdownId: item,
            }))
        )
        this.categoryForm.controls.categoryEmployeeLeave.patchValue(
            this.categoryForm.value.leaveTypeId.map(item => ({
                categoryAllowedOvertimeId: 0,
                categoryId: 0,
                leaveTypeId: item,
            }))
        )

    }

    Disablerd(e: Array<any>, v) {
        if (!v) {

        }
        if (!v.value) {
            e.forEach(ee => {
                if (ee == "multiplePreShift" || ee == "multiplePostShift" || ee == "multipleRDHoliday") {
                    this.categoryForm.get(ee).disable();
                }else if(ee == "enablePreShift" ||
                    ee == "enablePostShift" ||
                    ee == "enableRDHoliday" ||
                    ee == "enableChangeSchedule" ||
                    ee == "enableChangeLog" ||
                    ee == "enableOfficialBusiness" ||
                    ee == "enableOvertime" ||
                    ee == "enableOffset" ||
                    ee == "enableCOE" ||
                    ee == "enableLocation"){
                    this.categoryForm.get(ee).enable();
                }else{
                    this.categoryForm.get(ee).disable();
                }
            });
        }else if(v.value){
            e.forEach(ee => {
                if (ee == "multiplePreShift" || ee == "multiplePostShift" || ee == "multipleRDHoliday") {
                    this.categoryForm.get(ee).enable();
                }else{
                    this.categoryForm.get(ee).enable();
                }
            });
        }
    }

    disabledselect() {

    }

    Disablerd_days(e: Array<any>, v) {
        if (!v.value) {
            e.forEach(ee => {
                this.categoryForm.get(ee).disable();

            });
        } else {
            e.forEach(ee => {
                this.categoryForm.get(ee).enable();
            });
        }
    }

    filing_restrict(e, v, t) {
        var before = this.categoryForm.get(e).value
        var after = this.categoryForm.get(v).value
        var type = this.categoryForm.get(t).value

        if (before === 0 && after === 0 && !type) {
            this.categoryForm.get(v).disable()
            return
        }
        if (before !== 0) {
            this.categoryForm.get(v).disable()
        } else if (before == 0) {
            this.categoryForm.get(v).enable()
        } else if (after !== 0) {
            this.categoryForm.get(e).disable()
        } else if (after == 0) {
            this.categoryForm.get(e).enable()
        }
    }

    otminmax(e, v, o) {
        this.isPreErr = false
        this.isPostErr = false
        this.isRDErr = false
        var min = this.categoryForm.get(e).value
        var max = this.categoryForm.get(v).value

        if (min > max && min > 0 && max > 0) {
            if (o == 1) {
                this.isPreErr = true
                this.categoryForm.get('premin').setValue('')

            }
            if (o == 2) {
                this.isPostErr = true
                this.categoryForm.get('postmin').setValue('')

            }
            if (o == 3) {
                this.isRDErr = true
                this.categoryForm.get('rdmin').setValue('')
            }
        }
    }
    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
    showhide(e) {
        return e == 0 || e == 105 ? false : true
    }
}
