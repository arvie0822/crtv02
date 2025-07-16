import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TableRequest } from 'app/model/datatable.model';
import { DropdownRequest } from 'app/model/dropdown.model';
import { FailedMessage, SuccessMessage, SaveMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { FileService } from 'app/services/fileService/file.service';
import { MasterService } from 'app/services/masterService/master.service';
import { myData } from 'app/model/app.moduleId';
import _ from 'lodash';
import { setup } from 'app/modules/upload/setting.model'
import { GF } from 'app/shared/global-functions';
import { MatOption } from '@angular/material/core';
import { FormControl, UntypedFormControl } from '@angular/forms';

const applications: any[] = [];

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  displayedColumns: any[] = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource<any>(applications);
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('allSelected') private allSelected: MatOption;
  inputChange: UntypedFormControl = new UntypedFormControl();
  request = new TableRequest
  id: string
  showHide: number
  documents = []
  saved = []
  options_old: any[] = [];
  complete: boolean = false
  dropdownFix = new DropdownRequest
  documentId = 0
  saveId: number
  isViewUpload = true
  isUploadV2 = false
  isUploadMode = true
  fileDetail = {
    files: null,
    name: null,
    save: 0,
    guid: "",
    error: false
  }
  mode = 0;

  isUploading: boolean = false
  totalRows: number = 0
  parentDetails: any = {}

  failedMessage = {...FailedMessage}
  successMessage = {...SuccessMessage}
  savedMessage = Object.assign({},SaveMessage)
  deleteMessage = Object.assign({},FailedMessage)

  constructor(
    private masterService: MasterService,
    private fileService: FileService,
    private message: FuseConfirmationService,
    private route: ActivatedRoute,
    private core: CoreService,
    ) {
      this.request.Length = 50
      this.request.Order = "errorLogs"
      this.request.OrderBy = "DESC"
    }

  ngOnInit(): void {
    sessionStorage.setItem("isDashboardView", '')
    this.parentDetails.template = true
    this.id = sessionStorage.getItem("moduleId");//this.route.snapshot.paramMap.get('id');

    if (this.isSchedule()) {
      // this.isUploadV2 = true
      return
    }

    var ids = setup.find(x=>x.moduleId === this.id).fixId

    ids.forEach(id => {
      this.dropdownFix.id.push(
        { dropdownID: id, dropdownTypeID: 16 }
      )
    });

    this.masterService.getDropdownFix(this.dropdownFix).subscribe({
      next: (value: any) => {
        this.documents = _.uniqBy(value.payload.filter(x=> ids.includes(x.dropdownID)), JSON.stringify)
      },
      error: (e) => {
        console.error(e)
      }
    });

  }

  ngAfterViewInit(){
    // this.dataSource.paginator = this.paginator;
  }

  submit(){
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

    if (this.fileDetail.error) {
      this.failedMessage.title = "Unable to upload!"
      this.failedMessage.message = "Please review your file first. There is row has error!"
      this.message.open(this.failedMessage);
      return
    }

    const saving = this.message.open(SaveMessage)
    saving.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        debugger
        if (this.isUploadV2) {
          this.sumbitV2()
        } else {
          this.fileDetail.save = 1;
          this.uploading()
        }
      }
    })

  }

  // ********************* Delete Function ********************* \\

    delete() {
        var list = []
        var ID = this.saved.find(x => x.id === this.saveId).uploadID
        list.push(ID)
        this.savedMessage.message = "Are you sure you want to delete the file?"
        const dialogRef = this.message.open(this.savedMessage);
        dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
                this.fileService.PostDeleteUploadedFileHandler(this.showHide, list).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.successMessage.title = "Notice!"
                            this.successMessage.message = value.payload
                            this.successMessage.actions.confirm.label = "Ok"
                            this.message.open(this.successMessage);
                            this.savedFileDropdown(false)
                            this.dataSource.data = []
                            this.isViewUpload = false
                        }
                    }
                });
            }
        })
    }

  // ********************* Saved Dropdown ********************* \\

  savedFileDropdown(isview){
    var ID = 0
    if(isview){
        ID = this.saved.find(x => x.id === this.saveId).uploadID
        this.request.Length = 10
    }
    this.fileService.getUploadedFileHandler(this.request,this.showHide,"",ID,isview,false).subscribe({
        next: (value: any) => {
            if(value.statusCode == 200){
                if(isview === false){
                    this.saved = value.payload.data
                } else {
                    this.totalRows = value.payload.totalRows
                    var col = value.payload.headers.filter(x=>x.isView)

                    this.displayedColumns = col
                    this.columnsToDisplay = col.map(x=>x.col)
                    this.dataSource.data = value.payload.data
                    this.isViewUpload = true
                }
            }}
    });
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
    debugger
    if (this.isUploadV2) {
      this.uploadingV2()
    } else {
      this.uploading()
    }
    event.target.value = null;
  }

  // ********************* UPLOADING VERSION 1 ********************* \\

  uploading(){
    this.isUploading = true
    var file = this.fileDetail
    var id = this.documents.find(x=>x.encryptID == this.documentId).dropdownID
    this.fileService.postUploadHandler(id, file.files, file.name, file.save, file.guid, 0, "", false)
    .subscribe({
      next: (value: any) => {
          if (value.statusCode == 200) {
            this.fileDetail.guid = value.message
            if (this.fileDetail.save === 0) {
              this.uploadingView()
            } else {
              this.isUploading = false
              this.isViewUpload = false
              this.message.open(this.successMessage)
            }
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

  uploadingView(){
    var file = this.fileDetail
    var id = this.documents.find(x=>x.encryptID == this.documentId).dropdownID
    this.fileService.getUploadHandlerView(id, 0, this.request, file.guid,false).subscribe({
      next: (value: any) => {
          if (value.statusCode == 200) {
            this.fileDetail.error = value.payload.isError
            this.totalRows = value.payload.totalRows

              var col = value.payload.headers.filter(x=>x.isView)

              this.displayedColumns = col
              this.columnsToDisplay = col.map(x=>x.col)
              this.dataSource.data = value.payload.data
              this.isViewUpload = true
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

  // ********************* UPLOADING VERSION 2 ********************* \\

  isSchedule(){
    var itis = true
    //if not v2 return immediately
    // if (setup.some(x=>x.moduleId === this.id)) {
    //   itis = false
    //   return itis
    // }
    //else continue
    var dup = GF.IsEqual(sessionStorage.getItem("moduleId"),["103"])
    var mgmt = GF.IsEqual(sessionStorage.getItem("moduleId"),["40"])
    var moduleId = dup || mgmt ? "0" : sessionStorage.getItem("moduleId")
    this.core.encrypt_decrypt(true,[moduleId+""])
    .subscribe({
      next: (value: any) => {
        var req = new DropdownRequest
        req.id = []
        //get employee schedule dropdown type
        this.fileService.getUploadTypesDropdown(req,value.payload[0])
        .subscribe({
          next: (value: any) => {
            this.documents = dup ? GF.FilterEqual(value.payload, "dropdownID",[41,121,30002,22862,22863, 4,5,6,7,8,9,13,18,19]) :
                            mgmt ? GF.FilterEqual(value.payload, "dropdownID",[1]) : value.payload
            // this.documents = dup ? GF.FilterNotIncludes(value.payload, "description","Update") : value.payload
            // this.isUploadV2 = dup ? true : value.payload[0].isV2
          },
          error: (e) => {
            console.error(e)
          },
        });

      },
      error: (e) => {
        console.error(e)
      },
    });

    return itis
  }

  uploadingV2(){
    this.isUploading = true
    var file = this.fileDetail
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
          this.isViewUpload = true
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

  moveIndexToTop(arr, index) {
    if (index >= arr.length || index < 0) {
      console.error("Invalid index");
      return arr;
    }

    const element = arr.splice(index, 1)[0];
    arr.unshift(element);

    return arr;
  }

  sumbitV2(){
    var file = this.fileDetail
    var obj = {
      cacheName: file.guid
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



  // ********************* V1 and V2  Next Batch ********************
  handlePageEvent(e){
    this.request.Start = e.pageIndex
    this.request.Length = e.pageSize
    if (this.isUploadV2) {
      this.uploadingViewV2()
    } else {
      this.uploadingView()
    }
    if(this.saved.length > 0){
        this.savedFileDropdown(true)
    }
  }

  export(){
    // this.core.exportAll([],this.documentId+"",'0')
    this.isUploadMode = false
  }

  changeDocuments(){
    // var id = this.documentId

    // var reportPath =  id == 41 ?     "/Upload/New Employee Upload Template"
    //                 : id == 121 ?    "/Upload/New Employee Information Template"
    //                 : id == 30015 ?  "/Upload/Update Employee Upload Template"
    //                 : id == 30016 ?  "/Upload/Update Employee Information Template"
    //                 : ""

    // if (this.isUploadV2) {
    // id = this.documents.find(x=>x.encryptID == this.documentId).dropdownID
    // }
    this.showHide =  this.documents.find(x=>x.encryptID == this.documentId).dropdownID
    var report = this.documents.find(x=>x.encryptID == this.documentId)
    var reportPath = report.exportPath
    this.isUploadV2 = report.isV2

    sessionStorage.setItem("reportPath", reportPath)

    this.savedFileDropdown(false)
    this.dataSource.data = []
    this.isViewUpload = false
  }
}
