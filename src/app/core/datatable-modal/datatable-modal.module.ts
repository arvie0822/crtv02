import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableModalComponent } from './datatable-modal.component';
import { Route, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkTableModule } from '@angular/cdk/table';
import { FuseCardModule } from '@fuse/components/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { CrudModalComponent } from './crud-modal/crud-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DropdownModule } from '../dropdown/dropdown.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MonthDateComponent } from './crud-modal/dateformat/month-date/month-date.component';
import { CrudTableComponent } from './crud-table/crud-table.component';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { DropdownCustomModule } from '../dropdown-custom/dropdown-custom.module';
import { CardTitleModule } from '../card-title/card-title.module';
import { MatMenuModule } from '@angular/material/menu';
import { EmployeeHierarchyModule } from '../employee-hierarchy/employee-hierarchy.module';
import { DropdownHierarchyModule } from '../dropdown-hierarchy/dropdown-hierarchy.module';

const routes: Route[] = [
    {
        path: '',
        component: DatatableModalComponent
    },
];

@NgModule({
    imports: [
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
        MatDialogModule,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        DropdownModule,
        MatSlideToggleModule,
        MatTimepickerModule,
        MatSelectModule,
        DropdownCustomModule,
        MatMenuModule,
        EmployeeHierarchyModule,
        DropdownHierarchyModule
    ],
    exports: [
        DatatableModalComponent,
        CrudModalComponent,
        MatDialogModule
    ],
    declarations: [
        DatatableModalComponent,
        CrudModalComponent,
        MonthDateComponent,
        CrudTableComponent
    ]
})
export class DatatableModalModule { }
