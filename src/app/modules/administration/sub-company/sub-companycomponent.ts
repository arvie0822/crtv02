import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownSettings, SystemSettings } from 'app/model/app.constant';
import { Subcompany, BranchContact, BranchEmail, BranchIP } from 'app/model/administration/sub-company';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { DropdownInput, DropdownRequest, DropdownOptions } from 'app/model/dropdown.model';
import { TenantService } from 'app/services/tenantService/tenant.service';
import _ from 'lodash';
import { Subject, forkJoin } from 'rxjs';
import { CoreService } from 'app/services/coreService/coreService.service';
import { MasterService } from 'app/services/masterService/master.service';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-sub-company',
    templateUrl: './sub-company.component.html',
    styleUrls: ['./sub-company.component.css']
})

export class SubcompanyComponent implements OnInit {
    fileUpload: ElementRef
    longitude = "";
    subCompanyForm: FormGroup
    contactForm: FormGroup
    ipForm: FormGroup
    emailForm: FormGroup
    dropdownInput = new DropdownInput
    dropdownRequest = new DropdownRequest
    dropdownFix = new DropdownRequest
    dropdownRequestsub = new DropdownRequest
    dropdownOptions = new DropdownOptions
    systemSettings = SystemSettings
    isSave: boolean = true
    id: string;
    _onDestroy: any
    @ViewChild('TablePhone') TablePhone: MatTable<any>;
    @ViewChild('TableEmail') TableEmail: MatTable<any>;
    @ViewChild('TableIP') TableIP: MatTable<any>;
    phoneColumns: string[] = ['Type', 'Number', "Action"]
    phoneDataSource: any[] = []
    emailColumns: string[] = ['Type', 'Address', "Action"]
    emailDataSource: any[] = []
    ipColumns: string[] = ['IP', "To", "Action"]
    ipDataSource: any[] = []
    errIP: boolean = false
    errIPBetween: boolean = false
    errIPFromBetween: boolean = false
    selectedIp: boolean = false
    errIPtext = ""
    primarySigList = []
    documentsList = []

