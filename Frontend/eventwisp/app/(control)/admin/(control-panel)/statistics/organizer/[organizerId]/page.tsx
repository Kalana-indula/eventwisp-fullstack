'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {ChartSpline, FileText} from "lucide-react";
import {useRouter} from "next/navigation";
import {EventDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {getValueString} from "@/lib/utils";
import AdminProtectedRoute from "@/utils/AdminProtectedRoutes";


const Page = ({params}: { params: Promise<{ organizerId: number }> }) => {

    const [eventDetails, setEventDetails] = useState<EventDetails[]>([]);

    const {organizerId} = React.use(params);

    //configure navigation
    const route = useRouter();

    useEffect(() => {
        getEventDetails();
    }, []);

    //get event details
    const getEventDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/events`);
            setEventDetails(response.data.completedEvents);
            console.log(response.data.completedEvents);
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

    const routeToOrganizerStats = () => {
        route.push(`/admin/statistics/organizer/${organizerId}/organizer-stats`);
    }

    return (
        <>
            <AdminProtectedRoute>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Revenue Insights</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">Activities And Earnings By Organizer</p>
                    </div>
                </div>

                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white min-h-screen">
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">EVENT DETAILS</h3>
                        </div>
                        <div>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
                                <table
                                    className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Event
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Event Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Event Type
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Started On
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Total Revenue (LKR.)
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Profit (LKR.)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {eventDetails && eventDetails.length > 0 ? (
                                        eventDetails.map((detail: EventDetails) => (
                                            <tr className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                                key={detail.eventId}>
                                                <td className="px-6 py-4 text-sm text-left text-gray-900 font-sm">{detail.eventId}</td>
                                                <td className="px-6 py-4 text-sm text-left text-gray-700 font-sm">{detail.eventName}</td>
                                                <td className="px-6 py-4 text-sm text-left text-gray-700 font-sm">{detail.eventType}</td>
                                                <td className="px-6 py-4 text-sm text-center text-gray-700 font-sm">{detail.dateCompleted}</td>
                                                <td className="px-6 py-4 text-sm text-center text-gray-700 font-sm">{getValueString(detail.earningsByEvent)}</td>
                                                <td className="px-6 py-4 text-sm text-center text-gray-700 font-sm">{getValueString(detail.totalProfit)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
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

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {(() => {
                                    return eventDetails && eventDetails.length > 0
                                        ? eventDetails.map((detail: EventDetails) => (
                                            <div
                                                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer space-y-2"
                                                key={detail.eventId}>
                                                {/*header section*/}
                                                <div>
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h3 className="font-semibold">{detail.eventName}</h3>
                                                            <p className="text-gray-600">{detail.eventType}</p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                <span className="font-semibold">Event Id : </span>
                                                                <span className="text-gray-600">{detail.eventId}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <hr className="border-gray/40 border-t-1 mx-4 my-1"/>
                                                </div>
                                                {/*details section*/}
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p>Started On</p>
                                                        <p>Total Revenue (LKR.)</p>
                                                        <p>Profit (LKR.)</p>
                                                        <p>Commission</p>
                                                    </div>
                                                    <div className="text-gray-600">
                                                        <p>{detail.dateCompleted}</p>
                                                        <p>{detail.earningsByEvent}</p>
                                                        <p>{detail.totalProfit}</p>
                                                        <p>{detail.commission} %</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : (
                                            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div
                                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <FileText strokeWidth={1} size={40}/>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments
                                                        available</h3>
                                                    <p className="text-sm text-gray-500 text-center">There are currently
                                                        no
                                                        payment records to display.</p>
                                                </div>
                                            </div>
                                        );
                                })()}
                            </div>

                        </div>
                        <div className="flex justify-center items-center my-5">
                            <Button
                                onClick={routeToOrganizerStats}
                                className="bg-blue-600 border border-blue-600 text-white rounded-lg shadow-sm font-medium py-2 sm:py-3 px-4 text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:bg-blue-600 active:text-white transition-colors duration-200 hover:cursor-pointer"
                            >
                                <ChartSpline strokeWidth={2}/>
                                Organizer Statistics
                            </Button>

                        </div>
                    </div>
                </div>
            </AdminProtectedRoute>

        </>
    )
}
export default Page
