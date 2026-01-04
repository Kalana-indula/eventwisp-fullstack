'use client'

import React from 'react'
import {CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface StatData {
    name: string;
    uv: number;
    pv: number;
    amt: number;
}

interface MonthlyEarningsChartProps {
    data?: StatData[];
    selectedYear?: string;
    organizerId?: string;
}

const defaultData: StatData[] = [
    {
        "name": "Jan",
        "uv": 4000,
        "pv": 2400,
        "amt": 2400
    },
    {
        "name": "Feb",
        "uv": 3000,
        "pv": 1398,
        "amt": 2210
    },
    {
        "name": "Mar",
        "uv": 2000,
        "pv": 9800,
        "amt": 2290
    },
    {
        "name": "Apr",
        "uv": 2780,
        "pv": 3908,
        "amt": 2000
    },
    {
        "name": "May",
        "uv": 1890,
        "pv": 4800,
        "amt": 2181
    },
    {
        "name": "Jun",
        "uv": 2390,
        "pv": 3800,
        "amt": 2500
    },
    {
        "name": "Jul",
        "uv": 3490,
        "pv": 4300,
        "amt": 2100
    },
    {
        "name": "Aug",
        "uv": 3200,
        "pv": 4100,
        "amt": 2300
    },
    {
        "name": "Sep",
        "uv": 3800,
        "pv": 4500,
        "amt": 2600
    },
    {
        "name": "Oct",
        "uv": 4200,
        "pv": 4800,
        "amt": 2800
    },
    {
        "name": "Nov",
        "uv": 4500,
        "pv": 5200,
        "amt": 3000
    },
    {
        "name": "Dec",
        "uv": 4800,
        "pv": 5500,
        "amt": 3200
    }
];

const MonthlyEarningsChart: React.FC<MonthlyEarningsChartProps> = ({
                                                                       data = defaultData,
                                                                       selectedYear,
                                                                       organizerId
                                                                   }) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                        dataKey="name"
                        tick={{fontSize: 12}}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{fontSize: 12}}
                        width={70}
                    />
                    <Tooltip
                        contentStyle={{
                            fontSize: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        formatter={(value, name) => [
                            `LKR ${Number(value).toLocaleString()}`,
                            'Earnings'
                        ]}
                        labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend
                        wrapperStyle={{fontSize: '12px'}}
                    />
                    <Line
                        type="monotone"
                        dataKey="pv"
                        stroke="#193cb8"
                        strokeWidth={3}
                        dot={{ fill: '#193cb8', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#193cb8', strokeWidth: 2 }}
                        name="Monthly Earnings"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MonthlyEarningsChart