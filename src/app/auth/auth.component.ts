import { Component, OnInit } from '@angular/core';
import Gleap from 'gleap';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {

  constructor() { 
    Gleap.showFeedbackButton(false);
  }

  ngOnInit() {
  }

}
