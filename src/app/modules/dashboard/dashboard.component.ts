import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import Gleap from 'gleap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  

  constructor() {
    Gleap.showFeedbackButton(true);
  }

  ngOnInit(): void {
    
  }

}
