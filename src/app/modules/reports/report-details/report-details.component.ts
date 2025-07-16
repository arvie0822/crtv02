import { Component, OnInit } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DropdownHierarchyRequest, DropdownRequest, SearchHierarchy } from 'app/model/dropdown.model';
import { CoreService } from 'app/services/coreService/coreService.service';
import { details } from 'app/model/reports/details.model'
import { GF } from 'app/shared/global-functions';
import { TableRequest } from 'app/model/datatable.model';
import { FailedMessage, SuccessMessage } from 'app/model/message.constant';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerComponent } from 'app/layout/common/spinner/spinner.component';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css'],
})
export class ReportDetailsComponent implements OnInit {

  resultHierarchy = new SearchHierarchy;
  year: any = []
  yearId: number
  employeeStatusId: number
  table: any
  resetHierarchy: boolean = false
  loginId: string = ""
  downloading: boolean = false
  saving: boolean = false
  failedMessage = Object.assign({}, FailedMessage)
  successMessage = Object.assign({}, SuccessMessage)
  private spinnerDialogRef: MatDialogRef<SpinnerComponent>;

  constructor(
    private coreService: CoreService,
    private message: FuseConfirmationService,
    public dialog: MatDialog
    ) { }

  async ngOnInit() {
    this.table = details.find(x=>x.moduleId == Number(sessionStorage.getItem("moduleId")))
    var decrypt = await this.encryptDecrypt(false,[sessionStorage.getItem('u')]);
    this.loginId = decrypt['payload'][0]
  }


  async exportNow(){
    this.downloading = true
    this.spinnerModal(true, "Downloading...")
    // Downlaod From Backend
    if (this.table.downloadFromBE) {
      var params = this.setParameters()
      if (this.table.downloadFromBR) {
        this.DownloadFromBackendv1(params,false)
      } else {
        this.DownloadFromBackendv2(params)
      }
      return
    }
    // Downlaod From Bold Report
    this.DownloadFromBoldReport([],false)
  }

  private async encryptDecrypt(mode,params: string[]): Promise<any> {
    try {
      const response = await this.coreService.encrypt_decrypt(mode, params).toPromise();
      return response; // Return the response from the API call
    } catch (error) {
      console.error('Error in encryptDecrypt:', error);
      throw error; // Rethrow the error for proper error handling
    }
  }

  setParameters(){
    var params = []
    this.table.parameters.forEach(item => {
      //Tag Type
      if (item.id == "tagType") {
        var search = this.resultHierarchy.Search.find(x=>x.Key == item.key)
        if (search) {
          if (Array.isArray(search.Value)) {
            search.Value.forEach(val => {
              params.push({ key: search.Key, value: val+"", type: 2 })
            });
          } else {//Single
            params.push({ key: search.Key, value: search.Value+"", type: 2 })
          }
        }
      } else {//Custom | Select | Fix
        var vals = this.table.fields.find(x=>x.id === item.id).value
        //Multiple
        if (GF.IsEmpty(vals)) { return params }
        if (Array.isArray(vals)) {
          vals.forEach(val => {
            params.push({ key: item.key, value: val+"", type: 2 })
          });
        } else {//Single
          params.push({ key: item.key, value: vals+"", type: 2 })
        }
      }
    });

    return params;
  }

  DownloadFromBackendv1(params, publishOnly){
    if (this.hasRequired()) { return }

    var obj = {
      SearchColumn: params.filter(x=>x.key !== "IsPublish" ),
      IsPublish: GF.IsEmpty(params.find(x=>x.key=="IsPublish")?.value) ? false :  (params.find(x=>x.key=="IsPublish")?.value == 'true')// Not used
    }
    this.coreService.postData(this.table.url, obj).subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          if (!GF.IsEmpty(value.payload.list) && !publishOnly) {
            //Download From Bold Report 
            this.DownloadFromBoldReport(value.payload.list,true);
          } else {
            this.spinnerModal(false, "Saving...")
            this.saving = false
            this.message.open(this.successMessage)
          }
        }
        else {
          // FailedMessage.message = value.message
          // this.message.open(FailedMessage);
          console.log(value.stackTrace)
          console.log(value.message)
        }
      },
      error: (e) => {
        this.message.open(FailedMessage);
        console.error(e)
      }
    });
  }

  DownloadFromBackendv2(params){
    // No Code yet
  }

  async DownloadFromBoldReport(list,is2316){
    // Single Parameters
    var params = "{"
    params += `'LoginId':['${this.loginId}'],`;
    this.table.parameters.forEach(item => {
        var val = this.table.fields.find(x=>x.id === item.id)
        params += `'${item.id}':['${val.value}'],`
    }); 
    params += "}"

    if (is2316) {
       // Bulk Download
       var bulkParams = {
        Employee: list,
        Year: list[0].year,
        PayrollCode: "Report"
      }
      await this.coreService.bulkDownloadReport(this.table.reportName,"2316-ZIP","",this.table.type,"Employee", bulkParams)
      this.downloading = false
      this.spinnerModal(false,"Downloading...")

    } else {

      //Single Download
      await this.coreService.directDownloadBoldRTemplate(this.table.reportName, this.table.reportName, this.table.type, params, null, false, "")
      this.downloading = false
      this.spinnerModal(false,"Downloading...")
    }
  }

  getIds(object){
    var vals = GF.IsEmptyReturn(this.table.fields.find(x=>x.id == object).value,[])
    return Array.isArray(vals) ? vals : [vals]
  }


  customRequest(id){
    var cr = this.table.fields.find(x=>x.id == id).customRequest
    var customRequest = new DropdownHierarchyRequest
    customRequest.id = []
    if (!GF.IsEmpty(cr)) {
      cr.forEach(req => {
        var vals = this.table.fields.find(x=>x.id === req)
        var key = this.table.parameters.find(x=>x.id == req).key
        if (!GF.IsEmpty(vals.value)) {
          customRequest.id.push({
            key: key,
            dropdownID: Array.isArray(vals.value) ? vals.value : [vals.value],
            dropdownTypeID: vals.type_id
          })
        }
      });
      return customRequest;
    }
  }

  hasRequired(){
    var fields = this.table.fields
    var msg = "";
    fields.filter(x=>x.required).forEach(req => {
      if (GF.IsEmpty(req.value)) {
        msg += req.label +", "
      }
    });
    if (!GF.IsEmpty(msg)) {
      this.failedMessage.title = "Warning"
      this.failedMessage.message = msg + " is required.\n"
      this.message.open(this.failedMessage)
      this.downloading = false;
      this.spinnerModal(false,"Downloading...")
      return true;
    }
    return false;
  }

  publish(){
    this.spinnerModal(true,"Saving...")
    this.saving = true;
    var params = this.setParameters()
    this.DownloadFromBackendv1(params,true)
  }

  spinnerModal(bool, title) {
    if (bool) {
      this.spinnerDialogRef = this.dialog.open(SpinnerComponent, { disableClose: true, data: title });
    } else {
      this.spinnerDialogRef.close();
    }
  }
}
