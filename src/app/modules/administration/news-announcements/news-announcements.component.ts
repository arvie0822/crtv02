import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NewsForm } from 'app/model/administration/news-announcements';
import { DropdownInput, DropdownOptions, DropdownRequest, HeirarchyDropdownRequest, SearchHierarchy } from 'app/model/dropdown.model';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { DatePipe } from '@angular/common';
import { DateAdapter, MatOption, ThemePalette } from '@angular/material/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { CategoryService } from 'app/services/categoryService/category.service';
import { forkJoin, pipe } from 'rxjs';
import { TableRequest } from 'app/model/datatable.model';
import { UserService } from 'app/core/user/user.service';
import { StorageServiceService } from 'app/services/storageService/storageService.service';

export interface Tile {
  text: string;

}

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
    parse: {
      dateInput: 'MM/DD/YY HH:mm a'
    },
    display: {
      dateInput: 'MM/DD/YY HH:mm a',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  };

@Component({
  selector: 'app-news-announcements',
  templateUrl: './news-announcements.component.html',
  styleUrls: ['./news-announcements.component.css'],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }]
},
)
export class NewsAnnouncementsComponent implements OnInit {
    dropdownRequestsub = new DropdownRequest
    dropdownReq = new HeirarchyDropdownRequest;
    field_count = 0
    resultHierarchy = new SearchHierarchy;
    defaultTag = [{id:[],type:-1},{id:[],type:-2}]
    // ,{id:[0],type:38}
    request = new TableRequest()
    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';
    imageUrl: any
    imagefile = []
    @ViewChild('allSelected') private allSelected: MatOption;

  Company = [
    {id: 0, description: 'All'},
    {id: 1, description: 'Company I'},
    {id: 2, description: 'Company II'},
  ]
  Branch = [
    {id: 0, description: 'All'},
    {id: 1, description: 'Branch I'},
    {id: 2, description: 'Branch II'},
  ]
  Category = [
    {id: 0, description: 'All'},
    {id: 1, description: 'Rank and file'},
    {id: 2, description: 'Managers'},
    {id: 3, description: 'Supervisors'},
  ]
  Department = [
    {id: 0, description: 'All'},
    {id: 1, description: 'IT'},
    {id: 2, description: 'HR'},
    {id: 3, description: 'Sales'},
  ]

  tiles: Tile[] = [
    {text: 'sample_file.png'},
    {text: 'sample_image.jpg'},
    {text: 'sample_excel.xlsx'},
    {text: 'sample_pdf.pdf'},
  ];

  isSave: boolean = false
  id : string;
  NewsForm: FormGroup
  pipe = new DatePipe('en-US');
  dropdownInput = new DropdownInput
  dropdownRequest = new DropdownRequest
  dropdownDefRequest = new DropdownRequest
  dropdownOptions = new DropdownOptions
  moduleId: any
  transactionId: any
  loginId = 0

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private message: FuseConfirmationService,
    private tenantService: TenantService,
    private categoryService: CategoryService,
    private coreService: CoreService,
    private router: Router,
    private storageServiceService: StorageServiceService,
    private dateAdapter: DateAdapter<Date>) {
        this.dateAdapter.setLocale('en-GB');
    }



  get naf(){
    return this.NewsForm.value
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.NewsForm = this.fb.group(new NewsForm());

    var id = [sessionStorage.getItem("u")]
        this.coreService.encrypt_decrypt(false, id)
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

    if (this.id !== "") {
        this.tenantService.getNewsAnnouncements(this.id).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                console.log(value)
                this.NewsForm.patchValue(JSON.parse(JSON.stringify(value.payload).replace(/\:null/gi, "\:[]")))
                this.defaultTag = [{id:value.payload.company,type:-1},{id:value.payload.branch,type:-2}]
                // ,{id:value.payload.departmentId,type:38}
                // this.NewsForm.patchValue(JSON.parse(JSON.stringify(value.payload)))

                this.dropdownRequest.id.push(

                    { dropdownID: value.payload.idDepartment   ==null?0:value.payload.idDepartment, dropdownTypeID: 38 },
                    )

                    this.initData()

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
                this.NewsForm.enable();
              }
          });
    }
    else{
        // console.log(this.defaultTag)
        this.dropdownRequest.id.push({ dropdownID: 0, dropdownTypeID: 38 })
        this.initData()
    }

}

