import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ChangeLog, filingForm, leaveForm } from 'app/model/administration/filing';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { TimekeepingGenerationComponent } from 'app/modules/employee/employee-setup/timekeeping-generation/timekeeping-generation.component';
import { FilingService } from 'app/services/filingService/filing.service';
import { ModalReasonComponent } from '../change-schedule/modal-reason/modal-reason.component';
import { ReasonmodalComponent } from './reasonmodal/reasonmodal.component';
import { TimemodalComponent } from './timemodal/timemodal.component';
import { TimeoutmodalComponent } from './timeoutmodal/timeoutmodal.component';
import { myData } from 'app/model/app.moduleId';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NGX_MAT_DATE_FORMATS, NgxMatDateFormats } from '@angular-material-components/datetime-picker';
import { Moment } from 'moment';
import _ from 'lodash';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { CoreService } from 'app/services/coreService/coreService.service';

 const MOMENT_DATETIME_WITH_SECONDS_FORMAT = 'MM-DD-YY hh:mm A';

export const CUSTOM_MOMENT_FORMATS = {
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
    selector: 'app-change-log',
    templateUrl: './change-log.component.html',
    styleUrls: ['./change-log.component.css'],
    providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE],
        },
        {
          provide: MAT_DATE_FORMATS ,
          useValue: MY_FORMATS ,
        },
        {
        provide: NGX_MAT_DATE_FORMATS,
        useValue: CUSTOM_MOMENT_FORMATS,
        },

      ],

})
export class ChangeLogComponent implements OnInit {
    // public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = true;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    dateFrom: Moment;
    dateTo: Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public time12Hours = true
    public color: ThemePalette = 'primary';
    @Output() validate = new EventEmitter<any>();
    @Input() datasource: any[]
    @Input() selectedemployee: any[]
    @ViewChild('CLTable') CLTable: MatTable<any>;
    dialogRefreason: MatDialogRef<ReasonmodalComponent, any>;
    dialogReftime: MatDialogRef<TimemodalComponent, any>;
    dialogReftimeout: MatDialogRef<TimeoutmodalComponent, any>;
    imageUrl: any
    leaveForm: FormGroup
    filingForm: FormGroup
    CLSource = [];
    isSave: boolean = false
    id: string = ""
    disabledbutton: boolean = false
    pipe = new DatePipe('en-US');
    newdate = new Date ('h:mm a')
    clColumns: string[] = ['actioncl', 'datecl', 'shift_codecl', 'sched_incl', 'sched_outcl', 'time_incl', 'time_outcl', 'reasoncl', 'clstatus', 'upload_filecl'];
    failedMessage = {...FailedMessage}
    tid : any
    imagefiless : any = []
    fileExtension: string | undefined;
    moduleId : any
    // min = new Date(2023 ,4 ,20)
    // max = new Date(2023 ,4 ,27)
    @Input() clsubmit: boolean = false
    min = new Date()
    max = new Date()
    loginId = 0
    // minafter = new Date()
    idsimage : any = []
    late : boolean = false
    saveMessage = {...SaveMessage}
    constructor(private fb: FormBuilder, public dialog: MatDialog,
        private message: FuseConfirmationService,
        private route: ActivatedRoute,
        private storageServiceService: StorageServiceService,
        private coreService: CoreService,
        private router: Router,
        private filingService: FilingService,) { }
    get ff() {
        return this.filingForm.value
    }



    ngOnInit() {

        this.filingForm = this.fb.group(new filingForm());
        this.leaveForm = this.fb.group(new leaveForm());
        // this.datasource = []
        var action = sessionStorage.getItem("action")
        this.moduleId = "33"

        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id !== "") {
            if (action == 'edit') {
            this.disabledbutton = false
                this.filingService.getChangeLog(this.id).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.datasource.push({
                                datecl: this.pipe.transform(value.payload.date,'MM-dd-yyyy'),
                                changeLogCode: value.payload.changeLogCode,
                                sched_incl: this.pipe.transform(value.payload.timeIn,'MM-dd-yyyy HH:mm '),
                                sched_outcl: this.pipe.transform( value.payload.timeOut,'MM-dd-yyyy HH:mm '),
                                timeIn: value.payload.timeIn,
                                timeOut: value.payload.timeOut,
                                reason: value.payload.reason,
                                uploadPath: value.payload.uploadPath,
                                status: value.payload.status,
                                changeLogId: value.payload.changeLogId,
                                date : value.payload.date,
                                employeeId : value.payload.employeeId,
                            })

                            this.CLTable.renderRows()

                            //   this.initData()
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
            }else if(action == 'view'){
            this.disabledbutton = true
                this.filingService.getChangeLog(this.id).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.datasource.push({
                                datecl: this.pipe.transform(value.payload.date,'MM-dd-yyyy'),
                                changeLogCode: value.payload.changeLogCode,
                                sched_incl: this.pipe.transform(value.payload.timeIn,'MM-dd-yyyy HH:mm '),
                                sched_outcl: this.pipe.transform( value.payload.timeOut,'MM-dd-yyyy HH:mm '),
                                timeIn: value.payload.timeIn,
                                timeOut: value.payload.timeOut,
                                reason: value.payload.reason,
                                uploadPath: value.payload.uploadPath,
                                status: value.payload.status,
                                changeLogId: value.payload.changeLogId,
                                disable : true
                            })

                            this.CLTable.renderRows()

                            //   this.initData()
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
            //fetch edit data here


        } else {

            this.datasource.forEach(element => {
                if (element.status == "") {
                    element.disable = false
                }else{
                    element.disable = true
                }
        });

        }
    }