    @ViewChild('fileInput') el: ElementRef;
    imageUrl: SafeResourceUrl
    editFile: boolean = true;
    removeUpload: boolean = false;
    transactionId: any
    moduleId: any
    imagefile = []
    imageprev: any
    loginId = 0

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private message: FuseConfirmationService,
        private tenantService: TenantService,
        private masterService: MasterService,
        private coreService: CoreService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private core: CoreService,
        private storageServiceService: StorageServiceService,
        private cd: ChangeDetectorRef) { }

    get sc() { return this.subCompanyForm.value }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');

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
        this.subCompanyForm = this.fb.group(new Subcompany());
        this.ipForm = this.fb.group(new BranchIP());
        this.contactForm = this.fb.group(new BranchContact());
        this.emailForm = this.fb.group(new BranchEmail());

        this.subCompanyForm.disable();
        this.ipForm.disable();
        this.contactForm.disable();
        this.emailForm.disable();

        if (this.id !== "") {
            this._onDestroy = this.tenantService.getSubCompany(this.id).subscribe({
                next: (value: any) => {
                    if (value.statusCode == 200) {
                        this.subCompanyForm.patchValue(JSON.parse(JSON.stringify(value.payload).replace(/\:null/gi, "\:[]")))
                        value.payload.bankBranchCode == null ? this.subCompanyForm.get('bankBranchCode').setValue("") : value.payload.bankBranchCode
                        this.phoneDataSource = value.payload.contact == null ? [] : value.payload.contact
                        this.emailDataSource = value.payload.email == null ? [] : value.payload.email
                        this.ipDataSource = value.payload.ip || []

                        this.dropdownRequest.id.push(
                            { dropdownID: value.payload.subsidiaryId == null ? 0 : value.payload.subsidiaryId, dropdownTypeID: 300 },
                            { dropdownID: 0, dropdownTypeID: 12 }
                        )
                        this.dropdownFix.id.push(
                            { dropdownID: value.payload.industry == null ? 0 : value.payload.industry, dropdownTypeID: 1 },
                            { dropdownID: 0, dropdownTypeID: 11 },
                            { dropdownID: value.payload.bankId == null ? 0 : value.payload.bankId, dropdownTypeID: 2 },
                            { dropdownID: value.payload.country == null ? 0 : value.payload.country, dropdownTypeID: 3 },
                            { dropdownID: value.payload.rdo == null ? 0 : value.payload.rdo, dropdownTypeID: 4 },
                            { dropdownID: value.payload.pRegionDef == null ? 0 : value.payload.pRegionDef, dropdownTypeID: 7 },
                            { dropdownID: 12813, dropdownTypeID: 15 },
                            { dropdownID: 2651, dropdownTypeID: 15 },
                            { dropdownID: 12757, dropdownTypeID: 15 },
                        )
                        if (value.payload.companyLogo != "") {
                        this.imageprev = "companyLogo1-" + value.payload.companyLogo
                        var number = sessionStorage.getItem('moduleId')
                        var moduleid = parseInt(number, 10);
                        this.previewimage(this.imageprev,value.payload.subCompanyId,moduleid)
                        }
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
        else {
            this.dropdownRequest.id.push(
                { dropdownID: 0, dropdownTypeID: 300 },
                { dropdownID: 0, dropdownTypeID: 12 }
            )
            this.dropdownFix.id.push(
                { dropdownID: 0, dropdownTypeID: 1 },
                { dropdownID: 0, dropdownTypeID: 2 },
                { dropdownID: 3, dropdownTypeID: 3 },
                { dropdownID: 0, dropdownTypeID: 4 },
                { dropdownID: 0, dropdownTypeID: 5 },
                { dropdownID: 0, dropdownTypeID: 7 },
                { dropdownID: 0, dropdownTypeID: 9 },
                { dropdownID: 0, dropdownTypeID: 10 },
                { dropdownID: 0, dropdownTypeID: 11 },
                { dropdownID: 12813, dropdownTypeID: 15 },
                { dropdownID: 2651, dropdownTypeID: 15 },
                { dropdownID: 12757, dropdownTypeID: 15 },
                { dropdownID: 0, dropdownTypeID: 61 }
            )

            this.initData()
        }
    }

    initData() {
        this._onDestroy = forkJoin({
            dropdownFix: this.masterService.getDropdownFix(this.dropdownFix),
            dropdownDynamic: this.tenantService.getDropdown(this.dropdownRequest),
            subCompany: this.coreService.getCoreDropdown(1014, this.dropdownRequestsub)
        }).subscribe({
            next: (value: any) => {
                this.dropdownOptions.industryDef = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 1)
                this.dropdownOptions.bankDef = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 2)
                this.dropdownOptions.countryDef = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 3)
                this.dropdownOptions.rdoOfficeDef = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 4)
                // this.dropdownOptions.rdoBranchDef    = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 5)
                this.dropdownOptions.pBranchWithCodeDef = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 7)
                // this.dropdownOptions.cityDef         = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 9)
                // this.dropdownOptions.regionDef       = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 10)
                this.dropdownOptions.contactDef = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 11)
                //   this.dropdownOptions.provinceDef        = value.dropdownFix.payload.filter(x => x.dropdownTypeID === 61)
                this.dropdownOptions.emailDef = value.dropdownDynamic.payload.filter(x => x.dropdownTypeID == 12)
                this.dropdownOptions.companynameDef = value.subCompany.payload
                // const dropdownFix                    = this.coreService.getDropdownFix([3, 4, 5, 6, 9, 10, 61])
                // this.documentsList                   = value.dropdownFix.payload.filter(x =>  x.dropdownTypeID === 15 )
                this.documentsList = _.uniqBy([...this.documentsList, ...value.dropdownFix.payload
                    .filter(x => x.dropdownTypeID === 15 && [12813, 2651, 12757]
                        .includes(x.dropdownID))], JSON.stringify)
            },
            error: (e) => {
                console.error(e)
            },
            complete: () => {
                this.isSave = false
                this.subCompanyForm.enable();
                this.ipForm.enable();
                this.contactForm.enable();
                this.emailForm.enable();
                this.addPrimarySigList()
            }
        });
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    handleAddNumber(): void {
        this.phoneDataSource.push({
            dropdownId: this.contactForm.value.dropdownId,
            type: this.dropdownOptions.contactDef.filter(x => x.dropdownID == this.contactForm.value.dropdownId)[0]['description'],
            number: "+63 " + this.contactForm.value.number
        })
        this.TablePhone.renderRows();
        this.subCompanyForm.get('contact').setValue(this.phoneDataSource);
        this.contactForm.reset()
    }

    handleDeleteNumber(index): void {
        this.phoneDataSource.splice(index, 1);
        this.TablePhone.renderRows();
        this.subCompanyForm.get('contact').setValue(this.phoneDataSource);
    }

    handleAddEmail(): void {
        if (this.contactForm.value.dropdownId) {
            if (this.emailForm.controls.address.valid) {
                var numtype = this.contactForm.value.dropdownId
                this.emailDataSource.push({
                    type: this.dropdownOptions.contactDef.find(x => x.dropdownID == numtype).description || "",
                    dropdownId: numtype,
                    // type: numtype,
                    address: this.emailForm.value.address
                })
                this.TableEmail.renderRows();
                this.subCompanyForm.get('email').setValue(this.emailDataSource);
                this.emailForm.reset()
            }
        }
    }

    handleDeleteEmail(index): void {
        this.emailDataSource.splice(index, 1);
        this.TableEmail.renderRows();
        this.subCompanyForm.get('email').setValue(this.emailDataSource);
    }
    KeyUpFrom() {
        this.errIPFromBetween = false
    }

    KeyUpTo() {
        this.errIP = false
        this.errIPBetween = false
    }

    handleAddIP(): void {
        this.errIP = false
        this.errIPBetween = false
        this.errIPFromBetween = false
        if (this.ipForm.value.address == "" || this.ipForm.value.to == "") {
            return
        }
        if (this.ipForm.value.address.split(".").length < 3) {
            return
        }
        var lastIP = this.ipForm.value.address.split(".")[3]
        if (Number(lastIP) > Number(this.ipForm.value.to)) {
            this.errIP = true
            return
        }

        if (this.ipForm.invalid) {
            return
        }

        var lastIndex = this.ipForm.value.address.lastIndexOf('.')
        var _ip = this.ipForm.value.address.substring(0, lastIndex);
        if (this.ipDataSource.some(x => x.address.substring(0, x.address.lastIndexOf('.')) == _ip && (Number(this.ipForm.value.to) <= Number(x.to)))) {
            this.errIPBetween = true
            return
        }
        if (this.ipDataSource.some(x => x.address.substring(0, x.address.lastIndexOf('.')) == _ip && (Number(lastIP) <= Number(x.to)))) {
            this.errIPFromBetween = true
            this.errIPtext = lastIP
            return
        }

        this.ipDataSource.push({
            address: this.ipForm.value.address,
            to: this.ipForm.value.to
        })
        this.subCompanyForm.get('ip').setValue(this.ipDataSource);
        this.TableIP.renderRows();
        this.ipForm.reset()
    }

    handleDeleteIP(index): void {
        this.ipDataSource.splice(index, 1);
        this.TableIP.renderRows();
        this.subCompanyForm.get('ip').setValue(this.ipDataSource);
    }

    submit(): void {
        // console.log(this.subCompanyForm.value)
        // this.subCompanyForm.value.subsidiaryId = 0 // static for temporary forever
        this.subCompanyForm.markAllAsTouched();
        if (this.subCompanyForm.valid) {
            const dialogRef = this.message.open(SaveMessage);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == "confirmed") {
                    this.isSave = true


                    this.tenantService.postSubCompany(this.subCompanyForm.value).subscribe({
                        next: (value: any) => {
                            if (value.statusCode == 200) {


                                this.message.open(SuccessMessage);
                                this.isSave = false,
                                    this.router.navigate(['/search/sub-company']);
                                this.transactionId = value.payload
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
                        }
                    });
                }
            });
        }
    }
    onClick(event) {
        if (this.fileUpload)
            this.fileUpload.nativeElement.click()
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

                this.storageServiceService.fileUpload(formData, this.transactionId, this.moduleId,this.loginId).subscribe({
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
          reduce = await this.reduceImageSize(fileToUpload0, 50 * 1024 , 0.8);
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
            this.subCompanyForm.get('companyLogo').setValue(reduce.name);
            const readers = new FileReader();
            readers.readAsDataURL(reduce);
            readers.onload = (event) => {
              this.imageUrl = event.target?.result as string;
            };
            break;
            case 'signatory1Path':
                this.subCompanyForm.get('signatory1Path').setValue(reduce.name);
            break;
            case 'signatory2Path':
                this.subCompanyForm.get('signatory2Path').setValue(reduce.name);
            break;
            case 'signatory3Path':
                this.subCompanyForm.get('signatory3Path').setValue(reduce.name);
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

    addPrimarySigList() {
        this.primarySigList = []
        this.sc.signatory1 == null ? null : this.primarySigList.push(this.sc.signatory1)
        this.sc.signatory2 == null ? null : this.primarySigList.push(this.sc.signatory2)
        this.sc.signatory3 == null ? null : this.primarySigList.push(this.sc.signatory3)
    }

    removeSelectedSigList(e) {
        return this.primarySigList.filter(item => item != this.sc[e])
    }

    removeSelectedDoc(a, b) {
        return this.documentsList.filter(item => item.dropdownID != this.sc[a] && item.dropdownID != this.sc[b])
    }
}
