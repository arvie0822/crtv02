import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { leaveForm, officialBForm, Offset, offsetForm, OffsetMonitoring, offTable } from 'app/model/administration/filing';
import { myData } from 'app/model/app.moduleId';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { FilingService } from 'app/services/filingService/filing.service';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import _ from 'lodash';

@Component({
  selector: 'app-offset',
  templateUrl: './offset.component.html',
  styleUrls: ['./offset.component.css']
})
export class OffsetComponent implements OnInit {

    @ViewChild('OFFTable') OFFTable: MatTable<any>;
    @ViewChild('OTable') OTable: MatTable<any>;
    @ViewChild('fileInput2') fileInput2: ElementRef;
    @Input() selectedemployee : any
    offsetForm: FormGroup
    leaveForm : FormGroup
    officialBForm : FormGroup
    @Input() datasource: any
    @Input() expirations: boolean
    imageUrl : any
    isSave : boolean = false
    editing = false
    index = 0
    id : string = ""
    OSource: OffsetMonitoring[] = [];
    oColumns: string[] = ['overtime_code', 'overtime', 'offset_used', 'offset_field', 'available', 'expiration'];
    OFFSource : Offset[] = [];
    offColumns: string[] = ['action','date','off_min', 'off_hrs', 'reason', 'uploadFile'];
    disabledbutton : boolean = false
    pipe = new DatePipe('en-US');
    tid : any
    imagefiless : any = []
    clickCount: number = 0;
    loginId = 0
    idsimage
    fileExtension: string | undefined;
    moduleId: any
    late : boolean = false

  constructor(private fb: FormBuilder,
    private message: FuseConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    private coreService: CoreService,
    private storageServiceService : StorageServiceService,
    private filingService : FilingService,) { }
  get off(){
    return this.offsetForm.value
  }


    ngOnInit() {

        this.id = this.route.snapshot.paramMap.get('id');
        this.offsetForm = this.fb.group(new Offset());
        this.moduleId = "37"

        if (this.id !== "") {
            this.offsetForm.reset()
            //fetch edit data here
            this.filingService.getOffset(this.id).subscribe({
                next: (value: any) => {
                    if (value.statusCode == 200) {


                        this.datasource.push({

                            offsetDate: value.payload.offsetDate,
                            offsetMin: value.payload.offsetMin,
                            reason: value.payload.reason,
                            uploadPath: value.payload.uploadPath,
                            offsetId: value.payload.offsetId,
                            offsetHrs: (value.payload.offsetMin / 60).toString()

                        })
                        this.OFFTable.renderRows()
                    }
                    else {
                        console.log(value.stackTrace)
                        console.log(value.message)
                    }
                    var action = sessionStorage.getItem("action")
                    if (action == "view") {
                        this.disabledbutton = true
                        this.offsetForm.disable()
                    }
                },
                error: (e) => {
                    console.error(e)
                }
            });
        }



    }

