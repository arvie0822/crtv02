import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LayoutComponent } from 'app/layout/layout.component';
import { CoreService } from 'app/services/coreService/coreService.service';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss']
})
export class SessionTimeoutComponent implements OnInit {

  @ViewChild(LayoutComponent) layout: LayoutComponent;

  @Output() btnLogout = new EventEmitter<void>();
  @Output() btnStay = new EventEmitter<void>();

  constructor(public dialogRef: MatDialogRef<SessionTimeoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private core: CoreService) { }

  ngOnInit(): void {
    this.core.currentIdleState.subscribe((idleState) => {
      this.data = idleState;
    });
  }

  logout(){
    this.btnLogout.emit()
  }

  stay(){
    this.btnStay.emit()
  }
}
