import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AuthService } from 'app/services/authService/auth.service';
import { GF } from 'app/shared/global-functions'

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    constructor(private auth: AuthService) { }

     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        if (this.auth.isAuthenticated()) {
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type', 'application/json');
          headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
          headers = headers.set('Access-Control-Max-Age', '86400');
          headers = headers.set('Series', sessionStorage.getItem('sc'));
          headers = headers.set('LoginID', sessionStorage.getItem('u'));
          headers = headers.set('AccessLevel', sessionStorage.getItem('al'));
          headers = headers.set('User', GF.ConvertSP(sessionStorage.getItem('dn')));
          headers = headers.set('device', sessionStorage.getItem('d'));
          headers = headers.set('browser', sessionStorage.getItem('b'));
          headers = headers.set('moduleId', GF.IsEmptyReturn(sessionStorage.getItem('moduleId'),""));
          headers = headers.set('Language', "en");
          
          request = request.clone({ headers })
          return next.handle(request);
        }
        else{
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type', 'application/json');
          headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
          headers = headers.set('Language', "en");
          request = request.clone({ headers })
          return next.handle(request);
        }
      }
}
