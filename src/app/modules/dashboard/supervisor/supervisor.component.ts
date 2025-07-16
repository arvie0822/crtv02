import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/services/coreService/coreService.service';
import { TenantService } from 'app/services/tenantService/tenant.service';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit {

  ISAlert  = "/Widgets/Supervisor Alerts"
  empBday = "/Widgets/Employee Birthdays"
  todayEmpStatus = "/Widgets/Todays Employee Status"
  leaveCalendar = "/Widgets/Leave Calendar"
  parentDetails: any = {}
  announcements = []
  annIndex = 0
  is = (sessionStorage.getItem('is') == "true")
  constructor(private tenantService: TenantService, private core: CoreService,private router: Router,) {
    this.parentDetails.widgets  = true
   }

  ngOnInit() {
    if (!this.is) {
      this.router.navigate(['/dashboard/employee']);
    }
  }

  ngAfterViewInit() {
    this.loadAnnouncement()
  }

  loadAnnouncement(){
    var tid = ""
    this.tenantService.getAnnouncements(tid)
    .subscribe({
      next: (value: any) => {
        this.announcements = this.core.shuffleArray(value.payload)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
      }
    });
  }

}
