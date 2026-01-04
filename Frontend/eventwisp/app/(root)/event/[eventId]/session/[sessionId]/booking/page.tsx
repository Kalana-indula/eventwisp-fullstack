'use client'

import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {
    BookedTicketDetails,
    BookingData,
    EventDetails,
    Session,
    SessionTicketDetails,
    TimeCountDown
} from "@/types/entityTypes";
import MainFooter from "@/app/(root)/app-components/MainFooter";
import axios from "axios";
import {formatDate, formatTime, getValueString} from "@/lib/utils";
import {CalendarMinus2, Clock11, MapPin} from "lucide-react";


const Page = () => {
    //states
    const [sessionDetails, setSessionDetails] = useState<Session>();
    const [eventDetails, setEventDetails] = useState<EventDetails>();
    const [sessionTicketDetails, setSessionTicketDetails] = useState<SessionTicketDetails[]>([]);

    //ticket ids
    const [ticketIdList,setTicketIdList] = useState<number[]>([]);

    //booking data
    const [bookedTicketDetails,setBookedTicketDetails] = useState<BookingData>();


    //time value states
    const [sessionDate, setSessionDate] = useState<string>("");
    const [timeLeft,setTimeLeft] = useState<TimeCountDown>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // state for ticket counts
    const [ticketCounts, setTicketCounts] = useState<Record<number, number>>({});

    const params = useParams();
    const sessionId = params.sessionId;
    const eventId = params.eventId;
    const router = useRouter();

    // get count down
    useEffect(() => {
        // exit if no date is set
        if (!sessionDate) return;

        const targetTime = new Date(sessionDate).getTime();
        if (isNaN(targetTime)) return; // exit if date is invalid

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = targetTime - now;

            if (diff <= 0) {
                clearInterval(timer);
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({days, hours, minutes, seconds});
        }, 1000);

        return () => clearInterval(timer);

    }, [sessionDate]);

    //fetch data at page loading
    useEffect(() => {
        getSessionDetails()
        getEventDetails();
        getSessionTicketDetails()
    }, []);

    //check the ticket id list
    useEffect(() => {
        const newList: number[] = [];

        Object.entries(ticketCounts).forEach(([id, count]) => {
            for (let i = 0; i < count; i++) {
                newList.push(Number(id));
            }
        });

        setTicketIdList(newList);
    }, [ticketCounts]);

    // load booked ticket details
    useEffect(() => {
        const details = sessionTicketDetails
            .map(ticket => {
                const count = ticketCounts[ticket.ticketId] || 0;
                if (count === 0) return null;

                return {
                    ticketId: ticket.ticketId,
                    ticketType: ticket.ticketType,
                    price: ticket.ticketPrice,
                    count,
                } as BookedTicketDetails;
            })
            .filter((t): t is BookedTicketDetails => t !== null); // type guard

        if (details.length > 0) {
            setBookedTicketDetails({
                ticketDetails: details,
                eventName:eventDetails?.eventName ?? "",
                totalPrice: details.reduce((sum, t) => sum + t.price * t.count, 0),
            });
        } else {
            setBookedTicketDetails(undefined);
        }
    }, [ticketCounts, sessionTicketDetails]);


// increment handler
    const handleIncrement = (ticketId: number, seatsLeft: number) => {
        setTicketCounts((prev) => {
            const current = prev[ticketId] || 0;
            if (current < seatsLeft) {
                return { ...prev, [ticketId]: current + 1 };
            }
            return prev;
        });
    };

