import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
// import { CarouselModule } from '@coreui/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DashboardComponent } from './dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { DateRangePickerModule } from './date-range-picker/date-range-picker.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReportsModule } from '../reports/reports.module';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CrtComponent } from './crt/crt.component';

const dashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent,
        children: [
            {
                path: '',
                component: CrtComponent
            },
            {
                path: 'employee',
                component: CrtComponent
            }
            // {
            //     path: 'supervisor',
            //     component: SupervisorComponent
            // }
        ]
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        EmployeeComponent,
        DateRangePickerComponent,
        SupervisorComponent,
        CrtComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(dashboardRoutes),
        FullCalendarModule, // register FullCalendar with your app
        // CarouselModule
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        DateRangePickerModule,
        MatInputModule,
        MatFormFieldModule,
        //table required
        MatTableModule,
        MatPaginatorModule,
        // ReportsModule,
        MatTooltipModule,
    ]
})
export class DashboardModule
{
}
