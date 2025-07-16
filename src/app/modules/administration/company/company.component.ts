import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTable } from '@angular/material/table';
import { Company } from 'app/model/administration/company';
import { DropdownOptions } from 'app/model/dropdown.model';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { Location } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { environment } from 'environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.css'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true },
        },
    ],
})
export class CompanyComponent implements OnInit {
    @ViewChild('canvas') canvas: ElementRef;
    displayedColumns: string[] = ['serial_number', 'device_id', 'model', 'Company', 'Branch', 'location', 'biometric_type', 'group', 'active', 'status', 'edit'];
    dataSource: any[] = []
    @ViewChild('BioTable') BioTable: MatTable<any>;
    companyForm: FormGroup
    biometricsForm: FormGroup
    govform: FormGroup
    orient: string = "horizontal"
    //   url ="https://material.angular.io/assets/img/examples/shiba2.jpg";
    editBio: boolean = false
    indexBio: number = 0
    dropdownOptions = new DropdownOptions
    @ViewChild('stepper') stepper;
    @ViewChild('input1')
    isChecked: boolean = false
    isSave: boolean = true
    selected = 'false';
    filename: string;
    imagefile = []
    moduleId: any
    hide = true;
    transactionId: any
    registrationForm = this.fb.group({
        file: [null],
    })
    imageprev: any
    imageWidth: number = 200;
    imageHeight: number = 150;
    @ViewChild('fileInput') el: ElementRef;
    //   imageUrl: any = "https://material.angular.io/assets/img/examples/shiba2.jpg";
    imageUrl: SafeResourceUrl
    thumbnail: any;
    editFile: boolean = true;
    removeUpload: boolean = false;
    loginId = 0
    @ViewChild('apiKeyInput') apiKeyInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private masterService: MasterService,
        private core: CoreService,
        private _location: Location,
        private message: FuseConfirmationService,
        private storageServiceService: StorageServiceService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.companyForm = this.fb.group(new Company())
        // this.biometricsForm = this.fb.group(new Biometrics())
        this.loadinit()
    }

    backClicked() {
        this._location.back();
    }

    handleAddBiometrics(): void {
        this.biometricsForm.markAllAsTouched();
        if (this.biometricsForm.valid) {
            if (!this.editBio) {
                this.dataSource.push(this.biometricsForm.value)
                this.companyForm.get('biometric_devices').setValue(this.dataSource);
                this.BioTable.renderRows();
                this.biometricsForm.reset()
            }
            else {
                this.dataSource[this.indexBio] = this.biometricsForm.value
                this.companyForm.get('biometric_devices').setValue(this.dataSource);
                this.BioTable.renderRows();
                this.biometricsForm.reset()
                this.editBio = false
                this.indexBio = 0
            }
        }
    }

    stepChanged(event: StepperSelectionEvent) {
        if (event.selectedIndex == 4) {
            event.selectedStep.interacted = false
        }
    }

    handleEdit(index): void {
        this.biometricsForm.setValue(this.dataSource[index])
        this.indexBio = index
        this.editBio = true
    }

    handleActive(index, event: MatSlideToggleChange): void {
        this.dataSource[index].active = event.checked
        this.BioTable.renderRows();
        this.companyForm.get('biometric_devices').setValue(this.dataSource);
    }

    handleRemove(index): void {
        this.dataSource.splice(index, 1);
        this.BioTable.renderRows();
        this.companyForm.get('biometric_devices').setValue(this.dataSource);
    }

    changeOrient() {
        if (this.orient == "vertical") {
            this.orient = "horizontal"
        } else {
            this.orient = "vertical"
        }
    }

    submit(): void {
        this.companyForm.markAllAsTouched();
        if (this.companyForm.valid) {
            const dialogRef = this.message.open(SaveMessage);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == "confirmed") {
                    this.isSave = true

                    this.masterService.postCompany(this.companyForm.getRawValue()).subscribe({
                        next: (value: any) => {
                            if (value.statusCode == 200) {
                                this.message.open(SuccessMessage);
                                this.transactionId = value.payload.companyId
                                this.uploadimage()
                            }
                            else {
                                this.message.open(FailedMessage);
                                console.log(value.stackTrace)
                                console.log(value.message)
                            }
                        },
                        error: (e) => {
                            this.isSave = false
                            this.message.open(FailedMessage);
                            console.error(e)
                        },
                        complete: () => {
                            this.isSave = false
                        }

                    });
                }
            });
        }
    }

    uploadimage() {

        this.moduleId = sessionStorage.getItem('moduleId')
        if (this.imagefile.length === 0) {
            return
        }

        this.imagefile.forEach(file => {
            const fileToUpload = <File>file.files;
            if (fileToUpload) {
                const formData = new FormData();
                formData.append("file", file.files);

                this.storageServiceService.fileUpload(formData, this.transactionId, this.moduleId, this.loginId).subscribe({
                    next: (value: any) => {
                        if (value) {

                        }
                    },
                    error: (e) => {
                    }
                });
            }
        });
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

    async uploadFile(event: any, id: any, sig: string, fc: string) {
        const fileToUpload0 = event.target.files[0];
        const name = sig + '-' + fileToUpload0.name;
        let reduce: File;


        try {
            reduce = await this.reduceImageSize(fileToUpload0, 50 * 1024, 0.8);
        } catch (error) {
            console.error('Error reducing image size:', error);
            return; // If an error occurs, you might want to handle it accordingly.
        }

        if (this.imagefile.some((x) => x.source == sig)) {
            const idx = this.imagefile.findIndex((x) => x.source == sig);
            this.imagefile[idx].files = reduce;
        } else {
            const renamedFile = new File([reduce], name, { type: reduce.type });
            this.imagefile.push({
                source: sig,
                files: renamedFile,
            });
        }

        switch (fc) {
            case 'companyLogo':
                this.companyForm.get('companyLogo').setValue(reduce.name);
                const readers = new FileReader();
                readers.readAsDataURL(reduce);
                readers.onload = (event) => {
                    this.imageUrl = event.target?.result as string;
                };
            break;
        }
    }

    previewimage(e,t,m) {

        this.storageServiceService.fileDownload(e,t,m).subscribe({
            next: (value: any) => {
                //
                // this.imageUrl = "companyLogo1-user-icon-jpg.jpg"
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(base64data);
                };
                reader.readAsDataURL(value);
            },

            error: (e) => {
            }
        });
    }

    generate(){

        // postGeneratedAPIKeys
        this.masterService.postGeneratedAPIKeys().subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    this.loadinit()
                }
            }
        })

    }

    loadinit(){
        this.masterService.getCompany().subscribe({
            next: (value: any) => {
                if (value.statusCode == 200) {
                    this.hide = false
                    this.companyForm.setValue(value.payload)

                    if (value.payload.companyLogo != "") {
                        this.imageprev = "companyLogo1-" + value.payload.companyLogo
                        var number = sessionStorage.getItem('moduleId')
                        var moduleid = parseInt(number, 10);

                        this.previewimage(this.imageprev,value.payload.companyId,moduleid)
                    }
                    //   const dropdownFix = this.coreService.getDropdownFix([3, 9, 10, 61, 62])
                    //   this.dropdownOptions.countryDef = dropdownFix.filter(x => x.typeID === 3)
                    //   this.dropdownOptions.regionDef = dropdownFix.filter(x => x.typeID === 10)
                    //   this.dropdownOptions.provinceDef = dropdownFix.filter(x => x.typeID === 61)
                    //   this.dropdownOptions.cityDef = dropdownFix.filter(x => x.typeID === 9)
                    //   this.dropdownOptions.tkBasisDef = [ { "dropdownID": 0, "description": "Default" }, ...dropdownFix.filter(x => x.typeID === 62)]
                    //
                }
                else {
                    console.log(value.stackTrace)
                    console.log(value.message)
                }
            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
                this.isSave = false


            }
        });
        var id = [sessionStorage.getItem("u")]
        this.core.encrypt_decrypt(false, id)
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

    togglePasswordVisibility(): void {
        this.hide = !this.hide;
    }

    hidekey(){
        this.hide = this.hide;
    }

    copyToClipboard() {
        const inputElement = this.companyForm.value.apiKeys;
        debugger
        // Use the Clipboard API if available
        if (navigator.clipboard) {
          navigator.clipboard.writeText(inputElement).then(
          );
        } else {
          inputElement.select();
          document.execCommand('copy');
        }
      }
}
