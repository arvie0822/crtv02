import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { DatatableCrudComponent } from '../datatable-crud.component';
import { Subject, forkJoin } from 'rxjs';
import { MasterService } from 'app/services/masterService/master.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css']
})
export class CrudTableComponent implements OnInit {
  dynamicForm: FormGroup
  @Output() pushEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() rows = new EventEmitter<any>();
  @Input() crudtable: any = []
  @Input() isAdd: boolean = false
  isLoadingResults: boolean = true;
  @ViewChild('MatTable') table: MatTable<any>;
  @ViewChild('dynamicTable') dynamicTable: MatTable<any>;
  @ViewChild(DatatableCrudComponent) parent: DatatableCrudComponent;
  dataSource: any = []
  columndefs: any = []
  rowCount: number = 4
  form = []
  panel : string = ''
  pipe = new DatePipe('en-US');

  newTime = {
    hour: null,
    min: null,
    timeclock: null
  }
  dropdownFix = new DropdownRequest
  dropdownRequest = new DropdownRequest
  dropdownOptions = new DropdownOptions
  optionStored = []
  years = []

  constructor(
    private message: FuseConfirmationService,
    private coreService: CoreService,
    private tenantService: TenantService,
    private masterService: MasterService,
    ) { }


  ngOnInit() {
    this.dropdownRequest.id.push(
      { dropdownID: 0, dropdownTypeID: 0 },
    )
  }

  ngOnChanges() {
    this.form = this.crudtable.form
    this.panel = this.crudtable.type
    this.setParams()
    this.initData()
  }

  initData(){
    forkJoin({
      dropdownFix: this.masterService.getDropdownFix(this.dropdownFix),
      dropdownDynamic: this.tenantService.getDropdown(this.dropdownRequest)
    }).subscribe({
      next: (value: any) => {
          this.optionStored = [...value.dropdownFix.payload,...value.dropdownDynamic.payload]
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
          var obj = {}
          this.form.map((element,i) => {
            if (element.visible && !this.columndefs.some(i=>i == element.key)) {
              this.columndefs.push(element.key)
            }
            obj[element.key] = element._value
            element.options = this.loadDropdown(element.options,element.type, element.dropdownType)
          });
          this.isAdd ? this.dataSource.push(obj) : null
          this.columndefs.some(i=>i == 'action') ? null : this.columndefs.push('action')
      }
    });
  }

