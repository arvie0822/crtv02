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
import { ShiftsComponent } from './shifts.component';
import { ShiftCodesComponent } from '../shift-codes/shift-codes.component';
import { ShiftcodesperdayComponent } from '../shiftcodesperday/shiftcodesperday.component';
import { DatatableModule } from 'app/core/datatable/datatable.module';


const routes: Routes = [
  {
    path: '',
    component: ShiftsComponent,
    // children: [

    //   {
    //     path: 'shift-codes',
    //     redirectTo: "shift-codes/",
    //     pathMatch: 'full'
    //   },
    //   {
    //     path: 'shift-codes/:id',
    //     component: ShiftCodesComponent
    //   },
    //   {
    //   path: 'shiftcodesperday-detail',
    //   redirectTo: "shiftcodesperday-detail/",
    //   pathMatch: 'full'
    //  },
    //  {
    //   path: 'shiftcodesperday-detail/:id',
    //   component: ShiftcodesperdayComponent
    //  },
    //   {
    //     path: 'leave-detail',
    //     redirectTo: "leave-detail/",
    //     pathMatch: 'full'
    //   },
    //  ]
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
    DatatableModule

  ],
  declarations: [
    ShiftCodesComponent,
    ShiftcodesperdayComponent,
    ShiftsComponent,
  ]
})
export class ShiftsModule { }
