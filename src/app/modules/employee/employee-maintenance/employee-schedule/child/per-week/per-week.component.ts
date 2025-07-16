import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownSettings, SystemSettings } from 'app/model/app.constant';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { EmployeeScheduleTag } from 'app/model/employee/employee-schedule';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { ShiftService } from 'app/services/shiftService/shift.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import _ from 'lodash';
import { ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-per-week',
    templateUrl: './per-week.component.html',
    styleUrls: ['./per-week.component.css']
})
export class PerWeekComponent implements OnInit {
    isSave: boolean = true
    dropdownRequest = new DropdownRequest;
    @ViewChild('Table') Table: MatTable<any>;
    moduleType = []
    options: any[] = [];
    scheduleForm: FormGroup
    EmployeeForm: FormGroup
    systemSettings = SystemSettings
    type: number
    displayedColumns: string[] = ['EmployeeCode', 'DisplayName', 'ShiftName', 'Description'];
    dataSource = [];
    dropdownOptions = new DropdownOptions
    placeholder: string = "Select Tag Type"
    searchFilter: string = ""
    id: string;
    complete: boolean = false
    inputChange: UntypedFormControl = new UntypedFormControl();
    data: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    hideSubmit: boolean = false
    tagtypeDefault: number = null
    handleFirstLoad: boolean = true
    index: number = 1
    dropdownSettings = DropdownSettings
    protected _onDestroy = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private coreService: CoreService,
        private shiftService: ShiftService,
        private tenantService: TenantService,
        private masterService: MasterService,
        private message: FuseConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.scheduleForm = this.fb.group(new EmployeeScheduleTag());
        const dropdownFix = this.coreService.getDropdownFix([50])
        this.dropdownOptions.provinceDef = dropdownFix.filter(x => x.typeID === 50)
        this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
        this.shiftService.getShiftDropdown(this.dropdownRequest).subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    this.dropdownOptions.shiftCodeDef = value.payload

                    const dropdownFix = this.coreService.getDropdownFix([50])
                    this.dropdownOptions.tagTypeDef = dropdownFix.filter(x => x.typeID === 50)
                    if (this.id !== "") {
                        this.hideSubmit = true
                        this.shiftService.getEmployeeScheduleTag(this.id).subscribe({
                            next: (value: any) => {
                                if (value.statusCode == 200) {
                                    console.log(value.payload)
                                    this.scheduleForm.patchValue(JSON.parse(JSON.stringify(value.payload).replace(/\:null/gi, "\:[]")))
                                    this.tagtypeDefault = value.payload.tagTypeId
                                    this.dataSource = value.payload.employeeScheduleTagDetail
                                    this.scheduleForm.disable()
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
                        this.displayedColumns.push("Action")
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


            switch (this.scheduleForm.get("tagType").value) {
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

    handlerChange() {
        this.dropdownOptions.dropdownNameDef = []
        this.scheduleForm.get("tagTypeId").setValue(null)
        this.scheduleForm.controls['tagTypeId'].disable();
        this.dropdownRequest = new DropdownRequest()

        switch (this.scheduleForm.get("tagType").value) {
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
                                this.scheduleForm.controls['tagTypeId'].enable();
                            }
                            this.scheduleForm.get('tagTypeId').setValue(this.tagtypeDefault);
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
                            this.options = [{ dropdownID: value.payload.companyId, description: value.payload.companyName }]
                            this.data.next([{ dropdownID: value.payload.companyId, description: value.payload.companyName }]);
                            if (!this.hideSubmit) {
                                this.scheduleForm.controls['tagTypeId'].enable();
                            }
                            this.scheduleForm.get('tagTypeId').setValue(this.tagtypeDefault);
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

    handlerDropdownChange() {
        this.dropdownRequest.search = this.inputChange.value.toLowerCase()
        this.handlerChange()
    }

    handleAddSearch() {
        this.scheduleForm.markAllAsTouched();
        if (this.scheduleForm.valid) {
          this.shiftService.getShiftCodeMap(this.scheduleForm.value).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.dataSource = value.payload
                this.Table.renderRows();
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

    handleSearch() {
        this.scheduleForm.markAllAsTouched();
        if (this.scheduleForm.valid) {
            this.shiftService.getShiftCodeMap(this.scheduleForm.value).subscribe({
                next: (value: any) => {
                    if (value.statusCode == 200) {
                        this.dataSource = value.payload
                        this.Table.renderRows();
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

    handleRemove(index): void {
        this.dataSource.splice(index, 1);
        this.Table.renderRows();
    }

    submit() {
        if (!this.hideSubmit) {
            if (this.dataSource.length > 0) {
                this.scheduleForm.controls.employeeScheduleTagDetail.patchValue(this.dataSource);
                this.scheduleForm.markAllAsTouched();
                if (this.scheduleForm.valid) {
                    const dialogRef = this.message.open(SaveMessage);

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result == "confirmed") {
                            this.isSave = true

                            this.shiftService.postEmployeeShift(this.scheduleForm.value).subscribe({
                                next: (value: any) => {
                                    if (value.statusCode == 200) {
                                        this.message.open(SuccessMessage);
                                        this.isSave = false
                                        this.router.navigate(['/search/employee-schedule']);
                                    }
                                    else {
                                        this.message.open(FailedMessage);
                                        console.log(value.stackTrace)
                                        console.log(value.message)
                                        this.isSave = false
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
    }
}
