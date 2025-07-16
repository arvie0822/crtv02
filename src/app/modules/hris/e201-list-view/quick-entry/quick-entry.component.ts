import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchHierarchy } from 'app/model/dropdown.model';

@Component({
    selector: 'app-quick-entry',
    templateUrl: './quick-entry.component.html',
    styleUrls: ['./quick-entry.component.css']
})
export class QuickEntryComponent implements OnInit {

    resultHierarchy = new SearchHierarchy;
    field_count = 0


    @ViewChild('paginator0') paginator0: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator0;
    }

    constructor() { }

    ngOnInit() {
    }

    displayedColumns: string[] = [
        'employeeid',
        'displayname',
        'companyname',
        'address',
        'industry',
        'occupation',
        'jobdescription',
        'datefrom',
        'dateto',
        'reason',
        'upload',
    ];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

}


export interface PeriodicElement {
    employeeid: string;
    displayname: string;
    companyname: string;
    address: string;
    industry: string;
    occupation: string;
    jobdescription: string;
    datefrom: string;
    dateto: string;
    reason: string;
    upload: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
    { employeeid: '', displayname: '', companyname: '', address: '', industry: '', occupation: '', jobdescription: '', datefrom: '', dateto: '', reason: '', upload: '', },
];
