import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
// import { INITIAL_EVENTS, createEventId } from '../event-utils';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { forkJoin } from 'rxjs';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CoreService } from 'app/services/coreService/coreService.service';
import { presets ,enabled , custom } from 'app/model/dashboard.model'
import { TimekeepingService } from 'app/services/timekeepingService/timekeeping.service';
import { GenerateDetailedComponent } from 'app/modules/employee/employee-setup/timekeeping-generation/generate-detailed/generate-detailed.component';
import { DateRange } from "@angular/material/datepicker";
import { PayrollService } from 'app/services/payrollService/payroll.service';
import { DropdownRequest } from 'app/model/dropdown.model';
import { Router } from '@angular/router';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GF } from 'app/shared/global-functions';

const applications: any[] = [];

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  calendarVisible = true;
  class: string
  dropdownRequest = new DropdownRequest
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    // contentHeight: 'auto',
    height: '100%',
    initialView: 'dayGridMonth',
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    displayEventTime: false,
    eventStartEditable: false,
    select: this.handleDateSelect.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    // eventsSet: this.handleEvents.bind(this),
    customButtons: {
      prev: {
        text: '<',
        click: this.getEventsByMonthBefore.bind(this)
      },
      next: {
        text: '>',
        click: this.getEventsByMonthAfter.bind(this, this)
      }
    },
    
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  currentEvents: EventApi[] = [];
  pipe = new DatePipe('en-US');

  //filter data
  presets = presets
  enabled = enabled
  custom = custom

  isCustom = false
  filingType = 0
  status = "0"
  timeRecord = {
    tarHours: "0",
    paidDays: "0",
    undHours: "0",
    AbsHours: "0"
  }
  selectedDateRange = ""
  filters = [
    {
      type: "custom",
      class: "AS",
      dateFrom: GF.IsEmpty(sessionStorage.getItem("s")) ? null : new Date(sessionStorage.getItem("s")),
      dateTo: GF.IsEmpty(sessionStorage.getItem("e")) ? null : new Date(sessionStorage.getItem("e")),
      filingType: 0, status: "0", year: 0, month: "", cutoff: 0, payout: ""
    },
    { type: "custom",class: "CTK", dateFrom: null, dateTo: null, filingType: 0, status: "0", year: 0, month: "", cutoff: 0, payout: "" },
    { type: "custom",class: "ATK", dateFrom: null, dateTo: null, filingType: 0, status: "0", year: 0, month: "", cutoff: 0, payout: "" },
    { type: "custom",class: "PAY", dateFrom: null, dateTo: null, filingType: 0, status: "0", year: 0, month: "", cutoff: 0, payout: "" },
]
  app_status = []
  announcements = []
  annIndex = 0
  loginId = 0
  @ViewChild('calendar') fc: FullCalendarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dialogRef: MatDialogRef<GenerateDetailedComponent, any>;
  displayedColumns: string[] = ['code', 'status'];
  dataSource = new MatTableDataSource<any>(applications);
  isHovered = false

  application = "/Employee/Application Status"
  employeeAlert = "/Widgets/Employee Alerts"
  parentDetails: any = { widgets: true}

  constructor(
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    private tenantService: TenantService,
    private core: CoreService,
    private timekeepingService: TimekeepingService,
    private payrollService: PayrollService,
    private router: Router,
    private storage: StorageServiceService,
    private sanitizer: DomSanitizer,
    ) { }

  ngOnInit() {
    sessionStorage.setItem("reportPath","")
    var id = [sessionStorage.getItem("u")]

    this.core.encrypt_decrypt(false,id)
    .subscribe({
      next: (value: any) => {
        this.loginId = Number(value.payload[0])
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
      }
    });
  }

  autoplay(){
    setInterval(() => {
      if (!this.isHovered) {
        this.controls('next')
      }
    }, 5000);
  }

  controls(e){
    var max = (this.announcements.length-1)
    if (e == 'next') {
      if (this.annIndex == max) {
        this.annIndex = 0
      } else {
        this.annIndex++
      }
    } else {
      if (this.annIndex == 0) {
        this.annIndex = max
      } else {
        this.annIndex--
      }
    }
  }

  loadAnnouncement(){
    var tid = ""
    this.tenantService.getAnnouncements(tid)
    .subscribe({
      next: (value: any) => {
        this.announcements = this.core.shuffleArray(value.payload)
        this.announcements.forEach(async (news) => {
          news.type = news.image.split(".")[1].toUpperCase()
          news.contents = news.image
          news.name = news.image
          try {
            await this.previewimage("uploadFile1-"+news.image, news.id, 74, news, false);
          } catch (error) {
            // Handle any errors here if needed
          }
        });
        

      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
      }
    });
  }

  loadAppStatus(){
    var filtered = this.filters.find(x=>x.class=="AS")
    var tid = ""
    var date = this.dateFilter(filtered)
    var df = date.df// this.pipe.transform(filtered.dateFrom,"yyyy-MM-dd")
    var dt = date.dt//this.pipe.transform(filtered.dateTo,"yyyy-MM-dd")
    var type = filtered.filingType
    var status = filtered.status
    this.tenantService.getApplicationStatus(tid, df, dt, type , status)
    .subscribe({
      next: (value: any) => {
        this.dataSource.data = value.payload
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
      }
    });
  }

  loadTimeRecord(){
    var tid = ""
    var df = ""
    var dt = ""
    this.tenantService.getTimeRecord(tid, df, dt)
    .subscribe({
      next: (value: any) => {
        // this.timeRecord = value.payload
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
      }
    });
  }

  loadCalendar(df, dt){
    var tid = ""
    let calendarApi = this.fc.getApi();
    forkJoin({
      calendar: this.tenantService.getDashboardCalendar(tid, df, dt),
    }).subscribe({
      next: (value: any) => {
        calendarApi.removeAllEventSources()
        calendarApi.addEventSource(value.calendar.payload)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
      }
    });
  }

  loadCurrentTK(){
    var filtered = this.filters.find(x=>x.class=="CTK")
    var date = this.dateFilter(filtered)
    var df = date.df
    var dt = date.dt

    var obj = {
      dateFrom: df,
      dateTo: dt,
      subCompany: [0],
      branch: [0],
      category: [0],
      department: [0],
      confidential: [0],
      status: [0],
      employee: [this.loginId],
      includeInactive: true,
      timekeepingType: 1,
      timekeepingFinalEmployee: []
    }
    this.timekeepingService.generateTimekeeping(obj).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          this.open(value.payload,df,dt);
        }
        else {
          console.log(value.stackTrace)
          console.log(value.message)
        }
      },
      error: (e) => {
        console.error(e)
      }
    });
  }

  async loadDropdown() {
    try {
      const value = await new Promise((resolve, reject) => {
        this.payrollService.getPayoutPayslipDropdown(this.dropdownRequest).subscribe({
          next: (data: any) => resolve(data),
          error: (e) => reject(e)
        });
      });
  
      if (value["statusCode"] === 200) {
        // return value["payload"]
      } else {
        console.log(value["stackTrace"]);
        console.log(value["message"]);
      }

      return value
    } catch (error) {
      console.error(error);
      throw error
    }
    // return []
  }

  loadPayslip(){
    var filtered = this.filters.find(x=>x.class=="PAY")
    var date = this.dateFilter(filtered)
    var custom = this._custom()
    debugger

    sessionStorage.setItem("payrollCode",custom[0]._value.toString())
    sessionStorage.setItem("payoutDate",custom[0].option.find(x=>x.dropdownID == custom[0]._value.toString()).payoutDate)
    sessionStorage.setItem("isDashboardView", 'true')
    sessionStorage.setItem("reportPath","/Payslip Shared DS/payslip_master_shared_datasource v2")
    this.router.navigate(['/detail/report-view/payslip-view']);
  }

  open(TKCache,df, dt) {
    var element = {
      dateFrom: df,
      dateTo: dt,
      subCompany: [0],
      branch: [0],
      category: [0],
      department: [0],
      confidential: [0],
      status: [0],
      employee: [this.loginId],
      includeInactive: true,
      cache: TKCache,
      timekeepingType: 1,
      payrollCutoff: 0,
      year: 0,
      month: 0,
      cutoff: 0
    }
    var obj = {
      type: "generate-view",
      props: element
    }
    this.dialogRef = this.dialog.open(GenerateDetailedComponent, {
      width: '100%', height: '80%',
      panelClass: 'app-dialog',
      data: obj
    });
  }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.loadAppStatus()
      this.loadAnnouncement()
      this.autoplay()

      this.fc?.getApi().updateSize();
      let calendarApi = this.fc?.getApi();
      const start = this.pipe.transform(new Date(calendarApi.view.activeStart),"yyyy-MM-dd")
      const end = this.pipe.transform(new Date(calendarApi.view.activeEnd),"yyyy-MM-dd")

      this.loadCalendar(start, end)
  }

  getEventsByMonthBefore(){
    let calendarApi = this.fc?.getApi();
    calendarApi.prev()
    const start = this.pipe.transform(new Date(calendarApi.view.activeStart),"yyyy-MM-dd")
    const end = this.pipe.transform(new Date(calendarApi.view.activeEnd),"yyyy-MM-dd")

    this.loadCalendar(start, end)
  }

  getEventsByMonthAfter(){
    let calendarApi = this.fc?.getApi();
    calendarApi.next()
    const start = this.pipe.transform(new Date(calendarApi.view.activeStart),"yyyy-MM-dd")
    const end = this.pipe.transform(new Date(calendarApi.view.activeEnd),"yyyy-MM-dd")

    this.loadCalendar(start, end)
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }

  handleEventClick(clickInfo: EventClickArg) {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  activate(css) {
    this.class = css
    if (css == "AS" || css == "TR") {
      const imageBox = document.querySelector('.'+css);
      imageBox.classList.toggle('active');
    }
    this.selectedDateRange = ""
    this._options()
  }

  _presets(){
    if  (typeof this.class !== 'string') {
      return
    }
    var preset = this.presets.find(x=>x.class==this.class)
    var enabled = this.enabled.filter(x=>preset.enabled.includes(x.id))
    return enabled
  }

  _custom(){
    if  (typeof this.class !== 'string') {
      return
    }

    var preset = this.presets.find(x=>x.class==this.class)
    var custom = this.custom.filter(x=>x.id == preset.id)
    return custom
  }

  _options(){
    this._custom().forEach(op => {
     //application status
      if (op.key == "type") {
        var type = [
          { dropdownID: 0, description: "All" },
          { dropdownID: 32, description: "Change Schedule" },
          { dropdownID: 33, description: "Change Log" },
          { dropdownID: 34, description: "Leave " },
          { dropdownID: 35, description: "Official Business " },
          { dropdownID: 36, description: "Overtime " },
          { dropdownID: 37, description: "Offset " },
          { dropdownID: 52, description: "COE " },
          { dropdownID: 64, description: "Unpaid Break " },
        ]
        op.option = type
      }
      if (op.key == "status") {
        var status = [
          { dropdownID: 0, description: "All" },
          { dropdownID: "Approved" ,    description: "Approved" },
          { dropdownID: "Disapproved" , description: "Disapproved" },
          { dropdownID: "Cancelled" ,   description: "Cancelled" }
        ]
        op.option = status
      }
      //adjustment TK
      if (op.key == "year") {
        var year = [{ dropdownID: 0, description: "All" }]
        for (let idx = 2022; idx < 2027; idx++) {
          year.push({ dropdownID: idx, description: idx+""})
        }
        op.option = year
      }
      if (op.key == "month") {
        var month = [
          { dropdownID: 0, description: "All" },
          { dropdownID: "1" ,    description: "January" },
          { dropdownID: "2" ,    description: "February" },
          { dropdownID: "3" ,    description: "March" },
          { dropdownID: "4" ,    description: "April" },
          { dropdownID: "5" ,    description: "May" },
          { dropdownID: "6" ,    description: "June" },
          { dropdownID: "7" ,    description: "July" },
          { dropdownID: "8" ,    description: "August" },
          { dropdownID: "9" ,    description: "September" },
          { dropdownID: "10" ,    description: "October" },
          { dropdownID: "11" ,    description: "November" },
          { dropdownID: "12" ,    description: "December" },
        ]
        op.option = month
      }
      if (op.key == "cutoff") {
        var cutoff = [
          { dropdownID: 0, description: "All" },
          { dropdownID: "1" ,    description: "First Cut-Off" },
          { dropdownID: "2" ,    description: "Second Cut-Off" },
        ]
        op.option = cutoff
      }
      if (op.key == "payout") {
        this.loadDropdown().then((value:any) => {
          op.option = value.payload.map(item=>({
            dropdownID: item.payrollCode,
            description: item.payoutDate+" - "+item.payrollType,
            payoutDate: item.payoutDate
          }))
        });
      }
    });
  }
  

  isDisabled(t,c){
    return this.filters.some(x=>x.type==t&&x.class==c)
  }

  showCustom(t,c){
    return this.filters.some(x=>x.type==t&&x.class==c)
  }

  setValue(c,s){
    return this.filters.find(x=>x.class==c)[s]
  }

  getCF(){
    if  (typeof this.class !== 'string') {
      return
    }
    return this.filters.find(x=>x.class==this.class)?.type.toUpperCase() || ""
  }

  filter(d,c){
    var arr = this.filters.filter(x=>x.class!==c)
    this.filters = arr
    var idx = this.filters.findIndex(x=>x.type==d&&x.class==c)
    if (idx > -1) {
      this.filters[idx].type = d
      this.filters[idx].class = c
    } else {
      this.filters.push({
        type: d,
        class: c,
        dateFrom: null,
        dateTo: null,
        filingType: 0,
        status: "0",
        year: 0,
        month: "",
        cutoff: 0,
        payout: ""
      })
    }
    
    // this.filters.type = d
    // var clss = ".icon-"+this.class
    // const icon = document.querySelector(clss);
    // icon.classList.toggle('active');

    this.loadAppStatus();
  }

  setDateRange(e,c){
    var idx = this.filters.findIndex(x=>x.class==c)
    if (idx > -1) {
      this.filters[idx].dateFrom = e.start
      this.filters[idx].dateTo = e.end
      var start = this.pipe.transform(e.start,"MMM dd, yyyy")
      var end = this.pipe.transform(e.end,"MMM dd, yyyy")
      this.selectedDateRange = start +" - "+ (end==null?"Select End":end)
    }
  }

  setDropdown(c,se){
    if  (typeof this.class !== 'string') {
      return
    }

    var idx = this.filters.findIndex(x => x.class == c)
    if (idx > -1) {
      this.filters[idx].filingType = se.key=="type"    ? se._value : this.filters[idx].filingType
      this.filters[idx].status     = se.key=="status"  ? se._value : this.filters[idx].status
      this.filters[idx].year       = se.key=="year"    ? se._value : this.filters[idx].year
      this.filters[idx].month      = se.key=="month"   ? se._value : this.filters[idx].month
      this.filters[idx].cutoff     = se.key=="cutoff"  ? se._value : this.filters[idx].cutoff
      this.filters[idx].payout     = se.key=="cutoff"  ? se._value : this.filters[idx].payout
    }
  }

  search(c) {
    var idx = this.filters.findIndex(x => x.class == c)
    if (idx > -1) {
      if (c == "AS") {
        this.loadAppStatus()
      } else if (c == "TR") {

      } else if (c == "CTK") {
        this.loadCurrentTK()
      } else if (c == "ATK") {

      } else if (c == "PAY") {
        this.loadPayslip()
      }

    }
  }

  dateFilter(filter){
    var obj = {df:'',dt:''}
    var today = new Date();
    var type = filter.type
    if (type == 'today') {
      obj.df = this.pipe.transform(today,"yyyy-MM-dd")
      obj.dt = this.pipe.transform(today,"yyyy-MM-dd")
    } else if (type == 'week') {
      var startOfWeek = new Date(today);
      var endOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
      obj.df = startOfWeek.toISOString().slice(0, 10);
      obj.dt = endOfWeek.toISOString().slice(0, 10);
    } else if (type == 'cutoff') {
      obj.df = this.pipe.transform(new Date(sessionStorage.getItem("s")),"yyyy-MM-dd")
      obj.dt = this.pipe.transform(new Date(sessionStorage.getItem("e")),"yyyy-MM-dd")
    } else if (type == 'month') {
      var startOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
      var endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      obj.df = startOfMonth.toISOString().slice(0, 10);
      obj.dt = endOfMonth.toISOString().slice(0, 10);
    } else {
      obj.df = this.pipe.transform(filter.dateFrom,"yyyy-MM-dd")
      obj.dt = this.pipe.transform(filter.dateTo,"yyyy-MM-dd")
    }
    return obj
  }

  //News And Announcement code
  private async previewimage(e, t, m, news, isDL): Promise<any> {
    try {
      const response: any = await this.storage.fileDownload(e, t, m).toPromise();
      if (isDL) {
        this.core.downloadExcelBlob(response, e.split("1-")[1])
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          news.image = this.sanitizer.bypassSecurityTrustResourceUrl(base64data);
        };
        reader.readAsDataURL(response);
        return news; // Return the modified news object
      }
    } catch (error) {
      console.error('Error in previewimage:', error);
      throw error; // Rethrow the error for proper error handling
    }
  }

  isImage(type){
    return  type == 'PDF' || type == 'DOCX' || type == 'DOC' || type == 'XLS' || type == 'TXT' || type == 'XLSX' 
  }

  onMouseEnter() {
    this.isHovered = true;
    this.checkHoverState();
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  checkHoverState() {
    if (this.isHovered) {
      requestAnimationFrame(() => this.checkHoverState()); // Check continuously
    }
  }

  download(ii){
    this.previewimage("uploadFile1-"+ii.name, ii.id, 74, null, true)
  }

  get news(){
    return this.announcements[this.annIndex]
  }
  //End
}

