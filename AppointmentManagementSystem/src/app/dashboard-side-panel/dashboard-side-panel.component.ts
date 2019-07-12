import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { Data } from '../services/data-share.service';
import { DatePipe } from '@angular/common';

//import { AuthService } from '../../service/authservice';



@Component({
    selector: 'dashboard-side-panel',
    templateUrl: './dashboard-side-panel.component.html',
    styleUrls: ['./dashboard-side-panel.component.css']
})
export class DashboardSidePanelComponent implements OnInit , AfterViewInit {
    popupHeight: number = 670;
    popupWeight: number = 500;
    scheduledAndAvailableAppointmentSlotsData: DashboardAppointmentSlots[];
    constructor(private officeDetailServices: OfficeDetailServices, public globalDataService: GlobalDataService, private dashboardService: DashboardService, private router: Router, private service: Service, private spinner: NgxSpinnerService, private data: Data, public datepipe: DatePipe) { }
    private subscription: ISubscription;
    i: number = 0;
    j: number = 0;
    officeDetails: OfficeDetails[];
    popupVisible = false;
    popupChangeStatusVisible = false;
    selectedDateTimeSlote: CustomerAppointmentDetailsModel;
    @ViewChild(CreateAppointment)
    private createAppointment: CreateAppointment;
    result: DashboardAppointmentSlots[];
    ngOnInit(): void {
        
        this.subscription = this.globalDataService.currentOffice.subscribe(office => {
            
            if (this.globalDataService.officeId != undefined) {
                this.onComponentLoad();
            }
        }, err => { this.spinner.hide() });
    }

    onComponentLoad() {
        this.getscheduledAndAvailableConfiguration();
    }

    transfermtShorttime(dateTiem: any, format: string) {

        var numoffset = this.globalDataService.OfficeTimeZoneOffset * 100

        return this.datepipe.transform(dateTiem, format, '-' + (numoffset >= 1000 ? numoffset : ('0' + numoffset)));
    }

    getscheduledAndAvailableConfiguration() {        
        if (this.globalDataService.officeId != undefined) {
            
            this.dashboardService.getScheduledAndAvailableAppointmentSlots().subscribe(res => {
                
                for (this.i = 0; this.i <= res.length - 1; this.i++) {
                    res[this.i].startDate = this.transfermtShorttime(res[this.i].startDateString,'short');
                    res[this.i].endDate = this.transfermtShorttime(res[this.i].endDateString, 'short');
                    res[this.i].toggleId = this.i;
                    res[this.i].isExpand = false;
                    for (this.j = 0; this.j <= res[this.i].customerAppointmentDetailsList.length - 1; this.j++) {
                        res[this.i].customerAppointmentDetailsList[this.j].selectedServiceType = false;
                    }
                }
                this.scheduledAndAvailableAppointmentSlotsData = res;
                this.result = JSON.parse(JSON.stringify(this.scheduledAndAvailableAppointmentSlotsData));
                
            }, err => { this.spinner.hide() });
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
   
    changeStatus(customer: CustomerAppointmentDetailsModel) {

        this.popupChangeStatusVisible = true;
        this.selectedDateTimeSlote = customer;
    }
    updateAppointmentStatus(updatedStatus: string) {
        
        this.popupChangeStatusVisible = false;
        if (updatedStatus == "complete")
            this.selectedDateTimeSlote.AppointmentStatusId = 2;
        else if (updatedStatus == "noshow")
            this.selectedDateTimeSlote.AppointmentStatusId = 3;
        if (updatedStatus == "cancel")
            this.selectedDateTimeSlote.AppointmentStatusId = 4;

        this.selectedDateTimeSlote.startDate = new Date(this.selectedDateTimeSlote.startDateString);
        this.selectedDateTimeSlote.endDate = new Date(this.selectedDateTimeSlote.endDateString);
        this.selectedDateTimeSlote.OfficeId = this.globalDataService.officeId;
        this.service.UpdateAppointmentStatus(this.selectedDateTimeSlote).subscribe(details => {
            this.globalDataService.changeOffice(this.globalDataService.officeId);
            
            this.router.navigate(['/dashboard']);
            this.router.navigate([`dashboard/viewappointments/6`]);
        }, err => { this.spinner.hide() });
        //On successful update 
        //this.notifyOnStatusChange(updatedStatus);
        
    }

    notifyOnStatusChange(updatedStatus: string) {


        var type = "error",
            text = "The appointment status for " + this.selectedDateTimeSlote.CustomerDetails.FirstName.toUpperCase() + " " + this.selectedDateTimeSlote.CustomerDetails.LastName.toUpperCase
                + " is changed to " + updatedStatus;

        notify(text, type, 3000);
    }


    popupWidth() {
        setTimeout(() => {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
                this.popupHeight = window.innerHeight - (window.innerHeight * 0.2);
            }
            else {

                if (window.innerWidth > 769) {

                    this.popupWeight = 500;
                    this.popupHeight = 670;
                }
                else {
                    this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
                    this.popupHeight = window.innerHeight - (window.innerHeight * 0.2);
                }


                // if(window.innerWidth > 769){

                //     this.popupWeight = 500;
                //     this.popupHeight = 651;
                // }else {
                //     this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
                //     this.popupHeight = window.innerHeight - (window.innerHeight * 0.4);
                // }

            }
        }, 0);
    }

    ngAfterViewInit() {
        this.popupWidth();
    }

    editAppointment(customer: CustomerAppointmentDetailsModel) {        
        customer.startDate = new Date(customer.startDateString);
        customer.endDate = new Date(customer.endDateString); 

        
        this.selectedDateTimeSlote =JSON.parse(JSON.stringify(customer));
        this.globalDataService.customerAppoitmentDetailDirty = { AppointmentSerivces: customer.AppointmentSerivces, Email: customer.CustomerDetails.Email, AppointmentNote: customer.CustomerDetails.AppointmentNote, Phone: customer.CustomerDetails.Phone, TextOptIn: customer.CustomerDetails.TextOptIn, EmailOptIn: customer.CustomerDetails.EmailOptIn, SpanishOptIn: customer.IsSpanishLanguage }
        if (this.createAppointment != undefined) {
            this.createAppointment.selectedDateTimeSlote = JSON.parse(JSON.stringify(customer));
            this.createAppointment.setValue();
        }
        if (window.innerWidth > 769) {

        this.popupVisible = true;
        }
        else {
            this.data.storage = {
                'selectedDateTimeSlote':this.selectedDateTimeSlote
            };
            this.router.navigate(['/mobile-view','edit']);
        }
    }
    closeEditAppointment() {       
        this.scheduledAndAvailableAppointmentSlotsData = this.result; 
        this.popupVisible = false;
    }
}




