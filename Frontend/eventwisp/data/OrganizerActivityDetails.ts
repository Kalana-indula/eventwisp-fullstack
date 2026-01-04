// data/OrganizerActivity.ts
interface OrganizerActivity {
    eventId: number;
    eventName: string;
    eventType: string;
    startedDate: string;
    totalRevenue: number;
    profit: number;
    commission: number;
}

const activities: OrganizerActivity[] = [
    {
        eventId: 101,
        eventName: 'Tech Conference 2023',
        eventType: 'Conference',
        startedDate: '2023-03-15',
        totalRevenue: 25000,
        profit: 17500,
        commission: 7500
    },
    {
        eventId: 102,
        eventName: 'Summer Music Festival',
        eventType: 'Festival',
        startedDate: '2023-06-20',
        totalRevenue: 180000,
        profit: 126000,
        commission: 54000
    },
    {
        eventId: 103,
        eventName: 'Business Networking',
        eventType: 'Networking',
        startedDate: '2023-02-10',
        totalRevenue: 12000,
        profit: 8400,
        commission: 3600
    },
    {
        eventId: 104,
        eventName: 'Charity Gala Dinner',
        eventType: 'Gala',
        startedDate: '2023-04-22',
        totalRevenue: 45000,
        profit: 31500,
        commission: 13500
    },
    {
        eventId: 105,
        eventName: 'Startup Pitch Competition',
        eventType: 'Competition',
        startedDate: '2023-05-05',
        totalRevenue: 32000,
        profit: 22400,
        commission: 9600
    },
    {
        eventId: 106,
        eventName: 'Art Exhibition',
        eventType: 'Exhibition',
        startedDate: '2023-01-18',
        totalRevenue: 28000,
        profit: 19600,
        commission: 8400
    },
    {
        eventId: 107,
        eventName: 'Food & Wine Tasting',
        eventType: 'Tasting',
        startedDate: '2023-07-12',
        totalRevenue: 38000,
        profit: 26600,
        commission: 11400
    },
    {
        eventId: 108,
        eventName: 'Marathon Run',
        eventType: 'Sports',
        startedDate: '2023-09-03',
        totalRevenue: 75000,
        profit: 52500,
        commission: 22500
    },
    {
        eventId: 109,
        eventName: 'Comedy Night',
        eventType: 'Entertainment',
        startedDate: '2023-08-14',
        totalRevenue: 22000,
        profit: 15400,
        commission: 6600
    },
    {
        eventId: 110,
        eventName: 'Science Fair',
        eventType: 'Educational',
        startedDate: '2023-10-05',
        totalRevenue: 15000,
        profit: 10500,
        commission: 4500
    }
];

export default activities;