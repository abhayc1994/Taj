import { CustomerDetails } from "./customerdetails.model";

export class OfficeDetails {
    OfficeId: string;
    EntityId: number;
    OfficeName: string;
    Address1: string;
    Address2: string;
    StateProvince: string;
    City: string;
    Zip: string;
    SiempreBrandIndicator: boolean;
    EntityOfficeEmail: string;
    TimeZoneOffset: number;
}

export class AppointmentType {
    item_id?: number;
    item_text?: string;
    HashColorCode?: string;
}

export class ReqPreparer {
    ReqPraparerId: number;
    ReqPraparerName: string;
}

export class EntityDetials {
    EntityId: number;
    EntityName: string;
}

export class EntityOfficeDetails {
    Entities: EntityDetials[];
    Offices: string[];
    EntityId: string;
}

export class WeekModel {
    DayOrder: number;
    DayOftheWeek: string;
}



export class OfficeOperationHoursModel {
    OfficeId: string;
    DayOrder: number;
    MorningOpenTime: string;
    MorningCloseTime: string;
    EveningOpenTime: string;
    EveningCloseTime: string;
    MorningPersonnelCount: number;
    EveningPersonnelCount: number;
    HasOfficeAppointmentConfiguredHourly: boolean;
    HasEveningOfficeAppointmentConfiguredHourly: boolean;
    IsEnabled?: boolean=false;
}


export class CustomerAppointmentDetailsSearchModel {
    ErrorMessage?: string;
    CustomerAppointmentDetails?: CustomerAppointmentDetailsModel[];

}

export class CustomerAppointmentDetailsModel {
    CustomerAppointmentDetailsId?: number;
    OfficeId?: string;
    EntityId?: string;
    OfficeAppointmentId?: number;
    AppointmentStatusId?: number;
    AppointmentStatus?: string;
    startDate?: Date;
    endDate?: Date;
    CustomerDetails?: CustomerDetails;
    AppointmentSerivces?: any[];
    AppointmentCreatorTypeId?: number;
    CreatedDateTime?: Date;
    ConfirmationNumber?: string;
    Message?: string;
    Comments?: string;
    selectedServiceType?: boolean = false;
    IsSpanishLanguage?: boolean = false;
    endDateString?: string;
    startDateString?: string;
}

export class AppointmentServicesModel {
    AppointmentServicesId?: number;
    CustomerAppointmentId?: number;
    AppointmentTypeId?: number;
    AppointmentType?: string;
    HashColorCode?: string;
    Label: string;
}

export class CalendarAppointmentModel {
    CustomerAppointmentDetails?: CustomerAppointmentDetailsModel[];
    AuxilaryBusinessServices?: AppointmentServicesModel[];
}


