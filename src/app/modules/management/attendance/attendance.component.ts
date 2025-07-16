import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { TableRequest } from 'app/model/datatable.model';
import { SearchHierarchy } from 'app/model/dropdown.model';
import { EmployeeAttendance } from 'app/model/management/attendance';
import { AttendanceService } from 'app/services/attendanceService/attendance.service';
import { AttendanceModalComponent } from './attendance-modal/attendance-modal.component';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  resultHierarchy = new SearchHierarchy;
  pipe = new DatePipe('en-US');
  IsMissingLogs: boolean
  request = new TableRequest()
  attendanceForm: FormGroup
  displayedColumns: string[] = ['action', 'code', 'name', 'date', 'schedin', 'schedout', 'timein', 'timeout', 'hrswork', 'remarks'];
  dataSource = [];
  dialogRef: MatDialogRef<AttendanceModalComponent, any>;
  field_count = 0
  isLoadingResults: boolean = true;
  totalRows: number = 0
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit() {
    this.attendanceForm = this.fb.group(new EmployeeAttendance());
  }

  modal(model) {
    var date = model.date
    var ids = model.encryptId
    this.attendanceService.getAttendanceLogs(date,ids).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.dialogRef = this.dialog.open(AttendanceModalComponent, {
            width: '70%',
            panelClass: 'app-dialog',
            data: value.payload
          });
        }
        else {
          console.log(value.stackTrace)
          console.log(value.message)
          this.isLoadingResults = false;
        }
      },
      error: (e) => {
        console.error(e)
        this.isLoadingResults = false;
      }
    });
  }

  Search() {
    this.request.SearchColumn = []
    this.attendanceForm.markAllAsTouched();
    if (this.attendanceForm.valid) {
      this.request.SearchColumn.push({
        "key": "DateFrom",
        "value": this.pipe.transform(this.attendanceForm.value.dateFrom, 'yyyy-MM-ddT00:00:00'),
        "type": 4
      })

      this.request.SearchColumn.push({
        "key": "DateTo",
        "value": this.pipe.transform(this.attendanceForm.value.dateTo, 'yyyy-MM-ddT23:59:00'),
        "type": 5
      })

      this.request.SearchColumn.push({
        "key": "MissingLogs",
        "value": this.attendanceForm.value.missingLogs + "",
        "type": 3
      })

      if (this.resultHierarchy.Search.length > 0) {
        this.resultHierarchy.Search.forEach(element => {
            element.Value.forEach(val => {
                this.request.SearchColumn.push({
                  "key": element.Key,
                  "value": val + "",
                  "type": element.Type
                })
              });
        });
      }
      this.loadData()
    }
  }

  handlePageEvent(e): void {
    this.request.Start = e.pageIndex
    this.request.Length = e.pageSize
    this.loadData()
  }

  handleSortEvent(e): void {
    this.paginator.pageIndex = 0
    this.request.Start = 0
    this.request.Order = e.active
    this.request.OrderBy = e.direction
    this.loadData()
  }

  loadData(): void {
    this.request.Order = "EmployeeCode"
    this.isLoadingResults = true;
    this.attendanceService.getEmployeeAttendanceTable(this.request,false).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          console.log(value.payload.data)
          this.dataSource = value.payload.data
          this.totalRows = value.payload.totalRows
          this.isLoadingResults = false;
        }
        else {
          console.log(value.stackTrace)
          console.log(value.message)
          this.isLoadingResults = false;
        }
      },
      error: (e) => {
        console.error(e)
        this.isLoadingResults = false;
      }
    });
  }
}
