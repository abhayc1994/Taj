import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { CustomerDetails } from '../viewmodels/customerdetails.model';
import { OfficeDetails, AppointmentType, ReqPreparer, CustomerAppointmentDetailsModel } from '../viewmodels/office.model';
import { CustomerDetailServices } from '../services/customerdetail.services';
import { OfficeDetailServices } from '../services/office.services';

import { GlobalDataService } from '../services/globaldataservice';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { AppComponent } from '../app.component';
import { Data } from '../services/data-share.service';

@Component({
    selector: "create-appointment",
    templateUrl: './createappointment.component.html',
    styleUrls: ['./switch.css']
})
export class CreateAppointment implements OnInit {

    @Input() selectedDateTimeSlote: CustomerAppointmentDetailsModel;
    @Output() closeEditAppointmentCall = new EventEmitter();
    commentsPattern: any = /^[a-zA-Z0-9'".,?$&\s-_\(\)\[\]]+$/;
    namePattern: any = /^[a-zA-Z-'.]+$/;

    pageTitle: string = "Create Appointment";
    constructor(@Inject(AppComponent) private parent: AppComponent, private route: ActivatedRoute, private router: Router, private customerDetailService: CustomerDetailServices, private officeDetailServices: OfficeDetailServices, public datepipe: DatePipe, public globalDataService: GlobalDataService, private spinner: NgxSpinnerService, private data: Data) {

    }


    customerDetails: CustomerDetails = { Email: '', FirstName: '', LastName: '', Phone: '', AppointmentNote: '', CreatedBy: '', TextOptIn: false, TextOptInDBValue: false, Last4SSN: '', EmailOptIn: false, EmailOptInDBValue: false, EntityOfficeEmail: '' };
    officeDetails: OfficeDetails[];
    appointmentTypes: AppointmentType[];
    customerAppointmentDetailsModel: CustomerAppointmentDetailsModel = {
        OfficeId: '',
        EntityId: '',
        AppointmentStatus: '',
        Message: '',
        Comments: '',
        IsSpanishLanguage: false
    };
    selectedAppointmentTypes: AppointmentType[];
    date: string;
    startTime: string;
    endTime: string;
    selectAppType: boolean;
    isdirty: boolean = false;
    serverVal: boolean = false;
    sTypechange: boolean = false;
    optInDisclaimerText: string;
    withTemplateVisible: boolean = false;
    oldStatusId: number = 0;
    isdirtyConfirm: boolean = true;
    disclaimerpopupVisible: boolean = false;
    textdisclaimerpopupVisible: boolean = false;
    dropdownSettings: any;
    preparerList: ReqPreparer[];
    _gridBoxValue: number[] = [3];
    get gridBoxValue(): number[] {
        return this._gridBoxValue;
    }

    set gridBoxValue(value: number[]) {
        this._gridBoxValue = value || [];
        this.selectAppType = false;

    }
    i: number = 0;
    oldData: CustomerDetails = { Email: '', FirstName: '', LastName: '', Phone: '', AppointmentNote: '', CreatedBy: '', TextOptIn: false, TextOptInDBValue: false, Last4SSN: '', EmailOptIn: false, EmailOptInDBValue: false, EntityOfficeEmail: '' };
    ngOnInit(): void {

        if (!(window.innerWidth > 769) && this.data.storage) {
            this.selectedDateTimeSlote = this.data.storage['selectedDateTimeSlote'];
        }


        this.setValue();

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

    transfermtShortdateDate(dateTiem: any, format: string): Date {
        var numoffset = this.globalDataService.OfficeTimeZoneOffset * 100
        return new Date(this.datepipe.transform(dateTiem, format, '-' + (numoffset >= 1000 ? numoffset : ('0' + numoffset))));
    }

    setValue(): void {
        // this.appointmentTypes = [];
        this.selectedAppointmentTypes = [];
        this.appointmentTypes = this.globalDataService.globalAppointmentTypes ? this.globalDataService.globalAppointmentTypes.map(o => {
            return { item_id: o.AppointmentTypeId, item_text: o.Label, HashColorCode: o.HashColorCode };
        }) : [];

        if (this.selectedDateTimeSlote != undefined) {
            if (this.globalDataService.IsFromSchedulerCell) {
                this.date = this.datepipe.transform(this.selectedDateTimeSlote.startDate, 'MM/dd/yyyy');
                this.startTime = this.datepipe.transform(this.selectedDateTimeSlote.startDate, 'shortTime');
                this.endTime = this.datepipe.transform(this.selectedDateTimeSlote.endDate, 'shortTime');
            }
            else {
                this.date = this.transfermtShortdateString(this.selectedDateTimeSlote.startDate, 'MM/dd/yyyy');
                this.startTime = this.transfermtShortdateString(this.selectedDateTimeSlote.startDate, 'shortTime');
                this.endTime = this.transfermtShortdateString(this.selectedDateTimeSlote.endDate, 'shortTime');
            }
            this.globalDataService.IsFromSchedulerCell = false;
            this.customerAppointmentDetailsModel = this.selectedDateTimeSlote;

            if (this.selectedDateTimeSlote.AppointmentStatusId != undefined && this.selectedDateTimeSlote.AppointmentStatusId != 0)
                this.isdirtyConfirm = true;
            else
                this.isdirtyConfirm = false;

            //if (this.globalDataService.CMCData != undefined && this.globalDataService.CMCData.length > 0) {
            //    //this.customerAppointmentDetailsModel.AppointmentCreatorTypeId = 2;
            //}
            //else {
            //    this.customerAppointmentDetailsModel.AppointmentCreatorTypeId = 1;
            //}
            this.customerAppointmentDetailsModel.AppointmentCreatorTypeId = 1;
            this.customerAppointmentDetailsModel.OfficeId = this.globalDataService.officeId;
            this.customerAppointmentDetailsModel.EntityId = this.globalDataService.entityId;
            if (this.globalDataService.customerAppoitmentDetail != undefined && this.globalDataService.customerAppoitmentDetail.CustomerAppointmentDetailsId != undefined) {
                if (window.innerWidth > 769)
                    this.customerAppointmentDetailsModel.CustomerAppointmentDetailsId = this.globalDataService.customerAppoitmentDetail.CustomerAppointmentDetailsId;
            }
            if (this.globalDataService.customerAppoitmentDetail == undefined || this.globalDataService.customerAppoitmentDetail.IsSpanishLanguage == false) {
                if (this.customerAppointmentDetailsModel.IsSpanishLanguage == undefined) {
                    this.customerAppointmentDetailsModel.IsSpanishLanguage = false;
                }
            }
            //else {
            //    console.log("entered into spanish assignemtn");
            //    this.customerAppointmentDetailsModel.IsSpanishLanguage = true;


            //}

            if (this.selectedDateTimeSlote.CustomerDetails != undefined && this.selectedDateTimeSlote.AppointmentStatusId != 0) {
                this.customerDetails = this.selectedDateTimeSlote.CustomerDetails;
            }
            if (this.selectedDateTimeSlote.CustomerDetails != undefined && this.selectedDateTimeSlote.AppointmentStatusId == 0 && this.globalDataService.IsSloteSelection) {
                this.customerDetails = {
                    FirstName: this.globalDataService.cutomerDetails.FirstName,
                    Last4SSN: this.globalDataService.cutomerDetails.Last4SSN,
                    LastName: this.globalDataService.cutomerDetails.LastName,
                    Phone: this.globalDataService.cutomerDetails.Phone,
                    Email: this.globalDataService.cutomerDetails.Email,
                    TextOptIn: this.globalDataService.cutomerDetails.TextOptIn,
                    TextOptInDBValue: false,
                    EmailOptIn: this.globalDataService.cutomerDetails.EmailOptIn,
                    EmailOptInDBValue: false,
                    AppointmentNote: this.globalDataService.cutomerDetails.AppointmentNote,
                    CreatedBy: this.globalDataService.cutomerDetails.CreatedBy,
                    EntityOfficeEmail: this.globalDataService.entityOfficeEmail
                };
                this.customerAppointmentDetailsModel.IsSpanishLanguage = this.globalDataService.customerAppoitmentDetail.IsSpanishLanguage;
            }
            //added  to disable the firstname lastname and SSN fields upon rescheduling the appointment-desktop version 
            if (this.globalDataService.IsSloteSelection) {
                this.customerAppointmentDetailsModel.AppointmentStatusId = this.globalDataService.customerAppoitmentDetail.AppointmentStatusId;
            }

            if (this.selectedAppointmentTypes! = undefined) {
                this.selectedAppointmentTypes.length = 0;
            }

            var tempServiceType = [];

            if (this.globalDataService.IsSloteSelection == true)
                tempServiceType = this.globalDataService.customerAppoitmentDetail.AppointmentSerivces;
            else if (this.selectedDateTimeSlote.CustomerAppointmentDetailsId == undefined || this.selectedDateTimeSlote.CustomerAppointmentDetailsId == 0)
                tempServiceType = this.globalDataService.globalAppointmentTypes.filter(obj => obj.Label == 'Personal Tax Preparation');
            else
                tempServiceType = this.selectedDateTimeSlote.AppointmentSerivces;

            this.selectedAppointmentTypes = tempServiceType.map(o => {
                return { item_id: o.AppointmentTypeId, item_text: o.Label, HashColorCode: o.HashColorCode };
            });

        }
        else {
            this.selectedAppointmentTypes = this.globalDataService.globalAppointmentTypes ? this.globalDataService.globalAppointmentTypes.filter(obj => obj.Label == 'Personal Tax Preparation').map(o => {
                return { item_id: o.AppointmentTypeId, item_text: o.Label, HashColorCode: o.HashColorCode };
            }) : [];
        }
    }

    validationCallbackPhone(e): boolean {
        if (e.value.length < 10)
            return false;
        else
            return true;
    }

    validationCallbackSSN(e): boolean {
        if (e.value.length < 4)
            return false;
        else
            return true;
    }

    save(e: any): void {

        this.isdirty = true;

        if (this.startTime == undefined || this.startTime == '' || this.endTime == undefined || this.endTime == '')
            return;


        if (this.selectedAppointmentTypes == undefined || this.selectedAppointmentTypes.length == 0) {
            this.selectAppType = true;
            return;
        }

        this.oldStatusId = this.customerAppointmentDetailsModel.AppointmentStatusId;
        if (this.customerAppointmentDetailsModel.AppointmentStatusId == undefined || this.customerAppointmentDetailsModel.AppointmentStatusId == 0) {
            this.customerAppointmentDetailsModel.AppointmentStatusId = 1;
        }

        this.customerAppointmentDetailsModel.CustomerDetails = this.customerDetails;
        this.customerAppointmentDetailsModel.AppointmentSerivces = undefined;
        for (this.i = 0; this.i <= this.selectedAppointmentTypes.length - 1; this.i++) {
            if (this.customerAppointmentDetailsModel.AppointmentSerivces == undefined) {
                this.customerAppointmentDetailsModel.AppointmentSerivces = [{ AppointmentTypeId: this.selectedAppointmentTypes[this.i].item_id, Label: this.selectedAppointmentTypes[this.i].item_text }];
            }
            else {
                this.customerAppointmentDetailsModel.AppointmentSerivces.push({ AppointmentTypeId: this.selectedAppointmentTypes[this.i].item_id, Label: this.selectedAppointmentTypes[this.i].item_text });
            }
        }
        this.customerAppointmentDetailsModel.CustomerDetails.EntityOfficeEmail = this.globalDataService.entityOfficeEmail;
        if ((this.customerAppointmentDetailsModel.startDateString == undefined || this.customerAppointmentDetailsModel.startDateString == null || this.customerAppointmentDetailsModel.startDateString == '')) {
            var officeOffset = (this.globalDataService.OfficeTimeZoneOffset - this.customerAppointmentDetailsModel.startDate.getTimezoneOffset() / 60);
            this.customerAppointmentDetailsModel.endDate.setHours((this.customerAppointmentDetailsModel.endDate.getHours() + officeOffset));
            this.customerAppointmentDetailsModel.startDate.setHours((this.customerAppointmentDetailsModel.startDate.getHours() + officeOffset));

        }


        this.customerDetailService.saveCustomerDetails(this.customerAppointmentDetailsModel).subscribe(details => {

            this.serverVal = false;
            if (details != undefined && details.Message == 'Server validation failed') {
                this.serverVal = true;
                this.customerAppointmentDetailsModel.AppointmentStatusId = this.oldStatusId;
            }
            else {
                if (this.globalDataService.CMCData != undefined && this.globalDataService.CMCData.length > 0) {
                    this.closeWindow();
                }
                else {
                    this.globalDataService.changeOffice(this.globalDataService.officeId);
                    this.closeWindow()
                    // this.router.navigate(['dashboard/viewappointments/create']);
                }

            }
        }, err => { console.log("saveCustomerDetails", JSON.stringify(this.customerAppointmentDetailsModel)); });
        e.preventDefault();
    }
    selectChange(): void {
        if (!this.isdirty)
            return;

        if (this.selectedAppointmentTypes != undefined && this.selectedAppointmentTypes.length > 0) {
            this.selectAppType = false;
        }
        else {
            this.selectAppType = true;
        }
    }

    closeWindow(): void {
        this.selectedDateTimeSlote = {};
        this.globalDataService.customerAppoitmentDetail = {};
        this.globalDataService.cutomerDetails = { FirstName: '', Last4SSN: '', LastName: '', Phone: '', Email: '', TextOptIn: false, TextOptInDBValue: false, AppointmentNote: '', CreatedBy: '', EmailOptIn: false, EmailOptInDBValue: false, EntityOfficeEmail: '' };
        this.globalDataService.customerAppoitmentDetail = {
            IsSpanishLanguage: false,
            CustomerDetails: { FirstName: '', Last4SSN: '', LastName: '', Phone: '', Email: '', TextOptIn: false, TextOptInDBValue: false, AppointmentNote: '', CreatedBy: '', EmailOptIn: false, EmailOptInDBValue: false, EntityOfficeEmail: '' }
        }
        this.data.storage =
            {
                'selectedDateTimeSlote': this.selectedDateTimeSlote
            };
        this.globalDataService.IsSloteSelection = false;
        this.closeEditAppointmentCall.next('close');
    }


    selectSlote(): void {
        this.globalDataService.IsUpComingTab = false;
        if (this.parent.searchPopupVisible)
            this.parent.searchPopupVisible = false;

        this.globalDataService.customerAppoitmentDetail = this.customerAppointmentDetailsModel;
        this.globalDataService.cutomerDetails = this.customerDetails;
        this.globalDataService.customerAppoitmentDetail.AppointmentSerivces = [];
        if (this.selectedAppointmentTypes != undefined) {
            for (this.i = 0; this.i <= this.selectedAppointmentTypes.length - 1; this.i++) {
                if (this.globalDataService.customerAppoitmentDetail.AppointmentSerivces.length == 0) {
                    this.globalDataService.customerAppoitmentDetail.AppointmentSerivces = [{ AppointmentTypeId: this.selectedAppointmentTypes[this.i].item_id, Label: this.selectedAppointmentTypes[this.i].item_text, HashColorCode: this.selectedAppointmentTypes[this.i].HashColorCode }];
                }
                else {
                    this.globalDataService.customerAppoitmentDetail.AppointmentSerivces.push({ AppointmentTypeId: this.selectedAppointmentTypes[this.i].item_id, Label: this.selectedAppointmentTypes[this.i].item_text, HashColorCode: this.selectedAppointmentTypes[this.i].HashColorCode });
                }
            }
        }

        this.closeEditAppointmentCall.next('close');
        this.globalDataService.showAvailable = true;
        this.globalDataService.IsSloteSelection = true;
        if (this.globalDataService.CMCData != undefined && this.globalDataService.CMCData.length > 0) {
            this.router.navigate([`viewavailableappointments/2`]);
        }
        else {
            if (window.innerWidth > 769) {
                this.globalDataService.paramSubValue = this.globalDataService.paramSubValue + 1;
                this.router.navigate([`dashboard`]);
                this.router.navigate([`dashboard/viewappointments/${this.globalDataService.paramSubValue}`]);
            }
            else {
                this.router.navigate([`dashboard/viewappointments/2`]);
            }

        }
    }

    onTextOptionValueChanged(e: any) {
        if (e.event != undefined) {
            this.customerDetails.TextOptIn = !this.customerDetails.TextOptIn;
            if (this.customerDetails.TextOptIn)
                this.textdisclaimerpopupVisible = true;
        }
    }

    onEmailOptionValueChanged(e: any) {
        if (e.event != undefined) {
            this.customerDetails.EmailOptIn = !this.customerDetails.EmailOptIn;
            if (this.customerDetails.EmailOptIn)
                this.disclaimerpopupVisible = true;
        }
    }

    onSpanishValueChanged(e: any) {
        if (e.event != undefined) {
            this.customerAppointmentDetailsModel.IsSpanishLanguage = this.customerAppointmentDetailsModel.IsSpanishLanguage;
        }
    }

    toggleWithTemplate() {
        this.withTemplateVisible = !this.withTemplateVisible;
    }


    onTextchangeEvent(evt, val): void {
        if (this.selectedDateTimeSlote != undefined && this.selectedDateTimeSlote.AppointmentStatusId != undefined && this.selectedDateTimeSlote.AppointmentStatusId != 0) {
            switch (val) {
                case 'Email':
                    this.customerDetails.Email = evt.target.value;
                    break;
                case 'Phone':
                    this.customerDetails.Phone = evt.target.value.replace(/\D+/g, '').substring(1);
                    break;
                case 'AppointmentNote':
                    this.customerDetails.AppointmentNote = evt.target.value;
                    break;
            }
            this.checkDirtyForm();
        }
    }
    checkDirtyForm(): void {
        // trigger build
        this.isdirtyConfirm = false;
        if ((!isNullOrUndefined(this.selectedDateTimeSlote)) && (!isNullOrUndefined(this.selectedDateTimeSlote.AppointmentStatusId)) && this.selectedDateTimeSlote.AppointmentStatusId != 0) {
            var filteredArray

            if ((this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces ? this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces.length : 0) > this.selectedAppointmentTypes.length) {
                filteredArray = this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces ? this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces.filter(o => !this.selectedAppointmentTypes.find(o2 => o.Label == o2.item_text)) : undefined
                if (filteredArray != undefined && filteredArray.length > 0)
                    this.sTypechange = true;
                else
                    this.sTypechange = false;
            }
            else if ((this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces ? this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces.length : 0) < this.selectedAppointmentTypes.length) {
                filteredArray = this.selectedAppointmentTypes.filter(o => this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces ? !this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces.find(o2 => o.item_text == o2.Label) : undefined)
                if (filteredArray != undefined && filteredArray.length > 0)
                    this.sTypechange = true;
                else
                    this.sTypechange = false;
            }
            else if ((this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces ? this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces.length : 0) == this.selectedAppointmentTypes.length) {
                filteredArray = this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces ? this.globalDataService.customerAppoitmentDetailDirty.AppointmentSerivces.filter(o => this.selectedAppointmentTypes.find(o2 => o.Label == o2.item_text)) : undefined
                if (filteredArray != undefined && filteredArray.length == 0)
                    this.sTypechange = true;
                else
                    this.sTypechange = false;
            }

            if (this.customerDetails.Email == "")
                this.customerDetails.Email = null;
            if (this.customerDetails.AppointmentNote == "")
                this.customerDetails.AppointmentNote = null;

            if (this.globalDataService.customerAppoitmentDetailDirty.Email != this.customerDetails.Email || this.globalDataService.customerAppoitmentDetailDirty.Phone != this.customerDetails.Phone || this.globalDataService.customerAppoitmentDetailDirty.AppointmentNote != this.customerDetails.AppointmentNote || this.globalDataService.customerAppoitmentDetailDirty.TextOptIn != this.customerDetails.TextOptIn
                || this.globalDataService.customerAppoitmentDetailDirty.EmailOptIn != this.customerDetails.EmailOptIn
                || this.globalDataService.customerAppoitmentDetailDirty.SpanishOptIn != this.customerAppointmentDetailsModel.IsSpanishLanguage
                || this.sTypechange) {
                this.isdirtyConfirm = false;
            }
            else if (this.globalDataService.IsSloteSelection)
                this.isdirtyConfirm = false;
            else {
                this.isdirtyConfirm = true;
            }
        }
    }

    emailOptInChange(Status: string) {
        this.disclaimerpopupVisible = false;
        if (Status == "agree")
            this.customerDetails.EmailOptIn = true;
        else
            this.customerDetails.EmailOptIn = false;
    }

    textOptInChange(Status: string) {
        this.textdisclaimerpopupVisible = false;
        if (Status == "agree")
            this.customerDetails.TextOptIn = true;
        else
            this.customerDetails.TextOptIn = false;
    }

}