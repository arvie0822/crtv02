import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormControl } from '@angular/forms';
import { DropdownRequest, dropdownEntitlementType } from 'app/model/dropdown-entitlement.model';
import { CoreService } from 'app/services/coreService/coreService.service';
import _ from 'lodash';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime, scan } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { MatOption } from '@angular/material/core';
import { DropdownHierarchyRequest, HeirarchyDropdownRequest, HierarchyList, SearchHierarchy } from 'app/model/dropdown.model';
import { UserService } from 'app/services/userService/user.service';
import { EmployeeHierarchy } from 'app/model/employee-hierarchy';
import { GF } from 'app/shared/global-functions';
import { PayrollService } from 'app/services/payrollService/payroll.service';

enum mode {
  load = 0,
  next = 1,
  search = 2,
  all = 3,
  change = 4
}

@Component({
  selector: 'app-dropdown-hierarchy',
  templateUrl: './dropdown-hierarchy.component.html',
  styleUrls: ['./dropdown-hierarchy.component.scss']
})
export class DropdownHierarchyComponent implements OnInit {
  @Input() control:           AbstractControl = new FormControl();
  @Input() useControl: boolean = false
  @Input() options:           any[] = [];
  @Input() icon:              string
  @Input() type:              number = 0 // index itself dropdown
  @Input() multiple:          boolean = false
  @Input() all:               boolean = false
  @Input() value:             any
  @Input() id:                any // Parent selected Value
  @Input() type_id:           any // Parent selected Type
  @Input() triggerByParent:   boolean = false
  @Input() disabled:          boolean = false

  @Output() selected = new EventEmitter<any>();
  @Output() objects = new EventEmitter<any>();

  @Input() dropdownValue:  string // used for value and label default value = dropdownID , label = description
  @Input() dropdownLabel:  string // used for value and label default value = dropdownID , label = description
  @Input() objectValue:    boolean = false // used for value want object and been relected on '@Output objects'
  @Input() reset:      boolean = false
  @Input() customRequest = new DropdownHierarchyRequest
  @Input() isReports:      boolean = false
  dropdownRequest = new DropdownRequest
  inputChange: UntypedFormControl = new UntypedFormControl();
  data: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  protected _onDestroy = new Subject<void>();
  dropdownEntitlementType: any = dropdownEntitlementType
  dropdowns = EmployeeHierarchy
  dropdownDetail: any
  placeholder: string = ""
  index: number = 1
  complete: boolean = false
  _option = []
  cc : number = 0
  prev = {
    id: 0,
    text: ""
  }
  prevEnt = {
    id: [],
    type: null
  }
  prevModuleId = ""
  @ViewChild('allSelected') private allSelected: MatOption;
  param = new DropdownHierarchyRequest
  exclude = []
  @Output() exluded = new EventEmitter<any>();
  isall:any //= this.objectValue ? [{dropdownID: 0, description: "All"}] : 0

  options_old: any[] = [];
  dataOptions = new BehaviorSubject<string[]>([]);
  options$: Observable<string[]>;
  mode: number = 0
  isOptionsEmpty: boolean = false
  
  constructor(private coreService: CoreService, private userService: UserService, private payrollService: PayrollService) {
    this.options$ = this.dataOptions.asObservable().pipe(
      scan((acc, curr) => {
        var out = [];

        //if not next batch
        if (this.mode !== mode.next) {
          out = curr
        } else {
          out = _.uniqBy([...acc, ...curr], JSON.stringify);
        }

        // true if current load is empty
        this.isOptionsEmpty = GF.IsEmpty(curr)

        //back-up old record
        var old = _.uniqBy([...this.options_old,...out], JSON.stringify);
        this.options_old = GF.sort(old, 'description');
        return GF.sort(out, 'description');

      }, [])
    );
   }

  ngOnInit() {
    if(this.dropdowns.filter(x => x.index === this.type)[0] !== undefined){
      this.dropdownDetail = this.dropdowns.filter(x => x.index === this.type)[0]
    }

    this.placeholder = this.dropdownDetail.change

    this.dropdownValue =  this.objectValue ? undefined : GF.IsEmptyReturn(this.dropdownValue,'dropdownID')
    this.dropdownLabel =  GF.IsEmptyReturn(this.dropdownLabel,'description')
    this.isall = this.objectValue ? [{dropdownID: 0, description: "All"}] : 0

    this.inputChange.valueChanges
    .pipe(debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterDropdown();
    });

