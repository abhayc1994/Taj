import { Injectable } from "@angular/core";
import { CustomerDetails } from '../viewmodels/customerdetails.model';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CustomerAppointmentDetailsModel, AppointmentType } from "../viewmodels/office.model";
import { DashboardData } from "src/app/services/appointments.services";
var d3 = window['d3'];

@Injectable()
export class GlobalDataService {
    officeId: string;
    entityOfficeEmail: string;
    entityId: string;
    officeBrand: boolean;
    customerDetailsfromCMC: CustomerDetails;
    CMCData: any[];
    weeksDashboardData: DashboardData[];
    cutomerDetails: CustomerDetails;
    customerAppoitmentDetail: CustomerAppointmentDetailsModel;
    showScheduled: boolean = false;
    showAvailable: boolean = false;
    showCompleted: boolean = false;
    showCancelled: boolean = false;
    showNoShow: boolean = false;
    scheduledCountToday: number = 0;
    availableCountToday: number = 0;
    noShowCountToday: number = 0;
    completedCountToday: number = 0;
    cancelledCountToday: number = 0;
    scheduledCountWeek: number = 0;
    availableCountWeek: number = 0;
    completedCountWeek: number = 0;
    cancelledCountWeek: number = 0;
    schedulerCurrentDate: any = new Date();
    schedulerCurrentDateCal: Date = new Date();
    availableSlotsData: CustomerAppointmentDetailsModel[];
    globalAppointmentTypes: any[];
    NavigatarText: string;
    paramSubValue: number = 2;
    hideDiv: boolean= false;
    monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    isOfficeHoursUpdated: boolean = false;
    /** Template reference to the canvas element */
    items: Array<{ name: string, count: number, color: string, id: number }>;
    total: number = 0;
    IsSloteSelection: boolean = false;
    currentView: string = 'week';
    IsUpComingTab: boolean = false;
    IsTodaysTab: boolean = false;
    OfficeTimeZoneOffset: number;
    currentLocation: any;
    IsFromSchedulerCell: boolean = false;
    startDayHour: number = 7;
    endDayHour: number = 21;
    stateCode: string = "";
    customerAppoitmentDetailDirty: { AppointmentSerivces: any[], Email: string, AppointmentNote: string, Phone: string, TextOptIn: boolean, EmailOptIn: boolean, SpanishOptIn:boolean };


    private officeSource = new BehaviorSubject('default office');

    currentOffice = this.officeSource.asObservable();

    changeOffice(officeId: string) {
        this.officeSource.next(officeId);
    }

    

    ReviveDateTime(value: any): any {
        if (typeof value === 'string') {
            let a = /\/Date\((\d*)\)\//.exec(value);
            if (a) {
                return new Date(+a[1]);
            }
        }

        return value;
    }

    getSelecteddatetext() {
        // let date: Date = new Date(this.storedDataService.schedulerCurrentDate);
        var dt = this.schedulerCurrentDate;  //current date of week
        var currentWeekDay = dt.getDay();
        var lessDays = currentWeekDay
        var wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
        var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));       
        this.NavigatarText = '('+wkStart.getDate() + ' ' + (wkStart.getMonth() != wkEnd.getMonth() ? this.monthNames[wkStart.getMonth()] : '') + '-' + wkEnd.getDate() + ' ' + (this.monthNames[wkEnd.getMonth()]) + ')' + ' ' + wkStart.getFullYear()       
    }    

    loadd3donut() {
        var w = 200,
            h = 200,
            r = 75,
            inner = 40,
            color = d3.scale.category20c();

        var data = []
        this.items.forEach(function (value) {
            data.push({ 'label': value.name, 'value': value.count, 'color': value.color })
        });


        //var data = [{ "label": "ONE", "value": 194 },
        //{ "label": "TWO", "value": 567 },
        //{ "label": "THREE", "value": 1314 },
        //{ "label": "FOUR", "value": 793 },
        //{ "label": "FIVE", "value": 1929 },
        //{ "label": "SIX", "value": 1383 }];

        var total = d3.sum(data, function (d) {
            return d3.sum(d3.values(d));
        });
        d3.select("svg").remove();
        var vis = d3.select("#chart")
            .append("svg:svg")
            .data([data])
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(" + r * 1.1 + "," + r * 1.1 + ")")

        var textTop = vis.append("text")
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .attr("class", "textTop")
            .text("Total")
            .attr("y", -10),
            textBottom = vis.append("text")
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .attr("class", "textBottom")
                .text(total)
                .attr("y", 10);

        var arc = d3.svg.arc()
            .innerRadius(inner)
            .outerRadius(r);

        var arcOver = d3.svg.arc()
            .innerRadius(inner + 5)
            .outerRadius(r + 5);

        var pie = d3.layout.pie()
            .value(function (d) { return d.value; });

        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice")
            .on("mouseover", function (d) {
                d3.select(this).select("path").transition()
                    .duration(200)
                    .attr("d", arcOver)

                textTop.text(d3.select(this).datum().data.label)
                    .attr("y", -10);
                textBottom.text(d3.select(this).datum().data.value)
                    .attr("y", 10);
            })
            .on("mouseout", function (d) {
                d3.select(this).select("path").transition()
                    .duration(100)
                    .attr("d", arc);

                textTop.text("Total")
                    .attr("y", -10);
                textBottom.text(total);
            });

        arcs.append("svg:path")
            .attr("fill", function (d, i) {
                if (true) {
                    return d.data.color;
                }
            })
            .attr("d", arc);

        //var legend = d3.select("#chart").append("svg")
        //    .attr("class", "legend")
        //    .attr("width", r)
        //    .attr("height", r * 2)
        //    .selectAll("g")
        //    .data(data)
        //    .enter().append("g")
        //    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        //legend.append("rect")
        //    .attr("width", 18)
        //    .attr("height", 18)
        //    .style("fill", function (d, i) { return color(i); });

        //legend.append("text")
        //    .attr("x", 24)
        //    .attr("y", 9)
        //    .attr("dy", ".35em")
        //    .text(function (d) { return d.label; });
    }

    poppulateDashboardTileCounts(result: DashboardData[]) {
        this.scheduledCountToday = 0;
        this.completedCountToday = 0;
        this.cancelledCountToday = 0;
        this.noShowCountToday = 0;
        this.availableCountToday = 0;

        result.forEach(data => {
            if (data.ScheduleType == "Scheduled")
                this.scheduledCountToday = data.Slots;
            if (data.ScheduleType == "Completed")
                this.completedCountToday = data.Slots;
            if (data.ScheduleType == "Cancelled")
                this.cancelledCountToday = data.Slots;
            if (data.ScheduleType == "No Show")
                this.noShowCountToday = data.Slots;
            if (data.ScheduleType == "Available")
                this.availableCountToday = data.Slots;
        })

    }
}