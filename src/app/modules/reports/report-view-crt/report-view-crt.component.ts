import { Component, OnInit } from '@angular/core';
import { GF, Globals } from 'app/shared/global-functions';
import { environment } from 'environments/environment';
import { defaults } from 'app/core/navigation/navigation.types';
import { MatDialog } from '@angular/material/dialog';
import { DialogDelComponent } from 'app/layout/common/dialog-del/dialog-del.component';
import { DialogAddComponent } from 'app/layout/common/dialog-add/dialog-add.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/userService/user.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { DatePipe } from '@angular/common';
import { FileService } from 'app/services/fileService/file.service';
import { TableRequest } from 'app/model/datatable.model';
import { MatTableDataSource } from '@angular/material/table';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { HttpHeaders } from '@angular/common/http';

const applications: any[] = [];

interface settingsInt {
  upload: boolean,
  add: boolean,
  delete: boolean,
}

@Component({
  selector: 'app-report-view-crt',
  templateUrl: './report-view-crt.component.html',
  styleUrls: ['./report-view-crt.component.css']
})
export class ReportViewCrtComponent implements OnInit {

  reportviewObj: any
  isUploading: boolean = false
  isDashboard: boolean = false

  default = defaults
  pipe = new DatePipe('en-US');

  //Uploading
  displayedColumns: any[] = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource<any>(applications);
  totalRows: number = 0
  request = new TableRequest
  documentId = "1aQsscYkD1SWf3AMAX2PTQ%3d%3d"; //24 - CRT exclude error //"%2bn%2bPSzENiOAcC0drmsXdfw%3d%3d" // 22 - CRT
  isUploadMode = false
  fileDetail = {
    files: null,
    name: null,
    save: 0,
    guid: "",
    error: false
  }

  failedMessage = {...FailedMessage}
  successMessage = {...SuccessMessage}
  savedMessage = Object.assign({},SaveMessage)
  deleteMessage = Object.assign({},FailedMessage)