    ngOnChanges(changes: SimpleChanges): void{
        if ("clsubmit" in changes) {
            if (changes.clsubmit.currentValue) {
             this.submit()
            }
        }
    }

    // uploadFile(event, id) {
    //     let reader = new FileReader(); // HTML5 FileReader API
    //     let file = event.target.files[0];
    //     console.log(id)
    //     let element: HTMLElement = document.querySelector("#" + id) as HTMLElement;
    //     let fileName = event.target.files[0].name;
    //     element.setAttribute('value', fileName)
    //     if (event.target.files && event.target.files[0]) {
    //         reader.readAsDataURL(file);

    //         // When file uploads set it to file formcontrol
    //         reader.onload = () => {
    //             this.imageUrl = reader.result;
    //             this.leaveForm.patchValue({
    //                 file: reader.result
    //             });

    //         }
    //         // ChangeDetectorRef since file is loading outside the zone
    //         //   this.cd.markForCheck();
    //     }
    // }

    async uploadFile(event, id,i,e) {
        let fileName = event.target.files[0].name;
        this.fileExtension = this.getFileExtension(fileName);
        var namefile =  this.fileExtension

        const fileToUpload0 = event.target.files[0];
        const name = fileToUpload0.name;

        let reduce: File;

        console.log(1)
        if (namefile == "jpg" || namefile == "png")  {
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
       e.uploadPath = e.uploadPath.replace("C:\\fakepath\\",'')
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

    reasonmodal(e, i) {
        if (i == 0 && this.datasource.length > 1) {
            if (this.dialogRefreason) {
                this.dialogRefreason.close();
            }
            this.dialogRefreason = this.dialog.open(ReasonmodalComponent, {
                width: '20%',
                height: '15%',
            })

            this.dialogRefreason.afterClosed().subscribe(result => {
                if (result) {
                    for (let ii = 1; ii < this.datasource.length; ii++) {
                        if (this.datasource[ii].status == "") {
                            this.datasource[ii].reason = e.target.value
                        }
                    }


                    // this.CSTable.renderRows()
                }
            })
        }
    }
    openreason(e, i) {
        if (i == 0 && this.datasource.length > 1) {
            if (this.dialogReftime) {
                this.dialogReftime.close();
            }
            this.dialogReftime = this.dialog.open(ReasonmodalComponent, {
                width: '20%',
                height: '15%',
            })

            this.dialogReftime.afterClosed().subscribe(result => {
                if (result) {
                    for (let ii = 1; ii < this.datasource.length; ii++) {
                        this.datasource[ii].reasoncl = e.target.value
                    }
                    // this.CSTable.renderRows()
                }
            })
        }
    }

    timemodal(e, i) {
        if (i == 0 && this.datasource.length > 1) {
            if (this.dialogReftime) {
                this.dialogReftime.close();
            }
            this.dialogReftime = this.dialog.open(TimemodalComponent, {
                width: '20%',
                height: '15%',
            })

            this.dialogReftime.afterClosed().subscribe(result => {
                if (result) {
                    for (let ii = 1; ii < this.datasource.length; ii++) {
                        this.datasource[ii].timeIn = e.value
                    }
                    // this.CSTable.renderRows()
                }
            })
        }
    }


    timeoutmodal(e, i) {
        if (i == 0) {
            if (i == 0 && this.datasource.length > 1) {
                if (this.dialogReftime) {
                    this.dialogReftime.close();
                }
                this.dialogReftime = this.dialog.open(TimemodalComponent, {
                    width: '20%',
                    height: '15%',
                })

                this.dialogReftime.afterClosed().subscribe(result => {
                    if (result) {
                        for (let ii = 1; ii < this.datasource.length; ii++) {
                            this.datasource[ii].time_outcl = e
                        }
                        // this.CSTable.renderRows()
                    }
                })
            }
        }
    }

    handleDeleteBreak(index) {
        this.datasource.splice(index, 1);
        this.CLTable.renderRows();

    }

    public async submit() {
        this.datasource.forEach(element => {
            element.date = this.pipe.transform(element.date, 'yyyy-MM-ddTHH:mm')
            element.timeIn = this.pipe.transform(element.timeIn, 'yyyy-MM-ddTHH:mm')
            element.timeOut = this.pipe.transform(element.timeOut, 'yyyy-MM-ddTHH:mm')
        });
        // var save = this.datasource.filter(x =>x.disable == false && x.status !== "Approved"  && this.pipe.transform(x.sched_incl,'yyyy-MM-ddTHH:mm:ss') != this.pipe.transform(x.timeIn,'yyyy-MM-ddTHH:mm:ss') && this.pipe.transform(x.sched_outcl,'yyyy-MM-ddTHH:mm:ss') != this.pipe.transform(x.timeOut,'yyyy-MM-ddTHH:mm:ss') && x.reason != "")
        var save = this.datasource.filter(x =>x.disable == false && x.status != "Approved" )
        if (save.length == 0) {
            this.failedMessage.title = "Warning!"
            this.failedMessage.message = "No logs changes!"
            this.message.open(this.failedMessage);
            return
        }

        this.tid = sessionStorage.getItem('moduleId') == "68" ? this.selectedemployee : sessionStorage.getItem('u')

        var cancelsave =  await this.coreService.required(this.tid,save,'33',0)
        if (cancelsave) {
            return
        }

        const dialogRef = this.message.open(SaveMessage);

        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.filingService.postChangeLog(save,this.tid,this.late).subscribe({

                    next: (value: any) => {
                         //   Error lock cannot file ==============================
                         this.coreService.valid(value, this.late, save.length,true,['/detail/filing-view'],"").then((res)=>{
                            if (res.saveNow) {
                                this.late = res.lateSave
                                this.submit()
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

    cancel(e) {
        // cancelChangeSchedule
        var mid = myData.filingtypeencryp
        const dialogRef = this.message.open(SuccessMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.filingService.postCancelFiling(mid, e,this.late).subscribe({

                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.message.open(SuccessMessage);
                            this.isSave = false
                        }
                         //   Error lock cannot file ==============================
                         else if(value.payload.lockingState == 2 && value.payload.valiationState == 2 || value.payload.lockingState == 2 && value.payload.valiationState == 0){
                            this.failedMessage = value.message
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
                                    this.filingService.postCancelFiling(mid, e,this.late = true).subscribe({
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

    disabled(e) {

        console.log(e)
        this.validate.emit(e)
    }


    validation(i,e,a) {
        this.tid = sessionStorage.getItem('u')
        var filingtype = this.leaveForm.value.leaveFileTypeId
        var submodule = this.leaveForm.value.leaveTypeId

        var df = this.leaveForm.value.dateFrom
        var dt = this.leaveForm.value.dateTo

        if (e.shiftId == 5 && e.sched_incl == "0" && a =='df') {

            var timeplus  = new Date(e.timeIn)
            var addtmime = new Date(timeplus.setHours(timeplus.getHours()+1))
            e.timeOut =  addtmime
        }


        var request = {
            moduleId: myData.filingtype,
            subModuleId: 0,
            dateFrom: df,
            dateTo: dt,
            overtimeTiming: 0,
            shiftId: 0,
            leaveFilingType: filingtype,
            targetId : this.selectedemployee == null || "" ? this.tid : this.selectedemployee,
        }

        this.filingService.getFilingValidationOnUI(request).subscribe({
            next: (value: any) => {
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
                // if(canfilebefore != null && canfilebefore > 0 && canfileafter != null && canfileafter > 0 ){

                //     this.min = new Date(curretndate.setDate(curretndate.getDate()))


                // }

                // this.min = new Date(curretndate.setDate(curretndate.getDate()+canfilebefore+1))
                // this.min = new Date(curretndate.setDate(curretndate.getDate()+canfileafter))



                if (value.payload.isAllowed == false) {
                    //      FailedMessage.title = "Warning"
                    //      FailedMessage.message = value.payload.message
                    //  var def = this.message.open(FailedMessage)
                }
            }
        })


    }


    samedate(i) {

        if (this.datasource[i].datecl !=null || "") {
            var timein = moment(new Date).format('hh:mm A')
            var timeinou = moment(new Date).format('hh:mm A')
            var date = moment(this.datasource[i].date).format('yyyy-MM-DD')

            this.datasource[i].timeIn = new Date(date+" "+timein)
            this.datasource[i].timeOut = new Date(date+" "+timeinou)

        }
        this.datasource[i].timeIn = new Date(date+" "+timeinou)
        this.datasource[i].timeOut = new Date(date+" "+timeinou)
    }



}
