import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Appointment, Resource, Service, AvailableSlots } from '../services/appointments.services';

import { CreateAppointment } from '../createappointment/createappointment.component';
import { AppointmentServicesModel, CustomerAppointmentDetailsModel, CustomerAppointmentDetailsSearchModel } from '../viewmodels/office.model';
import { CustomerDetails } from '../viewmodels/customerdetails.model';
import { GlobalDataService } from '../services/globaldataservice';
import { OfficeDetailServices } from '../services/office.services';
import { Data } from '../services/data-share.service';


@Component({
    selector: "customer-appointments-search",
    templateUrl: './customer-appointments-search.component.html',
    styleUrls: ['./customer-appointments-search.css']
})
export class CustomerAppointmentsSearch implements OnInit, AfterViewInit {
    popupHeight: number = 670;
    popupWeight: number = 500;
    appointmentsData: CustomerAppointmentDetailsSearchModel;
    auxBusinessService: AppointmentServicesModel[];
    namePattern: any = /^[a-zA-Z-']+$/; // same expression of create appointment
    confirmationPattern: any = /^[a-zA-Z0-9]+$/;
    customerDetails: CustomerDetails = { AppointmentNote: '', ConfirmationNumber: '', CreatedBy: '', CustomerDetailsId: 0, Email: '', FirstName: '', Last4SSN: '', LastName: '', Phone: '', TextOptIn: false, TextOptInDBValue: false, EmailOptIn: false, EmailOptInDBValue: false, EntityOfficeEmail: '' };

    isNavFromAMS: boolean = true;
    popupVisible = false;
    errorPopupVisible = false;
    searchName: string = '';
    selectedType = "FirstLastSSN";
    showGrid = false;
    //isdirtyConfirm: boolean = false;
    selectedDateTimeSlote: CustomerAppointmentDetailsModel;
    dropdownSettings: any;
    @ViewChild(CreateAppointment)
    private createAppointment: CreateAppointment;

    servicesName: string;
    constructor(private route: ActivatedRoute, private router: Router, private service: Service, public globalDataService: GlobalDataService, private officeDetailServices: OfficeDetailServices, private data: Data, public datepipe: DatePipe) {
        if (this.globalDataService.CMCData != undefined && this.globalDataService.CMCData.length > 0) {

            this.isNavFromAMS = false;
            for (var i = 0; i <= this.globalDataService.CMCData.length - 1; i++) {
                switch (this.globalDataService.CMCData[i].Key) {
                    case 'firstName': {
                        if (this.globalDataService.CMCData[i].Value.indexOf(',') != -1) {
                            this.customerDetails.FirstName = this.globalDataService.CMCData[i].Value.split(',')[1].trim();

                        } else {
                            this.customerDetails.FirstName = this.globalDataService.CMCData[i].Value.trim();
                        }
                        break;
                    }
                    case 'lastName': {
                        this.customerDetails.LastName = this.globalDataService.CMCData[i].Value.trim();
                        break;
                    }
                    case 'last4DigitSSN': {
                        this.customerDetails.Last4SSN = this.globalDataService.CMCData[i].Value;
                        console.log(this.customerDetails.Last4SSN + this.globalDataService.CMCData[i].Value)
                        break;
                    }
                    case 'officeId': {
                        this.globalDataService.officeId = this.globalDataService.CMCData[i].Value.trim();
                        // this.selectedDateTimeSlote.OfficeId = this.globalDataService.CMCData[i].Value;
                        break;
                    }
                    case 'customerKey': {
                        this.customerDetails.CustomerKey = this.globalDataService.CMCData[i].Value.trim();
                        break;
                    }
                }
            }
            this.searchCustomer();
        }
    }

    ngOnInit() {      
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 2,
            allowSearchFilter: true,
            maxHeight: 110
        };
    }

    transfermtShortdateString(dateTiem: any, format: string): string {
        var numoffset = this.globalDataService.OfficeTimeZoneOffset * 100
        return this.datepipe.transform(dateTiem, format, '-' + (numoffset >= 1000 ? numoffset : ('0' + numoffset)));
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    searchCustomer() {
        this.showGrid = true;
      
            if (this.customerDetails.ConfirmationNumber != '' && this.customerDetails.ConfirmationNumber != null) { this.searchName = this.customerDetails.ConfirmationNumber; }
            else { this.searchName = this.customerDetails.FirstName + ' ' + this.customerDetails.LastName }
            this.service.getSearchCustomer(this.customerDetails).subscribe(res => {
                for (let i = 0; i <= res.CustomerAppointmentDetails.length - 1; i++) {
                    res.CustomerAppointmentDetails[i].startDate = new Date(res.CustomerAppointmentDetails[i].startDateString);
                    res.CustomerAppointmentDetails[i].endDate = new Date(res.CustomerAppointmentDetails[i].endDateString);
                }
                this.appointmentsData = res;
            });
    }

    back() {
        this.router.navigate([`/dashboard`]);
    }

    getServiceName(appointmentSerivces: any[]): string {
        if (appointmentSerivces == undefined)
            return '';
        this.servicesName = '';
        for (let j = 0; j <= appointmentSerivces.length - 1; j++) {
            if (this.servicesName != '') {
                this.servicesName = this.servicesName + ' - ' + appointmentSerivces[j].Label;
            }
            else {
                this.servicesName = appointmentSerivces[j].Label;
            }

        }
        return this.servicesName;
    }

    manageAppointment(customer: CustomerAppointmentDetailsModel) {

        if (customer.EntityId == this.globalDataService.entityId) {
            
            this.selectedDateTimeSlote = customer;
            this.globalDataService.customerAppoitmentDetailDirty = { AppointmentSerivces: customer.AppointmentSerivces, Email: customer.CustomerDetails.Email, AppointmentNote: customer.CustomerDetails.AppointmentNote, Phone: customer.CustomerDetails.Phone, TextOptIn: customer.CustomerDetails.TextOptIn, EmailOptIn: customer.CustomerDetails.EmailOptIn, SpanishOptIn: customer.IsSpanishLanguage }
            if (this.createAppointment != undefined) {
                this.createAppointment.selectedDateTimeSlote = customer;
                this.createAppointment.setValue();
            }

            if (window.innerWidth > 769) {
                this.popupVisible = true;
            } else {
                this.data.storage = {
                    'selectedDateTimeSlote':this.selectedDateTimeSlote
                };
                this.router.navigate(['/mobile-view','edit']);
            }
        }
        else {
            this.errorPopupVisible = true;
        }
    }


    closeEditAppointment() {
        this.popupVisible = false;
        this.searchCustomer();
    }
    selectChange(): void {
        //if (!this.isdirty)
        //    return;

        //if (this.selectedAppointmentTypes != undefined && this.selectedAppointmentTypes.length > 0) {
        //    this.selectAppType = false;
        //}
        //else {
        //    this.selectAppType = true;
        //}
    }

    emptycustomerdetails(): void {
        this.customerDetails.FirstName = '';
        this.customerDetails.Last4SSN = '';
        this.customerDetails.LastName = '';
        this.customerDetails.ConfirmationNumber = '';
        this.showGrid = false;
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
}