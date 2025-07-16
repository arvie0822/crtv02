import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { timelogs } from 'app/model/administration/time-logs';
import { TableRequest } from 'app/model/datatable.model';
import { SearchHierarchy } from 'app/model/dropdown.model';
import { AttendanceService } from 'app/services/attendanceService/attendance.service';
import { CoreService } from 'app/services/coreService/coreService.service';

@Component({
  selector: 'app-time-logs',
  templateUrl: './time-logs.component.html',
  styleUrls: ['./time-logs.component.css']
})
export class TimeLogsComponent implements OnInit {
    timelogsform : FormGroup
    request = new TableRequest()
    pipe = new DatePipe('en-US');
    resultHierarchy = new SearchHierarchy;
    dataSource = [];
    totalRows: number = 0
    field_count = 0
    isLoadingResults: boolean = true;
    displayedColumns: string[] = ['displayName','employeeCode', 'dateDisplay', 'day', 'logTypeDisplay', 'bundyTypeDisplay','location','lateFiling'];
    dateFrom = new Date()
    dateTo = new Date()

    @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor( private fb: FormBuilder, private attendanceService: AttendanceService, private core: CoreService) { }

  ngOnInit() {
    this.request.Order = "EmployeeId"
  }

  search(ex) {
    this.request.SearchColumn = []

    var df = this.pipe.transform(this.dateFrom,'yyyy-MM-ddT00:00:00')
    var dt = this.pipe.transform(this.dateTo,'yyyy-MM-ddT23:59:00')

      this.request.SearchColumn.push({
        "key": "Date",
        "value": df,
        "type": 4
      })

      this.request.SearchColumn.push({
        "key": "Date",
        "value": dt,
        "type": 5
      })

      if (this.resultHierarchy.Search.length > 0) {

        this.resultHierarchy.Search.forEach(element => {
          if (Array.isArray(element.Value)) {
            element.Value.forEach(val => {
              this.request.SearchColumn.push({
                "key": element.Key,
                "value": val + "",
                "type": element.Type
              })
            });
          } else {
            this.request.SearchColumn.push({
              "key": element.Key,
              "value": element.Value + "",
              "type": element.Type
            })
          }
        });
      }
      if (ex) {
        this.core.exportAll(this.request,'67','1')
      } else {
        this.loadData()
      }

  }

  handlePageEvent(e): void {
    this.request.Start = e.pageIndex
    this.request.Length = e.pageSize
    this.loadData()
  }

  handleSortEvent(e): void {
    this.request.Start = 0
    this.request.Order = e.active
    this.request.OrderBy = e.direction
    this.loadData()
  }


  loadData(): void {
    this.isLoadingResults = true;
    this.attendanceService.getAttendanceLogsTable(this.request).subscribe({
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
