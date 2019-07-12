import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Service } from './services/appointments.services';
import { GlobalDataService } from './services/globaldataservice';
import { Router } from '@angular/router';
import { EntityDetials, OfficeDetails } from './viewmodels/office.model';
import { OfficeDetailServices } from './services/office.services';
import { UserAuthService } from './userAuth';
//import { registerPalette, currentPalette } from 'devextreme/viz/palette';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNullOrUndefined } from 'util';



@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    searchPopupHeight: number;
    searchPopupWidth: number;
    popupWeight: number;
    popupHeight: number;
    userContext: any = {};
    userName: '';
    isNavFromAMS: boolean = false;
    visibleAfterPageLoad: boolean = false;
    entityDetails: EntityDetials[];
    officeDetails: OfficeDetails[];
    officeIdsFromClaims: string[];
    selectedEntityId: string;
    selectedOfficeId: string;
    selectedOffice: OfficeDetails;
    //added for Mobile View Search Customer Toggle Issue
    /*divEntityShow: boolean = true;
    divOfficeShow: boolean = true;
    */


    content: string;
    updateContentTimer: number;
    scrollByContent = true;
    scrollByThumb = true;
    scrollbarMode: string;
    pullDown = false;
    noOfficeFound = false;
    searchPopupVisible: boolean = false;
    ConfigureOfficePopupVisible: boolean = false;
    officeMessage: string = 'Please select an office to continue.';
    entityAndOfficeMessage: string = 'Please select an entity and office to continue.'
    UserInfoMessgae: string='';
    i: number = 0;


    constructor(private officeDetailServices: OfficeDetailServices, private router: Router, public globalDataService: GlobalDataService, private service: Service, private userAuthService: UserAuthService, private spinner: NgxSpinnerService) {
        localStorage.setItem('userId', 'ent2009');
        this.isNavFromAMS = true;
        this.visibleAfterPageLoad = true;
    }
    ngOnInit(): void {
        localStorage.removeItem('userContext');
        this.userAuthService.userContextSet.subscribe(x => {
            this.userContext = this.userAuthService.getUserContext();
            if (this.userContext != undefined && this.userContext != null) {
                this.selectedEntityId = this.userContext.EntityId;
                this.userName = this.userContext.UserName;
                if (this.userContext.UserType != undefined && this.userContext.UserType != null && this.userContext.UserType == "Corporate") {
                    this.userAuthService.getEntities().subscribe(data => {
                        this.entityDetails = data;
                        this.selectedEntityId = this.entityDetails ? (this.entityDetails.length > 1 ? 'select' : this.entityDetails[0].EntityId.toString()) : null;
                        this.bindData();
                        if (this.entityDetails && this.entityDetails.length > 1) {
                            this.UserInfoMessgae = this.entityAndOfficeMessage;
                        }
                    });
                }
                else {
                    this.bindData();
                }
            }
        })

    }

    private maskDiv() {
        this.emptyTilesCalender();
        this.globalDataService.officeId = null;
        this.globalDataService.hideDiv = true;
        this.globalDataService.items = [];
        this.globalDataService.loadd3donut();
    }

    private bindData() {

        this.officeDetailServices.getAllOfficeDetails(this.selectedEntityId).subscribe(office => {
            if (isNullOrUndefined(office) || office.length == 0) {
                this.maskDiv();
                if (!isNullOrUndefined(this.officeDetails))
                    this.officeDetails.length = 0;
                this.noOfficeFound = true;
                this.selectedOfficeId = "noofficefound";
                if (this.userContext.UserType != "Corporate") {
                    this.UserInfoMessgae = '';
                }
            }
            else {
                this.officeDetails = office;
                this.globalDataService.entityId = this.selectedEntityId;
                this.selectedOfficeId = this.officeDetails.length > 1 ? 'select' : this.officeDetails[0].OfficeId;
                this.globalDataService.officeId = this.selectedOfficeId;
                if (this.officeDetails.length > 1) {
                    this.UserInfoMessgae = this.officeMessage;
                    this.maskDiv();
                }
                this.setCurrentofficeData();
                               
                this.officeDetailServices.getOfficeDateTime(this.globalDataService.OfficeTimeZoneOffset, this.globalDataService.stateCode).subscribe(dateRes => {
                    this.globalDataService.schedulerCurrentDate = new Date(dateRes.officeDateTime);
                    this.globalDataService.schedulerCurrentDateCal = new Date(dateRes.officeDateTime);
                    this.globalDataService.currentLocation = dateRes.TimeZoneId;
                    if (this.officeDetails.length == 1) {
                        this.onOfficeChange(this.globalDataService.officeId);
                        this.globalDataService.entityOfficeEmail = this.officeDetails[0].EntityOfficeEmail;                        
                    }
                })

                if (this.globalDataService.CMCData != undefined && this.globalDataService.CMCData.length > 0) {
                    this.isNavFromAMS = false;
                }
                this.selectedOfficeId = this.officeDetails.length > 1 ? 'select' : this.officeDetails[0].OfficeId;
            }
        }, error => {
            console.log(error);
        });
    }

    onEntitySelection(): void {
        if (this.selectedEntityId != undefined) {

            this.globalDataService.entityId = this.selectedEntityId;
            this.officeDetailServices.getAllOfficeDetails(this.selectedEntityId).subscribe(office => {
                if (isNullOrUndefined(office) || office.length == 0) {
                    this.noOfficeFound = true;
                    if (!isNullOrUndefined(this.officeDetails))
                        this.officeDetails.length = 0;
                    this.selectedOfficeId = "noofficefound";
                    this.maskDiv();

                }
                else {
                    this.noOfficeFound = false;
                    this.globalDataService.hideDiv = false;
                    this.officeDetails = office;


                    this.selectedOfficeId = this.officeDetails.length > 1 ? 'select' : this.officeDetails[0].OfficeId;

                    if (this.officeDetails.length == 1) {
                        this.onOfficeChange(this.officeDetails[0].OfficeId);                       
                    }
                    else {
                        this.UserInfoMessgae = this.officeMessage;
                        this.maskDiv();
                    }
                }
            }, error => console.log(error));
        }
    }

    private emptyTilesCalender() {

        this.globalDataService.scheduledCountToday = 0;
        this.globalDataService.completedCountToday = 0;
        this.globalDataService.cancelledCountToday = 0;
        this.globalDataService.availableCountToday = 0;
        this.globalDataService.availableSlotsData = [];
        this.globalDataService.total = 0;
        this.globalDataService.noShowCountToday = 0;
    }

    onOfficeChange(officeId: any): void {
        this.UserInfoMessgae = '';
        this.globalDataService.hideDiv = false;
        if (window.innerWidth > 769)
            this.globalDataService.currentView = 'week';
        else
            this.globalDataService.currentView = 'day';

        this.setCurrentofficeData();

        this.officeDetailServices.getOfficeDateTime(this.globalDataService.OfficeTimeZoneOffset, this.globalDataService.stateCode).subscribe(dateRes => {
            this.globalDataService.schedulerCurrentDate = new Date(dateRes.officeDateTime);
            this.globalDataService.schedulerCurrentDateCal = new Date(dateRes.officeDateTime);
            this.globalDataService.currentLocation = dateRes.TimeZoneId;

            this.globalDataService.officeId = officeId;
            if (this.globalDataService.officeId != undefined) {
                this.globalDataService.changeOffice(this.globalDataService.officeId);
            }

        })


        this.globalDataService.officeBrand = (this.officeDetails.find(item => item.OfficeId == officeId)) ?
            this.officeDetails.find(item => item.OfficeId == officeId).SiempreBrandIndicator : false;

        this.globalDataService.entityOfficeEmail = (this.officeDetails.find(item => item == officeId)) ?
            this.officeDetails.find(item => item == officeId).EntityOfficeEmail : '';

        this.officeDetailServices.getAuxBusinessServicesByOfficeId(officeId).subscribe(appType => {
            if (appType != undefined && appType != null) {
                this.globalDataService.globalAppointmentTypes = [];
                for (this.i = 0; this.i <= appType.length - 1; this.i++) {
                    this.globalDataService.globalAppointmentTypes.push({ AppointmentTypeId: appType[this.i].AppointmentTypeId, Label: appType[this.i].Label, HashColorCode: appType[this.i].HashColorCode });
                }
            }
        }, err => { console.log(err) })

    }

    private setCurrentofficeData() {
        this.selectedOffice = this.officeDetails.find(item => item.OfficeId == this.selectedOfficeId);
        if (isNullOrUndefined(this.selectedOffice)) {
            this.globalDataService.officeBrand = false;
            this.globalDataService.OfficeTimeZoneOffset = 0;
            this.globalDataService.stateCode = "";
        }
        else {
            this.globalDataService.officeBrand = this.selectedOffice.SiempreBrandIndicator;
            this.globalDataService.OfficeTimeZoneOffset = this.selectedOffice.TimeZoneOffset;
            this.globalDataService.stateCode = this.selectedOffice.StateProvince;
        }
    }

    searchCustomerAppointments() {
        //this.router.navigate(['/customerappointmentssearch']);


        if (window.innerWidth > 769) {
            this.searchPopupVisible = true;
        } else {
            //added for Mobile View Search Customer Toggle Issue
            /* this.divEntityShow = !this.divEntityShow;
             this.divOfficeShow = !this.divOfficeShow;
             */
            this.router.navigate(['/mobile-view', 'search']);
        }
    }
    configureOffice() {
        //this.router.navigate(['/configureOffice']);
        this.ConfigureOfficePopupVisible = true;
    }

    closeConfigureOfficePopup() {
        this.ConfigureOfficePopupVisible = false;
    }

    logoutClicked() {
        localStorage.removeItem('userId');
        localStorage.removeItem('userContext');
        this.userAuthService.logoutClicked();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
            this.popupHeight = window.innerHeight - (window.innerHeight * 0.2);
            this.searchPopupWidth = window.innerWidth - (window.innerWidth * 0.2);
            this.searchPopupHeight = window.innerHeight - (window.innerHeight * 0.2);
        }
        else {

            if (window.innerWidth > 769) {

                this.popupWeight = 980;
                this.popupHeight = 490;

                this.searchPopupHeight = 560;
                this.searchPopupWidth = 700;
            }
            else {
                this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
                this.popupHeight = window.innerHeight - (window.innerHeight * 0.2);
                this.searchPopupWidth = window.innerWidth - (window.innerWidth * 0.2);
                this.searchPopupHeight = window.innerHeight - (window.innerHeight * 0.2);
            }
        }
    }

    ngAfterViewInit() {

        setTimeout(() => {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
                this.popupHeight = window.innerHeight - (window.innerHeight * 0.2);
                this.searchPopupWidth = window.innerWidth - (window.innerWidth * 0.2);
                this.searchPopupHeight = window.innerHeight - (window.innerHeight * 0.2);
            }
            else {

                if (window.innerWidth > 769) {

                    this.popupWeight = 980;
                    this.popupHeight = 490;

                    this.searchPopupHeight = 560;
                    this.searchPopupWidth = 700;
                }
                else {
                    this.popupWeight = window.innerWidth - (window.innerWidth * 0.2);
                    this.popupHeight = window.innerHeight - (window.innerHeight * 0.2);
                    this.searchPopupWidth = window.innerWidth - (window.innerWidth * 0.2);
                    this.searchPopupHeight = window.innerHeight - (window.innerHeight * 0.2);
                }
            }
        });

    }
}
