import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CalendarAppointmentModel, CustomerAppointmentDetailsModel, CustomerAppointmentDetailsSearchModel } from "../viewmodels/office.model";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OfficeDetails, EntityDetials } from '../viewmodels/office.model';
import { CustomerDetails } from "../viewmodels/customerdetails.model";
import { GlobalDataService } from "./globaldataservice";

export class AppointmentServicesTypes {
    name: any[];
}

export class Appointment {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    appointmentType: string;
    startDate: Date;
    endDate: Date;
    services?: string[];
    allDay?: boolean;
    comments: string;
    color: string
}

export class AvailableSlots {
    startDate: Date;
    endDate: Date;
    color: string
}

export class Resource {
     type: string;
    color: string;
    textcolor: string;
    label: string;
    typeId: number;
}

//TODO: This is needed to display the appointments
//Please note: Hardcoded data needs to be retreived from database
let resources: Resource[] = [
    {
        typeId: 0,
        type: "available",
        color: "#fad796",
        textcolor: "#636e72",
        label: "available"
    },
    {
        typeId: 1,
        type: "scheduled",
        color: "#9195e6",
        textcolor: "#FFFFFF",
        label: "Scheduled"
    }, {
        typeId: 2,
        type: "completed",
        color: "#9acafc",
        textcolor: "#636e72",
        label: "Completed"
    }, {
        typeId: 3,
        type: "noshow",
        color: "#636e72",
        textcolor: "#FFFFFF",
        label: "No-Show"
    },
    {
        typeId: 4,
        type: "cancelled",
        color: "#eda999",
        textcolor: "#636e72",
        label: "Cancelled"
    }
]; 



export class DashboardData {
    ScheduleType: string;
    Slots: number;
    ViewType?: string;
}


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    })
};

const customerDetails = "CustomerDetails/";
const appointmentDetailsController = "AppointmentDetails/";
const UpdateAppointmentDetails = "UpdateAppointmentDetails"
const getScheduledAppointmentsByOfficeAndStatus = "GetScheduledAppointmentsByOfficeAndStatus";
const getAppointmentByConfirmationNumber = "GetAppointmentsByConfirmationNumber";
const getAppointmentByCustomerCMCData = "getAppointmentsByCustomerCMCData";
const getDashboardDetailsByOfficeId = "GetDashboardDetailsByOfficeId";
const getCustomerSearchData = 'GetCustomerSearchData';
const getCMCData = "GetCMCData";
const getForcibleAvailableSlots = "GetForcibleAvailableSlots";
const getAppointmentByStatus = "GetAppointmentByStatus";
const getDayAndWeekAppointmentCount = "GetDayAndWeekAppointmentCount";


@Injectable()
export class Service {
    cmcCustomer: CustomerDetails;
    constructor(private httpClient: HttpClient,private globaldataService: GlobalDataService) {
        //this.BaseUrl = (platformLocation as any).location.origin;
        //console.log(this.BaseUrl);
    }

    getAppointments(officeId: string, statusId: number, startDate: string, endDate: string): Observable<CalendarAppointmentModel> {
        return this.httpClient.get<CalendarAppointmentModel>(appointmentDetailsController + getScheduledAppointmentsByOfficeAndStatus + '?officeId=' + officeId + '&statusId=' + statusId + '&startDate=' + startDate + '&endDate=' + endDate, httpOptions);
    }

    getForcibleAvailableSlots(officeId: string, statusId: number, startDate: string, endDate: string): Observable<CalendarAppointmentModel> {
        return this.httpClient.get<CalendarAppointmentModel>(appointmentDetailsController + getForcibleAvailableSlots + '?officeId=' + officeId + '&statusId=' + statusId + '&startDate=' + startDate + '&endDate=' + endDate, httpOptions);
    }

    getAppointmentByStatus(officeId: string, statusIds: string, startDate: string, endDate: string): Observable<CalendarAppointmentModel> {
        return this.httpClient.get<CalendarAppointmentModel>(appointmentDetailsController + getAppointmentByStatus + '?officeId=' + officeId + '&statusIds=' + statusIds + '&startDate=' + startDate + '&endDate=' + endDate, httpOptions);
    }

    UpdateAppointmentStatus(customerAppointmentDetails: CustomerAppointmentDetailsModel): Observable<CustomerAppointmentDetailsModel> {
        return this.httpClient.post<CustomerAppointmentDetailsModel>(appointmentDetailsController + UpdateAppointmentDetails, customerAppointmentDetails, httpOptions);
    }

    getResources(): Resource[] {
        return resources;
    }

    GetCMCCustomerDetails(): CustomerDetails {
        return this.globaldataService.customerDetailsfromCMC;
    }

    getCustomerAppointmentDetailsByConfirmationNumber(confirmationNumber: string): Observable<CustomerAppointmentDetailsModel[]> {
        return this.httpClient.get<CustomerAppointmentDetailsModel[]>(customerDetails + getAppointmentByConfirmationNumber + '?confirmationNumber=' + confirmationNumber, httpOptions);
    }

    getCustomerAppointmentDetailsFromCMC(): Observable<CustomerAppointmentDetailsModel[]> {
        return this.httpClient.get<CustomerAppointmentDetailsModel[]>(customerDetails + getAppointmentByCustomerCMCData + '?FirstName=' + this.globaldataService.customerDetailsfromCMC.FirstName + '&LastName=' + this.globaldataService.customerDetailsfromCMC.LastName + '&Last4SSN=' + this.globaldataService.customerDetailsfromCMC.Last4SSN, httpOptions);
    }

    getDashboardDetailsByOfficeId(officeId: string, dashboardType: string, startdate: string = null, endDate: string = null): Observable<DashboardData[]> {       
        return this.httpClient.get<DashboardData[]>(appointmentDetailsController + getDashboardDetailsByOfficeId + "?officeId=" + officeId + "&dashboardType=" + dashboardType + "&startdate=" + startdate + "&enddate=" + endDate, httpOptions);
    }

    getDayAndWeekAppointmentCount(officeId: string, currentDate: string, startdate: string = null, endDate: string = null): Observable<DashboardData[]> {
        return this.httpClient.get<DashboardData[]>(appointmentDetailsController + getDayAndWeekAppointmentCount + "?officeId=" + officeId + "&currentDate=" + currentDate + "&startdate=" + startdate + "&enddate=" + endDate, httpOptions);
    }

    getSearchCustomer(customerDetailsParam: CustomerDetails): Observable<CustomerAppointmentDetailsSearchModel> {
        return this.httpClient.post<CustomerAppointmentDetailsSearchModel>(customerDetails + getCustomerSearchData, customerDetailsParam, httpOptions);
    }

    getCustemerIdRecievedFromCMC(): Observable<any[]> {
        return this.httpClient.get<any[]>(customerDetails + getCMCData, httpOptions);
    }
}
