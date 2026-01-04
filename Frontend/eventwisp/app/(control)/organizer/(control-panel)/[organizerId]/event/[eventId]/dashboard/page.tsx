'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {formatDate, formatTime, getValueString, handleApiError} from "@/lib/utils";
import {EventDetails, EventStatus, Session, TicketDetails} from "@/types/entityTypes";
import Image from "next/image";
import approvalStates from "@/data/EventStatusDetails";
import {Clock, Eye, EyeOff, FileText} from "lucide-react";
import {toast} from "react-hot-toast";
import PublishEventSwitch from "@/app/(control)/organizer/organizer-components/PublishEventSwitch";
import CompleteEventSwitch from "@/app/(control)/organizer/organizer-components/CompleteEventSwitch";
import ProtectedRoute from "@/utils/ProtectedRoutes";

const Page = () => {
    //states
    const [sessionDetails, setSessionDetails] = useState<Session[]>([]);
    const [timeLeft, setTimeLeft] = useState({
        days: 12,
        hours: 12,
        minutes: 0,
        seconds: 0
    });

    //event status
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('On Going');
    const [eventDetails, setEventDetails] = useState<EventDetails>();
    const [ticketDetails, setTicketDetails] = useState<TicketDetails[]>([]);
    const [isPublished, setIsPublished] = useState<boolean>(false);
    const [startingDate, setStartingDate] = useState<string>("");
    const [startingTime, setStartingTime] = useState<string>("");

    const params = useParams();

    const eventId = params.eventId;
    const organizerId = params.organizerId;

    //load the data at page loading
    useEffect(() => {
        getSessionDetails();
        getEventDetails();
        getTicketDetails();
    }, []);

    // Countdown timer effect
    useEffect(() => {
        if (!startingDate) return; // exit if no date is set

        const targetTime = new Date(startingDate).getTime();
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
    }, [startingDate]);

    //format time
    const formatToAmPm = (timeString: string) => {
        return new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };


    // Auto start event when conditions are met
    useEffect(() => {
        if (!startingDate || !startingTime || isCompleted || status === "On Going" || status === "Completed") return;

        const checkStart = () => {
            const now = new Date();
            const eventStart = new Date(`${startingDate}T${startingTime}`);

            if (now >= eventStart && status !== "On Going" && status !== "Completed") {
                startEvent();
            }
        };

        checkStart();

        const interval = setInterval(checkStart, 10000);
        return () => clearInterval(interval);
    }, [startingDate, startingTime, isCompleted, status]);


    //configure routing
    const route = useRouter();

    //route to create new session
    const routeToCreateSession = () => {
        route.push(`/organizer/${organizerId}/event/${eventId}/add-session`);
    }

    const routeToEventStats = (eventId: number) => {
        route.push(`/organizer/${organizerId}/event/${eventId}/statistics`);
    }

    const routeToUpdateEvent = () => {
        route.push(`/organizer/${organizerId}/event/${eventId}/update-event`);
    }

    //get event details
    const getEventDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/details`);
            //set event state
            setIsCompleted(response.data.entityData.isCompleted);
            setIsPublished(response.data.entityData.isPublished);
            setEventDetails(response.data.entityData);
            setStatus(response.data.entityData.status);
        } catch (err) {
            handleApiError(err, "Failed to load events");
        }
    }

    //get session details
    const getSessionDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/sessions`);

            if (response.data.sessionList.length > 0) {
                setSessionDetails(response.data.sessionList);
                setStartingTime(response.data.sessionList[0].startTime);
                setStartingDate(response.data.sessionList[0].date);
            } else {
                setStartingDate("");
            }

        } catch (err) {
            handleApiError(err, "Failed to load events");
        }
    }

    //get ticket details
    const getTicketDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/tickets`);
            setTicketDetails(response.data.entityList);
        } catch (err) {
            console.log(err);
        }
    }

    //publish event
    const publishEvent = async () => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/publish`
            );

            if (response.status === 200) {
                // Update local state to reflect the published status
                setIsPublished(response.data.entityData.isPublished);

                // Optionally show a success message
                toast.success("Event published successfully");
                // You might want to refresh event details to get the latest data
                getEventDetails();
            }
        } catch (err) {
            handleApiError(err, "Failed to publish event");
        }
    }

    //mark event as completed
    const completeEvent = async () => {
        const statusUpdate: EventStatus = {
            isApproved: true,
            isDisapproved: false,
            isStarted: true,
            isCompleted: true
        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/status`, statusUpdate);
            setStatus(response.data.updatedData.eventStatus.statusName);
            setIsCompleted(response.data.updatedData.isCompleted);
        } catch (err) {
            console.log(err);
        }
    }

    //mark event as ongoing
    const startEvent = async () => {
        const statusUpdate: EventStatus = {
            isApproved: true,
            isDisapproved: false,
            isStarted: true,
            isCompleted: false
        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/status`, statusUpdate);
            setStatus(response.data.updatedData.eventStatus.statusName);
            setIsCompleted(response.data.updatedData.isCompleted);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <ProtectedRoute>
                {/*    header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Event Dashboard</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">View event details and manage
                            sessions</p>
                    </div>
                </div>

                {/*    main scrollable content*/}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">

                    {/*    action buttons*/}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
                        <Button className={`bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 hover:cursor-pointer 
                    ${status === 'Pending Approval' || status === 'Completed' ? 'hidden' : ''}`}
                                onClick={routeToCreateSession}
                        >
                            + Add New Session
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 hover:cursor-pointer"
                            onClick={() => {
                                routeToEventStats(Number(eventId));
                            }}
                        >
                            View Event Statistics
                        </Button>
                        <Button
                            className={`bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 hover:cursor-pointer ${status === 'Completed' ? 'hidden' : 'block'}`}
                            onClick={() => {
                                routeToUpdateEvent();
                            }}
                        >
                            Update Event Details
                        </Button>
                    </div>

                    {/*event details section*/}
                    <div
                        className="display-event bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium">EVENT DETAILS</h3>
                        </div>

                        <div className="bg-white shadow-xl text-black p-4 sm:p-6 rounded-lg my-[10px] relative">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex justify-center items-center sm:h-32 sm:w-32 p-[18px] sm:p-[20px] mx-[10px] bg-gray-300 rounded-full">
                                    <Image src="/calendar.png" alt="event" height={64} width={64}/>
                                </div>
                                <div className="sm:py-[20px] flex-1">
                                    <h2 className="text-lg sm:text-2xl font-semibold">{eventDetails?.eventName}</h2>
                                    <div className="break-words text-gray-700 mt-2 text-sm sm:text-base">
                                        <div className="my-1">
                                            <span className="font-semibold">Date :</span>  {eventDetails?.startingDate}
                                        </div>
                                        <div className="mt-3 sm:mt-5">
                                            {eventDetails?.eventDescription}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop status display - positioned absolute top right */}
                            <div
                                className="hidden sm:flex absolute top-4 right-4 flex-col items-center justify-center bg-gray-100 rounded-lg p-4 min-w-[120px]">
                                {approvalStates.map((eventState) => {
                                    const isCurrentState = status === eventState.state;

                                    // Only render the current state
                                    if (!isCurrentState) return null;

                                    return (
                                        <React.Fragment key={eventState.state}>
                                            <div
                                                className="flex justify-center items-center w-12 h-12 bg-white rounded-full mb-2 shadow-lg">
                                                <Image src={eventState.src} alt={eventState.state} height={24}
                                                       width={24}/>
                                            </div>
                                            <div className="text-center text-sm font-medium">{eventState.message}</div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Mobile status display */}
                            <div className="sm:hidden mt-4 flex items-center justify-center bg-gray-100 rounded-lg p-3">
                                {approvalStates.map((eventState) => {
                                    const isCurrentState = status === eventState.state;

                                    // Only render the current state
                                    if (!isCurrentState) return null;

                                    return (
                                        <React.Fragment key={eventState.state}>
                                            <div
                                                className="flex justify-center items-center w-8 h-8 bg-white rounded-full mr-2 shadow-lg">
                                                <Image src={eventState.src} alt={eventState.state} height={16}
                                                       width={16}/>
                                            </div>
                                            <div className="text-sm font-medium">{eventState.message}</div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                            <div className="flex justify-center mt-2 space-x-1 text-sm text-gray-500 items-center">
                                <div>
                                    <Eye className={`${isPublished ? 'block' : 'hidden'}`}
                                         strokeWidth={0.75}
                                    />
                                </div>
                                <div>
                                    <EyeOff className={`${isPublished ? 'hidden' : 'block'}`}
                                            strokeWidth={0.75}
                                    />
                                </div>
                                <div>
                                    {isPublished ? 'Your event is visible to the audience' : 'Your event is not public. It is not visible to the audience'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*count down section*/}
                    <div className={`display-countdown bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm 
                    ${status === 'Pending Approval' || status === 'Completed' || status === 'On Going' ? 'hidden' : ''}`}>
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">EVENT WILL START IN</h3>
                        </div>

                        <div className="bg-white p-4 rounded-md">
                            {/*clock*/}
                            {isPublished ? (
                                <>
                                    <div
                                        className={`flex justify-center items-center space-x-2 sm:space-x-4 md:space-x-6 ${timeLeft.days === 0 ? 'hidden' : 'block'}`}>
                                        {/* Days */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="bg-blue-600 text-white text-2xl sm:text-3xl md:text-4xl font-bold px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-md min-w-[60px] sm:min-w-[70px] md:min-w-[80px] text-center">
                                                {String(timeLeft.days).padStart(2, '0')}
                                            </div>
                                            <span
                                                className="text-xs sm:text-sm font-medium text-gray-600 mt-2">DAYS</span>
                                        </div>

                                        {/* Hours */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="bg-blue-600 text-white text-2xl sm:text-3xl md:text-4xl font-bold px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-md min-w-[60px] sm:min-w-[70px] md:min-w-[80px] text-center">
                                                {String(timeLeft.hours).padStart(2, '0')}
                                            </div>
                                            <span
                                                className="text-xs sm:text-sm font-medium text-gray-600 mt-2">HOURS</span>
                                        </div>

                                        {/* Minutes */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="bg-blue-600 text-white text-2xl sm:text-3xl md:text-4xl font-bold px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-md min-w-[60px] sm:min-w-[70px] md:min-w-[80px] text-center">
                                                {String(timeLeft.minutes).padStart(2, '0')}
                                            </div>
                                            <span
                                                className="text-xs sm:text-sm font-medium text-gray-600 mt-2">MINS</span>
                                        </div>

                                        {/* Seconds */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="bg-blue-600 text-white text-2xl sm:text-3xl md:text-4xl font-bold px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-md min-w-[60px] sm:min-w-[70px] md:min-w-[80px] text-center">
                                                {String(timeLeft.seconds).padStart(2, '0')}
                                            </div>
                                            <span
                                                className="text-xs sm:text-sm font-medium text-gray-600 mt-2">SECS</span>
                                        </div>
                                    </div>

                                    {/*message*/}
                                    <div
                                        className={`flex flex-col items-center space-y-2 ${timeLeft.days !== 0 ? 'hidden' : 'block'}`}>
                                        <div className="font-semibold text-xl">
                                            Your Event Is Happening Today
                                        </div>
                                        <div
                                            className="flex flex-col items-center text-[15px] text-gray-500 p-2 bg-gray-200 rounded-lg">
                                            <div>
                                                Will Start On:
                                            </div>
                                            <div className="flex justify-center items-center text-[22px] gap-1">
                                                <div>
                                                    <Clock strokeWidth={1.5} size={22}/>
                                                </div>
                                                <div>
                                                    {startingTime ? formatToAmPm(startingTime) : "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-2">
                                    <div
                                        className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                        <EyeOff strokeWidth={1} size={40}/>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Published</h3>
                                    <p className="text-sm text-gray-500 text-center">Publish your event to make it
                                        visible
                                        to audience</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/*table section*/}

                    {/*Ticket data*/}
                    <div
                        className="display-sessions bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">TICKET DETAILS</h3>
                        </div>

                        <div>
                            {/*    desktop table view*/}
                            <div className="hidden md:block overflow-x-auto shadow-lg">
                                <table
                                    className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Ticket Category
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Count
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {ticketDetails && ticketDetails.length > 0 ? (
                                        ticketDetails.map((ticket: TicketDetails, index) => (
                                            <tr className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                                key={index}>
                                                <td className="px-6 py-3 text-sm text-gray-900 font-sm">{ticket.ticketType}</td>
                                                <td className="px-6 py-3 text-sm text-gray-900 font-sm">{getValueString(ticket.ticketPrice)} LKR.</td>
                                                <td className="px-6 py-3 text-sm text-gray-900 font-sm">{ticket.ticketCount}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div
                                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <FileText strokeWidth={1} size={40}/>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions
                                                        available</h3>
                                                    <p className="text-sm text-gray-500">There are currently no session
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
                                {ticketDetails && ticketDetails.length > 0 ? (
                                    ticketDetails.map((ticket: TicketDetails, index) => (
                                        <div
                                            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                            key={index}>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-semibold text-gray-900 text-lg">{ticket.ticketType}</h4>
                                                    <span></span>
                                                </div>
                                                <div>
                                                    <div className="flex  items-center space-x-2">
                                                        <div className="text-sm font-medium text-gray-900">Price :</div>
                                                        <div
                                                            className="text-sm text-gray-500">{getValueString(ticket.ticketPrice)} LKR.
                                                        </div>
                                                    </div>
                                                    <div className="flex  items-center space-x-2">
                                                        <div className="text-sm font-medium text-gray-900">Count :</div>
                                                        <div
                                                            className="text-sm text-gray-500">{ticket.ticketCount}</div>
                                                    </div>
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
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions
                                                available</h3>
                                            <p className="text-sm text-gray-500 text-center">There are currently no
                                                session
                                                records to display.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/*session data*/}
                    <div
                        className="display-sessions bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">SESSION DATA</h3>
                        </div>

                        <div>
                            {/*    desktop table view*/}
                            <div className="hidden md:block overflow-x-auto shadow-lg">
                                <table
                                    className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Session no
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Venue
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Starting time
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Ending time
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {sessionDetails && sessionDetails.length > 0 ? (
                                        sessionDetails.map((session: Session, index) => (
                                            <tr className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                                key={index}>
                                                <td className="px-6 py-3 text-sm text-gray-900 font-sm">{session.sessionNumber}</td>
                                                <td className="px-6 py-3 text-sm text-gray-900 font-sm">{session.venue}</td>
                                                <td className="px-6 py-3 text-sm text-gray-900 font-sm">{formatDate(session.date)}</td>
                                                <td className="px-6 py-3 text-sm text-gray-900 font-sm">{formatTime(session.startTime)}</td>
                                                <td className="px-6 py-3 text-sm text-gray-900 font-sm">{formatTime(session.endTime)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div
                                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <FileText strokeWidth={1} size={40}/>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions
                                                        available</h3>
                                                    <p className="text-sm text-gray-500">There are currently no session
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
                                {sessionDetails && sessionDetails.length > 0 ? (
                                    sessionDetails.map((session: Session, index) => (
                                        <div
                                            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                            key={index}>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-semibold text-gray-900 text-sm">{session.sessionNumber}</h4>
                                                    <span
                                                        className="text-xs text-gray-500">{formatDate(session.date)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{session.venue}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <p className="text-sm text-gray-600">Start: {formatTime(session.startTime)}</p>
                                                        <p className="text-sm text-gray-600">End: {formatTime(session.endTime)}</p>
                                                    </div>
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
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions
                                                available</h3>
                                            <p className="text-sm text-gray-500 text-center">There are currently no
                                                session
                                                records to display.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/*mark event as completed*/}
                    <div>
                        <CompleteEventSwitch
                            isCompleted={isCompleted}
                            status={status}
                            onComplete={completeEvent}
                        />
                    </div>

                    {/*mark event as published*/}
                    <div>
                        <PublishEventSwitch
                            isPublished={isPublished}
                            status={status}
                            sessionDetails={sessionDetails}
                            onPublish={publishEvent}
                        />

                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}

export default Page;