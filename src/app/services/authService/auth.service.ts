import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private uri = environment.apiUrl + "user/authenticateLogin";
  constructor(private http: HttpClient) { }

    authenticateUser(param): Observable<any> {
      return this.http.post(this.uri, param);
    }

    saveToken(req, remember) {
      sessionStorage.setItem('token', req['token'])
      sessionStorage.setItem('u', req['id'])
      sessionStorage.setItem('sc', req['series_code'])
      sessionStorage.setItem('al', req['access_level_id'])
      sessionStorage.setItem('apl', req['approval_level_id'])
      sessionStorage.setItem('cat', req['category_id'])
      sessionStorage.setItem('ci', req['company_id'])
      sessionStorage.setItem('ap', req['approver'])
      sessionStorage.setItem('s', req['start'])
      sessionStorage.setItem('e', req['end'])
      sessionStorage.setItem('dn', req['display_name'])
      sessionStorage.setItem('ip', req['image_path'])
      sessionStorage.setItem('cn', req['company_name'])
      sessionStorage.setItem('ln', req['login_name'])
      sessionStorage.setItem('io', req['in_out'])
      sessionStorage.setItem('lt', req['log_type_id'])
      sessionStorage.setItem('ti', req['tenant_id'])
      sessionStorage.setItem('re', req['remind_password'])
      sessionStorage.setItem('rm', req['remind_message'])
      sessionStorage.setItem('is', req['is_schedule'])
      sessionStorage.setItem('iw', req['is_web'])
      sessionStorage.setItem('cc', req['company_code']);
      sessionStorage.setItem('d', req['device']);
      sessionStorage.setItem('b', req['browser']);
      sessionStorage.setItem('ia', req['is_admin']);
      sessionStorage.setItem('se', req['series']);
      sessionStorage.setItem('bundy', req['is_web'])
      sessionStorage.setItem('route', req['routing'])
      sessionStorage.setItem('is', req['is_supervisor'])
      localStorage.clear()
      localStorage.setItem('series',    req['series']);
      localStorage.setItem('usetiful',  req['usetiful']);
      localStorage.setItem('dn',        req['display_name'])
      if(remember){
        localStorage.setItem('us', req['username']);
        localStorage.setItem('co', req['company_code']);
        localStorage.setItem('re', remember);
      }
    }

    getToken() {
      return sessionStorage.getItem('token')
    }

    isAuthenticated() {
      if (this.getToken()) {
        return true
      }
      return false
    }
  }
