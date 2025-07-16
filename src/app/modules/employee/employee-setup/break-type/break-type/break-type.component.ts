import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { Breaktype, BreaktypeDetail } from 'app/model/employee/break-type';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CategoryService } from 'app/services/categoryService/category.service';
import { MasterService } from 'app/services/masterService/master.service';

@Component({
    selector: 'app-break-type',
    templateUrl: 'break-type.component.html',
    styleUrls: ['break-type.component.css']
})
export class BreakTypeComponent implements OnInit {
    @ViewChild('breakTable') breakTable: MatTable<any>;
    dropdownOptions = new DropdownOptions
    dropdownRequest = new DropdownRequest
    breaktypeForm: FormGroup
    breakDeduction = [];
    id: string
    breakSource: BreaktypeDetail[] = [{
        breakTypeDetailId: 0,
        name: "Break 1",
        mins: 0,
        description: "after",
        hours: 0,
        type: 0,
        requireClock: false,
        paid: true,
        deductOverBreak: false
    }]
    status = [
        {id: true, description: 'Active'},
        {id: false, description: 'Inactive'},
    ];
    breakColumns: string[] = ['name', 'mins', 'after', 'hours', 'type', 'action'];
    pipe = new DatePipe('en-US');
    
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private message: FuseConfirmationService,
        private masterService: MasterService,
        private router: Router,
        private categoryService: CategoryService) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.breaktypeForm = this.fb.group(new Breaktype());
        this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 106 }, { dropdownID: 0, dropdownTypeID: 107 })
        this.dropdownRequest.search = ""
        this.dropdownRequest.start = 0
        this.masterService.getDropdownFix(this.dropdownRequest).subscribe({
            next: (value: any) => {
                this.dropdownOptions.breakTypeDef = value.payload.filter(x => x.dropdownTypeID == 107)
                this.breakDeduction = value.payload.filter(x => x.dropdownTypeID == 106)

               if(this.id != ""){
                this.categoryService.getBreakType(this.id).subscribe({
                    next: (value: any) => {
                      if (value.statusCode == 200) {
                        this.breaktypeForm.patchValue(JSON.parse(JSON.stringify(value.payload).replace(/\:null/gi, "\:[]")))

                        if(this.breaktypeForm.value.breakId == 30048){
                            this.dropdownOptions.breakDeductionDef = this.breakDeduction.filter(x => {
                                return x.dropdownID == 30044 || x.dropdownID == 30045;
                            });
                        }
                        else{
                            this.dropdownOptions.breakDeductionDef = this.breakDeduction.filter(x => {
                                return x.dropdownID == 30046 || x.dropdownID == 30047;
                            });
                        }

                        this.breakSource = value.payload.breakTypeDetail
                        this.breakTable.renderRows();
                      }
                      else {
                        console.log(value.stackTrace)
                        console.log(value.message)
                      }
                    },
                    error: (e) => {
                      console.error(e)
                    }
                  });
               }
            },
            error: (e) => {
                console.error(e)
            }
        });
    }

    submit() {
      // this.breaktypeForm.get('dateCreated').setValue(new Date().toISOString().substring(0,new Date().toISOString().length-1))
      this.breaktypeForm.get('dateCreated').setValue(this.pipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss.ms'))
        this.breaktypeForm.controls.breakTypeDetail.patchValue(this.breakSource);
        if (this.breaktypeForm.valid) {
            const dialogRef = this.message.open(SaveMessage);
            dialogRef.afterClosed().subscribe((result) => {
              if (result == "confirmed") {
                console.log(JSON.stringify(this.breaktypeForm.value))
                this.categoryService.postBreakType(this.breaktypeForm.value).subscribe({
                  next: (value: any) => {
                    if (value.statusCode == 200) {
                      this.message.open(SuccessMessage);
                      this.router.navigate(['/search/break-type-view']);
                    }
                    else {
                      FailedMessage.message = value.message
                      this.message.open(FailedMessage);
                      console.log(value.stackTrace)
                      console.log(value.message)
                    }
                  },
                  error: (e) => {
                    this.message.open(FailedMessage);
                    console.error(e)
                  }
                });
              }
            });
          }
    }

    handleAddBreak() {
        if (this.breakSource.length > 2) {
            FailedMessage.message = "Cannot add another break."
            this.message.open(FailedMessage);
        }
        else {
            this.breakSource.push({
                breakTypeDetailId: 0,
                name: "Break " + (this.breakSource.length + 1),
                mins: 0,
                description: "after",
                hours: 0,
                type: 0,
                requireClock: false,
                paid: true,
                deductOverBreak: false
            });
            this.breakTable.renderRows();
        }
    }

    handleDeleteBreak(index): void {
        this.breakSource.splice(index, 1);
        this.breakTable.renderRows();
    }

    handleBreakType(): void {
        if(this.breaktypeForm.value.breakId == 30048){
            this.dropdownOptions.breakDeductionDef = this.breakDeduction.filter(x => {
                return x.dropdownID == 30044 || x.dropdownID == 30045;
            });
        }
        else{
            this.dropdownOptions.breakDeductionDef = this.breakDeduction.filter(x => {
                return x.dropdownID == 30046 || x.dropdownID == 30047;
            });
        }
    }

}
