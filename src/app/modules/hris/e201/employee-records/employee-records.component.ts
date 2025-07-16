import { Component, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';




@Component({
  selector: 'app-employee-records',
  templateUrl: './employee-records.component.html',
  styleUrls: ['./employee-records.component.css']
})
export class EmployeeRecordsComponent implements OnInit {

    displayedColumns: string[] = ['year', 'period', 'rating', 'feedback','upload'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    displayedColumns1: string[] = ['medical_center','medical_exam','date_conducted','result_and_findings','upload_medical_records']
    dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);

    displayedColumns2: string[] = ['lastname', 'firstname', 'middlename', 'bitrthday','relatioship','occupation','address','contactnum'];
    dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2);

    displayedColumns3: string[] = ['visatype', 'country', 'visanumber', 'issuedate','expidate','placeofissue'];
    dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA3);


    @ViewChild('paginator0') paginator0: MatPaginator;
    @ViewChild('paginator1') paginator1: MatPaginator;
    @ViewChild('paginator2') paginator2: MatPaginator;
    @ViewChild('paginator3') paginator3: MatPaginator;

    ngAfterViewInit() {
            this.dataSource.paginator = this.paginator0;
            this.dataSource1.paginator = this.paginator1;
            this.dataSource2.paginator = this.paginator2;
            this.dataSource3.paginator = this.paginator3;
    }


  constructor() { }

  ngOnInit() {
    // this.dataSource2.paginator = this.paginator;

  }

  uploadFile(){}

}


export interface PeriodicElement2 {
    lastname: string;
    firstname: string;
    middlename: string;
    bitrthday: string;
    relatioship: string;
    occupation: string;
    address: string;
    contactnum: string;
  }

  const ELEMENT_DATA2: PeriodicElement2[] = [
    {lastname: '',firstname: '',middlename: '',bitrthday: '',relatioship: '',occupation: '',address: '',contactnum: '',},
    {lastname: '',firstname: '',middlename: '',bitrthday: '',relatioship: '',occupation: '',address: '',contactnum: '',},
  ];

  export interface PeriodicElement3 {
    visatype: string;
    country: string;
    visanumber: string;
    issuedate: string;
    expidate: string;
    placeofissue: string;
  }

  const ELEMENT_DATA3: PeriodicElement3[] = [
    {visatype: '',country: '',visanumber: '',issuedate: '',expidate: '',placeofissue: ''},
    {visatype: '',country: '',visanumber: '',issuedate: '',expidate: '',placeofissue: ''},
  ];

  export interface PeriodicElement {
    year: string;
    period: string;
    rating: string;
    feedback: string;
    upload: string;

  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {year: '',period : '',rating : '',feedback : '',upload :''},
  ];


  export interface PeriodicElement1 {
    medical_center: string;
    medical_exam: string;
    date_conducted: string;
    result_and_findings: string;
    upload_medical_records: string;
  }

  const ELEMENT_DATA1: PeriodicElement1[] = [
    {medical_center: '',medical_exam: '',date_conducted: '',result_and_findings: '',upload_medical_records: ''},
    {medical_center: '',medical_exam: '',date_conducted: '',result_and_findings: '',upload_medical_records: ''},
    {medical_center: '',medical_exam: '',date_conducted: '',result_and_findings: '',upload_medical_records: ''},
  ];
