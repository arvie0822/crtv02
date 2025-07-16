import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CardTitleModule } from 'app/core/card-title/card-title.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatatableComponent } from 'app/core/datatable/datatable.component';
import { DatatableModule } from 'app/core/datatable/datatable.module';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { ManagementComponent } from './management.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { FilingComponent } from './filing/filing.component';
import { EmployeeHierarchyModule } from 'app/core/employee-hierarchy/employee-hierarchy.module';
import { ShiftsModule } from '../administration/shifts/shifts.module';
import { MatRadioModule } from '@angular/material/radio';
import { DropdownCustomModule } from 'app/core/dropdown-custom/dropdown-custom.module';
import { DropdownEntitlementModule } from 'app/core/dropdown-entitlement/dropdown-entitlement.module';
import { ApprovalComponent } from './approval/approval.component';
import { FormsModule } from '@angular/forms';
import { ApprovalReasonComponent } from './approval/approval-reason/approval-reason.component';
import { DissapproveReasonComponent } from './approval/dissaprove-reason/dissaprove-reason.component';
import { OfficialBusinessComponent } from './filing/official-business/official-business.component';
import { ChangeScheduleComponent } from './filing/change-schedule/change-schedule.component';
import { ChangeLogComponent } from './filing/change-log/change-log.component';
import { OvertimeComponent } from './filing/overtime/overtime.component';
import { OffsetComponent } from './filing/offset/offset.component';
import { UnpaidHoursComponent } from './filing/unpaid-hours/unpaid-hours.component';
import { CoeComponent } from './filing/coe/coe.component';
import { ModalDateRangeComponent } from './filing/change-schedule/modal-date-range/modal-date-range.component';
// import { ModalBeforeSavingComponent } from './filing/change-schedule/modal-before-saving/modal-before-saving.component';
import { ClModalBeforeSavingComponent } from './filing/change-log/cl-modal-before-saving/cl-modal-before-saving.component';
import { LeaveComponent } from './filing/leave/leave.component';
import { TimemodalComponent } from './filing/change-log/timemodal/timemodal.component';
import { TimeoutmodalComponent } from './filing/change-log/timeoutmodal/timeoutmodal.component';
import { ReasonmodalComponent } from './filing/change-log/reasonmodal/reasonmodal.component';
import { ModalReasonComponent } from './filing/change-schedule/modal-reason/modal-reason.component';
import { PreApproveOtComponent } from './pre-approve-ot/pre-approve-ot.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PreApproveListComponent } from './pre-approve-list/pre-approve-list.component';
const routes: Routes = [
    {
        path: '',
        component: ManagementComponent,
        children: [
            {
                path: 'schedule',
                redirectTo: "schedule/",
                pathMatch: 'full'
            },
            {
              path: 'schedule',
              component: ScheduleComponent
            },
            {
              path: 'attendance',
              component: AttendanceComponent
            },
            {
                path: 'file-on-behalf',
                redirectTo: "file-on-behalf/",
                pathMatch: 'full'
            },
            {
              path: 'file-on-behalf',
              component: FilingComponent
            },
            {
                path: '',
                redirectTo: 'approval',
                pathMatch: 'full'
            },
            {
              path: 'approval',
              component: ApprovalComponent
            },
            {
                path: 'pre-approve-ot',
                redirectTo: 'pre-approve-ot/',
                pathMatch: 'full'
            },
            {
              path: 'pre-approve-ot/:id',
              component: PreApproveOtComponent
            },
            {
                path: 'pre-approve-list',
                redirectTo: 'pre-approve-list/',
                pathMatch: 'full'
            },
            {
              path: 'pre-approve-list',
              component: PreApproveListComponent
            },
        ]
    }
]


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule,
    MatChipsModule,
    MatSelectInfiniteScrollModule,
    ShiftsModule,
    MatRadioModule,
    DropdownCustomModule,
    DropdownEntitlementModule,
    EmployeeHierarchyModule,
    MatProgressBarModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
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
    CardTitleModule,
    MatTabsModule,
    MatPaginatorModule,
    MatListModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatToolbarModule,
    MatTreeModule,
    MatTooltipModule,
    ],


  declarations:[
        ManagementComponent,
        ScheduleComponent,
        AttendanceComponent,
        FilingComponent,
        ApprovalComponent,
        OfficialBusinessComponent,
        ChangeScheduleComponent,
        ChangeLogComponent,
        OvertimeComponent,
        OffsetComponent,
        UnpaidHoursComponent,
        CoeComponent,
        ModalDateRangeComponent,
        // ModalBeforeSavingComponent,
        ClModalBeforeSavingComponent,
        LeaveComponent,
        TimemodalComponent,
        TimeoutmodalComponent,
        ReasonmodalComponent,
        ApprovalReasonComponent,
        ModalReasonComponent,
        DissapproveReasonComponent,
        PreApproveOtComponent,
        PreApproveListComponent

    ]

})
export class ManagementModule { }
