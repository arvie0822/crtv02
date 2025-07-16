import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { DialogVerifyComponent } from './dialog-verify.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule } from 'ngx-mask'
import { FuseAlertModule } from '@fuse/components/alert';

@NgModule({
    declarations: [
        DialogVerifyComponent
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
        // ActionButtonsModule,
        FuseCardModule,
        MatDividerModule,
        MatCardModule,
        MatSelectModule,
        MatMomentDateModule,
        MatDatepickerModule,
        MatDialogModule,
        NgxMaskModule.forRoot(),
        FuseAlertModule,
    ],
    exports     : [
        DialogVerifyComponent
    ],
    entryComponents: [DialogVerifyComponent],
})
export class DialogVerifyModule{}
