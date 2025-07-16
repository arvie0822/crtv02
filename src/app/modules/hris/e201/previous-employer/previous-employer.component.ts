import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-previous-employer',
  templateUrl: './previous-employer.component.html',
  styleUrls: ['./previous-employer.component.css']
})
export class PreviousEmployerComponent implements OnInit {

    displayedColumns: string[] = ['prevcompany','tin','address','zip','year'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild('paginator0') paginator0: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator0;
    }

  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
    prevcompany: string;
    tin: string;
    address: string;
    zip: string;
    year: string;
  }
  const ELEMENT_DATA: PeriodicElement[] = [
    {prevcompany:'',tin :'',address :'',zip :'',year :''},
  ];