    this.initData(mode.load)
  }

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges){

    if ("id" in changes) {
      if (!GF.IsEmpty(changes.id.currentValue)) {
        this.initData(mode.change)
      }
    }

    // console.log(changes)
    if("reset" in changes && changes.reset.currentValue){
      if(this.value){
          this.value = []
      }
    }
  }

  initData(modee){
    this.mode = modee
    // console.log(modee,this.id)
    if (GF.IsEmpty(this.id)) {return}//return emediately if id/ee are undefined/null

    //dis-regard all validation if next batch triggered
    if (modee == mode.load || modee == mode.change) {
      this.id = Array.isArray(this.id) ? this.id : [this.id]
      var again = Array.isArray(this.prevEnt.id) ? GF.arraysAreEqual(this.prevEnt.id, this.id) : true
      if (again || this.id.every(x=>x == 0)) {return}//return emediately if previous ids same into current ids
      this.prevEnt.type  = this.type
      this.prevEnt.id    = this.id
    }
   

    var current = this.dropdowns.filter(x => x.index === this.type)[0]
    var parent = this.dropdowns.filter(x => x.dropdownTypeID === this.type_id)[0]

    this.param.id = []
    this.param.id.push({
      key: parent.key,
      dropdownID: this.id,
      dropdownTypeID:  current.dropdownTypeID
    })

      if (!GF.IsEmpty(this.customRequest?.id)) {
          if (this.customRequest?.id.some(x => x.dropdownID.length > 0)) {
              this.customRequest?.id.forEach(id => {
                  if (!this.param.id.some(x => x.dropdownID == id.dropdownID)) {
                      this.param.id.push(id)
                  }
              });
          }
      }

      if (this.isReports) {
        this.payrollService.getSearchHierarchy(this.param,false,this.isReports).subscribe({
          next: (value:any) => {
            this.dataOptions.next(value.payload)
            this.complete = (this.param.length > value.payload.length)
          },
          error: (e) => {
            console.error(e)
          }
        });
      } else {
        this.userService.getSearchHierarchy(this.param,false,this.isReports).subscribe({
          next: (value:any) => {
            this.dataOptions.next(value.payload)
            this.complete = (this.param.length > value.payload.length)
          },
          error: (e) => {
            console.error(e)
          }
        });
      }

      

  }

  getNextBatch(){
    debugger
    this.param.start = this.param.start+1
    this.initData(mode.next)
  }

  async filterDropdown(){
    const search = this.inputChange.value.toLowerCase()
    if (!search) {
      this.dataOptions.next(this.options_old)
    } else {
      this.param.search = search
      this.param.start = 0
      this.initData(mode.search)
    }
  }

  selectAll() {
    debugger
    var result: any
    if (this.useControl) {
      if (this.multiple) {
        if (this.allSelected.selected) {
          this.control.patchValue([...this.options_old.map(item => this.objectValue ? item : item[this.dropdownValue]), 0])
        } else {
          this.control.patchValue([]);
        }
      } else {
        if (this.allSelected.selected) {
          this.control.patchValue(0);
        } else {
          this.control.patchValue(null);
        }
      }
      result = this.control.value
    } else {
      if (this.multiple) {
        if (this.allSelected.selected) {
          this.value = [...this.options_old.map(item => this.objectValue ? item : item[this.dropdownValue]), 0]
        } else {
          this.value = []
        }
      } else {
        if (this.allSelected.selected) {
          this.value = 0
        } else {
          this.value = null
        }
      }
      result = this.value
    }
    // this.initData(mode.all)
    this.selected.emit(result)
    this.objects.emit(result)
  }

  selectItem(id, val){
    if (this.multiple) {
      if (val.some(x => x === 0)) {
        if (!val.some(x => x === id)) {
          this.exclude.push(id);
        } else {
          var idx = this.exclude.findIndex(x=>x===id)
          this.exclude.splice(idx,1)
        }
        this.exluded.emit(this.exclude)
      }
    }
  }

  selectedEvent(e){
      if (e.value !== undefined) {
        if (this.multiple) {
          if (e.value.some(x=>x[this.dropdownValue] === 0)) {
            return
          }
        } else {
          if (e.value === 0) {
            return
          }
        }
        this.selected.emit(e.value)
        this.objects.emit(e.value)
      }

  }

  selDisplayNgModel(values){
    try {
        if (!GF.IsEmpty(values) && !GF.IsEmpty(this.options_old)) {
            if (Array.isArray(values)) {
              if (values.some(x => x === 0)) {
                return "All";
              } else if (typeof values[0] === 'object') {
                return values[0][this.dropdownLabel]
              }
            } else if (typeof values === 'object') {
              return values[this.dropdownLabel]
            }

            var out:string
            if (this.multiple) {
              if (values.length === 0) {
                return ""
              }
              if (values.some(x=>x === 0)) {
                out = "All"
              } else {
                out = this.options_old.find(item=>item[this.dropdownValue] === values[0])[this.dropdownLabel]
              }
            } else {
              if (values === 0 && this.all) {
                out = "All"
              } else {
                if (values === 0) {
                  return ""
                }
                out = this.options_old.find(item=>item[this.dropdownValue] === values)[this.dropdownLabel]
              }
            }
            this.prev.id = values
            this.prev.text = out
            return out;
        }
    } catch (error) {
        console.log({
          error: error.message,
          value: values,
          list: this.options_old,
          dropdown: this.dropdownDetail
        })
       }

  }

  onSelectOpen(isOpen: boolean): void {
    if (isOpen) {
      // console.log('MatSelect is open');
    } else {
      this.inputChange.setValue("");
      // console.log('MatSelect is closed');
    }
  }

  isALL(e){
    if (this.multiple) {
      return !GF.IsEqual(0,e)
    } else {
      if (e === 0) {
        return false
      }
    }
  }

  get isDisabled(){
    return this.control.disabled ? true : this.isOptionsEmpty
  }
}
