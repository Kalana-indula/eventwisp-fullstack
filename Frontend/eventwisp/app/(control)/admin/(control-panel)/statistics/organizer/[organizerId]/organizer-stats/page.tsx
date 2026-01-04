'use client'

import React, {useEffect, useState} from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Button} from "@/components/ui/button";
import {IoDocumentTextOutline} from "react-icons/io5";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {useParams} from "next/navigation";
import {MonthlyEarningDetails} from "@/types/entityTypes";
import {downloadMonthlyPDF} from "@/lib/generateMonthlyReport";
import AdminProtectedRoute from "@/utils/AdminProtectedRoutes";

const Statistics = () => {

    //get user id from params
    const params = useParams();

    const organizerId = params.organizerId as string;

    //years
    const [years, setYears] = useState<number[]>([]);

    //selected year
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

    //monthly earnings
    const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarningDetails[]>([]);


    //useEffect to watch for selectedYear changes
    useEffect(() => {
        if (selectedYear && organizerId) {
            getMonthlyEarnings();
        }
    }, [selectedYear]);

    useEffect(() => {
        getYearsList();
        getMonthlyEarnings();
    }, []);

    // handler function for year selection
    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    //get event completion years list
    const getYearsList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/completed/years/organizers/${organizerId}`);
            console.log(response.data.entityList);
            setYears(response.data.entityList);
        } catch (err) {
            if (err instanceof AxiosError) {
                // Handle Axios-specific errors
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
                toast.error(errorMessage);
            } else if (err instanceof Error) {
                // Handle generic errors
                toast.error(err.message);
            } else {
                // Handle unknown errors
                toast.error('An unknown error occurred');
            }
        }
    }

    //get monthly earning details sorted by year
    const getMonthlyEarnings = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/monthly-earnings/organizers/${organizerId}/${selectedYear}`);

            console.log(response.data.entityList);
            setMonthlyEarnings(response.data.entityList);
        } catch (err) {
            if (err instanceof AxiosError) {
                // Handle Axios-specific errors
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
                toast.error(errorMessage);
            } else if (err instanceof Error) {
                // Handle generic errors
                toast.error(err.message);
            } else {
                // Handle unknown errors
                toast.error('An unknown error occurred');
            }
        }
    }

    return (
        <>
            <AdminProtectedRoute>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Statistics</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">Analyze Organizer Financial Statistics</p>
                    </div>
                </div>

                {/*    scrollable content*/}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white min-h-screen">
                    {/*sort section*/}
                    <div>
                        <div
                            className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                            <div>
                                <h3 className="text-gray-500 font-medium py-2">SORT</h3>
                            </div>
                            <div className="flex items-start flex-col sm:flex-row space-y-4 space-x-4">
                                <div>
                                    <Select value={selectedYear} onValueChange={handleYearChange}>
                                        <SelectTrigger className="w-[180px] bg-white shadow-lg">
                                            <SelectValue placeholder="Select Year"/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {years && years.map((year) => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*chart section*/}
                    <div>
                        <div
                            className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                            <div>
                                <h3 className="text-gray-500 font-medium py-2">ANNUAL FINANCIAL DATA</h3>
                            </div>

                            {/*chart*/}
                            <div className="bg-white p-2 sm:p-4 lg:p-6 rounded-md">
                                <div
                                    className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full overflow-hidden">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={monthlyEarnings}
                                            margin={{
                                                top: 5,
                                                right: 10,
                                                left: 10,
                                                bottom: 5
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis
                                                dataKey="monthName"
                                                tick={{fontSize: 11}}
                                                interval="preserveStartEnd"
                                                angle={-45}
                                                textAnchor="end"
                                                height={60}
                                                label={{
                                                    value: 'Month',
                                                    position: 'insideBottom',
                                                    offset: -10,
                                                    style: {fontSize: 12, textAnchor: 'middle'}
                                                }}
                                            />
                                            <YAxis
                                                tick={{fontSize: 11}}
                                                width={60}
                                                label={{
                                                    value: 'Amount (LKR)',
                                                    angle: -90,
                                                    position: 'insideLeft',
                                                    style: {fontSize: 12, textAnchor: 'middle'}
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    fontSize: '12px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="totalEarnings"
                                                name="Monthly Earnings (LKR)"
                                                stroke="#8884d8"
                                                strokeWidth={2}
                                                dot={{r: 3}}
                                                activeDot={{r: 5}}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*generate report*/}
                    <div className="flex justify-center">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer"
                            onClick={() => downloadMonthlyPDF(monthlyEarnings, organizerId, selectedYear)}
                        >
                            <IoDocumentTextOutline className="mr-2"/>
                            Generate Report
                        </Button>
                    </div>
                </div>
            </AdminProtectedRoute>
        </>
    )
}
export default Statistics;
