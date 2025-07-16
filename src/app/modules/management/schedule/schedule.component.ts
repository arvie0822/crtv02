import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild,  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownSettings, SystemSettings } from 'app/model/app.constant';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { EmployeeSchedulePerDayTag, ShiftDays } from 'app/model/management/schedule';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { ShiftService } from 'app/services/shiftService/shift.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import _ from 'lodash';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

    istimeerrror:boolean
    dropdownOptions = new DropdownOptions
    scheduleDayForm: FormGroup
    dropdownRequest = new DropdownRequest;
    dropdownFixRequest = new DropdownRequest;
    placeholder: string = "Select Tag Type"
    type: number
    options: any[] = [];
    optionsChild: any[] = [];
    optionsParent: any[] = [];
    inputChange: UntypedFormControl = new UntypedFormControl();
    data: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    inputChangeChild: UntypedFormControl = new UntypedFormControl();
    dataChild: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    inputChangeParent: UntypedFormControl = new UntypedFormControl();
    dataparent: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    hideSubmit: boolean = false
    complete: boolean = false
    tagtypeDefault: number = null
    index: number = 1
    indexChild: number = 1
    indexParent: number = 1
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
    timererror=false
    old_value = 0

    @ViewChild('shiftTable') shiftTable: MatTable<any>;
    weekOptions = [{ dropdownID: 1, description: "No" }, { dropdownID: 2, description: "Two Week" }, { dropdownID: 3, description: "Three Week" }, { dropdownID: 4, description: "Four Week" }]
    columns: string[] = ['apply', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    dataSource = [{
        apply: {id: null, child: []},
        monday:{id: null, child: []},
        tuesday: {id: null, child: []},
        wednesday: {id: null, child: []},
        thursday: {id: null, child: []},
        friday: {id: null, child: []},
        saturday: {id: null, child: []},
        sunday: {id: null, child: []},
    }]
    dataSource01 = []
    isSave: boolean = true
    child_list = []
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
        this.scheduleDayForm.disable()
        // this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })
        this.dropdownFixRequest.id.push({ dropdownID: 0, dropdownTypeID: 50 })

        if (this.id !== "") {
            this.hideSubmit = true

            this.shiftService.getEmployeeScheduleTagPerday(this.id).subscribe({
                next: (value: any) => {
                    if (value.statusCode == 200) {
                        value.payload.shiftDays.forEach((ee, ii) => {
                            ee["apply"] = {id: null, child: []}
                        });

                        this.scheduleDayForm.patchValue(JSON.parse(JSON.stringify(value.payload).replace(/\:null/gi, "\:[]")))
                        this.tagtypeDefault = value.payload.tagTypeId
                        this.dataEmployee = value.payload.employee
                        this.dataDate = value.payload.date
                        this.dataSource = value.payload.shiftDays
                        this.scheduleDayForm.disable()

                        value.payload.shiftDays.forEach(ee => {
                            this.old_value !== ee.apply.id ?      this.setDropdownRequest(ee.apply.id)   : null
                            this.old_value !== ee.monday.id ?     this.setDropdownRequest(ee.monday.id) : null
                            this.old_value !== ee.tuesday.id ?    this.setDropdownRequest(ee.tuesday.id) : null
                            this.old_value !== ee.wednesday.id ?  this.setDropdownRequest(ee.wednesday.id) : null
                            this.old_value !== ee.thursday.id ?   this.setDropdownRequest(ee.thursday.id) : null
                            this.old_value !== ee.friday.id ?     this.setDropdownRequest(ee.friday.id) : null
                            this.old_value !== ee.saturday.id ?   this.setDropdownRequest(ee.saturday.id) : null
                            this.old_value !== ee.sunday.id ?     this.setDropdownRequest(ee.sunday.id) : null
                        });

                        this.initData()

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
            this.initData()
        }
    }

    setDropdownRequest(id){
        id !== null ? this.dropdownRequest.id.push({dropdownID: id, dropdownTypeID: 0 }) : null
        this.old_value = id
    }

    initData(){
        forkJoin({
            shift: this.shiftService.getShiftPerDayDropdown(this.dropdownRequest),
            dropdownMaster: this.masterService.getDropdownFix(this.dropdownFixRequest),
        }).subscribe({
            next: (response) => {
                this.dropdownOptions.shiftCodeDef = response.shift.payload
                this.optionsParent = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID  && item.dropdownID )
                this.dataparent.next(this.optionsParent)
                this.optionsChild = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID != 3 && item.dropdownID != 2 && item.dropdownID != 4
                    && item.dropdownID != 5 && item.dropdownID != 6 && item.dropdownID != 1)
                this.dataChild.next(this.optionsChild)
                this.dropdownOptions.tagTypeDef = response.dropdownMaster.payload.filter(x => x.dropdownTypeID === 50)


            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
                this.scheduleDayForm.enable()

                this.inputChange.valueChanges.
                    pipe(debounceTime(300),
                    distinctUntilChanged(),
                    takeUntil(this._onDestroy)).subscribe(() => {
                        this.handlerSearch();
                    });

                this.inputChangeChild.valueChanges.
                    pipe(debounceTime(300),
                    distinctUntilChanged(),
                    takeUntil(this._onDestroy)).subscribe(() => {
                        this.handlerSearchChild()
                    });

                this.inputChangeParent.valueChanges.
                    pipe(debounceTime(300),
                    distinctUntilChanged(),
                    takeUntil(this._onDestroy)).subscribe(() => {
                        this.handlerSearcParent()
                    });
            },
        });
    }


    ngOnDestroy(): void {
        this._onDestroy.unsubscribe()
    }

    handleAddSearch() {
        this.scheduleDayForm.markAllAsTouched();
        if (this.scheduleDayForm.valid) {
            this.scheduleDayForm.controls.employeeSchedulePerDayShiftDay.patchValue(this.dataSource);
          this.shiftService.getShiftCodePerDayMap(this.scheduleDayForm.value).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.dataDate = value.payload.date
                this.dataEmployee = value.payload.employee
                this.TableDate.renderRows();
                this.TableEmployee.renderRows();
                console.log(this.dataDate)

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

      handleApply(event, index){
        this.dataSource[index].apply.id = event
        this.dataSource[index].monday.id = event
        this.dataSource[index].tuesday.id = event
        this.dataSource[index].wednesday.id = event
        this.dataSource[index].thursday.id = event
        this.dataSource[index].friday.id = event
        this.dataSource[index].saturday.id = event
        this.dataSource[index].sunday.id = event

        this.change(index,"apply")
        this.change(index,"monday")
        this.change(index,"tuesday")
        this.change(index,"wednesday")
        this.change(index,"thursday")
        this.change(index,"friday")
        this.change(index,"saturday")
        this.change(index,"sunday")

        // this.dataSource01 = this.dataSource

      }

      handleApplychild(event ,x, i){
        this.dataSource[i].apply.child[x].id = event
        this.dataSource[i].monday.child[x].id = event
        this.dataSource[i].tuesday.child[x].id = event
        this.dataSource[i].wednesday.child[x].id = event
        this.dataSource[i].thursday.child[x].id = event
        this.dataSource[i].friday.child[x].id = event
        this.dataSource[i].saturday.child[x].id = event
        this.dataSource[i].sunday.child[x].id = event
      }

      change(index ,day){
        console.log( this.dataSource )
        this.dataSource[index][day].child = []
        if(this.dataSource[index][day].id == 6){
            this.dataSource[index][day].child.push({id:null},{id:null})
        }else if(this.dataSource[index][day].id == 2){
            this.dataSource[index][day].child.push({id:null})

        }
        console.log(this.dataSource[index][day].child)
        // this.shiftTable.renderRows();
      }



      handlerWeekChange(){
        this.dataSource = []
        console.log()
        for (let i = 0; i <= this.scheduleDayForm.value.weekCount-1 ; i++) {
            this.dataSource.push({
                // apply: null,
                // monday: null,
                // tuesday: null,
                // wednesday: null,
                // thursday: null,
                // friday: null,
                // saturday: null,
                // sunday: null,

                apply:{id: null, child: [] },
                monday:{id: null, child: [] },
                tuesday: {id: null, child: []},
                wednesday: {id: null, child: []},
                thursday: {id: null, child: []},
                friday: {id: null, child: []},
                saturday: {id: null, child: []},
                sunday: {id: null, child: []},


            })
          }
        //   this.shiftTable.renderRows();
      }

    handlerSearchChild() {
        const search =  this.inputChangeChild.value.toLowerCase()
        if (!search) {
            this.dataChild.next(this.optionsChild)
        } else {
            if (this.optionsChild.filter(x => x.description.toLowerCase().indexOf(search) > -1).length > 0) {
                    this.optionsChild = this.optionsChild.filter(item=>item.dropdownID != 3 && item.dropdownID != 2)
                this.dataChild.next(this.optionsChild.filter(x => x.description.toLowerCase().indexOf(search) > -1));
            }
            else {
                this.dropdownRequest.search = search
                this.dropdownRequest.id = []
                this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: this.type })

                this.shiftService.getShiftPerDayDropdown(this.dropdownRequest).subscribe({
                    next: (value: any) => {
                        this.optionsChild = _.uniqBy([...this.optionsChild, ...value.payload], JSON.stringify)
                            this.optionsChild = this.optionsChild.filter(item=>item.dropdownID != 3 && item.dropdownID != 2)
                    },
                    error: (e) => {
                        console.error(e)
                    },
                    complete: () => {
                        this.dataChild.next(this.optionsChild.filter(x => x.description.toLowerCase().indexOf(search) > -1));
                    },
                });
            }
        }
    }

    getNextBatchChild() {
        console.log(this.optionsChild)
        if (!this.complete) {
            const search = this.inputChangeChild.value.toLowerCase()

            if (search) {
                this.dropdownRequest.search = search
            }
            this.dropdownRequest.search = null
            this.dropdownRequest.start = this.indexChild++
            this.dropdownRequest.id = []
            this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0})


            this.shiftService.getShiftPerDayDropdown(this.dropdownRequest).subscribe({
                next: (value: any) => {
                    this.optionsChild = _.uniqBy([...this.optionsChild, ...value.payload], JSON.stringify)
                        this.optionsChild = this.optionsChild.filter(item=>item.dropdownID != 3 && item.dropdownID != 2)
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                    this.dataChild.next(this.optionsChild);
                },
            });
        }
    }

    handlerSearcParent() {

        const search =  this.inputChangeParent.value.toLowerCase()
        if (!search) {
            this.dataparent.next(this.optionsParent)
        }
        else {
            // if (this.optionsParent.filter(x => x.description.toLowerCase().indexOf(search) > -1).length > 0) {
            //         this.optionsParent = this.optionsParent.filter(item=>item.dropdownID && item.dropdownID)
            //         this.dataparent.next(this.optionsParent.filter(x => x.description.toLowerCase().indexOf(search) > -1));
            // }
            // else {
                this.dropdownRequest.search = search
                this.dropdownRequest.id = []
                this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: this.type })

                this.shiftService.getShiftPerDayDropdown(this.dropdownRequest).subscribe({
                    next: (value: any) => {
                        this.optionsParent = _.uniqBy([...this.optionsParent, ...value.payload], JSON.stringify)
                        this.optionsParent = this.optionsParent.filter(item=>item.dropdownID  && item.dropdownID)
                    },
                    error: (e) => {
                        console.error(e)
                    },
                    complete: () => {
                        this.dataparent.next(this.optionsParent.filter(x => x.description.toLowerCase().indexOf(search) > -1));
                    },
                });
            // }
        }
    }

    getNextBatchParent() {
        if (!this.complete) {
            const search =  this.inputChangeParent.value.toLowerCase()

            if (search) {
                this.dropdownRequest.search = search
            }
            this.dropdownRequest.search = null
            this.dropdownRequest.start = this.indexParent++
            this.dropdownRequest.id = []
            this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0})


            this.shiftService.getShiftPerDayDropdown(this.dropdownRequest).subscribe({
                next: (value: any) => {
                    this.optionsParent = _.uniqBy([...this.optionsParent, ...value.payload], JSON.stringify)
                        this.optionsParent = this.optionsParent.filter(item=> item.dropdownID && item.dropdownID )
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                    this.dataparent.next(this.optionsParent);
                    console.log(this.dataparent)
                },
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
                            this.options = [{ dropdownID: value.payload.companyId, description: value.payload.companyName }]
                            this.data.next([{ dropdownID: value.payload.companyId, description: value.payload.companyName }]);
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
                // var dt = this.dataSource
                // dt.splice(0,1)
                // // delete dt[0].apply
                this.scheduleDayForm.controls.employeeSchedulePerDayTagEmployee.patchValue(this.dataEmployee);
                this.scheduleDayForm.controls.employeeSchedulePerDayTagDate.patchValue(this.dataDate);
                this.scheduleDayForm.controls.employeeSchedulePerDayShiftDay.patchValue(this.dataSource);
                this.scheduleDayForm.markAllAsTouched();
                if (this.scheduleDayForm.valid) {
                    const dialogRef = this.message.open(SaveMessage);

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result == "confirmed") {
                            this.isSave = true
                            console.log(JSON.stringify(this.scheduleDayForm.value))
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

    timeValidator(day,i,x) {
        this.timererror =false
        if (x==0) {
            return
        }

        var timestart0 = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID==this.dataSource[i][day]["child"][0].id)[0].timeOut
        var timeout1 = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID==this.dataSource[i][day]["child"][1].id)[0].timeIn


        const timestart = this.pipe.transform(timestart0, 'HH:mm')//1st shift out
        const timeout = this.pipe.transform(timeout1, 'HH:mm')//2nd shift in
        console.log(timestart)
        console.log(timeout)



        console.log(timestart)
        console.log(timeout)

          let f_out = [];
          let s_in = [];
          f_out = timestart.split(':');
          s_in = timeout.split(':');
        //   console.log(timeout)
          if (parseInt(f_out[0]) > parseInt(s_in[0])) {
            // invalidtime.message= "Second Shift"+" time overlap in "+"First Shift"+" time!"
            //     this.timererror= true
            //     this.dataSource[i][day]["child"][1].id=null

          } else if (parseInt(f_out[0]) === parseInt(s_in[0]) && parseInt(f_out[1]) > parseInt(s_in[1])) {
            // this.timererror= true
            // this.dataSource[i][day]["child"][1].id=null

        //   console.log("Invalid time 1")
        }

    }

    // timeValidatorparent(prev,day,i) {

    //     if (i==0 && day == "wednesday") {
    //         return
    //     }


    //     var timestart3 = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID==this.dataSource[i][prev].id)[0].timeIn
    //     var timeout3 = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID==this.dataSource[i][day].id)[0].timeOut

    //     const timestart1 = this.pipe.transform(timestart3, 'HH:mm')
    //     const timeout2 = this.pipe.transform(timeout3, 'HH:mm')
    //     console.log(timestart3)
    //     console.log(timeout3)


    //       let f_out = [];
    //       let s_in = [];
    //       let c_out = [];
    //       f_out = timestart1.split(':');
    //       s_in = timeout2.split(':');

    //       if (parseInt(f_out[0]) > parseInt(s_in[0]) ) {
    //         const dialogRef = this.message.open(invalidtime);
    //         dialogRef.afterClosed().subscribe((result) => {
    //             this.dataSource[i][day].id=null
    //         })
    //       } else if (parseInt(f_out[0]) === parseInt(s_in[0]) && parseInt(f_out[1]) > parseInt(s_in[1])) {
    //         const dialogRef = this.message.open(invalidtime);
    //         this.dataSource[i][day].id=null

    //     }
    // }

    timeValidatorparent(prev,day,i,isPrev) {
        console.log(prev,day,i)
        var ii = i

        if (i==0 && day == "monday") {
            return
        }else if(i >= 1 && day == "monday"){
            ii = (ii-1)
        }

        if (this.dataSource[ii][prev].id == null || this.dataSource[i][day].id == null || this.dataSource[i][day].id == 1 || this.dataSource[i][day].id == 4
            || this.dataSource[i][day].id == 5 || this.dataSource[i][day].id == 2 || this.dataSource[i][day].id == 3) {
            return
        }

        var cur_in = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID==this.dataSource[i][day].id)[0].timeIn
        var cur_out = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID==this.dataSource[i][day].id)[0].timeOut

        var prev_in = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID==this.dataSource[ii][prev].id)[0].timeIn
        var prev_out = this.dropdownOptions.shiftCodeDef.filter(item=>item.dropdownID==this.dataSource[ii][prev].id)[0].timeOut

        const h_cur_in = this.pipe.transform(cur_in, 'HH:mm')
        const h_cur_out = this.pipe.transform(cur_out, 'HH:mm')

        const h_prev_in = this.pipe.transform(prev_in, 'HH:mm')
        const h_prev_out = this.pipe.transform(prev_out, 'HH:mm')

        console.log("cur_in",cur_in)
        console.log("cur_out",cur_out)
        console.log("prev_in",prev_in)
        console.log("prev_out",prev_out)


          let h_cur_in_s = [];
          let h_cur_out_s = [];
          h_cur_in_s = h_cur_in.split(':');
          h_cur_out_s = h_cur_out.split(':');

          let h_prev_in_s = [];
          let h_prev_out_s = [];
          h_prev_in_s = h_prev_in.split(':');
          h_prev_out_s = h_prev_out.split(':');


        if (parseInt(h_prev_out_s[0]) > parseInt(h_cur_in_s[0])) {
            // invalidtime.message= day+" time overlap in "+prev+" time!"ks
            // this.timererror= true
            // this.dataSource[i][day].id.setValue("")
        }


    }
    selectAll(ev){
        if(ev._selected){
            this.scheduleDayForm.controls.tagTypeId.patchValue([...this.options.map(item => item.dropdownID)]);
            ev._selected=true;
        }
        if(ev._selected==false){
          this.scheduleDayForm.get("tagTypeId").setValue([])
        }

      }


    // async filterDropdown(){
    //     const search = this.inputChange.value.toLowerCase()

    //     if (!search) {
    //         this.child_list.next(this.options)
    //       } else {
    //         if(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1).length > 0){
    //           this.child_list.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1));
    //         }
    //         else{
    //           this.dropdownRequest.search = search
    //           this.dropdownRequest.id = []
    //           this.dropdownRequest.id.push({dropdownID: 0, dropdownTypeID: this.type})

    //           if(this.isDropdownFix){
    //               this.masterService.getDropdownFix(this.dropdownRequest).subscribe({
    //                   next: (value:any) => {
    //                     this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
    //                   },
    //                   error: (e) => {
    //                     console.error(e)
    //                   },
    //                   complete: () => {
    //                     this.data.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1));
    //                   },
    //                 });
    //           }
    //           else{
    //               this.tenantService.getDropdown(this.dropdownRequest).subscribe({
    //                   next: (value:any) => {
    //                     this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
    //                   },
    //                   error: (e) => {
    //                     console.error(e)
    //                   },
    //                   complete: () => {
    //                     this.data.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1));
    //                   },
    //                 });
    //           }

    //         }
    //       }
    // }
}