// decrement handler
    const handleDecrement = (ticketId: number) => {
        setTicketCounts((prev) => {
            const current = prev[ticketId] || 0;
            if (current > 0) {
                return { ...prev, [ticketId]: current - 1 };
            }
            return prev;
        });
    };


    //routing function should have the query of id list
    const routeToCheckout = (id: number,query:string) => {
        router.push(`/event/${eventId}/session/${id}/booking/checkout?${query}`);
    }

    // checkout
    const handleCheckout = ()=>{
        // console.log("Booked Ticket Details:", bookedTicketDetails);

        //query string to pass ticket details
        const query=new URLSearchParams({
            tickets:JSON.stringify(ticketIdList),
            bookedTickets:JSON.stringify(bookedTicketDetails),
            eventName: eventDetails?.eventName || "",
        }).toString();

        routeToCheckout(Number(sessionId),query);
    }

    // calculate grand total
    const grandTotal = sessionTicketDetails.reduce((sum, ticket) => {
        const count = ticketCounts[ticket.ticketId] || 0;
        return sum + count * ticket.ticketPrice;
    }, 0);


    //get session details
    const getSessionDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${sessionId}`);
            setSessionDetails(response.data.entityData);
            setSessionDate(response.data.entityData.date);
        } catch (error) {
            console.error("Error fetching session details:", error);
        }
    }

    //get event details
    const getEventDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/details`);
            setEventDetails(response.data.entityData);
        } catch (error) {
            console.error("Error fetching session details:", error);
        }
    }

    //get session ticket details
    const getSessionTicketDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${sessionId}/tickets`);
            setSessionTicketDetails(response.data.entityList);
        } catch (error) {
            console.error("Error fetching session details:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

            {/* Banner section - unchanged as requested */}
            <div
                className="event-banner relative h-[400px] w-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${eventDetails?.coverImageLink || "/fallback.jpg"})`,
                }}
            >
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"/>

                {/* Content */}
                <div
                    className="relative z-10 h-full flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-start gap-6 px-6 sm:px-12 pb-10">
                    {/* Event image */}
                    <div
                        className="event-image h-[250px] w-[200px] shadow-2xl rounded-lg overflow-hidden border-4 border-white">
                        <Image
                            src={eventDetails?.coverImageLink || "/fallback.jpg"}
                            alt={eventDetails?.eventName || "Event cover image"}
                            height={250}
                            width={200}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Event info */}
                    <div className="text-center sm:text-left">
                        <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg">
                            {eventDetails?.eventName}
                        </h2>
                        <p className="mt-3 text-lg sm:text-xl text-gray-200">
                            Experience the unforgettable
                        </p>
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Countdown Section */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Event Starts In</h3>
                                <div className="w-20 h-1 mx-auto rounded-full"
                                     style={{backgroundColor: '#193cb8'}}></div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
                                <div className="text-center">
                                    <div className="rounded-2xl p-4 mb-3 shadow-lg border border-gray-100"
                                         style={{backgroundColor: '#193cb8'}}>
                                        <div
                                            className="text-3xl font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DAYS
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="rounded-2xl p-4 mb-3 shadow-lg border border-gray-100"
                                         style={{backgroundColor: '#193cb8'}}>
                                        <div
                                            className="text-3xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                                    </div>
                                    <div
                                        className="text-xs font-semibold text-gray-500 uppercase tracking-wider">HOURS
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="rounded-2xl p-4 mb-3 shadow-lg border border-gray-100"
                                         style={{backgroundColor: '#193cb8'}}>
                                        <div
                                            className="text-3xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">MINS
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="rounded-2xl p-4 mb-3 shadow-lg border border-gray-100"
                                         style={{backgroundColor: '#193cb8'}}>
                                        <div
                                            className="text-3xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SECS
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Event Description */}
                        <div>
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <div className="w-1 h-6 rounded-full" style={{backgroundColor: '#193cb8'}}></div>
                                    About This Event
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    {eventDetails?.eventDescription}
                                </p>
                            </div>
                        </div>

                        {/* Ticket Selection Table */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                            <div className="p-8 pb-0">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-1 h-6 rounded-full" style={{backgroundColor: '#193cb8'}}></div>
                                    Select Your Tickets
                                </h3>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                        <tr className="border-t border-gray-200" style={{backgroundColor: '#f8fafc'}}>
                                            <th className="px-8 py-5 text-left text-sm font-bold text-gray-900">Category</th>
                                            <th className="px-8 py-5 text-left text-sm font-bold text-gray-900">Price</th>
                                            <th className="px-8 py-5 text-left text-sm font-bold text-gray-900">Quantity</th>
                                            <th className="px-8 py-5 text-left text-sm font-bold text-gray-900">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {sessionTicketDetails.map((ticket) => {
                                            const count = ticketCounts[ticket.ticketId] || 0;
                                            const seatsLeft = ticket.remainingTicketCount;

                                            return (
                                                <tr key={ticket.ticketId}
                                                    className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6 font-semibold text-gray-900">{ticket.ticketType}</td>
                                                    <td className="px-8 py-6 text-gray-700 font-medium">
                                                        LKR {getValueString(ticket.ticketPrice)}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleDecrement(ticket.ticketId)}
                                                                className="w-10 h-10 rounded-lg border-2 border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold hover:cursor-pointer"
                                                                disabled={count === 0}
                                                            >
                                                                −
                                                            </button>
                                                            <span
                                                                className="w-12 text-center font-bold text-gray-900 text-lg">{count}</span>
                                                            <button
                                                                onClick={() => handleIncrement(ticket.ticketId, seatsLeft)}
                                                                className="w-10 h-10 rounded-lg border-2 flex items-center justify-center text-white font-semibold hover:opacity-90 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                                style={{
                                                                    backgroundColor: "#193cb8",
                                                                    borderColor: "#193cb8"
                                                                }}
                                                                disabled={count >= seatsLeft}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 font-bold text-gray-900">
                                                        LKR {getValueString((count * ticket.ticketPrice))}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>

                                        <tfoot>
                                        <tr className="border-t-2"
                                            style={{backgroundColor: "#f8fafc", borderColor: "#193cb8"}}>
                                            <td colSpan={3} className="px-8 py-6 text-lg font-bold text-gray-900">
                                                Grand Total
                                            </td>
                                            <td className="px-8 py-6 text-xl font-bold" style={{color: "#193cb8"}}>
                                                LKR {getValueString(grandTotal)}
                                            </td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden p-6 space-y-6">
                                {sessionTicketDetails.map((ticket) => {
                                    const count = ticketCounts[ticket.ticketId] || 0;
                                    const seatsLeft = ticket.remainingTicketCount;

                                    return (
                                        <div
                                            key={ticket.ticketId}
                                            className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                                        >
                                            {/* Ticket Info */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{backgroundColor: "#193cb8"}}
                                                        ></div>
                                                        <span className="font-bold text-gray-900">
                                                            {ticket.ticketType} Seats
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 font-medium">
                                                        LKR {getValueString(ticket.ticketPrice)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Total</p>
                                                    <p className="font-bold text-gray-900">
                                                        LKR {getValueString((count * ticket.ticketPrice))}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => handleDecrement(ticket.ticketId)}
                                                    className="w-12 h-12 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold"
                                                    disabled={count === 0}
                                                >
                                                    −
                                                </button>
                                                <span className="w-16 text-center font-bold text-gray-900 text-2xl">
                                                    {count}
                                                </span>
                                                <button
                                                    onClick={() => handleIncrement(ticket.ticketId, seatsLeft)}
                                                    className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-white font-bold hover:opacity-90 hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    style={{backgroundColor: "#193cb8", borderColor: "#193cb8"}}
                                                    disabled={count >= seatsLeft}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Mobile Grand Total */}
                                <div className="border-t-2 pt-4" style={{borderColor: "#193cb8"}}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Grand Total</span>
                                        <span className="text-xl font-bold" style={{color: "#193cb8"}}>
                                             LKR {getValueString(grandTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <div className="p-8 pt-0">
                                <button
                                    className="w-full py-4 px-8 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                    style={{backgroundColor: '#193cb8'}}
                                    disabled={grandTotal === 0}
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout • LKR {getValueString(grandTotal)}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Event Details & Seat Count */}
                    <div className="space-y-6">

                        {/* Event Details Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-6 sticky top-6">
                            <div className="mb-6 pb-4 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-5 rounded-full" style={{backgroundColor: '#193cb8'}}></div>
                                    Event Details
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                            <CalendarMinus2 strokeWidth={1} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Date</p>
                                            <p className="font-semibold text-gray-900">{formatDate(sessionDetails?.date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                            <Clock11 strokeWidth={1} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Time</p>
                                            <p className="font-semibold text-gray-900">{formatTime(sessionDetails?.startTime)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                            <MapPin strokeWidth={1} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Venue</p>
                                            <p className="font-semibold text-gray-900">{sessionDetails?.venue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seats Available Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-900">Seats Available</h4>
                                    <div className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                                         style={{backgroundColor: '#193cb8'}}>
                                        Live Count
                                    </div>
                                </div>

                                {/*seats available section*/}
                                <div className="space-y-4">
                                    {sessionTicketDetails.map((ticket) => {

                                        // extract required variables
                                        const {ticketId, ticketType, initialTicketCount, remainingTicketCount} = ticket;

                                        return (
                                            <div key={ticketId} className="bg-gray-50 rounded-xl p-4">

                                                {/* Top Row: Ticket type + seats left */}
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full"
                                                             style={{backgroundColor: "#193cb8"}}
                                                        >

                                                        </div>
                                                        <span className="font-semibold text-gray-800">
                                                                {ticketType} Seats
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                     <span className="text-xl font-bold text-gray-900">
                                                            {remainingTicketCount}
                                                     </span>
                                                        <span className="text-sm text-gray-500 ml-1">left</span>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Total and availability status */}
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-gray-500">
                                                        Total: {initialTicketCount}
                                                    </span>
                                                    <span className="text-xs text-gray-600 font-medium">
                                                        {remainingTicketCount < initialTicketCount * 0.2 ? "Few left!" : "Available"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Summary Stats */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total Seats Left</span>
                                        <div className="flex items-center gap-1">
                                            <span
                                                className="text-lg font-bold text-gray-900">{sessionTicketDetails.reduce((total, ticket) => total + ticket.remainingTicketCount, 0)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                / {sessionTicketDetails.reduce((total, ticket) => total + ticket.initialTicketCount, 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*    footer section*/}
            <footer>
                <MainFooter/>
            </footer>
        </div>
    );
};

export default Page;