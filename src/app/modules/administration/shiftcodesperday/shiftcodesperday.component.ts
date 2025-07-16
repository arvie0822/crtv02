import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ShiftCodesPerDay } from 'app/model/administration/shiftcodesperday';
import { TableRequest } from 'app/model/datatable.model';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { MasterService } from 'app/services/masterService/master.service';
import { ShiftService } from 'app/services/shiftService/shift.service';

@Component({
  selector: 'app-shiftcodesperday',
  templateUrl: './shiftcodesperday.component.html',
  styleUrls: ['./shiftcodesperday.component.css']
})
export class ShiftcodesperdayComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['shiftName', 'type', 'timeIn', 'timeOut'];
  dataSource = []
  isLoadingResults: boolean = true;
  @ViewChild('table') table: MatTable<any>;
  ShiftPerDayForm: FormGroup
  isload: boolean = true
  hideShift: boolean = true
  pipe = new DatePipe('en-US');
  totalRows: number = 0
  request: any = []
  dropdownRequest = new DropdownRequest
  dropdownOptions = new DropdownOptions
  constructor(private fb: FormBuilder,
    private message: FuseConfirmationService,
    private shiftService: ShiftService,
    private masterService: MasterService) {
        this.request = new TableRequest()
    }

  ngOnInit() {
    this.isLoadingResults = true;
    this.ShiftPerDayForm = this.fb.group(new ShiftCodesPerDay());
    this.ShiftPerDayForm.disable();
    this.request.Order = "shiftName"
    this.request.OrderBy = "Desc"
    this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 104 })
    this.dropdownRequest.search = ""
    this.dropdownRequest.start = 0
    this.masterService.getDropdownFix(this.dropdownRequest).subscribe({
        next: (value: any) => {
            var options = []
            options.push({ "dropdownID": 0, "description": "Regular" })
            value.payload.map(item =>  options.push(({
                dropdownID: item.dropdownID,
                description: item.description})))
            this.dropdownOptions.shiftTypeDef = options
            this.handleLoadShift()
            this.handleHoursEvent()
        },
        error: (e) => {
          console.error(e)
        }
      });
  }

  handleLoadShift(): void{
    this.isLoadingResults = true;
    this.shiftService.getShiftPerDayTable(this.request).subscribe({
        next: (value: any) => {
          if (value.statusCode == 200) {
            this.dataSource = value.payload.data
            this.totalRows = value.payload.totalRows
            console.log(value)
            this.isLoadingResults = false;
          }
          else {
            console.log(value.stackTrace)
            console.log(value.message)
          }
        },
        error: (e) => {
          console.error(e)
        },
        complete: () => {
            this.ShiftPerDayForm.enable();
          }
      });
  }

  handlePageEvent(e): void {
    this.request.Start = e.pageIndex
    this.request.Length = e.pageSize
    this.handleLoadShift()
  }

  handleSortEvent(e): void {
    this.paginator.pageIndex = 0
    this.request.Start = 0
    this.request.Order = e.active
    this.request.OrderBy = e.direction
    this.handleLoadShift()
  }

  handleHoursEvent(): void {
    let eventStartTime = new Date("1900-01-01 " + this.pipe.transform(this.ShiftPerDayForm.value.matTimeIn, 'HH:mm:ss'));
    let eventEndTime = new Date("1900-01-01 " + this.pipe.transform(this.ShiftPerDayForm.value.matTimeOut, 'HH:mm:ss'));
    if (eventStartTime > eventEndTime) {
      eventEndTime.setDate(eventEndTime.getDate() + 1)
      this.ShiftPerDayForm.controls.timeOutDaysCover.patchValue(1);
    }
    else{
        this.ShiftPerDayForm.controls.timeOutDaysCover.patchValue(0);
    }
    let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
    this.ShiftPerDayForm.controls.totalWorkingHours.patchValue(duration / 1000 / 60 / 60);
  }

  submit(){
    if (this.ShiftPerDayForm.valid) {
      const dialogRef = this.message.open(SaveMessage);

      dialogRef.afterClosed().subscribe((result) => {
        if (result == "confirmed") {
          this.handleDataValue()
          console.log(JSON.stringify(this.ShiftPerDayForm.value))
          this.shiftService.postShiftPerDay(this.ShiftPerDayForm.value).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.message.open(SuccessMessage);
                this.handleLoadShift();
              }
              else {
                FailedMessage.message = value.message
                this.message.open(FailedMessage);
                console.log(value.stackTrace)
                console.log(value.message)
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

  handleTypeEvent(e) : void{
    this.ShiftPerDayForm.controls.shiftName.patchValue("");
    if(e == 30040 || e == 30041){
        this.hideShift = false
    }
    else{
        this.hideShift = true
    }
  }

  handleDataValue(): void{
    if(this.ShiftPerDayForm.value.type == 1018 || this.ShiftPerDayForm.value.type == 1017){
        const TimeIn = this.pipe.transform(new Date(), 'HH:mm:ss')
        const TimeOut = this.pipe.transform(new Date(), 'HH:mm:ss')
        this.ShiftPerDayForm.controls.timeIn.patchValue(TimeIn);
        this.ShiftPerDayForm.controls.timeOut.patchValue(TimeOut);
        this.ShiftPerDayForm.controls.totalWorkingHours.patchValue(0);
        this.ShiftPerDayForm.controls.isFlexi.patchValue(false);
    }
    else{
        const name = (this.ShiftPerDayForm.value.isFlexi == true ? "F" : "") + (this.ShiftPerDayForm.value.type == 1016 ? "WRD" : "") + this.pipe.transform(this.ShiftPerDayForm.value.matTimeIn, 'hh') + ":" + this.pipe.transform(this.ShiftPerDayForm.value.matTimeIn, 'mm') + this.pipe.transform(this.ShiftPerDayForm.value.matTimeIn, 'a').substring(0, 1)
        + "_" +
        this.pipe.transform(this.ShiftPerDayForm.value.matTimeOut, 'hh') + ":" + this.pipe.transform(this.ShiftPerDayForm.value.matTimeOut, 'mm') + this.pipe.transform(this.ShiftPerDayForm.value.matTimeOut, 'a').substring(0, 1)
        this.ShiftPerDayForm.controls.shiftName.patchValue(name);
        const TimeIn = this.pipe.transform(this.ShiftPerDayForm.value.matTimeIn, 'HH:mm:ss')
        const TimeOut = this.pipe.transform(this.ShiftPerDayForm.value.matTimeOut, 'HH:mm:ss')
        this.ShiftPerDayForm.controls.timeIn.patchValue(TimeIn);
        this.ShiftPerDayForm.controls.timeOut.patchValue(TimeOut);
    }
  }

}
