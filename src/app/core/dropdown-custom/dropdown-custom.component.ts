import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { DropdownSettings, SystemSettings } from 'app/model/app.constant';
import { DropdownRequest, dropdownCustomType } from 'app/model/dropdown-custom.model';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { GF } from 'app/shared/global-functions';
import _ from 'lodash';
import { ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dropdown-custom',
  templateUrl: './dropdown-custom.component.html',
  styleUrls: ['./dropdown-custom.component.scss']
})
export class DropdownCustomComponent implements OnInit {
  @Input() control:         AbstractControl = new FormControl();
  @Input() useControl:      boolean = false
  @Input() reset:           boolean = false
  @Input() options:         any[] = [];
  @Input() icon:            string
  @Input() type:            number = 0
  @Input() multiple:        boolean = false
  @Input() all:             boolean = false
  @Input() allDisplay:      boolean = true
  @Input() except:          boolean = false
  @Input() includeInactive: boolean = false
  @Input() id:              string
  @Input() value:           any
  @Input() label:           string
  @Input() disabled:        string
  @Input() disableOptions:  number[] = []

  @Input() dropdownValue:  string // used for value and label default value = dropdownID , label = description
  @Input() dropdownLabel:  string // used for value and label default value = dropdownID , label = description
  @Input() objectValue:    boolean = false // used for value want object and been relected on '@Output objects'

  @Output() selected = new EventEmitter<any>();
  @Output() exluded = new EventEmitter<any>();
  @Output() objects = new EventEmitter<any>();
  exclude = []
  enable = false
  dropdownRequest = new DropdownRequest
  inputChange: UntypedFormControl = new UntypedFormControl();
  data: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  protected _onDestroy = new Subject<void>();
  dropdownCustomType: any = dropdownCustomType
  dropdownSettings = DropdownSettings
  dropdownDetail = {
    type: 0,
    label: "",
    uri: "",
    dropdownType: 0
  }
  placeholder: string = ""
  index: number = 1
  complete: boolean = false
  prev = {
    id: 0,
    text: ""
  }
  @Input() showDescription: boolean = false
  @ViewChild('allSelected') private allSelected: MatOption;

  constructor(private coreService: CoreService) { }

