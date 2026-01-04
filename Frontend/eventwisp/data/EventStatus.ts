interface EventStatus {
    id: number;
    status: string;
}

const eventStatusData: EventStatus[] = [
    { id: 1, status: "Completed" },
    { id: 2, status: "On Going" },
    { id: 3, status: "Disapproved" },
    { id: 4, status: "Approved" },
    { id: 5, status: "Pending Approval" }
];

export default eventStatusData;