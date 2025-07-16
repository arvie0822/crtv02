import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { myData } from 'app/app.moduleId';
import { PayrollHeader } from 'app/model/administration/payroll-category';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { PayrollService } from 'app/services/payrollService/payroll.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { forkJoin } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-payroll-category',
  templateUrl: './payroll-category.component.html',
  styleUrls: ['./payroll-category.component.css']
})
export class PayrollCategoryComponent implements OnInit {

  @Input() parentDetail: any[]
  @Input() hide: boolean = true
  @Input() hidebuttons: boolean = false
  @Input() data: any
  @Input() _id: string
  @Output() formChanged = new EventEmitter<FormGroup>();

  payrollCategoryForm: FormGroup
  view: boolean = false
  _onDestroy: any
  id: string
  dropdownFix = new DropdownRequest
  dropdownRequest = new DropdownRequest
  _13MonthRequest = new DropdownRequest
  _14MonthRequest = new DropdownRequest
  _15MonthRequest = new DropdownRequest
  _16MonthRequest = new DropdownRequest
  dropdownOptions = new DropdownOptions

  isSave: Boolean = false

  boolOption = [
    { dropdownID: 1, description: 'Yes' },
    { dropdownID: 0, description: 'No' },
  ];
  boolOption2 = [
    { dropdownID: true, description: 'Yes' },
    { dropdownID: false, description: 'No' },
  ];
  test  = [
    { dropdownID: 0, description: 'All' },
    { dropdownID: 1, description: 'Test' },
    { dropdownID: 2, description: 'Not-linked Yet' },
    { dropdownID: 3, description: 'No API Yet' },
  ]
  cutoff = []
  dailyRateList = []
  hourlyRateList = []
  wage = []
  PremRateTypeList = []
  fixedDedList = []
  fixedEarList = []
  sssList = []
  hdmfList = []
  phicList = []
  taxList = []
  dedHierList = []
  repSettingList = []
  sssMatList = []
  _13MonthList = []
  _14MonthList = []
  _15MonthList = []
  _16MonthList = []
  InitialDE = []


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private payrollService: PayrollService,
    private message: FuseConfirmationService,
    private router: Router,
    private tenantService: TenantService,
    private masterService: MasterService,
    private coreService: CoreService,
  ) { }

  get paycat(){
    return this.payrollCategoryForm.value
  }

  ngOnChanges(){
    if (this.parentDetail !== undefined) {
      this.view = this.parentDetail["view"]
      this.id = this._id
      this.ngOnInit()
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.parentDetail !== undefined) {
      this.view = this.parentDetail["view"]
      this.id = this._id
      // if (this.parentDetail["edit"]) {
      //     this.patchData(this.data)
      // }
    }

    this.payrollCategoryForm = this.fb.group(new PayrollHeader());
    // this.payrollCategoryForm.reset()

    if (this.id !== "") {
      this.payrollCategoryForm.disable();
      this._onDestroy = this.payrollService.getPayrollCategory(this.id).subscribe({
        next: (value: any) => {
          if (value.statusCode == 200) {
            this.payrollCategoryForm.patchValue(JSON.parse(JSON.stringify(value.payload).replace(/\:null/gi, "\:[]")))
            this.dropdownFix.id.push(
              { dropdownID: value.payload.dailyRate     == null ? 0 : value.payload.dailyRate,    dropdownTypeID: 135 },
              { dropdownID: value.payload.hourlyRate    == null ? 0 : value.payload.hourlyRate,   dropdownTypeID: 136 },
              { dropdownID: value.payload.sssMaternity  == null ? 0 : value.payload.sssMaternity, dropdownTypeID: 137 },
              { dropdownID: value.payload.reportSetting == null ? 0 : value.payload.sssMaternity, dropdownTypeID: 140 },
              { dropdownID: value.payload.wageType      == null ? 0 : value.payload.wageType,     dropdownTypeID: 77  },
            )
            this.initData()
            this.payrollCategoryForm.enable();

          }
          else {
            console.log(value.stackTrace)
            console.log(value.message)
          }
        },
        error: (e) => {
          console.error(e)
        }
      });
    } else {
      this.dropdownFix.id.push(
        { dropdownID: 0, dropdownTypeID: 135 },
        { dropdownID: 0, dropdownTypeID: 136 },
        { dropdownID: 0, dropdownTypeID: 137 },
        { dropdownID: 0, dropdownTypeID: 140 },
        { dropdownID: 0, dropdownTypeID: 77 },
      )

      this.initData()
    }
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  patchData(value){
    this.cutoff            =  _.uniqBy([...this.cutoff,         ...value.payrollCutoff.payload], JSON.stringify)
    this.dailyRateList     =  _.uniqBy([...this.dailyRateList,  ...value.dropdownFix.payload.filter(x => x.dropdownTypeID === 135)], JSON.stringify)
    this.hourlyRateList    =  _.uniqBy([...this.hourlyRateList, ...value.dropdownFix.payload.filter(x => x.dropdownTypeID === 136)], JSON.stringify)
    this.wage              =  _.uniqBy([...this.wage,           ...value.dropdownFix.payload.filter(x => x.dropdownTypeID === 77)], JSON.stringify)
    this.PremRateTypeList  =  _.uniqBy([...this.PremRateTypeList,...value.premRate.payload], JSON.stringify)
    this.fixedDedList      =  _.uniqBy([...this.fixedDedList,   ...value.fixedDeductions.payload.filter(x => x.fixed === true)], JSON.stringify)
    this.fixedEarList      =  _.uniqBy([...this.fixedEarList,   ...value.fixedEarnings.payload.filter(x => x.fixed === true)], JSON.stringify)
    this.sssList           =  _.uniqBy([...this.sssList,        ...value.sss.payload], JSON.stringify)
    this.hdmfList          =  _.uniqBy([...this.hdmfList,       ...value.hdmf.payload], JSON.stringify)
    this.phicList          =  _.uniqBy([...this.phicList,       ...value.phic.payload], JSON.stringify)
    this.taxList           =  _.uniqBy([...this.taxList,        ...value.tax.payload], JSON.stringify)
    this.dedHierList       =  this.test //value.dropdownFix.payload.filter(x => x.dropdownTypeID === 9000)
    this.repSettingList    =  _.uniqBy([...this.repSettingList, ...value.dropdownFix.payload.filter(x => x.dropdownTypeID === 140)], JSON.stringify)
    this.sssMatList        =  _.uniqBy([...this.sssMatList,     ...value.dropdownFix.payload.filter(x => x.dropdownTypeID === 137)], JSON.stringify)
    this._13MonthList      =  _.uniqBy([...this._13MonthList,   ...value._13Month.payload], JSON.stringify)
    this._14MonthList      =  _.uniqBy([...this._14MonthList,   ...value._14Month.payload], JSON.stringify)
    this._15MonthList      =  _.uniqBy([...this._15MonthList,   ...value._15Month.payload], JSON.stringify)
    this._16MonthList      =  _.uniqBy([...this._16MonthList,   ...value._16Month.payload], JSON.stringify)
    this.InitialDE         =  _.uniqBy([...this.InitialDE,      ...value.inDailyEarnings.payload], JSON.stringify)
  }

  initData() {
    this._onDestroy = forkJoin({
      // dropdownDynamic: this.tenantService.getDropdown(this.dropdownRequest),
      dropdownFix:     this.masterService.getDropdownFix(this.dropdownFix),
      fixedDeductions: this.coreService.getCoreDropdown(1021,this.dropdownRequest),
      fixedEarnings:   this.coreService.getCoreDropdown(1022,this.dropdownRequest),
      payrollCutoff:   this.coreService.getCoreDropdown(1023,this.dropdownRequest),
      sss:             this.coreService.getCoreDropdown(1024,this.dropdownRequest),
      hdmf:            this.coreService.getCoreDropdown(1025,this.dropdownRequest),
      phic:            this.coreService.getCoreDropdown(1026,this.dropdownRequest),
      tax:             this.coreService.getCoreDropdown(1027,this.dropdownRequest),
      _13Month:        this.coreService.getCoreDropdown(1037,this._13MonthRequest),
      _14Month:        this.coreService.getCoreDropdown(1038,this._14MonthRequest),
      _15Month:        this.coreService.getCoreDropdown(1039,this._15MonthRequest),
      _16Month:        this.coreService.getCoreDropdown(1040,this._16MonthRequest),
      premRate:        this.coreService.getCoreDropdown(1036,this.dropdownRequest),
      inDailyEarnings: this.coreService.getCoreDropdown(1047,this.dropdownRequest),


    }).subscribe({
      next: (value: any) => {
       this.patchData(value)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        this.isSave = false
        this.payrollCategoryForm.enable();
      }
    });
  }
  confirm(){
    SuccessMessage.title = "Confirmed"
    SuccessMessage.message = "Payroll Category Successfuly Confirmed!"
    this.message.open(SuccessMessage);
    var data = this.payrollCategoryForm.value
    this.formChanged.emit(data)
  }

  submit() {
    if (this.payrollCategoryForm.valid) {
      const dialogRef = this.message.open(SaveMessage);
      dialogRef.afterClosed().subscribe((result) => {
        if (result == "confirmed") {
          this.isSave = true
          this.payrollService.postPayrollCategory(this.payrollCategoryForm.value).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.message.open(SuccessMessage);
                this.isSave = false,
                  this.router.navigate(['/search/payroll-category']);
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

}
