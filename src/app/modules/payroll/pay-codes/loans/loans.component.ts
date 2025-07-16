import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { LoanForm} from 'app/model/payroll/paycodes';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { PayrollService } from 'app/services/payrollService/payroll.service';
import { CoreService } from 'app/services/coreService/coreService.service';
import { GF } from 'app/shared/global-functions';
import { forkJoin } from 'rxjs';
import { TenantService } from 'app/services/tenantService/tenant.service';
import _ from 'lodash';
@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
    loanForm: FormGroup
    id: string;
    _onDestroy: any
    dropdownFix = new DropdownRequest
    dropdownOptions = new DropdownOptions
    isSave: boolean = false
    constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private coreService: CoreService,
      private payrollService: PayrollService,
      private tenantService: TenantService,
      private message: FuseConfirmationService,
      private router: Router,) { }

    get lf() {return this.loanForm.value}

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe()
  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loanForm = this.fb.group(new LoanForm());
    if (this.id !== "") {
      //fetch edit data here
      this._onDestroy = this.payrollService.getLookupLoansType(this.id).subscribe({
        next: (value: any) => {
          if (value.statusCode == 200) {
            this.loanForm.patchValue(JSON.parse(JSON.stringify(value.payload)))
            this.dropdownFix.id.push(
              { dropdownID: value.payload.categoryID == null ? 0 : value.payload.categoryID,     dropdownTypeID: 92 },
              { dropdownID: GF.IsEmptyReturn(value.payload.jeAccountCodeId,0)            , dropdownTypeID: 133 },
              { dropdownID: GF.IsEmptyReturn(value.payload.jeAccountId,0)            , dropdownTypeID: 134 },
            )
            this.loadDropdown()
            this.initData()
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
      this.loadDropdown()
      this.initData()
    } else {
      this.dropdownFix.id.push(
          { dropdownID: 0, dropdownTypeID: 92 },
          { dropdownID: 0, dropdownTypeID: 133 },
          { dropdownID: 0, dropdownTypeID: 134 })
      this.loadDropdown()
      this.initData()
    }
  }

  initData(){
    this._onDestroy = this.coreService.getCoreDropdown(1043,this.dropdownFix)
    .subscribe({
      next: (value: any) => {
          this.dropdownOptions.categoryDef  = value.payload//.filter(x => x.dropdownTypeID === 92)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        this.loanForm.enable();
      }
    });
  }

  loadDropdown(){
    forkJoin({
        tenant: this.tenantService.getDropdown(this.dropdownFix),
    }).subscribe({
        next: (response) => {
            this.dropdownOptions.accountCodeDef  = _.uniqBy(response.tenant.payload.filter(x => x.dropdownTypeID == 133)   , JSON.stringify)
            this.dropdownOptions.accountNameDef  = _.uniqBy(response.tenant.payload.filter(x => x.dropdownTypeID == 134)   , JSON.stringify)
        },
        error: (e) => {
            console.error(e)
        },
        complete: () => {
            this.loanForm.enable();
          }
    });
  }

  submit(){
    if (this.loanForm.valid) {
      const dialogRef = this.message.open(SaveMessage);
      dialogRef.afterClosed().subscribe((result) => {
        if (result == "confirmed") {
          this.isSave = true

          this.payrollService.postLookupLoansType(this.loanForm.value).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.message.open(SuccessMessage);
                this.isSave = false,
                this.router.navigate(['/search/pay-codes']);
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
