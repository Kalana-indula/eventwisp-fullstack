export interface EventDetails {
    eventId: number;
    generatedId: string;
    eventName: string;
    eventType: string;
    organizer: string;
    organizerId?: number | null;
    dateAdded: string;
    startingDate?: string | null;
    dateCompleted?: string | null;
    coverImageLink?: string | null;
    eventDescription?: string | null;
    isApproved?: boolean;
    isPublished?:boolean;
    status?: string;
    earningsByEvent ?:number;
    totalProfit ?:number;
    commission ?:number;
    totalAttendeesCount ?:number;
}

export interface EventStatus {
    isApproved: boolean;
    isDisapproved: boolean;
    isStarted: boolean;
    isCompleted: boolean;
}

export interface SessionDetails {
    sessionId: number;
    sessionNumber: number;
    venue: string;
    date: string;
    startingTime: string;
    endingTime: string;
    status: string;
}

export interface Session {
    id:number;
    sessionNumber:string;
    venue:string;
    date:string;
    startTime:string;
    endTime:string;
    attendees:number;
    revenue:number;
    profit:number;
}

export interface OrganizerDetails {
    id: number;
    organizerId:string;
    name: string;
    nic: string;
    companyName ?:string;
    email: string;
    password ?: string;
    phone: string;
    pendingApproval: boolean;
    isApproved: boolean;
    isDisapproved: boolean;
    activeEventsCount:number;

}

export interface ManagerDetails {
    id: number;
    firstName: string;
    lastName: string;
    nic: string;
    phone: string;
    email: string;
    password: string;
    userRole: "MANAGER";
    isAssigned: boolean;
    statusUpdateDate: string;
}

export interface OrganizerStatus {
    pendingApproval:boolean;
    isApproved:boolean;
    isDisapproved:boolean;
}

export interface SessionCardDetails {
    sessionId:number;
    sessionName:string;
    date:string;
    time:string;
    location:string;
    onBookNow:()=>void;
}

export interface CategoryDetails {
    id: number;
    category: string;
}

export interface TicketDetails {
    id?: number;
    ticketType:string;
    ticketPrice:number;
    ticketCount:number;
    soldCount?:number;
}

export interface CreateEventBody {
    eventName: string;
    startingDate: string;
    coverImageLink: string|null;
    description: string;
    eventCategoryId: number;
    organizerId: number;
    tickets: TicketDetails[];
}

export interface CreateSessionBody {
    venue:string;
    date:string;
    startTime:string;
    endTime:string;
    eventId:number;
}

export interface OrganizerEarningDetails {
    id:number;
    organizerId: string;
    organizerName: string;
    totalEarnings: number;
    totalWithdrawals: number;
    currentBalance: number;
}


export interface CreateTransactionRequest {
    amount:number;
    organizerId:number;
}



export interface EventCategoryDetails {
    id:number;
    category:string;
}

export interface SessionCardDetails {
    sessionId: number;
    eventName: string;
    eventId: number;
    startingDate: string;
    eventAddedDate: string;
    startingTime: string;
    coverImageLink: string;
    location: string;
    categoryName: string;
    minTicketPrice: number;
}

export interface SessionTicketDetails {
    ticketId: number;
    sessionId: number;
    eventId: number;
    ticketType: string;
    ticketPrice:number;
    initialTicketCount: number;
    remainingTicketCount: number;
    soldTicketCount: number;
}

export interface EventParticipationDetails{
    sessionId:number;
    sessionNumber:string;
    ticketDetails:SessionTicketDetails[];
}

export interface TimeCountDown {
    days:number;
    hours:number;
    minutes:number;
    seconds:number;
}

export interface BookingDetails {
    bookingId:string;
    name:string;
    email:string;
    phone:string;
    nic:string;
}

export interface BookedTicketDetails {
    ticketId:number;
    ticketType:string;
    price:number;
    count:number;
}

export interface BookingData {
    ticketDetails:BookedTicketDetails[];
    eventName:string;
    totalPrice:number;
}

export interface BookingDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idNumber: string;
    sessionId: number;
    ticketIdList: number[];
}

//dto for register an organizer
export interface RegisterOrganizerDto {
    firstName: string;
    lastName: string;
    nic: string;
    companyName: string;
    phone: string;
    email: string;
    password: string;
}

export interface AddBankDetails {
    organizerId: number;
    bankName: string;
    accountHolderName: string;
    branchName: string;
    accountNumber: string;
}

export interface UpdateBankDetails {
    bankName: string;
    accountHolderName: string;
    branchName: string;
    accountNumber: string;
}

export interface MonthlyEarningDetails {
    id: number;
    monthNumber: number;
    monthName: string;
    year: number;
    totalEarnings: number;
    organizerId: number;
}

export interface TotalMonthlyEarningDetails {
    id: number;
    monthNumber: number;
    monthName: string;
    year: number;
    totalEarnings: number;
    organizerId: number;
}

export interface TransactionDetails {
    id: number;
    transactionId:string;
    amount: number;
    organizerId: number;
    organizerName: string;
    date: string;
    time: string;
    status:string;
}

export interface OrganizerLoginDetails {
    email: string;
    password: string;
}

export interface AdminFormData {
    firstName: string;
    lastName: string;
    nic: string;
    phone: string;
    email: string;
    password: string;
}

export interface AdminLoginDetails {
    email: string;
    password: string;
}

export interface AdminDetails {
    id: number;
    firstName: string;
    lastName: string;
    nic: string;
    phone: string;
    email: string;
    password: string;
    userRole: string;
}

// UpdatePasswordDto.ts
export interface UpdatePasswordDetails {
    currentPassword:string;
    newPassword: string;
}

// UpdateEmailDto.ts
export interface UpdateEmailDetails {
    email: string;
}

// UpdateContactDetailsDto.ts
export interface UpdateContactDetails {
    contactDetails: string;
}

export interface DeleteAccountDetails {
    email: string;
    password: string;
}

// confirmed booking details
export interface ConfirmedTicketDetails {
    ticketType:string;
    ticketCount:number;
}

export interface ConfirmedBookingDetails {
    bookingId:string;
    eventName:string;
    name:string;
    email:string;
    phone:string;
    nic:string;
    ticketDetails:ConfirmedTicketDetails[];
    ticketIssued:boolean;
    ticketIssuedDate:string;
    ticketIssuedTime:string;
}


