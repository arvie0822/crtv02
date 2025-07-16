import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { AngularDeviceInformationService } from 'angular-device-information';
import { Login } from 'app/model/login';
import { AuthService } from 'app/services/authService/auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { myData } from 'app/model/app.moduleId';
import { SuccessMessage } from 'app/model/message.constant';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    dialogRef: MatDialogRef<ForgotPasswordComponent, any>;
    loginForm: FormGroup;
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };

    images = []
    successMessage = {...SuccessMessage}
    private url = environment.reports + "api/site/master/token";

    constructor(private fb: FormBuilder, private service: AuthService, private router: Router
        , private deviceInfoService: AngularDeviceInformationService,private message: FuseConfirmationService
        , private http: HttpClient, private handler: HttpBackend, public dialog: MatDialog) { }


    ngOnInit() {
        this.http = new HttpClient(this.handler)

        this.loginForm = this.fb.group({
            username: [localStorage.getItem('us'), Validators.required],
            password: ['', Validators.required],
            companyCode: [localStorage.getItem('co'), Validators.required],
            remember: localStorage.getItem('re') == null ? false : (localStorage.getItem('re') == "true"),
            ip1: '',
            ip2: '',
            device: this.deviceInfoService.getDeviceInfo().os,
            browser: this.deviceInfoService.getDeviceInfo().browser,
            crte: true
        })
        sessionStorage.setItem('device',this.deviceInfoService.getDeviceInfo().os)
        sessionStorage.setItem('browser',this.deviceInfoService.getDeviceInfo().browser)


        this.http.get("https://xauu-f7yc-ygdu.s2.xano.io/api:5X1OSCtc:v1/carousel_web").subscribe((res: any) => {
            this.images = res.slice(0, 6)
        });

        this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
            this.loginForm.get('ip1').setValue(res.ip)
            sessionStorage.setItem('ip1',res.ip)
        });

        this.http.get("https://ipv4.icanhazip.com", { responseType: 'text' }).subscribe((res: any) => {
            this.loginForm.get('ip2').setValue(res.replace('\n', ''))
            sessionStorage.setItem('ip2',res.ip)
        });


    }

    openLink(link) {
        window.open(link, "_blank")
    }

    signIn(): void {


        if (this.loginForm.invalid) {
            return;
        }

        // myData.login = this.loginForm.value.ip
        // myData.username =  this.loginForm.value.username
        // myData.remember =  this.loginForm.value.remember

        myData.username = this.loginForm.value.username,
        myData.password = this.loginForm.value.password,
        myData.companyCode = this.loginForm.value.companyCode,
        myData.remember = this.loginForm.value.remember,
        myData.ip1 = this.loginForm.value.ip,
        myData.ip2,
        myData.device = this.deviceInfoService.getDeviceInfo().os
        myData.browser = this.deviceInfoService.getDeviceInfo().browser

        // Disable the form
        this.loginForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.service.authenticateUser(this.loginForm.value).subscribe(data => {


            if (data.statusCode == 200) {
                const logData = data.payload
                if (logData['id'] === null) {
                    this.loginForm.enable();
                    this.alert = {
                        type: 'error',
                        message: logData['type']
                    };
                    this.showAlert = true;
                }
                else {
                    // logData['access_level_id'] = "1"
                    this.service.saveToken(logData, this.loginForm.value.remember);
                    // localStorage.setItem("full","true")
                    // this.reportToken()
                    var routing = logData['access_level_id'] == "1" ? "/search/crt-reports" : logData['routing']
                    if (routing !== '/company-setup') {

                        if (logData['is_pw_changed']) {
                            this.router.navigate([routing]);
                            if (logData['remind_password']) {
                                this.successMessage.title = "Warning!"
                                this.successMessage.icon = {
                                    show : true,
                                    name : 'heroicons_solid:exclamation',
                                    color: 'warn'
                                }
                                this.successMessage.message = logData['remind_message']
                                this.message.open(this.successMessage);
                            }
                            this.loginForm.enable();
                        }
                        else if (logData['is_pw_expires']) {
                            this.successMessage.title = "Warning!"
                            this.successMessage.icon = {
                                show : true,
                                name : 'heroicons_solid:exclamation',
                                color: 'warn'
                            }
                            this.successMessage.message = logData['remind_message']
                            this.message.open(this.successMessage);
                            this.router.navigate([routing = '/update-password']);
                            this.loginForm.enable();
                        }
                        else if (logData['is_pw_changed'] == false) {
                            myData.username
                            this.router.navigate([routing = '/update-password']);
                            this.loginForm.enable();
                        }
                        else {
                            const route = routing + "/" + logData['id']
                            this.router.navigate([route]);
                            this.loginForm.enable();
                        }

                    }
                    else {
                        this.router.navigate([routing]);
                        this.loginForm.enable();
                    }
                }
            }
            else {
                this.loginForm.enable();
                this.alert = {
                    type: 'error',
                    message: "Can't connect on our system.."
                };
                this.showAlert = true;
            }
        },
            (error: HttpErrorResponse) => {
                console.log(error.error);
                this.loginForm.enable();
                this.alert = {
                    type: 'error',
                    message: "Can't connect on our system.."
                };
                this.showAlert = true;
            })
    }
    showmodal() {
        this.open()
    }
    open() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        this.dialogRef = this.dialog.open(ForgotPasswordComponent,
            {
                panelClass: 'app-dialog'

            });
    }

    reportToken(){
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        const body = new URLSearchParams();
        body.set('grant_type', 'password');
        body.set('username', 'jldayandante@illimitado.com');
        body.set('password', '123456fF@');

        this.url = this.url.replace("master",sessionStorage.getItem('se') === "0001" ? 'dev-master' : "dev-"+sessionStorage.getItem('se').toLowerCase().replaceAll(" ",""))
        this.http.post(this.url,body, { headers: headers }).subscribe((res: any) => {
            sessionStorage.setItem("rt",res.access_token)
        });

    }


}
