import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CoreService } from 'app/services/coreService/coreService.service';
import { GF, Globals } from 'app/shared/global-functions';
import { environment } from 'environments/environment';
import { details } from 'app/model/reports/details.model'

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css'],
})
export class ReportViewComponent implements OnInit {
  title = 'Report';
  serviceUrl = environment.reports + "reportservice/api/Viewer";
  reportServerUrl = environment.reports + "api/site/";
  serverServiceAuthorizationToken = "bearer " + sessionStorage.getItem('rt');

  // toolbarSettings = Globals.TOOLBAR_OPTIONS;
  onToolbarItemClick = Globals.EDIT_REPORT;
  onExportItemClick = Globals.EXPORT_ITEM_CLICK;
  onRenderingComplete = Globals.RENDERING_COMPLETE;
  parameters: any;
  reportType: any;

  public exportSettings: any;
  public toolbarSettings: any;
  public toolbarRenderMode: any;
  public parameterSettings: any;
  storageInterval: any;
  @Input() parentDetails: any
  @Input() reportPath: any
  isView = false
  isWidgets = false
  pipe = new DatePipe('en-US');
  reportviewObj: any

  constructor(private core: CoreService) {

    this.reportServerUrl += sessionStorage.getItem('se') === "0001" ? 'dev-master' : 'dev-'+sessionStorage.getItem('se').toLowerCase().replaceAll(" ","")
    this.exportSettings = {
      CSVOptions: {
        fileExtension: ".txt",
        qualifier: ""
      },
     
      exportOptions: ej.ReportViewer.ExportOptions.All & ~ej.ReportViewer.ExportOptions.Html
      & ~ej.ReportViewer.ExportOptions.XML & ~ej.ReportViewer.ExportOptions.XML
    }
    this.toolbarSettings = {
      // showToolbar: false,
      items: 
      ~ej.ReportViewer.ToolbarItems.Print & 
      ~ej.ReportViewer.ToolbarItems.PrintLayout & 
      ~ej.ReportViewer.ToolbarItems.ExportSetup & 
      ~ej.ReportViewer.ToolbarItems.Analytics & 
      ~ej.ReportViewer.ToolbarItems.PageSetup
    }

    // //tool bar position for new UI
    this.toolbarRenderMode = ej.ReportViewer.ToolbarRenderMode.Classic;
    this.parameterSettings = {
      hideParameterBlock: true,
      position: ej.ReportViewer.Position.Top
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.parentDetails !== undefined) {
      this.isView = GF.IsEmptyReturn(this.parentDetails.template,false)
      this.isWidgets = GF.IsEmptyReturn(this.parentDetails.widgets,false)

      if (this.isWidgets) {
        this.isView = true
        this.toolbarSettings = {
          items: ej.ReportViewer.ToolbarItems.Parameters
        }
      }
    }
    if (this.isView) {
      this.exportSettings.exportOptions = ej.ReportViewer.ExportOptions.Excel
    } else {
      var isDashboardVIew = GF.IsEmpty(sessionStorage.getItem("isDashboardView")) ? false : (sessionStorage.getItem("isDashboardView")=='true')
      if (isDashboardVIew) {
        this.exportSettings.exportOptions = ej.ReportViewer.ExportOptions.Pdf
      } else {
        // this.exportSettings.exportOptions = this.isView ? ej.ReportViewer.ExportOptions.Excel : ej.ReportViewer.ExportOptions.All & ~ej.ReportViewer.ExportOptions.Html
        this.exportSettings.exportOptions = ej.ReportViewer.ExportOptions.All & ~ej.ReportViewer.ExportOptions.Html
        & ~ej.ReportViewer.ExportOptions.XML & ~ej.ReportViewer.ExportOptions.XML
      }
    }

    var payoutdate = this.pipe.transform(new Date(sessionStorage.getItem("payoutDate")),"MM/dd/yyyy")
    
    var decrypt = await this.encryptDecrypt(false,[sessionStorage.getItem('u'), sessionStorage.getItem('sc')]);
    var encrypt = await this.encryptDecrypt(true,[payoutdate]);

    this.setParameters(decrypt, encrypt);
  }

