import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { leaveForm, officialBForm, offsetForm, OffsetMonitoring, offTable } from 'app/model/administration/filing';

@Component({
  selector: 'app-offset',
  templateUrl: './offset.component.html',
  styleUrls: ['./offset.component.css']
})
export class OffsetComponent implements OnInit {
    @ViewChild('OFFTable') OFFTable: MatTable<any>;
    offsetForm: FormGroup
    leaveForm : FormGroup
    officialBForm : FormGroup
    imageUrl : any
    OSource: OffsetMonitoring[] = [{
        // include_expired: '',
        overtime_code: 'OT-001',
        overtime: '120',
        offset_used: '30',
        offset_field: '60',
        available: '30',
        expiration: '12/31/2022',
    }];
    oColumns: string[] = ['overtime_code', 'overtime', 'offset_used', 'offset_field', 'available', 'expiration'];
    OFFSource: offTable[] = [];
    offColumns: string[] = ['action','date','off_min', 'off_hrs', 'reason', 'uploadFile'];


  constructor(private fb: FormBuilder) { }
  get off(){
    return this.offsetForm.value
  }


  ngOnInit() {
    this.offsetForm = this.fb.group(new offsetForm());
    this.leaveForm = this.fb.group(new leaveForm());
    this.officialBForm = this.fb.group(new officialBForm());

  }

  convertMins(){
    var off = this.offsetForm.get('off_mino').value
    var hours = Math.floor(off / 60);
    var total = hours.toString();
   //  .padStart(2, '0')
    this.offsetForm.get('off_hrso').setValue(total)
   }
    uploadFile(event,id) {
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        console.log(id)
        let element: HTMLElement = document.querySelector("#"+id) as HTMLElement;
        let fileName = event.target.files[0].name;
        element.setAttribute('value', fileName)
        if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);

            // When file uploads set it to file formcontrol
            reader.onload = () => {
                this.imageUrl = reader.result;
                this.leaveForm.patchValue({
                file: reader.result
                });

            }
            // ChangeDetectorRef since file is loading outside the zone
            //   this.cd.markForCheck();
        }

    }

    addOFF(){
        if(this.offsetForm.valid){
            this.OFFSource.push({
                date: this.offsetForm.value.dateo,
                off_min: this.offsetForm.value.off_mino,
                off_hrs: this.offsetForm.value.off_hrso,
                reason: this.offsetForm.value.reasono,
                uploadFile: this.offsetForm.value.uploadFileo,
            });
            this.OFFTable.renderRows();
            this.offsetForm.reset()
        }

    }
    offDelete(index): void {
        this.OFFSource.splice(index, 1);
        this.OFFTable.renderRows();
    }


}
