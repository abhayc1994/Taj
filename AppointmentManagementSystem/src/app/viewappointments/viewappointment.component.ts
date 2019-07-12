import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Appointment, Resource, Service, DashboardData } from '../services/appointments.services';

import Query from 'devextreme/data/query';
import notify from 'devextreme/ui/notify';
import { CreateAppointment } from '../createappointment/createappointment.component';
import { GlobalDataService } from '../services/globaldataservice';
import { CustomerAppointmentDetailsModel, AppointmentServicesModel, OfficeOperationHoursModel, OfficeDetails } from '../viewmodels/office.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { OfficeDetailServices } from '../services/office.services';
import { DxSchedulerComponent } from 'devextreme-angular/ui/scheduler';
import { isNullOrUndefined } from 'util';
import { Data } from '../services/data-share.service';
import { ISubscription } from 'rxjs/Subscription';


@Component({
    selector: "view-appointment",
    templateUrl: './viewappointment.component.html',
    styleUrls: ['./viewappointment.component.css']

})
export class ViewAppointments implements OnInit, AfterViewInit {
    popupHeight: number = 670;
    popupWeight: number = 500;
    appointmentsData: CustomerAppointmentDetailsModel[];
    cancelledAppointment: CustomerAppointmentDetailsModel[];
    newfilteredData: CustomerAppointmentDetailsModel[];
    filteredData: CustomerAppointmentDetailsModel[];
    appointmentServicesData: AppointmentServicesModel[];
    resourcesData: Resource[];
    popupVisible = false;
    popupChangeSatusVisible = false;
    isScheduledChecked: boolean = false;
    isCompletedChecked: boolean = false;
    isNoShowChecked: boolean = false;
    isViewCancelledAppintment: boolean = false;
    isCancelledChecked: boolean = false;
    isAvailableChecked: boolean = false;
    selectedDateTimeSlote: CustomerAppointmentDetailsModel = { startDate: new Date(), endDate: new Date() };
    auxBusinessService: any;
    pageTitle: string = "Create Customer Appointment";
    private routeSubscription: ISubscription;
    private officesubscription: ISubscription;





    @ViewChild(DxSchedulerComponent) scheduler: DxSchedulerComponent;
    @ViewChild(CreateAppointment)
    private createAppointment: CreateAppointment;
    i: number;
    currentDate: Date = new Date();

    fromDate: string;
    toDate: string;
    seletedAppType: string;
    isForcible: string;
    statusIds: string;
    startDate: string;
    endDate: string;
    SelectedOfficeId: string;
    dateFormat: string;
    officeOperationHoursData: OfficeOperationHoursModel[];
    isThirtyMinSolt: boolean = false;
    constructor(private route: ActivatedRoute, private router: Router, private service: Service, public globalDataService: GlobalDataService, private spinner: NgxSpinnerService, public datepipe: DatePipe, private officeDetailServices: OfficeDetailServices, private data: Data) {
        this.resourcesData = service.getResources();
        this.dateFormat = 'MM/dd/yyyy hh:mm a';
    }

