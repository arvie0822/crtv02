import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';

// code-mirror
import 'codemirror/lib/codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/vb/vb';

import * as CodeMirror from 'codemirror';
import { MatCardModule } from '@angular/material/card';
import { DropdownCustomModule } from 'app/core/dropdown-custom/dropdown-custom.module';
import { CardTitleModule } from 'app/core/card-title/card-title.module';
const codemirror = 'CodeMirror';
window[codemirror] = CodeMirror;

//old UI
// import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
// import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
// import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';
// // data-visualization
// import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
// import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';

// new UI
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min';
import { HdmfReportComponent } from './hdmf-report/hdmf-report.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'app/core/dropdown/dropdown.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReportViewCrtComponent } from './report-view-crt/report-view-crt.component';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DialogAddModule } from 'app/layout/common/dialog-add/dialog-add.module';
import { DialogDelModule } from 'app/layout/common/dialog-del/dialog-del.module';
import { ReportDetailsComponent } from './report-details/report-details.component';
import { EmployeeHierarchyModule } from 'app/core/employee-hierarchy/employee-hierarchy.module';
import { SharedModule } from 'app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropdownHierarchyModule } from 'app/core/dropdown-hierarchy/dropdown-hierarchy.module';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'report-view/:id',
        component: ReportViewComponent,
      },
      {
        path: 'report-view-crt/:id',
        component: ReportViewCrtComponent,
      }
    ]
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BoldReportViewerModule,
    MatCardModule,
    DropdownCustomModule,
    CardTitleModule,
    MatFormFieldModule,
    MatSelectModule,
    DropdownModule,
    MatButtonModule,
    MatIconModule,
    EmployeeHierarchyModule,
    DropdownHierarchyModule,
    //CRT
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatInputModule,
    DialogDelModule,
    DialogAddModule,
    //Upload
    SharedModule,// use this for NgModel issue provider instead of "ReactiveFormsModule",
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  declarations: [
    ReportsComponent,
    ReportViewComponent,
    HdmfReportComponent,
    ReportDetailsComponent,
    ReportViewCrtComponent,
  ],
  exports: [
    ReportsComponent,
    ReportViewComponent,
    ReportViewCrtComponent,
  ]
})
export class ReportsModule { }
