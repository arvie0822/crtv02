import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent } from './datatable.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Route, RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { ActionButtonsModule } from '../action-buttons/action-buttons.module';
import { CdkTableModule } from '@angular/cdk/table';
import { FuseCardModule } from '@fuse/components/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { DropdownCustomModule } from '../dropdown-custom/dropdown-custom.module';
import {MatMenuModule} from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DropdownModule } from '../dropdown/dropdown.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropdownHierarchyModule } from '../dropdown-hierarchy/dropdown-hierarchy.module';
import { EmployeeHierarchyModule } from '../employee-hierarchy/employee-hierarchy.module';
import { PayrollRunComponent } from 'app/modules/payroll/payroll-run/payroll-run.component';
import { DialogDelModule } from 'app/layout/common/dialog-del/dialog-del.module';
import { DialogAddModule } from 'app/layout/common/dialog-add/dialog-add.module';
import { DialogVerifyModule } from 'app/layout/common/dialog-verify/dialog-verify.module';

const routes: Route[] = [
  {
      path     : '',
      component: DatatableComponent
  }
];

@NgModule({
  declarations: [
    DatatableComponent,
  ],
  imports     : [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    FormsModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    CdkTableModule,
    RouterModule.forChild(routes),
    FuseCardModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatSelectModule,
    DropdownCustomModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    MatTooltipModule,
    EmployeeHierarchyModule,
    DialogDelModule,
    DialogAddModule,
    DialogVerifyModule
],
exports     : [
  DatatableComponent,
]
})

export class DatatableModule { }
