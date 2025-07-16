import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { EmployeeComponent } from './employee.component';
import { EmployeeDetailComponent } from './employee-setup/employee-detail/employee-detail.component';
import { CategoryDetailComponent } from './employee-setup/category-detail/category-detail.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeScheduleComponent } from './employee-maintenance/employee-schedule/employee-schedule.component';
import { LeaveEntitlementComponent } from './employee-maintenance/leave-entitlement/leave-entitlement.component';
import { CardTitleModule } from 'app/core/card-title/card-title.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import { PerDayComponent } from './employee-maintenance/employee-schedule/child/per-day/per-day.component';
import { PerWeekComponent } from './employee-maintenance/employee-schedule/child/per-week/per-week.component';
import { BreakTypeComponent } from './employee-setup/break-type/break-type/break-type.component';
import { TimekeepingCategoryComponent } from './employee-setup/timekeeping-category/timekeeping-category/timekeeping-category.component';
import { AccessControlComponent } from '../administration/access-control/access-control.component';
import { HolidayComponent } from '../administration/holiday/holiday.component';
import { EmployeeAttendanceComponent } from './employee-maintenance/employee-attendance/employee-attendance.component';
import { EmployeeAttendanceModalComponent } from './employee-maintenance/employee-attendance/employee-attendance-modal/employee-attendance-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { TimekeepingGenerationComponent } from './employee-setup/timekeeping-generation/timekeeping-generation.component';
import { GenerateDetailedComponent } from './employee-setup/timekeeping-generation/generate-detailed/generate-detailed.component';
import { SummaryGenerateComponent } from './employee-setup/timekeeping-generation/summary-generate/summary-generate.component';
import { DropdownCustomModule } from 'app/core/dropdown-custom/dropdown-custom.module';
import { EmployeeHierarchyModule } from 'app/core/employee-hierarchy/employee-hierarchy.module';
import { DropdownEntitlementModule } from 'app/core/dropdown-entitlement/dropdown-entitlement.module';
import { AdministrationModule } from '../administration/administration.module';
import { LeaveBalanceComponent } from './employee-setup/leave-balance/leave-balance.component';
import { PayrollCategoryComponent } from '../administration/payroll-category/payroll-category.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeLocationComponent } from './employee-maintenance/employee-location/employee-location.component';
import { EffectiveDateComponent } from './employee-setup/employee-detail/effective-date/effective-date.component';
import { DropdownHierarchyModule } from 'app/core/dropdown-hierarchy/dropdown-hierarchy.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResetDateComponent } from './employee-setup/employee-detail/reset-date/reset-date.component';
const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: '',
        redirectTo: 'employee-list',
        pathMatch: 'full'
      },
      {
        path: 'employee-detail',
        redirectTo: "employee-detail/",
        pathMatch: 'full'
      },
      {
        path: 'employee-detail/:id',
        component: EmployeeDetailComponent
      },
      {
        path: 'category-detail',
        redirectTo: "category-detail/",
        pathMatch: 'full'
      },
      {
        path: 'category-detail/:id',
        component: CategoryDetailComponent
      },
      {
        path: 'employee-schedule/:id/:type',
        component: EmployeeScheduleComponent
      },
      {
        path: 'employee-schedule/:id',
        component: EmployeeScheduleComponent
      },
      {
        path: 'employee-schedule',
        redirectTo: "employee-schedule/",
        pathMatch: 'full'
      },
      {
        path: 'leave-entitlement',
        component: LeaveEntitlementComponent
      },
      {
        path: 'break-type',
        redirectTo: "break-type/",
        pathMatch: 'full'
      },
      {
        path: 'break-type/:id',
        component: BreakTypeComponent
      },
      {
        path: 'timekeeping-category',
        redirectTo: "timekeeping-category/",
        pathMatch: 'full'
      },
      {
        path: 'timekeeping-category/:id',
        component: TimekeepingCategoryComponent
      },
      {
        path: 'employee-attendance',
        component: EmployeeAttendanceComponent
      },
      {
        path: 'timekeeping-generation',
        redirectTo: "timekeeping-generation/",
        pathMatch: 'full'
      },
      {
        path: 'timekeeping-generation',
        component: TimekeepingGenerationComponent
      },
      {
        path: 'leave-balance',
        component: LeaveBalanceComponent
      },
      {
        path: 'employee-location',
        redirectTo: "employee-location/",
        pathMatch: 'full'
      },
      {
        path: 'employee-location/:id',
        component: EmployeeLocationComponent
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
    TranslocoModule,
    MatTabsModule,
    CardTitleModule,
    MatPaginatorModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    DropdownCustomModule,
    EmployeeHierarchyModule,
    DropdownEntitlementModule,
    AdministrationModule,
    MatTooltipModule,
    DropdownHierarchyModule,
  ],
  declarations: [
    EmployeeComponent,
    EmployeeDetailComponent,
    CategoryDetailComponent,
    EmployeeScheduleComponent,
    LeaveEntitlementComponent,
    PerDayComponent,
    PerWeekComponent,
    BreakTypeComponent,
    TimekeepingCategoryComponent,
    EmployeeAttendanceComponent,
    EmployeeAttendanceModalComponent,
    TimekeepingGenerationComponent,
    GenerateDetailedComponent,
    SummaryGenerateComponent,
    LeaveBalanceComponent,
    PayrollCategoryComponent,
    EmployeeLocationComponent,
    EffectiveDateComponent,
    ResetDateComponent,
  ],
  exports: [
    TimekeepingCategoryComponent,
    CategoryDetailComponent,
    PayrollCategoryComponent
  ],
  providers: [
    CurrencyPipe,
    { provide: MAT_DIALOG_DATA, useValue: {} }
]
  // provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'
})
export class EmployeeModule { }
