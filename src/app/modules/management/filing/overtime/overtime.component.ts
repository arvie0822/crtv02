import { DatePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { otTable, Overtime, overtimeField, overtimefields } from 'app/model/administration/filing';


@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css']
})
export class OvertimeComponent implements OnInit {
    @ViewChild('OTTable') OTTable: MatTable<any>;
    pipe = new DatePipe('en-US');
    @Input() datasource: any


    overtime : FormGroup
    otform : FormGroup
    shiftOption = [
        {id: 0, description: 'WRD'},
        {id: 1, description: 'Multiple Shift'},
        {id: 2, description: '8Am_5Pm_S'},
        {id: 3, description: '8Am_6Pm_SS'},
        {id: 4, description: '6Am_10Am_SS'},
        {id: 5, description: '3Pm_7Pm_SS'},
    ]

    ot = [
        {id: 0, description: 'Paid'},
        {id: 1, description: 'Offset'},
    ]

    timing = [
        {id: 0, description: 'Pre-shift'},
        {id: 1, description: 'Post-shift'},
        {id: 2, description: 'RD/Holiday'},
    ]

    leaveForm: FormGroup
    imageUrl: any
    OTSource: otTable[] = [];
    otColumns: string[] = ['otaction','otdate','otshift', 'overtime_type', 'ottiming', 'ot_start', 'ot_end', 'otreason', 'uploadFileot','status'];
    filename = ""



    constructor(private fb: FormBuilder,private cd: ChangeDetectorRef) { }

  ngOnInit() {

      this.overtime = this.fb.group(new overtimeField());
      this.otform = this.fb.group(new otTable());
  }
  get ff(){
    return this.overtime.value
  }
  get tb(){
    return this.otform.value
  }


    uploadFile(event,id, fc, i) {
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        // console.log("#"+id)
        let element: HTMLElement = document.querySelector("#"+id) as HTMLElement;
        let fileName = event.target.files[0].name;
        this.filename = event.target.files[0].name;
        element.setAttribute('value', fileName)
        if (i >= 0) {
            this.OTSource[i][fc] = fileName
            this.OTTable.renderRows();


        }
        // this.otform.get(fc).setValue(fileName)
        // if (event.target.files && event.target.files[0]&&id=="displayMe4") {
        //   reader.readAsDataURL(file);

        //   // When file uploads set it to file formcontrol
        //   reader.onload = () => {
        //     this.imageUrl = reader.result;
        //     this.otform.patchValue({
        //       file: reader.result
        //     });

        //   }
        //   // ChangeDetectorRef since file is loading outside the zone
        // //   this.cd.markForCheck();
        //     this.cd.markForCheck();

        // }

      }


    addfield(){
        if (this.overtime.valid) {
            this.datasource.push({
                otshift : this.overtime.value.shift,
                otdate: this.overtime.value.date,
                overtime_type: this.overtime.value.overtimeType,
                ottiming: this.overtime.value.timing,
                ot_start: this.overtime.value.otstart,
                ot_end: this.overtime.value.otend,
                otreason: this.overtime.value.reason,
                uploadFileot: this.filename,
                status : "",
            });
            this.overtime.reset()
            this.OTTable.renderRows();
            this.filename == null
        }
    }

    handleDeleteBreak(index): void {
        this.datasource.splice(index, 1);
        this.OTTable.renderRows();
    }


    // var dt = new Date(this.overtime.value.date);
    // dt.setDate(dt.getDate());
    // let dt1 = this.pipe.transform(dt, 'yyyy-MM-dd');
    // this.otform.get('otdate').setValue(dt1)

    // this.otform.get('otshift').setValue(this.overtime.value.shift)
    // this.otform.get('overtime_type').setValue(this.overtime.value.overtimeType)
    // this.otform.get('ottiming').setValue(this.overtime.value.timing)
    // this.otform.get('ot_start').setValue(this.overtime.value.otstart)
    // this.otform.get('ot_end').setValue(this.overtime.value.otend)
    // this.otform.get('otreason').setValue(this.overtime.value.reason)
    // this.otform.get('uploadFileot').setValue(this.overtime.value.upload)

}