    ngOnChanges(){

        var tid = sessionStorage.getItem('u')
        var ie = this.expirations

        if (sessionStorage.getItem('moduleId') == "81") {
             this.tid = sessionStorage.getItem('u')
             var ie = this.expirations
        }else{

            this.tid = this.selectedemployee
            var ie = this.expirations

        }

        if (ie == true) {
            this.filingService.getFilingOffsetBalance(this.tid, ie).subscribe({
                next: (value: any) => {
                    if (value.statusCode == 200) {

                        this.OSource = value.payload.map(x => ({

                            overtime_code: x.code,
                            overtime: x.total,
                            offset_used: x.used,
                            offset_field: x.pending,
                            available: x.available,
                            expiration: x.expiration,

                        }))
                        this.OTable.renderRows()

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
        else{
        //   this.OSource = []
        }
    }


    async uploadFile(event, id,names) {
        let fileName = event.target.files[0].name;
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        console.log(id)
        let element: HTMLElement = document.querySelector("#" + id) as HTMLElement;
        element.setAttribute('value', fileName)
        if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(file);
            // When file uploads set it to file formcontrol
            reader.onload = () => {
                this.imageUrl = reader.result;
                this.offsetForm.patchValue({
                    file: reader.result
                })
        }
        }
        var i = this.datasource.length == 0 ? 0 : (this.datasource.length - 1)
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

    convertMins() {
        // debugger
        // var off = this.offsetForm.get('offsetMin').value
        // // var rminutes = Math.round(off)
        // var hours = Math.floor(off / 60);
        // var rminutes = Math.floor(off % 60);
        // var total = hours.toString().padStart(2, '0');
        // var mins = rminutes.toString().padStart(2, '0');

        // var formattedTime = total + ":" + mins;
        // //  .padStart(2, '0')
        // this.offsetForm.get('offsetHrs').setValue(total)
        // // this.offsetForm.get('offsetHrs').setValue(total + ":" + mins)

        var off = this.offsetForm.get('offsetMin').value;
        var hoursDecimal = off / 60;

        // Round to a specific number of decimal places if needed
        var roundedHours = hoursDecimal.toFixed(1); // Example: 1.50

        this.offsetForm.get('offsetHrs').setValue(roundedHours);
    }

    async addOFF(){
        var list = [this.offsetForm.value]
        var cancelsave =  await this.coreService.required(this.tid,list,'37',0)
        if (cancelsave) {
            return
        }
        if (this.editing) {

                this.editing = false
                this.datasource[this.index].offsetDate = this.offsetForm.value.offsetDate,
                this.datasource[this.index].offsetMin = this.offsetForm.value.offsetMin,
                this.datasource[this.index].reason = this.offsetForm.value.reason,
                this.datasource[this.index].uploadPath = this.offsetForm.value.uploadPath.replace("C:\\fakepath\\",'')

            }else {

                this.datasource.push({
                    offsetDate: this.offsetForm.value.offsetDate,
                    offsetMin: this.offsetForm.value.offsetMin,
                    offsetHrs: this.offsetForm.value.offsetHrs,
                    reason: this.offsetForm.value.reason,
                    uploadPath: this.offsetForm.value.uploadPath.replace("C:\\fakepath\\",''),
                });

            }
            this.OFFTable.renderRows();
            this.offsetForm.get('offsetDate').setValue(new Date())
            this.offsetForm.get('offsetMin').setValue(0)
            this.offsetForm.get('reason').setValue('')
            let element: HTMLElement = document.querySelector('#displayoffset') as HTMLElement;
            element.setAttribute('value', '')


            debugger
    }
    offDelete(index): void {
        this.datasource.splice(index, 1);
        this.OFFTable.renderRows();
    }

    public submit(e) {
        if (sessionStorage.getItem('moduleId') == "81") {
            this.tid = sessionStorage.getItem('u')
       }else{
           this.tid = this.selectedemployee
       }
       this.coreService.encrypt_decrypt(false, this.tid)
        .subscribe({
            next: (value: any) => {
                var sample = value.payload[0]
                this.loginId = Number(value.payload[0])
            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
            }
        });
        e[this.index].offsetDate = this.pipe.transform(e[this.index].offsetDate,'yyyy-MM-ddTHH:mm')

        const dialogRef = this.message.open(SaveMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {

                this.isSave = true
                this.filingService.postOffset(e,this.tid,this.late).subscribe({

                    next: (value: any) => {
                        this.coreService.valid(value, this.late, e.length,true,['/detail/filing-view'],"").then((res)=>{
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

    edit(e,i){
        this.index = i
        // this.officialBForm.get('date').setValue(e.date)
        this.offsetForm.get('offsetDate').setValue(new Date(e.offsetDate))
        this.offsetForm.get('offsetMin').setValue(e.offsetMin)
        this.offsetForm.get('offsetHrs').setValue(e.offsetHrs)
        this.offsetForm.get('reason').setValue(e.reason)
        this.offsetForm.get('uploadPath').setValue(e.uploadPath)
        this.convertMins()
        this.editing = true
    }
}
