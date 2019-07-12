import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DOCUMENT } from '@angular/platform-browser';

import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EntityDetials, OfficeDetails, EntityOfficeDetails} from './viewmodels/office.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class UserAuthService {
    userContext: any = {};
    BaseUrl: string = "";
    signOutUrl: string = "";    
    entityDetails: EntityDetials[];
    customdetails: EntityOfficeDetails;
    //document: any = {};

    private userContextValues = new BehaviorSubject('default context');
    userContextSet = this.userContextValues.asObservable();

    constructor(private http: HttpClient) {
        
    }
    getUserAuthContext() {
        return this.http.get(this.BaseUrl + 'UserAuth/GetUserDetails', httpOptions);
    };

    getEntities(): Observable<EntityDetials[]> {
        return this.http.get<EntityDetials[]>(this.BaseUrl + 'UserAuth/GetEntities', httpOptions);
    };
    loadUserAuthContext() {
        this.getUserAuthContext().subscribe(data => {
            this.userContext = JSON.stringify(data);
            localStorage.setItem('userContext', JSON.stringify(data));
            this.userContextValues.next('set');
        });           
    };

    getUserContext() {        
        return JSON.parse(localStorage.getItem('userContext'));
    }
   
    logout() {
        return this.http.get(this.BaseUrl + 'SignOut/Logout', httpOptions);
    }

    logoutClicked() {
        this.logout().subscribe(data => {
            this.signOutUrl = data.toString();
            window.location.href = this.signOutUrl;
            // window.location.assign("../" + this.signOutUrl);
        });
    }
}
