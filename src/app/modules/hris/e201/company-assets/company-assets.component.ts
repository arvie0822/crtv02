import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-company-assets',
  templateUrl: './company-assets.component.html',
  styleUrls: ['./company-assets.component.css']
})
export class CompanyAssetsComponent implements OnInit {

    displayedColumns: string[] = ['category', 'model', 'serialnumber', 'condition','issuedate','returndate','returncondition','replacement','remarks'];
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
    category: string;
    model: string;
    serialnumber: string;
    condition: string;
    issuedate: string;
    returndate: string;
    returncondition: string;
    replacement: string;
    remarks: string;

  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {category: '',model : '',serialnumber : '',condition : '',issuedate :'',returndate :'',returncondition :'',replacement :'',remarks :'',},
  ];
