import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { Appointment, DashboardData, Resource, Service } from '../services/appointments.services';
import { GlobalDataService } from '../services/globaldataservice';
import { DashboardService, AppointmentServiceType } from '../services/dashboardservices';

import { DashboardAppointmentSlots } from '../viewmodels/dashboard.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardSidePanelComponent } from 'src/app/dashboard-side-panel/dashboard-side-panel.component';
import { Data } from '../services/data-share.service';

import { ISubscription } from 'rxjs/Subscription';

@Component({
    selector: "dashboard",
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})



export class Dashboard implements OnInit {
    popupHeight: number = 670;
    popupWeight: number = 500;
    showMobileTab: string = 'today';
    showMobileTabUpcoming: boolean = true;
    showMobileTabToday: boolean = true;
    todaysDashboardData: DashboardData[];
    weeksDashboardData: DashboardData[];
    appointmentsData: Appointment[];
    newfilteredData: Appointment[];
    filteredData: Appointment[];
    appointmentServicesData: AppointmentServiceType[];
    resourcesData: Resource[];
    scheduledCountToday: number = 0;
    availableCountToday: number = 0;
    completedCountToday: number = 0;
    cancelledCountToday: number = 0;
    noShowCountToday: number = 0;
    scheduledCountWeek: number = 0;
    availableCountWeek: number = 0;
    completedCountWeek: number = 0;
    cancelledCountWeek: number = 0;
    popupVisible = false;
    isScheduledChecked: boolean = true;
    isCompletedChecked: boolean = true;
    isNoShowChecked: boolean = true;  
    currentDate: Date = new Date(2018, 6, 5);
    officeId: string;
    startDate: string;
    endDate: string;
    private OnComponentLoadSubscription: ISubscription;

    @ViewChild(DashboardSidePanelComponent)
    private todaysAppointment: DashboardSidePanelComponent;

    constructor(private route: ActivatedRoute, private router: Router, private service: Service, public storedDataService: GlobalDataService, private dashboardService: DashboardService, private spinner: NgxSpinnerService, public globalDataService: GlobalDataService,public data: Data) {


        // this.storedDataService.showAvailable = this.storedDataService.showAvailable? true:  false;
        // this.storedDataService.showCancelled = this.storedDataService.showCancelled? true: false;
        // this.storedDataService.showCompleted = this.storedDataService.showCompleted? true:false;
        this.storedDataService.showScheduled = true;
        // this.storedDataService.showNoShow = false;

    }

    onComponentLoad() {

        this.OnComponentLoadSubscription=this.storedDataService.currentOffice.subscribe(office => {

            if (this.storedDataService.officeId != undefined) {
                this.appointmentServicesData = this.dashboardService.getAppoitnmentTypesData();
                this.resourcesData = this.service.getResources();
                this.fetchTilesandDonutCount();

            }
        });

    }

    ngOnDestroy() {
        this.OnComponentLoadSubscription.unsubscribe();
    }
    viewAppointmentsScheduled(appointmentType: string) {
        this.globalDataService.IsUpComingTab = false;
        this.storedDataService.showScheduled = !this.storedDataService.showScheduled;
        this.storedDataService.paramSubValue = this.storedDataService.paramSubValue + 1;
        if (this.checkIfTodaysTabClicked()) {
            this.router.navigate([`dashboard/viewappointments/${this.storedDataService.paramSubValue}`]);
        }
    }

    viewAppointmentsCancelled(appointmentType: string) {
        this.globalDataService.IsUpComingTab = false;
        this.storedDataService.showCancelled = !this.storedDataService.showCancelled;
        this.storedDataService.paramSubValue = this.storedDataService.paramSubValue + 1;
        if (this.checkIfTodaysTabClicked()) {
            this.router.navigate([`dashboard/viewappointments/${this.storedDataService.paramSubValue}`]);
        }
    }

    viewAppointmentsCompleted(appointmentType: string) {
        this.globalDataService.IsUpComingTab = false;
        this.storedDataService.showCompleted = !this.storedDataService.showCompleted;
        this.storedDataService.paramSubValue = this.storedDataService.paramSubValue + 1;
        if (this.checkIfTodaysTabClicked()) {
            this.router.navigate([`dashboard/viewappointments/${this.storedDataService.paramSubValue}`]);
        }
    }

    viewAvailableAppointments(appointmentType: string) {
        this.globalDataService.IsUpComingTab = false;
        this.storedDataService.showAvailable = !this.storedDataService.showAvailable;
        this.storedDataService.paramSubValue = this.storedDataService.paramSubValue + 1;
        if (this.checkIfTodaysTabClicked()) {
            this.router.navigate([`dashboard/viewappointments/${this.storedDataService.paramSubValue}`]);
        }

    }

    viewAppointmentsNoShow(appointmentType: string) {
        this.globalDataService.IsUpComingTab = false;
        this.storedDataService.showNoShow = !this.storedDataService.showNoShow;
        this.storedDataService.paramSubValue = this.storedDataService.paramSubValue + 1;
        if (this.checkIfTodaysTabClicked()) {
            this.router.navigate([`dashboard/viewappointments/${this.storedDataService.paramSubValue}`]);
        }
    }


