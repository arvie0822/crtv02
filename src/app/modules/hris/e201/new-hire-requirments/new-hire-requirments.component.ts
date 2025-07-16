import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-new-hire-requirments',
  templateUrl: './new-hire-requirments.component.html',
  styleUrls: ['./new-hire-requirments.component.css']
})
export class NewHireRequirmentsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = ['newhirerequirments', 'documentsubmitted', 'datesubmitted', 'issueddate', 'Expirationdate', 'deadlineofsubmition', 'uploaddocuments'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    imageUrl: any

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    constructor() { }

  ngOnInit() {

    // this.dataSource.paginator = this.paginator;
  }


  uploadFile(event,id) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    console.log(id)
    let element: HTMLElement = document.querySelector("#"+id) as HTMLElement;
    let fileName = event.target.files[0].name;
    element.setAttribute('value', fileName)
    if (event.target.files && event.target.files[0]) {
    reader.readAsDataURL(file);

    // When file uploads set it to file formcontrol
    reader.onload = () => {
        this.imageUrl = reader.result;
        // this.leaveForm.patchValue({
        // file: reader.result
        // });

    }
    // ChangeDetectorRef since file is loading outside the zone
    //   this.cd.markForCheck();
    }
}

}
export interface PeriodicElement {
    newhirerequirments: string;
    documentsubmitted: string;
    datesubmitted: string;
    issueddate: string;
    Expirationdate: string;
    deadlineofsubmition: string;
    uploaddocuments: string;
  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {newhirerequirments: 'TIN ID', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'SSS ID', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'PHIC ID', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'HDMF ID', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'NBI Clearance', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Police Clearance', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Barangay Clearance', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Medical Certificate', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Vaccination Card', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Vaccination Card', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Vaccination Card', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Vaccination Card', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Vaccination Card', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Vaccination Card', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Vaccination Card', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
    {newhirerequirments: 'Vaccination Card', documentsubmitted: 'Yes', datesubmitted: '2023/03/01', issueddate: '2023/03/01',Expirationdate:'2023/03/01',deadlineofsubmition:'2023/03/01',uploaddocuments:''},
  ];
