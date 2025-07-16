import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AdministrationComponent } from './administration.component';
import { RouterModule, Routes } from '@angular/router';
import { BranchComponent } from './branch/branch.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ShiftCodesComponent } from './shift-codes/shift-codes.component';
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
import { CompanyComponent } from './company/company.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LeavesComponent } from './leaves/leaves.component';
import { DropdownSettingsComponent } from './dropdown-settings/dropdown-settings.component';
import { HolidayComponent } from './holiday/holiday.component';
import { PayrollCutoffComponent } from './payroll-cutoff/payroll-cutoff.component';
import { BiometricsComponent } from './biometrics/biometrics.component';
import { MatBadgeModule } from '@angular/material/badge';
import { NewsAnnouncementsComponent } from './news-announcements/news-announcements.component';
import { MatTimepickerModule } from 'mat-timepicker';
import { CardTitleModule } from 'app/core/card-title/card-title.module';
import { ShiftcodesperdayComponent } from './shiftcodesperday/shiftcodesperday.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ShiftsComponent } from './shifts/shifts.component';
import { DatatableComponent } from 'app/core/datatable/datatable.component';
import { DatatableModule } from 'app/core/datatable/datatable.module';
import { ShiftsModule } from './shifts/shifts.module';
import { SubcompanyComponent } from './sub-company/sub-companycomponent';
import { ApprovalProcessComponent } from './approval-process/approval-process.component';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { LockFilingComponent } from './payroll-cutoff/lock-filing/lock-filing.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatTimepickerComponentDialogComponent } from 'mat-timepicker/lib/timepicker-dialog/timepicker-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AccessControlComponent } from './access-control/access-control.component';
import { MatTreeModule } from '@angular/material/tree';
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';
import { DropdownCustomModule } from 'app/core/dropdown-custom/dropdown-custom.module';
import { DropdownEntitlementModule } from 'app/core/dropdown-entitlement/dropdown-entitlement.module';
import { ModalComponent } from './branch/modal/modal.component';
import { OnlyNumberDirective } from '@fuse/directives/input-/numberOnly.directive';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { EmployeeHierarchyModule } from 'app/core/employee-hierarchy/employee-hierarchy.module';
import { TimeLogsComponent } from './time-logs/time-logs.component';
import { DeductionHierarchyComponent } from './deduction-hierarchy/deduction-hierarchy.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PayrollCategoryComponent } from './payroll-category/payroll-category.component';
import { CustomModule } from 'app/shared/custom.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropdownHierarchyModule } from 'app/core/dropdown-hierarchy/dropdown-hierarchy.module';




const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      {
        path: '',
        redirectTo: 'company',
        pathMatch: 'full'
      },
      {
        path: 'company',
        component: CompanyComponent
      },
      {
        path: 'branch',
        redirectTo: "branch/",
        pathMatch: 'full'
      },
      {
        path: 'branch/:id',
        component: BranchComponent
      },
      {
        path: 'sub-company',
        redirectTo: "sub-company/",
        pathMatch: 'full'
      },
      {
        path: 'sub-company/:id',
        component: SubcompanyComponent
      },
      {
        path: 'shift-codes',
        redirectTo: "shift-codes/",
        pathMatch: 'full'
      },
      {
        path: 'shift-codes/:id',
        component: ShiftCodesComponent
      },
      {
      path: 'shiftcodesperday-detail',
      redirectTo: "shiftcodesperday-detail/",
      pathMatch: 'full'
     },
     {
      path: 'shiftcodesperday-detail/:id',
      component: ShiftcodesperdayComponent
     },
      {
        path: 'leave-detail',
        redirectTo: "leave-detail/",
        pathMatch: 'full'
      },
      {
        path: 'leave-detail/:id',
        component: LeavesComponent
      },
      {
        path: 'dropdown-settings',
        component: DropdownSettingsComponent
      },
      {
        path: 'holiday-detail',
        redirectTo: "holiday-detail/",
        pathMatch: 'full'
      },
      {
        path: 'holiday-detail/:id',
        component: HolidayComponent
      },
      {
        path: 'payroll-cutoff-detail',
        redirectTo: "payroll-cutoff-detail/",
        pathMatch: 'full'
      },
      {
        path: 'payroll-cutoff-detail/:id',
        component: PayrollCutoffComponent
      },
      {
        path: 'biometrics',
        component: BiometricsComponent
      },
      {
        path: 'news-announcements-detail',
        redirectTo: "news-announcements-detail/",
        pathMatch: 'full'
      },
      {
        path: 'news-announcements-detail/:id',
        component: NewsAnnouncementsComponent
      },
      {
        path: 'shifts-detail',
        redirectTo: "shifts-detail/",
        pathMatch: 'full'
      },
      {
        path: 'shifts-detail/:id',
        component: ShiftsComponent
      },
      {
        path: 'access-control',
        redirectTo: "access-control/",
        pathMatch: 'full'
      },
      {
        path: 'access-control/:id',
        component: AccessControlComponent
      },


      {
        path: 'approval-process',
        redirectTo: "approval-process/",
        pathMatch: 'full'
      },
      {
        path: 'approval-process/:id',
        component: ApprovalProcessComponent
      },
      {
        path: 'audit-logs',
        redirectTo: "audit-logs/",
        pathMatch: 'full'
      },
      {
        path: 'audit-logs',
        component: AuditLogsComponent
      },
      {
        path: 'time-logs',
        component: TimeLogsComponent
      },
    //   {
    //     path: 'file-on-behalf',
    //     redirectTo: "file-on-behalf/",
    //     pathMatch: 'full'
    //   },
    //   {
    //     path: 'file-on-behalf',
    //     component: FilingComponent
    //   },
      {
        path: 'deduction-hierarchy',
        redirectTo: "deduction-hierarchy/",
        pathMatch: 'full'
      },
      {
        path: 'deduction-hierarchy',
        component: DeductionHierarchyComponent
      },
      {
        path: 'payroll-category',
        redirectTo: "payroll-category/",
        pathMatch: 'full'
      },
      {
        path: 'payroll-category',
        component: PayrollCategoryComponent
      },
      {
        path: 'payroll-category/:id',
        component: PayrollCategoryComponent
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
    MatSortModule,
    MatTableModule,
    FuseAlertModule,
    MatProgressSpinnerModule,
    DropdownModule,
    MatStepperModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatTimepickerModule,
    CardTitleModule,
    MatTabsModule,
    MatPaginatorModule,
    ShiftsModule,
    MatListModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatToolbarModule,
    MatTreeModule,
    MatRadioModule,
    DropdownCustomModule,
    DropdownEntitlementModule,
    EmployeeHierarchyModule,
    DragDropModule,
    MatTooltipModule,
    DropdownHierarchyModule


  ],
  declarations: [
    AdministrationComponent,
    BranchComponent,
    CompanyComponent,
    LeavesComponent,
    DropdownSettingsComponent,
    HolidayComponent,
    PayrollCutoffComponent,
    BiometricsComponent,
    NewsAnnouncementsComponent,
    SubcompanyComponent,
    ApprovalProcessComponent,
    LockFilingComponent,
    ModalComponent,
    AccessControlComponent,
    // OnlyNumberDirective,
    AuditLogsComponent,
    TimeLogsComponent,
    DeductionHierarchyComponent,
    // ShiftcodesperdayComponent,
    // ShiftsComponent,
    // ShiftCodesComponent,
    // DatatableComponent
    // DatatableComponent
  ],
  exports: [
    HolidayComponent,

    AccessControlComponent
  ],
  providers: [DecimalPipe],
})
export class AdministrationModule { }
