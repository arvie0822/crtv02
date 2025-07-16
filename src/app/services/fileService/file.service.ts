import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../authService/auth.service';
import { TableRequest } from 'app/model/datatable.model';
import { FuseLoadingService } from '@fuse/services/loading';
import { param } from 'app/model/settings';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  private uri = environment.apiUrl + "timekeeping/";
  private url = environment.apiUrl + "file/";
//   private uru = environment.apiUrl + "file/export/payroll/";
  constructor(private http: HttpClient,private handler: HttpBackend,private auth: AuthService, private _fuseLoadingService: FuseLoadingService ) {
    // this._fuseLoadingService.setAutoMode(true)
   }

  tableExport(param): Observable<any> {
    return this.http.post(this.uri + "tableExport", param).pipe(
        switchMap((response: any) => {
            return of(response);
        })
    );
}

  postUploadHandler(dropdowntypeid,files,filename,issave,uploadid,payrolltypeid,payrollcode,isadj): Observable<any> {
    let params = new HttpParams();
    this.http = new HttpClient(this.handler)
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    let headers = new HttpHeaders()
    headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    headers = headers.set('Access-Control-Max-Age', '86400');
    headers = headers.set('Series', sessionStorage.getItem('sc'));
    headers = headers.set('LoginID', sessionStorage.getItem('u'));
    headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
    headers = headers.set('User', sessionStorage.getItem('dn'));
    headers = headers.set('device', sessionStorage.getItem('d'));
    headers = headers.set('browser', sessionStorage.getItem('b'));
    headers = headers.set('Language', "en");

    params = params.append('dropdowntypeid',dropdowntypeid);
    params = params.append('filename',filename);
    params = params.append('issave',issave);
    params = params.append('uploadid',uploadid);
    params = params.append('payrolltypeid',payrolltypeid);
    params = params.append('payrollcode',payrollcode);
    params = params.append('isadj',isadj);

    if (issave == 0) {
        formData.append('file',fileToUpload, fileToUpload.name);
    } else {
        formData.append('file',null);
    }
    return this.http.post(this.url + "postUploadHandler",formData, {headers: headers,params: params }).pipe(
        switchMap((response: any) => {
            return of(response);
        })
    );
}

getUploadHandlerView(dropdowntypeid, id, model, uploadid,isadj): Observable<any[]> {
    let params = new HttpParams();
    let headers = new HttpHeaders()
    params = params.append('dropdowntypeid',dropdowntypeid);
    params = params.append('id',id);
    params = params.append('uploadid',uploadid);
    params = params.append('isadj',isadj);
    headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    headers = headers.set('Access-Control-Max-Age', '86400');
    headers = headers.set('Series', sessionStorage.getItem('sc'));
    headers = headers.set('LoginID', sessionStorage.getItem('u'));
    headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
    headers = headers.set('User', sessionStorage.getItem('dn'));
    headers = headers.set('device', sessionStorage.getItem('d'));
    headers = headers.set('browser', sessionStorage.getItem('b'));
    headers = headers.set('Language', "en");
    return this.http.post(this.url + "getUploadHandlerView",model, {headers: headers,params: params}).pipe(
        switchMap((response: any) => {
            return of(response);
        })
    );
}

postPayrollGovConUpload(file,payrolltypeid,filename): Observable<any> {
    let params = new HttpParams();
    this.http = new HttpClient(this.handler)
    let fileToUpload = <File>file[0];
    const formData = new FormData();
    let headers = new HttpHeaders()
    headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    headers = headers.set('Access-Control-Max-Age', '86400');
    headers = headers.set('Series', sessionStorage.getItem('sc'));
    headers = headers.set('LoginID', sessionStorage.getItem('u'));
    headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
    headers = headers.set('User', sessionStorage.getItem('dn'));
    headers = headers.set('device', sessionStorage.getItem('d'));
    headers = headers.set('browser', sessionStorage.getItem('b'));
    headers = headers.set('Language', "en");
    formData.append('file',fileToUpload, fileToUpload.name);
    params = params.append('filename',filename);
    params = params.append('payrolltypeid',payrolltypeid);
    return this.http.post(this.url + "postPayrollGovConUpload",formData, {headers: headers,params: params }).pipe(
        switchMap((response: any) => {
            return of(response);
        })
    );
}

exportFileHandler(body, mid, view){
    let params = new HttpParams();
    params = params.append('dropdownid',mid);
    params = params.append('isview',view);
    return this.http.post(this.url + "exportFileHandler",body, {params: params}).pipe(
        switchMap((response: any) => {
            return of(response);
        })
    );
}