initData(){
    forkJoin({
        dropdown: this.tenantService.getDropdown(this.dropdownRequest),
        branch: this.tenantService.getBranchDropdown(this.dropdownDefRequest),
        category: this.coreService.getCoreDropdown(1007,this.dropdownRequestsub),
        subCompany: this.tenantService.getDropdown(this.dropdownRequest),

    }).subscribe({
        next: (response) => {

            // TENANT
            this.dropdownOptions.departmentDef      = response.dropdown.payload.filter(x => x.dropdownTypeID == 38)

            //API
            this.dropdownOptions.categoryDef        = response.category.payload

        },
        error: (e) => {
            console.error(e)
        },
        complete: () => {
            this.NewsForm.enable();

        },
    });

}

//   tosslePerOne(all){
//     if (this.allSelected.selected) {
//      this.allSelected.deselect();
//      return false;
//  }
//    if(this.NewsForm.controls.company.value.length==this.Company.length)
//      this.allSelected.select();

//  }
   toggleAllSelection() {
     if (this.allSelected.selected) {
       this.NewsForm.controls.company
         .patchValue([this.Company.map(item => item.id), 0]);
     } else {
       this.NewsForm.controls.company.patchValue([]);
     }
   }

  submit(): void {
    var news = this.NewsForm.value
    news.dateFrom = this.pipe.transform(news.dateFrom, 'yyyy-MM-ddTHH:mm:ss' )
    news.dateTo = this.pipe.transform(news.dateTo, 'yyyy-MM-ddTHH:mm:ss' )
    news.dateCreated = this.pipe.transform(news.dateCreated, 'yyyy-MM-ddTHH:mm:ss' )

    var sub = this.resultHierarchy.Search.find(item=>item.Key == "SubCompanyID")
    var bra = this.resultHierarchy.Search.find(item=>item.Key == "BranchID")
    news.company     = sub == undefined ? [0] : sub.Value
    news.branch      = bra == undefined ? [0] : bra.Value

    // news.departmentId = this.resultHierarchy.Search.find(item=>item.Key == "DepartmentID" ).Value

    this.NewsForm.markAllAsTouched();

    if (this.NewsForm.valid) {
      const dialogRef = this.message.open(SaveMessage);
      dialogRef.afterClosed().subscribe((result) => {

        if (result == "confirmed") {

          this.isSave = true
          this.tenantService.PostNewsAnnouncements(news).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.message.open(SuccessMessage);
                this.isSave = false,
                this.transactionId = value.payload
                this.uploadimage()
                this.router.navigate(['/search/news-announcements-view']);
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
    debugger

    // try {
    //   reduce = await this.reduceImageSize(fileToUpload0, 50 * 1024 , 0.8);
    // } catch (error) {
    //   console.error('Error reducing image size:', error);
    //   return; // If an error occurs, you might want to handle it accordingly.
    // }
    reduce = fileToUpload0

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
      case 'uploadFile':
        this.NewsForm.get('uploadFile').setValue(reduce.name);
        // const readers = new FileReader();
        // readers.readAsDataURL(reduce);
        // readers.onload = (event) => {
        //   this.imageUrl = event.target?.result as string;
        // };
        break;
    }
  }

//   uploadFile(event, id, sig, fc) {
//     let reader = new FileReader(); // HTML5 FileReader API
//     const fileToUpload0 = event.target.files[0];
//     var name = sig + '-' + fileToUpload0.name;

//     if (this.imagefile.some(x => x.source == sig)) {
//         var idx = this.imagefile.findIndex(x => x.source == sig);
//         this.imagefile[idx].files = event.target.files[idx];
//     } else {
//         const renamedFile0 = new File([fileToUpload0], name, { type: fileToUpload0.type });
//         this.imagefile.push({
//             source: sig,
//             files: renamedFile0
//         });
//     }
//     // var readers = new FileReader();
//     // readers.readAsDataURL(event.target.files[0]);
//     // readers.onload = (events) => {
//     //     if (fc == "uploadFile") {
//     //         this.imageUrl = events.target.result as string;
//     //     }
//         this.NewsForm.get(fc).setValue(event.target.files[0].name)
//     // }

//   }
}
