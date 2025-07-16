import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AngularDeviceInformationService } from 'angular-device-information';
import { myData } from 'app/model/app.moduleId';
import { AuthService } from 'app/core/auth/auth.service';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { finalize } from 'rxjs';
import { UserService } from 'app/services/userService/user.service';


@Component({
    selector: 'app-update-password',
    templateUrl: './update-password.component.html',
    styleUrls: ['./update-password.component.css']
})
export class UpdatePassword implements OnInit {

    error = "";
    error2 = "";

    @ViewChild('updatePasswordNgForm') updatePasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    updatePasswordForm: FormGroup;
    showAlert: boolean = false;
    isSave: boolean = false
    logindata: any
    successMessage = {...SuccessMessage}
    username
    errormatch : boolean = false


    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private saveMsg: FuseConfirmationService,
        private userService: UserService,
        private message: FuseConfirmationService,
        private router: Router,
        private fb: FormBuilder,
        private deviceInfoService: AngularDeviceInformationService,
        private http: HttpClient,
        private handler: HttpBackend,

    ) {
        this.updatePasswordForm = this._formBuilder.group({
            newPassword: ['', [Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}/)]],
            confirmPassword: ['', [Validators.required]],
            ip1: '',
        }, { validator: this.passwordMatchValidator });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {


        if (myData.code != "") {
            var code = myData.code
            var username = ""
            this.userService.getCodeValidation(username , code).subscribe({

                next: (value: any) => {
                    myData.username =  value.payload

                }
            })

            if (myData.username !== "") {
                    this.username = myData.username
            }

        }else{
            if (myData.username == "") {
                this.router.navigate(['/login']);
            }
            this.username =  myData.username

        }


        // Create the form
        this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
            this.updatePasswordForm.get('ip1').setValue(res.replace('\n', ''))
            sessionStorage.setItem('ip1',res.ip)
        });

        this.http = new HttpClient(this.handler)
        this.http.get("https://ipv4.icanhazip.com", { responseType: 'text' }).subscribe((res: any) => {
            this.updatePasswordForm.get('ip1').setValue(res.replace('\n', ''))
        });

        var ip1data = this.updatePasswordForm.value.ip1




        // this.userService.getCodeValidation(this.logindata, code).subscribe({

        //     next: (value: any) => {}

        // })
    }

    hide = true;
    hide1 = true;

    private matchPassword(AC: AbstractControl) {
        let password = AC.get('newPassword').value;
        if (AC.get('confirmPassword').touched || AC.get('confirmPassword').dirty) {
            let verifyPassword = AC.get('confirmPassword').value;
            if (password != verifyPassword) {
                AC.get('confirmPassword').setErrors({ matchPassword: true });
            } else {
                return null;
            }
        }
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword').value
        const confirmPassword = form.get('confirmPassword').value
        if (confirmPassword !== newPassword) {
            form.get('confirmPassword').setErrors({ passwordMismatch: true });
        } else {
            form.get('confirmPassword').setErrors(null);
        }
    }

    get f() { return this.updatePasswordForm.controls; }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void {
        // Return if the form is invalid
        if (this.updatePasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.updatePasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Forgot password
        this._authService.resetPassword(this.updatePasswordForm.get('newPassword').value)
        this._authService.resetPassword(this.updatePasswordForm.get('confirmPassword').value)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.updatePasswordForm.enable();

                    // Reset the form
                    this.updatePasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {

                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'Password reset sent! You\'ll receive an email if you are registered on our system.'
                    };
                },
                (response) => {

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Email does not found! Are you sure you are already a member?'
                    };
                }
            );
    }

    get validate() {

        let variations = {
            digits: /\d/.test(this.updatePasswordForm.get('newPassword').value),
            lower: /[a-z]/.test(this.updatePasswordForm.get('newPassword').value),
            upper: /[A-Z]/.test(this.updatePasswordForm.get('newPassword').value),
            nonWords: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(this.updatePasswordForm.get('newPassword').value),
            minLength: (this.updatePasswordForm.get('newPassword').value.length > 7),
        }

        return variations;
    }

    checkingPasss(){
        var newPassword = this.updatePasswordForm.get("newPassword").value
        var confirmPassword = this.updatePasswordForm.get("confirmPassword").value
        // debugger
        // if (newPassword !== confirmPassword) {
        //     debugger
        // } else {
        //     debugger
        // }
        return false
    }

    check() {
        debugger

        let password = this.updatePasswordForm.get("newPassword").value;
        let cnfrmPassword = this.updatePasswordForm.get("confirmPassword").value;
        console.log(" Password:", password, '\n', "Confirm Password:", cnfrmPassword);
        let message = document.getElementById("message");
        debugger
        if (password.length != 0) {
            if (password == cnfrmPassword) {
                 this.errormatch = false
                this.submit()
            }
            else {
                this.errormatch = true
                // this.hide1 = false

            }
        }
        else {
            this.errormatch = true
            message.textContent = "";
        }
    }

    check1() {
        debugger

        let password = this.updatePasswordForm.get("newPassword").value;
        let cnfrmPassword = this.updatePasswordForm.get("confirmPassword").value;
        console.log(" Password:", password, '\n', "Confirm Password:", cnfrmPassword);
        let message = document.getElementById("message");
        debugger
        if (password.length != 0) {
            if (password == cnfrmPassword) {
                 this.errormatch = false
            }
            else {
                this.errormatch = true
                // this.hide1 = false

            }
        }
        else {
            this.errormatch = true
            message.textContent = "";
        }
    }
    submit() {

        this.logindata = this.fb.group({
            // username:  sessionStorage.getItem('un'),
            username: this.username ,
            password: myData.password,
            companyCode: myData.companyCode,
            remember: myData.remember,
            ip1: this.updatePasswordForm.value.ip1,
            ip2: myData.ip2,
            device: myData.device,
            browser: myData.browser
        })

        var login = this.logindata.value
        var password = this.updatePasswordForm.value.newPassword
        this.updatePasswordForm.markAllAsTouched();
        const dialogRef = this.message.open(SaveMessage)
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.isSave = true
                this.userService.postChangePassword(login, password).subscribe({
                    next: (value: any) => {

                        if (value.statusCode == 200) {
                            this.successMessage.message = "Password updated successfully"
                            this.message.open(this.successMessage);
                            this.isSave = false,
                                setTimeout(() => {
                                    this.router.navigate(['/login']);
                                }, 500);
                        }
                        else {
                            this.message.open(FailedMessage);
                            console.log(value.stackTrace)
                            console.log(value.message)
                        }
                    },

                });
            }
        });


    }
}
