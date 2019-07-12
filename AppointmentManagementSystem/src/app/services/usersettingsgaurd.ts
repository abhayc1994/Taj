import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { GlobalDataService } from "./globaldataservice";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";


const customerDetails = "CustomerDetails/";
const getCustemerIdRecievedFromCMC = 'GetCustemerIdRecievedFromCMC';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    })
};

@Injectable()
export class UserSettingsGuard implements CanActivate {
    constructor(private router: Router, private globaldataService: GlobalDataService) { }

    canActivate(): boolean {
        if (this.globaldataService.CMCData != undefined && this.globaldataService.CMCData.length > 0) {
            if (this.globaldataService.CMCData[1].Value == 'True') {
                this.router.navigate(['/customerappointmentssearch']);
            }
            else {
                this.router.navigate(['/viewavailableappointments/1']);
            }
        }
        else {
            return true;
        }
    }
}




