interface EventStatusDetails {
    state:string;
    src:string;
    message:string;
}

const approvalStates:EventStatusDetails[] = [
    {
        state: "Pending Approval",
        src: "/pending-approval.png",
        message: "Pending Approval"
    },
    {
        state: "Approved",
        src: "/ok.png",
        message: "Approved"
    },
    {
        state: "Disapproved",
        src: "/disapproved-event.png",
        message: "Disapproved"
    },
    {
        state: "Completed",
        src: "/completed.png",
        message: "Completed"
    },
    {
        state: "On Going",
        src: "/on-going.png",
        message: "On Going"
    }
]

export default approvalStates;