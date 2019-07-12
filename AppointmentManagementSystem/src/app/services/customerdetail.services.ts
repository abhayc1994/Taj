import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CustomerDetails } from '../viewmodels/customerdetails.model';

import { CustomerAppointmentDetailsModel } from '../viewmodels/office.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    })
};
const CustomerDetailsApi = "CustomerDetails/";
const addCustomerDetails = "SaveCustomerDetails";

@Injectable()
export class CustomerDetailServices {
    BaseUrl: string = 'http:\\\localhost\\';

    constructor(private httpClient: HttpClient) {
        //this.BaseUrl = (platformLocation as any).location.origin;
        //console.log(this.BaseUrl);
    }
   
    saveCustomerDetails(customerAppointmentDetailsModel: CustomerAppointmentDetailsModel): Observable<CustomerAppointmentDetailsModel> {
        console.log(JSON.stringify(customerAppointmentDetailsModel));
        return this.httpClient.post<CustomerAppointmentDetailsModel>("CustomerDetails/" + addCustomerDetails, customerAppointmentDetailsModel, httpOptions);
    }
}