import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { Data } from '../services/data-share.service';
import { CreateAppointment } from '../createappointment/createappointment.component';
import {GlobalDataService } from '../services/globaldataservice';

@Component({
  selector: 'app-mobile-view',
  templateUrl: './mobile-view.component.html',
  styleUrls: ['./mobile-view.component.css']
})
export class MobileViewComponent implements OnInit {
  viewType: any='';
  selectedDateTimeSlote: any;

  @ViewChild(CreateAppointment) appointment: CreateAppointment;

  constructor(private router: Router,private activatedRoute: ActivatedRoute, private data:Data,private globalDataservice:GlobalDataService) { }
  

  ngOnInit() {
    this.activatedRoute.params.subscribe((params)=>{
      this.viewType = params.viewType;
      if(this.viewType == 'edit'){
        this.setEditData();
      }
      else if (this.viewType == 'create') {
          this.setCreateData();
      }
    });

    

  }

    setEditData() {
    if(this.data.storage && this.data.storage['selectedDateTimeSlote']){
      this.selectedDateTimeSlote = this.data.storage['selectedDateTimeSlote'];
    }else if(this.viewType == 'edit'){
    this.router.navigate(['/']);

    }
  }
    setCreateData() {
        if (this.data.storage && this.data.storage['selectedDateTimeSlote']) {
           
         
        } else if (this.viewType == 'create') {
           // this.router.navigate(['/']);

        }
    }
  selectSlot(){
    this.appointment.selectSlote();
  }

    onBackClick() {        
       //added to fix the issue that raised while  clicking on back arrow button -mobileView
        //disposing the object upon clicking on back arrow button -mobileView
        this.data.storage =
            {
            'selectedDateTimeSlote': {}
            };
        this.globalDataservice.IsSloteSelection = false;
    this.router.navigate(['/']);
    }

    onBackArrowClick() {
        this.data.storage =
            {
                'selectedDateTimeSlote': {}
            };
        this.globalDataservice.IsSloteSelection = false;
        this.router.navigate(['/']);
    }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
          if (window.innerWidth > 769) {
            this.router.navigate(['/']);  
          }
  } 

}
