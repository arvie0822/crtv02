import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { SystemSettings } from 'app/model/app.constant';
import { TKFilter, TKForm } from 'app/model/employee/timekeeping-generation';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenerateDetailedComponent } from './generate-detailed/generate-detailed.component';
import { SummaryGenerateComponent } from './summary-generate/summary-generate.component';
import { TimekeepingService } from 'app/services/timekeepingService/timekeeping.service';
import { DropdownID, DropdownRequest } from 'app/model/dropdown.model';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-timekeeping-generation',
  templateUrl: './timekeeping-generation.component.html',
  styleUrls: ['./timekeeping-generation.component.css'],
})
export class TimekeepingGenerationComponent implements OnInit {
  displayedColumns: string[] = ['employeeCode', 'displayName', 'effectiveDate', 'separationDate', 'dateFrom', 'dateTo'];
  dataSource = []
  object : any
  complete: boolean = false
  generates: boolean = false
  searchgen: boolean = false
  showbutton: boolean = false
  systemSettings = SystemSettings
  dialogRef: MatDialogRef<GenerateDetailedComponent, any>;
  tkForm: FormGroup
  dropdownRequest = new DropdownRequest;
  employeeRequest = new DropdownRequest;
  inputChange: UntypedFormControl = new UntypedFormControl();
  protected _onDestroy = new Subject<void>();
  tkFilter = new TKFilter;
  payrollCutoff: any[] = []
  payrollYear: any[] = []
  payrollMonth: any[] = []
  cutoffs: any[] = []
  subCompany: any[] = []
  branch: any[] = []
  category: any[] = []
  department: any[] = []
  confidential: any[] = []
  status: any[] = []
  employee: any[] = []
  index: number = 1
  @Input() TKCache: string = ""
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private timekeepingService: TimekeepingService
  ) { }

  ngOnInit() {
    this.tkForm = this.fb.group(new TKForm());
  }

  typeHandler() {
    this,this.generates = false
    this.tkForm.get('subCompany').setValue(null)
    this.tkForm.get('branch').setValue(null)
    this.tkForm.get('category').setValue(null)
    this.tkForm.get('department').setValue(null)
    this.tkForm.get('confidential').setValue(null)
    this.tkForm.get('status').setValue(null)
    this.tkForm.get('employee').setValue(null)
    this.tkForm.disable()
    this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
    this.tkFilter.timekeepingType = this.tkForm.value.type
    this.tkFilter.type = 0
    forkJoin({
      payrollCutoff: this.timekeepingService.getTKPayrollCutoff(this.dropdownRequest),
      tkFilter: this.timekeepingService.getTKFilter(this.tkFilter),
    }).subscribe({
      next: (value: any) => {
        this.payrollCutoff = value.payrollCutoff.payload
        this.subCompany = value.tkFilter.payload.subCompany
        this.category = value.tkFilter.payload.category
        this.department = value.tkFilter.payload.department
        this.confidential = value.tkFilter.payload.confidential
        this.status = value.tkFilter.payload.status
        console.log(value.tkFilter.payload)
        this.tkForm.enable()
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        this.inputChange.valueChanges
          .pipe(debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this._onDestroy))
          .subscribe((value) => {
            this.employeeHandler();
          });
      }
    });
  }

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe()
  }

  cutoffHandler(array) {
    array.year.map(item => this.payrollYear.push(({
      id: item,
      description: item
    })))
    this.payrollMonth = array.month
  }

  cutoffSelectionHandler() {
    console.log(this.tkForm.value)
    if (this.tkForm.value.payrollYear != 0 && this.tkForm.value.payrollMonth != 0) {
      this.cutoffs = this.tkForm.value.payrollId.cutoffs
        .filter(x => x.year == this.tkForm.value.payrollYear
          && x.month == this.tkForm.value.payrollMonth).map(item => ({
            id: item.cutoffId,
            description: item.cutoffName,
            dateFrom: item.dateFrom,
            dateTo: item.dateTo,
            sample: item.month
          }))
      console.log(this.cutoffs)
    }
  }

  setCutoffHandler() {
    this.tkForm.controls.dateFrom.setValue(new Date(this.tkForm.value.payrollCutoff.dateFrom))
    this.tkForm.controls.dateTo.setValue(new Date(this.tkForm.value.payrollCutoff.dateTo))
  }

  branchHandler() {
    debugger
    this.tkFilter.subCompany = this.tkForm.value.subCompany
    this.tkFilter.type = 1
    this.tkFilter.timekeepingType = this.tkForm.value.type
    this.timekeepingService.getTKFilter(this.tkFilter).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          this.branch = value.payload.branch
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
  }

  employeeHandler() {
    this.tkFilter.subCompany = this.tkForm.value.subCompany == 0 || this.tkForm.value.subCompany == null ? [0] : this.tkForm.value.subCompany
    this.tkFilter.branch = this.tkForm.value.branch == 0 || this.tkForm.value.branch == null ? [0] : this.tkForm.value.branch
    this.tkFilter.category = this.tkForm.value.category == 0 || this.tkForm.value.category == null ? [0] : this.tkForm.value.category
    this.tkFilter.department = this.tkForm.value.department == 0 || this.tkForm.value.department == null ? [0] : this.tkForm.value.department
    this.tkFilter.confidential = this.tkForm.value.confidential == 0 || this.tkForm.value.confidential == null ? [0] : this.tkForm.value.confidential
    this.tkFilter.status = this.tkForm.value.status == 0 || this.tkForm.value.status == null ? [0] : this.tkForm.value.status
    this.tkFilter.type = 2
    if (this.inputChange.value != null) {
      this.employeeRequest.search = this.inputChange.value.toLowerCase()
      this.employeeRequest.id = []
      this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
    }
    this.employeeRequest.start = 0
    this.tkFilter.Req = this.employeeRequest
    this.tkFilter.timekeepingType = this.tkForm.value.type
    this.timekeepingService.getTKFilter(this.tkFilter).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          this.employee = value.payload.employee
          this.complete = value.payload.employee.length > 0 ? false : true
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
  }

  selectAllHandler(ev, control, data) {
    var fm = this.tkForm.get(control) as FormControl
    if (ev._selected) {
      var all = data.map(x => x.dropdownID)
      all.push(0)
      fm.setValue(all);
      ev._selected = true;
      this.employeeHandler()
    }
    if (ev._selected == false) {
      fm.setValue([]);
      this.employeeHandler()
    }
  }

  dateHandler(type, event, index) {
    this.dataSource[index][type] = moment(event).format('YYYY-MM-DD');
  }

  async getNextBatch() {
    debugger
    if (!this.complete) {
      this.employeeRequest.search = null
      this.employeeRequest.start = this.index++
      this.employeeHandler()
    }
  }

  search() {
    this.searchgen = true
    var obj = {
      dateFrom: this.tkForm.value.dateFrom,
      dateTo: this.tkForm.value.dateTo,
      subCompany: this.tkForm.value.subCompany,
      branch: this.tkForm.value.branch,
      category: this.tkForm.value.category,
      department: this.tkForm.value.department,
      confidential: this.tkForm.value.confidential,
      status: this.tkForm.value.status,
      employee: this.tkForm.value.employee,
      includeInactive: this.tkForm.value.includeInactive,
      timekeepingType: this.tkForm.value.type
    }
    this.timekeepingService.getTimekeepingFinalEmployee(obj).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          this.dataSource = value.payload
          console.log(this.dataSource)
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
  }

  generate() {
    this.showbutton = false
    this.generates = false
    this.object = []
    var obj = {
      dateFrom:  moment(this.tkForm.value.dateFrom).format('YYYY-MM-DD'),
      dateTo: moment(this.tkForm.value.dateTo).format('YYYY-MM-DD'),
      subCompany: this.tkForm.value.subCompany,
      branch: this.tkForm.value.branch,
      category: this.tkForm.value.category,
      department: this.tkForm.value.department,
      confidential: this.tkForm.value.confidential,
      status: this.tkForm.value.status,
      employee: this.tkForm.value.employee,
      includeInactive: this.tkForm.value.includeInactive,
      timekeepingType: this.tkForm.value.type,
      timekeepingFinalEmployee: this.dataSource
    }
    this.timekeepingService.generateTimekeeping(obj).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          this.TKCache = value.payload
          this.open();
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
  }

  open() {
    this.generates = true
    var element = {
      dateFrom: this.tkForm.value.dateFrom,
      dateTo: this.tkForm.value.dateTo,
      subCompany: this.tkForm.value.subCompany,
      branch: this.tkForm.value.branch,
      category: this.tkForm.value.category,
      department: this.tkForm.value.department,
      confidential: this.tkForm.value.confidential,
      status: this.tkForm.value.status,
      employee: this.tkForm.value.employee,
      includeInactive: this.tkForm.value.includeInactive,
      cache: this.TKCache,
      timekeepingType: this.tkForm.value.type,
      payrollCutoff: this.tkForm.value.payrollId.cutoffHeaderId,
      year: this.tkForm.value.payrollYear,
      month: this.tkForm.value.payrollMonth,
      cutoff: this.tkForm.value.payrollCutoff.id
    }
    var obj = {
      type: "generate",
      props: element
    }

    this.object = obj
    // this.dialogRef = this.dialog.open(GenerateDetailedComponent, {
    //   width: '100%', height: '80%',
    //   panelClass: 'app-dialog',
    //   data: obj
    // });
  }

}

