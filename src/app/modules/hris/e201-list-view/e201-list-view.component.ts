import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { SearchHierarchy } from 'app/model/dropdown.model';
import { QuickEntryComponent } from './quick-entry/quick-entry.component';

@Component({
  selector: 'app-e201-list-view',
  templateUrl: './e201-list-view.component.html',
  styleUrls: ['./e201-list-view.component.css']
})
export class E201ListViewComponent implements OnInit {
    dialogRef: MatDialogRef<QuickEntryComponent, any>;
    resultHierarchy = new SearchHierarchy;
    field_count = 0

    displayedColumns: string[] = ['action','module', 'submodule', 'activity', 'oldvalue','newvalue','datetime','changeby'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


    @ViewChild('paginator0') paginator0: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator0;
    }

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
  }

  openlinl(){
    this.router.navigate(['/detail/e201']);
  }


  open() {
    if(this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.dialog.open(QuickEntryComponent, { width : '150%', height : '90%',
    panelClass: 'app-dialog'
    });
  }

}

export interface PeriodicElement {
    action : string
    module: string;
    submodule: string;
    activity: string;
    oldvalue: string;
    newvalue: string;
    datetime: string;
    changeby: string;


  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {action:'',module: '',submodule : '',activity : '',oldvalue : '',newvalue :'',datetime :'',changeby :''},
  ];

