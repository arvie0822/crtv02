import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { myData } from 'app/app.moduleId';

@Component({
  selector: 'app-card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.css']
})
export class CardTitleComponent implements OnInit {

  @Input()  title:     string
  @Input()  back:      boolean
  @Input()  return:    boolean = false
  @Input()  prev:      boolean = false
  @Input()  next:      boolean = false
  @Input()  sub:       boolean
  @Input()  switch:    boolean
  private lastLocationUrl: string = '';
  @Output() backTap:   EventEmitter<boolean>  = new EventEmitter<boolean>();
  @Output() prevTap:   EventEmitter<void> = new EventEmitter<void>();
  @Output() nextTap:   EventEmitter<void> = new EventEmitter<void>();
  @Output() returnTap: EventEmitter<string>  = new EventEmitter<string>();
  @Output() switchTap: EventEmitter<string>  = new EventEmitter<string>();
  @Output() submitTap: EventEmitter<string>  = new EventEmitter<string>();

  constructor(private router: Router, private _location: Location) {
  }

  ngOnInit() {
  }

  changeOrient(){
    this.switchTap.emit('')
  }

  backClicked(){
    this.backTap.emit(true)
    myData.backSave = true
    this._location.back();
  }

  prevClicked(){
    this.prevTap.emit()
  }

  nextClicked(){
    this.nextTap.emit();
  }

  submit(){
    this.submitTap.emit('')
  }

  returnClicked(){
    this.returnTap.emit('')
  }
}
