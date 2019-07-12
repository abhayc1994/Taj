import { AppointmentType } from "./office.model";

export class CustomerDetails {
    CustomerDetailsId?: number;
    CustomerKey?: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    TextOptIn: boolean; 
    TextOptInDBValue: boolean;
    EmailOptIn: boolean;
    EmailOptInDBValue: boolean;
    EntityOfficeEmail: string;
    AppointmentNote: string;
    Last4SSN : string
    CreatedBy: string; 
    ConfirmationNumber?: string;
}