  parentDetails: any = {}
  uploadType: number = 24;//Upload Default = 31162, robomotion = 24
  dataTemp: any

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute, 
    private userService: UserService,
    private message: FuseConfirmationService,
    private fileService: FileService,
    private storageService: StorageServiceService) {
    this.request.Length = 50
    this.request.Order = "errorLogs"
    this.request.OrderBy = "DESC"

    this.route.params.subscribe((val) => {
      sessionStorage.setItem("moduleId","menu."+val.id)
    });
   }

  ngOnInit() {
    this.parentDetails.template = true
  }

  get settings(): settingsInt {
    return this.default.find(x=>x.ids===GF.IsEmptyReturn(sessionStorage.getItem("moduleId"),"menu.dashboard")).settings
  }

  ngOnDestroy(){
  }

  top(){
    return this.isDashboard ? "15px" : "50px";
  }

  uploadFile(event) {
    let element: HTMLElement = document.querySelector("#fielUpload") as HTMLElement;
    let fileName = event.target.files[0].name;
    element.setAttribute('value', fileName)

    var files = event.target.files;
    if (files.length === 0) {
      return;
    }

    this.fileDetail.files = files;
    this.fileDetail.name = fileName;
    this.fileDetail.save = 0;
    this.fileDetail.guid = "";
    this.isUploadMode  = true
    this.uploadingV2()
    event.target.value = null;
  }

  addEvent(){
    const add = this.dialog.open(DialogAddComponent, {
      minWidth: '25%',
      disableClose: true,
      data: []
    })

    add.afterClosed().subscribe(res => {
      res.data.birthDay = this.pipe.transform(res.data.birthDate,"yyyy-MM-dd")
      if (res.confirm) {
        this.userService.postAddUser(res.data).subscribe({
          next: (value: any) => {
            if (value.statusCode == 200) {
              this.message.open(SuccessMessage);
            } else {
              this.failedMessage.message = value.message;
              this.message.open(this.failedMessage)
            }
          },
          error: (e) => {
            console.error(e)
          }
        });
      }
    })
  }

  deleteEvent(){
    const del = this.dialog.open(DialogDelComponent, {
      minWidth: '25%',
      disableClose: true,
      data: []
    })

    del.afterClosed().subscribe(out => {
      if (out.isConfrim) {
        this.userService.PostDeleteUsers(out.event).subscribe({
          next: (value: any) => {
            if (value.statusCode == 200) {
              this.message.open(SuccessMessage);
            }
          },
          error: (e) => {
            console.error(e)
          }
        });
      }
    })
  }

  listEvent(){
    this.isUploadMode = false
  }

  uploadingV2(){
    this.isUploading = true
    var file = this.fileDetail
    console.log(this.uploadType)
    this.fileService.postUploadInMemory(file.files, this.documentId, file.name)
    .subscribe({
      next: (value: any) => {
          if (value.statusCode == 200) {
            this.fileDetail.guid = value.payload
            this.uploadingViewV2()
          } else {
            this.isUploading = false
            this.message.open(FailedMessage)
          }
        },
        error: (e) => {
            console.error(e)
            this.isUploading = false
            this.message.open(FailedMessage)
        }
      });
  }

  uploadingViewV2() {
    var file = this.fileDetail
    var obj = {
      cache: file.guid,
      onlyErrors: false,
      table: this.request
    }
    this.fileService.viewUploadInMemoryTable(obj)
    .subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          this.fileDetail.error = value.payload.hasErrors
          this.totalRows = value.payload.totalRows

          var wError = value.payload.data.filter(x=>x.withError)

          var dataTemp = {
            totalRows: this.totalRows,
            request: obj,
            headers: this.getHeaders(),
            data: wError.length > 0 ? wError.map((item,ii)=>({
              errorLogs: item.errorLogs,
              row: (ii+1)
            })) : [],
          }

          this.dataTemp = JSON.stringify(dataTemp);

          var col = value.payload.header.map(x=>({
            colName: x.column,
            col: x.columnDef,
          }))

          var alterCol = col.map(x => x.col)
          var findIndex = alterCol.findIndex(x=>x=="errorLogs")
          this.moveIndexToTop(alterCol, findIndex);

          this.displayedColumns = col
          this.columnsToDisplay = alterCol
          this.dataSource.data = value.payload.data
          this.isUploading = false
        }
        else {
            this.isUploading = false
            this.message.open(FailedMessage)
        }
      },
      error: (e) => {
          console.error(e)
          this.isUploading = false
          this.message.open(FailedMessage)
      }
    });
  }

  getHeaders() {
    var headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
      "Series": sessionStorage.getItem('sc'),
      'Loginid': sessionStorage.getItem('u'),
      'User': sessionStorage.getItem('dn')
    }
    return headers;
  }

  moveIndexToTop(arr, index) {
    if (index >= arr.length || index < 0) {
      console.error("Invalid index");
      return arr;
    }

    const element = arr.splice(index, 1)[0];
    arr.unshift(element);

    return arr;
  }

  handlePageEvent(e){
    this.request.Start = e.pageIndex
    this.request.Length = e.pageSize
    this.uploadingViewV2()
  }

  submitEvent(){
    if (this.isUploading) {
      this.failedMessage.title = "Warning!"
      this.failedMessage.message = "Currently Processing! Please wait..."
      this.failedMessage.actions.confirm.label = "Ok"
      this.message.open(this.failedMessage);
      return
    }

    if (this.fileDetail.guid == "") {
      this.failedMessage.title = "Warning!"
      this.failedMessage.message = "No file uploaded. upload your file first!"
      this.failedMessage.actions.confirm.label = "Ok"
      this.message.open(this.failedMessage);
      return
    }

    if (this.fileDetail.error && this.uploadType != 24 ) {//31163 robomotion
      this.failedMessage.title = "Unable to upload!"
      this.failedMessage.message = "Please review your file first. There is row has error!"
      this.message.open(this.failedMessage);
      return
    }

    if (this.uploadType != 24) {//31163 robomotion
      const saving = this.message.open(SaveMessage)
      saving.afterClosed().subscribe((result) => {
        if (result == "confirmed") {
          this.sumbitV2()
        }
      })
    } else {
      this.sumbitV2()
    }
    
  }

  updateCRTStatus(id) {
    this.userService.postUpdateUser(id).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          this.message.open(SuccessMessage);
        } else {
          this.failedMessage.message = value.message;
          this.message.open(this.failedMessage)
        }
      },
      error: (e) => {
        console.error(e)
      }
    });
  }

  sumbitV2(){
    var file = this.fileDetail
    var obj = {
      cacheName: file.guid,
      uploadType: this.uploadType
    }
    this.fileService.postInsertFromMemory(obj)
    .subscribe({
      next: (value: any) => {
          if (value.statusCode == 200) {
            this.isUploading = false
            this.successMessage.message = value.message
            this.message.open(this.successMessage)
          } else {
            this.isUploading = false
            this.message.open(FailedMessage)
          }
        },
        error: (e) => {
            console.error(e)
            this.isUploading = false
            this.message.open(FailedMessage)
        }
      });
  }

}
