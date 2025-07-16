import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { DatatableComponent } from './core/datatable/datatable.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'example',
        component  : LayoutComponent,
        data: {
            layout: 'modern'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
        // loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)
    },
    {
        path: 'dashboard',
        component  : LayoutComponent,
        data: {
            layout: 'modern'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'detail',
        component  : LayoutComponent,
        data: {
            layout: 'modern'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: '', loadChildren: () => import('app/modules/administration/administration.module').then(m => m.AdministrationModule)},
            {path: '', loadChildren: () => import('app/modules/employee/employee.module').then(m => m.EmployeeModule)},
            {path: '', loadChildren: () => import('app/modules/payroll/payroll.module').then(m => m.PayrollModule)},
            {path: '', loadChildren: () => import('app/modules/statutory/statutory.module').then(m => m.StatutoryModule)},
            {path: '', loadChildren: () => import('app/modules/management/management.module').then(m => m.ManagementModule)},
            {path: '', loadChildren: () => import('app/modules/ess/ess.module').then(m => m.EssModule)},
            {path: '', loadChildren: () => import('app/modules/hris/hris.module').then(m => m.HrisModule)},
            {path: '', loadChildren: () => import('app/modules/upload/upload.module').then(m => m.UploadModule)},
            {path: '', loadChildren: () => import('app/modules/reports/reports.module').then(m => m.ReportsModule)},

            // {path: '', loadChildren: () => import('app/modules/filing/filing.module').then(m => m.FilingModule)},
        ]
    },
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'modern'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: 'search/:id', loadChildren: () => import('app/core/datatable/datatable.module').then(m => m.DatatableModule)},
            {path: 'single-search/:id', loadChildren: () => import('app/core/datatable-crud/datatable-crud.module').then(m => m.DatatableCrudModule)},
            {path: 'modal-search/:id', loadChildren: () => import('app/core/datatable-modal/datatable-modal.module').then(m => m.DatatableModalModule)},
        ]
    }
    // Redirect empty path to '/example'
    // {path: '', pathMatch : 'full', redirectTo: 'example'},

    // // Redirect signed in user to the '/example'
    // //
    // // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // // path. Below is another redirection for that path to redirect the user to the desired
    // // location. This is a small convenience to keep all main routes together here on this file.
    // {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'example'},

    // // Auth routes for guests
    // {
    //     path: '',
    //     canActivate: [NoAuthGuard],
    //     canActivateChild: [NoAuthGuard],
    //     component: LayoutComponent,
    //     data: {
    //         layout: 'empty'
    //     },
    //     children: [
    //         {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
    //         {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
    //         {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
    //         {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
    //         {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
    //     ]
    // },

    // // Auth routes for authenticated users
    // {
    //     path: '',
    //     canActivate: [AuthGuard],
    //     canActivateChild: [AuthGuard],
    //     component: LayoutComponent,
    //     data: {
    //         layout: 'empty'
    //     },
    //     children: [
    //         {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
    //         {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
    //     ]
    // },

    // // Landing routes
    // {
    //     path: '',
    //     component  : LayoutComponent,
    //     data: {
    //         layout: 'empty'
    //     },
    //     children   : [
    //         {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
    //     ]
    // },

    // // Admin routes
    // {
    //     path       : '',
    //     canActivate: [AuthGuard],
    //     canActivateChild: [AuthGuard],
    //     component  : LayoutComponent,
    //     resolve    : {
    //         initialData: InitialDataResolver,
    //     },
    //     children   : [
    //         {path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)},
    //     ]
    // }
];