    configureOffice() {
        this.router.navigate([`/configureOffice`]);
    }


    ngOnInit() {
        this.onComponentLoad();
        this.storedDataService.paramSubValue = this.storedDataService.paramSubValue;
        this.router.navigate([`dashboard/viewappointments/${this.storedDataService.paramSubValue}`]);
        this.storedDataService.getSelecteddatetext();


    }



    CreateNewAppointment() {
        if (window.innerWidth > 769) {
            this.popupVisible = true;
        }
        else
        {
            this.data.storage = {
                'selectedDateTimeSlote': { AppointmentSerivces: this.storedDataService ? this.storedDataService.globalAppointmentTypes:[] },
            };
            this.router.navigate(['/mobile-view', 'create']);
        }
    }

    closeEditAppointment(event: any): void {
        this.popupVisible = false;
    }

    editAppointment(customer: any) {
        this.popupVisible = true;
    }



    fetchTilesandDonutCount() {
        if (this.storedDataService.officeId == undefined)
            return;

        if (this.globalDataService.IsUpComingTab || this.globalDataService.IsTodaysTab)
        { this.globalDataService.schedulerCurrentDate = new Date(); }

        if (this.globalDataService.currentView == 'day')
            this.getFirstLastDayOfDay(this.storedDataService.schedulerCurrentDate);
        else if (this.globalDataService.currentView == 'week')
            this.getFirstLastDayOfWeek(this.storedDataService.schedulerCurrentDate);
        else if (this.globalDataService.currentView == 'month')
            this.getFirstLastDayOfmonth(this.storedDataService.schedulerCurrentDate);

        if (!(!(window.innerWidth > 769) && this.globalDataService.IsSloteSelection)) {
            this.service.getDashboardDetailsByOfficeId(this.globalDataService.officeId, this.globalDataService.currentView, this.startDate, this.endDate).subscribe(result => {
                //Sets Tiles  count 
                this.globalDataService.poppulateDashboardTileCounts(result);

                //Sets Donut count 
                if (this.globalDataService.currentView == 'week') {
                    this.storedDataService.weeksDashboardData = result;
                    this.setWeekStaticsChart();
                }
            }, err => { });
        }

    }

    customizeLabel(point: any) {
        return point.argumentText + ": " + point.valueText;
    }

    getScheduledStyles() {
        let scheduledStyles = {
            'background-color': this.storedDataService.showScheduled ? '#9195e6' : '#9095e6',
            'border': this.storedDataService.showScheduled ? 'double' : 'outset',
            'border-width': this.storedDataService.showScheduled ? '3px' : 'unset',
        };
        return scheduledStyles;
    }

    getCompletedStyles() {
        let completedStyles = {
            'background-color': this.storedDataService.showCompleted ? '#9acafc' : '#9acafb',
            'border': this.storedDataService.showCompleted ? 'double' : 'outset',
            'border-width': this.storedDataService.showCompleted ? '3px' : 'unset',
        };
        return completedStyles;
    }

    getAvailableStyles() {
        let availableStyles = {
            'background-color': this.storedDataService.showAvailable ? '#fad796' : '#fad797',
            'border': this.storedDataService.showAvailable ? 'double' : 'outset',
            'border-width': this.storedDataService.showAvailable ? '3px' : 'unset',
        };
        return availableStyles;
    }

    getCancelledStyles() {
        let cancelledStyles = {
            'background-color': this.storedDataService.showCancelled ? '#eda999' : '#edaa9a',
            'border': this.storedDataService.showCancelled ? 'double' : 'outset',
            'border-width': this.storedDataService.showCancelled ? '3px' : 'unset',
        };
        return cancelledStyles;
    }

    getNoShowStyles() {
        let cancelledStyles = {
            'background-color': this.storedDataService.showNoShow ? '#636e72' : '#636e72',
            'border': this.storedDataService.showNoShow ? 'double' : 'outset',
            'border-width': this.storedDataService.showCancelled ? '3px' : 'unset',
        };
        return cancelledStyles;
    }



    getCount(): number {
        if (this.storedDataService.items == undefined)
            return;
        let count = 0;
        for (let i = 0; i <= this.storedDataService.items.length - 1; i++) {
            count = count + this.storedDataService.items[i].count;
        }
        return count;
    }

    getPerimeter(radius: number): number {
        if (this.storedDataService.items == undefined)
            return;
        return Math.PI * 2 * radius;
    }

    getColor(index: number): string {
        if (this.storedDataService.items == undefined)
            return;
        return this.storedDataService.items[index].color;
    }

    getOffset(radius: number, index: number): number {
        if (this.storedDataService.items == undefined)
            return;

        var percent = 0;
        for (var i = 0; i < index; i++) {
            percent += ((this.storedDataService.items[i].count) / this.storedDataService.total);
        }
        var perimeter = Math.PI * 2 * radius;
        return perimeter * percent;
    }

