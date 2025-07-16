import { Component, DebugElement, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { HeirarchyDropdownRequest, HierarchyList, SearchHierarchy } from 'app/model/dropdown.model';
import { EmployeeHierarchy } from 'app/model/employee-hierarchy';
import { UserService } from 'app/services/userService/user.service';
import { Subject } from 'rxjs';
import _ from 'lodash';
import { DropdownSettings } from 'app/model/app.constant';
// import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { GF } from 'app/shared/global-functions';
import { MatSelect } from '@angular/material/select';

enum mode {
  next = 1,
  search = 2,
  tagChange = 3,
}

@Component({
  selector: 'app-employee-hierarchy',
  templateUrl: './employee-hierarchy.component.html',
  styleUrls: ['./employee-hierarchy.component.css']
})
export class EmployeeHierarchyComponent implements OnInit {
  dropdownRequest = new HeirarchyDropdownRequest
  @Input() resultHierarchy: SearchHierarchy;
  @Input() defaultTag : any = [];
  @Input() reset : boolean = false
  @Input() multiple: boolean = false
  @Input() all: boolean = false
  @Input() includeInactive: boolean = false
  @Input() showTag: boolean = true
  dropdowns = EmployeeHierarchy.map(x => ({...x}))
  selectedTag = []
  TagStored = []
  tagOptions = []
  @Output() selected = new EventEmitter<any>();
  @Output() exluded = new EventEmitter<any>();
  @Input() objectValue:    boolean = false // used for value want object and been relected on '@Output objects'
  @Output() objects = new EventEmitter<any>();
  @Input() notincludetag : any = []
  placeholder = ""
  dropdownSettings = DropdownSettings
  protected _onDestroy = new Subject<void>();
  @ViewChild('allSelected') private allSelected: MatOption;
  inputChange: UntypedFormControl = new UntypedFormControl();
  index = 0
  loading = false
  currentOption: any
  prev = {
    id: 0,
    text: ""
  }

  currentId = 0
  isMgmt = false
  exclude = []
  searchList = []

  private selectPanelClosedSubscription: any;

  @ViewChild('matSelect') matSelect: ElementRef;

  constructor(private userService: UserService,private renderer: Renderer2) {
    this.inputChange.valueChanges
    .pipe(debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this._onDestroy))
    .subscribe((result) => {
        debugger
      if (result != "") {
        this.loadDropdowns(mode.search)

      } else {

         var __options = this.dropdowns.find(x => x.dropdownTypeID == this.currentOption.dropdownTypeID)
          __options.options = __options.oldoptions
          __options.value = __options.selected
      }
    });
   }

  onSelectOpen(isOpen: boolean, select): void {
    if (isOpen) {
      this.currentOption = select
    } else {
      this.inputChange.setValue("");
    }
  }


  ngOnInit() {
    this.isMgmt = GF.IsEqual(sessionStorage.getItem('moduleId'),['40','41','99'])//additional module id
    this.initialize()
  }


  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes.defaultTag.currentValue.length,changes.defaultTag.previousValue.length)
    if (changes.defaultTag?.currentValue?.length !== changes.defaultTag?.previousValue?.length) {
        this.selectedTag = []
        this.isMgmt = GF.IsEqual(sessionStorage.getItem('moduleId'),['40','41','99'])//additional module id
        this.initialize()
    }

    if("reset" in changes){
        if(this.reset){
            this.dropdowns.map(item => {
                item.value = []

              })
        }
    }

    if (this.selectedTag.length < 2) {

    }else{
        this.index = 0
    }

  }

  initialize(){
    this.dropdowns.map(item => { item.visible = false , item.value = null})
    this.userService.getHierarchyEmployee().subscribe({

      next: (value: any) => {

        if (this.defaultTag.length > 0) {
            this.selectedTag = this.defaultTag.map(item=>item.type)
            this.handlerChange()
            this.selectedevent()
        }
        if (value.statusCode == 200) {
            this.tagOptions = value.payload.filter(item => !this.notincludetag.includes(item.dropdownTypeID))
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

  gridcols(e){
    return e
  }
  selecteds(id, val){
    this.selectTags(id,val)
    this.handlerChange()
  }

  selectTags(id, val) {
    debugger
    var istrue = !val.some(x => x === id)
    if (istrue) {
      this.TagStored.push(id);
    } else {
      var idx = this.TagStored.findIndex(x => x === id)
      this.TagStored.splice(idx, 1)
    }
  }

  handlerChange() {

    // console.log("handlerChange")
    this.dropdowns.map(item => {
      item.visible = false

    })
    this.selectedTag.forEach(key => {
      this.dropdowns.find(x => x.dropdownTypeID == key).visible = true
      this.dropdowns.find(x => x.dropdownTypeID == key).complete = false
      this.dropdowns.find(x => x.dropdownTypeID == key).value = []
      this.dropdowns.find(x => x.dropdownTypeID == key).selected = []
    });
    // console.log("tagChange")
        var isTrue = this.selectedTag.some(x=>!this.TagStored.includes(x))
        if (isTrue) {
          this.loadDropdowns(mode.tagChange)
        }

  }

  compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false; // Arrays have different lengths, they are not equal
    }

    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];

      // Compare the properties of each object
      for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
          return false; // Objects have different values for a property, they are not equal
        }
      }
    }

    return true; // All elements and properties are equal
  }

  completeChecker(option,curOp): void {
    if(this.dropdownSettings.length > option.length){
      curOp.complete = true
    }
    else{
      curOp.complete = false
    }
  }

  loadDropdowns(modes) {
    this.loading = true
    // console.log("loadDropdowns")
    this.dropdownRequest.search = this.inputChange.value?.toLowerCase()
    this.dropdownRequest.includeInactive = this.includeInactive
    this.dropdownRequest.start = (modes == mode.tagChange || modes == mode.search) ? 0 : this.index
    this.dropdownRequest.id = []

    let selection = []
    this.selectedTag.forEach(key => {
      selection.push(this.dropdowns.filter(x => x.dropdownTypeID == key)[0])
    });

    var selected: any
    if (modes != mode.tagChange) {
        //For Seach and Scroll
        selection.forEach(select => {
            if (select.index < this.currentOption.index) {
                this.dropdownRequest.id.push({
                    key: select.key,
                    dropdownID: Array.isArray(select.value) ? select.value : [select.value],
                    dropdownTypeID: this.currentOption.dropdownTypeID
                });
            }else if(selection.length === 1){
                this.dropdownRequest.id.push({
                    key: select.key,
                    dropdownID: [0],
                    dropdownTypeID: this.currentOption.dropdownTypeID
                });

            }
        });
    } else {
        //For TagChanges
        selected = selection.sort((a, b) => {
            return a.index - b.index;
        })[0];

        this.dropdownRequest.id.push({ dropdownID: GF.IsEmptyReturn(selected?.value, [0]), dropdownTypeID: selected?.dropdownTypeID, key: selected.key })
    }
    //#1 Filter internal if not employee dropdown
    if (search && modes != mode.tagChange && !GF.IsEqual(this.currentOption.dropdownTypeID,[-3,-4])) {
      var search = this.inputChange.value?.toLowerCase()
      var tempOp = this.dropdowns.find(x => x.dropdownTypeID == selected.dropdownTypeID).options
      this.dropdowns.find(x => x.dropdownTypeID == selected.dropdownTypeID).options = tempOp.filter(x=>x.description.toLowerCase().indexOf(search) > -1)
      return
    }
    //#1 End

    this.userService.getSearchHierarchy(this.dropdownRequest,this.isMgmt).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          this.loading = false

          var _options = this.dropdowns.find(x => x.dropdownTypeID == GF.IsEmptyReturn(selected?.dropdownTypeID,this.currentOption?.dropdownTypeID))
          //this note is for future me. alam ko pagod kna. nag titiis ka nlng kaya nag iwan ako notes. thank old me!

          //Compare current option if equal to new option then complete = true
          _options.complete = this.compareArrays(_options.options,value.payload)

          //check complete is true then true else check new value is null/undefined/[] then complete = true
          _options.complete = _options.complete ? true : GF.IsEmpty(value.payload)

          var currentOptions = GF.IsEmpty(this.currentOption?.options||[]) ? [] : this.currentOption?.options.filter(x=>x.dropdownTypeID ==  GF.IsEmptyReturn(selected?.dropdownTypeID,this.currentOption.dropdownTypeID))||[]

          //check if mode is search or next batch
          var tempOp1 = modes == mode.search
                      ? _.uniqBy(value.payload, JSON.stringify)
                      : _.uniqBy([...currentOptions,...value.payload], JSON.stringify)

          //unique here 1st
          var tempOp = []
          tempOp = GF.unique(tempOp1,tempOp,'dropdownID')

          _options.oldoptions = _.uniqBy([..._options.oldoptions,...tempOp], JSON.stringify)

          // Conditions on Search
          if (modes === mode.search) {
            tempOp.forEach(op => {
              this.searchList.push(op);
            });
            _options.options = tempOp

          // Conditions on Next Batch
          } else if (modes === mode.next) {
            var searchOption = _.uniqBy([...tempOp, ...this.searchList], JSON.stringify)
            var newOption = []
            //unique here 2st
            var uniqOption = GF.unique(searchOption,newOption,'dropdownID')
            _options.options = GF.sort(uniqOption,'description')
            this.completeChecker(value.payload,_options.options)
          } else {
            _options.options = tempOp
          }

          //Select All Even Next Batch
          if (!GF.IsEmpty(this.currentOption?.value) && this.currentOption?.value.includes(0) && !GF.IsEmpty(value.payload)) {
            this.currentOption.value = _.uniqBy([...this.currentOption?.value,...value.payload.map(x=>x.dropdownID)], JSON.stringify)
          }

          //Put search result on top
          if (!GF.IsEmpty(this.dropdownRequest.search)) {
            _options.options = _.uniqBy([..._options.options], JSON.stringify).filter(x => x.description.toLowerCase().indexOf(this.dropdownRequest.search) > -1)
          }

          //Load initial defaultTag
          if (this.multiple && this.defaultTag.length > 0 && modes == mode.tagChange) {
            this.defaultTag.forEach(tag => {
                var dd = this.dropdowns.find(x => x.dropdownTypeID == tag.type)
                dd.value = tag.id.some(x=>x===0) ? [...tag.id,...dd.options.map(x=>x.dropdownID)] : tag.id
                dd.selected = dd.value;
                var ev = {value:tag.id}
                this.handlerSelectiveChange(dd,ev)
            });
          }

        }
        else {
          console.log(value.stackTrace)
          console.log(value.message)
        }
      }});
  }

  selectItem(id, sel){
    debugger
    var val = sel.value
    var select = sel.selected
    if (this.multiple) {
      if (val.some(x => x === 0)) {
        if (!val.some(x => x === id)) {
          this.exclude.push(id);
        } else {
          var idx = this.exclude.findIndex(x=>x===id)
          this.exclude.splice(idx,1)
        }
        this.exluded.emit(this.exclude)
      } else {

        if (!select.some(x => x === id)) {
          select.push(id);
        } else {
          var indx = select.findIndex(x=>x===id)
          select.splice(indx,1)
        }
      }
    }
    this.setSelection()
  }



  handlerSelectiveChange(model, select) {

    if (model.value.some(x=>x===0) && model.value.length < 2) {
      return
    }
    // console.log("handlerSelectiveChange")

    let param = new HeirarchyDropdownRequest
    let id = 0
    let selection = []
    this.selectedTag.forEach(key => {
      selection.push(this.dropdowns.filter(x => x.dropdownTypeID == key)[0])
    });
    var nextList = selection.filter(x => x.dropdownTypeID != model.dropdownTypeID && x.index > model.index)
    var data = selection.filter(x => x.value != null)




    this.setSelection()
    this.removeOptions(nextList)
    if (nextList.length > 0) {
      id = nextList.filter(x => x.dropdownTypeID != model.dropdownTypeID).sort((a, b) => {
        return a.index - b.index;
      })[0].dropdownTypeID;

    param.id = []
    selection.forEach(select => {
        if (select.index <= model.index ) {
            param.id.push({
                key: select.key,
                dropdownID: Array.isArray(select.value) ? select.value : [select.value],
                dropdownTypeID: id
            });
        }
    });

    // }
    if (GF.IsEmpty(model.value)) {
        this.dropdowns.filter(x => x.dropdownTypeID == id)[0].options = model.value
        return
    }
      this.userService.getSearchHierarchy(param,this.isMgmt).subscribe({
        next: (value: any) => {
          if (value.statusCode == 200) {
            this.dropdowns.filter(x => x.dropdownTypeID == id)[0].options = _.uniqBy(value.payload, JSON.stringify)
            this.dropdowns.filter(x => x.dropdownTypeID == id)[0].oldoptions = _.uniqBy(value.payload, JSON.stringify)
            // this.defaultTag.forEach(tag => {
            //     var aa = this.dropdowns.find(x => x.dropdownTypeID == tag.type)
            //     aa.value = tag.id[0]
            // });
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

  removeOptions(options){
    options.forEach(key => {
      key.value = null
      key.options = []
    });
  }

  setSelection(){
    debugger
    this.resultHierarchy.Search = []
    // console.log(this.dropdowns)
    this.dropdowns.forEach(element => {
      if(element.visible){

        var istrue = !GF.IsEmpty(element.selected)
        if(istrue){
          let search = new HierarchyList
          search.Key = element.key
          search.Type = 2
          search.Value = element.selected
          this.resultHierarchy.Search.push(search)
        }
      }
    });

  }

  selectedevent(){
    this.selected.emit(this.selectedTag.length)
    this.objects.emit(this.dropdowns)
  }

  async getNextBatch(){
    if (!this.loading ) {
      this.index++
      // console.log("getNextBatch")
      this.loadDropdowns(mode.next)
    }
  }

  selectAll(se, event) {
    var isAll = false
    if (Array.isArray(se.value)) {
      isAll = se.value.some(x=>x===0)
    } else {
      isAll = se.value === 0
    }

    if (isAll) {
      if (this.multiple) {
        se.value = [...se.options.map(x=>x.dropdownID),...[0]]
      }else {
        se.value = 0
      }
    } else {
      if (this.multiple) {
        se.value = []
      } else {
        se.value = null
      }
    }

    se.selected = se.value

    this.handlerSelectiveChange(se,event)
  }

  selDisplayNgModel(values,options){
    if (values !== undefined && values !== null && values !== "" && (values?.length || 1) > 0) {
      if (this.prev.id != values) {
        var out:string
        if (this.multiple) {
          if (values.length === 0) {
            return ""
          }
          if (values.some(x=>x === 0)) {
            out = "All"
          } else {
            out = options.find(item=>item.dropdownID === values[0])?.description
          }
        } else {
          if (values === 0) {
            out = "All"
          } else {
            out = options.find(item=>item.dropdownID === values)?.description
          }
        }
        this.prev.id = values
        this.prev.text = out
        return out;
      } else {
        return this.prev.text;
      }
    }
  }
}
