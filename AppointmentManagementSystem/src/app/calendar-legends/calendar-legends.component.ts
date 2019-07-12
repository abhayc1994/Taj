import { Component,OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OfficeDetails } from '../viewmodels/office.model';
import { OfficeDetailServices } from '../services/office.services';
import { GlobalDataService } from '../services/globaldataservice';
//import { AuthService } from '../../service/authservice';



@Component({
    selector: 'calendar-legends',
    templateUrl: './calendar-legends.component.html',
    styleUrls: ['./calendar-legends.component.css']
})
export class CalendarLegendComponent implements OnInit {
    constructor(private officeDetailServices: OfficeDetailServices, private globalDataservice: GlobalDataService) { }
    @Input() appointmentServicesLegends: any;
   
    officeDetails: OfficeDetails[];
    ngOnInit(): void {
      
    }    
}
