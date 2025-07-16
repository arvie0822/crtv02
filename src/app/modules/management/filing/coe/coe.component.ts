import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { coeForm } from 'app/model/administration/filing';

@Component({
  selector: 'app-coe',
  templateUrl: './coe.component.html',
  styleUrls: ['./coe.component.css']
})
export class CoeComponent implements OnInit {
    coeForm : FormGroup
    coe = [
        {id: 0, description: 'Legal'},
        {id: 1, description: 'Loan'},
        {id: 2, description: 'Local Employment'},
        {id: 3, description: 'Employment Abroad'},
        {id: 4, description: 'Mobile Plan'},
        {id: 5, description: 'Visa Application'},
        {id: 6, description: 'School Requirement'},
    ]

    application = [
        {id: 0, description: 'No'},
        {id: 1, description: 'Yes'},
    ]

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.coeForm  = this.fb.group(new coeForm ());

    }

}
