import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableRequest } from 'app/model/datatable.model';
import { UserService } from 'app/services/userService/user.service';

@Component({
  selector: 'app-crt',
  templateUrl: './crt.component.html',
  styleUrls: ['./crt.component.scss']
})
export class CrtComponent implements OnInit {

  displayedColumns: string[] = ['Branch', 'Complete', 'Incomplete'];
  // dataSource = new MatTableDataSource<any>();
  final = []
  dataSource: MatTableDataSource<any>;
  DE_inc = 0
  DE_c = 0
  total_up = 0
  Crt_gen = 0
  C_percent : string = "0%"
  Inc_percent :string = "0%"
  isadmin:boolean = false

  request = new TableRequest()
  totalRows = 0

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.request.Order = "branch"
    this.request.OrderBy = "ASC"

    this.loadData();
  }

  handlePageEvent(e): void {
    this.request.Start = e.pageIndex;
    this.request.Length = e.pageSize;
    this.loadData();
  }x

  loadData(){
    this.userService.getDashboardCRT(this.request).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          console.log(value.payload)

          this.DE_inc = value.payload.dE_inc
          this.DE_c = value.payload.dE_c
          this.total_up = value.payload.total_up
          this.Crt_gen = value.payload.crt_gen
          this.C_percent = value.payload.c_percent
          this.Inc_percent = value.payload.inc_percent
          
          this.dataSource = value.payload.final
          this.totalRows = value.payload.totalRows
        }
      },
      error: (e) => {
        console.error(e)
      }
    });
  }

}
