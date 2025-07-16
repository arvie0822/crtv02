import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { DropdownSettings, SystemSettings } from 'app/model/app.constant';
import { DropdownRequest, dropdownType, dropdownTypeFix } from 'app/model/dropdown.model';
import { MasterService } from 'app/services/masterService/master.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { GF } from 'app/shared/global-functions';
import _ from 'lodash';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime, scan } from 'rxjs/operators';
import { myData } from 'app/app.moduleId';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() control: AbstractControl = new FormControl();
  @Input() useControl: boolean = true
  @Input() reset: boolean = false
  @Input() options: any[] = [];
  @Input() icon: string
  @Input() type: number = 0
  @Input() all:  boolean = false
  @Input() id:       string
  @Input() multiple: boolean = false
  @Input() value: any
  @Input() label: string
  @Input() disabled : boolean = false
  @Input() dropdownValue:  string // used for value and label default value = dropdownID , label = description
  @Input() dropdownLabel:  string // used for value and label default value = dropdownID , label = description
  @Input() objectValue:    boolean = false // used for value want object and been relected on '@Output objects'
  @Input() disableOptions: number[] = []
  @Output() selected = new EventEmitter<any>();
  @Output() exluded = new EventEmitter<any>();
  @Output() objects = new EventEmitter<any>();
  isDropdownFix: boolean = false
  dropdownRequest = new DropdownRequest
  inputChange: UntypedFormControl = new UntypedFormControl();
  data: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  protected _onDestroy = new Subject<void>();
  dropdownTypeFix: any = dropdownTypeFix
  dropdownType: any = dropdownType
  systemSettings = SystemSettings
  dropdownSettings = DropdownSettings
  dropdownDetail = {
    id: 0,
    description: ""
  }
  options_old: any[] = [];
  placeholder: string = ""
  index: number = 1
  complete: boolean = false
  // value = '';
  prev = {
    id: null,
    text: ""
  }
  exclude = []
  dataOptions = new BehaviorSubject<string[]>([]);
  options$: Observable<string[]>;
  mode = 0;//1 - search;

  @ViewChild('allSelected') private allSelected: MatOption;

  constructor(
    private tenantService: TenantService,
    private masterService: MasterService
  ) {
    this.options$ = this.dataOptions.asObservable().pipe(
      scan((acc, curr) => {
        var out = [];

        //next batch 1 or 0 not
        if (this.mode === 1) {
          out = curr
        } else {
          out = _.uniqBy([...acc, ...curr], JSON.stringify);
        }

        //back-up old record
        var old = _.uniqBy([...this.options_old,...out], JSON.stringify);
        if (!myData.dropdownBypass) {
            this.options_old = GF.sort(old, 'description');
            return GF.sort(out, 'description');
        } else {
            this.options_old = old // GF.sort(old,'description');
            return out // GF.sort(out,'description');
        }

      }, [])
    );
  }

  ngOnInit() {
    if(this.dropdownTypeFix.filter(x => x.id === this.type)[0] == undefined){
      this.dropdownDetail = this.dropdownType.filter(x => x.id === this.type)[0]
      this.isDropdownFix = false
    }
    else{
      this.isDropdownFix = true
      this.dropdownDetail = this.dropdownTypeFix.filter(x => x.id === this.type)[0]

    }
    this.placeholder = this.label == undefined || this.label == null || this.label == "" ? this.dropdownDetail.description : this.label

    this.dropdownValue =  this.objectValue ? undefined : GF.IsEmptyReturn(this.dropdownValue,'dropdownID')
    this.dropdownLabel =  GF.IsEmptyReturn(this.dropdownLabel,'description')

    this.inputChange.valueChanges
    .pipe(debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this._onDestroy))
    .subscribe((res) => {
        if (res != "") {
          this.dropdownRequest.start = 0
          this.filterDropdown(1);
        } else {
          this.dataOptions.next(this.options_old)
        }
    });

    // this.options_old = this.options.slice();
    // this.dataOptions.next(GF.IsEmptyReturn(this.options,this.options_old))

    if (!this.useControl && this.options.length == 0) {
      this.filterDropdown(0)

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

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( 'value' in changes ) {
      if (!GF.IsEmpty(changes.value.currentValue)) {
        this.isDropdownFix = !GF.IsEmpty(this.dropdownTypeFix.filter(x => x.id === this.type)[0])
        this.filterDropdown(0)
      }
    }

    if ("reset" in changes) {
      if (this.value && changes.reset.currentValue) {
        this.value = []
      }
    }

    if ( 'options' in changes ) {
      this.dataOptions.next(this.options)
      // this.completeChecker(this.options)
    }
  }

  get isRequired(): boolean {
    return this.control.validator && this.control.validator({} as AbstractControl) && this.control.validator({} as AbstractControl).required;
  }

  get isInputEmpty(): boolean {
    return !this.control.value || this.control.value.length === 0;
  }

  filterDropdown(m){
    this.mode = m;
    const search = this.inputChange.value?.toLowerCase() || ""

    // if (!search&&this.options.length > 0) {
    //   this.data.next(this.options)
    // } else {
      // if(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1).length > 0){
      //   this.data.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1));
      // }
      // else{
        this.dropdownRequest.search = search
        this.dropdownRequest.id = []
        // if(this.value === true || this.value === false){
        //     this.value = 0
        // }
        if (this.multiple && !GF.IsEmpty(this.value)) {
          this.value.forEach(id => {
            this.dropdownRequest.id.push({dropdownID: id, dropdownTypeID: this.type})
          });
        } else {
          this.dropdownRequest.id.push({dropdownID: GF.IsEmpty(this.value) ? 0 : this.value ? 0 : this.value , dropdownTypeID: this.type})
        }
        if(this.isDropdownFix){
            this.masterService.getDropdownFix(this.dropdownRequest).subscribe({
                next: (value: any) => {
                  // console.log("filterDropdown")
                  // this.options_old = value.payload
                  // this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
                  this.dataOptions.next(value.payload)
                },
                error: (e) => {
                  console.error(e)
                },
                complete: () => {
                  // this.options_old = this.options.slice()
                  // this.dataOptions.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1))
                  // this.data.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1));
                },
              });
        }
        else{
            this.tenantService.getDropdown(this.dropdownRequest).subscribe({
                next: (value:any) => {
                  // this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
                  this.dataOptions.next(value.payload)
                },
                error: (e) => {
                  console.error(e)
                },
                complete: () => {
                  // this.data.next(this.options.filter(x => x.description.toLowerCase().indexOf(search) > -1));
                },
              });

        }

      // }
    // }
  }

  async getNextBatch(m){
    this.mode = m;
    if(!this.complete){
      this.dropdownRequest.search = this.inputChange.value?.toLowerCase() || null
      this.dropdownRequest.start = this.index++
      this.dropdownRequest.id = []
      if (this.multiple && !GF.IsEmpty(this.value)) {
        this.value.forEach(id => {
          this.dropdownRequest.id.push({dropdownID: id, dropdownTypeID: this.type})
        });
      } else {
        this.dropdownRequest.id.push({dropdownID: GF.IsEmptyReturn(this.value,0), dropdownTypeID: this.type})
      }
      if(this.isDropdownFix){
        this.masterService.getDropdownFix(this.dropdownRequest).subscribe({
            next: (value:any) => {
              this.completeChecker(value.payload)
              // this.options = _.uniqBy([...this.options,...value.payload], JSON.stringify)
              this.dataOptions.next(value.payload)
              if (this.allSelected.selected) {
                this.selectAll()
              }
            },
            error: (e) => {
              console.error(e)
            },
            complete: () => {
              // var search = this.dropdownRequest.search==null || this.dropdownRequest.search == ""
              // var op = search ? this.options : this.options.filter(item=>item.description.toLowerCase().indexOf(this.dropdownRequest.search) > -1)
              // this.data.next(op);
            },
          });
      }
      else{
        this.tenantService.getDropdown(this.dropdownRequest).subscribe({
            next: (value:any) => {
              this.dataOptions.next(value.payload)
              this.completeChecker(value.payload)
              // this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
            },
            error: (e) => {
              console.error(e)
            },
            complete: () => {
              // this.data.next(this.options);
            },
          });
      }
    }
  }

  completeChecker(option): void {
    if(this.dropdownSettings.length > option.length){
      this.complete = true
    }
    else{
      this.complete = false
    }
  }

  selectAll() {
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

    this.selected.emit(result)
    this.objects.emit(result)
  }

  selectItem(id, val){
    if (this.multiple) {
      if (val.some(x => x === 0)) {
        if (this.options.length != val.filter(y=>y != 0).length) {
          this.allSelected.deselect()
          val = val.filter(xx=>xx != 0)
        }

        if (!val.some(x => x === id)) {
          this.exclude.push(id);
        } else {
          var idx = this.exclude.findIndex(x=>x===id)
          this.exclude.splice(idx,1)
        }
        this.exluded.emit(this.exclude)
      } else {
        if (this.options.length === val.filter(y=>y != 0).length) {
          this.allSelected.select()
          val = [...val,0]
        } 
      }
    }
  }

  selectedEvent(e){
      if (e.value !== undefined) {
        if (this.multiple) {
          if (e.value.some(x=>x.dropdownID === 0)) {
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
          if (values.some(x=>x===0)) {
            return "All";
          } else if (typeof values[0] === 'object'){
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
            // console.log(values,this.options_old)
            if (values === 0) {
              return ""
            }
            // console.log(values)
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

  isALL(e){
    if (this.multiple) {
      return !GF.IsEqual(0,e)
    } else {
      if (e === 0) {
        return false
      }
    }
  }

  disableOpt(id){
    var hasAll = this.disableOptions.some(x=>x === 0)
    return hasAll ? true : this.disableOptions.some(x=>x === id)
  }

}
