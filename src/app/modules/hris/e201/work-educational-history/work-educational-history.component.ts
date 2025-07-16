import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';




@Component({
  selector: 'app-work-educational-history',
  templateUrl: './work-educational-history.component.html',
  styleUrls: ['./work-educational-history.component.css']
})
export class WorkEducationalHistoryComponent implements OnInit {


    displayedColumns: string[] = ['company_name', 'address', 'industry', 'occupation','job_description','date_from','date_to','reason','upload',];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


    displayedColumns1: string[] = ['level', 'name_of_school', 'branch', 'degree','school_add','date_from','date_to','year_grad','contact_num','email_add',];
    dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);


    displayedColumns2: string[] = ['fullname', 'relationship', 'company', 'address','occupation','contact_number','email_add',];
    dataSource2  = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2);

    @ViewChild('paginator0') paginator0: MatPaginator;
    @ViewChild('paginator1') paginator1: MatPaginator;
    @ViewChild('paginator2') paginator2: MatPaginator;
    @ViewChild('paginator3') paginator3: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator0;
        this.dataSource1.paginator = this.paginator1;
        this.dataSource2.paginator = this.paginator2;
    }

  constructor() { }

  ngOnInit() {
  }

  uploadFile(){

  }

  sample(e,id){

    var sample = this.dataSource

  }

}


export interface PeriodicElement {
    company_name: string;
    address: string;
    industry: string;
    occupation: string;
    job_description: string;
    date_from: string;
    date_to: string;
    reason: string;
    upload: string;

  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {company_name: '',address : '',industry : '',occupation : '',job_description : '',date_from : '',date_to : '',reason : '',upload : ''},
    {company_name: '',address : '',industry : '',occupation : '',job_description : '',date_from : '',date_to : '',reason : '',upload : ''},
  ];


  export interface PeriodicElement1 {
    level: string;
    name_of_school: string;
    branch: string;
    degree: string;
    school_add: string;
    date_from: string;
    date_to: string;
    year_grad: string;
    contact_num: string;
    email_add: string;
  }

  const ELEMENT_DATA1: PeriodicElement1[] = [
    {level: '',name_of_school: '',branch: '',degree: '',school_add: '',date_from: '',date_to: '',year_grad: '',contact_num: '',email_add: ''},
    {level: '',name_of_school: '',branch: '',degree: '',school_add: '',date_from: '',date_to: '',year_grad: '',contact_num: '',email_add: ''},
    {level: '',name_of_school: '',branch: '',degree: '',school_add: '',date_from: '',date_to: '',year_grad: '',contact_num: '',email_add: ''},

  ];


  export interface PeriodicElement2 {
    fullname: string;
    relationship: string;
    company: string;
    address: string;
    occupation: string;
    contact_number: string;
    email_add: string;
  }

  const ELEMENT_DATA2: PeriodicElement2[] = [
    {fullname: '',relationship: '',company: '',address: '',occupation: '',contact_number: '',email_add: '',},
    {fullname: '',relationship: '',company: '',address: '',occupation: '',contact_number: '',email_add: '',},
    {fullname: '',relationship: '',company: '',address: '',occupation: '',contact_number: '',email_add: '',},
  ];
