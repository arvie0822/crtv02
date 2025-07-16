import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-incident-report-memo',
    templateUrl: './incident-report-memo.component.html',
    styleUrls: ['./incident-report-memo.component.css']
})
export class IncidentReportMemoComponent implements OnInit {

    displayedColumns: string[] = ['dates', 'incidenttype', 'violationcategory', 'description'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    displayedColumns1: string[] = ['offenselevel', 'section', 'description', 'desciplinaryaction','dateserve','slidedate'];
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

    uploadFile() {

    }
}

export interface PeriodicElement {
    dates: string;
    incidenttype: string;
    violationcategory: string;
    description: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
    { dates: '', incidenttype: '', violationcategory: '', description: '' },
];


export interface PeriodicElement1 {
    offenselevel: string;
    section: string;
    description: string;
    desciplinaryaction: string;
    dateserve: string;
    slidedate: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
    { offenselevel: '', section: '', description: '', desciplinaryaction: '',dateserve: '',slidedate: '', },
];
