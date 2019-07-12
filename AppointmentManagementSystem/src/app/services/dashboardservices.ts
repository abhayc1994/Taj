import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CalendarAppointmentModel, CustomerAppointmentDetailsModel } from "../viewmodels/office.model";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OfficeDetails, EntityDetials } from '../viewmodels/office.model';
import { CustomerDetails } from "../viewmodels/customerdetails.model";
import { GlobalDataService } from "./globaldataservice";
import { DashboardData } from "./appointments.services"
import { DashboardAppointmentSlots } from "../viewmodels/dashboard.model";



//TODO: This is needed to display the appointments
//Please note: Hardcoded data needs to be retreived from database
let dashboardTodayDonutData: DashboardData[] = [{
    ScheduleType: "Available",
    Slots: 40
}, {
    ScheduleType: "Completed",
    Slots: 30
}, {
    ScheduleType: "No-Show",
    Slots: 20
}, {
    ScheduleType: "Scheduled",
    Slots: 10
}];



export class AppointmentServicesTypes {
    name: any[];
}

export class AppointmentServiceType {
    id: number;
    appointmentService: string
    color: string;
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
}

let cancelledappointments: Appointment[] = [
    {
        firstName: "Samyul",
        lastName: "Jackson",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "cancelled",
        startDate: new Date(2018, 6, 5, 9, 30),
        endDate: new Date(2018, 6, 5, 10, 0),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1203"]
    }, {
        firstName: "Andrew",
        lastName: "Bernard",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "cancelled",
        startDate: new Date(2018, 6, 5, 12, 0),
        endDate: new Date(2018, 6, 5, 13, 0),
        color: "#56ca85",
        comments: " Tax to be prepared by jerry",
        services: ["1200", "1202"]
    }, {
        firstName: "Sam",
        lastName: "Simpson",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "cancelled",
        startDate: new Date(2018, 6, 5, 14, 30),
        endDate: new Date(2018, 6, 5, 15, 30),
        color: "#56ca85",
        comments: "Assign the earlier slot available",
        services: ["1202"]
    }, {
        firstName: "Matthew",
        lastName: "Perry",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "cancelled",
        startDate: new Date(2018, 6, 6, 10, 0),
        endDate: new Date(2018, 6, 6, 11, 0),
        color: "#56ca85",
        comments: "Assign the earlier slot available",
        services: ["1200", "1201", "1202"]
    }, {
        firstName: "John",
        lastName: "Mclain",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "cancelled",
        startDate: new Date(2018, 6, 6, 12, 0),
        endDate: new Date(2018, 6, 6, 13, 35),
        color: "#56ca85",
        comments: " No comments",
        services: ["1201"]
    }
];
let appointments: Appointment[] = [
    {
        firstName: "Daenerys ",
        lastName: "Targayryen",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "completed",
        startDate: new Date(2018, 6, 2, 9, 30),
        endDate: new Date(2018, 6, 2, 10, 0),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1200"]
    },
    {
        firstName: "Jon",
        lastName: "Snow",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "scheduled",
        startDate: new Date(2018, 6, 2, 10, 30),
        endDate: new Date(2018, 6, 2, 11, 0),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1200", "1201"]
    },
    {
        firstName: "Jamie",
        lastName: "Lan",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "noshow",
        startDate: new Date(2018, 6, 2, 11, 0),
        endDate: new Date(2018, 6, 2, 11, 30),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1200"]

    },
    {
        firstName: "Peter",
        lastName: "Dinklage",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "scheduled",
        startDate: new Date(2018, 6, 3, 10, 0),
        endDate: new Date(2018, 6, 3, 10, 30),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1200", "1202"]

    },
    {
        firstName: "Peter",
        lastName: "Parker",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "completed",
        startDate: new Date(2018, 6, 3, 12, 0),
        endDate: new Date(2018, 6, 3, 12, 30),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1200"]

    },
    {
        firstName: "Rebert",
        lastName: "Bar",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "scheduled",
        startDate: new Date(2018, 6, 3, 12, 30),
        endDate: new Date(2018, 6, 3, 13, 0),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1202"]

    },
    {
        firstName: "Dwayne",
        lastName: "John",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "scheduled",
        startDate: new Date(2018, 6, 3, 14, 0),
        endDate: new Date(2018, 6, 3, 15, 0),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1203"]

    },
    {
        firstName: "Hulk",
        lastName: "ken",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "completed",
        startDate: new Date(2018, 6, 2, 13, 0),
        endDate: new Date(2018, 6, 2, 14, 0),
        color: "#56ca85",
        comments: " Tax to be prepared by sam",
        services: ["1203"]
    },
    {
        firstName: "Andrew",
        lastName: "Bernard",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "scheduled",
        startDate: new Date(2018, 6, 5, 12, 0),
        endDate: new Date(2018, 6, 5, 13, 0),
        color: "#56ca85",
        comments: " Tax to be prepared by jerry",
        services: ["1200", "1202"]
    }, {
        firstName: "Sam",
        lastName: "Simpson",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "completed",
        startDate: new Date(2018, 6, 5, 14, 30),
        endDate: new Date(2018, 6, 5, 15, 30),
        color: "#56ca85",
        comments: "Assign the earlier slot available",
        services: ["1202"]
    }, {
        firstName: "Matthew",
        lastName: "Perry",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "scheduled",
        startDate: new Date(2018, 6, 6, 10, 0),
        endDate: new Date(2018, 6, 6, 11, 0),
        color: "#56ca85",
        comments: "Assign the earlier slot available",
        services: ["1200", "1201", "1202"]
    }, {
        firstName: "John",
        lastName: "Mclain",
        phone: "43434332332",
        email: "sam@test.com",
        appointmentType: "scheduled",
        startDate: new Date(2018, 6, 6, 12, 0),
        endDate: new Date(2018, 6, 6, 13, 35),
        color: "#56ca85",
        comments: " No comments",
        services: ["1201"]
    }
];
let availableslots: AvailableSlots[] = [
    {
        startDate: new Date(2018, 6, 2, 9, 30),
        endDate: new Date(2018, 6, 2, 10, 0),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 2, 10, 30),
        endDate: new Date(2018, 6, 2, 11, 0),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 2, 11, 0),
        endDate: new Date(2018, 6, 2, 11, 30),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 2, 13, 0),
        endDate: new Date(2018, 6, 2, 14, 0),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 2, 14, 0),
        endDate: new Date(2018, 6, 2, 15, 0),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 3, 11, 30),
        endDate: new Date(2018, 6, 3, 12, 0),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 3, 11, 0),
        endDate: new Date(2018, 6, 3, 11, 30),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 3, 13, 0),
        endDate: new Date(2018, 6, 3, 14, 0),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 3, 14, 0),
        endDate: new Date(2018, 6, 3, 15, 0),
        color: "#56ca85"
    },
    {
        startDate: new Date(2018, 6, 5, 12, 0),
        endDate: new Date(2018, 6, 5, 13, 0),
        color: "#56ca85"
    }, {
        startDate: new Date(2018, 6, 5, 14, 30),
        endDate: new Date(2018, 6, 5, 15, 30),
        color: "#56ca85"
    }, {
        startDate: new Date(2018, 6, 6, 10, 0),
        endDate: new Date(2018, 6, 6, 11, 0),
        color: "#56ca85"
    }, {
        startDate: new Date(2018, 6, 6, 12, 0),
        endDate: new Date(2018, 6, 6, 13, 35),
        color: "#56ca85"
    }
];
let appointmentServiceTypes: AppointmentServiceType[] = [{
    id: 1200,
    appointmentService: "TaxPrep",
    color: "#cb6bb2"
}, {
    id: 1201,
    appointmentService: "Aux1",
    color: "#ff9747"
}, {
    id: 1202,
    appointmentService: "Aux2",
    color: "#1e90ff"
}, {
    id: 1203,
    appointmentService: "Aux3",
    color: "#f05797"
}];
//This is specific to the calendar, resource color is automatically changed based on the tyoe of appointment chosen 
let resources: Resource[] = [
    {
        type: "scheduled",
        color: "#cce5ff",
        textcolor: "#004095",
        label: "Scheduled"
    }, {
        type: "completed",
        color: "#e2e3e5",
        textcolor: "#693d41",
        label: "Completed"
    }, {
        type: "noshow",
        color: "#fff3cd",
        textcolor: "#956445",
        label: "No-Show"
    },
    {
        type: "cancelled",
        color: "#e2e3e5",
        textcolor: "004095",
        label: "Cancelled"
    }
];
let dashboardWeekDonutData: DashboardData[] = [{
    ScheduleType: "Available",
    Slots: 80
}, {
    ScheduleType: "Completed",
    Slots: 70
}, {
    ScheduleType: "No-Show",
    Slots: 48
}, {
    ScheduleType: "Scheduled",
    Slots: 24
}];




const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    })
};
const dashboard = "Dashboard/";
const getScheduledAndAvailableSlotsByOfficeId = "GetScheduledAndAvailableSlotsByOfficeId";
//default is set to today
var selectedDate = new Date();

@Injectable()
export class DashboardService {
    scheduledAndAvailableSlotsData: DashboardAppointmentSlots[]
    constructor(private httpClient: HttpClient,private globaldataService: GlobalDataService) {
        //this.BaseUrl = (platformLocation as any).location.origin;
        //console.log(this.BaseUrl);
    }

    getAppointments(): Appointment[] {
        return appointments;
    }

    getAppoitnmentTypesData(): AppointmentServiceType[] {
        return appointmentServiceTypes;
    }

    getDashBoardData(): DashboardData[] {
        return dashboardTodayDonutData;
    }

    getScheduledAndAvailableAppointmentSlots(): Observable<any[]>  {
        return this.httpClient.get<DashboardAppointmentSlots[]>(dashboard + getScheduledAndAvailableSlotsByOfficeId + '?officeId=' + this.globaldataService.officeId + '&date=' + selectedDate, httpOptions);
    }


}