  setParams(){
    this.form.filter(item=>item.type == "select").map((element,i) => {
      if (element.dropdownType.type == "fix") {
        this.dropdownFix.id.push({ dropdownID: element.dropdownType.uri === 3 ? 3 : 0, dropdownTypeID: element.dropdownType.uri }, )
      }else {
        this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: element.dropdownType.uri }, )
      }
    });
  }

  loadDropdown(val, type, dd){
    var out: any
    if (type == "select") {
      if (dd.type == "fix") {
        out = this.optionStored.filter(item=>item.dropdownTypeID==dd.uri)
      }else {
        out = val
      }
    }else {
      out = val
    }
    return out
  }

  // settings(data) {
  //   this.dynamicForm = new FormGroup({});
  //   data.forEach((element) => {
  //     this.dynamicForm.addControl(element.key, new FormControl(element._value));
  //     const CONTROL = this.dynamicForm.controls[element.key];

  //     if (element.required != false) {
  //       let controlValidators = [];
  //       controlValidators.push(Validators.required);
  //       CONTROL.setValidators(controlValidators);
  //     }
  //     if(!element.editable){
  //       CONTROL.disable()
  //     }
  //   });
  // }

  handleTimeEvent(e,key,i) {
    debugger
    if (this.crudtable.type == "shift") {
      const date = new Date();
      const formatTime = (time: string | null): string => {
          if (time === null) return "";
          const [hours, minutes, seconds] = time.split(":").map(Number);
          date.setHours(hours, minutes, seconds || 0);
          return new Date().toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString('en-US', { hour12: true });
      };

      const TimeIn = formatTime(this.dataSource[i].timeIn);
      const TimeOut = formatTime(this.dataSource[i].timeOut);

      if (TimeIn && TimeOut) {
          const name = this.pipe.transform(TimeIn, 'hh') + this.pipe.transform(TimeIn, 'mm') + this.pipe.transform(TimeIn, 'a').substring(0, 1)
              + "_" +
              this.pipe.transform(TimeOut, 'hh') + this.pipe.transform(TimeOut, 'mm') + this.pipe.transform(TimeOut, 'a').substring(0, 1);
          this.dataSource[i].shiftName = name;
      }
  }

  }

  setValue(t,ee){
    var out: any = ee
    switch (t.type) {
      case 'time':
            out = ee
        //   out = this.pipe.transform(ee,'HH:mm')
        break;
      case 'date':
          out = this.pipe.transform(ee,t.dateFormat || 'yyyy-MM-dd')
        break;
      case 'bool':
        out = ee !== null && ee !== "" ? (ee == 'true') : false
      break;
    }
    return out
  }

  getRowKey(t,e){
    return this.years.find(b=>b.holidayId==t.holidayId && b.year==e)?.rowKey || undefined
  }

  rewrite_datasource(dt){
    var dts = {data: [],req: []}
    for (let ii = 0; ii < dt.length; ii++) {
      var obj = {}
      this.form.forEach((el,i) => {
          if (el.params?.length || 0 > 0) {
            var o = {}
            var l = this.setValue(el, dt[ii][el.key])
            if (el.multiselect) {
              l = []
              var val = this.setValue(el, dt[ii][el.key])
              val.filter(aa=>aa!==0).forEach(e => {
                el.params.forEach(p => {
                  o[p.col] = el.key == p.key ? e : p.key == "rowKey" ? this.getRowKey(dt[ii],e) : dt[ii][p.key]
                });
                l.push(o)
                o = {}
              });
            }
            obj[el.key] = l
          } else {
            obj[el.key] = this.setValue(el, dt[ii][el.key])
          }
          if (el.required && (obj[el.key] === undefined || obj[el.key] === null || obj[el.key] === "")) {
            dts.req.push(el.label)
          }
      });
      dts.data.push(obj)
    }
    return dts
  }

  submit() {
    debugger
    var dateFields = this.form.filter(x => x.type === "datepicker")
    if(dateFields.length > 0){
        var obj = { encryptId: "" }
        dateFields.map((element, i) => {
            obj[element.key] = this.validate(element, element._value)
        });
        this.dataSource.forEach((item) => {
            Object.keys(item).forEach((key) => {
                if (obj[key]) {
                    item[key] = obj[key];
                }
            });
        });
    }
    debugger
    if(this.crudtable.type == "shift"){
      const date = new Date();
      const formatTime = (time: string | null): string => {
          if (time === null) return "";
          const [hours, minutes, seconds] = time.split(":").map(Number);
          date.setHours(hours, minutes, seconds || 0);
          return date.toLocaleTimeString('en-US', { hour12: false });
      };

      for (let i = 0; i < this.dataSource.length; i++) {
          const TimeIn = formatTime(this.dataSource[i].timeIn);
          const TimeOut = formatTime(this.dataSource[i].timeOut);


          this.dataSource[i].timeIn = TimeIn;
          this.dataSource[i].timeOut = TimeOut;
      }
    }
    var dts = this.rewrite_datasource(this.dataSource)
    if (dts.req.length > 0) {
      FailedMessage.title = "Failed! - Required Fields"
      FailedMessage.message = "Please fill all required fields [ "+dts.req.join(', ') +" ]"
      this.message.open(FailedMessage);
      return
    }
    if(this.panel === "bonus-setup"){
        dts.data.forEach(item => {
            item.basicSalary = item.basis.some(x=>x === 30628)
            item.projBasicSalary = item.basis.some(x => x === 30629)
            item.currentMBS = item.basis.some(x => x === 30630)
            item.regularDays = item.basis.some(x => x === 30631)
            item.holiday = item.basis.some(x => x === 30632)
            item.overtime = item.basis.some(x => x === 30633)
        });
    }
    const dialogRef = this.message.open(SaveMessage);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
          this.coreService.postData(this.crudtable.api.post, dts.data).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.message.open(SuccessMessage);
                this.pushEvent.emit(true)
              }
              else {
                FailedMessage.message = value.message
                this.message.open(FailedMessage);
                console.log(value.stackTrace)
                console.log(value.message)
                this.pushEvent.emit(false)
              }
            },
            error: (e) => {
              this.message.open(FailedMessage);
              console.error(e)
              this.pushEvent.emit(false)
            }
          });
      }
    });
    //}
  }

  handleCustomEvent() {
    if (this.crudtable.type == "shift") {

      let eventStartTime = new Date("1900-01-01 " + this.pipe.transform(this.dynamicForm.value.matTimeIn, 'HH:mm:ss'));
      let eventEndTime = new Date("1900-01-01 " + this.pipe.transform(this.dynamicForm.value.matTimeOut, 'HH:mm:ss'));
      if (eventStartTime > eventEndTime) {
        eventEndTime.setDate(eventEndTime.getDate() + 1)
        this.dynamicForm.controls.timeOutDaysCover.patchValue(1);
      }
      else {
        this.dynamicForm.controls.timeOutDaysCover.patchValue(0);
      }
      let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
      this.dynamicForm.controls.totalWorkingHours.patchValue(duration / 1000 / 60 / 60);

      const TimeIn = this.pipe.transform(this.dynamicForm.value.matTimeIn, 'HH:mm:ss')
      const TimeOut = this.pipe.transform(this.dynamicForm.value.matTimeOut, 'HH:mm:ss')
      this.dynamicForm.controls.timeIn.patchValue(TimeIn);
      this.dynamicForm.controls.timeOut.patchValue(TimeOut);
    }
  }

  setTime(time){
    // this.newTime.timeclock = time.replace(/[^a-z]/gi, '');
    // let dateTime = time.split(' ').length > 0 ? time.split(' ')[1] : time;
    // let timeArry = dateTime.split(/[ :]+/);
    // this.newTime.hour = timeArry[0];
    // this.newTime.min = timeArry[1];
    let patchTime = new Date(time)
    // patchTime.setHours(this.newTime.hour, this.newTime.min);
    return patchTime
  }

  setDate(e,t){
    return this.pipe.transform(new Date(e), t.dateFormat || "yyyy-MM-dd")
  }

  setYear(e,t){
    var yrs = e.filter(n=>n.year!==0).map(x=>x.year)
    this.years = [...this.years,...e]
    return yrs
  }

  validate(t,e){
    var out: any = e
    if (e !== null && e !== "") {
      out = t.type == 'time' ? this.setTime(e) :
            t.type == 'datepicker'                             ? this.setDate(new Date(),t) :
            t.type == 'date'         && t.key == "dateCreated" ? this.setDate(new Date(),t) :
            t.type == 'date'         && t.key != "dateCreated" ? this.setDate(e , t)  :
            t.type == 'select'       && t.key == "holidayYear" ? this.setYear(e , t) : e
    }
    return out
  }

  add_datasource() {
    var obj = {}
    this.form.map((element,i) => {
      obj[element.key] = element._value
    });
    this.dataSource.push(obj)
    this.dynamicTable.renderRows()
    this.rows.emit(this.dataSource.length)
  }
  delete_datasource(i,id) {
    this.dataSource.splice(i,1)
    this.dynamicTable.renderRows()
    this.rows.emit(this.dataSource.length)
    this.deleteEvent.emit(id)
  }

  edit_datasource(e,get){
    var hasRecord = this.dataSource.some(item=>item.encryptId == e.encryptId)
    if (!hasRecord) {
      this.coreService.getData(get, e.encryptId).subscribe({
        next: (value: any) => {
            var dts = this.rewrite_datasource(this.dataSource)
            var obj = {encryptId: ""}
            this.form.map((element,i) => {
              obj[element.key] = this.validate(element,value.payload[element.key])
              obj.encryptId = e.encryptId
            });
            if(this.panel === "bonus-setup"){
                var list = []
                for (var key in value.payload) {
                    if (value.payload.hasOwnProperty(key)) {
                        if (key === 'basicSalary' && value.payload[key] === true) {
                            list.push(30628);
                        }
                        if (key === 'projBasicSalary' && value.payload[key] === true) {
                            list.push(30629);
                        }
                        if (key === 'currentMBS' && value.payload[key] === true) {
                            list.push(30630);
                        }
                        if (key === 'regularDays' && value.payload[key] === true) {
                            list.push(30631);
                        }
                        if (key === 'holiday' && value.payload[key] === true) {
                            list.push(30632);
                        }
                        if (key === 'overtime' && value.payload[key]=== true) {
                            list.push(30633);
                        }
                    }
                }
                obj['basis'] = list
            }

            this.dataSource.push(obj)
            console.log(this.dataSource)
            if (this.crudtable.type === "shift") {
                for (let i = 0; i < this.dataSource.length; i++) {
                    const formattedTime = (time: string | null): string => {
                        if (time === null) return "";
                        const date = new Date(time);
                        const adjustedHours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        return `${adjustedHours}:${minutes}`;
                    };

                    if (typeof this.dataSource[i].timeIn !== 'string' || typeof this.dataSource[i].timeOut !== 'string') {
                        const timeIn = formattedTime(this.dataSource[i].timeIn);
                        const timeOut = formattedTime(this.dataSource[i].timeOut);

                        this.dataSource[i].timeIn = timeIn;
                        this.dataSource[i].timeOut = timeOut;
                    }
                }
            }
            this.dynamicTable.renderRows()
        },
        error: (e) => {
          console.error(e)
        }
      });
    }
  }

  isNumber(col,e){
    if (e !== null) {
        if (isNaN(e) && !Array.isArray(e)) {
          // console.log("col[e]",e,col[e])
          return col[e]
        } else if (Array.isArray(e)) {
          // console.log("Array",e)
          return e
        } else {
          // console.log("Number(e)",e,Number(e))
          return Number(e)
        }
    }
  }

  limitNumber(e,key,i, m){
    this.dataSource[i][key] = e > m ? m : e
  }

}
