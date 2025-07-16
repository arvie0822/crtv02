import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropdownSettings } from 'app/model/administration/dropdown-settings';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { CoreService } from 'app/services/coreService/coreService.service';
import { Location } from '@angular/common';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTable } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';

@Component({
  selector: 'app-dropdown-settings',
  templateUrl: './dropdown-settings.component.html',
  styleUrls: ['./dropdown-settings.component.css']
})

export class DropdownSettingsComponent implements OnInit {
  displayedColumns: string[] = ['dropdownDescription', 'active', 'delete'];
  dataSource: any[] = []
  dropdownOptions = new DropdownOptions
  dropdownRequest = new DropdownRequest
  dropdownForm: FormGroup
  moduleType = []
  isSave: boolean = true
  @ViewChild('Table') Table: MatTable<any>;

  constructor(private fb: FormBuilder,
    private coreService: CoreService,
    private _location: Location,
    private tenantService: TenantService,
    private message: FuseConfirmationService) { }


  ngOnInit() {
    this.dropdownForm = this.fb.group(new DropdownSettings());
    this.dropdownOptions.dropdownTypeDef = this.coreService.getDropdownType([0])
    this.isSave = false
  }

  handleSelectModule(event): void{
    this.isSave = true
    this.dropdownRequest.id = []
    this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: event.value })
    this.dropdownRequest.length = 10000
    this.loadTable()
  }

  handleActive(index, event: MatSlideToggleChange) : void {
    let selected = this.dataSource[index]
    selected.active = event.checked
    this.isSave = true
    this.tenantService.postDropdown(selected).subscribe({
      next: (value: any) => {
        if (value.statusCode != 200) {
          console.log(value.stackTrace)
          console.log(value.message)
        }
      },
      error: (e) => {
        this.isSave = false
        console.error(e)
      },
      complete: () => {
        this.isSave = false
      }

    });
  }

  handleDelete(index) : void {
    let selected = this.dataSource[index]
    selected.deleted = true
    this.isSave = true
    this.tenantService.postDropdown(selected).subscribe({
      next: (value: any) => {
        if (value.statusCode != 200) {
          console.log(value.stackTrace)
          console.log(value.message)
        }
        else{
          this.loadTable()
        }
      },
      error: (e) => {
        this.isSave = false
        console.error(e)
      }
    });
  }

  loadTable(){
    this.tenantService.getDropdowSetting(this.dropdownRequest).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          console.log(value.payload)
          this.dataSource = value.payload
          this.Table.renderRows();
        }
        else {
          console.log(value.stackTrace)
          console.log(value.message)
        }
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        this.isSave = false
      }

    });
  }

  backClicked(): void{
    this._location.back();
  }

  submit(): void {
    this.dropdownForm.markAllAsTouched();
    if (this.dropdownForm.valid) {
      const dialogRef = this.message.open(SaveMessage);

      dialogRef.afterClosed().subscribe((result) => {
        if (result == "confirmed") {
          this.isSave = true

          this.tenantService.postDropdown(this.dropdownForm.value).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.message.open(SuccessMessage);
                this.dropdownForm.controls.dropdownDescription.reset()
                this.loadTable()
              }
              else {
                this.message.open(FailedMessage);
                console.log(value.stackTrace)
                console.log(value.message)
              }
            },
            error: (e) => {
              this.isSave = false
              this.message.open(FailedMessage);
              console.error(e)
            }
          });
        }
      });
    }
  }
}
