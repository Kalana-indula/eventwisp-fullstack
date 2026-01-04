// data/OrganizerEarnings.ts
interface OrganizerEarning {
    id: number;
    firstName: string;
    lastName: string;
    totalRevenue: number;
    totalProfit: number;
}

const earnings: OrganizerEarning[] = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        totalRevenue: 12500,
        totalProfit: 8750
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        totalRevenue: 18200,
        totalProfit: 12740
    },
    {
        id: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        totalRevenue: 9500,
        totalProfit: 6650
    },
    {
        id: 4,
        firstName: 'Emily',
        lastName: 'Williams',
        totalRevenue: 21500,
        totalProfit: 15050
    },
    {
        id: 5,
        firstName: 'David',
        lastName: 'Brown',
        totalRevenue: 7600,
        totalProfit: 5320
    }
];

export default earnings;