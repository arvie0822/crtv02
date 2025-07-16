import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, map, Subject, takeUntil } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FusePlatformService } from '@fuse/services/platform';
import { FUSE_VERSION } from '@fuse/version';
import { Layout } from 'app/layout/layout.types';
import { AppConfig } from 'app/core/config/app.config';
import { AuthService } from 'app/services/authService/auth.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SessionTimeoutComponent } from 'app/core/session-timeout/session-timeout.component';
import { CoreService } from 'app/services/coreService/coreService.service';
import { Subscription } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SuccessMessage } from 'app/model/message.constant';

@Component({
    selector     : 'layout',
    templateUrl  : './layout.component.html',
    styleUrls    : ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, OnDestroy
{
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    dialogRef: MatDialogRef<SessionTimeoutComponent, any>;
    idleStartSubscription: Subscription
    successMessage = Object.assign({},SuccessMessage)
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        @Inject(DOCUMENT) private _document: any,
        private _renderer2: Renderer2,
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fusePlatformService: FusePlatformService,
        private message: FuseConfirmationService,
        
        private auth: AuthService,
        private idle: Idle,
        private keepalive: Keepalive,
        public dialog: MatDialog,
        private core: CoreService
    )
    {
        this.usetifulRun()
        this.idleRun(idle,keepalive)
        // this.resetTimer();
        // this.initListener();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Set the theme and scheme based on the configuration
        combineLatest([
            this._fuseConfigService.config$,
            this._fuseMediaWatcherService.onMediaQueryChange$(['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)'])
        ]).pipe(
            takeUntil(this._unsubscribeAll),
            map(([config, mql]) => {

                const options = {
                    scheme: config.scheme,
                    theme : config.theme
                };

                // If the scheme is set to 'auto'...
                if ( config.scheme === 'auto' )
                {
                    // Decide the scheme using the media query
                    options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
                }

                return options;
            })
        ).subscribe((options) => {

            // Store the options
            this.scheme = options.scheme;
            this.theme = options.theme;

            // Update the scheme and theme
            this._updateScheme();
            this._updateTheme();
        });

        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {

                // Store the config
                this.config = config;

                // Update the layout
                this._updateLayout();
            });

        // Subscribe to NavigationEnd event
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {

            // Update the layout
            this._updateLayout();
        });

        // Set the app version
        this._renderer2.setAttribute(this._document.querySelector('[ng-version]'), 'fuse-version', FUSE_VERSION);

        // Set the OS name
        this._renderer2.addClass(this._document.body, this._fusePlatformService.osName);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this.idleStartSubscription.unsubscribe();

        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the selected layout
     */
    private _updateLayout(): void
    {
        // Get the current activated route
        let route = this._activatedRoute;
        while ( route.firstChild )
        {
            route = route.firstChild;
        }

        // 1. Set the layout from the config
        this.layout = this.config.layout;

        // 2. Get the query parameter from the current route and
        // set the layout and save the layout to the config
        const layoutFromQueryParam = (route.snapshot.queryParamMap.get('layout') as Layout);
        if ( layoutFromQueryParam )
        {
            this.layout = layoutFromQueryParam;
            if ( this.config )
            {
                this.config.layout = layoutFromQueryParam;
            }
        }

        // 3. Iterate through the paths and change the layout as we find
        // a config for it.
        //
        // The reason we do this is that there might be empty grouping
        // paths or componentless routes along the path. Because of that,
        // we cannot just assume that the layout configuration will be
        // in the last path's config or in the first path's config.
        //
        // So, we get all the paths that matched starting from root all
        // the way to the current activated route, walk through them one
        // by one and change the layout as we find the layout config. This
        // way, layout configuration can live anywhere within the path and
        // we won't miss it.
        //
        // Also, this will allow overriding the layout in any time so we
        // can have different layouts for different routes.
        const paths = route.pathFromRoot;
        paths.forEach((path) => {

            // Check if there is a 'layout' data
            if ( path.routeConfig && path.routeConfig.data && path.routeConfig.data.layout )
            {
                // Set the layout
                this.layout = path.routeConfig.data.layout;
            }
        });
    }

    /**
     * Update the selected scheme
     *
     * @private
     */
    private _updateScheme(): void
    {
        // Remove class names for all schemes
        this._document.body.classList.remove('light', 'dark');

        // Add class name for the currently selected scheme
        this._document.body.classList.add(this.scheme);
    }

    /**
     * Update the selected theme
     *
     * @private
     */
    private _updateTheme(): void
    {
        // Find the class name for the previously selected theme and remove it
        this._document.body.classList.forEach((className: string) => {
            if ( className.startsWith('theme-') )
            {
                this._document.body.classList.remove(className, className.split('-')[1]);
            }
        });

        // Add class name for the currently selected theme
        this._document.body.classList.add(this.theme);
    }

    usetifulRun() {
        if (this.auth.isAuthenticated()) {
            var element = document.querySelector("#usetifulScript")
            if (!element) {
                // element.remove();
                window["usetifulTags"] = {
                    userId: localStorage.getItem("series") + "_1" + sessionStorage.getItem("u"),
                    company: localStorage.getItem("series"),
                    role: localStorage.getItem("usetiful"),
                    display_name: localStorage.getItem("dn")
                };

                var a = document.getElementsByTagName('head')[0];
                var r = document.createElement('script');
                r.async = true;
                r.src = "https://www.usetiful.com/dist/usetiful.js";
                r.setAttribute('id', 'usetifulScript');
                r.dataset.token = "fea529879f55a374d77cd3ff88898b9b";
                a.appendChild(r);
            }
        }
    }

    idleRun(idle,keepalive) {
        idle.setIdle(900);//900
        idle.setTimeout(120);
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onIdleEnd.subscribe(() => {
            this.reset();
        });

        idle.onTimeout.subscribe(() => {
            this.dialogRef.close();
            this.timedOut = true;
            this.logout()
        });

        this.idleStartSubscription = idle.onIdleStart.subscribe(() => {
            // console.log("onIdleStart")
            if (this.dialogRef) {
                this.dialogRef.close()
            }

            this.dialogRef = this.dialog.open(SessionTimeoutComponent, {
                panelClass: 'app-dialog',
                disableClose: true
            })

            this.dialogRef.componentInstance.btnLogout.subscribe(() => {
                this.logout();
            });

            this.dialogRef.componentInstance.btnStay.subscribe(() => {
                this.stay();
            });
        });

        idle.onTimeoutWarning.subscribe((countdown) => {
            this.idleState = 'You have been idle for 15 minutes. You will time out in ' + countdown + ' seconds!'
            this.core.updateIdleState(this.idleState)
            // console.log(this.idleState)
        });

        keepalive.interval(15);//15

        keepalive.onPing.subscribe(() => this.lastPing = new Date());
        // console.log("onPing")
        if (this.auth.isAuthenticated()) {
            // console.log("isAuthenticated")
            idle.watch()
            this.timedOut = false;
        } else {
            idle.stop();
        }
    }

    reset() {
        this.idle.watch();
        this.timedOut = false;
    }

    stay() {
        this.dialogRef.close()
        this.reset();
    }

    logout() {
        this.idle.stop()
        this.dialogRef.close()
        sessionStorage.clear();
        this._router.navigate(['/']);
        this.successMessage.title = "Logged out due to inactivity"
        this.successMessage.message = "You have been logged out due to inactivity for 15 minutes!"
        this.successMessage.actions.confirm.label = "Ok"
        this.message.open(this.successMessage);
    }
}
