// organizer dashboard
'use client'

import React, {useEffect, useState} from 'react'
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend} from "recharts";
import {Button} from "@/components/ui/button";
import {IoDocumentTextOutline} from "react-icons/io5";
import {useParams, useRouter} from "next/navigation";
import axios, {AxiosError} from "axios";
import {handleApiError} from "@/lib/utils";
import {EventDetails, MonthlyEarningDetails} from "@/types/entityTypes";
import toast from "react-hot-toast";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {downloadMonthlyPDF} from "@/lib/generateMonthlyReport";
import {FileChartLine, FileText} from "lucide-react";
import ProtectedRoute from "@/utils/ProtectedRoutes";

const Page = () => {
    //get event count
    const [totalEvents, setTotalEvents] = useState<number>(0);
    const [totalEarnings, setTotalEarnings] = useState<number | string>(0);
    const [scheduledEvents, setScheduledEvents] = useState<number>(0);
    const [onGoingEvents, setOnGoingEvents] = useState<EventDetails[]>([]);
    const [years, setYears] = useState<number[]>([]);

    //selected year
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

    //monthly earnings
    const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarningDetails[]>([]);


    //get user id from params
    const params = useParams();

    const organizerId = params.organizerId as string;

    //configure navigation
    const route = useRouter();

    //route to login
    const routeToLogin = () => {
        route.push(`/organizer/auth/login`);
    }

    useEffect(() => {
        //     load all events at page reload
        //     getEventsList();
        getEventCounts();
        getEventsByOrganizer();
        getYearsList();
        getMonthlyEarnings();
    }, []);

    //useEffect to watch for selectedYear changes
    useEffect(() => {
        if (selectedYear && organizerId) {
            getMonthlyEarnings();
        }
    }, [selectedYear]);

    // handler function for year selection
    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    //format financial metrics
    const formatFinancialValues = (value: number) => {

        setTotalEarnings(value.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    }

    //handle unauthorized errors
    const handleUnauthorizedError = (err: unknown) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            toast.error("Session expired. Please log in again.");
            routeToLogin();
            return true; // handled
        }
        return false;
    };


    //fetch event counts
    const getEventCounts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizer/${organizerId}/events/counts`);
            setTotalEvents(response.data.allEventsCount);
            setScheduledEvents(response.data.approvedEventsCount);
        } catch (err) {

            if (handleUnauthorizedError(err)) return;

            handleApiError(err, "Failed to load events");
        }
    }

    //get monthly earning details sorted by year
    const getMonthlyEarnings = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/monthly-earnings/organizers/${organizerId}/${selectedYear}`);

            console.log(response.data.entityList);
            setMonthlyEarnings(response.data.entityList);
        } catch (err) {

            if(handleUnauthorizedError(err)) return;

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

    //fetch events by organizer
    const getEventsByOrganizer = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/events`);
            setOnGoingEvents(response.data.onGoingEvents);
            formatFinancialValues(response.data.totalEarnings);

        } catch (err) {

            if(handleUnauthorizedError(err)) return;

            handleApiError(err, "Failed to load events");
        }
    }

    //get event completion years list
    const getYearsList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/completed/years/organizers/${organizerId}`);
            console.log(response.data.entityList);
            setYears(response.data.entityList);
        } catch (err) {

            if(handleUnauthorizedError(err)) return;

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

    //route to all events
    const routeToAllEvents = (id: string) => {
        route.push(`/organizer/${id}/all-events`);
    }

    //route to add event
    const routeToAddEvent = () => {
        route.push(`/organizer/${organizerId}/add-event`);
    }

    //route to event dashboard
    const routeToEventDashboard = (eventId: number) => {
        route.push(`/organizer/${organizerId}/event/${eventId}/dashboard`);
    }

    return (
        <ProtectedRoute>
        <>
            {/*    header section*/}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm sm:text-base text-gray-600">Manage and control organizer actions</p>
                </div>
            </div>

            {/*    scrollable content*/}
            <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">

                {/*earnings and events count*/}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {/* Scheduled Events */}
                    <div className="bg-blue-600 text-white p-4 rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm opacity-90">Scheduled Events</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-semibold">{scheduledEvents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Events */}
                    <div className="bg-blue-600 text-white p-4 rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm opacity-90">Total Events</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-semibold">{totalEvents}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Earnings */}
                    <div className="bg-blue-600 text-white p-4 rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm opacity-90">Total Earnings</p>
                                <p className="text-xs opacity-75">(LKR)</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-semibold">{totalEarnings}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/*    chart section*/}
                <div
                    className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">

                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium py-2">ANNUAL FINANCIAL DATA</h3>
                        {/*drop down */}
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

                    {/*chart*/}
                    <div className="bg-white p-2 sm:p-4 lg:p-6 rounded-md">
                        {monthlyEarnings && monthlyEarnings.length > 0 ? (
                            <>
                                <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full">
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
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div
                                    className="w-16 h-16 bg-gray-100 rounded-full text-gray-700 flex items-center justify-center mb-4">
                                    <FileChartLine strokeWidth={1} size={40}/>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings data available</h3>
                                <p className="text-sm text-gray-500 text-center">There are currently no earnings records
                                    to display for {selectedYear}.</p>
                            </div>
                        )}
                    </div>

                    {/*    report generation button - only show when data is available*/}
                    {monthlyEarnings && monthlyEarnings.length > 0 && (
                        <div className="my-[20px] flex justify-center items-center">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer"
                                onClick={() => downloadMonthlyPDF(monthlyEarnings, organizerId, selectedYear)}
                            >
                                <IoDocumentTextOutline className="mr-2"/>
                                Generate Report
                            </Button>
                        </div>
                    )}
                </div>

                {/*    table section*/}
                <div
                    className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                    <div className="flex justify-between items-center py-2">
                        <h3 className="text-gray-500 font-medium">Ongoing Events</h3>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 hover:cursor-pointer"
                            onClick={routeToAddEvent}
                        >
                            + Create New Event
                        </Button>
                    </div>

                    <div>
                        {/*    desktop table view*/}
                        <div className="hidden md:block overflow-x-auto shadow-lg">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Event Id
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Event Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Event Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Date Started
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {onGoingEvents && onGoingEvents.length > 0 ? (
                                    onGoingEvents.map((event: EventDetails) => (
                                        <tr className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                            key={event.eventId}
                                            onClick={() => routeToEventDashboard(event.eventId)}>
                                            <td className="px-6 py-3 text-sm text-gray-900 font-sm">{event.eventId}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 font-sm">{event.eventName}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 font-sm">{event.eventType}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 font-sm">{event.startingDate}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <FileText strokeWidth={1} size={40}/>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No events
                                                    available</h3>
                                                <p className="text-sm text-gray-500">There are currently no event
                                                    records to display.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/*mobile card view*/}
                        <div className="md:hidden space-y-4">
                            {onGoingEvents && onGoingEvents.length > 0 ? (
                                onGoingEvents.map((event: EventDetails) => (
                                    <div
                                        className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                        key={event.eventId}
                                        onClick={() => routeToEventDashboard(event.eventId)}>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-gray-900 text-sm">Event
                                                    ID: {event.eventId}</h4>
                                                <span className="text-xs text-gray-500">{event.startingDate}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{event.eventName}</p>
                                                <p className="text-sm text-gray-600">{event.eventType}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                    <div className="flex flex-col items-center justify-center">
                                        <div
                                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <FileText strokeWidth={1} size={40}/>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
                                        <p className="text-sm text-gray-500 text-center">There are currently no event
                                            records to display.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* All Events Button */}
                        <div className="mt-4 flex justify-center">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer"
                                    onClick={() => routeToAllEvents(organizerId)}
                            >
                                All Events
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
        </ProtectedRoute>
    )
}

export default Page;