import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { OfficeDetails, WeekModel, OfficeOperationHoursModel } from '../viewmodels/office.model';
import { OfficeDetailServices } from '../services/office.services';
import { GlobalDataService } from '../services/globaldataservice';

import { NgxSpinnerService } from 'ngx-spinner';
import { DxRadioGroupComponent } from 'devextreme-angular/ui/radio-group';


@Component({
    selector: 'office-configuration',
    templateUrl: './office-configuration.component.html',
    styleUrls: ['./office-configuration.component.css']
})
export class OfficeConfigurationComponent implements OnInit {

    timeSloteRange: string[];
    selectedTimeSloteRange: string;
    
    selectedDay: string = '';
    isWeekConfigurationSelected: boolean = false;
    //now: Date = new Date('2002-04-26T09:00:00');
    officeDetails: OfficeDetails[];
    weekDetails: WeekModel[];
    officeOperationHoursData: OfficeOperationHoursModel[];
    configuredOfficeOperationHours: OfficeOperationHoursModel = {
        MorningCloseTime: '12:00', MorningPersonnelCount: 0, MorningOpenTime: '9:00', EveningCloseTime: '17:00', EveningOpenTime: '12:00', EveningPersonnelCount: 0, DayOrder: 0, HasOfficeAppointmentConfiguredHourly: false, HasEveningOfficeAppointmentConfiguredHourly:false, OfficeId: ''
    };
    operationHours: OfficeOperationHoursModel;
    selectedWeekDayConfiguration: WeekModel;
    personnelCount: string;
    errorMessage: string="";
    @ViewChild("eventRadioGroup") eventRadioGroup: DxRadioGroupComponent;
    @Output() closeSearchPopupCall = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private officeDetailServices: OfficeDetailServices, private globalDataService: GlobalDataService, private spinner: NgxSpinnerService) {

    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (event.type == "paste")
            return false;

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
       
        if (event.currentTarget.value + (event.key) > 99)
            return false;
        //if (event.currentTarget.value + (event.key) == "0") //
        //    return false;
        return true;

    }

    ngOnInit(): void {
        this.loadWeekConfiguration();
        this.getOfficeConfiguration();
        this.timeSloteRange = [
            "1 Hour",
            "30 Mins"
        ];

    }



    loadWeekConfiguration() {
        this.weekDetails = this.officeDetailServices.getOfficeWeekConfiguration();
    }
    getDay(DayOrder:any) {
            switch (DayOrder) {
                case 1:
                    return "Sunday";                    
                case 2:
                    return "Monday";
                case 3:
                    return "Tuesday";
                case 4:
                    return "Wednesday";
                case 5:
                    return "Thursday";
                case 6:
                    return "Friday";
                case 7:
                    return "Saturday";
            }
    }
    onDaySelect() {
        if (this.selectedDay != null) { this.isWeekConfigurationSelected = true; }

        let isSelectedDayConfigurationAvailable = false;
        this.officeOperationHoursData.forEach(configuredOperationHours => {
            if (configuredOperationHours.DayOrder == parseInt(this.selectedDay)) {
                this.configuredOfficeOperationHours = configuredOperationHours;
                isSelectedDayConfigurationAvailable = true;
            }
        })
        if (!isSelectedDayConfigurationAvailable) {
            this.pushNewDayOrderConfiguration(parseInt(this.selectedDay));
        }

        if (this.configuredOfficeOperationHours.HasOfficeAppointmentConfiguredHourly) {
            this.selectedTimeSloteRange = this.timeSloteRange[0];
        }
        else {
            this.selectedTimeSloteRange = this.timeSloteRange[1];
        }
        if (this.configuredOfficeOperationHours.HasEveningOfficeAppointmentConfiguredHourly) {
            this.selectedTimeSloteRange = this.timeSloteRange[0];
        }
        else {
            this.selectedTimeSloteRange = this.timeSloteRange[1];
        }
    }

    convertTime24to12(time24: any) {
        if (time24 == undefined || time24 == '')
            return;

        var tmpArr = time24.split(':'), time12;
        if (+tmpArr[0] == 12) {
            time12 = tmpArr[0] + ':' + tmpArr[1] + ' PM';
        } else {
            if (tmpArr[0] == '00') {
                time12 = '12:' + tmpArr[1] + ' AM';
            } else {
                if (+tmpArr[0] > 12) {
                    time12 = (+tmpArr[0] - 12) + ':' + tmpArr[1] + ' PM';
                } else {
                    time12 = (+tmpArr[0]) + ':' + tmpArr[1] + ' AM';
                }
            }
        }
        return time12;
    }

    pushNewDayOrderConfiguration(dayOrder: number) {
        //Setting default data if configuration does not exist
        let newConfigurationData: OfficeOperationHoursModel =
            {
                OfficeId: this.globalDataService.officeId,
                DayOrder: dayOrder,
                MorningOpenTime: "9:00",
                MorningCloseTime: "12:00",
                EveningOpenTime: "12:00",
                EveningCloseTime: "17:00",
                MorningPersonnelCount: 0,
                EveningPersonnelCount: 0,
                HasOfficeAppointmentConfiguredHourly: true,
                HasEveningOfficeAppointmentConfiguredHourly:true
            }
        this.configuredOfficeOperationHours = newConfigurationData;
    }

    onSlotTimeChange(e: any) {
        this.configuredOfficeOperationHours.HasOfficeAppointmentConfiguredHourly = !this.configuredOfficeOperationHours.HasOfficeAppointmentConfiguredHourly;
    }

    saveOfficeHoursConfiguration() {

        if (!this.validateOfficeConfiguration()) {
            this.errorMessage = 'Please Enter Preparers Count';
            return false;
        }
            
        
        this.officeDetailServices.updateOfficeOperationHoursConfiguration(this.officeOperationHoursData).subscribe(res => {
            this.globalDataService.isOfficeHoursUpdated = true;
            this.closeSearchPopupCall.next();
            this.spinner.hide()
            this.globalDataService.changeOffice(this.globalDataService.officeId);
            this.router.navigate(['dashboard/viewappointments/create']);
        }, error => {
            console.log(error)
            this.spinner.hide();
        });
    }

    validateOfficeConfiguration(): boolean {
        var res = true;
        this.officeOperationHoursData.forEach(item => {
            if (res) {
            if (item.EveningPersonnelCount.toString() == "")
            {
                res = false;
            }

            if (item.MorningPersonnelCount.toString() == "") {
                res = false;
                }
            }
        })
        return res;
    }


    getOfficeConfiguration() {
        
        this.officeDetailServices.getOfficeOperationHoursConfiguration(this.globalDataService.officeId).subscribe(res => {
            this.officeOperationHoursData = res;
            this.spinner.hide();
        }, error => {
            console.log(error)
            this.spinner.hide();
        });
    }
    back() {
        this.router.navigate([`/dashboard`]);
    }

}
