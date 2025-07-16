import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable, of, ReplaySubject, Subject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    requested = false;
    loginId = ""
    /**
     * Constructor
     */
     private uri = environment.apiUrl + "master/";
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        if (this.requested && this.loginId == sessionStorage.getItem("u")) {
            return this._navigation.pipe(first())
        }

        return this._httpClient.get<Navigation>(this.uri + "getDynamicMenu").pipe(
            tap((navigation) => {
                this._navigation.next(navigation['payload']);
                this.requested = true;
                this.loginId = sessionStorage.getItem("u")
            })
        );
    }
}
