interface SessionDetails {
    sessionNumber: number;
    venue: string;
    date: string;
    startingTime: string;
    endingTime: string;
}

const sessionData: SessionDetails[] = [
    {
        sessionNumber: 101,
        venue: "Grand Ballroom A",
        date: "2023-03-10",
        startingTime: "09:00",
        endingTime: "12:00"
    },
    {
        sessionNumber: 102,
        venue: "Conference Room 3B",
        date: "2023-04-15",
        startingTime: "14:00",
        endingTime: "17:30"
    },
    {
        sessionNumber: 103,
        venue: "Outdoor Pavilion",
        date: "2023-03-05",
        startingTime: "10:30",
        endingTime: "15:00"
    },
    {
        sessionNumber: 104,
        venue: "Main Auditorium",
        date: "2023-05-20",
        startingTime: "08:00",
        endingTime: "11:00"
    },
    {
        sessionNumber: 105,
        venue: "Training Center 2",
        date: "2023-03-15",
        startingTime: "13:00",
        endingTime: "16:00"
    },
    {
        sessionNumber: 106,
        venue: "Executive Boardroom",
        date: "2023-01-20",
        startingTime: "09:30",
        endingTime: "12:30"
    },
    {
        sessionNumber: 107,
        venue: "Virtual Meeting Room",
        date: "2023-04-01",
        startingTime: "11:00",
        endingTime: "13:00"
    },
    {
        sessionNumber: 108,
        venue: "Innovation Lab",
        date: "2023-03-11",
        startingTime: "10:00",
        endingTime: "14:00"
    },
    {
        sessionNumber: 109,
        venue: "Riverside Terrace",
        date: "2023-04-16",
        startingTime: "16:00",
        endingTime: "18:00"
    },
    {
        sessionNumber: 110,
        venue: "Grand Ballroom B",
        date: "2023-05-21",
        startingTime: "09:00",
        endingTime: "17:00"
    }
];

export default sessionData;