  ngOnInit() {
    this.dropdownRequest.includeInactive = true
    if(this.dropdownCustomType.filter(x => x.type === this.type)[0] !== undefined){
      this.dropdownDetail = this.dropdownCustomType.filter(x => x.type === this.type)[0]
    }

    this.placeholder = GF.IsEmptyReturn(this.label,this.dropdownDetail.label)

    this.dropdownValue =  this.objectValue ? undefined : GF.IsEmptyReturn(this.dropdownValue,'dropdownID')
    this.dropdownLabel =  GF.IsEmptyReturn(this.dropdownLabel,'description')

    this.inputChange.valueChanges
    .pipe(debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterDropdown();
    });
    if (!this.useControl && this.options.length == 0) {
      this.initData(this.dropdownDetail, false)
    }

  }



  ngOnDestroy(): void {
    this._onDestroy.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges){
    // if(this.dropdownCustomType.filter(x => x.type === this.type)[0] !== undefined){
    //   this.dropdownDetail = this.dropdownCustomType.filter(x => x.type === this.type)[0]
    // }
    // this.initData(this.dropdownDetail, false)
    if(this.options != undefined || this.options !=  null){
      this.data.next(this.options.slice());
      this.completeChecker(this.options)
    }
    if("reset" in changes){
        if(this.value && changes.reset.currentValue){
            this.value = []
        }
    }

    if ("disableOptions" in changes) {
      console.log(changes.disableOptions.currentValue,this.options)
      // if (GF.IsEmpty(changes.disableOptions.currentValue)) {
      //   this.data.next(this.options.filter(x=>x != 0));
      // }
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

//   selectedEvent(e){
//     if (e.value !== undefined) {
//       this.selected.emit(e.value)
//     }
//   }

  initData(e,filter){
    if (filter) {
      if (Array.isArray(this.value) && this.value?.length > 0) {
        this.value.forEach(id => {
          this.dropdownRequest.id.push({dropdownID: this.objectValue ? GF.IsEmptyReturn(id?.dropdownID,0) : GF.IsEmptyReturn(id,0), dropdownTypeID: e.dropdownType})
        });
      }else {
        this.dropdownRequest.id.push({dropdownID: this.objectValue ? GF.IsEmptyReturn(this.value?.dropdownID,0) : GF.IsEmptyReturn(this.value,0), dropdownTypeID: e.dropdownType})
      }
    }
    this.dropdownRequest.includeInactive = this.includeInactive

    this.coreService.getCoreDropdown(e.type,this.dropdownRequest).subscribe({
    // this.coreService.postData(e.uri,this.dropdownRequest).subscribe({
      next: (value:any) => {
          this.completeChecker(value.payload)
          // var payload = value.payload.filter(x=>x.dropdownTypeID === (e.dropdownType === 0 ? x.dropdownTypeID : e.dropdownType))
          this.options = _.uniqBy([...this.options, ...value.payload], JSON.stringify)
          this.onAll()
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        // this.data.next(this.options);
        this.data.next(filter ? this.options.filter(item=>item[this.dropdownLabel].toLowerCase().indexOf(this.dropdownRequest.search) > -1) : this.options);
      },
    });
  }

  onAll(){
    if (!this.useControl && this.multiple && this.all && !GF.IsEmpty(this.value)) {
      if (this.value.some(x=>x === 0)) {
        this.value = _.uniqBy([...this.options.map(op=>op.dropdownID), ...this.value], JSON.stringify)
      }
    }
  }

  async getNextBatch(){
    this.dropdownRequest.search = this.inputChange.value?.toLowerCase() || null
    this.dropdownRequest.start = this.index++
    this.dropdownRequest.id = []
    this.dropdownRequest.id.push({dropdownID: 0, dropdownTypeID: this.type})
    // console.log(this.dropdownRequest)
    this.initData(this.dropdownDetail, false)
  }

  async filterDropdown(){
    const search = this.inputChange.value?.toLowerCase()
    if (!search) {
      this.data.next(this.options)
    } else {
        this.dropdownRequest.search = search
        this.dropdownRequest.id = []
        this.dropdownRequest.id.push({dropdownID: 0, dropdownTypeID: this.type})
        this.initData(this.dropdownDetail, true)
    }
  }

  selectAll() {
    var result: any
    if (this.useControl) {
      if (this.multiple) {
        if (this.allSelected.selected) {
          this.control.patchValue([...this.options.map(item => this.objectValue ? item : item[this.dropdownValue]), 0])
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
          this.value = [...this.options.map(item => this.objectValue ? item : item[this.dropdownValue]), 0]
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

  selectedDisplay(control: AbstractControl){
    var hasAll = (control.value?.length || 0) > 1 ? control.value.some(item=>item === 0) : false
    var values = hasAll ? [] : this.options.filter(item=>item[this.dropdownValue] === (control.value?.[0] || control.value) )[0]
    return hasAll ? 'All' : (values === undefined ? 'All' : values[this.dropdownLabel])
  }

 selDisplayNgModel(values){
   try {
     if (!GF.IsEmpty(values) && !GF.IsEmpty(this.options)) {
       if (Array.isArray(values)) {
         if (values.some(x => x === 0)) {
           return "All";
         } else if (typeof values[0] === 'object') {
           return values[0][this.dropdownLabel]
         }
       } else if (typeof values === 'object') {
         return values[this.dropdownLabel]
       }


       var out: string
       if (this.multiple) {
         if (values.length === 0) {
           return ""
         }
         if (values.some(x => x === 0)) {
           out = "All"
         } else {
           out = this.options.find(item => item[this.dropdownValue] === values[0])[this.dropdownLabel]
         }
       } else {
         if (values === 0 && this.all) {
           out = "All"
         } else {
           if (values === 0) {
             return ""
           }
           out = this.options.find(item => item[this.dropdownValue] === values)[this.dropdownLabel]
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
      list: this.options,
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

  disableOpt(id){
    var hasAll = this.disableOptions.some(x => x === 0)
    this.all = GF.IsEmpty(this.disableOptions) ? this.all : !hasAll
    return hasAll ? true : this.disableOptions.some(x => x === id)
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
}
