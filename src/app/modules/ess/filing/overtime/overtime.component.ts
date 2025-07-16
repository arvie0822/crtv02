import { DatePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { otTable, Overtime, overtimeField, overtimefields, Overtimes } from 'app/model/administration/filing';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { FilingService } from 'app/services/filingService/filing.service';
import { MasterService } from 'app/services/masterService/master.service';
import { ShiftService } from 'app/services/shiftService/shift.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { ReplaySubject, Subject, async, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';
import _, { deburr } from 'lodash';
import { SystemSettings } from 'app/model/app.constant';
import { myData } from 'app/model/app.moduleId';

// ==========import for format of date ==========================================
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS, } from '@angular-material-components/datetime-picker';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { CoreService } from 'app/services/coreService/coreService.service';
import { GF } from 'app/shared/global-functions';
import { TableRequest } from 'app/model/datatable.model';


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
    selector: 'app-overtime',
    templateUrl: './overtime.component.html',
    styleUrls: ['./overtime.component.css'],
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
export class OvertimeComponent implements OnInit {
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
    approved: boolean = false
    public color: ThemePalette = 'primary';
    isSave: boolean = false
    dropdownOptions = new DropdownOptions
    dropdownFixRequest = new DropdownRequest
    dropdownRequest = new DropdownRequest
    dropdownRequest0 = new DropdownRequest
    id: string
    editing = false
    index = 0
    dropdowns: any = []
    @Output() validate = new EventEmitter<any>();
    @Output() pushEvent = new EventEmitter<any>();
    @Output() pushindex = new EventEmitter<any>();
    @Input() moduleid : any
    @ViewChild('OTTable') OTTable: MatTable<any>;
    pipe = new DatePipe('en-US');
    @Input() datasource: any
    @Input() selectedemployee: any
    public statusArray: any[];
    inputChangeParent: UntypedFormControl = new UntypedFormControl();
    optionsParent: any[] = [];
    dataparent: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    indexParent: number = 1
    complete: boolean = false
    systemSettings = SystemSettings
    min = new Date()
    disabledbutton: boolean = false
    action: string = ""
    shiftidcode: number = 0
    request: any
    otype = []
    ottiming = []
    shiftdrop = []
    protected _onDestroy = new Subject<void>();
    overtime: FormGroup
    otform: FormGroup
    type: number
    leaveForm: FormGroup
    imageUrl: any
    OTSource: Overtimes[] = [];
    otColumns: string[] = ['otaction', 'otdate', 'otshift', 'overtime_type', 'ottiming', 'ot_start', 'ot_end', 'otreason', 'status', 'uploadFileot'];
    columns: string[] = ['action', 'monday'];
    filename = ""
    failedMessage = { ...FailedMessage}
    shiftin: any
    shiftout: any
    tid : any
    fileExtension: string | undefined;
    imagefiless : any = []
    moduleId: any
    loginId = 0
    idsimage : any = []
    editbutton : boolean = false
    addbutton : boolean = false
    schedin : any
    schedout : any
    start : any
    end : any
    constructor(private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private message: FuseConfirmationService,
        private shiftService: ShiftService,
        private router: Router,
        private filingService: FilingService,
        private route: ActivatedRoute,
        private tenantService: TenantService,
        private coreService: CoreService,
        private storageServiceService : StorageServiceService,
        private masterService: MasterService) { }
        isflexivalida : boolean
        late : boolean = false
        saveMessage = { ...SaveMessage}
    ngOnInit() {
        this.overtime = this.fb.group(new Overtimes());
        this.otform = this.fb.group(new otTable());

        this.shiftidcode = myData.shiftCode

        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id !== "") {
            this.action = sessionStorage.getItem("action")
            this.moduleId = "36"

            setTimeout(() => {
                this.filingService.getOvertime(this.id).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.dropdownRequest0.id.push({ dropdownID: value.payload.shiftId == null ? 0 : value.payload.shiftId, dropdownTypeID: 0 })
                            this.ottype()

                            this.datasource.push({
                                overtimeId: [{id : value.payload.overtimeId}],
                                overtimeCode: value.payload.overtimeCode,
                                otaction: [{ id: value.payload.otaction }],
                                otdate: [{ id: this.pipe.transform(value.payload.date, "MM-dd-yyyy"), disable : true }],
                                otshift: [{ id: value.payload.shiftId , disable : true }],
                                overtime_type: [{ id: value.payload.overtimeTypeId , disable : true }],
                                ottiming: [{ id: value.payload.timingId , disable : true }],
                                ot_start: [{ id: this.pipe.transform(value.payload.otStart, "yyyy-MM-ddTHH:mm:ss"), disable : true  }],
                                ot_end: [{ id: this.pipe.transform(value.payload.otEnd, "yyyy-MM-ddTHH:mm:ss"), disable : true }],
                                otreason: [{ id: value.payload.reason , disable : true }],
                                uploadFileot: [{ id: value.payload.uploadPath , disable : true }],
                                shiftCode: [{ id: value.payload.overtimeCode , disable : true }],
                                status: [{ id: value.payload.status, disable : true  }],
                                disabled: [{ id: false, disable: true }],
                                lateFiling: false,
                                isUpload: false,
                                disable: false,
                                // encryptedId: value.payload.encryptedId,
                            })

                            this.OTTable.renderRows()
                            this.datasource.forEach(element => {
                                element.otshift.forEach(item => {
                                    this.dropdownRequest0.id.push({ dropdownID: item.id == null ? 0 : item.id, dropdownTypeID: 0 })
                                });

                            });
                        }
                        else {
                            console.log(value.stackTrace)
                            console.log(value.message)
                        }
                        var action = sessionStorage.getItem("action")
                        if (action == "view") {
                            this.disabledbutton = true
                        } else if (action == "edit") {
                        }
                    },
                    error: (e) => {
                        console.error(e)
                    }
                });
            }, 2000);
        } else {
            this.datasource.forEach(element => {
                element.otshift.forEach(item => {
                    this.dropdownRequest0.id.push({ dropdownID: item.id == null ? 0 : item.id, dropdownTypeID: 0 })
                });
            });
            this.ottype()
            this.initData()

        }

    }

    get tb() {
        return this.otform.value
    }

    ngOnChanges() {
    }




    async uploadFile(event, id,names ,i,x) {
        this.datasource[i].uploadFileot[x].id = event.target.files[0].name;
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

    getFileExtension(fileName: string): string {
        // Use regex to extract the file extension from the file name
        const match = /\.([0-9a-z]+)(?:[\?#]|$)/i.exec(fileName);
        if (match && match[1]) {
            return match[1].toLowerCase(); // Convert to lowercase if needed
        } else {
            return 'Unknown';
        }
    }

    handleDeleteBreak(i, x): void {

        if (x !== 0) {
            this.datasource[i].otaction.splice(x, 1);
            this.datasource[i].otdate.splice(x, 1);
            this.datasource[i].otshift.splice(x, 1);
            this.datasource[i].overtime_type.splice(x, 1);
            this.datasource[i].ottiming.splice(x, 1);
            this.datasource[i].ot_start.splice(x, 1);
            this.datasource[i].ot_end.splice(x, 1);
            this.datasource[i].otreason.splice(x, 1);
            this.datasource[i].uploadFileot.splice(x, 1);
            this.datasource[i].status.splice(x, 1);
            this.datasource[i].shiftCode.splice(x, 1);
            this.datasource[i].disabled.splice(x, 1);
        } else {
            this.datasource.splice(i, 1);
        }

        this.OTTable.renderRows();
    }

    isEdit(i, x,e) {

        this.datasource[i].otaction[x].disable = false
        this.datasource[i].otdate[x].disable = false
        this.datasource[i].otshift[x].disable = false
        this.datasource[i].overtime_type[x].disable = false
        this.datasource[i].ottiming[x].disable = false
        this.datasource[i].ot_start[x].disable = false
        this.datasource[i].ot_end[x].disable = false
        this.datasource[i].otreason[x].disable = false
        this.datasource[i].uploadFileot[x].disable = false
        this.datasource[i].status[x].disable = false
        this.datasource[i].shiftCode[x].disable = false
        this.datasource[i].disabled = true
        this.datasource[i].disable
        this.datasource[i].overtimeId
        this.datasource[i].overtimeCode
        this.datasource[i].lateFiling
        this.datasource[i].isUpload
        this.datasource[i].date
        this.editbutton = e
        this.initData()
    }

    public async submit(e) {
        if (sessionStorage.getItem('moduleId') == "68") {

            this.idsimage = this.selectedemployee

        }else{
            this.idsimage = [sessionStorage.getItem("u")]
        }

        var id = [sessionStorage.getItem("u")]
        this.coreService.encrypt_decrypt(false, this.idsimage)
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

        var final = [];
        var fl = []
        e.forEach(ems => {
            var keys = Object.keys(ems);
            var maxLength = Math.max(...keys.map(key => Array.isArray(ems[key]) ? ems[key].length : 1));

            for (var i = 0; i < maxLength; i++) {

                var obj = {};
                keys.forEach(key => {
                    if (Array.isArray(e[0][key])) {
                        obj[key] = key == "ot_start" || key == "ot_end" ? this.pipe.transform(ems[key][i].id, "yyyy-MM-ddTHH:mm:ss") : ems[key][i].id;
                    }
                    else {
                        obj[key] = key == "ot_start" || key == "ot_end" ? this.pipe.transform(ems[key], "yyyy-MM-ddTHH:mm:ss") : ems[key];
                    }
                });

                final.push(obj);
            }

        });

        var ds = final.map(x => ({
            overtimeId: x.overtimeId,
            overtimeCode: x.overtimeCode,
            otaction: x.otaction,
            date: x.otdate,
            shiftId: x.otshift,
            overtimeTypeId: x.overtime_type,
            timingId: x.ottiming,
            otStart: x.ot_start,
            otEnd: x.ot_end,
            reason: x.otreason,
            uploadPath: x.uploadFileot,
            lateFiling: false,
            isUpload: false,
            disable: x.disable,
            disabled : x.disabled,
            // encryptedId: x.encryptedId,
            status: x.status,
            shiftCode:x.shiftCode
        }))

        if (ds.length != 0) {
            var timeSet = new Set<string>();
            for (const item of ds) {
                const startTime = item.otStart;
                const endTime = item.otEnd;
                const timeString = `${startTime}-${endTime}`;
                if (timeSet.has(timeString)) {
                    this.failedMessage.title = "Warning!"
                    this.failedMessage.message = "Duplicate start Time and End time!"
                    this.message.open(this.failedMessage);
                    return
                }
                timeSet.add(timeString);
            }
        }

        var save = ds.filter(x => x.status != "Approved" && x.disabled == true && x.overtimeTypeId != 0 && x.timingId != 0)

        if (save.length == 0) {
            this.failedMessage.title = "Warning!"
            this.failedMessage.message = "No overtime changes!"
            this.message.open(this.failedMessage);
            return
        }

        var tid = sessionStorage.getItem('moduleId') == "68" ? this.selectedemployee : sessionStorage.getItem('u')
        var cancelsave =  await this.coreService.required(tid,save,'36',0)
        if (cancelsave) {
            return
        }

        save.forEach(element => {
            element.date = this.pipe.transform(element.date, 'yyyy-MM-dd')
        });

        var tid = sessionStorage.getItem('moduleId') == "68" ? this.selectedemployee : sessionStorage.getItem('u')
        debugger
        const dialogRef = this.message.open(SaveMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.filingService.postOvertime(save, tid,this.late).subscribe({
                    next: (value: any) => {
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
                    debugger
                        this.isSave = false
                        this.message.open(FailedMessage);
                        console.error(e)
                    }
                });
            }
        });
    }

    returnList(i, obj) {
        return this.optionsParent[i]?.[obj] || []
    }

    initData() {

        this.tid = sessionStorage.getItem('u')
        this.datasource.forEach(element => {
            element.otshift.forEach(item => {
                this.dropdownRequest0.id.push({ dropdownID: item.id == null ? 0 : item.id, dropdownTypeID: 0 })
            });
        });

        this.datasource
        this.request = {
            moduleId: this.moduleid,
            subModuleId: 0,
            dateFrom: new Date(),
            dateTo: new Date(),
            overtimeTiming: 0,
            shiftId: 0,
            leaveFilingType: 0,
            targetId: this.selectedemployee == null || "" ? this.tid : this.selectedemployee,
            date :  this.pipe.transform(new Date() , 'yyyy-MM-dd')
        }

        forkJoin({
            fix: this.masterService.getDropdownFix(this.dropdownFixRequest),
            validationtype: this.filingService.getFilingValidationOnUI(this.request),
            shift: this.shiftService.getShiftPerDayDropdown(this.dropdownRequest0),
        })
        .subscribe({
            next: (response) => {

                this.datasource.forEach((elements , index) => {
                    if (elements.status[0].id == "" || this.editbutton || this.addbutton) {
                        this.otype = this.action == "view" ? this.otype : _.uniqBy([...this.otype.filter(x => response.validationtype.payload.overtimeType.includes(x.dropdownID))], JSON.stringify)
                        this.ottiming = this.action == "view" ? this.ottiming : _.uniqBy([...this.ottiming.filter(x => response.validationtype.payload.otTiming.includes(x.dropdownID))], JSON.stringify)
                    }
                    else if(elements.status[0].id  !== "" ){
                        this.otype = response.fix.payload.filter(x => x.dropdownTypeID == 52)
                        this.ottiming = response.fix.payload.filter(x => x.dropdownTypeID == 70)
                    }
                    if (this.datasource.length > 0) {
                        if (this.optionsParent.length > 0) {
                            // for (let index = 0; index < this.datasource.length; index++) {
                                if (this.optionsParent[index]) {
                                    this.optionsParent[index].shiftCodeDef = this.shiftdrop,
                                    this.optionsParent[index].overtimeTypeDef = this.otype,
                                    this.optionsParent[index].overtimeTimingDef = this.ottiming
                                }
                            // }

                        }
                    }
                });
                // this.shiftdrop = this.action == "view" ? this.shiftdrop : this.shiftdrop

                // console.log(this.optionsParent)
            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
                this.inputChangeParent.valueChanges.
                pipe(debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this._onDestroy)).subscribe(() => {
                    this.handlerSearcParent()
                });

            },

        });

        setTimeout(() => {
            this.datasource.forEach(element => {

                if (element.status[0].id == "") {
                    element.ottiming[0].disable = false
                    element.overtime_type[0].disable = false
                    element.ot_start[0].disable = false
                    element.ot_end[0].disable = false
                    element.otreason[0].disable = false
                    element.uploadFileot[0].disable = false
                    element.disable = false
                }
            });
        }, 1000);
    }


    add(x, i,e,t) {
            if (this.datasource[i].ottiming[x].id !== 0) {
                if (this.id != "") {
                    this.datasource[i].otaction.push({ id: "" })
                    this.datasource[i].otdate.push({ id: this.datasource[i].otdate[x].id, disable: true })
                    this.datasource[i].otshift.push({ id: this.datasource[i].otshift[x].id, disable: true })
                    this.datasource[i].overtime_type.push({ id: 0, disable: false })
                    this.datasource[i].ottiming.push({ id: 0, disable: false })
                    var adddhours = new Date(this.datasource[i].ot_end[x].id)
                    this.datasource[i].ot_start.push({ id: adddhours, disable:false})
                    var endhours = new Date(e.ot_end[x].id)
                    var finalhours = new Date(endhours.setHours(endhours.getHours()+1))
                    this.datasource[i].ot_end.push({ id: finalhours , disable: false })
                    this.datasource[i].otreason.push({ id: "", disable: false })
                    this.datasource[i].uploadFileot.push({ id: this.datasource[i].uploadFileot[x].id, disable: false })
                    this.datasource[i].status.push({ id: "", disable: true })
                    this.datasource[i].shiftCode.push({ id:  this.datasource[i].shiftCode[x].id, disable: true })
                    this.datasource[i].disabled.push({id : true , disable: true })
                    this.datasource[i].disable
                    this.datasource[i].overtimeId.push({id: 0}),
                    this.datasource[i].overtimeCode
                    this.datasource[i].lateFiling
                    this.datasource[i].isUpload
                    this.datasource[i].date
                    this.addbutton = e
                    // this.datasource[i].encryptedId = this.id
                }else{

                    this.datasource[i].otaction.push({ id: "" })
                    this.datasource[i].otdate.push({ id: this.datasource[i].otdate[x].id, disable: true })
                    this.datasource[i].otshift.push({ id: this.datasource[i].otshift[x].id, disable: true })
                    this.datasource[i].overtime_type.push({ id: 0, disable: false })
                    this.datasource[i].ottiming.push({ id: 0, disable: false })
                    var adddhours = new Date(this.datasource[i].ot_end[x].id)
                    this.datasource[i].ot_start.push({ id: adddhours, disable:false})
                    var endhours = new Date(e.ot_end[x].id)
                    var finalhours = new Date(endhours.setHours(endhours.getHours()+1))
                    this.datasource[i].ot_end.push({ id: finalhours , disable: false })
                    this.datasource[i].otreason.push({ id: "", disable: false })
                    this.datasource[i].uploadFileot.push({ id: this.datasource[i].uploadFileot[x].id, disable: false })
                    this.datasource[i].status.push({ id: "", disable: true })
                    this.datasource[i].shiftCode.push({ id: "", disable: true })
                    this.datasource[i].disabled.push({ id: true, disable: true })
                    this.datasource[i].disable
                    this.datasource[i].overtimeId.push({id: 0}),
                    this.datasource[i].lateFiling
                    this.datasource[i].isUpload
                    this.datasource[i].date
                    this.addbutton = e
                    this.initData()
                    // this.datasource[i].encryptedId = ""

                }
            }else{
            this.failedMessage.title = "Warning"
            this.failedMessage.message  = "filing Type cannot be null. please select filing type"
            this.message.open(this.failedMessage)
            this.pushEvent.emit(true)
        }
    }

    cancel(e) {
        // cancelChangeSchedule

        SaveMessage.message = "Are you sure you want to Cancel ?"
        const dialogRef = this.message.open(SaveMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.filingService.cancelOvertime(e,this.late).subscribe({

                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            SuccessMessage.message = "Cancelation Success"
                            this.message.open(SuccessMessage);
                            this.isSave = false
                        }
                        else if(value.payload.lockingState == 2 && value.payload.valiationState == 2 || value.payload.lockingState == 2 && value.payload.valiationState == 0){
                            this.failedMessage.message = "Filing for this cutoff is fully locked"
                            this.failedMessage.actions.cancel.show = false
                            this.message.open(this.failedMessage);

                            // valid but not validated =========================
                        }else if( value.payload.lockingState == 0 && value.payload.valiationState == 1){
                            this.failedMessage = value.message
                            this.message.open(this.failedMessage);

                            // late but validated =================================
                        }else if( value.payload.lockingState == 1 && value.payload.valiationState == 0){
                            this.saveMessage.message = "This will be tagged as Late Cancel'. Continue?"
                            const dialogRef = this.message.open(this.saveMessage);
                            dialogRef.afterClosed().subscribe((result) => {
                                if (result == "confirmed") {
                                    this.filingService.cancelOvertime(e,this.late = true).subscribe({
                                        next: (value: any) => {
                                            if (value.statusCode == 200) {
                                                this.message.open(SuccessMessage);
                                                this.isSave = false
                                                this.router.navigate(['/detail/filing-view']);
                                            }
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            FailedMessage.message = value.message
                            this.message.open(FailedMessage);
                            console.log(value.stackTrace)
                            console.log(value.message)
                        }
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

    getShiftOT(e) {
        // console.log(e)
        this.validate.emit(e)
    }

    getNextBatchParent() {

        if (!this.complete) {
            const search = this.inputChangeParent.value?.toLowerCase()

            if (search) {
                this.dropdownRequest.search = search
            }
            this.dropdownRequest.search = null
            this.dropdownRequest.start = this.indexParent++
            this.dropdownRequest.id = []
            this.dropdownRequest.length = 10000
            this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 0 })


            this.shiftService.getShiftPerDayDropdown(this.dropdownRequest).subscribe({
                next: (value: any) => {
                    this.optionsParent = _.uniqBy([...this.optionsParent, ...value.payload], JSON.stringify)
                    this.optionsParent = this.optionsParent.filter(item => item.dropdownID && item.dropdownID)
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                    this.dataparent.next(this.optionsParent);
                    // console.log(this.dataparent)
                },
            });
        }
    }

    handlerSearcParent() {

        const search = this.inputChangeParent.value?.toLowerCase()
        if (!search) {

            this.dataparent.next(this.optionsParent)
        }
        else {
            this.dropdownRequest.search = search
            this.dropdownRequest.id = []
            this.dropdownRequest.length = 10000
            this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: this.type })

            this.shiftService.getShiftPerDayDropdown(this.dropdownRequest).subscribe({
                next: (value: any) => {
                    this.optionsParent = _.uniqBy([...this.optionsParent, ...value.payload], JSON.stringify)
                    this.optionsParent = this.optionsParent.filter(item => item.dropdownID && item.dropdownID)
                },
                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                    this.dataparent.next(this.optionsParent.filter(x => x.description.toLowerCase().indexOf(search) > -1));
                },
            });
            // }
        }
    }

    validation(e, i, x , tf) {
        this.tid = sessionStorage.getItem('u')
        var ottimein = GF.IsEmpty( e.ot_start[x].id) ? this.pipe.transform(new Date(), 'yyyy-MM-dd') : this.pipe.transform(e.ot_start[x].id, 'yyyy-MM-dd') //e.ot_start[x].id
        var ottimeout = GF.IsEmpty( e.ot_end[x].id) ? this.pipe.transform(new Date(), 'yyyy-MM-dd') : this.pipe.transform(e.ot_end[x].id, 'yyyy-MM-dd')//e.ot_start[x].id

        this.request = {
            moduleId: this.moduleid,
            subModuleId: 0,
            dateFrom: ottimein,
            dateTo: ottimeout,
            overtimeTiming: e.ottiming[x].id,
            shiftId: e.otshift[x].id,
            leaveFilingType: 0,
            targetId : this.selectedemployee == null || "" ? this.tid : this.selectedemployee,
            date: GF.IsEmpty(e.otdate[x].id) ? "" : this.pipe.transform(e.otdate[x].id, 'yyyy-MM-dd')
        }

        this.filingService.getFilingValidationOnUI(this.request).subscribe({

            next: (value: any) => {
                this.schedin = value.payload.schedIn
                this.schedout = value.payload.schedOut

                if (this.datasource[i].ottiming[x].id == 12699 && this.schedin != null && this.schedout != null  && x <=0 ) {
                    var SCin =  new Date(this.schedout)
                    SCin.setHours(SCin.getHours()+1)
                    var indate = this.pipe.transform(SCin, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_start[x].id = this.pipe.transform(this.schedout, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_end[x].id = this.pipe.transform(indate, 'yyyy-MM-dd HH:mm')
                }else if(this.datasource[i].ottiming[x].id == 12699 && this.schedin != null && this.schedout != null  && x <= 0 && e.ottiming[i].id !== e.ottiming[x].id ){
                    var SCin =  new Date(this.schedout)
                    SCin.setHours(SCin.getHours()+1)
                    var indate = this.pipe.transform(SCin, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_start[x].id = this.pipe.transform(this.schedout, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_end[x].id = this.pipe.transform(indate, 'yyyy-MM-dd HH:mm')
                }else if(this.datasource[i].ottiming[x].id == 12698  && this.schedin != null && this.schedout != null  && x <= 0 ){
                    var SCin =  new Date(this.schedin)
                    SCin.setHours(SCin.getHours()-1)
                    var outdate = this.pipe.transform(SCin, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_start[x].id = this.pipe.transform(outdate, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_end[x].id = this.pipe.transform(this.schedin, 'yyyy-MM-dd HH:mm')
                }else if(this.datasource[i].ottiming[x].id == 12698  && this.schedin != null && this.schedout != null  && x <= 1 && e.ottiming[i].id !== e.ottiming[x].id){
                    var SCin =  new Date(this.schedin)
                    SCin.setHours(SCin.getHours()-1)
                    var outdate = this.pipe.transform(SCin, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_start[x].id = this.pipe.transform(outdate, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_end[x].id = this.pipe.transform(this.schedin, 'yyyy-MM-dd HH:mm')
                }
                else if(this.datasource[i].ottiming[x].id == 12708  && this.schedin != null && this.schedout != null){
                    this.datasource[i].ot_start[x].id = this.pipe.transform(this.schedin, 'yyyy-MM-dd HH:mm')
                    this.datasource[i].ot_end[x].id = this.pipe.transform(this.schedout, 'yyyy-MM-dd HH:mm')
                }else if(value.payload.isRestDay == true && this.schedin == null && this.schedout == null){
                    this.datasource[i].ot_start[x].id = this.pipe.transform(e.date, 'yyyy-MM-dd 00:00')
                    this.datasource[i].ot_end[x].id = this.pipe.transform(e.date, 'yyyy-MM-dd 01:00')
                }
                this.isflexivalida = value.payload.isFlexi

                var config = value.payload;
                if (this.isflexivalida == false) {
                    // validation for starttime and end time using filing type ===================================================
                    if (e.ottiming[x].id == 12708) {
                        if (config.isAllowed == false && config.enableRDHoliday == true) {
                            this.failedMessage.title = "Warning"
                            this.failedMessage.message = config.message
                            this.message.open(this.failedMessage)
                            e.ottiming[x].id = 0
                            this.pushEvent.emit(true)

                        }
                        else {
                            this.pushEvent.emit(false)
                        }
                    } else if (value.payload.isRestDay && e.ottiming[x].id == 12699 ||
                        value.payload.isRestDay && e.ottiming[i].id == 12699 ||
                        value.payload.isRestDay && e.ottiming[x].id == 12698 ||
                        value.payload.isRestDay && e.ottiming[i].id == 12698) {
                        var timchild = x > 1 ? e.ottiming[x].id : e.ottiming[i].id
                        var timiming = timchild == 12699 ? "Post" : timchild == 12698 ? "Pre" : ""
                        this.failedMessage.title = 'Warning'
                        this.failedMessage.message = "Cannot File " + timiming + " Overtime on a Restday"
                        this.message.open(this.failedMessage);
                        x >= 1 ? e.ottiming[x].id = 0 : e.ottiming[x].id = 0
                        this.pushEvent.emit(true)
                    } else {
                        this.pushEvent.emit(false)
                    }

                    if (x > 0) {
                        // Variables
                        var isMatched = e.ottiming[x].id == e.ottiming[i].id;
                        var timingTypeId = e.ottiming[i].id;
                        var timingType = "";
                        var isMulti = false;

                        switch (timingTypeId) {
                            case 12698:
                                timingType = "Pre-shift";
                                isMulti = config.enableMultiPreShift;
                                break;

                            case 12699:
                                timingType = "Post-shift";
                                isMulti = config.enableMultiPostShift;
                                break;

                            case 12708:
                                timingType = "RD";
                                isMulti = config.enableMultiRDHD;
                                break;
                        }

                        // Check Validity
                        if (!(config.isAllowed && !isMulti && isMatched)) {
                            this.pushEvent.emit(false);
                            return;
                        }

                        // Error Validation
                        this.failedMessage.title = "Warning"
                        this.failedMessage.message = `Multiple ${timingType} overtime is not allowed`;
                        const dialogRef = this.message.open(this.failedMessage);
                        dialogRef.afterClosed().subscribe((result) => {
                            if (result == "confirmed") {
                                this.datasource[i].otaction.splice(x, 1);
                                this.datasource[i].otdate.splice(x, 1);
                                this.datasource[i].otshift.splice(x, 1);
                                this.datasource[i].overtime_type.splice(x, 1);
                                this.datasource[i].ottiming.splice(x, 1);
                                this.datasource[i].ot_start.splice(x, 1);
                                this.datasource[i].ot_end.splice(x, 1);
                                this.datasource[i].otreason.splice(x, 1);
                                this.datasource[i].uploadFileot.splice(x, 1);
                                this.datasource[i].status.splice(x, 1);

                                this.OTTable.renderRows();
                            }
                        });
                        this.pushEvent.emit(true)
                        this.handleDeleteBreak(i, x)
                    }

                    var curretndate = new Date
                    var canfilebefore = value.payload.canFileBefore
                    var canfileafter = value.payload.canFileAfter

                    if (canfilebefore != null && canfilebefore > 0) {

                        this.min = new Date(curretndate.setDate(curretndate.getDate() + canfilebefore + 1))

                    } else
                        if (canfileafter != null && canfileafter > 0) {

                            this.min = new Date(curretndate.setDate(curretndate.getDate() - canfileafter))

                        } else {
                            this.min = new Date(1994, 1, 1)
                        }
                    if (value.payload.isAllowed == false) {

                    }
                } else if (value.payload.isRestDay == true && e.ottiming[x].id == 12699 ||
                    value.payload.isRestDay == true && e.ottiming[i].id == 12699 ||
                    value.payload.isRestDay == true && e.ottiming[x].id == 12698 ||
                    value.payload.isRestDay == true && e.ottiming[i].id == 12698) {
                    var timchild = x > 1 ? e.ottiming[x].id : e.ottiming[i].id
                    var timiming = timchild == 12699 ? "Post" : timchild == 12698 ? "Pre" : ""
                    this.failedMessage.title = 'Warning'
                    this.failedMessage.message = "Cannot File " + timiming + " Overtime on a Restday"
                    this.message.open(this.failedMessage);
                    x >= 1 ? e.ottiming[x].id = 0 : e.ottiming[x].id = 0
                    this.pushEvent.emit(true)
                }else {
                    this.pushEvent.emit(false)
                }

                if (x > 0) {
                    // Variables
                    var isMatched = e.ottiming[x].id == e.ottiming[i].id;
                    var timingTypeId = e.ottiming[i].id;
                    var timingType = "";
                    var isMulti = false;

                    switch (timingTypeId) {
                        case 12698:
                            timingType = "Pre-shift";
                            isMulti = config.enableMultiPreShift;
                            break;

                        case 12699:
                            timingType = "Post-shift";
                            isMulti = config.enableMultiPostShift;
                            break;

                        case 12708:
                            timingType = "RD";
                            isMulti = config.enableMultiRDHD;
                            break;
                    }

                    // Check Validity
                    if (!(config.isAllowed && !isMulti && isMatched)) {
                        this.pushEvent.emit(false);
                        return;
                    }

                    // Error Validation
                    this.failedMessage.title = "Warning"
                    this.failedMessage.message = `Multiple ${timingType} overtime is not allowed`;
                    const dialogRef = this.message.open(this.failedMessage);
                    dialogRef.afterClosed().subscribe((result) => {
                        if (result == "confirmed") {
                            this.datasource[i].otaction.splice(x, 1);
                            this.datasource[i].otdate.splice(x, 1);
                            this.datasource[i].otshift.splice(x, 1);
                            this.datasource[i].overtime_type.splice(x, 1);
                            this.datasource[i].ottiming.splice(x, 1);
                            this.datasource[i].ot_start.splice(x, 1);
                            this.datasource[i].ot_end.splice(x, 1);
                            this.datasource[i].otreason.splice(x, 1);
                            this.datasource[i].uploadFileot.splice(x, 1);
                            this.datasource[i].status.splice(x, 1);

                            this.OTTable.renderRows();
                        }
                    });
                    this.pushEvent.emit(true)
                    this.handleDeleteBreak(i, x)
                } else {
                    if ((value.payload.schedIn == null && value.payload.schedOut == null && e.ottiming[x].id == 12699 && value.payload.isRestDay == false) ||
                        (value.payload.schedIn == null && value.payload.schedOut == null && e.ottiming[x].id == 12698 && value.payload.isRestDay == false)) {
                        this.failedMessage.title = 'Warning'
                        this.failedMessage.message = "Cannot File OT without Schedule"
                        this.message.open(this.failedMessage);
                        e.ottiming[i].id = 0
                        this.pushEvent.emit(true)
                    } else {
                        this.pushEvent.emit(false)
                    }
                }
            }
        })
    }

    samedate(i, x) {

        // if (this.datasource[i].otdate[x].id != null || "") {
        //     var timein = moment(new Date).format('HH:mm:ss')
        //     var timeinou = moment(new Date).format('HH:mm:ss')
        //     var date = moment(this.datasource[i].otdate[x].id).format('yyyy-MM-DD')

        //     this.datasource[i].ot_start[x].id = (date + "T" + timein)
        //     this.datasource[i].ot_end[x].id = (date + "T" + timeinou)

        // }
        // this.datasource[i].timeIn = (date + " " + timeinou)
        // this.datasource[i].timeOut = (date + " " + timeinou)
    }

    ottype() {

        this.dropdownFixRequest.id.push(
            { dropdownID: 0, dropdownTypeID: 52 },
            { dropdownID: 0, dropdownTypeID: 70 }
        )
        this.tid = sessionStorage.getItem('u')

        forkJoin({
            fix: this.masterService.getDropdownFix(this.dropdownFixRequest),
            shiftiddrop: this.shiftService.getShiftPerDayDropdown(this.dropdownRequest0),
        })

            .subscribe({
                next: (response) => {
                    console.log("ottype 1")
                    this.otype = response.fix.payload.filter(x => x.dropdownTypeID == 52)
                    this.ottiming = response.fix.payload.filter(x => x.dropdownTypeID == 70)
                    this.shiftdrop = response.shiftiddrop.payload

                    for (let index = 0; index < this.datasource.length; index++) {
                        this.optionsParent.push({
                            shiftCodeDef: this.shiftdrop,
                            overtimeTypeDef: this.otype,
                            overtimeTimingDef: this.ottiming,
                        })
                    }

                },

                error: (e) => {
                    console.error(e)
                },
                complete: () => {
                    this.inputChangeParent.valueChanges.
                    pipe(debounceTime(300),
                    distinctUntilChanged(),
                    takeUntil(this._onDestroy)).subscribe(() => {
                        this.handlerSearcParent()
                    });

                },

            });

        this.datasource.forEach(element => {

            if (element.status[0].id == "") {
                element.ottiming[0].disable = false
                element.overtime_type[0].disable = true
                element.ot_start[0].disable = false
                element.ot_end[0].disable = false
                element.otreason[0].disable = false
                element.uploadFileot[0].disable = false
                element.disable = false
            }
        });

    }

    // this is for shiftcode Resday only =================
    restdayDate(e,i,x,t){
           var dates = x > 1 ? e.ot_start[x].id : e.ot_start[i].id
           var datesend = x > 1 ? e.ot_end[x].id : e.ot_end[i].id
           var timingdropdown = x >= 1 ? e.ottiming[x].id == 12708 : e.ottiming[x].id == 12708
        if (e.shiftCode[i].id == "RD" && timingdropdown && t == "ottime") {
            if (e.ot_start.length < x) {
                e.ot_end[x].id = e.ot_end[i].id
            }else{
                var df = this.pipe.transform(e.ot_start[x].id == "" ? e.date : e.ot_start[x].id ,'yyyy-MM-dd 08:00')
                var dt = this.pipe.transform(e.ot_end[i].id ,'yyyy-MM-dd HH:mm')
                    x >= 1 ? e.ot_start[x].id : e.ot_start[i].id = df
                    x >= 1 ? e.ot_end[x].id : e.ot_end[i].id = ""
            }


        }else if(e.shiftCode[i].id == "RD" && x >= 1 ? e.ottiming[x].id == 12708 : e.ottiming[i].id == 12708  && t == "dt"){
            var starttiming = new Date(dates)
            var plushours = new Date(starttiming.setHours(starttiming.getHours() + 1))
            var plusdate = this.pipe.transform(plushours, 'yyyy-MM-dd HH:mm')
            var df = plusdate
            var condate =  new Date(df)
            x >= 1 ? e.ot_end[x].id : e.ot_end[i].id = plusdate
            return
        }
    }

    otvalidation(e, i, x, date) {
        console.log(e)
        // this.shiftcode(e,i,x)
        this.tid = sessionStorage.getItem('u')
        var ottimein = this.pipe.transform(x >= 1 ? e.ot_start[x].id : e.ot_start[i].id, 'yyyy-MM-dd') //e.ot_start[x].id
        var ottimeout = this.pipe.transform(x >= 1 ? e.ot_end[x].id : e.ot_end[x].id == "" ? "" : e.ot_end[i].id, 'yyyy-MM-dd') //e.ot_start[x].id

        this.request = {
            moduleId: this.moduleid,
            subModuleId: 0,
            dateFrom: ottimein,
            dateTo: ottimeout,
            overtimeTiming: x >= 1 ? e.ottiming[x].id : e.ottiming[i].id,
            shiftId: x >= 1 ? e.otshift[x].id : e.otshift[i].id,
            leaveFilingType: 0,
            targetId: this.selectedemployee == null || "" ? this.tid : this.selectedemployee,
            date: GF.IsEmpty(e.otdate[i].id) ? "" : this.pipe.transform(e.otdate[i].id, 'yyyy-MM-dd')
        }

        this.filingService.getFilingValidationOnUI(this.request).subscribe({

            next: (value: any) => {
                this.isflexivalida = value.payload.isFlexi

                    var shidtinout = e.shiftCode[0].id
                    var shiftsplit = shidtinout.split("_");
                    if (shidtinout !== "RD") {
                        let timePerShiftCode: string[] = shiftsplit.map((shiftsplit) => {
                            // Extract hours and minutes from the shift code
                            let hours: number = parseInt(shiftsplit.slice(0, 2), 10);
                            let minutes: number = parseInt(shiftsplit.slice(2, 4), 10);

                            // Check if it's AM (A) or PM (P) and adjust hours accordingly
                            if (shiftsplit[4] === 'P') {
                                if (hours < 12) {
                                    hours += 12;
                                }
                            } else if (shiftsplit[4] === 'A') {
                                if (hours === 12) {
                                    shiftsplit = 0;
                                }
                            }

                            // Convert to time format
                            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                        });
                        this.shiftin = timePerShiftCode[0];
                        this.shiftout = timePerShiftCode[1];
                    }
                    // overlap validatio =====================================
                    var shiftindateconvert = this.pipe.transform(e.date, "yyyy-MM-dd " + this.shiftin)
                    var shiftindate = new Date(shiftindateconvert)
                    var shiftindateforif = this.pipe.transform(e.date, 'MM-dd-yyyy')
                    var shiftoutdateconvert = this.pipe.transform(e.date, "yyyy-MM-dd " + this.shiftout)
                    var shiftoutdate = new Date(shiftoutdateconvert)
                    var otstartshift = new Date(x >= 1 ? e.ot_start[i].id : e.ot_start[i].id)
                    var otstartshiftchild = new Date(x >= 1 ? e.ot_start[i].id : e.ot_start[i].id)

                    var start = this.pipe.transform(x >= 1 ? e.ot_start[i].id : e.ot_start[i].id, 'MM-dd-yyyy')
                    var startchild = new Date(x >= 1 ? e.ot_start[i].id : e.ot_start[i].id)
                    var end = new Date(x >= 1 ? e.ot_end[x].id : e.ot_end[i].id)
                    var endchild = this.pipe.transform(x > 1 ? e.ot_end[x].id : e.ot_end[i].id, 'yyyy-MM-dd HH:mm:ss')

                    // min max step validation ===============================

                    var mins = x > 1 ? e.ottiming[x].id : e.ottiming[i].id
                    var maxs = x > 1 ? e.ottiming[x].id : e.ottiming[i].id
                    var steps = x > 1 ? e.ottiming[x].id : e.ottiming[i].id

                    var min = mins == 12698 ? value.payload.otSettingsPre.min :
                        mins == 12699 ? value.payload.otSettingsPost.min :
                            mins == 12708 ? value.payload.otSettingsRDHD.min : 0

                    var max = maxs == 12698 ? value.payload.otSettingsPre.max :
                        maxs == 12699 ? value.payload.otSettingsPost.max :
                            maxs == 12708 ? value.payload.otSettingsRDHD.max : 0

                    var step = steps == 12698 ? value.payload.otSettingsPre.step :
                        steps == 12699 ? value.payload.otSettingsPost.step :
                            steps == 12708 ? value.payload.otSettingsRDHD.step : 0


                    var ottimeinvalidation = this.pipe.transform(e.ot_start[x].id, 'yyyy-MM-ddTHH:mm') //e.ot_start[x].id
                    var ottimeoutvalidation = this.pipe.transform(e.ot_end[x].id, 'yyyy-MM-ddTHH:mm') //e.ot_start[x].id

                    var t_in = new Date(ottimeinvalidation)
                    var t_out = new Date(ottimeoutvalidation)

                    const rangeInMilliseconds = t_in.getTime() - t_out.getTime();
                    const rangeInMinutes = Math.floor(rangeInMilliseconds / 60000);
                    const remainingMinutes = rangeInMinutes % 60;


                    var remove_nega = Math.abs(rangeInMinutes)
                    var min_range = remove_nega - min

                    var range = min_range / step
                    var minrage = Math.abs(min_range)

                    this.start = new Date(x >= 1 ? e.ot_start[x].id : e.ot_start[i].id)
                    this.end = new Date(x >= 1 ? e.ot_end[x].id : e.ot_end[i].id)


                    if (this.isflexivalida == false) {
                        // VALIDATION FOR PARENT ===================================================
                        if (this.datasource[i].ot_start.length <= 1) {
                            var codetiming = x > 1 ? e.ottiming[x].id : e.ottiming[i].id
                            if (codetiming == 12708 && e.shiftCode[x].id != "RD" || codetiming == 12698 || codetiming == 12699) {
                                if (e.ottiming[i].id == 12699 && otstartshift < shiftoutdate && start <= e.date) {
                                    this.failedMessage.title = 'Warning'
                                    this.failedMessage.message = "Cannot file Post-Overtime before Schedule In"
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                }
                                else if (e.ottiming[i].id == 12698 && end > shiftindate && start <= shiftindateforif) {
                                    this.failedMessage.title = 'Warning'
                                    this.failedMessage.message = "Cannot file Pre-Overtime before Schedule In"
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                    return
                                }

                                else if (e.ottiming[i].id == 12698 && otstartshift > shiftindate && start > shiftindateforif) {
                                    this.failedMessage.title = 'Warning'
                                    this.failedMessage.message = "Cannot File Post-Shift Overtime within Schedule"
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                    return

                                } else if ( value.payload.enablePostShift == true && e.ottiming[i].id == 12699 || value.payload.enablePreShift == true && e.ottiming[i].id == 12698) {

                                    if (this.end < this.start && e.ottiming[i].id == 12698) {
                                        this.failedMessage.message = 'end time overlap to start time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)
                                        return
                                    } else if (e.ottiming[i].id == 12699 && this.start > this.end) {
                                        this.failedMessage.message = 'start time overlap to end time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)
                                    } else if (min <= remove_nega && max >= remove_nega) {

                                        if (remove_nega >= step) {
                                            if (Number.isInteger(range)) {
                                                this.pushEvent.emit(false)
                                            }
                                            else {

                                                this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                                this.message.open(this.failedMessage);
                                                this.pushEvent.emit(true)

                                            }
                                        } else {

                                            this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                            this.message.open(this.failedMessage);
                                            this.pushEvent.emit(true)

                                        }
                                    } else if (min >= remove_nega || max <= remove_nega) {
                                        var error = min > remove_nega ? "minumum " + min + " " + "minutes" : max < remove_nega ? "maximum " + max + " minutes" : ""
                                        this.failedMessage.message = "Filing of Overtime not meet the rules of " + error
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)
                                    }
                                    else {
                                        this.pushEvent.emit(false)
                                    }
                                }
                            }else if (e.ottiming[i].id == 12708 && e.shiftCode[i].id == 'RD' || e.shiftCode[i].id !== 'RD' && e.ottiming[i].id == 12708) {
                                this.pushEvent.emit(false)

                                var startrd = this.pipe.transform(x > 1 ?  e.ot_start[x].id : e.ot_start[i].id , 'yyyy-MM-dd HH:mm')
                                var endrd = this.pipe.transform(x > 1 ? e.ot_end[x].id : e.ot_end[i].id, 'yyyy-MM-dd HH:mm')

                                e.ot_start[x].id = startrd
                                e.ot_end[x].id = endrd

                                if (this.end < this.start && e.ottiming[x].id == 12708 && date == 'dt') {
                                    this.failedMessage.message = 'end time overlap to start time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                    return
                                } else if (e.ottiming[x].id == 12708 && this.start > this.end && date == 'df') {
                                    this.failedMessage.message = 'start time overlap to end time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                } else if (min <= remove_nega && max >= remove_nega) {

                                    if (remove_nega >= step) {
                                        if (Number.isInteger(range)) {
                                            this.pushEvent.emit(false)
                                        }
                                        else {

                                            this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                            this.message.open(this.failedMessage);
                                            this.pushEvent.emit(true)

                                        }
                                    } else {

                                        this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)

                                    }
                                } else if (min >= remove_nega || max <= remove_nega) {
                                    var error = min > remove_nega ? "minumum " + min + " " + "minutes" : max < remove_nega ? "maximum " + max + " minutes" : ""
                                    this.failedMessage.message = "Filing of Overtime not meet the rules of " + error
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                }
                                else {
                                    this.pushEvent.emit(false)
                                }

                            } else if (e.ottiming[x].id == 12708 && e.shiftCode[x].id != "RD" || e.ottiming[x].id == 12698 || e.ottiming[x].id == 12699) {
                                if (e.disabled[i].id == true && this.datasource[i].ot_start.length <= 1) {
                                    if (e.ottiming[i].id == 12699 && otstartshift < shiftoutdate && start <= e.date) {
                                        this.failedMessage.title = 'Warning'
                                        this.failedMessage.message = "Cannot file Post-Overtime before Schedule In"
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)
                                    }
                                    else if (e.ottiming[i].id == 12698 && end > shiftindate && start <= shiftindateforif) {
                                        this.failedMessage.title = 'Warning'
                                        this.failedMessage.message = "Cannot file Pre-Overtime before Schedule In"
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)
                                        return
                                    }

                                    else if (e.ottiming[i].id == 12698 && otstartshift > shiftindate && start > shiftindateforif) {
                                        this.failedMessage.title = 'Warning'
                                        this.failedMessage.message = "Cannot File Post-Shift Overtime within Schedule"
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)
                                        return

                                    } else if (value.payload.isAllowed == true && value.payload.enablePostShift == true && e.ottiming[i].id == 12699 ||
                                        value.payload.isAllowed == true && value.payload.enablePreShift == true && e.ottiming[i].id == 12698 || value.payload.isRestDay == false && e.ottiming[i].id == 12708 ) {

                                        if (this.end < this.start && e.ottiming[i].id == 12698) {
                                            this.failedMessage.message = 'end time overlap to start time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                            this.message.open(this.failedMessage);
                                            this.pushEvent.emit(true)
                                            return
                                        } else if (e.ottiming[i].id == 12699 && this.start > this.end) {
                                            this.failedMessage.message = 'start time overlap to end time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                            this.message.open(this.failedMessage);
                                            this.pushEvent.emit(true)
                                        } else if (min <= remove_nega && max >= remove_nega) {

                                            if (remove_nega >= step) {
                                                if (Number.isInteger(range)) {
                                                    this.pushEvent.emit(false)
                                                }
                                                else {

                                                    this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                                    this.message.open(this.failedMessage);
                                                    this.pushEvent.emit(true)

                                                }
                                            } else {

                                                this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                                this.message.open(this.failedMessage);
                                                this.pushEvent.emit(true)

                                            }
                                        } else if (min >= remove_nega || max <= remove_nega) {
                                            var error = min > remove_nega ? "minumum " + min + " " + "minutes" : max < remove_nega ? "maximum " + max + " minutes" : ""
                                            this.failedMessage.message = "Filing of Overtime not meet the rules of " + error
                                            this.message.open(this.failedMessage);
                                            this.pushEvent.emit(true)
                                        }
                                        else {
                                            this.pushEvent.emit(false)
                                        }
                                    } else if (e.disabled[x].id == true && this.datasource[i].ot_start.length > 1) {
                                        if (e.ottiming[x].id == 12699 && otstartshiftchild < shiftoutdate && this.datasource[i].ot_start.length > 1) {
                                            this.failedMessage.title = 'Warning'
                                            this.failedMessage.message = "Cannot file Post-Overtime before Schedule In"
                                            this.message.open(this.failedMessage);
                                            this.pushEvent.emit(true)
                                            return
                                        } else if ((e.ottiming[x].id == 12698) && (shiftindate < otstartshiftchild) && (startchild <= shiftindate) && (this.datasource[i].ot_start.length > 1)) {
                                            this.failedMessage.title = 'Warning'
                                            this.failedMessage.message = "Cannot File Post-Shift Overtime within Schedule"
                                            this.message.open(this.failedMessage);
                                            this.pushEvent.emit(true)
                                            return
                                        } else {
                                            this.pushEvent.emit(false)
                                            return
                                        }
                                    }
                                }

                            }
                        }
                        // FOR CHILD VALIDATION ==========================================
                        else if (this.datasource[i].ot_start.length > 1) {

                            this.start = new Date(x >= 1 ? e.ot_start[x].id : e.ot_start[i].id)
                            this.end = new Date(x >= 1 ? e.ot_end[x].id : e.ot_end[i].id)

                            if (e.ottiming[x].id == 12699 && this.start < shiftoutdate && start <= e.date) {
                                this.failedMessage.title = 'Warning'
                                this.failedMessage.message = "Cannot file Post-Overtime before Schedule In"
                                this.message.open(this.failedMessage);
                                this.pushEvent.emit(true)
                            }
                            else if (e.ottiming[x].id == 12698 && this.end > shiftindate && start <= shiftindateforif) {
                                this.failedMessage.title = 'Warning'
                                this.failedMessage.message = "Cannot file Pre-Overtime before Schedule In"
                                this.message.open(this.failedMessage);
                                this.pushEvent.emit(true)
                                return
                            }

                            else if (e.ottiming[x].id == 12698 && this.start > shiftindate && start > shiftindateforif) {
                                this.failedMessage.title = 'Warning'
                                this.failedMessage.message = "Cannot File Post-Shift Overtime within Schedule"
                                this.message.open(this.failedMessage);
                                this.pushEvent.emit(true)
                                return

                            } else if (value.payload.isAllowed || !value.payload.isAllowed && value.payload.enablePostShift == true && e.ottiming[x].id == 12699 ||
                                value.payload.isAllowed || !value.payload.isAllowed && value.payload.enablePreShift == true && e.ottiming[x].id == 12698) {

                                if (this.end < this.start && e.ottiming[x].id == 12698) {
                                    this.failedMessage.message = 'end time overlap to start time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                    return
                                } else if (e.ottiming[x].id == 12699 && this.start > this.end) {
                                    this.failedMessage.message = 'start time overlap to end time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                } else if (min <= remove_nega && max >= remove_nega) {

                                    if (remove_nega >= step) {
                                        if (Number.isInteger(range)) {
                                            this.pushEvent.emit(false)
                                        }
                                        else {

                                            this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                            this.message.open(this.failedMessage);
                                            this.pushEvent.emit(true)

                                        }
                                    } else {

                                        this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)

                                    }
                                } else if (min >= remove_nega || max <= remove_nega) {
                                    var error = min > remove_nega ? "minumum " + min + " " + "minutes" : max < remove_nega ? "maximum " + max + " minutes" : ""
                                    this.failedMessage.message = "Filing of Overtime not meet the rules of " + error
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)
                                }
                                else {
                                    this.pushEvent.emit(false)
                                }
                            }else if(e.ottiming[x].id == e.ottiming[i].id){

                                e.forEach(start => {

                                });

                            }
                        }
                    } else {

                        var ottimeinvalidation = this.pipe.transform(e.ot_start[x].id, 'yyyy-MM-ddTHH:mm') //e.ot_start[x].id
                        var ottimeoutvalidation = this.pipe.transform(e.ot_end[x].id, 'yyyy-MM-ddTHH:mm') //e.ot_start[x].id

                        var t_in = new Date(ottimeinvalidation)
                        var t_out = new Date(ottimeoutvalidation)

                        const rangeInMilliseconds = t_in.getTime() - t_out.getTime();
                        const rangeInMinutes = Math.floor(rangeInMilliseconds / 60000);
                        const remainingMinutes = rangeInMinutes % 60;


                        var remove_nega = Math.abs(rangeInMinutes)
                        var min_range = remove_nega - min

                        var range = min_range / step
                        var minrage = Math.abs(min_range)

                        if (value.payload.isAllowed == true && value.payload.enablePostShift == true && e.ottiming[x].id == 12699
                            || value.payload.isAllowed == true && value.payload.enablePreShift == true && e.ottiming[x].id == 12698) {
                            this.pushEvent.emit(false)

                            if (this.end < this.start && e.ottiming[x].id == 12698) {
                                this.failedMessage.message = 'end time overlap to start time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                this.message.open(this.failedMessage);
                                this.pushEvent.emit(true)
                                return
                            } else if (e.ottiming[x].id == 12699 && this.start > this.end) {
                                this.failedMessage.message = 'start time overlap to end time ' + this.pipe.transform(this.end, 'MM-dd-yyyy HH:mm')
                                this.message.open(this.failedMessage);
                                this.pushEvent.emit(true)
                            } else if (this.start < new Date(this.schedin) && e.ottiming[x].id == 12699) {
                                this.failedMessage.title = 'Warning'
                                this.failedMessage.message = "Cannot file Post-Overtime before Schedule In"
                                this.message.open(this.failedMessage);
                                this.pushEvent.emit(true)
                            } else if (this.end > new Date(this.schedin) && e.ottiming[x].id == 12698) {
                                this.failedMessage.title = 'Warning'
                                this.failedMessage.message = "Cannot file Pre-Overtime before Schedule In"
                                this.message.open(this.failedMessage);
                                this.pushEvent.emit(true)
                            }
                            else if (min <= remove_nega && max >= remove_nega) {

                                if (remove_nega >= step) {
                                    if (Number.isInteger(range)) {
                                        this.pushEvent.emit(false)
                                    }
                                    else {

                                        this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                        this.message.open(this.failedMessage);
                                        this.pushEvent.emit(true)

                                    }
                                } else {

                                    this.failedMessage.message = "Filing of Overtime not meet the rules of step " + step + " minutes"
                                    this.message.open(this.failedMessage);
                                    this.pushEvent.emit(true)

                                }
                            } else if (min >= remove_nega || max <= remove_nega) {
                                var error = min > remove_nega ? "minumum " + min + " " + "minutes" : max < remove_nega ? "maximum " + max + " minutes" : ""
                                this.failedMessage.message = "Filing of Overtime not meet the rules of " + error
                                this.message.open(this.failedMessage);
                                this.pushEvent.emit(true)
                            }
                            else {
                                this.pushEvent.emit(false)
                            }
                        }
                    }
            }
        })

    }

    date_min_max(e, x, isMin) {
        //parent
       var df = this.pipe.transform(e.ot_start[x].id,'yyyy-MM-dd')
       var dt = this.pipe.transform(e.ot_end[x].id,'yyyy-MM-dd')

        var datemin = new Date(df + ' 00:00')
        var datemax = new Date(dt + ' 23:59')

        //child
        // var datemin = new Date(e.otdate[x].id + ' 00:00')
        // var datemax = new Date(e.otdate[x].id + ' 23:59')

        //parent
        var min = new Date(datemin.setDate(datemin.getDate() - 1))
        var max = new Date(datemax.setDate(datemax.getDate() + 1))

        //child
        // var min = new Date(datemin.setDate(datemin.getDate() - 1))
        // var max = new Date(datemax.setDate(datemax.getDate() + 1))
        return isMin ? min : max

    }

}


