import { Component, OnInit } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { AttendanceService } from 'app/services/attendanceService/attendance.service';

@Component({
  selector: 'app-bundy',
  templateUrl: './bundy.component.html',
  styleUrls: ['./bundy.component.css'],
})
export class BundyComponent implements OnInit {
  ishide = true
  bundyy: string = ''
  failedMessage = {...FailedMessage}
  saveMessage = {...SaveMessage}
  successMessage = {...SuccessMessage}
  constructor(
    private message: FuseConfirmationService,
    private attendanceService: AttendanceService) { }

  ngOnInit() {
  }

  bundy(bundy) {
    debugger
    const message = bundy == 0 ? "Clock In" : "Clock Out"
    this.saveMessage.message = "Are you sure you want to " + message + "?"
    const dialogRef = this.message.open(this.saveMessage);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.bundyy = message
        const obj = {
          "bundy": bundy,
          "bundyType": 0
        }

        this.attendanceService.postBundy(obj).subscribe({
          next: (value: any) => {
            if (value.statusCode == 200) {

              this.successMessage.message = value.message
              this.successMessage.title = message
              this.message.open(this.successMessage);
            }
          },
          error: (e) => {
            this.message.open(this.failedMessage);
            console.error(e)
          }
        });
      }
    });

  }
}
