import { AppointmentServicesModel, CustomerAppointmentDetailsModel } from "./office.model";

export class DashboardAppointmentSlots {
    startDate?: Date;
    endDate?: Date;
    customerAppointmentDetailsList: CustomerAppointmentDetailsModel[];
    AppointmentServices: AppointmentServicesModel[];
    availableSlots: number;
    toggleId: number;
    isExpand: boolean = false;
}