  ngOnDestroy(){
    this.appDestroy(true)
  }

  appDestroy(destroy: boolean) {
    const dynamicDivs = document.querySelectorAll('.e-panel-container');
    dynamicDivs.forEach((divElement, index) => {
      var id = divElement.id.replace("_Control0", "_Control1")
      this.reportviewObj = $("#" + id).data("boldReportViewer");
      if (!GF.IsEmpty(this.reportviewObj)) {
        this.reportviewObj.clearReportCache();
        if (destroy) {
          this.reportviewObj.destroy();
        }
      }
    });
  }

  get report() {
    this.serverServiceAuthorizationToken = "bearer " + sessionStorage.getItem('rt')
    var obj = { showReport: false, Id: "" }
    if (!GF.IsEmpty(sessionStorage.getItem('rt'))) {
      if (!this.isWidgets) {
        if (this.reportPath !== sessionStorage.getItem("reportPath")) {
          if (!GF.IsEmpty(this.reportPath)) {
            this.appDestroy(false)
          }
          this.reportPath = sessionStorage.getItem("reportPath")
        }
      }

      obj.showReport = !GF.IsEmpty(this.reportPath)
      obj.Id = this.reportPath.replaceAll("/", "_").replaceAll(" ", "_")
    }
    return obj
  }

  private async encryptDecrypt(mode,params: string[]): Promise<any> {
    try {
      const response = await this.core.encrypt_decrypt(mode, params).toPromise();
      return response; // Return the response from the API call
    } catch (error) {
      console.error('Error in encryptDecrypt:', error);
      throw error; // Rethrow the error for proper error handling
    }
  }

  setParameters(decrypt, encrypt){
      this.parameters = [
        //Decrypted
        {
          name: 'LoginId',
          labels: ['LoginId'],
          values: [Number(decrypt['payload'][0])],
          nullable: false,
        },
        {
          name: 'EmployeeId',
          labels: ['EmployeeId'],
          values: [Number(decrypt['payload'][0])],
          nullable: false,
        },
        {
          name: 'SeriesCode',
          labels: ['SeriesCode'],
          values: [decrypt['payload'][1]],
          nullable: false,
        },
        {
          name: 'PayoutDate',
          labels: ['PayoutDate'],
          values: [sessionStorage.getItem("payoutDate")],
          nullable: false,
        },
        {
          name: 'PayrollCode',
          labels: ['PayrollCode'],
          values: [sessionStorage.getItem("payrollCode")],
          nullable: false,
        },
        //Encrypted
        {
          name: 'EncryptedLoginId',
          labels: ['EncryptedLoginId'],
          values: [sessionStorage.getItem('u')],
          nullable: false,
        },
        {
          name: 'EncryptedEmployeeId',
          labels: ['EncryptedEmployeeId'],
          values: [sessionStorage.getItem('u')],
          nullable: false,
        },
        {
          name: 'EncryptedSeriesCode',
          labels: ['EncryptedSeriesCode'],
          values: [sessionStorage.getItem('sc')],
          nullable: false,
        },
        {
          name: 'EncryptedPayoutDate',
          labels: ['EncryptedPayoutDate'],
          values: [encrypt['payload'][0]],
          nullable: false,
        },
      ];
  }

  get route(){
    var iDownload = details.some(x=>x.moduleId == Number(sessionStorage.getItem("moduleId")))
    var obj = {
      isBoldReport:  GF.IsEmpty(this.reportPath) ? false : (this.reportPath !== "Payroll_Report/hdmf") && !iDownload,
      isHDMF:        GF.IsEmpty(this.reportPath) ? false : this.reportPath == "Payroll_Report/hdmf",
      isDownload:    iDownload
    }

    // console.log(obj)

    return obj;
  }
}
