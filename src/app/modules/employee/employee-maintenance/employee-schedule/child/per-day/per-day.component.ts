import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild,  } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownSettings, SystemSettings } from 'app/model/app.constant';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { EmployeeSchedulePerDayTag, ShiftDays } from 'app/model/employee/employee-schedule';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { ShiftService } from 'app/services/shiftService/shift.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import _ from 'lodash';
import { ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime } from 'rxjs/operators';
@Component({
    selector: 'app-per-day',
    templateUrl: './per-day.component.html',
    styleUrls: ['./per-day.component.css']
})
export class PerDayComponent implements OnInit {
    dropdownOptions = new DropdownOptions
    scheduleDayForm: FormGroup
    dropdownRequest = new DropdownRequest;
    placeholder: string = "Select Tag Type"
    type: number
    options: any[] = [];
    inputChange: UntypedFormControl = new UntypedFormControl();
    data: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    hideSubmit: boolean = false
    complete: boolean = false
    tagtypeDefault: number = null
    index: number = 1
    dropdownSettings = DropdownSettings
    systemSettings = SystemSettings
    protected _onDestroy = new Subject<void>();
    sunday: number = 0
    id: string;
    dataDays = new ShiftDays;
    @ViewChild('TableEmployee') TableEmployee: MatTable<any>;
    dataEmployee = [];
    emplopyeeColumns: string[] = ['employeeCode', 'displayName'];
    @ViewChild('TableDate') TableDate: MatTable<any>;
    dataDate = [];
    dateColumns: string[] = ['date', 'day', 'shift'];
    pipe = new DatePipe('en-US');
    isSave: boolean = true
    constructor(
        private fb: FormBuilder,
        private coreService: CoreService,
        private tenantService: TenantService,
        private masterService: MasterService,
        private shiftService: ShiftService,
        private route: ActivatedRoute,
        private message: FuseConfirmationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.scheduleDayForm = this.fb.group(new EmployeeSchedulePerDayTag());
        this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
        console.log(this.scheduleDayForm.controls.shiftDays.value.sunday)
        this.shiftService.getShiftPerDayDropdown(this.dropdownRequest).subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    this.dropdownOptions.shiftCodeDef = value.payload

                    //
                    const dropdownFix = this.coreService.getDropdownFix([50])
                    this.dropdownOptions.tagTypeDef = dropdownFix.filter(x => x.typeID === 50)
                    if (this.id !== "") {
                        this.hideSubmit = true

                        this.shiftService.getEmployeeScheduleTagPerday(this.id).subscribe({
                            next: (value: any) => {
                                if (value.statusCode == 200) {
                                    console.log(value.payload)
                                    this.scheduleDayForm.patchValue(JSON.parse(JSON.stringify(value.payload).replace(/\:null/gi, "\:[]")))
                                    this.tagtypeDefault = value.payload.tagTypeId
                                    this.dataEmployee = value.payload.employee
                                    this.dataDate = value.payload.date
                                    this.scheduleDayForm.disable()
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
                    else {
                        this.emplopyeeColumns.push("action")
                        this.dateColumns.push("action")
                    }
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

        this.inputChange.valueChanges
            .pipe(debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this._onDestroy))
            .subscribe(() => {
                this.handlerSearch();
            });
    }


    ngOnDestroy(): void {
        this._onDestroy.unsubscribe()
    }

    handleAddSearch() {
        this.scheduleDayForm.markAllAsTouched();
        if (this.scheduleDayForm.valid) {
            this.scheduleDayForm.controls.shiftDays.patchValue(this.dataDays);
            console.log(this.scheduleDayForm.value)
          this.shiftService.getShiftCodePerDayMap(this.scheduleDayForm.value).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                console.log(value)
                this.dataDate = value.payload.date
                this.dataEmployee = value.payload.employee
                this.TableDate.renderRows();
                this.TableEmployee.renderRows();
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
      }

    handlerSearch() {
        const search = this.inputChange.value.toLowerCase()
        if (!search) {
            this.data.next(this.options)
        } else {
            if (this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1).length > 0) {
                this.data.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1));
            }
            else {
                this.dropdownRequest.search = search
                this.dropdownRequest.id = []
                this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: this.type })

                this.tenantService.getDropdown(this.dropdownRequest).subscribe({
                    next: (value: any) => {
                        this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
                    },
                    error: (e) => {
                        console.error(e)
                    },
                    complete: () => {
                        this.data.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1));
                    },
                });
            }
        }
    }

    getNextBatch() {
        if (!this.complete) {
            this.dropdownRequest.search = null
            this.dropdownRequest.start = this.index++
            this.dropdownRequest.id = []
            this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: this.type })


            switch (this.scheduleDayForm.get("tagType").value) {
                case 102:
                    this.placeholder = "Branch"
                    this.type = 1001
                    this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
                    this.tenantService.getBranchDropdown(this.dropdownRequest).subscribe({
                        next: (value: any) => {
                            if (value.statusCode == 200) {
                                this.completeChecker(value.payload)
                                this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
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
                    break;
                case 103:
                    this.placeholder = "Company"
                    this.type = 1001
                    this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
                    this.masterService.getCompany().subscribe({
                        next: (value: any) => {
                            if (value.statusCode == 200) {
                                this.completeChecker(value.payload)
                                this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
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

                    break;
            }
        }
    }

    completeChecker(option): void {
        if (this.dropdownSettings.length > option.length) {
            this.complete = true
        }
        else {
            this.complete = false
        }
    }

    handleEmployeeRemove(index): void{
        this.dataEmployee.splice(index, 1);
        this.TableEmployee.renderRows();
    }

    handleDayRemove(index): void{
        this.dataDate.splice(index, 1);
        this.TableDate.renderRows();
    }

    handlerChange() {
        this.dropdownOptions.dropdownNameDef = []
        this.scheduleDayForm.get("tagTypeId").setValue(null)
        this.scheduleDayForm.controls['tagTypeId'].disable();
        this.dropdownRequest = new DropdownRequest()

        switch (this.scheduleDayForm.get("tagType").value) {
            case 102:
                this.placeholder = "Branch"
                this.type = 1001
                this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
                this.tenantService.getBranchDropdown(this.dropdownRequest).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.options = value.payload
                            this.data.next(value.payload.slice());
                            if (!this.hideSubmit) {
                                this.scheduleDayForm.controls['tagTypeId'].enable();
                            }
                            this.scheduleDayForm.get('tagTypeId').setValue(this.tagtypeDefault);
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
                break;
            case 103:
                this.placeholder = "Company"
                this.type = 1001
                this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
                this.masterService.getCompany().subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.options = [{ dropdownID: value.payload.company_id, description: value.payload.company_name }]
                            this.data.next([{ dropdownID: value.payload.company_id, description: value.payload.company_name }]);
                            if (!this.hideSubmit) {
                                this.scheduleDayForm.controls['tagTypeId'].enable();
                            }
                            this.scheduleDayForm.get('tagTypeId').setValue(this.tagtypeDefault);
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

                break;
        }
    }

    submit() {
        if (!this.hideSubmit) {
            if (this.dataEmployee.length > 0) {
                this.scheduleDayForm.controls.employeeSchedulePerDayTagEmployee.patchValue(this.dataEmployee);
                this.scheduleDayForm.controls.employeeSchedulePerDayTagDate.patchValue(this.dataDate);
                this.scheduleDayForm.markAllAsTouched();
                if (this.scheduleDayForm.valid) {
                    const dialogRef = this.message.open(SaveMessage);

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result == "confirmed") {
                            this.isSave = true
                            this.shiftService.postEmployeeShiftPerDay(this.scheduleDayForm.value).subscribe({
                                next: (value: any) => {
                                    if (value.statusCode == 200) {
                                        this.message.open(SuccessMessage);
                                        this.router.navigate(['/search/employee-schedule']);
                                        this.isSave = false
                                    }
                                    else {
                                        this.message.open(FailedMessage);
                                        console.log(value.stackTrace)
                                        console.log(value.message)
                                        this.isSave = false
                                    }
                                },
                                error: (e) => {
                                    this.message.open(FailedMessage);
                                    console.error(e)
                                }
                            });
                        }
                    });
                }
            }
        }
    }
}
