import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-learnings',
  templateUrl: './learnings.component.html',
  styleUrls: ['./learnings.component.css']
})
export class LearningsComponent implements OnInit {

    displayedColumns: string[] = ['skills', 'specialized', 'description'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    displayedColumns1: string[] = ['lecensetype','lecenseno','issuedate','expirationdate','upload']
    dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);

    displayedColumns2: string[] = ['awardtitlt', 'date', 'description', 'upload'];
    dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2);


    displayedColumns3: string[] = ['traningseminar', 'type', 'location', 'datefrom','dateto','conductedby','upload'];
    dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA3);

    // {exam: '',score : '',location : '',datefrom:'',dateto:'',conductedby:'',upload:''},

    displayedColumns4: string[] = ['exam', 'score', 'location', 'datefrom','dateto','conductedby','upload'];
    dataSource4 = new MatTableDataSource<PeriodicElement4>(ELEMENT_DATA4);

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
  }

  uploadFile(){

  }

}

export interface PeriodicElement {
    skills: string;
    specialized: string;
    description: string;

  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {skills: '',specialized : '',description : ''},
  ];

  export interface PeriodicElement1 {
    lecensetype: string;
    lecenseno: string;
    issuedate: string;
    expirationdate: string;
    upload: string;

  }

  const ELEMENT_DATA1: PeriodicElement1[] = [
    {lecensetype: '',lecenseno : '',issuedate : '',expirationdate:'',upload:''},
  ];

  export interface PeriodicElement2 {
    awardtitlt: string;
    date: string;
    description: string;
    upload: string;

  }

  const ELEMENT_DATA2: PeriodicElement2[] = [
    {awardtitlt: '',date : '',description : '',upload:''},
  ];

  export interface PeriodicElement3 {
    traningseminar: string;
    type: string;
    location: string;
    datefrom: string;
    dateto: string;
    conductedby: string;
    upload: string;

  }

  const ELEMENT_DATA3: PeriodicElement3[] = [
    {traningseminar: '',type : '',location : '',datefrom:'',dateto:'',conductedby:'',upload:'',},
  ];


  export interface PeriodicElement4 {
    exam: string;
    score: string;
    location: string;
    datefrom: string;
    dateto: string;
    conductedby: string;
    upload: string;

  }

  const ELEMENT_DATA4: PeriodicElement4[] = [
    {exam: '',score : '',location : '',datefrom:'',dateto:'',conductedby:'',upload:''},
  ];



