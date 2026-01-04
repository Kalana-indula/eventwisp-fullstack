interface EventDetails {
    eventId: number;
    eventName: string;
    eventType: string;
    dateRequested: string;
    dateStarted: string;
    dateCompleted: string;
}

const eventData: EventDetails[] = [
    {
        eventId: 1,
        eventName: "Tech Conference 2023",
        eventType: "Conference",
        dateRequested: "2023-01-15",
        dateStarted: "2023-03-10",
        dateCompleted: "2023-03-12"
    },
    {
        eventId: 2,
        eventName: "Product Launch",
        eventType: "Marketing",
        dateRequested: "2023-02-01",
        dateStarted: "2023-04-15",
        dateCompleted: "2023-04-15"
    },
    {
        eventId: 3,
        eventName: "Team Building Workshop",
        eventType: "Internal",
        dateRequested: "2023-02-20",
        dateStarted: "2023-03-05",
        dateCompleted: "2023-03-05"
    },
    {
        eventId: 4,
        eventName: "Annual Charity Run",
        eventType: "Community",
        dateRequested: "2023-01-10",
        dateStarted: "2023-05-20",
        dateCompleted: "2023-05-20"
    },
    {
        eventId: 5,
        eventName: "System Maintenance",
        eventType: "IT",
        dateRequested: "2023-03-01",
        dateStarted: "2023-03-15",
        dateCompleted: "2023-03-16"
    },
    {
        eventId: 6,
        eventName: "New Employee Orientation",
        eventType: "HR",
        dateRequested: "2023-01-05",
        dateStarted: "2023-01-20",
        dateCompleted: "2023-01-20"
    },
    {
        eventId: 7,
        eventName: "Customer Training Session",
        eventType: "Training",
        dateRequested: "2023-02-15",
        dateStarted: "2023-04-01",
        dateCompleted: "2023-04-03"
    }
];

export default eventData;