    getDayCount() {
        if (this.storedDataService.officeId == undefined)
            return;

        this.currentDate = this.storedDataService.schedulerCurrentDate;
        this.startDate = this.currentDate.getMonth() + 1 + '/' + this.currentDate.getDate() + '/' + this.currentDate.getFullYear();
        this.endDate = this.storedDataService.schedulerCurrentDate.getMonth() + 1 + '/' + this.storedDataService.schedulerCurrentDate.getDate() + '/' + this.storedDataService.schedulerCurrentDate.getFullYear();

        this.service.getDashboardDetailsByOfficeId(this.storedDataService.officeId, 'day', this.startDate, this.endDate).subscribe(result => {

            result.forEach(data => {
                if (data.ScheduleType == "Scheduled")
                    this.storedDataService.scheduledCountToday = data.Slots;
                if (data.ScheduleType == "Completed")
                    this.storedDataService.completedCountToday = data.Slots;
                if (data.ScheduleType == "Cancelled")
                    this.storedDataService.cancelledCountToday = data.Slots;
                if (data.ScheduleType == "NoShow")
                    this.storedDataService.noShowCountToday = data.Slots;
                if (data.ScheduleType == "Available")
                    this.storedDataService.availableCountToday = data.Slots;
            })
        }, err => { this.spinner.hide() });
    }

    getWeekCount() {
        if (this.storedDataService.officeId == undefined)
            return;

        let date: Date = new Date(this.storedDataService.schedulerCurrentDate);

        this.getFirstLastDayOfWeek(date);

        this.service.getDashboardDetailsByOfficeId(this.storedDataService.officeId, 'week', this.startDate, this.endDate).subscribe(result => {

            this.storedDataService.weeksDashboardData = result;
            this.setWeekStaticsChart();


        }, err => { this.spinner.hide() });

    }

    setWeekStaticsChart() {
        if (this.storedDataService.items != undefined && this.storedDataService.items.length > 0) {
            this.storedDataService.items.length = 0;
        }
        this.storedDataService.total = 0;
        this.storedDataService.items =
            [{ name: 'Cancelled', count: 0, color: '#eda999', id: 0 },
            { name: 'Completed', count: 0, color: '#9acafc', id: 0 },
            { name: 'Scheduled', count: 0, color: '#9195e6', id: 0 },
            { name: 'No Show', count: 0, color: '#636e72', id: 0 },
            { name: 'Available', count: 0, color: '#fad796', id: 0 }];

        this.storedDataService.weeksDashboardData.forEach(data => {
            this.storedDataService.items.find(iitem => iitem.name == data.ScheduleType).count = data.Slots;
        })

        if (this.storedDataService.items != undefined && this.storedDataService.items.length > 0) {
            this.storedDataService.total = this.getCount();
            //this.storedDataService.items.map(a => a.count).reduce((x, y) => x + y);
        }
        this.storedDataService.loadd3donut();
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


    getFirstLastDayOfDay(evt: any) {
        this.startDate = evt.getMonth() + 1 + '/' + evt.getDate() + '/' + evt.getFullYear();
        this.endDate = this.startDate;
    }

    onclickShowMobileTab(event) {
        this.showMobileTab = event;
        if (event == 'today') {
            this.showMobileTabToday = true;
            this.showMobileTabUpcoming = false;
            this.globalDataService.IsUpComingTab = false;
            this.globalDataService.IsTodaysTab = true;
        }
        else if (event == 'upcoming') {
            this.showMobileTabUpcoming = true;
            this.showMobileTabToday = false;
            this.globalDataService.IsUpComingTab = true;
            this.globalDataService.IsTodaysTab = false;
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth > 769) {
            this.showMobileTabUpcoming = true;
            this.showMobileTabToday = true;
        }
        else {
            this.showMobileTab = 'upcomig';
            this.showMobileTabUpcoming = true;
            this.showMobileTabToday = false;
        }

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.popupWeight = event.target.innerWidth - (event.target.innerWidth * 0.2);
            this.popupHeight = event.target.innerHeight - (event.target.innerHeight * 0.2);
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
        }
    }

    // To resolve the console error when clicked on tiles and default tab selected is Todays in the mobile view.
    checkIfTodaysTabClicked() {
        if (!(window.innerWidth > 769) && this.showMobileTab == 'today') {
            return false;
        }
        else {
            return true;
        }
    }

    popupWidth() {
        setTimeout(() => {
            if (window.innerWidth > 769) {
                this.showMobileTabUpcoming = true;
                this.showMobileTabToday = true;
            }
            else {
                this.showMobileTab = 'upcoming';
                this.showMobileTabUpcoming = true;
                this.showMobileTabToday = false;
            }
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

            }

            if (this.storedDataService.showAvailable) {

                this.onclickShowMobileTab('upcoming');
                this.globalDataService.IsUpComingTab = false;
            }
        }, 0);
    }

    ngAfterViewInit() {
        this.popupWidth();
    };

}