    filtervalueAdd(filteredData: CustomerAppointmentDetailsModel[]) {
        this.newfilteredData = filteredData;
        this.changeSchedulerViewType();
    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(
            params => {
                if (window.innerWidth > 769) {
                    this.getFirstLastDayOfWeek(this.globalDataService.schedulerCurrentDateCal);
                }
                if (this.globalDataService.IsUpComingTab || this.globalDataService.IsTodaysTab) {
                    this.globalDataService.schedulerCurrentDate = new Date();
                }

                this.seletedAppType = params['appointmentType'];
                this.isForcible = this.seletedAppType;
                this.setAppointmentStatus();
                this.onWidgetChanged(undefined);
               
            }
        );
       
        this.officesubscription = this.globalDataService.currentOffice.subscribe(data => {
            if (this.globalDataService.officeId != undefined) {
                if (this.SelectedOfficeId != this.globalDataService.officeId) {
                    this.SelectedOfficeId = this.globalDataService.officeId;
                    this.setAppointmentStatus();
                    this.fromDate = this.startDate;
                    this.toDate = this.endDate;

                    //Set fromdate if fromDate is null/undefined/empty
                    if (this.fromDate == null || this.fromDate == undefined || this.fromDate == '') {
                        this.fromDate = this.globalDataService.schedulerCurrentDate.getMonth() + 1 + '/' + this.globalDataService.schedulerCurrentDate.getDate() + '/' + this.globalDataService.schedulerCurrentDate.getFullYear();
                    }
                    //Set todate if fromDate is null/undefined/empty
                    if (this.toDate == null || this.toDate == undefined || this.toDate == '') {
                        this.toDate = this.globalDataService.schedulerCurrentDate.getMonth() + 1 + '/' + this.globalDataService.schedulerCurrentDate.getDate() + '/' + this.globalDataService.schedulerCurrentDate.getFullYear();
                    }




                    this.officeDetailServices.GetAuxBusinessServiceAndOfficeConfigAndAppointmentsbyOfficeId(this.globalDataService.officeId, this.statusIds, this.fromDate, this.toDate).subscribe(response => {
                        if (response != undefined && response.length == 3) {
                            this.convertToObject(response[2]);
                            this.auxBusinessService = response[1];
                            this.officeOperationHoursData = response[0];

                            if (this.auxBusinessService != undefined && this.auxBusinessService != null) {
                                this.globalDataService.globalAppointmentTypes = [];
                                for (this.i = 0; this.i <= this.auxBusinessService.length - 1; this.i++) {
                                    this.globalDataService.globalAppointmentTypes.push({ AppointmentTypeId: this.auxBusinessService[this.i].AppointmentTypeId, Label: this.auxBusinessService[this.i].Label, HashColorCode: this.auxBusinessService[this.i].HashColorCode });
                                }
                            }

                        }
                    }, err => { console.log(err) });
                    // this.getOfficeConfiguration();
                }
                else {
                    this.getAppointment(this.seletedAppType);
                }
                this.globalDataService.endDayHour = 21;
                this.getOfficeConfiguration();
            }
            if (this.globalDataService.officeId != undefined && this.globalDataService.isOfficeHoursUpdated)
                this.getOfficeConfiguration();
        });
       
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
        this.officesubscription.unsubscribe();
    }

    getOfficeConfiguration() {

        this.officeDetailServices.getOfficeOperationHoursConfiguration(this.globalDataService.officeId).subscribe(res => {
            this.officeOperationHoursData = res;
            this.setStartDayHour();
        }, error => {
            console.log(error)

        });
    }

    setStartDayHour() {
        if (this.officeOperationHoursData == undefined)
            return;


        let arrayTime: any[];
        for (let i = 0; i <= this.officeOperationHoursData.length - 1; i++) {
            if (this.officeOperationHoursData[i].EveningCloseTime != undefined || !this.officeOperationHoursData[i].EveningCloseTime) {
                var tmpArr = this.officeOperationHoursData[i].EveningCloseTime.split(':');
                if (+tmpArr[0] > 0) {
                    if (arrayTime == undefined) {
                        arrayTime = [tmpArr[0]]

                    }
                    else {
                        arrayTime.push(tmpArr[0])
                    }
                }

            }
        }
        
        if (arrayTime != undefined && arrayTime.length > 0 && Math.max.apply(null, arrayTime) > this.globalDataService.endDayHour) {
            this.globalDataService.endDayHour = Math.max.apply(null, arrayTime);
        } 
    }


    getAppointment(chosenAppointmentType: string) {
        this.setAppointmentStatus();
        if (!isNullOrUndefined(this.statusIds) && this.globalDataService.officeId != undefined && this.statusIds!='') {
            this.getDataBasedOnStatus(this.statusIds);
        }
    }

    setAppointmentStatus() {
        this.isViewCancelledAppintment = true;
        if (this.newfilteredData != undefined) {
            this.newfilteredData.length = 0;
        }


        if (this.filteredData != undefined) {
            this.filteredData.length = 0;
        }

        this.statusIds = undefined;

        if (this.globalDataService.showAvailable) {
            this.isAvailableChecked = this.globalDataService.showAvailable;
            this.getStatusConcatenated(this.statusIds, 0);
        }

        if (this.globalDataService.showScheduled) {
            this.isScheduledChecked = this.globalDataService.showScheduled;
            this.getStatusConcatenated(this.statusIds, 1);
        }
        if (this.globalDataService.showCompleted) {
            this.isCompletedChecked = this.globalDataService.showCompleted;
            this.getStatusConcatenated(this.statusIds, 2);
        }
        if (this.globalDataService.showNoShow) {
            this.isNoShowChecked = this.globalDataService.showNoShow;
            this.getStatusConcatenated(this.statusIds, 3);
        }

        if (this.globalDataService.showCancelled) {
            this.isCancelledChecked = this.globalDataService.showCancelled;
            this.getStatusConcatenated(this.statusIds, 4);
        }
    }

