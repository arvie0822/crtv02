import { HrisComponent } from './hris.component';


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
import { MatTimepickerComponentDialogComponent } from 'mat-timepicker/lib/timepicker-dialog/timepicker-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';
import { DropdownCustomModule } from 'app/core/dropdown-custom/dropdown-custom.module';
import { DropdownEntitlementModule } from 'app/core/dropdown-entitlement/dropdown-entitlement.module';
import { EmployeeHierarchyModule } from 'app/core/employee-hierarchy/employee-hierarchy.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { E201Component } from './e201/e201.component';
import { NewHireRequirmentsComponent } from './e201/new-hire-requirments/new-hire-requirments.component';
import { WorkEducationalHistoryComponent } from './e201/work-educational-history/work-educational-history.component';
import { EmployeeRecordsComponent } from './e201/employee-records/employee-records.component';
import { LearningsComponent } from './e201/learnings/learnings.component';
import { CompanyAssetsComponent } from './e201/company-assets/company-assets.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { PreviousEmployerComponent } from './e201/previous-employer/previous-employer.component';
import { IncidentReportMemoComponent } from './e201/incident-report-memo/incident-report-memo.component';
import { EmployeeMovement } from 'app/model/employee/employee-detail';
import { EmployeeMovementComponent } from './e201/employee-movement/employee-movement.component';
import { AssignRequirmentsComponent } from './assign-requirments/assign-requirments.component';
import { E201ListViewComponent } from './e201-list-view/e201-list-view.component';
import { QuickEntryComponent } from './e201-list-view/quick-entry/quick-entry.component';


const routes: Routes = [
    {
        path: '',
        component: HrisComponent,
        children: [
            {
                path: 'assign-requirments',
                component: AssignRequirmentsComponent
            },
            {
                path: 'e201-list-view',
                component: E201ListViewComponent
            },
            {
                path: 'e201',
                component: E201Component
            },
            {
                path: 'quick-entry',
                component: QuickEntryComponent
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
    MatRadioModule,
    DropdownCustomModule,
    DropdownEntitlementModule,
    EmployeeHierarchyModule,
    EmployeeHierarchyModule,
    DragDropModule,
    CdkStepperModule

  ],
    declarations: [
        HrisComponent,
        E201Component,
        NewHireRequirmentsComponent,
        WorkEducationalHistoryComponent,
        EmployeeRecordsComponent,
        LearningsComponent,
        CompanyAssetsComponent,
        PreviousEmployerComponent,
        IncidentReportMemoComponent,
        EmployeeMovementComponent,
        AssignRequirmentsComponent,
        E201ListViewComponent,
        QuickEntryComponent
    ]
})
export class HrisModule { }
