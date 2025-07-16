import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CardTitleComponent } from './card-title.component';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Route[] = [
  {
      path     : '',
      component: CardTitleComponent
  }
];

@NgModule({
  declarations: [
    CardTitleComponent,
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
    MatTooltipModule,

],
exports     : [
  CardTitleComponent,
]
})

export class  CardTitleModule { }