    getStatusConcatenated(statusIds: string, id: number) {
        if (statusIds == undefined) {
            this.statusIds = '' + id;
        } else {
            this.statusIds = this.statusIds + ',' + id;
        }
    }

    getDataBasedOnStatus(statuId: string) {
        if (!isNullOrUndefined(statuId) && this.globalDataService.officeId != undefined && this.statusIds != '') {
            this.service.getAppointmentByStatus(this.globalDataService.officeId, statuId, this.fromDate, this.toDate).subscribe(res => {
                this.convertToObject(res);
            }, err => {

                console.log(err);
            });
        }
    }

    transfermtShorttime(dateTiem: any) {

        var numoffset=this.globalDataService.OfficeTimeZoneOffset * 100

        return this.datepipe.transform(dateTiem, "shortTime", '-' + (numoffset >= 1000 ? numoffset : ('0'+numoffset)));
    }

    transfermtShortdate(dateTiem: any,format:string): Date {
        var numoffset = this.globalDataService.OfficeTimeZoneOffset * 100;
        format = this.dateFormat;
        return new Date(this.datepipe.transform(dateTiem, format, '-' + (numoffset >= 1000 ? numoffset : ('0' + numoffset))));
    }

    transfermtShortdateString(dateTiem: any, format: string): string {
        var numoffset = this.globalDataService.OfficeTimeZoneOffset * 100
        return this.datepipe.transform(dateTiem, format, '-' + (numoffset >= 1000 ? numoffset : ('0' + numoffset)));
    }

    convertToObject(res: any) {
        for (this.i = 0; this.i <= res.CustomerAppointmentDetails.length - 1; this.i++) {
            //res.CustomerAppointmentDetails[this.i].startDate = this.globalDataService.ReviveDateTime(res.CustomerAppointmentDetails[this.i].startDate);
            //res.CustomerAppointmentDetails[this.i].endDate = this.globalDataService.ReviveDateTime(res.CustomerAppointmentDetails[this.i].endDate);
            res.CustomerAppointmentDetails[this.i].startDate = res.CustomerAppointmentDetails[this.i].startDateString;
            res.CustomerAppointmentDetails[this.i].endDate = res.CustomerAppointmentDetails[this.i].endDateString;

        }
        //this.auxBusinessService = res.AuxilaryBusinessServices;
        this.appointmentServicesData = res.AuxilaryBusinessServices;
        this.filtervalueAdd(res.CustomerAppointmentDetails);
        this.scheduler.instance.scrollToTime(8, 30);
    }

    handleTooltip(e: any) {
        this.scheduler.instance.hideAppointmentTooltip();
        setTimeout(function () {
            if (document.querySelectorAll("[role=tooltip]").length == 3)
                document.querySelectorAll("[role=tooltip]")[2].remove();
        }, 300);
    }

    onAppointmentClick(e: any) {
        if ((e.appointmentData.AppointmentStatusId == undefined || e.appointmentData.AppointmentStatusId == 0) && this.globalDataService.IsSloteSelection) {
            if (this.officeOperationHoursData != undefined && this.officeOperationHoursData.findIndex(item => item.DayOrder == this.transfermtShortdate(e.appointmentData.startDate,"short").getDay() + 1) == -1) {
                e.cancel = true;
                return false;
            }
            this.editAppointment(Object.assign({}, e.appointmentData));
        }
        else if (this.globalDataService.IsSloteSelection && e.appointmentData.AppointmentStatusId != 0) {
            e.cancel = true;
            return false;
        }
        else if (e.appointmentData.AppointmentStatusId == 0) {
            e.cancel = true;
            return false;
        }
        else if (!isNullOrUndefined(e.appointmentElement) && !isNullOrUndefined(e.appointmentElement.className) && (e.appointmentElement.className.indexOf('dx-state-hover dx-state-focused') > 0 ||
            e.appointmentElement.className.indexOf('dx-state-focused dx-state-hover') > 0 ||
            e.appointmentElement.className.indexOf('dx-state-hover') > 0)) {
            e.cancel = true;
            return false;
        }

        if (this.statusIds != undefined && this.transfermtShortdate(e.appointmentData.startDate, "short") >= this.globalDataService.schedulerCurrentDateCal) {
            // this.selectedDateTimeSlote = {};
            var Ids = this.statusIds.split(",");
            if (Ids.indexOf('0') >= 0) {
                e.cancel = false;
            }
        }
        if (e.component._currentView != 'month')
            return;

        if (this.popupVisible == false && this.popupChangeSatusVisible == false)
            e.cancel = false;
        if (this.popupVisible == true || this.popupChangeSatusVisible == true)
            e.cancel = true;
        if (e.event.target.className == "" || e.event.target.className == "dx-item-content dx-list-item-content") {

            return false;
        }
        if (this.createAppointment != undefined && this.createAppointment.customerDetails != undefined && e.appointmentData.CustomerDetails != undefined) {
            this.createAppointment.customerDetails = e.appointmentData.CustomerDetails;
            this.createAppointment.selectedAppointmentTypes = undefined;
            for (this.i = 0; this.i <= e.appointmentData.AppointmentSerivces.length - 1; this.i++) {
                if (this.createAppointment.selectedAppointmentTypes == undefined) {
                    this.createAppointment.selectedAppointmentTypes = [{ item_id: e.appointmentData.AppointmentSerivces[this.i].AppointmentTypeId, item_text: e.appointmentData.AppointmentSerivces[this.i].Label }];
                }
                else {
                    this.createAppointment.selectedAppointmentTypes.push({ item_id: e.appointmentData.AppointmentSerivces[this.i].AppointmentTypeId, item_text: e.appointmentData.AppointmentSerivces[this.i].Label });
                }
            }
        }
        //e.cancel = true;
    }

