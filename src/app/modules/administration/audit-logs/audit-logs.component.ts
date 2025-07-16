import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Audit } from 'app/model/administration/audit-logs';
import { TableRequest } from 'app/model/datatable.model';
import { dropdownCustomType } from 'app/model/dropdown-custom.model';
import { DropdownOptions, DropdownRequest, SearchHierarchy } from 'app/model/dropdown.model';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) matTable: MatTable<any>;
  resultHierarchy = new SearchHierarchy;
  dropdownOptions = new DropdownOptions
  dropdownCustomType: any = dropdownCustomType
  isLoadingResults: boolean
  field_count = 0
  auditForm: FormGroup
  request = new TableRequest()
  dropdownRequest = new DropdownRequest()
  auditSource: any = []
  employee = []
  totalRows: number = 0
  auditColumns: string[] = ['module', 'activity', 'message', 'date', 'doneBy', 'device', 'browser'];
  pipe = new DatePipe('en-US');

  constructor(private fb: FormBuilder, private masterService: MasterService, private tenantService: TenantService, private coreService: CoreService) { }

  ngOnInit() {
    this.auditForm = this.fb.group(new Audit());
    this.auditForm.disable()
    this.request.SearchColumn = []
    this.request.Order = "dateCreated"
    this.request.OrderBy = "Desc"

    forkJoin({
      modules: this.coreService.getCoreDropdown(1015, this.dropdownRequest),
      auditType: this.masterService.getAuditTypeEnum(),
      employee: this.coreService.getCoreDropdown(1005, this.dropdownRequest),
    }).subscribe({
      next: (response) => {
        this.dropdownOptions.moduledef = response.modules.payload
        this.dropdownOptions.auditdef = response.auditType.payload
        this.dropdownOptions.employeedef = response.employee.payload
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        this.auditForm.enable()
      },
    });
  }

  handlePageEvent(e): void {
    this.request.Start = e.pageIndex
    this.request.Length = e.pageSize
    this.search()
  }

  handleSortEvent(e): void {
    this.paginator.pageIndex = 0
    this.request.Start = 0
    this.request.Order = e.active
    this.request.OrderBy = e.direction
    this.search()
  }

  search() {
    this.request.SearchColumn = []
    for (const field in this.auditForm.controls) {
      const control = this.auditForm.get(field);

      if (control.value != undefined && control.value != "" && control.value != null) {
        if (field == "moduleId" || field == "createdBy" || field == "auditType") {
          control.value.forEach(element => {
            this.request.SearchColumn.push({
              "key": field,
              "value": element + "",
              "type": 2
            })
          });
        }
        if (field == "dateFrom") {
          this.request.SearchColumn.push({
            "key": "dateCreated",
            "value": this.pipe.transform(control.value, "yyyy-MM-dd"),
            "type": 4
          })
        }
        if (field == "dateTo") {
          this.request.SearchColumn.push({
            "key": "dateCreated",
            "value": this.pipe.transform(control.value, "yyyy-MM-dd"),
            "type": 5
          })
        }
      }

    }


    this.tenantService.getSystemLogs(this.request).subscribe({
      next: (value: any) => {
        console.log(value)

        this.totalRows = value.payload.totalRows
        this.auditSource = value.payload.data
        this.auditSource.paginator = this.paginator;
        this.matTable.renderRows();
      },
      error: (e) => {
        console.error(e)
      }
    });
  }

}
