import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { UpdatePassword } from './update-password/update-password.component';
import { ChangePassword } from './change-password/change-password.component';
import { CarouselModule } from 'app/core/carousel/carousel.module';
import { SetupPassword } from './setup-password/setup-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: "login/",
        pathMatch: 'full'
      },
      {
        path: 'login',
        redirectTo: "login/",
        pathMatch: 'full'
      },
      {
        path: 'login/',
        redirectTo: "login/",
        pathMatch: 'full'
      },
      {
        path: 'login/:id',
        component: LoginComponent
      },
      {
        path: '',
        redirectTo: 'forgot-password',
        pathMatch: 'full'
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: '',
        redirectTo: 'expire-password',
        pathMatch: 'full'
      },
      {
        path: 'update-password',
        component: UpdatePassword
      },
      {
        path: '',
        redirectTo: 'change-password',
        pathMatch: 'full'
      },
      {
        path: 'change-password',
        component: ChangePassword
      },
      {
        path: '',
        redirectTo: 'setup-password',
        pathMatch: 'full'
      },
      {
        path: 'setup-password',
        component: SetupPassword
      },

      // {
      //   path: 'register',
      //   component: RegisterComponent
      // },
      // {
      //   path: 'forgot-password',
      //   component: ForgotPasswordComponent
      // },
      // {
      //   path: 'company-setup',
      //   component: Company_setupComponent,
      //   canActivate: [AuthGuardService]
      // },
      // {
      //   path: 'verify-password',
      //   redirectTo: "verify-password/",
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'verify-password/:id',
      //   component: VerifyPasswordComponent,
      //   canActivate: [AuthGuardService]
      // },
      // {
      //   path: 'password-expires',
      //   component: PasswordExpiresComponent,
      //   canActivate: [AuthGuardService]
      // },
    ]
  },
]

@NgModule({

  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    SharedModule,
    MatCardModule,
    CarouselModule
  ],
  declarations: [
    LoginComponent,
    AuthComponent,
    ForgotPasswordComponent,
    UpdatePassword,
    ChangePassword,
    SetupPassword

  ],

})
export class AuthModule { }
