'use client'

import React, {useEffect, useState} from 'react'
import {useParams} from "next/navigation";
import {BookingDetails} from "@/types/entityTypes";
import axios from "axios";
import {FileText} from "lucide-react";
import ProtectedRoute from "@/utils/ProtectedRoutes";

const Page = () => {
    // states
    const [bookingDetails, setBookingDetails] = useState<BookingDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //get params
    const params = useParams();
    const eventId = params.eventId;

    //load attendees data at page loading
    useEffect(() => {
        if (eventId) {
            getBookingDetails();
        }
    }, [eventId]);

    //get booking details
    const getBookingDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/bookings`
            );

            // Assuming backend returns -> { message: "...", entityList: [...] }
            if (response.data && response.data.entityList) {
                setBookingDetails(response.data.entityList);
            } else {
                setBookingDetails([]);
            }
        } catch (err: any) {
            console.error("Error fetching bookings:", err);
            setError("Failed to load booking details");
            setBookingDetails([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ProtectedRoute>
                {/* header section */}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Attendees</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">View event attendees details</p>
                    </div>
                </div>

                {/* main content */}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">
                    {loading ? (
                        <p className="text-gray-600">Loading attendees...</p>
                    ) : error ? (
                        <p className="text-red-600">{error}</p>
                    ) : (
                        <div
                            className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                            <div>
                                <h3 className="text-gray-500 font-medium py-2">ATTENDEE DETAILS</h3>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
                                <table
                                    className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Booking
                                            Id
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Phone</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">NIC</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {bookingDetails.length > 0 ? (
                                        bookingDetails.map((booking: BookingDetails, index) => (
                                            <tr
                                                className="hover:bg-gray-50 transition-colors duration-200"
                                                key={index}
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-700">{booking.bookingId}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{booking.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{booking.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{booking.phone}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{booking.nic}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div
                                                        className="w-16 h-16 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-4">
                                                        <FileText strokeWidth={1} size={40}/>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees
                                                        available</h3>
                                                    <p className="text-sm text-gray-500">There are currently no attendee
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
                                {bookingDetails.length > 0 ? (
                                    bookingDetails.map((booking: BookingDetails, index) => (
                                        <div
                                            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                                            key={index}
                                        >
                                            <div className="space-y-2">

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Phone</p>
                                                        <h4 className="font-semibold text-gray-900 text-sm">
                                                            {booking.bookingId}
                                                        </h4>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-sm">
                                                            {booking.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">{booking.email}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Phone</p>
                                                        <p className="text-sm font-medium text-gray-900">{booking.phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">NIC</p>
                                                        <p className="text-sm font-medium text-gray-900">{booking.nic}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                        <div className="flex flex-col items-center justify-center">
                                            <div
                                                className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                                <FileText strokeWidth={1} size={40}/>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees
                                                available</h3>
                                            <p className="text-sm text-gray-500 text-center">There are currently no
                                                attendee records to display.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </ProtectedRoute>
        </>
    )
}
export default Page;
