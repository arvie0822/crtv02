import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employee-movement',
  templateUrl: './employee-movement.component.html',
  styleUrls: ['./employee-movement.component.css']
})
export class EmployeeMovementComponent implements OnInit {

    displayedColumns: string[] = ['module', 'submodule', 'activity', 'oldvalue','newvalue','datetime','changeby'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    displayedColumns1: string[] = ['module', 'activity', 'oldvalue','newvalue','datetime','changeby'];
    dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);

    @ViewChild('paginator0') paginator0: MatPaginator;
    @ViewChild('paginator1') paginator1: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator0;
        this.dataSource1.paginator = this.paginator1;
    }

  constructor() { }

  ngOnInit() {
  }

}


export interface PeriodicElement {
    module: string;
    submodule: string;
    activity: string;
    oldvalue: string;
    newvalue: string;
    datetime: string;
    changeby: string;


  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {module: '',submodule : '',activity : '',oldvalue : '',newvalue :'',datetime :'',changeby :''},
  ];


  export interface PeriodicElement1 {
    module: string;
    activity: string;
    oldvalue: string;
    newvalue: string;
    datetime: string;
    changeby: string;


  }

  const ELEMENT_DATA1: PeriodicElement1[] = [
    {module: '',activity : '',oldvalue : '',newvalue :'',datetime :'',changeby :''},
  ];