getPayrollGovConUploadView(model, uploadid): Observable<any[]> {
    let params = new HttpParams();
    let headers = new HttpHeaders()
    params = params.append('uploadid',uploadid);
    headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    headers = headers.set('Access-Control-Max-Age', '86400');
    headers = headers.set('Series', sessionStorage.getItem('sc'));
    headers = headers.set('LoginID', sessionStorage.getItem('u'));
    headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
    headers = headers.set('User', sessionStorage.getItem('dn'));
    headers = headers.set('device', sessionStorage.getItem('d'));
    headers = headers.set('browser', sessionStorage.getItem('b'));
    headers = headers.set('Language', "en");
    return this.http.post(this.url + "getPayrollGovConUploadView",model, {headers: headers,params: params}).pipe(
        switchMap((response: any) => {
            return of(response);
        })
    );
}

// postPayrollGovConUploadFinal(uploadid): Observable<any> {
//     let params = new HttpParams();
//     this.http = new HttpClient(this.handler)
//     let headers = new HttpHeaders()
//     headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
//     headers = headers.set('Access-Control-Max-Age', '86400');
//     headers = headers.set('Series', sessionStorage.getItem('sc'));
//     headers = headers.set('LoginID', sessionStorage.getItem('u'));
//     headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
//     headers = headers.set('User', sessionStorage.getItem('dn'));
//     headers = headers.set('device', sessionStorage.getItem('d'));
//     headers = headers.set('browser', sessionStorage.getItem('b'));
// headers = headers.set('Language', "en");
//     params = params.append('uploadid',uploadid);
//     return this.http.post(this.url + "postPayrollGovConUploadFinal",{headers: headers,params: params }).pipe(
//         switchMap((response: any) => {
//             return of(response);
//         })
//     );
// }
// postPayrollGovConUploadFinal(uploadid): Observable<any> {
//     let params = new HttpParams();
//     params = params.append('uploadid',uploadid);
//     return this.http.post(this.url + "postPayrollGovConUploadFinal", {params: params }).pipe(
//         switchMap((response: any) => {
//             return of(response);
//         })
//     );
// }

postPayrollGovConUploadFinal(uploadid): Observable<any> {
    this.http = new HttpClient(this.handler)
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
        headers = headers.set('Access-Control-Max-Age', '86400');
        headers = headers.set('Series', sessionStorage.getItem('sc'));
        headers = headers.set('LoginID', sessionStorage.getItem('u'));
        headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
        headers = headers.set('User', sessionStorage.getItem('dn'));
        headers = headers.set('device', sessionStorage.getItem('d'));
        headers = headers.set('browser', sessionStorage.getItem('b'));
        headers = headers.set('Language', "en");
    let params = new HttpParams();
    params = params.append('uploadid', uploadid);
    return this.http.post(this.url + "postPayrollGovConUploadFinal",{} ,{headers:headers,params: params})
}


getTKCodeDropdown(req,year,month,cutoffid): Observable<any> {
    let params = new HttpParams();
    this.http = new HttpClient(this.handler)
    let headers = new HttpHeaders()
    headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    headers = headers.set('Access-Control-Max-Age', '86400');
    headers = headers.set('Series', sessionStorage.getItem('sc'));
    headers = headers.set('LoginID', sessionStorage.getItem('u'));
    headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
    headers = headers.set('User', sessionStorage.getItem('dn'));
    headers = headers.set('device', sessionStorage.getItem('d'));
    headers = headers.set('browser', sessionStorage.getItem('b'));
    headers = headers.set('Language', "en");
    params = params.append('year',year);
    params = params.append('month',month);
    params = params.append('cutoffid',cutoffid);
    return this.http.post(this.url + "getTKCodeDropdown",req, {headers: headers,params: params }).pipe(
        switchMap((response: any) => {
            return of(response);
        })
    );
}

