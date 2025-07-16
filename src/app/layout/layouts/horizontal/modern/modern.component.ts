import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation, defaults } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { MasterService } from 'app/services/masterService/master.service';
import { AppConfig, Themes } from 'app/core/config/app.config';
import { Layout } from 'app/layout/layout.types';
import { ExampleComponent } from 'app/modules/admin/example/example.component';

@Component({
    selector     : 'modern-layout',
    templateUrl  : './modern.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ModernLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    ExampleComponent
    bundy = false
    default = defaults
    /**
     * Constructor
     */

    companyname = sessionStorage.getItem('cn')
    device = sessionStorage.getItem('device')
    route = sessionStorage.getItem('route')
    is = (sessionStorage.getItem('is') == "true")
    isIsView = true
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _master : MasterService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        //AanyaHR v2
        // Subscribe to navigation data
        // this._navigationService.navigation$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((navigation: Navigation) => {
        //         this.navigation = navigation;
        //     });

        //CRT
        this.getCRT_nav()

        this.bundy = (sessionStorage.getItem('bundy')=="true")


// debugger
//          this._master.accessList().subscribe(data => {

//                 this.navigation = data['payload'];
//             });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    switchPage(){
        if (this.is) {
            var link = this.isIsView ? '/dashboard/supervisor' : '/dashboard/employee'
            this.isIsView = !this.isIsView
            this._router.navigate([link]);
        }
    }

    getCRT_nav(){
        var nav: any = this.default.filter(x=>x.access === 0 || x.access === Number(sessionStorage.getItem('al')))
        var label  = nav.filter((i:any)=>i.label=="Label")
        var parent = nav.filter((i:any)=>i.label=="Parent")
        var child  = nav.filter((i:any)=>i.label=="Child")
        var menuList = label.map(x => ({
            id: x.ids,
            title: x.title,
            subtitle: x.subtitle,
            type: x.type,
            icon: x.icon,
            children:
                parent.filter((ii: any) => ii.parent == x.id).map(xx => ({
                    id: xx.ids,
                    title: xx.title,
                    subtitle: xx.subtitle,
                    type: xx.type,
                    icon: xx.icon,
                    link: xx.link,
                    children:
                        child.filter((iii: any) => iii.parent == xx.id).map(xxx => ({
                            id: xxx.ids,
                            title: xxx.title,
                            subtitle: xxx.subtitle,
                            type: xxx.type,
                            icon: xxx.icon,
                            link: xxx.link,
                        }))
                }))
        }))

        var obj = {
            default: menuList,
            compact: menuList.map(item => ({...item, type: "aside"})),
            futuristic: menuList,
            horizontal: menuList
        }
        this.navigation = obj

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }
}
