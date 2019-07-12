import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { Routes, RouterModule } from '@angular/router';
import { CommonModule, APP_BASE_HREF, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserAuthService } from "./userAuth";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { CreateAppointment } from './createappointment/createappointment.component';
import { CustomerDetailServices } from './services/customerdetail.services';
import { OfficeDetailServices } from './services/office.services';
import { CommonServices } from './services/common.services';
import { Appointment, Service } from './services/appointments.services';
import { ViewAppointments } from './viewappointments/viewappointment.component';
import { CalendarLegendComponent } from './calendar-legends/calendar-legends.component';
import { GlobalDataService } from './services/globaldataservice';
import { CustomerAppointmentsSearch } from './customer-appointments-search/customer-appointments-search.component';
import { OfficeConfigurationComponent } from './office-configuration/office-configuration.component';
import { Dashboard } from './dashboard/dashboard.component';
import { DashboardService } from './services/dashboardservices';
import { DashboardSidePanelComponent } from './dashboard-side-panel/dashboard-side-panel.component';
import { CapitalizeFirstPipe } from 'src/app/capitalizefirst.pipe';

import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxSchedulerModule } from 'devextreme-angular/ui/scheduler';
import { DxRadioGroupModule } from 'devextreme-angular/ui/radio-group';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTemplateModule } from 'devextreme-angular/core/template';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationSummaryModule } from 'devextreme-angular/ui/validation-summary';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxTooltipModule } from 'devextreme-angular/ui/tooltip';
import { RequestInterceptor } from './errorshandler';
import { MobileViewComponent } from './mobile-view/mobile-view.component';
import { Data } from './services/data-share.service';





const appRoutes: Routes = [
    {
        path: 'appointment',
        component: CreateAppointment
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'dashboard',
        component: Dashboard,
        children: [
            { path: 'viewappointments/:appointmentType', component: ViewAppointments }           
        ]
    },
    {
        path: 'viewappointments/:appointmentType',
        component: ViewAppointments
    },
    {
        path: 'customerappointmentssearch',
        component: CustomerAppointmentsSearch
    },
    
    {
        path: 'configureOffice',
        component: OfficeConfigurationComponent
    },
    {
        path: 'mobile-view/:viewType',
        component: MobileViewComponent
    }



];
@NgModule({
    imports: [BrowserModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        DxPopupModule,
        DxSchedulerModule,       
        DxRadioGroupModule,
        DxCheckBoxModule,
        DxButtonModule,
        DxTemplateModule,       
        DxTextBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxTextAreaModule,
        DxTooltipModule,
        NgxSpinnerModule,        
        NgMultiSelectDropDownModule.forRoot(),
        NgbModule.forRoot(),
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false } // <-- debugging purposes only
        ),
        ],
    declarations: [AppComponent, CreateAppointment, ViewAppointments, CalendarLegendComponent, OfficeConfigurationComponent, CustomerAppointmentsSearch, Dashboard, DashboardSidePanelComponent, CapitalizeFirstPipe, MobileViewComponent],
    bootstrap: [AppComponent],
    providers: [CustomerDetailServices, OfficeDetailServices, Appointment, Service, DatePipe, GlobalDataService, CommonServices, DashboardService, UserAuthService,Data,
        {
            provide: APP_INITIALIZER,
            useFactory: UserAuthServiceFactory,
            deps: [UserAuthService],
            multi: true
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptor,
            multi: true
        }]
})
export class AppModule { }

export function UserAuthServiceFactory(userAuthService: UserAuthService) {
    return () => userAuthService.loadUserAuthContext();
}
