import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DetailForm, BioForm } from 'app/model/administration/biometrics';

export interface PeriodicElement {
  serial_number: string;
  device_id: string;
  model: string;
  location: string;
  biometric_type: string;
  group: string;
  status: string;
  edit: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {serial_number: "B-2323",   device_id: '2223535345', model: 'ZTK', location: 'Manila', biometric_type: '', group: '0' , status: 'Offline', edit: ''},
  {serial_number: "B-1234",   device_id: '5632342345', model: 'ZTK', location: 'Makati', biometric_type: '', group: '0' , status: 'Offline', edit: ''},
];


@Component({
  selector: 'app-biometrics',
  templateUrl: './biometrics.component.html',
  styleUrls: ['./biometrics.component.css']
})

export class BiometricsComponent implements OnInit {
  displayedColumns: string[] = ['serial_number', 'device_id', 'model', 'location', 'biometric_type', 'group', 'active', 'status', 'edit'];
  dataSource = ELEMENT_DATA;

  detailForm: FormGroup
  bioForm: FormGroup
  isSave: boolean = false

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.detailForm = this.fb.group(new DetailForm());
    this.bioForm = this.fb.group(new BioForm());
  }

  submit(){
    this.isSave = true
  }

  handleActive(i,e){

  }

  handleEdit(e){

  }

  handleRemove(e){

  }

}
