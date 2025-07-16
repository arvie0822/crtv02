import { style } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { Employee, EmployeeInformation, EmployeeAdmin, EmployeeDependents, Unsaved, EmployeeMovement, EmployeeOther, timekeepingCategoryException, EmployeeHoldPayroll } from 'app/model/employee/employee-detail';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CategoryService } from 'app/services/categoryService/category.service';
import { MasterService } from 'app/services/masterService/master.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { UserService } from 'app/services/userService/user.service';
import { LeaveService } from 'app/services/leaveService/leave.service';
import { forkJoin } from 'rxjs';
import { DatePipe, NgSwitchCase } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { ShiftService } from 'app/services/shiftService/shift.service';
import { DropdownID } from 'app/model/dropdown-custom.model';
import { CoreService } from 'app/services/coreService/coreService.service';
import { myData } from 'app/app.moduleId';
import { TimekeepingCategoryComponent } from '../timekeeping-category/timekeeping-category/timekeeping-category.component';
import { setValue } from '@ngneat/transloco';
import { PayrollHeader } from 'app/model/administration/payroll-category';
import { TimekeepingCategoryForm } from 'app/model/employee/timekeeping-category';
// import { DecimalPipe } from '@angular/common';
import { GF } from 'app/shared/global-functions'
import _ from 'lodash';
import { PayrollService } from 'app/services/payrollService/payroll.service';
import { TableRequest } from 'app/model/datatable.model';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EffectiveDateComponent } from './effective-date/effective-date.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-employee-detail',
    templateUrl: './employee-detail.component.html',
    styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

    // form = new FormGroup({
    //     rateMonthly : new FormControl('', { })
    // });
    // rateMonthly : number

    formControlsFetched = false;
    formGroup: FormGroup[];
    pipe = new DatePipe('en-US');
    @ViewChild('BioTable') BioTable: MatTable<any>;
    @ViewChild('TimekeepingCategoryComponent') tkComponent: TimekeepingCategoryComponent;
    @ViewChild('Table_payroll') Table_payroll: MatTable<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    employeeForm: FormGroup
    adminForm: FormGroup
    unSavedForm: FormGroup
    employeeDependentsForm: FormGroup
    employeeInformationForm: FormGroup
    payrollstatForm: FormGroup

    //tk category
    timekeepingCategoryForm: any
    payrollForm: any

    dropdownFixRequest = new DropdownRequest;
    dropdownRequest = new DropdownRequest
    dropdownCutoffRequest = new DropdownRequest
    dropdownDefRequest = new DropdownRequest
    dropdownOptions = new DropdownOptions
    dropdownID = new DropdownID
    dropdownCustom = new DropdownRequest
    dropdownRequestsub = new DropdownRequest
    category = new DropdownRequest
    supervisor = new DropdownRequest
    subcompany = new DropdownRequest
    access = new DropdownRequest
    branch = new DropdownRequest
    payrollacc = new DropdownRequest
    timekeeping = new DropdownRequest
    edlRequest = new TableRequest
    shiftRequest = new TableRequest
    minDate: Date;
    maxDate: Date;
    date: Date;
    age: number;
    // cpipe = new CurrencyPipe('en-US');
    // decipipe = new DecimalPipe('en-US');
    id: string;
    dt: Date;
    isEdit: boolean = false
    imagefile = []
    moduleId : any
    transactionId : any

    exceptiontk = [
        { id: 1, description: 'Timekeeping' },
        { id: 2, description: 'Payroll' },
        // {id: 2, description: 'Employee Category'},
        // {id: 3, description: 'Access Control'},
    ];

    exceptiontk_old = this.exceptiontk.slice()

    // exceptionpay = [

    //     { id: 1, description: 'Employee Category' },
    //     { id: 2, description: 'Access Control' },
    // ];

    // payroll = [
    //     { id: 0, description: 'Exception' },
    //     { id: 1, description: 'PayCat001' },
    //     { id: 2, description: 'PayCat002' },
    //     { id: 3, description: 'PayCat003' },
    // ]

    // tk = [
    //     { id: 0, description: 'Exception' },
    //     { id: 1, description: 'RNF' },
    //     { id: 2, description: 'Spvr' },
    //     { id: 3, description: 'Mgr' },
    // ]

    relationship = []
    //     { id: 0, description: 'Mother' },
    //     { id: 1, description: 'Father' },
    //     { id: 2, description: 'Spouse' },
    //     { id: 3, description: 'Relative' },
    //     { id: 4, description: 'Friend' },
    // ];

    dependents = []
    //     { id: 0, description: 'Mother' },
    //     { id: 1, description: 'Father' },
    //     { id: 2, description: 'Spouse' },
    //     { id: 3, description: 'Child' },
    //     { id: 4, description: 'Sibling' },
    // ];

    indef = [
        { id: 1, description: 'By Cutoff' },
        { id: 2, description: 'Indefinite' },
    ];


    dataSource: any = []
    displayedColumns: string[] = ['shiftCode', 'date', 'scheduleIn', 'scheduleOut', 'firstBreakIn', 'firstBreakOut', 'secondBreakIn', 'secondBreakOut', 'thirdBreakIn', 'thirdBreakOut', 'workingHours'];

    displayedColumns_leave: string[] = ['leave_type', 'total_balance', 'leave_used', 'pending_approval', 'pending_schedule', 'available'];
    dataSource_leave: any[] = []

    displayedColumns_dependent: string[] = ['idRelationship', 'firstName', 'middleName', 'lastName', 'birthDate', 'age', 'action'];
    dataSource_dependents = [];
    datasource_employeeOther = []
    datasource_employeeMovement = []

    displayedColumns_payroll: string[] = ['actionPay', 'rangeId', 'dateFrom', 'dateTo', 'payout', 'dateCreated', 'createdByName'];
    dataSource_payroll : any = []

    displayedColumns_EDL: string[] = ['type' ,'employeeId' ,'paycode' ,'amount' ,'cutoffId' ,'recurStartDate' ,'recurEndDate' ]
    dataSource_EDL: any[] = []

    @ViewChild('Table_dependents') Table_dependents: MatTable<any>;
    formData: any;

    isSave: boolean = false
    selectedProject: string = 'emp-pei.pei';
    selectedProject1: string = 'emp-woi';
    selectedProject2: string = 'emp-pai';
    selectedProject3: string = 'emp-s'
    selectedProject4: string = 'emp-l'
    selectedProject5: string = 'emp-O'
    selectedProject6: string = 'Exception'
    selectedProject7: string = 'Admin'
    selectedProject8: string = 'EDL'

    isPeI: boolean = true   // personal information
    isWoI: boolean = false  // work information
    isPaI: boolean = false  // payroll information
    isS: boolean = false    // shift
    isL: boolean = false    // leave
    isOther: boolean = false //others
    isException: boolean = false //exceptions
    isAdminTab: boolean = false //Admin
    isEDLTab: boolean = false //Admin

    isAdmin: boolean = false //Admin
    isView: boolean = true //view
    profile: boolean = false //view own profile
    monRate = 22323;

    isPeIfocus = "bg-default"
    isWoIfocus = ""
    isPaIfocus = ""
    isSfocus = ""
    isLfocus = ""
    isOtherfocus = ""
    isEfocus = ""
    isAdfocus = ""
    isEDLfocus = ""
    parentDetail = []
    submitbutton: boolean = true
    //added 4/26/2023
    personalIndex = 0
    selectedCategory = ""
    target = sessionStorage.getItem('u')
    dialogRef: MatDialogRef<EffectiveDateComponent, any>;
    movements = []

    hidePayroll: boolean = true
    hideAdmin: boolean = true
    hideOthers: boolean = true
    buttondis: boolean = false
    imageUrl: SafeResourceUrl = "assets\\images\\avatars\\computer-icons-user.jpg"
    imageprev : any
    loginId = 0
    totalRows: number = 0
    moduleIdstr: string = ""

    constructor(
        private fb: FormBuilder,
        private masterService: MasterService,
        // private shiftService: ShiftService,
        private payrollService: PayrollService,
        private tenantService: TenantService,
        private userService: UserService,
        private shiftService: ShiftService,
        private categoryService: CategoryService,
        private message: FuseConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private cp: CurrencyPipe,
        private coreService: CoreService,
        private storageServiceService: StorageServiceService,
        private dialog: MatDialog,
    ) { }

    get ei() { return this.employeeInformationForm.value }
    get ef() { return this.employeeForm.value }

    async ngOnInit() {
        // this.payrollForm = this.fb.group(new PayrollHeader());
        // this.timekeepingCategoryForm = this.fb.group(new TimekeepingCategoryForm());
        // this.employeeInformationForm.get('rateMonthly').setValue(this.cp.transform(100, 'PHP', 'symbol', '1.2-2'))
        this.parentDetail["view"] = true
        var action = sessionStorage.getItem("action")
        if (action == "view") {
            this.submitbutton = false
            this.isView = true
            this.isAdmin = true
        } else if (action == "view-profile"){
            this.submitbutton = false
            this.isView = true
            this.isAdmin = false
            this.hidePayroll = false
            this.profile = true
        } else {
            this.submitbutton = true
            this.isView = false
            this.isAdmin = true
        }

        if (sessionStorage.getItem('al') == 'Tg3R3dzL5d8qh2W0SyphdQ%3d%3d' || sessionStorage.getItem('al') == 'jJOtHsRVwYECOhoiBc69dA%3d%3d') {
            this.isAdmin = true
            this.hidePayroll = false
            this.hideAdmin = false
            this.hideOthers = false
        }


        this.maxDate = new Date();
        this.maxDate.setMonth(this.maxDate.getMonth() - 12 * 18);

        this.id = this.route.snapshot.paramMap.get('id');
        this.employeeForm = this.fb.group(new Employee());
        this.unSavedForm = this.fb.group(new Unsaved());
        this.employeeDependentsForm = this.fb.group(new EmployeeDependents());
        this.employeeInformationForm = this.fb.group(new EmployeeInformation());
        this.adminForm = this.fb.group(new EmployeeAdmin());
        this.payrollstatForm = this.fb.group(new EmployeeHoldPayroll)
        // this.payrollForm = this.fb.group(new EmployeeHoldPayroll());
        this.datasource_employeeOther.push(new EmployeeOther())
        this.datasource_employeeMovement.push(new EmployeeMovement())
        // this.timekeepingCategoryForm = this.fb.group(new timekeepingCategoryException())

        // var a  = this.curpipe.transform(this.nf.monthlyRate,'PHP', 'symbol', '1.2-2');
        // console.log(a)

        this.employeeInformationForm.get('idPayroll').setValue(null)
        this.employeeInformationForm.get('idTimekeeping').setValue(null)
        this.employeeForm.get('birthDate').setValue("")
        this.employeeDependentsForm.get('birthDate').setValue("")
        this.employeeForm.get('weight').setValue(null)
        this.employeeForm.get('height').setValue(null)
        this.employeeForm.get('idEmergencyRelation').setValue(0)
        this.employeeDependentsForm.get('idRelationship').setValue("")
        this.employeeDependentsForm.get('age').setValue("")

        this.unSavedForm.get('exceptionCateg').setValue("")

        this.edlRequest.OrderBy = "ASC"
        this.edlRequest.Order = "PayCode"

        this.shiftRequest.OrderBy = "ASC"
        this.shiftRequest.Order = "date"

        var moduleId = await this.encryptDecrypt(true,[sessionStorage.getItem('moduleId')]);
        this.moduleIdstr = moduleId['payload'][0]

        // this.regular()
        var dt = new Date();
        dt.setDate(dt.getDate() + 180);
        let dt1 = this.pipe.transform(dt, 'yyyy-MM-dd');
        this.employeeInformationForm.get('dateRegularized').setValue(dt1)
        if (this.id !== "") {
            this.target = this.id
            this.isEdit = true
            this.employeeForm.disable();
            this.employeeInformationForm.disable();
            this.adminForm.disable();
            this.employeeDependentsForm.disable();

            // this.adminView = (sessionStorage.getItem("ia") == "true")
            // this.parentDetail["edit"] = true

            // this.isView = false
            this.userService.getEmployee(this.id).subscribe({
                next: (value: any) => {
                    if (value.statusCode == 200) {

                        this.employeeForm.patchValue(JSON.parse(JSON.stringify(value.payload)))
                        console.log(this.employeeForm.value)
                        this.employeeInformationForm.patchValue(value.payload.employeeInformation)
                        this.timekeepingCategoryForm = value.payload.timekeepingCategoryException
                        this.payrollForm = value.payload.payrollCategoryException
                        this.adminForm.patchValue(value.payload.employeeAdmin)
                        // this.employeeDependentsForm.patchValue(value.payload.employeeDependents)
                        this.unSavedForm.patchValue(value.payload.unsaved)
                        this.dataSource_dependents = value.payload.employeeDependents
                        this.dataSource_payroll = GF.IsEmptyReturn(value.payload?.employeeAdmin?.employeeHoldPayroll,[])


                        var profile = "";
                        var defaultPath = "assets\\images\\avatars\\computer-icons-user.jpg"
                        if (value.payload.imagePath != "" && value.payload.imagePath != defaultPath) {
                            this.imageprev = "imagePath1-" + value.payload.imagePath
                            var number = sessionStorage.getItem('moduleId')
                            var moduleid = parseInt(number, 10);
                            this.previewimage(this.imageprev,value.payload.employeeId,moduleid)
                            profile = value.payload.imagePath
                        } else {
                            profile = GF.IsEmptyReturn(value.payload.imagePath, defaultPath)
                        }
                        this.employeeForm.get("imagePath").setValue(profile)

                        if (this.dataSource_dependents !== null) {
                            this.dataSource_dependents.forEach(dep => {
                                dep['idRelationshipdescrip'] = this.dependents.find(x => x.id == dep.idRelationship).description
                                dep.birthDate = this.pipe.transform(dep.birthDate, 'yyyy-MM-dd')
                                var timeDiff = Math.abs(Date.now() - new Date(dep.birthDate).getTime());
                                var age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
                                dep['age'] = age
                            });
                        }

                        this.dropdownFixRequest.id.push(

                            { dropdownID: 3, dropdownTypeID: 3 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.perCountry,0)          , dropdownTypeID: 3 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idBank,0)              , dropdownTypeID: 2 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.perCity,0)             , dropdownTypeID: 9 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.perRegion,0)           , dropdownTypeID: 10 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idSalutation,0)        , dropdownTypeID: 29 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idSuffix,0)            , dropdownTypeID: 30 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idGender,0)            , dropdownTypeID: 31 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idNationality,0)       , dropdownTypeID: 32 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idCivilStatus,0)       , dropdownTypeID: 33 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idBloodType,0)         , dropdownTypeID: 34 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idReligion,0)          , dropdownTypeID: 35 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idEmployeeStatus,0)    , dropdownTypeID: 36 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idConfidentiality,0)   , dropdownTypeID: 42 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.perProvince,0)         , dropdownTypeID: 61 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.bankAccountTypeId,0)   , dropdownTypeID: 99 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.contractCurrencyDef,0) , dropdownTypeID: 122 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.currencyPayrollDef,0)  , dropdownTypeID: 122 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idEmployeeLevel,0)     , dropdownTypeID: 123 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idEmergencyRelation,0) , dropdownTypeID: 116 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.rangeId,0) , dropdownTypeID: 139 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.idPeza,0)              , dropdownTypeID: 143 },

                        )

                        this.dropdownRequest.id.push(
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idOccupation,0)        , dropdownTypeID: 37 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idDepartment,0)        , dropdownTypeID: 38 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idCostCenter,0)        , dropdownTypeID: 39 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idDivision,0)          , dropdownTypeID: 40 },
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idBusinessUnit,0)      , dropdownTypeID: 121 },
                            { dropdownID: GF.IsEmptyReturn(value.payload?.employeeAdmin?.idBand,0)                  , dropdownTypeID: 95 },
                            { dropdownID: GF.IsEmptyReturn(value.payload?.employeeAdmin?.idBudgetClassification,0)  , dropdownTypeID: 98 },
                            { dropdownID: GF.IsEmptyReturn(value.payload?.employeeAdmin?.idBandLevel,0)             , dropdownTypeID: 112 },
                        )

                        this.category.id.push(
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idCategory,0),dropdownTypeID: 0 },
                        )
                        this.supervisor.id.push(
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idSupervisor,0),dropdownTypeID:0},
                        )
                        this.access.id.push(
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idAccessControl,0),dropdownTypeID:0},
                        )
                        this.payrollacc.id.push(
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idPayroll,0),dropdownTypeID:0},
                        )
                        this.timekeeping.id.push(
                            { dropdownID: GF.IsEmptyReturn(value.payload.employeeInformation.idTimekeeping,0),dropdownTypeID:0},
                        )
                        this.initData()
                        this.exception()


                    }
                    else {
                        console.log(value.stackTrace)
                        console.log(value.message)
                    }
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                    this.isSave = false

                    // this.curformat('rateMonthly')
                    // this.curformat('rateSemiMonthly')
                    // this.curformat('rateDaily')
                    // this.curformat('rateHourly')
                }
            });
        }

        else {
            // this.isView = false

            this.dropdownFixRequest.id.push(
                { dropdownID: 0, dropdownTypeID: 2 },
                { dropdownID: 3, dropdownTypeID: 3 },
                { dropdownID: 0, dropdownTypeID: 9 },
                { dropdownID: 0, dropdownTypeID: 10 },
                { dropdownID: 0, dropdownTypeID: 29 },
                { dropdownID: 0, dropdownTypeID: 30 },
                { dropdownID: 0, dropdownTypeID: 31 },
                { dropdownID: 0, dropdownTypeID: 32 },
                { dropdownID: 0, dropdownTypeID: 33 },
                { dropdownID: 0, dropdownTypeID: 34 },
                { dropdownID: 0, dropdownTypeID: 35 },
                { dropdownID: 0, dropdownTypeID: 36 },
                { dropdownID: 0, dropdownTypeID: 41 },
                { dropdownID: 0, dropdownTypeID: 42 },
                { dropdownID: 0, dropdownTypeID: 61 },
                { dropdownID: 0, dropdownTypeID: 99 },
                { dropdownID: 0, dropdownTypeID: 123 },
                { dropdownID: 0, dropdownTypeID: 122 },
                { dropdownID: 0, dropdownTypeID: 112 },
                { dropdownID: 0, dropdownTypeID: 139 },
                { dropdownID: 0, dropdownTypeID: 116 },
                { dropdownID: 0, dropdownTypeID: 143 })

            this.dropdownRequest.id.push(
                { dropdownID: 0, dropdownTypeID: 37 },
                { dropdownID: 0, dropdownTypeID: 38 },
                { dropdownID: 0, dropdownTypeID: 39 },
                { dropdownID: 0, dropdownTypeID: 40 },
                { dropdownID: 0, dropdownTypeID: 90 },
                { dropdownID: 0, dropdownTypeID: 95 },
                { dropdownID: 0, dropdownTypeID: 98 },
                { dropdownID: 0, dropdownTypeID: 112 },
                { dropdownID: 0, dropdownTypeID: 121 }
            )

            this.dropdownRequestsub.id.push(
                { dropdownID: 0, dropdownTypeID: 1011 },
                { dropdownID: 0, dropdownTypeID: 1009 }
            )
            this.initData()
        }
    }

    private async encryptDecrypt(mode,params: string[]): Promise<any> {
        try {
          const response = await this.coreService.encrypt_decrypt(mode, params).toPromise();
          return response; // Return the response from the API call
        } catch (error) {
          console.error('Error in encryptDecrypt:', error);
          throw error; // Rethrow the error for proper error handling
        }
      }

    // checkPayrollCat(){
    //     if (this.ei.idPayroll == null || this.ei.idPayroll == 0) {
    //         this.changeTab('pai')
    //         this.employeeInformationForm.markAllAsTouched()
    //         FailedMessage.title = "Warning!"
    //         FailedMessage.message = "Please Select Payroll Category Dropdown first!"
    //         this.message.open(FailedMessage);
    //     }
    // }

    callCutoffDopdown() {
        // this.employeeInformationForm.get("idPayroll").setValue(-1)//test static data
        // this.employeeInformationForm.value.idPayroll
        var idpayroll = this.dropdownOptions.payrollCategoryDef.find(x => x.dropdownID === this.ei.idPayroll)?.encryptID
        if (idpayroll == undefined) {
            return
        }

        this.categoryService.getPayrollCutoffDropdown(this.dropdownCutoffRequest, idpayroll)
            .subscribe({
                next: (response) => {
                    this.dropdownOptions.cutoffdef = response.payload
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                },
            });
    }

    initData() {
        this.loadEDLTable()

        forkJoin({
            dropdownFix: this.masterService.getDropdownFix(this.dropdownFixRequest),
            dropdown: this.tenantService.getDropdown(this.dropdownRequest),
            // user: this.userService.getEmployeeDropdown(this.dropdownDefRequest),
            categoryPayroll: this.categoryService.getCategoryPayrollDropdown(this.dropdownDefRequest),
            supervisor: this.coreService.getCoreDropdown(1011, this.supervisor),
            category: this.coreService.getCoreDropdown(1007, this.category),
            subCompany: this.coreService.getCoreDropdown(1001, this.subcompany),
            access: this.coreService.getCoreDropdown(1008, this.access),
            branch: this.coreService.getCoreDropdown(1002, this.branch),
            // businessUnit: this.coreService.getCoreDropdown(1044,this.dropdownRequestsub),
            payroll: this.coreService.getCoreDropdown(1009, this.payrollacc),
            timekeeping: this.coreService.getCoreDropdown(1012, this.timekeeping),
            leavebalance: this.userService.getEmployeeLeaveBalance(this.target),
            accessControl: this.tenantService.getAccessControlPerModule(this.moduleIdstr)
        }).subscribe({
            next: (response) => {


                // MASTER

                this.dropdownOptions.nationalityDef = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID === 32), JSON.stringify)
                this.dropdownOptions.employeeStatusDef = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID === 36), JSON.stringify)
                this.dropdownOptions.payrollTypeDef = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID === 41), JSON.stringify)
                this.dropdownOptions.confidentialDef = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID === 42), JSON.stringify)

                this.dropdownOptions.countryDef = [...new Map(response.dropdownFix.payload.filter(x => x.dropdownTypeID === 3).map(item =>
                    [item["dropdownID"], item])).values()];

                this.dropdownOptions.regionDef = [...new Map(response.dropdownFix.payload.filter(x => x.dropdownTypeID === 10).map(item =>
                    [item["dropdownID"], item])).values()];

                this.dropdownOptions.provinceDef = [...new Map(response.dropdownFix.payload.filter(x => x.dropdownTypeID === 61).map(item =>
                    [item["dropdownID"], item])).values()];

                this.dropdownOptions.cityDef = [...new Map(response.dropdownFix.payload.filter(x => x.dropdownTypeID === 9).map(item =>
                    [item["dropdownID"], item])).values()];

                this.dropdownOptions.salutationDef       = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 29)   , JSON.stringify)
                this.dropdownOptions.suffixDef           = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 30)   , JSON.stringify)
                this.dropdownOptions.genderDef           = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 31)   , JSON.stringify)
                this.dropdownOptions.civilStatusDef      = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 33)   , JSON.stringify)
                this.dropdownOptions.bloodTypeDef        = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 34)   , JSON.stringify)
                this.dropdownOptions.religionDef         = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 35)   , JSON.stringify)
                this.dropdownOptions.relationshipDef     = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 116 && !GF.IsEqual(x.dropdownID,[30412,30413]))       , JSON.stringify)
                this.dropdownOptions.dependentsDef       = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 116 && !GF.IsEqual(x.dropdownID,[30621,30647,30648])) , JSON.stringify)
                this.dropdownOptions.bankDef             = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 2)    , JSON.stringify)
                this.dropdownOptions.contractCurrencyDef = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 122)  , JSON.stringify)
                this.dropdownOptions.currencyPayrollDef  = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 122)  , JSON.stringify)
                this.dropdownOptions.employeeLevelDef    = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 123)  , JSON.stringify)
                this.dropdownOptions.bankAccountDef      = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 99)   , JSON.stringify)
                this.dropdownOptions.indefinite      = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 139)   , JSON.stringify)

                // TENANT

                this.dropdownOptions.bandsDef              = _.uniqBy(response.dropdown.payload.filter(x => x.dropdownTypeID == 95)     , JSON.stringify)
                this.dropdownOptions.bandsLevelDef         = _.uniqBy(response.dropdown.payload.filter(x => x.dropdownTypeID == 112)    , JSON.stringify)
                this.dropdownOptions.budgetClassDef        = _.uniqBy(response.dropdown.payload.filter(x => x.dropdownTypeID == 98)     , JSON.stringify)
                this.dropdownOptions.costCenterDef         = _.uniqBy(response.dropdown.payload.filter(x => x.dropdownTypeID == 39)     , JSON.stringify)
                this.dropdownOptions.departmentDef         = _.uniqBy(response.dropdown.payload.filter(x => x.dropdownTypeID == 38)     , JSON.stringify)
                this.dropdownOptions.occupationDef         = _.uniqBy(response.dropdown.payload.filter(x => x.dropdownTypeID == 37)     , JSON.stringify)
                this.dropdownOptions.busnissUnitDef        = _.uniqBy(response.dropdown.payload.filter(x => x.dropdownTypeID == 121)    , JSON.stringify)
                this.dropdownOptions.divisionDef           = _.uniqBy(response.dropdown.payload.filter(x => x.dropdownTypeID == 40)     , JSON.stringify)
                this.dropdownOptions.pezaClassificationDef = _.uniqBy(response.dropdownFix.payload.filter(x => x.dropdownTypeID == 143)    , JSON.stringify)

                // API
                this.dropdownOptions.categoryDef         = _.uniqBy(response.category.payload     , JSON.stringify)
                this.dropdownOptions.userDef             = _.uniqBy(response.supervisor.payload   , JSON.stringify)

                this.dropdownOptions.subCompanyDef       = _.uniqBy(response.subCompany.payload   , JSON.stringify)
                this.dropdownOptions.AccessControldef    = _.uniqBy(response.access.payload       , JSON.stringify)
                this.dropdownOptions.branchDef           = _.uniqBy(response.branch.payload       , JSON.stringify)
                this.dropdownOptions.payrollCategoryDef  = _.uniqBy(response.payroll.payload      , JSON.stringify)
                this.dropdownOptions.Timekeepingdef      = _.uniqBy(response.timekeeping.payload  , JSON.stringify)
                this.dataSource_leave = _.uniqBy(response.leavebalance.payload, JSON.stringify)

                if (this.dataSource_payroll.length !== 0) {
                    this.dataSource_payroll.forEach(data => {
                        data._rangeId = this.dropdownOptions.indefinite.find(x => x.dropdownID == data.rangeId).description
                    });
                }

                //Access Control
                if (!GF.IsEmpty(response?.accessControl['payload'])) {
                    var ac = response?.accessControl['payload']//?.isFullAccess
                    if (ac.isFullAccess) {
                        this.isAdmin = true
                        this.hidePayroll = false
                        this.hideAdmin = false
                        this.hideOthers = false
                    } else {
                        if (ac.isView && !ac.isEdit) {
                            this.isView = true
                            this.submitbutton = false
                        }
                    }
                }

            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
                if (!this.isView) {
                    this.callCutoffDopdown()
                }
                if (!this.isView) {
                    this.employeeForm.enable();
                    this.employeeInformationForm.enable();
                    this.adminForm.enable();
                    this.employeeDependentsForm.enable();
                    this.unSavedForm.enable();
                }
            },
        });

    }

    loadEDLTable(){
        this.payrollService.getEDLView(this.edlRequest,this.target).subscribe({
            next: (response) => {
                this.dataSource_EDL = _.uniqBy(response.payload.data, JSON.stringify)
            },
            error: (e) => {
                console.error(e)
            }
        });
    }
    // rates(){
    //     var mrate = this.employeeInformationForm.get('monthlyRate').value
    //     console.log(mrate)
    // }

    ShiftSortEvent(e): void {
        this.shiftRequest.Start = 0
        this.shiftRequest.Order = e.active
        this.shiftRequest.OrderBy = e.direction
        this.searchShift()
    }

    handlePageEvent(e){
        this.shiftRequest.Start = e.pageIndex
        this.shiftRequest.Length = e.pageSize
        this.searchShift()
    }

    searchShift() {
        var df = this.pipe.transform(this.unSavedForm.value.dateFrom, "MM/dd/yyyy")
        var dt = this.pipe.transform(this.unSavedForm.value.dateTo, "MM/dd/yyyy")
        this.shiftService.getEmployeeSchedule(this.shiftRequest, df, dt, this.id)
            .subscribe({
                next: (response) => {
                    this.dataSource.paginator = this.paginator;
                    this.totalRows = response.payload.totalRows
                    this.dataSource = response.payload.data
                },
                error: (e) => {
                    console.error(e)
                },
            });
    }


    onChangeName() {
        var display = "";
        var first = GF.IsEmptyReturn(this.employeeForm.get('firstName').value,"")
        var middle = GF.IsEmptyReturn(this.employeeForm.get('middleName').value,"")
        var last = GF.IsEmptyReturn(this.employeeForm.get('lastName').value,"")
        var suffix = this.dropdownOptions.suffixDef.filter(x => x.dropdownID == this.employeeForm.get('idSuffix').value)
        var suf = GF.IsEmpty(suffix[0]?.description) ? "" : " "+ GF.IsEmptyReturn(suffix[0]?.description,"")
        if (first !== "" && last !== "") {
            var mid = middle == "" ? "" : " " + middle.substring(0, 1)[0].toUpperCase() + middle.substring(0, 1).slice(1) + "."
            display = last[0].toUpperCase() + last.slice(1) + ", " + first[0].toUpperCase() + first.slice(1) + mid + suf
            this.employeeForm.get('displayName').setValue(display)
        }
    }
    onChangeEmployeeId() {
        var code = this.employeeForm.get('employeeCode').value

        this.employeeForm.get('userName').setValue(code)
    }


    onChangeBirthAge() {
        var birth = this.employeeDependentsForm.get('birthDate').value === null || this.employeeDependentsForm.get('birthDate').value === "" ? "" : this.employeeDependentsForm.get('birthDate').value

        if (birth !== "") {
            var timeDiff = Math.abs(Date.now() - new Date(birth).getTime());
            this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
            this.employeeDependentsForm.get('age').setValue(this.age)
        }

    }

    exception() {
        const idTimekeeping = (this.employeeInformationForm.value.idTimekeeping > 0 || this.employeeInformationForm.value.idTimekeeping == null);
        const idPayroll = (this.employeeInformationForm.value.idPayroll > 0 || this.employeeInformationForm.value.idPayroll == null);
        const timekeepingIndex = this.exceptiontk.findIndex(item => item.id === 1);
        const payrollIndex = this.exceptiontk.findIndex(item => item.id === 2);
        this.exceptiontk = this.exceptiontk_old.slice()
        if (idTimekeeping) {
            this.exceptiontk.splice(timekeepingIndex, 1);
        } else
            if (idPayroll) {
                this.exceptiontk.splice(payrollIndex, 1);
            }
    }


    regular() {
        var dt = new Date(this.employeeInformationForm.value.dateProbationary);
        dt.setDate(dt.getDate() + 180);
        let dt1 = this.pipe.transform(dt, 'yyyy-MM-dd');
        this.employeeInformationForm.get('dateRegularized').setValue(dt1)

    }

    regulardate() {
        var dt = new Date(this.employeeInformationForm.value.dateHired);
        var dt2 = new Date(this.employeeInformationForm.value.dateHired);
        dt.setDate(dt.getDate() + 180);
        let dt1 = this.pipe.transform(dt, 'yyyy-MM-dd');
        this.employeeInformationForm.get('dateRegularized').setValue(dt1)
        this.employeeInformationForm.get('dateProbationary').setValue(dt2)
    }

    // onChangeReg() {
    //     var dt = new Date();
    //     dt.setDate(dt.getDate() + 180);
    //     let dt1 = this.pipe.transform(dt, 'yyyy-MM-dd');
    //     this.employeeInformationForm.get('dateRegularized').setValue(dt1)
    //     console.log(dt1)
    // }

    // setDateHired(){
    //     var dt = new Date();
    //     let dt1 = this.pipe.transform(dt, 'MM-dd-yyyy');
    //     this.employeeForm.get('dateHired').setValue(this.pipe.transform(new Date(), 'MM-dd-yyyy');)
    // }

    checkSameAddress(e) {

        if (!e.checked) {
            this.employeeForm.get('perCountry').setValue("")
            this.employeeForm.get('perZipCode').setValue("")
            this.employeeForm.get('perRegion').setValue("")
            this.employeeForm.get('perProvince').setValue("")
            this.employeeForm.get('perCity').setValue("")
            this.employeeForm.get('perBarangay').setValue("")
            this.employeeForm.get('perUnitFloor').setValue("")
            this.employeeForm.get('perBuilding').setValue("")
            this.employeeForm.get('perStreet').setValue("")
            return
        }

        var country = this.employeeForm.get('preCountry').value === null || this.employeeForm.get('preCountry').value === "" ? "" : this.employeeForm.get('preCountry').value
        var zipcode = this.employeeForm.get('preZipCode').value === null || this.employeeForm.get('preZipCode').value === "" ? "" : this.employeeForm.get('preZipCode').value
        var region = this.employeeForm.get('preRegion').value === null || this.employeeForm.get('preRegion').value === "" ? "" : this.employeeForm.get('preRegion').value
        var province = this.employeeForm.get('preProvince').value === null || this.employeeForm.get('preProvince').value === "" ? "" : this.employeeForm.get('preProvince').value
        var city = this.employeeForm.get('preCity').value === null || this.employeeForm.get('preCity').value === "" ? "" : this.employeeForm.get('preCity').value
        var barangay = this.employeeForm.get('preBarangay').value === null || this.employeeForm.get('preBarangay').value === "" ? "" : this.employeeForm.get('preBarangay').value
        var unit = this.employeeForm.get('preUnitFloor').value === null || this.employeeForm.get('preUnitFloor').value === "" ? "" : this.employeeForm.get('preUnitFloor').value
        var building = this.employeeForm.get('preBuilding').value === null || this.employeeForm.get('preBuilding').value === "" ? "" : this.employeeForm.get('preBuilding').value
        var street = this.employeeForm.get('preStreet').value === null || this.employeeForm.get('preStreet').value === "" ? "" : this.employeeForm.get('preStreet').value

        this.employeeForm.get('perCountry').setValue(country)
        this.employeeForm.get('perZipCode').setValue(zipcode + "")
        this.employeeForm.get('perRegion').setValue(region)
        this.employeeForm.get('perProvince').setValue(province)
        this.employeeForm.get('perCity').setValue(city)
        this.employeeForm.get('perBarangay').setValue(barangay + "")
        this.employeeForm.get('perUnitFloor').setValue(unit + "")
        this.employeeForm.get('perBuilding').setValue(building + "")
        this.employeeForm.get('perStreet').setValue(street + "")

    }

    validation() {
        this.employeeForm.markAllAsTouched()
        this.unSavedForm.markAllAsTouched()
        this.employeeDependentsForm.markAllAsTouched()
        this.employeeInformationForm.markAllAsTouched()
        this.adminForm.markAllAsTouched()
        this.payrollstatForm.markAllAsTouched()

        if (!this.employeeForm.valid) {
            if (
                GF.IsEmpty(this.ef.firstName) ||
                GF.IsEmpty(this.ef.lastName) ||
                GF.IsEmpty(this.ef.displayName) ||
                GF.IsEmpty(this.ef.birthDate) ||

                GF.IsEmpty(this.ef.mobile) ||

                GF.IsEmpty(this.ef.preCountry) ||
                GF.IsEmpty(this.ef.perCountry)
            ) {
                this.changeTab('pei')
                if ( GF.IsEmpty(this.ef.firstName) || GF.IsEmpty(this.ef.lastName) || GF.IsEmpty(this.ef.displayName) || GF.IsEmpty(this.ef.birthDate) ) {
                    this.personalIndex = 0
                } else if ( GF.IsEmpty(this.ef.mobile) ) {
                    this.personalIndex = 1
                } else {
                    this.personalIndex = 3
                }
            } else {
                this.changeTab('woi');
            }
            return true
        }
        if (!this.employeeInformationForm.valid) {
            if (GF.IsEmpty(this.ei.idPayroll) || GF.IsEmpty(this.ei.idTimekeeping) || GF.IsEmpty(this.ei.tin)) {
                this.changeTab('pai');
            }
            return true
        }

        if (GF.IsEqual(this.employeeInformationForm.value.idEmployeeStatus, [95,12665])) {
            var errorMsg =  GF.IsEmpty(this.employeeInformationForm.value.dateSeparated) ? "Separation Date" : ""
                // errorMsg += GF.IsEmpty(this.employeeInformationForm.value.dateAccessUntil) ? "Access Until, " : ""
                errorMsg += GF.IsEmpty(this.employeeInformationForm.value.dateEffective) ? !GF.IsEmpty(errorMsg) ? " and Effective Date" : "Effective Date" : ""
            if (!GF.IsEmpty(errorMsg)) {
                errorMsg +=  " are requried!"
                var failedMessage = Object.assign({},FailedMessage)
                failedMessage.title = "Requried Fields";
                failedMessage.message = errorMsg;
                this.message.open(failedMessage)
                return true
            }
        } else {
            this.employeeInformationForm.get('dateSeparated').setValue(null)
            this.employeeInformationForm.get('dateAccessUntil').setValue(null)
            this.employeeInformationForm.get('dateEffective').setValue(null)
        }

        return false
    }


    async submit() {
        if (this.validation()) { return }//check tab required

        if (this.employeeForm.valid) {
            const dialogRef = this.message.open(SaveMessage);
            // console.log(this.employeeForm.value)
            // JSON.stringify(this.employeeForm.value)

            dialogRef.afterClosed().subscribe(async(result) => {
                if (result == "confirmed") {

                    this.employeeInformationForm.get('idConfidentiality').setValue(GF.IsEmptyReturn(this.ei.idConfidentiality,70))
                    this.employeeForm.get('employeeOther').setValue(this.datasource_employeeOther)
                    this.employeeForm.get('employeeMovement').setValue(this.datasource_employeeMovement)
                    this.employeeForm.get('employeeInformation').setValue(this.employeeInformationForm.value)
                    this.employeeForm.get('timekeepingCategoryException').setValue(this.timekeepingCategoryForm)
                    this.employeeForm.get('payrollCategoryException').setValue(this.payrollForm)
                    this.employeeForm.get('payrollEmployeeCategory').setValue(this.payrollForm)
                    // this.employeeForm.get('employeeDependents').setValue(this.employeeDependentsForm.value)
                    this.adminForm.get('employeeHoldPayroll').setValue(this.dataSource_payroll)
                    this.employeeForm.get('employeeAdmin').setValue(this.adminForm.value)


                    var emp = this.employeeForm.value
                    var empi = this.employeeInformationForm.value
                    var empd = this.employeeDependentsForm.value
                    emp.birthDate = this.pipe.transform(emp.birthDate, 'yyyy-MM-dd')
                    empi.dateHired = this.pipe.transform(empi.dateHired, 'yyyy-MM-dd')
                    empi.dateContractValidity = this.pipe.transform(empi.dateContractValidity, 'yyyy-MM-dd')
                    empi.dateProbationary = this.pipe.transform(empi.dateProbationary, 'yyyy-MM-dd')
                    empi.dateRegularized = this.pipe.transform(empi.dateRegularized, 'yyyy-MM-dd')
                    empi.dateSeparated = this.pipe.transform(empi.dateSeparated, 'yyyy-MM-dd')
                    empi.dateEffective = this.pipe.transform(empi.dateEffective, 'yyyy-MM-dd')
                    empi.dateAccessUntil = this.pipe.transform(empi.dateAccessUntil, 'yyyy-MM-dd')
                    empd.birthDate = this.pipe.transform(empd.birthDate, 'yyyy-MM-dd')
                    emp.effectiveDate = await this.setEffectiveDate();
                    // console.log(emp.replace(/\:null/gi, "\:[]"))

                    this.isSave = true

                    this.userService.postEmployee(emp).subscribe({
                        next: (value: any) => {
                            if (value.statusCode == 200) {
                                this.message.open(SuccessMessage);
                                this.isSave = false,
                                this.router.navigate(['/search/employee-list']);
                                this.transactionId = value.payload
                                this.loginId = value.payload
                                this.uploadimage()
                            }
                            else {
                                // this.curformat('rateMonthly')
                                this.message.open(FailedMessage);
                                console.log(value.stackTrace)
                                console.log(value.message)
                            }
                        },
                        error: (e) => {
                            // this.curformat('rateMonthly')
                            this.isSave = false
                            this.message.open(FailedMessage);
                            console.error(e)
                        }
                    });
                }
            });
        }
    }

    async setEffectiveDate() {
        console.log(this.movements);

        if (this.movements.some(x => ['rateMonthly', 'rateSemiMonthly'].includes(x)) && this.employeeForm.value.employeeId !== 0) {
            this.dialogRef = this.dialog.open(EffectiveDateComponent, {
                width: '20%',
                disableClose: true
            });

            const result = await new Promise<any>((resolve) => {
                this.dialogRef.componentInstance.btnConfirmed.subscribe((confirmedResult: any) => {
                    resolve(confirmedResult);
                });
            });

            // const formattedResult = result.toISOString()//this.pipe.transform(result, "MM/dd/yyyy");
            const formattedResult = this.pipe.transform(new Date(result).toLocaleString('en-US', { timeZone: 'Asia/Manila' }), "yyyy-MM-dd")+"T00:00:00.000Z";
            return formattedResult;
        }

        return null;
    }

    checkCategory(e) {
        this.selectedCategory = e === 1 ? this.dropdownOptions.Timekeepingdef.find(x => x.dropdownID == this.unSavedForm.value.categoryDropdown).encryptID
            : this.dropdownOptions.payrollCategoryDef.find(x => x.dropdownID == this.unSavedForm.value.categoryDropdown).encryptID
    }

    categoryList(e) {
        return e === 1 ? this.dropdownOptions.Timekeepingdef : e == 0 || e == null ? [] : this.dropdownOptions.payrollCategoryDef
    }

    changeTab(e) {

        this.isPeI        =  (e == 'pei')
        this.isWoI        =  (e == 'woi')
        this.isPaI        =  (e == 'pai')
        this.isS          =  (e == 's')
        this.isL          =  (e == 'l')
        this.isOther      =  (e == 'O')
        this.isException  =  (e == 'E')
        this.isAdminTab   =  (e == 'A')
        this.isEDLTab     =  (e == 'EDL')
    }

    computeRates(rate) {
        if (rate !== 'payrollcat') {
            var cur = this.employeeInformationForm.get(rate).value
            switch (rate) {
                case 'rateMonthly':
                    var semi = cur / 2
                    this.employeeInformationForm.get("rateSemiMonthly").setValue(semi)
                break;
                case 'rateSemiMonthly':
                    var mons = cur * 2
                    this.employeeInformationForm.get("rateMonthly").setValue(mons)
                break;
            }
        }

        if (!this.movements.some(x=>x==rate)) {
            this.movements.push(rate)
        }

        this.userService.getSalaryRate(this.employeeInformationForm.value.idPayroll,this.employeeInformationForm.value.rateMonthly).subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    this.employeeInformationForm.get("rateDaily").setValue(value.payload.dailyRate)
                    this.employeeInformationForm.get("rateHourly").setValue(value.payload.hourlyRate)
                } else {
                    console.log(value.stackTrace)
                    console.log(value.message)
                }
            },
            error: (e) => {
                console.error(e)
            }
        });
    }


    handleAdddependent(): void {
        // if (this.employeeDependentsForm.controls.employeeDependents.valid) {
        this.dataSource_dependents.push({

            // type: this.dropdownOptions.emailDef.filter(x => x.dropdownID == this.emailForm.value.Address)[0]['description'],
            idRelationshipdescrip: this.dependents.find(item => item.id == this.employeeDependentsForm.value.idRelationship).description,
            idRelationship: this.employeeDependentsForm.value.idRelationship,
            firstName: this.employeeDependentsForm.value.firstName,
            middleName: this.employeeDependentsForm.value.middleName,
            lastName: this.employeeDependentsForm.value.lastName,
            birthDate: this.pipe.transform(this.employeeDependentsForm.value.birthDate, 'yyyy-MM-dd'),
            age: this.employeeDependentsForm.value.age,
        })


        //   console.log(this.employeeDependentsForm)
        this.Table_dependents.renderRows();
        this.employeeForm.get('employeeDependents').setValue(this.dataSource_dependents);

        this.employeeDependentsForm.reset()
        // }
    }


    Delete(index): void {
        this.dataSource_dependents.splice(index, 1);
        this.Table_dependents.renderRows();
    }
    PatchTK(form: any) {
        this.timekeepingCategoryForm = form
        console.log(this.timekeepingCategoryForm)
    }

    PatchPayroll(form: any) {
        this.payrollForm = form
        console.log(this.payrollForm)
    }

    dsiabledbutton(a) {
        this.payrollstatForm.get('payrollCutoffLockingId').setValue(0)
        this.payrollstatForm.get('adddatefrom').setValue('')
        this.dataSource_payroll.forEach(element => {
            if (element.rangeId == 30595) {
                if (this.payrollstatForm.value.adddatefrom !== "" || this.payrollstatForm.value.payrollCutoffLockingId == 0) {
                    this.buttondis = true
                    return
                }else{
                    this.buttondis = false
                    return
                }
            } else {
                this.buttondis = false
                return
            }
        });
    }

    addPayroll(): void {
        var range = this.payrollstatForm.value.rangeId
        let cutoff = range == 30596 ? this.dropdownOptions.cutoffdef.find(x => x.dropdownID === this.payrollstatForm.value.payrollCutoffLockingId) : 0//"2023-01-10 - 2023-03-10"
        var df = range == 30596 ? cutoff.dateFrom : this.pipe.transform(this.payrollstatForm.value.adddatefrom, 'MM/dd/yyyy')
        var dt = range == 30596 ? cutoff.dateTo : "12/31/3000"
        var payout = range == 30596 ? cutoff.datePayout : ""

        this.dataSource_payroll.push({
            rangeId: this.payrollstatForm.value.rangeId,
            _rangeId: this.dropdownOptions.indefinite.find(x => x.dropdownID == this.payrollstatForm.value.rangeId)?.description || "",
            dateFrom: df,
            dateTo: dt,
            payout: payout,
            createdByName: sessionStorage.getItem('dn'),
            dateCreated: this.pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
            _dateCreated: this.pipe.transform(new Date(), 'yyyy-MM-dd HH:mm a'),
            cutoff: this.payrollstatForm.value.payrollCutoffLockingId,
            isIndefinite : this.payrollstatForm.value.rangeId == 30595 ? true : false
        })
        this.Table_payroll.renderRows();
        this.payrollstatForm.get('rangeId').setValue(0)
    }


    onEdit(element: any, i) {
        this.payrollstatForm.get('rangeId').setValue(element.rangeId)
        this.payrollstatForm.get('payrollCutoffLockingId').setValue(element.cutoff)
        this.dataSource_payroll.splice(i, 1);
        this.Table_payroll.renderRows();
    }

    handleDeleteBreak(index) {
        this.dataSource_payroll.splice(index, 1);
        this.Table_payroll.renderRows();
        this.payrollstatForm.get('rangeId').setValue(0)

    }

    handleSortEvent(e): void {
        this.edlRequest.Start = 0
        this.edlRequest.Order = e.active
        this.edlRequest.OrderBy = e.direction
        this.loadEDLTable()
    }

    uploadimage() {

        this.moduleId = sessionStorage.getItem('moduleId')
        if (this.imagefile.length === 0) {
            return
        }
        this.imagefile.forEach(file => {
            const fileToUpload = <File>file.files;
            if (fileToUpload) {
                const formData = new FormData();
                formData.append("file", file.files);

                this.storageServiceService.fileUpload(formData, this.transactionId, this.moduleId,this.loginId).subscribe({
                    next: (value: any) => {
                        if (value) {

                        }
                    },
                    error: (e) => {
                    }
                });
            }
        });
    }

    // uploadFile(event, id,sig, fc) {
    //     let reader = new FileReader(); // HTML5 FileReader API
    //     const fileToUpload0 = event.target.files[0];
    //     var name = sig + '-' + fileToUpload0.name;

    //     if (this.imagefile.some(x => x.source == sig)) {
    //         var idx = this.imagefile.findIndex(x => x.source == sig);
    //         this.imagefile[idx].files = event.target.files[idx];
    //     } else {
    //         const renamedFile0 = new File([fileToUpload0], name, { type: fileToUpload0.type });
    //         this.imagefile.push({
    //             source: sig,
    //             files: renamedFile0
    //         });
    //     }

    //     var readers = new FileReader();
    //     readers.readAsDataURL(event.target.files[0]);
    //     readers.onload = (events) => {

    //         if (fc == "imagePath") {
    //             this.imageUrl = events.target.result as string;
    //         }
    //         this.employeeForm.get(fc).setValue(event.target.files[0].name)
    //     }

    // }

    async reduceImageSize(file: File, maxSizeInBytes: number, quality: number): Promise<File> {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = function (event: ProgressEvent<FileReader>) {
            const image = new Image();

            image.onload = function () {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              const originalWidth = image.width;
              const originalHeight = image.height;
              let resizedWidth = originalWidth;
              let resizedHeight = originalHeight;

              // Calculate the new width and height to fit the desired file size
              while (file.size > maxSizeInBytes && resizedWidth > 10 && resizedHeight > 10) {
                resizedWidth *= 0.9;
                resizedHeight *= 0.9;

                canvas.width = resizedWidth;
                canvas.height = resizedHeight;

                context.clearRect(0, 0, resizedWidth, resizedHeight);
                context.drawImage(image, 0, 0, resizedWidth, resizedHeight);

                file = dataURLtoFile(canvas.toDataURL(file.type, quality), file.name);
              }
              resolve(file);
            };

            image.src = event.target?.result as string;
          };

          reader.readAsDataURL(file);

          function dataURLtoFile(dataURL: string, fileName: string): File {
            const arr = dataURL.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], fileName, { type: mime });
          }
        });
      }

      async uploadFile(event: any, id: any, sig: string, fc: string) {
        const fileToUpload0 = event.target.files[0];
        const name = sig + '-' + fileToUpload0.name;
        let reduce: File;


        try {
          reduce = await this.reduceImageSize(fileToUpload0, 50 * 1024 , 0.8);
        } catch (error) {
          console.error('Error reducing image size:', error);
          return; // If an error occurs, you might want to handle it accordingly.
        }

        if (this.imagefile.some((x) => x.source == sig)) {
          const idx = this.imagefile.findIndex((x) => x.source == sig);
          this.imagefile[idx].files = reduce;
        } else {
          const renamedFile = new File([reduce], name, { type: reduce.type });
          this.imagefile.push({
            source: sig,
            files: renamedFile,
          });
        }

        switch (fc) {
          case 'imagePath':
            this.employeeForm.get('imagePath').setValue(reduce.name);
            const readers = new FileReader();
            readers.readAsDataURL(reduce);
            readers.onload = (event) => {
              this.imageUrl = event.target?.result as string;
            };
            break;
        }
      }

    previewimage(e,t,m) {
        this.storageServiceService.fileDownload(e,t,m).subscribe({
            next: (value: any) => {
                //
                // this.imageUrl = "companyLogo1-user-icon-jpg.jpg"
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(base64data);
                };
                reader.readAsDataURL(value);
            },

            error: (e) => {
            }
        });
    }

    isNumber(e){
        if (!GF.IsEmpty(e)) {
            console.log(e)
            if (isNaN(e)) {
              return GF.IsEmpty(e) ? [] : (Array.isArray(e) ? e : [e])
            }
        }
      }

}
