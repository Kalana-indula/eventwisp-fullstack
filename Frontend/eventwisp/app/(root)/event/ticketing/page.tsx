'use client'

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ConfirmedBookingDetails, ConfirmedTicketDetails } from "@/types/entityTypes";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const Page = () => {
    const [bookingDetails, setBookingDetails] = useState<ConfirmedBookingDetails | null>(null);
    const [searchedBookingId, setSearchedBookingId] = useState<string>('');
    const [ticketDetails, setTicketDetails] = useState<ConfirmedTicketDetails[] | null>([]);
    const [issuing, setIssuing] = useState(false);

    const handleBookingIdSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchedBookingId(e.target.value);

        if (!e.target.value.trim()) {
            setBookingDetails(null);
            setTicketDetails([]);
        }
    };

    // Helper: fetch with cache-buster to ensure fresh data
    const fetchBookingFresh = async (bookingId: string) => {
        const ts = Date.now();
        return axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/bookings/${bookingId}?t=${ts}`
        );
    };

    const searchBookingId = async (bookingId: string) => {
        if (!searchedBookingId.trim()) {
            alert("Please enter a Booking ID before searching");
            return;
        }

        try {
            const response = await fetchBookingFresh(bookingId);
            if (response.data?.entityData) {
                setBookingDetails(response.data.entityData);
                setTicketDetails(response.data.entityData.ticketDetails);
            } else {
                toast.error("No booking details found.");
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    console.log("No event was found");
                    toast.error("No event was found");
                } else {
                    console.error("Error fetching event:", err);
                    const errorMessage = err.response?.data?.message || "Failed to find event";
                    toast.error(errorMessage);
                }
            } else {
                console.error("Unexpected error:", err);
                toast.error("An unexpected error occurred");
            }
        }
    };

    // confirm ticket issuance at the counter
    const confirmTicketIssue = async (bookingId: string) => {
        try {
            setIssuing(true);
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${bookingId}/issue-tickets`
            );
            toast.success(response.data?.message || "Tickets issued");

            // Re-fetch full details so ALL fields refresh
            await searchBookingId(bookingId);
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    console.log("No event was found");
                    toast.error("No event was found");
                } else {
                    console.error("Error issuing tickets:", err);
                    const errorMessage = err.response?.data?.message || "Failed to issue tickets";
                    toast.error(errorMessage);
                }
            } else {
                console.error("Unexpected error:", err);
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIssuing(false);
        }
    };

    return (
        <>
            {/* Header section */}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                <div className="text-center mb-[10px] p-[10px]">
                    <h1 className="text-2xl font-semibold text-gray-900">Booking Details</h1>
                    <p className="mt-1 text-gray-600">Search and View Booking Information</p>
                </div>
            </div>

            {/* Main content section */}
            <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white min-h-screen">
                {/* Search bar */}
                <div className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                    <div>
                        <h3 className="text-gray-500 font-medium py-2">SEARCH BOOKING BY ID</h3>
                    </div>
                    <div className="flex justify-center sm:justify-start">
                        <div className="flex flex-col sm:flex-row w-full max-w-sm items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Booking ID"
                                className="bg-white shadow-lg"
                                value={searchedBookingId}
                                onChange={handleBookingIdSearch}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && searchedBookingId.trim()) {
                                        e.preventDefault();
                                        searchBookingId(searchedBookingId);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                className="bg-black text-white w-full sm:w-1/5 active:bg-black active:text-white shadow-lg hover:cursor-pointer"
                                onClick={() => searchBookingId(searchedBookingId)}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Booking Details Card */}
                <div className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                    <div>
                        <h3 className="text-gray-500 font-medium py-2">BOOKING INFORMATION</h3>
                    </div>

                    <div className="w-full lg:max-w-2xl lg:mx-auto">
                        {bookingDetails ? (
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm font-medium text-gray-900">Event Name:</span>
                                        <span className="text-sm text-gray-600">{bookingDetails.eventName}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm font-medium text-gray-900">Attendee Name:</span>
                                        <span className="text-sm text-gray-600">{bookingDetails.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm font-medium text-gray-900">Email:</span>
                                        <span className="text-sm text-gray-600">{bookingDetails.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm font-medium text-gray-900">Phone:</span>
                                        <span className="text-sm text-gray-600">{bookingDetails.phone}</span>
                                    </div>
                                    {/* NIC row with thin grey border */}
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm font-medium text-gray-900">NIC:</span>
                                        <span className="text-sm text-gray-600">{bookingDetails.nic}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm font-medium text-gray-900">Ticket Issued:</span>
                                        <span className="text-sm text-gray-600">
                      {bookingDetails.ticketIssued ? "Yes" : "No"}
                    </span>
                                    </div>
                                    {/* Optionally show issued date/time if present */}
                                    {bookingDetails.ticketIssued && (
                                        <>
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <span className="text-sm font-medium text-gray-900">Issued Date:</span>
                                                <span className="text-sm text-gray-600">{bookingDetails.ticketIssuedDate}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <span className="text-sm font-medium text-gray-900">Issued Time:</span>
                                                <span className="text-sm text-gray-600">{bookingDetails.ticketIssuedTime}</span>
                                            </div>
                                        </>

                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                        <FileText strokeWidth={1} size={40} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No booking details available</h3>
                                    <p className="text-sm text-gray-500 text-center">Search for a booking ID to view details.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Details Table */}
                <div className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                    <div>
                        <h3 className="text-gray-500 font-medium py-2">TICKET DETAILS</h3>
                    </div>

                    <div className="w-full lg:max-w-2xl lg:mx-auto">
                        {/* Desktop table view */}
                        <div className="hidden md:block overflow-x-auto shadow-lg">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Ticket Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Count
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {bookingDetails && bookingDetails.ticketDetails && bookingDetails.ticketDetails.length > 0 ? (
                                    bookingDetails.ticketDetails.map((ticket: ConfirmedTicketDetails, index: number) => (
                                        <tr className="hover:bg-gray-50 transition-colors duration-200" key={index}>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{ticket.ticketType}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{ticket.ticketCount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                                    <FileText strokeWidth={1} size={40} />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No ticket details available</h3>
                                                <p className="text-sm text-gray-500">There are currently no ticket records to display.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card view */}
                        <div className="md:hidden space-y-4">
                            {bookingDetails && bookingDetails.ticketDetails && bookingDetails.ticketDetails.length > 0 ? (
                                bookingDetails.ticketDetails.map((ticket: ConfirmedTicketDetails, index: number) => (
                                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200" key={index}>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-900">Ticket Type:</span>
                                                <span className="text-sm text-gray-600 font-sm">{ticket.ticketType}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-900">Count:</span>
                                                <span className="text-sm text-gray-600 font-sm">{ticket.ticketCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                            <FileText strokeWidth={1} size={40} />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No ticket details available</h3>
                                        <p className="text-sm text-gray-500 text-center">There are currently no ticket records to display.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Issue Tickets Button */}
                        {bookingDetails && !bookingDetails.ticketIssued && (
                            <div className="mt-6 flex justify-end">
                                <Button
                                    className="bg-black text-white px-6 py-2 rounded-md shadow-lg active:bg-black active:text-white hover:opacity-90 hover:cursor-pointer disabled:opacity-70"
                                    onClick={() => confirmTicketIssue(searchedBookingId)}
                                    disabled={!searchedBookingId.trim() || issuing}
                                >
                                    {issuing ? "Issuing..." : "Issue Tickets"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
