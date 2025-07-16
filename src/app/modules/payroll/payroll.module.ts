import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PayrollComponent } from './payroll.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskModule } from 'ngx-mask';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DropdownModule } from 'app/core/dropdown/dropdown.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTimepickerModule } from 'mat-timepicker';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { CardTitleModule } from 'app/core/card-title/card-title.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PayCodesComponent } from './pay-codes/pay-codes.component';
import { EarningsComponent } from './pay-codes/earnings/earnings.component';
import { DeductionsComponent } from './pay-codes/deductions/deductions.component';
import { LoansComponent } from './pay-codes/loans/loans.component';
import { PayrollLoansComponent } from './payroll-loans/payroll-loans.component';
import { PayrollDeductionComponent } from './payroll-deduction/payroll-deduction.component';
import { DropdownCustomModule } from 'app/core/dropdown-custom/dropdown-custom.module';
import { EmployeeEarningsComponent } from './employee-earnings/employee-earnings.component';
import { RatesComponent } from './rates/rates.component';
import { PayrollRunComponent } from './payroll-run/payroll-run.component';
import { DeductionComponent } from './payroll-run/deduction/deduction.component';
import { LoanComponent } from './payroll-run/loan/loan.component';
import { UploadComponent } from './payroll-run/upload/upload.component';
import { GenerateComponent } from './payroll-run/generate/generate.component';
import { EarningComponent } from './payroll-run/earning/earning.component';
import { TimekeepingTableComponent } from './payroll-run/timekeeping-table/timekeeping-table.component';
import { GovconComponent } from './payroll-run/govcon/govcon.component';
import { CustomModule } from 'app/shared/custom.module';
import { ApprovalReasonComponent } from './payroll-run/approval-reason/approval-reason.component';
import { BankComponent } from './payroll-run/bank/bank.component';
import { EmployeeHierarchy } from 'app/model/employee-hierarchy';
import { EmployeeHierarchyModule } from 'app/core/employee-hierarchy/employee-hierarchy.module';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { PayrollHierarchyModule } from 'app/core/payroll-hierarchy/payroll-hierarchy.module';
import { DialogboxComponent } from './payroll-run/dialogbox/dialogbox.component';
import { PayregCodeComponent } from './payreg-code/payreg-code.component';
import { DatatableComponent } from 'app/core/datatable/datatable.component';
import { DatatableModule } from 'app/core/datatable/datatable.module';
import { DialogBoxCurrencyComponent } from './payroll-run/dialogBoxCurrency/dialogBoxCurrency.component';


const routes: Routes = [
    {
        path: '',
        component: PayrollComponent,
        children: [
            {
                path: 'pay-codes',
                redirectTo: "pay-codes/",
                pathMatch: 'full'
            },
            {
                path: 'pay-codes/:id',
                component: PayCodesComponent
            },

            {
                path: 'payroll-loans-detail',
                redirectTo: "payroll-loans-detail/",
                pathMatch: 'full'
            },
            {
                path: 'payroll-loans-detail/:id',
                component: PayrollLoansComponent
            },
            {
                path: 'payroll-deductions-detail',
                redirectTo: "payroll-deductions-detail/",
                pathMatch: 'full'
            },
            {
                path: 'payroll-deductions-detail/:id',
                component: PayrollDeductionComponent
            },
            {
                path: 'rates',
                redirectTo: "rates/",
                pathMatch: 'full'
            },
            {
                path: 'rates/:id',
                component: RatesComponent
            },


            {
                path: 'payroll-earnings-detail',
                redirectTo: "payroll-earnings-detail/",
                pathMatch: 'full'
            },
            {
                path: 'payroll-earnings-detail/:id',
                component: EmployeeEarningsComponent
            },
            {
                path: 'payroll-run',
                redirectTo: "payroll-run/",
                pathMatch: 'full'
            },
            {
                path: 'payroll-run/:id',
                component: PayrollRunComponent
            },{
                path: 'payreg-code',
                redirectTo: "payreg-code/",
                pathMatch: 'full'
            },
            {
                path: 'payreg-code/:id',
                component: PayregCodeComponent
            },
        ]
    }]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule,
        MatDividerModule,
        MatProgressBarModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDividerModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatSelectInfiniteScrollModule,
        MatAutocompleteModule,
        FuseHighlightModule,
        SharedModule,
        CustomModule,
        NgxMaskModule.forRoot(),
        FuseAlertModule,
        MatProgressSpinnerModule,
        DropdownModule,
        MatStepperModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatBadgeModule,
        MatTimepickerModule,
        TranslocoModule,
        MatTabsModule,
        CardTitleModule,
        DropdownCustomModule,
        //table required
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        EmployeeHierarchyModule,
        MatProgressBarModule,
        MatTooltipModule,
        PayrollHierarchyModule,
        DatatableModule,
    ],
    declarations: [
        PayrollComponent,
        EarningsComponent,
        PayCodesComponent,
        DeductionsComponent,
        LoansComponent,
        PayrollLoansComponent,
        PayrollDeductionComponent,
        EmployeeEarningsComponent,
        RatesComponent,
        PayrollRunComponent,
        PayrollRunComponent,
        EarningComponent,
        DeductionComponent,
        LoanComponent,
        UploadComponent,
        GenerateComponent,
        TimekeepingTableComponent,
        GovconComponent,
        ApprovalReasonComponent,
        BankComponent,
        DialogboxComponent,
        DialogBoxCurrencyComponent,
        PayregCodeComponent,
    ],
    exports: [],
    providers: [DatePipe]
})
export class PayrollModule { }
