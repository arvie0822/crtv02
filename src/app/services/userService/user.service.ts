import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../authService/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private uri = environment.apiUrl + "user/";
    constructor(private http: HttpClient,private auth: AuthService,private handler: HttpBackend) { }

    postEmployee(param): Observable<any> {
        return this.http.post(this.uri + "postEmployee", param).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    postChangePassword(login,password): Observable<any> {
        login = login
        let params = new HttpParams();
        params = params.append('password', password);
        return this.http.post(this.uri + "postChangePassword", login,{ params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }


    postUpdatePassword(oldpass,newpass): Observable<any> {
        let params = new HttpParams();
        params = params.append('oldpass', oldpass);
        params = params.append('newpass', newpass);
        return this.http.post(this.uri + "postUpdatePassword", {},{ params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getEmployeeDropdown(param): Observable<any> {
        return this.http.post(this.uri + "getEmployeeDropdown", param).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getEmployee(param): Observable<any[]> {
        let params = new HttpParams();
        params = params.append('id', param);
        return this.http.get<any[]>(this.uri + "getEmployee", { params: params });
    }

    getHierarchyEmployee(): Observable<any> {
        return this.http.get<any[]>(this.uri + "getHierarchyEmployee");
    }

    getSearchHierarchy(param, mgnt, reports = false): Observable<any> {
        var path = mgnt ? "GetSearchHierarchySupervisor" : reports ? "getPayrollSearchEmployee" : "getSearchHierarchy"
        return this.http.post(this.uri + path, param).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getSearchHierarchyEmployee(param): Observable<any> {
        return this.http.post(this.uri + "getSearchHierarchyEmployee", param).pipe(
          switchMap((response: any) => {
            return of(response);
          })
        );
      }

    getEmployeeLeaveBalance(tid): Observable<any> {
        let params = new HttpParams();
        params = params.append('id', tid);
        return this.http.get<any>(this.uri + "getEmployeeLeaveBalance", {params: params});
    }

    getEmployeeGenerateCode(login): Observable<any> {
        let params = new HttpParams();
        return this.http.post(this.uri + "getEmployeeGenerateCode", login).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getCodeValidation(username,code): Observable<any> {
        this.http = new HttpClient(this.handler)
        let params = new HttpParams();
        params = params.append('username', username);
        params = params.append('code', code);
        return this.http.post(this.uri + "getCodeValidation" ,{},{params:params} );
    }

    getSalaryRate(payrollId,monthlyrate): Observable<any> {
        let params = new HttpParams();
        params = params.append('payrollcategory', payrollId);
        params = params.append('monthlyrate', monthlyrate);
        return this.http.get<any>(this.uri + "getSalaryRate", { params: params });
    }

    getAssignLocationMap(model): Observable<any> {
        return this.http.post(this.uri + "getAssignLocationMap" ,model);
    }

    getAssignLocationDropdown(req): Observable<any> {
        return this.http.post(this.uri + "getAssignLocationDropdown" ,req);
    }

    postAssignLocation(model): Observable<any> {
        return this.http.post(this.uri + "postAssignLocation" ,model);
    }

    //CRT
    postAddUser(param): Observable<any> {
        return this.http.post(this.uri + "postAddUser", param).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    PostDeleteUsers(param): Observable<any> {
        let params = new HttpParams();
        params = params.append('fileName', param);
        return this.http.post(this.uri + "PostDeleteUsers", {},{params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    postUpdateUser(param): Observable<any> {
        return this.http.post(this.uri + "postUpdateUser", param).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getDashboardCRT(param): Observable<any> {
        return this.http.post(this.uri + "getDashboardCRT", param).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    deactivateEmployee(param): Observable<any> {
        let params = new HttpParams();
        params = params.append('employeeId', param);
        return this.http.post(this.uri + "deactivateEmployee", {},{params: params}).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }
}
