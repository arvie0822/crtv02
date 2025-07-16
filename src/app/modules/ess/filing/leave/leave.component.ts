import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { filingForm, Leave, leaveForm, LeaveMonitoring, lvTable } from 'app/model/administration/filing';
import { myData } from 'app/model/app.moduleId';
import { DropdownOptions, DropdownRequest } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { FilingService } from 'app/services/filingService/filing.service';
import { MasterService } from 'app/services/masterService/master.service';
import { ShiftService } from 'app/services/shiftService/shift.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { GF } from 'app/shared/global-functions';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, pipe, takeUntil } from 'rxjs';
import _ from 'lodash';
import { StorageServiceService } from 'app/services/storageService/storageService.service';

enum mode {
    next = 1,
    search = 2,
    onload = 3,
}

@Component({
    selector: 'app-leave',
    templateUrl: './leave.component.html',
    styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
    @Input() selectedemployee: any
    @Input() isMultiShift: boolean
    @ViewChild('LVTable') LVTable: MatTable<any>;
    @ViewChild('LMTable') LMTable: MatTable<any>;
    @Output() ismultiple = new EventEmitter<any>();
    @Output() employeeecnryp = new EventEmitter<any>();
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
    dropdownOptions = new DropdownOptions
    dropdownFixRequest = new DropdownRequest
    dropdownRequest = new DropdownRequest
    dropdownShiftRequest = new DropdownRequest
    leaveForm: FormGroup
    filingForm: FormGroup
    imageUrl: any
    isSave: boolean = false
    LVSource = [];
    id: string
    editing = false;
    originalValue: string;
    leavetyperequest = new DropdownRequest
    index = 0
    disable: boolean = false
    disabledbutton: boolean = false
    min = new Date()
    pipe = new DatePipe('en-US');
    tid: any
    showpaid: boolean = false
    action = ""
    LMSource: any = [];
    complete = false
    inputChange: UntypedFormControl = new UntypedFormControl();
    protected _onDestroy = new Subject<void>();
    oldShiftCode = []
    failedMessage = { ...FailedMessage}
    savemessage = { ...SaveMessage}
    shift : ""
    isEdit : ""
    df : any
    dt : any
    datashiftcode : any
    imagefiless : any = []
    clickCount: number = 0;
    loginId = 0
    idsimage
    fileExtension: string | undefined;
    moduleId: any
    late : boolean = false
    saveMessage = { ...SaveMessage}
    lvColumns: string[] = ['lvAction', 'lvDateFrom', 'lvDateTo', 'lvShiftCode', 'lvType', 'lvhourly', 'lvoptions', 'lvstart', 'lvend', 'lvreason', 'lvUpload_File'];
    lmColumns: string[] = ['leave_type', 'total_leave', 'used_leave', 'pending_approval', 'pending_schedule', 'available_leave'];
    leave = [
        { id: 0, description: 'Vacation Leave' },
        { id: 1, description: 'Sick Leave' },
        { id: 2, description: 'Emergency Leave' },
    ]

    hour = [
        { id: 0, description: 'Whole day' },
        { id: 1, description: 'Half day' },
        { id: 2, description: 'Hourly' },
    ]

    application = [
        { id: 0, description: 'No' },
        { id: 1, description: 'Yes' },
    ]

    half = [
        { id: 1, description: '1st half' },
        { id: 2, description: '2nd half' },
    ]

    paid = [
        { id: true, description: 'Yes' },
        { id: false, description: 'No' },
    ]

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private message: FuseConfirmationService,
        private router: Router,
        private filingService: FilingService,
        private route: ActivatedRoute,
        private tenantService: TenantService,
        private coreService: CoreService,
        private masterService: MasterService,
        private shiftService: ShiftService,
        private storageServiceService : StorageServiceService
    ){}

    get lf() {
        return this.leaveForm.value
    }
    get ff() {
        return this.filingForm.value
    }

    get isMulti() {
        return this.isMultiShift && GF.IsEmpty(this.leaveForm.value.shiftId)
    }

    ngOnInit() {

        this.employeeecnryp.emit(0)

        this.filingForm = this.fb.group(new filingForm());
        this.leaveForm = this.fb.group(new Leave());
        this.leaveForm.reset()
        this.disable = true
        this.disabled_df_ft()
        this.leaveForm.get('leaveFileTypeId').disable()
        this.id = this.route.snapshot.paramMap.get('id');
        this.moduleId = "34"
        if (sessionStorage.getItem('moduleId') == "81") {
            this.tid = sessionStorage.getItem('u')
            this.leavetypedropdown(this.tid)
        } else {
            this.tid = this.selectedemployee
            this.leavetypedropdown(this.tid)
        }

        this.dropdownFixRequest.id.push(
            { dropdownID: 0, dropdownTypeID: 90 },
            { dropdownID: 0, dropdownTypeID: 79 },
        )

          this.tid = sessionStorage.getItem('u')
        var filingtype = this.leaveForm.value.leaveFileTypeId
        var submodule = this.leaveForm.value.leaveTypeId == null ? 0 : this.leaveForm.value.leaveTypeId

        var date = new Date(this.leaveForm.value.dateFrom)
        date.setDate(date.getDate() + 1)

        var df = this.isMultiShift && !GF.IsEmpty(this.leaveForm.value.dateFrom) ? new Date(date) : new Date
        var dt = this.isMultiShift && !GF.IsEmpty(this.leaveForm.value.dateTo) ? new Date(date) : new Date
        var request = {
            moduleId: myData.filingtype,
            subModuleId: 0,
            // dateFrom: this.filingForm.value.dateFrom == null ? "2023-01-01T12:00:00" : this.filingForm.value.dateFrom,
            // dateTo: this.filingForm.value.dateTo == null ? "2023-12-01T12:00:00" : this.filingForm.value.dateTo,
            dateFrom: new Date(),
            dateTo: new Date(),
            overtimeTiming: 0,
            shiftId: 0,
            leaveFilingType: 0,
            targetId : this.tid
        }


        forkJoin({
            dropdownFixRequest: this.masterService.getDropdownFix(this.dropdownFixRequest),
            // dropdown: this.tenantService.getDropdown(this.dropdownRequest),
            leavetype: this.coreService.getCoreDropdownwithparam(1034, this.leavetyperequest, this.tid),
            shift: this.shiftService.getShiftPerDayDropdown(this.dropdownRequest),
            validationtype: this.filingService.getFilingValidationOnUI(request),
        })
        .subscribe({
            next: (response) => {
                // this.dropdownOptions.filingdef = this.action == "view" ? response.filingtype.payload : response.filingtype.payload.filter(x => response.validationtype.payload.modules.includes(x.dropdownID))
                // this.dropdownOptions.Leavefilingdef = response.dropdownFixRequest.payload.filter(x => x.dropdownTypeID === 79)
                this.dropdownOptions.Leavecategory = response.leavetype.payload
                this.dropdownOptions.shiftCodeDef = response.shift.payload

                this.lvtable()
                if (this.id !== "") {
                    this.coreService.currentIdleState.subscribe((idleState) => {
                        this.datashiftcode = idleState;
                    });
                    this.action = sessionStorage.getItem("action")
                    if (this.action == 'edit') {
                        this.disabledbutton = false
                        this.filingService.getLeave(this.id).subscribe({
                            next: (value: any) => {
                                this.validation("")
                                this.ismultiple.emit(value.payload.isMultiShift)
                                if (value.statusCode == 200) {
                                    this.LVSource.push({
                                        dateFrom: value.payload.dateFrom,
                                        dateTo: value.payload.dateTo,
                                        shiftId: GF.IsEmptyReturn(value.payload.shiftId, 0),
                                        isMultiShift: this.isMultiShift,
                                        // shiftCode: GF.IsEmpty(value.payload.shiftId) ? "" : response.validationtype.payload.shiftCodes.find(x => x.dropdownID == value.payload.shiftId).description,
                                        shiftCode: this.datashiftcode,
                                        leaveTypeId: value.payload.leaveTypeId,
                                        leaveFileTypeId: value.payload.leaveFileTypeId,
                                        leaveTypeIddescrip: response.leavetype.payload.find(item => item.dropdownID == value.payload.leaveTypeId)?.description || "",
                                        leaveFileTypeIddesecrip: response.dropdownFixRequest.payload.find(item => item.dropdownID == value.payload.leaveFileTypeId)?.description || "",
                                        halfdayOptiondescrip: this.half.find(item => item.id == value.payload.halfdayOption)?.description || "",
                                        dateTimeFrom: value.payload.dateTimeTo,
                                        dateTimeTo: value.payload.dateTimeFrom,
                                        reason: value.payload.reason,
                                        uploadPath: value.payload.uploadPath.replace("C:\\fakepath\\",''),
                                        leaveId: value.payload.leaveId,
                                        employeeId: value.payload.employeeId,
                                        isPaid: value.payload.isPaid,
                                        isUpload: value.payload.isUpload,
                                        lateFiling: value.payload.lateFiling
                                    })
                                    this.LVTable.renderRows()
                                }
                                else {
                                    console.log(value.stackTrace)
                                    console.log(value.message)
                                }

                                // this.action = sessionStorage.getItem("action")
                                // if (this.action == "view") {
                                //     this.leaveForm.disable()
                                //     this.disabledbutton = true
                                // }

                            },
                            error: (e) => {
                                console.error(e)
                            }
                        });
                    } else if (this.action == 'view') {
                        this.disabledbutton = true
                        this.filingService.getLeave(this.id).subscribe({
                            next: (value: any) => {
                                this.ismultiple.emit(value.payload.isMultiShift)
                                if (value.statusCode == 200) {
                                    this.LVSource.push({
                                        dateFrom: value.payload.dateFrom,
                                        dateTo: value.payload.dateTo,
                                        shiftId: GF.IsEmptyReturn(value.payload.shiftId, 0),
                                        isMultiShift: this.isMultiShift,
                                        // shiftCode: GF.IsEmpty(value.payload.shiftId) ? "" : response.validationtype.payload.shiftCodes.find(x => x.dropdownID == value.payload.shiftId).description,
                                        shiftCode: this.datashiftcode,
                                        leaveTypeId: value.payload.leaveTypeId,
                                        leaveFileTypeId: value.payload.leaveFileTypeId,
                                        leaveTypeIddescrip: response.leavetype.payload.find(item => item.dropdownID == value.payload.leaveTypeId)?.description || "",
                                        leaveFileTypeIddesecrip: response.dropdownFixRequest.payload.find(item => item.dropdownID == value.payload.leaveFileTypeId)?.description || "",
                                        halfdayOptiondescrip: this.half.find(item => item.id == value.payload.halfdayOption)?.description || "",
                                        dateTimeFrom: value.payload.dateTimeTo,
                                        dateTimeTo: value.payload.dateTimeFrom,
                                        reason: value.payload.reason,
                                        uploadPath: value.payload.uploadPath.replace("C:\\fakepath\\",''),
                                        leaveId: value.payload.leaveId,
                                        employeeId: value.payload.employeeId,
                                        isPaid: value.payload.isPaid,
                                        isUpload: value.payload.isUpload,
                                        lateFiling: value.payload.lateFiling,
                                        disable: true
                                    })

                                    this.LVTable.renderRows()

                                }
                                else {
                                    console.log(value.stackTrace)
                                    console.log(value.message)
                                }

                                this.action = sessionStorage.getItem("action")
                                if (this.action == "view") {
                                    this.leaveForm.disable()
                                    this.disabledbutton = true

                                }

                            },
                            error: (e) => {
                                console.error(e)
                            }
                        });
                    }
                    //fetch edit data here

                } else {
                    this.dropdownFixRequest.id.push(
                        { dropdownID: 0, dropdownTypeID: 90 },
                        { dropdownID: 0, dropdownTypeID: 79 },
                    )
                }

            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
             this.validation("load")
            },

        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('isMultiShift' in changes) {
            if (this.action == 'view' || this.action == 'edit') {


            }
            else {
                this.LVSource = []
            }
        }
    }


    async uploadFile(event, id,names) {
        let fileName = event.target.files[0].name;
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        let element: HTMLElement = document.querySelector("#" + id) as HTMLElement;
        element.setAttribute('value', fileName)
        if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(file);
            // When file uploads set it to file formcontrol
            reader.onload = () => {
                this.imageUrl = reader.result;
                this.leaveForm.patchValue({
                    file: reader.result
                })
        }
        }
        var i = this.LVSource.length == 0 ? 0 : (this.LVSource.length - 1)
        this.fileExtension = this.getFileExtension(fileName);
        var namefile =  this.fileExtension

        const fileToUpload0 = event.target.files[0];
        const name = fileToUpload0.name;

        let reduce: File;

        if (namefile == "jpg" || namefile == "png") {
            try {
            reduce = await this.reduceImageSize(fileToUpload0, 50 * 1024 , 0.8);

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

    async addLV() {
        debugger
        this.leaveForm.markAllAsTouched()
        debugger
        var df = this.pipe.transform(this.leaveForm.value.dateFrom, "yyyy-MM-ddTHH:mm:ss")
        var dt = this.isMultiShift ? this.pipe.transform(this.leaveForm.value.dateFrom, "yyyy-MM-ddTHH:mm:ss") : this.pipe.transform(this.leaveForm.value.dateTo, "yyyy-MM-ddTHH:mm:ss")
       var list = [this.leaveForm.value]
        var cancelsave =  await this.coreService.required(this.tid,list,'34',this.leaveForm.value.leaveTypeId)
        if (cancelsave) {
            return
        }
        if (this.editing) {
            this.editing = false
            this.LVSource[this.index].dateFrom = null ? "" : df
            this.LVSource[this.index].dateTo = null ? "" : dt
            this.LVSource[this.index].shiftId = GF.IsEmptyReturn(this.leaveForm.value.shiftId, 0),
            this.LVSource[this.index].shiftCode = GF.IsEmpty(this.leaveForm.value.shiftId) ? null : this.dropdownOptions.shiftCodeDef.find(x => x.dropdownID == this.leaveForm.value.shiftId).description
            this.LVSource[this.index].leaveTypeIddescrip = this.dropdownOptions.Leavecategory.find(item => item.dropdownID == this.leaveForm.value.leaveTypeId).description
            this.LVSource[this.index].leaveTypeId = this.leaveForm.value.leaveTypeId
            this.LVSource[this.index].leaveFileTypeIddesecrip = this.dropdownOptions.Leavefilingdef.find(item => item.dropdownID == this.leaveForm.value.leaveFileTypeId).description
            this.LVSource[this.index].leaveFileTypeId = this.leaveForm.value.leaveFileTypeId
            this.LVSource[this.index].halfdayOptiondescrip = this.leaveForm.value.leaveFileTypeId == 12759 || this.leaveForm.value.leaveFileTypeId == 12760 ? "" : this.half.find(item => item.id == this.leaveForm.value.halfdayOption).description
            this.LVSource[this.index].halfdayOption = this.leaveForm.value.leaveFileTypeId == 12759 || this.leaveForm.value.leaveFileTypeId == 12760 ? 0 : this.leaveForm.value.halfdayOption
            this.LVSource[this.index].dateTimeFrom = this.leaveForm.value.dateTimeFrom
            this.LVSource[this.index].dateTimeTo = this.leaveForm.value.dateTimeTo
            this.LVSource[this.index].reason = this.leaveForm.value.reason
            this.LVSource[this.index].uploadPath =  GF.IsEmpty(this.leaveForm.value.uploadPath) ? "" : this.leaveForm.value.uploadPath.replace("C:\\fakepath\\",''),
            this.LVSource[this.index].isUpload = false
            this.LVSource[this.index].lateFiling = false
            this.LVSource[this.index].employeeId = 1
            this.LVSource[this.index].isPaid = this.leaveForm.value.isPaid
            this.LVSource[this.index].isMultiShift = this.isMultiShift

        } else {

            this.LVSource.push({
                dateFrom: this.leaveForm.value.dateFrom,
                dateTo: this.isMultiShift ? this.leaveForm.value.dateFrom : this.leaveForm.value.dateTo,
                shiftId: GF.IsEmptyReturn(this.leaveForm.value.shiftId, 0),
                isMultiShift: this.isMultiShift,
                shiftCode: GF.IsEmpty(this.leaveForm.value.shiftId) ? null : this.dropdownOptions.shiftCodeDef.find(x => x.dropdownID == this.leaveForm.value.shiftId).description,
                leaveTypeIddescrip: this.dropdownOptions.Leavecategory.find(item => item.dropdownID == this.leaveForm.value.leaveTypeId).description,
                leaveTypeId: this.leaveForm.value.leaveTypeId,
                leaveFileTypeIddesecrip: this.dropdownOptions.Leavefilingdef.find(item => item.dropdownID == this.leaveForm.value.leaveFileTypeId).description,
                leaveFileTypeId: this.leaveForm.value.leaveFileTypeId,
                halfdayOptiondescrip: this.leaveForm.value.leaveFileTypeId == 12759 || this.leaveForm.value.leaveFileTypeId == 12760 ? "" : this.half.find(item => item.id == this.leaveForm.value.halfdayOption).description,
                halfdayOption: this.leaveForm.value.leaveFileTypeId == 12759 || this.leaveForm.value.leaveFileTypeId == 12760 ? 0 : this.leaveForm.value.halfdayOption,
                dateTimeFrom: this.leaveForm.value.dateTimeFrom,
                dateTimeTo: this.leaveForm.value.dateTimeTo,
                reason: this.leaveForm.value.reason,
                uploadPath: GF.IsEmpty(this.leaveForm.value.uploadPath) ? "" : this.leaveForm.value.uploadPath.replace("C:\\fakepath\\",''),
                isUpload: false,
                lateFiling: false,
                employeeId: 1,
                isPaid: this.leaveForm.value.isPaid,

            });
        }
        debugger
        this.LVTable.renderRows();
        this.leaveForm.reset()
        let element: HTMLElement = document.querySelector('#displayLeave') as HTMLElement;
        element.setAttribute('value', '')
    }

    edit(e, i,dit) {
        debugger
        this.editing = true
        this.isEdit = dit

        this.index = i
        this.leaveForm.get('dateFrom').setValue(e.dateFrom)
        this.leaveForm.get('dateTo').setValue(e.dateTo)
        this.leaveForm.get('shiftId').setValue(e.shiftId)
        this.leaveForm.get('leaveTypeId').setValue(e.leaveTypeId)
        this.leaveForm.get('leaveFileTypeId').setValue(e.leaveFileTypeId)
        this.leaveForm.get('halfdayOption').setValue(e.halfdayOption)
        this.leaveForm.get('dateTimeFrom').setValue(e.dateTimeFrom)
        this.leaveForm.get('dateTimeTo').setValue(e.dateTimeTo)
        this.leaveForm.get('reason').setValue(e.reason)
        this.leaveForm.get('uploadPath').setValue(e.uploadPath)
        this.leaveForm.get('isPaid').setValue(e.isPaid)

        let element: HTMLElement = document.querySelector('#displayLeave') as HTMLElement;
        element.setAttribute('value', e.uploadPath.replace("C:\\fakepath\\",''))

        this.disabled_df_ft()
        if (dit == 'isedit') {
           this.validation(e)
        }
    }

    lvDelete(index) {
        this.LVSource.splice(index, 1);
        this.LVTable.renderRows();
    }

    public submit() {

        this.LVSource.forEach(element => {
            element.dateFrom = this.pipe.transform(element.dateFrom, 'yyyy-MM-dd')
            element.dateTo = this.isMultiShift ? this.pipe.transform(element.dateFrom, 'yyyy-MM-dd') : this.pipe.transform(element.dateTo, 'yyyy-MM-dd')
        });

        if (sessionStorage.getItem('moduleId') == "81") {
            this.tid = sessionStorage.getItem('u')
        } else {
            this.tid = this.selectedemployee
        }

        const dialogRef = this.message.open(SaveMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.filingService.postLeave(this.LVSource, this.tid,this.late).subscribe({

                    next: (value: any) => {
                         //   Error lock cannot file ==============================
                        this.coreService.valid(value, this.late, this.LVSource.length,true,['/detail/filing-view'],"").then((res)=>{
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

    validation(e) {

        this.tid = sessionStorage.getItem('u')
        var filingtype = this.leaveForm.value.leaveTypeId
        var submodule = this.leaveForm.value.leaveTypeId == null ? 0 : this.leaveForm.value.leaveTypeId

        var date = new Date(this.leaveForm.value.dateFrom)
        date.setDate(date.getDate())

        if (this.editing == true) {
            this.df = e.dateFrom
            this.dt = e.dateTo
        }else{
            this.df = this.isMultiShift && !GF.IsEmpty(this.leaveForm.value.dateFrom) ? new Date(date) : new Date
            this.dt = this.isMultiShift && !GF.IsEmpty(this.leaveForm.value.dateTo) ? new Date(date) : new Date
        }

        var request = {
            moduleId: 34,
            subModuleId: submodule,
            dateFrom: this.pipe.transform(this.df, 'yyyy-MM-ddTHH:mm') ,
            dateTo: this.pipe.transform(this.dt, 'yyyy-MM-ddTHH:mm'),
            overtimeTiming: 0,
            shiftId: 0,
            leaveFilingType:  filingtype == null ? 0 : filingtype,
            targetId: this.selectedemployee == null || 0 ? this.tid : this.selectedemployee,
        }

        forkJoin({
            dropdownFixRequest: this.masterService.getDropdownFix(this.dropdownFixRequest),
            validationtype: this.filingService.getFilingValidationOnUI(request),
        })
        .subscribe({
            next: (value: any) => {
                debugger
                if (this.leaveForm.value.leaveTypeId != null && this.id == "") {
                    this.leaveForm.get('leaveFileTypeId').enable()
                    var optionstype = _.uniqBy([...value.dropdownFixRequest.payload.filter(x => value.validationtype.payload.leaveFilingType.includes(x.dropdownID))], JSON.stringify)
                    this.dropdownOptions.Leavefilingdef = optionstype
                    this.dropdownOptions.shiftCodeDef = value.validationtype.payload?.shiftCodes
                }
                    var dfl = new Date(this.leaveForm.value.dateFrom)
                    var dtl = new Date(this.leaveForm.value.dateTo)

                    var daterange = dtl.getTime() - dfl.getTime()
                    var datecount = Math.ceil(daterange / (1000 * 3600 * 24 ) + 1);

                    // isPaid validation ===========================================================

                    this.LMSource.forEach(elem => {
                        debugger
                        var leavetypeId = elem.leaveTypeId
                        var availleave = elem.available_leave
                        if (!elem.isLwop || elem.isLwop == undefined) {
                            if (leavetypeId == this.leaveForm.value.leaveTypeId && availleave == 0 ) {
                                if(leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == true && value.validationtype.payload.enableLWOP == true ){
                                    this.showpaid = false
                                    this.leaveForm.get('isPaid').setValue(false)
                                }else if (leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == true && value.validationtype.payload.enableLWOP == false ) {
                                    this.leaveForm.get('isPaid').setValue(false)
                                    this.showpaid = false
                                }else if(leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == false && value.validationtype.payload.enableLWOP == true ){
                                    this.failedMessage.title = "Warning"
                                    this.failedMessage.message = "You cannot file leave with a " + availleave + " balance!"
                                    this.message.open(this.failedMessage);
                                    this.leaveForm.get('leaveTypeId').setValue(0)
                                    this.leaveForm.get('leaveFileTypeId').setValue(0)
                                    this.leaveForm.get('dateFrom').setValue(0)
                                    this.leaveForm.get('dateTo').setValue(0)
                                }else if (leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == false && value.validationtype.payload.enableLWOP == false ){
                                    this.failedMessage.title = "Warning"
                                    this.failedMessage.message = "You cannot file leave with a " + availleave + " balance!"
                                    this.message.open(this.failedMessage);
                                    if (this.editing) {

                                    }else{
                                        this.leaveForm.get('leaveTypeId').setValue(0)
                                        this.leaveForm.get('leaveFileTypeId').setValue(0)
                                        this.leaveForm.get('dateFrom').setValue(0)
                                        this.leaveForm.get('dateTo').setValue(0)
                                    }
                                }
                            }else if (leavetypeId == this.leaveForm.value.leaveTypeId && (availleave !== 0 || this.editing) ){
                                if(leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == true && value.validationtype.payload.enableLWOP == true){
                                    this.showpaid = true
                                    this.leaveForm.get('isPaid').setValue(true)
                                }else if (leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == true && value.validationtype.payload.enableLWOP == false) {
                                    this.leaveForm.get('isPaid').setValue(true)
                                    this.showpaid = false
                                }else if(leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == false && value.validationtype.payload.enableLWOP == true){
                                    this.leaveForm.get('isPaid').setValue(true)
                                    this.showpaid = true
                                }else if (leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == false && value.validationtype.payload.enableLWOP == false){
                                    this.leaveForm.get('isPaid').setValue(true)
                                    this.showpaid = false
                                }
                            }else if(leavetypeId == this.leaveForm.value.leaveTypeId && availleave < 1 ){
                                if (this.leaveForm.value.leaveFileTypeId == 12759) {
                                    if (value.validationtype.payload.allowFilingZero == false) {

                                        this.failedMessage.title = "Warning"
                                        this.failedMessage.message = "You cannot file wholeDay leave with a " + availleave + " balance!"
                                        this.message.open(this.failedMessage);
                                        this.leaveForm.get('leaveTypeId').setValue(0)
                                        this.leaveForm.get('leaveFileTypeId').setValue(0)
                                        this.leaveForm.get('dateFrom').setValue(0)
                                        this.leaveForm.get('dateTo').setValue(0)
                                        // this.leaveForm.get('isPaid').setValue(false)
                                    }
                                }
                            }
                            // else if (leavetypeId == this.leaveForm.value.leaveTypeId && value.validationtype.payload.allowFilingZero == true && value.validationtype.payload.enableLWOP == false) {
                            //     this.leaveForm.get('isPaid').setValue(true)
                            //     this.showpaid = false
                            // }
                            else if (this.leaveForm.value.leaveFileTypeId == null ? 0 : this.leaveForm.value.leaveFileTypeId != 0 ) {
                                if (availleave > 1  && leavetypeId == this.leaveForm.value.leaveTypeId) {
                                    if (datecount > availleave && leavetypeId == this.leaveForm.value.leaveTypeId) {
                                        if (value.validationtype.payload.allowFilingZero == true) {
                                            this.leaveForm.get('isPaid').setValue(false)
                                        }
                                        this.failedMessage.title = "Warning"
                                        this.failedMessage.message = "Your File Leave is greater than your Leave Balance please File your leave base on your leave Balance!"
                                        this.message.open(this.failedMessage);
                                        this.leaveForm.get('dateFrom').setValue("")
                                        this.leaveForm.get('dateTo').setValue("")
                                        this.leaveForm.get('leaveFileTypeId').setValue(0)
                                        this.showpaid = false
                                    }

                                }else if (value.validationtype.payload.enableLWOP == false  && leavetypeId == this.leaveForm.value.leaveTypeId) {
                                    this.showpaid = false
                                    this.leaveForm.get('isPaid').setValue(true)
                                } else {
                                    if (availleave < 1 && leavetypeId == this.leaveForm.value.leaveTypeId) {
                                        this.showpaid = false
                                        this.leaveForm.get('isPaid').setValue(false)
                                    }else if(value.validationtype.payload.enableLWOP == true && availleave >= 1 && leavetypeId == this.leaveForm.value.leaveTypeId){
                                        this.showpaid = true
                                        this.leaveForm.get('isPaid').setValue(false)
                                    }
                                }
                            }
                        }else if(leavetypeId == this.leaveForm.value.leaveTypeId && elem.isLwop) {
                            this.leaveForm.get('isPaid').setValue(false)
                            this.showpaid = false
                        }


                        if (value.validationtype.payload.isAllowed == false && !elem.isLwop) {
                            this.failedMessage.title = "Warning"
                            this.failedMessage.message = value.validationtype.payload.message
                            this.message.open(this.failedMessage)
                        }

                    });




                var curretndate = new Date
                var canfilebefore = value.validationtype.payload.canFileBefore
                var canfileafter = value.validationtype.payload.canFileAfter

                if (canfilebefore != null && canfilebefore > 0) {

                    this.min = new Date(curretndate.setDate(curretndate.getDate() + canfilebefore + 1))

                } else
                    if (canfileafter != null && canfileafter > 0) {

                        this.min = new Date(curretndate.setDate(curretndate.getDate() - canfileafter))

                    } else {
                        this.min = new Date(1994, 1, 1)
                    }
                if (value.validationtype.payload.isAllowed == false) {
                    //      FailedMessage.title = "Warning"
                    //      FailedMessage.message = value.payload.message
                    //  var def = this.message.open(FailedMessage)
                }

                if (e == "Date") {
                    this.leaveForm.get('shiftId').setValue(null)
                }

            }
        })
    }

    disabled_df_ft() {
        if (this.leaveForm.value.leaveTypeId != null) {
            this.leaveForm.get('dateFrom').enable();
            this.leaveForm.get('dateTo').enable();
        }
        else {
            this.leaveForm.get('dateFrom').disable();
            this.leaveForm.get('dateTo').disable();
        }
    }

    leavetypedropdown(tid) {
        this.coreService.getCoreDropdownwithparam(1034, this.leavetyperequest, tid)
        .subscribe({
            next: (response) => {
                this.dropdownOptions.Leavecategory = response.payload
            },
            error: (e) => {
                console.error(e)
            }
        });
    }

    lvtable() {

        if (sessionStorage.getItem('moduleId') == "81") {
            this.tid = sessionStorage.getItem('u')
            this.leavetypedropdown(this.tid)
        } else {
            this.tid = this.selectedemployee == undefined ? this.id : this.selectedemployee
            this.leavetypedropdown(this.tid)
        }

        this.filingService.getFilingLeaveBalance(this.tid).subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    this.LMSource = value.payload.map(x => ({

                        leave_type: x.leaveType,
                        total_leave: x.earned,
                        used_leave: x.used,
                        pending_approval: x.pendingApproval,
                        pending_schedule: x.pendingSchedule,
                        available_leave: x.available,
                        leaveTypeId: x.leaveTypeId,
                        isLwop : x.isLwop

                    }))
                    this.LMTable.renderRows()
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
}
