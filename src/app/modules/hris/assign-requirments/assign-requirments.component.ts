import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assign-requirments',
  templateUrl: './assign-requirments.component.html',
  styleUrls: ['./assign-requirments.component.css']
})
export class AssignRequirmentsComponent implements OnInit {

    displayedColumns: string[] = ['action','occupation', 'requirments', 'days'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild('paginator0') paginator0: MatPaginator;


    ngAfterViewInit() {
            this.dataSource.paginator = this.paginator0;
    }

  constructor() { }

  ngOnInit() {
  }

  submit(){}

}

export interface PeriodicElement {
    action : string
    occupation: string;
    requirments: string;
    days: string;
  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {action:'',occupation:'',requirments :'',days :''},
    {action:'',occupation:'',requirments :'',days :''},
    {action:'',occupation:'',requirments :'',days :''},
    {action:'',occupation:'',requirments :'',days :''},
  ];
