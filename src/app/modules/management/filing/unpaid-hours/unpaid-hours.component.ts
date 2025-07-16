import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { leaveForm, uhTable, unpaidForm } from 'app/model/administration/filing';

@Component({
  selector: 'app-unpaid-hours',
  templateUrl: './unpaid-hours.component.html',
  styleUrls: ['./unpaid-hours.component.css']
})
export class UnpaidHoursComponent implements OnInit {
    @ViewChild('UHTable') UHTable: MatTable<any>;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = true;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color = 'color' ;
    leaveForm : FormGroup
    unpaidForm: FormGroup
    imageUrl : any
    shiftOption = [
        {id: 0, description: 'WRD'},
        {id: 1, description: 'Multiple Shift'},
        {id: 2, description: '8Am_5Pm_S'},
        {id: 3, description: '8Am_6Pm_SS'},
        {id: 4, description: '6Am_10Am_SS'},
        {id: 5, description: '3Pm_7Pm_SS'},
    ]
    official = [
        {id: 0, description: 'Client meeting'},
        {id: 1, description: 'Training'},
        {id: 2, description: 'Offsite meeting'},
        {id: 3, description: 'Team building'},
        {id: 4, description: 'Official travel'},
        {id: 5, description: 'Branch Office'},
        {id: 6, description: 'Others'},
    ]
    UHSource: uhTable[] = [];
    uhColumns: string[] = ['uhAction','uhDate','uhShift', 'uhDateFrom', 'uhDateTo', 'uhReason', 'uhUpload_file'];

  constructor(private fb: FormBuilder) { }
    get uh(){
        return this.unpaidForm.value
    }


    ngOnInit() {
        this.unpaidForm = this.fb.group(new unpaidForm());
        this.leaveForm = this.fb.group(new leaveForm());


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

    addUH(){
        this.UHSource.push({
            uhDate: this.unpaidForm.value.dateuh,
            uhShift: this.shiftOption.find(item=>item.id==this.unpaidForm.value.shiftuh).description,
            uhDateFrom: this.unpaidForm.value.dateFromuh,
            uhDateTo: this.unpaidForm.value.dateTouh,
            uhReason: this.official.find(item=>item.id==this.unpaidForm.value.reasonuh).description,
            uhUpload_file: this.unpaidForm.value.upload_fileuh,
        });
        this.UHTable.renderRows();
        this.unpaidForm.reset()
    }

    uhDelete(index): void {
        this.UHSource.splice(index, 1);
        this.UHTable.renderRows();
    }

}
