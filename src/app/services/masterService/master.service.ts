import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of, switchMap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Company } from 'app/model/administration/company';
import { AuthService } from '../authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private uri = environment.apiUrl + "master/";
  constructor(private http: HttpClient) { }

  accessList(): Observable<Navigation> {
    return this.http.get<Navigation>(this.uri + "getDynamicMenu");
  }

  getCompany(): Observable<any> {
    let params = new HttpParams();
    params = params.append('company_code', sessionStorage.getItem('cc'));
    return this.http.get<any>(this.uri + "getCompany", { params: params });
  }

  postCompany(param): Observable<Company> {
    return this.http.post(this.uri + "postCompany", param).pipe(
      switchMap((response: Company) => {
        return of(response);
      })
    );
  }

  getDropdownFix(param): Observable<any> {
    return this.http.post(this.uri + "getDropdownFix", param).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  postGeneratedAPIKeys(): Observable<any> {
    return this.http.post(this.uri + "postGeneratedAPIKeys",{}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getAccessControlModule(param): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', param);
    return this.http.get<any>(this.uri + "getAccessControlModule", { params: params });
  }

  getAuditTypeEnum(): Observable<any> {
    return this.http.get<any>(this.uri + "getAuditTypeEnum");
  }
}