exportPayrollRegister(request): Observable<any> {
    this._fuseLoadingService.show();
    this.http = new HttpClient(this.handler)
    let headers = new HttpHeaders()
    headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    headers = headers.set('Access-Control-Max-Age', '86400');
    headers = headers.set('Series', sessionStorage.getItem('sc'));
    headers = headers.set('LoginID', sessionStorage.getItem('u'));
    headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
    headers = headers.set('User', sessionStorage.getItem('dn'));
    headers = headers.set('device', sessionStorage.getItem('d'));
    headers = headers.set('browser', sessionStorage.getItem('b'));
    headers = headers.set('Language', "en");
    return this.http.post(this.url + "export/payroll/exportPayrollRegister", request, {headers: headers}).pipe(
        switchMap((response: any) => {
            this._fuseLoadingService.hide();
            return of(response);
        })
    );
}

    // ********** UPLOADING VERSION 2 **************** \\
    getUploadTypesDropdown(param,id): Observable<any> {
        let params = new HttpParams();
        var http = new HttpClient(this.handler)
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
        headers = headers.set('Access-Control-Max-Age', '86400');
        headers = headers.set('Series', sessionStorage.getItem('sc'));
        headers = headers.set('LoginID', sessionStorage.getItem('u'));
        headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
        headers = headers.set('User', sessionStorage.getItem('dn'));
        headers = headers.set('device', sessionStorage.getItem('d'));
        headers = headers.set('browser', sessionStorage.getItem('b'));
        headers = headers.set('Language', "en");
        params = params.append('id',id);
        return http.post(this.url + "import/getUploadTypesDropdown", param, {headers: headers,params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    postUploadInMemory(files,id, filename): Observable<any> {
        let params = new HttpParams();
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        var http = new HttpClient(this.handler)
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
        headers = headers.set('Access-Control-Max-Age', '86400');
        headers = headers.set('Series', sessionStorage.getItem('sc'));
        headers = headers.set('LoginID', sessionStorage.getItem('u'));
        headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
        headers = headers.set('User', sessionStorage.getItem('dn'));
        headers = headers.set('device', sessionStorage.getItem('d'));
        headers = headers.set('browser', sessionStorage.getItem('b'));
        headers = headers.set('Language', "en");
        formData.append('file',fileToUpload, fileToUpload.name);
        params = params.append('id',id);
        params = params.append('FileName', filename);
        return http.post(this.url + "import/postUploadInMemory",formData, { headers: headers, params: params }).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    viewUploadInMemoryTable(param): Observable<any> {
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
        headers = headers.set('Access-Control-Max-Age', '86400');
        headers = headers.set('Series', sessionStorage.getItem('sc'));
        headers = headers.set('LoginID', sessionStorage.getItem('u'));
        headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
        headers = headers.set('User', sessionStorage.getItem('dn'));
        headers = headers.set('device', sessionStorage.getItem('d'));
        headers = headers.set('browser', sessionStorage.getItem('b'));
        headers = headers.set('Language', "en");
        return this.http.post(this.url + "import/viewUploadInMemoryTable", param, { headers: headers }).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    postInsertFromMemory(param): Observable<any> {
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
        headers = headers.set('Access-Control-Max-Age', '86400');
        headers = headers.set('Series', sessionStorage.getItem('sc'));
        headers = headers.set('LoginID', sessionStorage.getItem('u'));
        headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
        headers = headers.set('User', sessionStorage.getItem('dn'));
        headers = headers.set('device', sessionStorage.getItem('d'));
        headers = headers.set('browser', sessionStorage.getItem('b'));
        headers = headers.set('Language', "en");
        return this.http.post(this.url + "import/postInsertFromMemory", param, { headers: headers }).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    PostDeleteUploadedFileHandler(dropdowntypeid,uploadid): Observable<any> {
        let params = new HttpParams();
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
        headers = headers.set('Access-Control-Max-Age', '86400');
        headers = headers.set('Series', sessionStorage.getItem('sc'));
        headers = headers.set('LoginID', sessionStorage.getItem('u'));
        headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
        headers = headers.set('User', sessionStorage.getItem('dn'));
        headers = headers.set('device', sessionStorage.getItem('d'));
        headers = headers.set('browser', sessionStorage.getItem('b'));
        headers = headers.set('Language', "en");
        params = params.append('dropdowntypeid', dropdowntypeid);
        // params = params.append('uploadid', uploadid);
        return this.http.post(this.url + "PostDeleteUploadedFileHandler",uploadid, {headers: headers,params: params})
    }

    getUploadedFileHandler(model,dropdownID,payrollcode,uploadid,isview,isadj): Observable<any> {
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
        headers = headers.set('Access-Control-Max-Age', '86400');
        headers = headers.set('Series', sessionStorage.getItem('sc'));
        headers = headers.set('LoginID', sessionStorage.getItem('u'));
        headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
        headers = headers.set('User', sessionStorage.getItem('dn'));
        headers = headers.set('device', sessionStorage.getItem('d'));
        headers = headers.set('browser', sessionStorage.getItem('b'));
        headers = headers.set('Language', "en");
        let params = new HttpParams();
        params = params.append('dropdownID', dropdownID);
        params = params.append('payrollcode', payrollcode);
        params = params.append('uploadid', uploadid);
        params = params.append('isview', isview);
        params = params.append('isadj', isadj);
        return this.http.post(this.url + "getUploadedFileHandler", model ,{headers:headers,params: params})
    }

    exportBankFile(request,dateGeneration,batchNumber): Observable<any> {
        let params = new HttpParams();
        params = params.append('dateGeneration', dateGeneration);
        params = params.append('batchNumber', batchNumber);
        return this.http.post(this.url + "export/payroll/exportBankFile", request,{params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    exportHdmf(request,month,year): Observable<any> {
        let params = new HttpParams();
        params = params.append('month', month);
        params = params.append('year', year);
        return this.http.post(this.url + "export/payroll/exportHdmf", request,{params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    exportPayslipText(request,payrollCode): Observable<any> {
        let params = new HttpParams();
        params = params.append('payrollCode', payrollCode);
        return this.http.post(this.url + "export/payroll/exportPayslipText", request,{params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    exportCRT(body,path): Observable<any> {
        return this.http.post(this.url + "export/payroll/"+path, body).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    resetCRT(param): Observable<any> {
        let params = new HttpParams();
        params = params.append('resetDate', param);
        return this.http.post(this.url + "resetCRT", {},{params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

}
