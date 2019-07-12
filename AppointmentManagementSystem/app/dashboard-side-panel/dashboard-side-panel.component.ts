import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OfficeDetails, CustomerAppointmentDetailsModel } from '../viewmodels/office.model';
import { OfficeDetailServices } from '../services/office.services';
import { DashboardAppointmentSlots } from '../viewmodels/dashboard.model';
import { GlobalDataService } from '../services/globaldataservice';
import { DashboardService } from '../services/dashboardservices';
import { ISubscription } from "rxjs/Subscription";
import { Router, ActivatedRoute } from "@angular/router";
import { Appointment, Resource, Service } from '../services/appointments.services';
import { CreateAppointment } from '../createappointment/createappointment.component';
import notify from 'devextreme/ui/notify';

//import { AuthService } from '../../service/authservice';



@Component({
    selector: 'dashboard-side-panel',
    templateUrl: './dashboard-side-panel.component.html',
    styleUrls: ['./dashboard-side-panel.component.css']
})
export class DashboardSidePanelComponent implements OnInit {
    scheduledAndAvailableAppointmentSlotsData: DashboardAppointmentSlots[];
    constructor(private officeDetailServices: OfficeDetailServices, private globalDataService: GlobalDataService, private dashboardService: DashboardService, private router: Router, private service: Service)
    { }
    private subscription: ISubscription;
    i: number = 0;    
    officeDetails: OfficeDetails[];
    popupVisible = false;
    popupChangeStatusVisible = false;
    selectedDateTimeSlote: CustomerAppointmentDetailsModel;
    @ViewChild(CreateAppointment)
    private createAppointment: CreateAppointment;
    ngOnInit(): void {

        this.onComponentLoad();
        this.subscription = this.globalDataService.currentOffice.subscribe(office => {
            this.onComponentLoad();
        });
    }

    onComponentLoad() {
        this.getscheduledAndAvailableConfiguration();
    }

    getscheduledAndAvailableConfiguration() {
        this.dashboardService.getScheduledAndAvailableAppointmentSlots().subscribe(res => {
            
            for (this.i = 0; this.i <= res.length - 1; this.i++) {
                res[this.i].startDate = this.ReviveDateTime(res[this.i].startDate);
                res[this.i].endDate = this.ReviveDateTime(res[this.i].endDate);
                res[this.i].toggleId = this.i;
                res[this.i].isExpand = false;
            }
            console.log(res);
            this.scheduledAndAvailableAppointmentSlotsData = res;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    onExpand(appointmentslots:any) {
       
        appointmentslots.isExpand = appointmentslots.isExpand == true ? false : true;        
    }
    changeStatus(customer: CustomerAppointmentDetailsModel) {
        
        this.popupChangeStatusVisible = true;
        this.selectedDateTimeSlote = customer;

    }
    updateAppointmentStatus(updatedStatus: string) {
        console.log(updatedStatus);
        this.popupChangeStatusVisible = false;
        if (updatedStatus == "complete")
            this.selectedDateTimeSlote.AppointmentStatusId = 2;
        else if (updatedStatus == "noshow")
            this.selectedDateTimeSlote.AppointmentStatusId = 3;
        if (updatedStatus == "cancel")
            this.selectedDateTimeSlote.AppointmentStatusId = 4;
        this.service.UpdateAppointmentStatus(this.selectedDateTimeSlote).subscribe(details => {
            this.router.navigate(['/dashboard']);
        });
        //On successful update 
        this.notifyOnStatusChange(updatedStatus);
    }

    notifyOnStatusChange(updatedStatus: string) {

        var type = "error",
            text = "The appointment status for " + this.selectedDateTimeSlote.CustomerDetails.FirstName.toUpperCase() + " " + this.selectedDateTimeSlote.CustomerDetails.LastName.toUpperCase
                + " is changed to " + updatedStatus;

        notify(text, type, 3000);
    }

    editAppointment(customer: CustomerAppointmentDetailsModel) {

        customer.startDate = this.ReviveDateTime(customer.startDate);
        customer.endDate = this.ReviveDateTime(customer.endDate);
        
        console.log("closed");
        console.log(customer);
        this.popupVisible = true;
        this.selectedDateTimeSlote = customer;
        if (this.createAppointment != undefined) {
            this.createAppointment.selectedDateTimeSlote = customer;
            this.createAppointment.setValue();
        }
    }
    closeEditAppointment() {
        this.popupVisible = false;
    }

    private ReviveDateTime(value: any): any {
        if (typeof value === 'string') {
            let a = /\/Date\((\d*)\)\//.exec(value);
            if (a) {
                return new Date(+a[1]);
            }
        }

        return value;
    }

}




