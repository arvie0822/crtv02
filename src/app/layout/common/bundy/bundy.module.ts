import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BundyComponent } from './bundy.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
  ],
  declarations: [BundyComponent],
  exports : [BundyComponent]
})
export class BundyModule { }