    onWidgetChanged(evt: any) {
        if (this.globalDataService.officeId == undefined) {
            return;
        }
        else if (!(evt == undefined || evt.name == 'currentDate' || evt.name == "currentView")) {
            return;
        }

        if (this.scheduler.instance == undefined) {
            return;
        }

        if (evt == undefined)
            this.globalDataService.currentView = isNullOrUndefined(this.scheduler.instance.option().currentView) ? 'week' : this.scheduler.instance.option().currentView;
        else if ((evt.component._currentView == 'day' && evt.name == 'currentDate') || (typeof evt.value == "string" && evt.value == "day" && evt.name == "currentView"))
            this.globalDataService.currentView = 'day';
        else if ((evt.component._currentView == 'week' && evt.name == 'currentDate') || (typeof evt.value == "string" && evt.value == "week" && evt.name == "currentView"))
            this.globalDataService.currentView = 'week';
        else if ((evt.component._currentView == 'month' && evt.name == 'currentDate') || (typeof evt.value == "string" && evt.value == "month" && evt.name == "currentView"))
            this.globalDataService.currentView = 'month';

        if (this.globalDataService.currentView == 'month') {
            this.scheduler.height = "500";
        }
        else {
            this.scheduler.height = null;
        }

        if (this.globalDataService.currentView == 'day') {
            if (evt != undefined && evt.component._currentView == 'week' && evt.name == 'currentDate')
                this.globalDataService.schedulerCurrentDate = evt.value;
            else if (evt != undefined)
                this.globalDataService.schedulerCurrentDate = evt.component._options.currentDate;


            this.getSelectedDayCount(this.globalDataService.schedulerCurrentDate);
            this.fromDate = this.startDate;
            this.toDate = this.startDate;
            //if (evt != undefined)
            this.getDataBasedOnStatus(this.statusIds);
            this.globalDataService.getSelecteddatetext();
        }
        else if (this.globalDataService.currentView == 'week') {
            if (evt != undefined && evt.component._currentView == 'week' && evt.name == 'currentDate')
                this.globalDataService.schedulerCurrentDate = evt.value;
            else if (evt != undefined)
                this.globalDataService.schedulerCurrentDate = evt.component._options.currentDate;

            this.getFirstLastDayOfWeek(this.globalDataService.schedulerCurrentDate);

            this.service.getDashboardDetailsByOfficeId(this.globalDataService.officeId, 'week', this.startDate, this.endDate).subscribe(result => {
                this.globalDataService.weeksDashboardData = result;
                this.setWeekStaticsChart();
                this.globalDataService.poppulateDashboardTileCounts(result);
            }, err => { this.spinner.hide() });

            //Load Appointment Details for selected month.
            this.fromDate = this.startDate;
            this.toDate = this.endDate;
            //if (evt != undefined)
            this.getDataBasedOnStatus(this.statusIds);

            //this.getDayCount('week');


            this.globalDataService.getSelecteddatetext();
        }
        else if (this.globalDataService.currentView == 'month') {
            if ((evt != undefined && evt.component._currentView == 'month' && evt.name == 'currentDate'))
                this.globalDataService.schedulerCurrentDate = evt.value;
            else if (evt != undefined)
                this.globalDataService.schedulerCurrentDate = evt.component._options.currentDate;

            this.getFirstLastDayOfmonth(this.globalDataService.schedulerCurrentDate);

            this.fromDate = this.startDate;
            this.toDate = this.endDate;
            //if (evt != undefined)
            this.getDataBasedOnStatus(this.statusIds);

            this.getDashboardTileCount('month');

            this.globalDataService.getSelecteddatetext();
        }


    }
    setWeekStaticsChart() {
        if (this.globalDataService.items != undefined && this.globalDataService.items.length > 0) {
            this.globalDataService.items.length = 0;
        }
        this.globalDataService.total = 0;
        this.globalDataService.items =
            [{ name: 'Cancelled', count: 0, color: '#eda999', id: 0 },
            { name: 'Completed', count: 0, color: '#9acafc', id: 0 },
            { name: 'Scheduled', count: 0, color: '#9195e6', id: 0 },
            { name: 'No Show', count: 0, color: '#636e72', id: 0 },
            { name: 'Available', count: 0, color: '#fad796', id: 0 }];

        this.globalDataService.weeksDashboardData.forEach(data => {
            this.globalDataService.items.find(iitem => iitem.name == data.ScheduleType).count = data.Slots;
        })

        if (this.globalDataService.items != undefined && this.globalDataService.items.length > 0) {
            this.globalDataService.total = this.globalDataService.items.map(a => a.count).reduce((x, y) => x + y);
        }
        this.globalDataService.loadd3donut();
    }
    getFirstLastDayOfworkWeek(userdate: Date): void {
        var dt = userdate  //current date of week
        var currentWeekDay = dt.getDay();
        var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1
        var wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
        var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 4));
        this.startDate = wkStart.getMonth() + 1 + '/' + wkStart.getDate() + '/' + wkStart.getFullYear();
        this.endDate = wkEnd.getMonth() + 1 + '/' + wkEnd.getDate() + '/' + wkEnd.getFullYear();

    }


    getFirstLastDayOfWeek(userdate: Date): void {
        var dt = userdate  //current date of week
        var currentWeekDay = dt.getDay();
        var lessDays = currentWeekDay
        var wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
        var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
        this.startDate = wkStart.getMonth() + 1 + '/' + wkStart.getDate() + '/' + wkStart.getFullYear();
        this.endDate = wkEnd.getMonth() + 1 + '/' + wkEnd.getDate() + '/' + wkEnd.getFullYear();
    }

    getFirstLastDayOfmonth(userdate: Date): void {
        var curr = new Date(userdate);
        var firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1);
        var lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
        this.startDate = firstDay.getMonth() + 1 + '/' + firstDay.getDate() + '/' + firstDay.getFullYear();
        this.endDate = lastDay.getMonth() + 1 + '/' + lastDay.getDate() + '/' + lastDay.getFullYear();
    }

    getAppointmentServicesColorbyId(id: string) {
        return Query(this.appointmentServicesData).filter(["AppointmentTypeId", "=", id]).toArray()[0].HashColorCode;
    }

    getAppointmentServicesTypebyId(id: string) {
        return Query(this.appointmentServicesData).filter(["AppointmentTypeId", "=", id]).toArray()[0].AppointmentType;
    }

    getAppointmentStatusColorbyId(id: string) {
        return Query(this.resourcesData).filter(["typeId", "=", id]).toArray()[0].color;
    }
    getAppointmentTypeTextColorbyId(id: string) {
        return Query(this.resourcesData).filter(["typeId", "=", id]).toArray()[0].textcolor;
    }



    filteredValueAdd(items: CustomerAppointmentDetailsModel[]) {
        if (this.filteredData != undefined) {
            Array.prototype.push.apply(this.filteredData, items);
        } else {
            this.filteredData = items;
        }
    }

    changeSchedulerViewType() {

        if (this.newfilteredData == undefined) {
            return;
        }

        if (this.filteredData != undefined) {
            this.filteredData.length = 0;
        }

        if (this.isScheduledChecked) {
            this.filteredValueAdd(this.newfilteredData.filter(item => { return item.AppointmentStatusId == 1; }));
        }
        if (this.isCompletedChecked) {
            this.filteredValueAdd(this.newfilteredData.filter(item => { return item.AppointmentStatusId == 2; }));
        }
        if (this.isNoShowChecked) {
            this.filteredValueAdd(this.newfilteredData.filter(item => { return item.AppointmentStatusId == 3; }));
        }
        if (this.isCancelledChecked) {
            this.filteredValueAdd(this.newfilteredData.filter(item => { return item.AppointmentStatusId == 4; }));
        }
        if (this.isAvailableChecked) {
            this.filteredValueAdd(this.newfilteredData.filter(item => { return item.AppointmentStatusId == 0; }));
        }
        this.appointmentsData = this.filteredData;
        this.globalDataService.availableSlotsData = this.appointmentsData;
    }



    checkBoxToggled(isScheduled: boolean) {
        console.log(isScheduled);

    }

    editDetails(id: string) {
        return "test";
    }

    editAppointment(customer: CustomerAppointmentDetailsModel) {

        var startDate = this.transfermtShortdate(customer.startDateString,"short");
        var endDate = this.transfermtShortdate(customer.endDateString, "short");
        //if (startDate < this.globalDataService.schedulerCurrentDateCal && customer.AppointmentStatusId == 0) {
        //    this.notifyOnPastTimeAppointmentBooking();
        //    return;
        //}

        this.globalDataService.customerAppoitmentDetailDirty = { AppointmentSerivces: customer.AppointmentSerivces, Email: customer.CustomerDetails.Email, AppointmentNote: customer.CustomerDetails.AppointmentNote, Phone: customer.CustomerDetails.Phone, TextOptIn: customer.CustomerDetails.TextOptIn, EmailOptIn: customer.CustomerDetails.EmailOptIn, SpanishOptIn: customer.IsSpanishLanguage }

        if (window.innerWidth > 769) {
            this.popupVisible = true;
        }
        this.selectedDateTimeSlote = JSON.parse(JSON.stringify(customer));
        this.scheduler.instance.hideAppointmentTooltip();
        if (this.createAppointment != undefined) {
            if (this.isForcible == '2' && this.createAppointment.selectedDateTimeSlote != undefined && customer.AppointmentStatusId == 0 && this.globalDataService.IsSloteSelection) {
                this.createAppointment.selectedDateTimeSlote = this.globalDataService.customerAppoitmentDetail;
                this.createAppointment.selectedDateTimeSlote.CustomerDetails = this.globalDataService.cutomerDetails;
                this.createAppointment.selectedDateTimeSlote.startDate = customer.startDate;
                this.createAppointment.selectedDateTimeSlote.endDate = customer.endDate;
                this.createAppointment.date = this.transfermtShortdateString(customer.startDate, 'MM/dd/yyyy');
                this.createAppointment.startTime = this.transfermtShortdateString(customer.startDate, 'shortTime');
                this.createAppointment.endTime = this.transfermtShortdateString(customer.endDate, 'shortTime');
                this.createAppointment.selectedDateTimeSlote = customer;
                this.createAppointment.customerDetails = customer.CustomerDetails;
                this.createAppointment.customerAppointmentDetailsModel = this.globalDataService.customerAppoitmentDetail;
               
            }
            else {
                this.createAppointment.selectedDateTimeSlote = customer;
                this.createAppointment.customerDetails = customer.CustomerDetails;
                this.createAppointment.customerAppointmentDetailsModel.AppointmentStatusId = customer.AppointmentStatusId;
                this.createAppointment.date = this.transfermtShortdateString(customer.startDate, 'MM/dd/yyyy');
                this.createAppointment.startTime = this.transfermtShortdateString(customer.startDate, 'shortTime');
                this.createAppointment.endTime = this.transfermtShortdateString(customer.endDate, 'shortTime');
            }
           
        }
        if (customer.CustomerAppointmentDetailsId != null && customer.CustomerAppointmentDetailsId > 0) {
            this.pageTitle = "Edit Customer Appointment";
        }
        else { this.pageTitle = "Create Customer Appointment"; }

        if (!(window.innerWidth > 769)) {
            //Only for mobile view.
            if (this.globalDataService.IsSloteSelection) {
                this.selectedDateTimeSlote = this.globalDataService.customerAppoitmentDetail;
                this.selectedDateTimeSlote.CustomerDetails = this.globalDataService.cutomerDetails;
                this.selectedDateTimeSlote.startDate = customer.startDate;
                this.selectedDateTimeSlote.endDate = customer.endDate;
                this.selectedDateTimeSlote.startDateString = customer.startDateString;
                this.selectedDateTimeSlote.endDateString = customer.endDateString;
                if (this.selectedDateTimeSlote.CustomerAppointmentDetailsId != null && this.selectedDateTimeSlote.CustomerAppointmentDetailsId > 0) {
                    this.data.storage = {
                        'selectedDateTimeSlote': this.selectedDateTimeSlote
                    };
                    this.router.navigate(['/mobile-view', 'edit']);
                }
                else {
                    this.data.storage = {
                        'selectedDateTimeSlote': this.selectedDateTimeSlote
                    };
                    this.router.navigate(['/mobile-view', 'create']);
                }
            }
            else {
                if (customer.CustomerAppointmentDetailsId != null && customer.CustomerAppointmentDetailsId > 0) {
                    this.data.storage = {
                        'selectedDateTimeSlote': this.selectedDateTimeSlote
                    };
                    this.router.navigate(['/mobile-view', 'edit']);
                }
                else {
                    this.data.storage = {
                        'selectedDateTimeSlote': this.selectedDateTimeSlote
                    };
                    this.router.navigate(['/mobile-view', 'create']);
                }
            }


        }
        //this.globalDataService.IsSloteSelection = false;

    }

    changeStatus(customer: CustomerAppointmentDetailsModel) {
        this.scheduler.instance.hideAppointmentTooltip();
        this.popupChangeSatusVisible = true;
        this.selectedDateTimeSlote = JSON.parse(JSON.stringify(customer));
    }

    updateAppointmentStatus(updatedStatus: string) {
        this.popupChangeSatusVisible = false;
        if (updatedStatus == "complete")
            this.selectedDateTimeSlote.AppointmentStatusId = 2;
        else if (updatedStatus == "noshow")
            this.selectedDateTimeSlote.AppointmentStatusId = 3;
        if (updatedStatus == "cancel")
            this.selectedDateTimeSlote.AppointmentStatusId = 4;
        if (isNullOrUndefined(this.selectedDateTimeSlote.OfficeId))
            this.selectedDateTimeSlote.OfficeId = this.globalDataService.officeId;
        this.service.UpdateAppointmentStatus(this.selectedDateTimeSlote).subscribe(details => {
            this.globalDataService.changeOffice(this.globalDataService.officeId);
            this.getAppointment(this.seletedAppType);
        });
    }

    notifyOnStatusChange(updatedStatus: string) {

        var type = "Success",
            text = "The appointment status for " + this.selectedDateTimeSlote.CustomerDetails.FirstName.toUpperCase() + " " + this.selectedDateTimeSlote.CustomerDetails.LastName.toUpperCase
                + " is changed to " + updatedStatus;

        notify(text, type, 3000);
    }

    closeEditAppointment(e: any) {
        this.globalDataService.IsSloteSelection = false;
        this.popupVisible = false;
        this.popupChangeSatusVisible = false;
        this.globalDataService.availableSlotsData = this.appointmentsData;
        if (e.cancel != undefined)
            e.cancel = false;
    }

    back() {
        this.router.navigate([`/dashboard`]);
    }
    onAppointmentDblClick(e: any) {
        this.scheduler.instance.hideAppointmentPopup();
        this.scheduler.instance.hideAppointmentTooltip();

        if (this.officeOperationHoursData != undefined && this.officeOperationHoursData.findIndex(item => item.DayOrder == this.transfermtShortdate(e.appointmentData.startDate,"short").getDay() + 1) == -1) {
            e.cancel = true;
            return;
        }


        if (this.statusIds != undefined && e.appointmentData.AppointmentStatusId == 0) {
            this.selectedDateTimeSlote = {};
            var Ids = this.statusIds.split(",");
            if (Ids.indexOf('0') >= 0) {
                this.editAppointment(e.appointmentData);
            }
        }
        //else if (e.appointmentData.AppointmentStatusId == 0) {
        //    this.notifyOnPastTimeAppointmentBooking();
        //}
        e.cancel = true;
    }

    getSelectedDayCount(evt: any) {
        this.startDate = evt.getMonth() + 1 + '/' + evt.getDate() + '/' + evt.getFullYear();
        this.endDate = this.startDate;
        this.getDashboardTileCount('day');
    }

    getDashboardTileCount(DashboardType: string) {
        if (this.globalDataService.officeId == undefined)
            return;

        this.service.getDashboardDetailsByOfficeId(this.globalDataService.officeId, DashboardType, this.startDate, this.endDate).subscribe(result => {
            this.globalDataService.poppulateDashboardTileCounts(result);
        }, err => { this.spinner.hide() });
    }

    getWeekCount() {
        if (this.globalDataService.officeId == undefined)
            return;

        let date: Date = new Date(this.startDate);

        this.getFirstLastDayOfWeek(date);


        this.service.getDashboardDetailsByOfficeId(this.globalDataService.officeId, 'week', this.startDate, this.endDate).subscribe(result => {
            this.globalDataService.weeksDashboardData = result;
            this.setWeekStaticsChart();

        }, err => { this.spinner.hide() });

    }

    onCellDblClick(e) {
        this.scheduler.instance.hideAppointmentPopup();
        e.cancel = true;

        this.globalDataService.IsFromSchedulerCell = true;

        var SelectedDate = new Date(this.startDate);
        var SelectedcellDate = new Date(e.cellData.startDate);
        var StartTime = this.datepipe.transform(e.cellData.startDate, 'shortTime');
        var EndTime = this.datepipe.transform(e.cellData.endDate, 'shortTime');
        if (e != undefined || e != null) {
            if (e.component._options.currentView == 'month' && SelectedDate.getMonth() != SelectedcellDate.getMonth()) {
                e.cancel = true;
                return false;
            }
            else if (StartTime == EndTime && e.component._options.currentView == 'month') {
                e.cancel = true;
                return false;
            }
        }

        if (this.statusIds != undefined && e.cellData.startDate >= this.globalDataService.schedulerCurrentDateCal) {
            this.selectedDateTimeSlote = {};
            if (this.globalDataService.IsSloteSelection) {
                this.selectedDateTimeSlote = this.globalDataService.customerAppoitmentDetail;
                this.selectedDateTimeSlote.CustomerDetails = this.globalDataService.cutomerDetails;
                this.selectedDateTimeSlote.startDateString = '';
                this.selectedDateTimeSlote.endDateString = '';
            }
            var Ids = this.statusIds.split(",");
            if (Ids.indexOf('0') >= 0) {
                if (window.innerWidth > 769) {
                    this.popupVisible = true;
                }

                var startDateTime = new Date(e.cellData.startDate);
                var curHr = startDateTime.getHours();
                if (this.officeOperationHoursData != undefined) {
                    this.officeOperationHoursData.forEach(item => {
                        if (item.DayOrder == startDateTime.getDay() + 1) {
                            if (curHr < 12) {
                                this.isThirtyMinSolt = item.HasOfficeAppointmentConfiguredHourly; //Morning Hourly Config
                            } else if (curHr < 24) {
                                this.isThirtyMinSolt = item.HasEveningOfficeAppointmentConfiguredHourly // Evening Hourly Config
                            }

                        }
                    });
                }
                var startmin = Object.create(e.cellData.startDate);
                var endmin = Object.create(e.cellData.endDate);
                this.pageTitle = "Create Customer Appointment";
                if (this.isThirtyMinSolt) {                   
                    this.selectedDateTimeSlote.startDate = new Date(e.cellData.startDate);
                    this.selectedDateTimeSlote.endDate = new Date(e.cellData.endDate);
                    if (e.cellData.startDate.getMinutes() != 0) {
                        this.selectedDateTimeSlote.startDate.setMinutes(startmin.__proto__.getMinutes() - 30);
                    }
                    if (e.cellData.endDate.getMinutes() != 0) {
                        this.selectedDateTimeSlote.endDate.setMinutes(endmin.__proto__.getMinutes() + 30);
                    }
                }
                else {
                    this.selectedDateTimeSlote.startDate = startmin.__proto__;
                    this.selectedDateTimeSlote.endDate = endmin.__proto__;
                }

                if (!(window.innerWidth > 769)) {
                    //Only for mobile view.                 
                    this.data.storage = {
                        'selectedDateTimeSlote': this.selectedDateTimeSlote
                    };
                    this.router.navigate(['/mobile-view', 'create']);
                }
            }
        }
        else { e.cancel = true; }

    }


    popupWidth() {
        setTimeout(() => {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
                this.popupHeight = window.innerHeight - (window.innerHeight * 0.2);
                this.globalDataService.currentView = 'day';
            }
            else {

                if (window.innerWidth > 769) {

                    this.popupWeight = 500;
                    this.popupHeight = 670;
                }
                else {
                    this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
                    this.popupHeight = window.innerHeight - (window.innerHeight * 0.2);
                    this.globalDataService.currentView = 'day';
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

    notifyOnPastTimeAppointmentBooking() {

        var type = "error",
            text = "Past hours appointment cannot be scheduled.";

        notify(text, type, 3000);
    }
}