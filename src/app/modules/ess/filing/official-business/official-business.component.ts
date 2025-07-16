import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { leaveForm, OfficialBusiness, OffsetMonitoring } from 'app/model/administration/filing';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { FilingService } from 'app/services/filingService/filing.service';

// ==========import for format of date ==========================================
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS, } from '@angular-material-components/datetime-picker';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { MasterService } from 'app/services/masterService/master.service';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { forkJoin } from 'rxjs';
import _ from 'lodash';
import { myData } from 'app/model/app.moduleId';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { CoreService } from 'app/services/coreService/coreService.service';


// =================== For date time picker ============================
export const MOMENT_DATETIME_WITH_SECONDS_FORMAT = 'MM-DD-YY hh:mm A';
const CUSTOM_MOMENT_FORMATS: NgxMatDateFormats = {
    parse: {
        dateInput: MOMENT_DATETIME_WITH_SECONDS_FORMAT,
    },
    display: {
        dateInput: MOMENT_DATETIME_WITH_SECONDS_FORMAT,
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: MOMENT_DATETIME_WITH_SECONDS_FORMAT,
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


// =================== For date picker ============================
const DATE_FORMAT = 'MM-DD-yyyy';
export const MY_FORMATS = {
    parse: {
        dateInput: DATE_FORMAT,
    },
    display: {
        dateInput: DATE_FORMAT,
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: DATE_FORMAT,
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


@Component({
    selector: 'app-official-business',
    templateUrl: './official-business.component.html',
    styleUrls: ['./official-business.component.css'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        // ============= For date picker =============
        {
            provide: MAT_DATE_FORMATS,
            useValue: MY_FORMATS,
        },
        // ============= For date time picker =============
        {
            provide: NGX_MAT_DATE_FORMATS,
            useValue: CUSTOM_MOMENT_FORMATS,
        },

    ],
})
export class OfficialBusinessComponent implements OnInit {
    @ViewChild('OBTable') OBTable: MatTable<any>;
    @Input() datasource: any
    @Input() selectedemployee: any
    @Output() pushEvent = new EventEmitter<any>();
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = true;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color = 'color';
    leaveForm: FormGroup
    officialBForm: FormGroup
    imageUrl: any
    isSave: boolean = false
    datetodisabled: boolean = true
    id: string
    maxs : any
    mins : any
    editing = false;
    index = 0
    pipe = new DatePipe('en-US');
    disabledbutton: boolean = false
    tid: any
    dropdownRequest = new DropdownRequest
    dropdownOptions = new DropdownOptions
    purpose: any
    saveMessage = { ...SaveMessage}
    late : boolean = false
    official = [
        { id: 1, description: 'Client meeting' },
        { id: 2, description: 'Training' },
        { id: 3, description: 'Offsite meeting' },
        { id: 4, description: 'Team building' },
        { id: 5, description: 'Official travel' },
        { id: 6, description: 'Branch Office' },
        { id: 7, description: 'Others' },
    ]
    OBSource = [];
    OSource: OffsetMonitoring[] = [{
        // include_expired: '',
        overtime_code: 'OT-001',
        overtime: '120',
        offset_used: '30',
        offset_field: '60',
        available: '30',
        expiration: '12/31/2022',
    }];
    failedMessage = { ...FailedMessage }
    obColumns: string[] = ['action', 'date', 'dateTimeFrom', 'dateTimeTo', 'reason', 'location', 'remarks', 'uploadFile', 'status'];
    filename: ""
    imagefiless : any = []
    moduleId: any
    fileExtension: string | undefined;
    loginId = 0
    idsimage
    constructor(private fb: FormBuilder, private message: FuseConfirmationService,
        private route: ActivatedRoute,
        private adapter: DateAdapter<any>,
        private router: Router,
        private tenantService: TenantService,
        private masterService: MasterService,
        private filingService: FilingService,
        private storageServiceService : StorageServiceService,
        private coreService : CoreService
        ) { }
    get ob() {
        return this.officialBForm.value
    }


    ngOnInit() {

        var action = sessionStorage.getItem("action")
        this.moduleId = "35"
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id !== "") {
            if (action == "edit") {
                this.disabledbutton = false
                this.filingService.getOfficialBusiness(this.id).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {

                            this.datasource.push({

                                action: [{ id: value.payload.action }],
                                dates: [{ id: this.pipe.transform(value.payload.date, "yyyy-MM-dd"), disabled: true }],
                                date: [{ id: this.pipe.transform(value.payload.date, "yyyy-MM-dd"), disabled: true }],
                                timeFrom: [{ id: this.pipe.transform(value.payload.timeFrom, "yyyy-MM-ddTHH:mm:ss"), disabled: true }],
                                timeTo: [{ id: this.pipe.transform(value.payload.timeTo, "yyyy-MM-ddTHH:mm:ss"), disabled: true }],
                                reasonId: [{ id: value.payload.reasonId, disabled: true }],
                                location: [{ id: value.payload.location, disabled: true }],
                                reason: [{ id: value.payload.reason, disabled: true }],
                                uploadPath: [{ id: value.payload.uploadPath, disabled: true }],
                                status: [{ id: value.payload.status, disabled: true }],
                                disable: [{ id: true, disabled: true }],
                                officialBusinessId: [{ id: value.payload.officialBusinessId, disabled: true }],
                                employeeId: value.payload.employeeId,
                                disabled: true,
                                encryptedId: value.payload.encryptedId,

                            })
                            this.OBTable.renderRows()
                            this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 138 })
                            this.initData()

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
            } else if (action == "view") {
                this.disabledbutton = true
                this.officialBForm.disable()
                this.filingService.getOfficialBusiness(this.id).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.datasource.push({

                                dates: this.pipe.transform(value.payload.date, "MM-dd-yyyy"),
                                date: new Date(value.payload.date),
                                timeFrom: new Date(value.payload.timeFrom),
                                timeTo: new Date(value.payload.timeTo),
                                reasonId: value.payload.reasonId,
                                location: value.payload.location,
                                reason: value.payload.reason,
                                uploadPath: value.payload.uploadPath,
                                status: value.payload.status,
                                officialBusinessId: value.payload.officialBusinessId,
                                employeeId: value.payload.employeeId,
                                disable: true

                            })
                            this.OBTable.renderRows()
                            this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 138 })
                            this.initData()
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
        } else {

            this.datasource.forEach(ele => {
                if (ele.status[0].id == '') {
                    ele.dates[0].disabled = true
                    ele.reasonId[0].disabled = false
                    ele.reason[0].disabled = false
                    ele.location[0].disabled = false
                    ele.timeFrom[0].disabled = false
                    ele.timeTo[0].disabled = false
                    ele.status[0].disabled = false
                    ele.uploadPath[0].disabled = false
                }
                this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 138 })
                this.initData()

            });

        }
    }

    async initData() {
        try {
            let value = await new Promise((resolve, reject) => {
                this.tenantService.getDropdown(this.dropdownRequest).subscribe({
                    next: (data: any) => resolve(data),
                    error: (e) => reject(e)
                });
            });

            this.dropdownOptions.purposedef = _.uniqBy(value['payload'].filter(x => x.dropdownTypeID == 138), JSON.stringify)

            console.log('1')
            console.log(value)
            console.log(this.dropdownOptions.purposedef)

        } catch (error) {
            console.error(error);
            throw error
        }

    }

    async uploadFile(event, id,names,i,x) {
        this.datasource[i].uploadPath[x].id = event.target.files[0].name;
        console.log(this.datasource[0].uploadPath.id)
        let fileName = event.target.files[0].name;
        this.fileExtension = this.getFileExtension(fileName);
        var namefile =  this.fileExtension

        const fileToUpload0 = event.target.files[0];
        const name = fileToUpload0.name;

        let reduce: File;

        console.log(1)
        if (namefile == "jpg" || namefile == "png") {
            try {
            reduce = await this.reduceImageSize(fileToUpload0, 50 * 1024 , 0.8);
        console.log(2)

            } catch (error) {
            console.error('Error reducing image size:', error);
            return; // If an error occurs, you might want to handle it accordingly.
            }
        }else{
            reduce = fileToUpload0

        }
        const renamedFile = new File([reduce], name, { type: reduce.type });
        if (this.imagefiless.some((x) => x.index == i)) {
            const idx = this.imagefiless.findIndex((x) => x.index == i);
            this.imagefiless[idx].files = reduce;
            this.imagefiless[idx].isupload = true;
        } else {
            const renamedFile = new File([reduce], name, { type: reduce.type });
            var inx = this.imagefiless.length == 0 ? 0 : this.imagefiless.length -1
            for (let index = inx; index <= i ; index++) {
                var isup = index == i? true : false
                this.imagefiless.push({
                    index: index,
                    files: renamedFile,
                    isupload : isup
                });
            }

        }

       myData.fileimage = _.uniqBy([...this.imagefiless ], JSON.stringify)
       var sample = myData.fileimage
       console.log(this.imagefiless)
    }

    getFileExtension(fileName: string): string {
        // Use regex to extract the file extension from the file name
        const match = /\.([0-9a-z]+)(?:[\?#]|$)/i.exec(fileName);
        if (match && match[1]) {
            return match[1].toLowerCase(); // Convert to lowercase if needed
        } else {
            return 'Unknown';
        }
    }

    async reduceImageSize(file: File, maxSizeInBytes: number, quality: number): Promise<File> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function (event: ProgressEvent<FileReader>) {
                const image = new Image();

                image.onload = function () {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const originalWidth = image.width;
                    const originalHeight = image.height;
                    let resizedWidth = originalWidth;
                    let resizedHeight = originalHeight;

                    // Calculate the new width and height to fit the desired file size
                    while (file.size > maxSizeInBytes && resizedWidth > 10 && resizedHeight > 10) {
                        resizedWidth *= 0.9;
                        resizedHeight *= 0.9;

                        canvas.width = resizedWidth;
                        canvas.height = resizedHeight;

                        context.clearRect(0, 0, resizedWidth, resizedHeight);
                        context.drawImage(image, 0, 0, resizedWidth, resizedHeight);

                        file = dataURLtoFile(canvas.toDataURL(file.type, quality), file.name);
                    }
                    resolve(file);
                };

                image.src = event.target?.result as string;
            };

            reader.readAsDataURL(file);

            function dataURLtoFile(dataURL: string, fileName: string): File {
                const arr = dataURL.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }

                return new File([u8arr], fileName, { type: mime });
            }
        });
    }

    obDelete(i, x): void {

        if (x !== 0) {
            this.datasource[i].action.splice(x, 1);
            this.datasource[i].timeTo.splice(x, 1);
            this.datasource[i].dates.splice(x, 1);
            this.datasource[i].date.splice(x, 1);
            this.datasource[i].timeFrom.splice(x,1);
            this.datasource[i].reasonId.splice(x,1);
            this.datasource[i].location.splice(x,1);
            this.datasource[i].reason.splice(x,1);
            this.datasource[i].status.splice(x,1);
            this.datasource[i].uploadPath.splice(x,1);
            this.datasource[i].status.splice(x,1);
            this.datasource[i].disable.splice(x,1);
            this.datasource[i].officialBusinessId.splice(x,1);

        } else {
            this.datasource.splice(i, 1);

        }
        this.OBTable.renderRows();
    }


    public async submit(e) {

        var final = [];
        var fl = []
        e.forEach(ems => {
            var keys = Object.keys(ems);
            var maxLength = Math.max(...keys.map(key => Array.isArray(ems[key]) ? ems[key].length : 1));

            for (var i = 0; i < maxLength; i++) {
                var obj = {};
                keys.forEach(key => {

                    if (Array.isArray(e[0][key])) {
                        obj[key] = key == "timeFrom" || key == "timeTo" ? this.pipe.transform(ems[key][i].id, "yyyy-MM-ddTHH:mm") : ems[key][i].id;
                    }
                    else {
                        obj[key] = key == "timeFrom" || key == "timeTo" ? this.pipe.transform(ems[key], "yyyy-MM-ddTHH:mm") : ems[key];
                    }
                });
                final.push(obj);
            }
        });

        var ds = final.map(x => ({
            action: x.action,
            date: x.date,
            dates: x.dates,
            disabled: x.disabled,
            encryptedId: x.encryptedId,
            location: x.location,
            reason: x.reason,
            reasonId: x.reasonId,
            status: x.status,
            timeFrom: x.timeFrom,
            timeTo: x.timeTo,
            uploadPath: x.uploadPath,
            disable: x.disable,
            officialBusinessId: x.officialBusinessId,
            employeeId: x.employeeId,

        }))

        var save = ds.filter(x => x.status != "Approved" && x.disable == false && x.reasonId != 0 && x.location != '')

        if (save.length == 0) {
            this.failedMessage.title = "Warning!"
            this.failedMessage.message = "All fields is Required!"
            this.message.open(this.failedMessage);
            return
        }
        this.tid = sessionStorage.getItem('moduleId') == "68" ? this.selectedemployee : sessionStorage.getItem('u')
        var cancelsave =  await this.coreService.required(this.tid,save,'35',0)
        if (cancelsave) {
            return
        }

        save.forEach(element => {
            element.date = this.pipe.transform(element.date, 'yyyy-MM-dd')
        });

        const dialogRef = this.message.open(SaveMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.filingService.postOfficialBusiness(save, this.tid,this.late).subscribe({

                    next: (value: any) => {
                        //   Error lock cannot file ==============================
                        this.coreService.valid(value, this.late, save.length,true,['/detail/filing-view'],"").then((res)=>{
                            if (res.saveNow) {
                                this.late = res.lateSave
                                this.submit(e)
                                return
                            }

                            if (res.reset) {
                                this.late = false
                            }

                            this.imagefiless = myData.fileimage
                            if (this.imagefiless.length === 0) {
                                return
                            }

                            this.coreService.uploadimage(myData.fileimage,value.payload.transactionIds,this.moduleId,this.loginId)
                        })
                    },
                    error: (e) => {
                        this.isSave = false
                        this.message.open(FailedMessage);
                        console.error(e)
                    }
                });
            }
        });
    }

    edit(e, i, x) {

        this.index = i
        this.datasource[i].action[x]
        this.datasource[i].dates[x].disabled = true
        this.datasource[i].date[x].disabled = true
        this.datasource[i].reasonId[x].disabled = false
        this.datasource[i].reason[x].disabled = false
        this.datasource[i].location[x].disabled = false
        this.datasource[i].timeFrom[x].disabled = false
        this.datasource[i].timeTo[x].disabled = false
        this.datasource[i].status[x].disabled = false
        this.datasource[i].uploadPath[x].disabled = false
        this.datasource[i].disabled = false
        this.datasource[i].disable[x].id = false
        this.datasource[i].encryptedId
        this.datasource[i].officialBusinessId[x].id
        this.datasource[i].employeeId

    }

    add(e, i, x) {

        if (this.id != "") {
            this.datasource[i].action.push({ id: this.datasource[i].action[x].id }),
                this.datasource[i].dates.push({ id: this.pipe.transform(this.datasource[i].dates[x].id, "yyyy-MM-dd"), disabled: true }),
                this.datasource[i].date.push({ id: this.pipe.transform(this.datasource[i].date[x].id, "yyyy-MM-dd"), disabled: true }),
                this.datasource[i].timeFrom.push({ id: this.pipe.transform(this.datasource[i].timeFrom[x].id, "yyyy-MM-ddT00:00"), disabled: false }),
                this.datasource[i].timeTo.push({ id: this.pipe.transform(this.datasource[i].timeTo[x].id, "yyyy-MM-ddT00:00"), disabled: false }),
                this.datasource[i].reasonId.push({ id: 0, disabled: false }),
                this.datasource[i].reason.push({ id: null, disabled: false }),
                this.datasource[i].location.push({ id: null, disabled: false }),
                this.datasource[i].uploadPath.push({ id: this.datasource[i].uploadPath[x].id, disabled: false }),
                this.datasource[i].status.push({ id: "", disabled: true }),
                this.datasource[i].disabled = true,
                this.datasource[i].encryptedId = 0,
                this.datasource[i].officialBusinessId.push({ id: 0, disabled: false }),
                this.datasource[i].employeeId
            this.datasource[i].disable.push({ id: false })

        } else {
            this.datasource[i].action.push({ id: this.datasource[i].action[x].id })
            this.datasource[i].dates.push({ id: this.datasource[i].dates[x].id, disabled: true })
            this.datasource[i].date.push({ id: this.datasource[i].date[x].id, disabled: true })
            this.datasource[i].timeFrom.push({ id: this.pipe.transform(this.datasource[i].timeTo[x].id, "yyyy-MM-ddTHH:mm"), disabled: false })
            this.datasource[i].timeTo.push({ id: "", disabled: false })
            this.datasource[i].reasonId.push({ id: 0, disabled: false })
            this.datasource[i].reason.push({ id: null, disabled: false })
            this.datasource[i].location.push({ id: null, disabled: false })
            this.datasource[i].uploadPath.push({ id: this.datasource[i].uploadPath[x].id, disabled: false })
            this.datasource[i].status.push({ id: "", disabled: true })
            this.datasource[i].disabled = true,
                this.datasource[i].encryptedId,
                this.datasource[i].officialBusinessId.push({ id: 0, disabled: false }),
                this.datasource[i].employeeId
            this.datasource[i].disable.push({ id: false })
        }
    }

    validation(e, i, x,d) {
        // validation for equal or between date parent and child =======================
        debugger
        var date = this.pipe.transform(this.datasource[i].date[x].id, 'yyyy-MM-dd')


        var tf = this.pipe.transform(this.datasource[i].timeFrom[x].id, date + ' HH:mm')
        var tt = this.pipe.transform(this.datasource[i].timeTo[x].id, date + ' HH:mm')
        if (i >= 0 && x == 0) {
            if(d == 'datefrom'){
                // this.datasource[i].timeFrom[x].id = tf
                // this.datasource[i].timeTo[x].disabled = false
                // var todate = new Date(tf)
                // this.datasource[i].timeTo[x].id =  new Date(todate.setHours(todate.getHours()+1))
            }else if(d =='dateto'){
                this.datasource[i].timeFrom[x].id = tf
                this.datasource[i].timeTo[x].id = tt

                if (this.datasource[i].timeFrom[x].id == this.datasource[i].timeTo[x].id ) {
                    this.failedMessage.title = "Warning!"
                        this.failedMessage.message = "dateTo cannot be equal to dateFrom"
                        this.message.open(this.failedMessage);
                        this.pushEvent.emit(true)
                }else{
                    this.pushEvent.emit(false)
                }

                if (this.datasource[i].timeFrom[x].id == this.datasource[i].timeTo[x].id ) {
                    this.failedMessage.title = "Warning!"
                        this.failedMessage.message = "dateTo cannot be equal to dateFrom"
                        this.message.open(this.failedMessage);
                        this.pushEvent.emit(true)
                        return
                }else{
                    this.pushEvent.emit(false)
                }
            }
        }

        if (this.datasource[i].timeFrom.length === 1) {
            return
        }

        for (let index = 0; index < this.datasource[i].timeFrom.length; index++) {
            debugger
            if (index == x) {
                //do nothing on self
            } else {
                var from = this.pipe.transform(this.datasource[i].timeFrom[index].id,  date + ' HH:mm')
                var to = this.pipe.transform(this.datasource[i].timeTo[index].id,  date + ' HH:mm')

                var tf = this.pipe.transform(this.datasource[i].timeFrom[x].id, date + ' HH:mm')
                var tt = this.pipe.transform(this.datasource[i].timeTo[x].id, date + ' HH:mm')

                if(d == 'datefrom'){
                    this.datasource[i].timeFrom[x].id = tf
                    this.datasource[i].timeTo[x].id = tf
                }else if(d =='dateto'){
                    this.datasource[i].timeFrom[x].id = tf
                    this.datasource[i].timeTo[x].id = tt

                    if (this.datasource[i].timeFrom[x].id == this.datasource[i].timeTo[x].id ) {
                        this.failedMessage.title = "Warning!"
                            this.failedMessage.message = "dateTo cannot be equal to dateFrom"
                            this.message.open(this.failedMessage);
                            this.pushEvent.emit(true)
                            return
                    }else{
                        this.pushEvent.emit(false)
                    }

                    if (this.datasource[i].timeFrom[i].id == this.datasource[i].timeTo[i].id ) {
                        this.failedMessage.title = "Warning!"
                            this.failedMessage.message = "dateTo cannot be equal to dateFrom"
                            this.message.open(this.failedMessage);
                            this.pushEvent.emit(true)
                    }else{
                        this.pushEvent.emit(false)
                    }
                }

                var now = this.pipe.transform(e.value, 'yyyy-MM-dd HH:mm')

                const dateFrom = new Date(from);
                const dateTo = new Date(to);
                const today = new Date(now);
                const datef = new Date(tf);

                if (today > dateFrom && today < dateTo || datef > dateFrom && datef < dateTo) {
                    this.failedMessage.title = "Warning!"
                    this.failedMessage.message = "dateFrom between dateFrom and dateTo from other schedule"
                    this.message.open(this.failedMessage);
                    this.pushEvent.emit(true)
                } else {
                    this.pushEvent.emit(false)
                }
            }
        }
    }

    samedate(e, i, x) {

        var tf = this.pipe.transform(this.datasource[i].timeFrom[x].id, 'yyyy-MM-dd HH:mm')
        var tt = this.pipe.transform(this.datasource[i].timeTo[x].id, 'yyyy-MM-dd HH:mm')

        var date = this.pipe.transform(this.datasource[i].date[i].id, 'yyyy-MM-dd')


        var tfparent = this.pipe.transform(this.datasource[i].timeFrom[i].id, date + ' HH:mm')
        var ttparent = this.pipe.transform(this.datasource[i].timeTo[i].id, date + ' HH:mm')

        if (new Date(tf) == new Date(tt) ) {
            this.failedMessage.title = "Warning!"
            this.failedMessage.message = "Please Change your DateFrom and DateTo"
            const dialogRef = this.message.open(this.failedMessage);
            dialogRef.afterClosed().subscribe((result) => {
                if (result == "confirmed") {
                    this.datasource[i].reasonId[x].id = 0
                    this.pushEvent.emit(true)
                }
            })
            return
        }else if(new Date(tfparent) == new Date(ttparent)){
            this.failedMessage.title = "Warning!"
            this.failedMessage.message = "Please Change your DateFrom and DateTo"
            const dialogRef = this.message.open(this.failedMessage);
            dialogRef.afterClosed().subscribe((result) => {
                if (result == "confirmed") {
                    this.datasource[i].reasonId[i].id = 0
                    this.pushEvent.emit(true)
                }
            })
            return
        }
        else{
            this.pushEvent.emit(false)
        }

    }

    getFormattedTimeValue(): string {
        return moment(this.officialBForm.value.timeFrom).format('hh:mm a');
    }

    min_max(min,date,picker){
        if (min) {
            return new Date(picker)
        } else{
            return new Date(picker)
        }
    }

    date_min_max(e, x, isMin,date) {

       var df = this.pipe.transform(e.timeFrom[x].id,'yyyy-MM-dd')
       var dt = this.pipe.transform(e.timeTo[x].id,'yyyy-MM-dd')

       if (date == 'dateFrom') {
            var datemin = new Date(df + ' 00:00')
            var datemax = new Date(e.timeTo[x].id)
       }else{
            var datemin = new Date(e.timeFrom[x].id)
            var datemax = new Date(dt + ' 23:59')
       }

        //parent
        var min = new Date(datemin)
        var max = new Date(datemax)

        return isMin ? min : max

    }
}
