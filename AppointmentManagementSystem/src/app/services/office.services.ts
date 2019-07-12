import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OfficeDetails, EntityDetials, WeekModel, OfficeOperationHoursModel } from '../viewmodels/office.model';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    })
};
const OfficeDetailsControl = "OfficeDetails/";
const getOfficeDetailsByEntity = "GetOfficeDetailsByEntity";
const getEntityDetails = "GetEntityDetails";
const getAuxBusinessServicesByOfficeId = "GetAuxBusinessServicesByOfficeId"
const localizationTextController = "LocalizationText/";
const getLocalizationtext = "GetLocalizationtext";
const getOfficeConfigurationHoursDetails = "GetOfficeConfigurationHoursDetails"
const updateOfficeConfigurationHoursDetails = "UpdateOfficeConfigurationHoursDetails";
const getAuxBusinessServiceAndOfficeConfigAndAppointmentsbyOfficeId = "GetAuxBusinessServiceAndOfficeConfigAndAppointmentsbyOfficeId";
const GetOfficeDateTime = "GetOfficeDateTime";


//TODO: standard configuration :  move this to the database
let weekDays: WeekModel[] = [
    {
        DayOrder: 1,
        DayOftheWeek: "Sunday"
    }, {
        DayOrder: 2,
        DayOftheWeek: "Monday"
    }, {
        DayOrder: 3,
        DayOftheWeek: "Tuesday"
    }, {
        DayOrder: 4,
        DayOftheWeek: "Wednesday"
    }, {
        DayOrder: 5,
        DayOftheWeek: "Thursday"
    }, {
        DayOrder: 6,
        DayOftheWeek: "Friday"
    }, {
        DayOrder: 7,
        DayOftheWeek: "Saturday"
    }
]; 


@Injectable()
export class OfficeDetailServices {
    BaseUrl: string = 'http:\\\localhost\\';

    constructor(private httpClient: HttpClient) {
        //this.BaseUrl = (platformLocation as any).location.origin;
        //console.log(this.BaseUrl);
    }

    getAllOfficeDetails(entityId: string): Observable<OfficeDetails[]> {
        return this.httpClient.get<OfficeDetails[]>(OfficeDetailsControl + getOfficeDetailsByEntity + '?entityId=' + entityId, httpOptions);
    }

    getAllEntityDetails(): Observable<EntityDetials[]> {
        return this.httpClient.get<EntityDetials[]>(OfficeDetailsControl + getEntityDetails, httpOptions);
    }

    getAuxBusinessServicesByOfficeId(officeId: string): Observable<any[]> {
        return this.httpClient.get<any[]>(OfficeDetailsControl + getAuxBusinessServicesByOfficeId + '?officeId=' + officeId, httpOptions)
    }

    GetAuxBusinessServiceAndOfficeConfigAndAppointmentsbyOfficeId(officeId: string, statusIds: string, startDate: string, endDate:string): Observable<any[]> {
        //return this.httpClient.get<any>(OfficeDetailsControl + getAuxBusinessServiceAndOfficeConfigbyOfficeId + '?officeId=' + officeId, httpOptions)
        return this.httpClient.get<any[]>(OfficeDetailsControl + getAuxBusinessServiceAndOfficeConfigAndAppointmentsbyOfficeId + '?officeId=' + officeId + '&statusIds=' + statusIds + '&startDate=' + startDate + '&endDate=' + endDate, httpOptions);
    }

    getLocalizationText(): Observable<any[]> {
        return this.httpClient.get<any[]>(localizationTextController + getLocalizationtext, httpOptions)
    }

    getOfficeWeekConfiguration() {
        return weekDays;
    }

    getOfficeOperationHoursConfiguration(officeId: string): Observable<OfficeOperationHoursModel[]> {
        return this.httpClient.get<OfficeOperationHoursModel[]>(OfficeDetailsControl + getOfficeConfigurationHoursDetails + '?officeId=' + officeId, httpOptions);
    }

    updateOfficeOperationHoursConfiguration(officeConfigurationData: OfficeOperationHoursModel[]): Observable<OfficeOperationHoursModel> {
        return this.httpClient.post<OfficeOperationHoursModel>(OfficeDetailsControl + updateOfficeConfigurationHoursDetails, officeConfigurationData, httpOptions);
    }

    getOfficeDateTime(offset: number, stateCode: string): Observable<any> {
        return this.httpClient.get<any>(OfficeDetailsControl + GetOfficeDateTime + '?timeZoneOffset=' + offset + '&stateCode=' + stateCode, httpOptions)
    }
   

}