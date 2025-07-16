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
import { CdkTableModule } from '@angular/cdk/table';
import { FuseCardModule } from '@fuse/components/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { DialogDelComponent } from './dialog-del.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaskModule } from 'ngx-mask'
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownCustomModule } from 'app/core/dropdown-custom/dropdown-custom.module';
// import { DropdownModule } from '../dropdown/dropdown.module';

@NgModule({
    declarations: [
        DialogDelComponent
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
        FuseCardModule,
        MatDividerModule,
        MatCardModule,
        MatSelectModule,
        MatMomentDateModule,
        MatDatepickerModule,
        MatDialogModule,
        NgxMaskModule.forRoot(),
        FuseAlertModule,
        // DropdownModule
        SharedModule,
        DropdownCustomModule
    ],
    exports     : [
        DialogDelComponent
    ],
    entryComponents: [DialogDelComponent],
})
export class DialogDelModule{}
