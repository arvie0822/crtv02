import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

    bankColumns: string[] = [

        'employeeId', 'employeeName', 'bankName', 'bankAccount', 'amount'

    ];

    @Input() datasource: any

  constructor() { }

  ngOnInit() {
  }

}
