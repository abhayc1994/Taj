
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OfficeDetails, EntityDetials, WeekModel } from '../viewmodels/office.model';
import { CustomerDetails } from "../viewmodels/customerdetails.model";
import { GlobalDataService } from "./globaldataservice";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    })
};

@Injectable()
export class CommonServices {
    appointmentType: string;
     ReviveDateTimeFromDateString(value: any): any {
        if (typeof value === 'string') {
            let a = /\/Date\((\d*)\)\//.exec(value);
            if (a) {
                return new Date(+a[1]);
            }
        }
        return value;
    }

    getAppointmentStatusByApointmentId(Id: number): string {
        this.appointmentType = "scheduled";
        if (Id == 2)
            this.appointmentType = "complete";
        if (Id == 3)
            this.appointmentType = "noshow";
        if (Id == 4)
            this.appointmentType = "cancel";
        return this.appointmentType
    }


}


