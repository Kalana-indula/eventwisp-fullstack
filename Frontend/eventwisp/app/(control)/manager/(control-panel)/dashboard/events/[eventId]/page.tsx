'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {CircleCheck, FileText} from "lucide-react";
import axios, {AxiosError} from "axios";
import {EventDetails, EventStatus, Session} from "@/types/entityTypes";
import toast from "react-hot-toast";
import DisapproveEventDialog from "@/app/(control)/manager/manager-components/DisapproveEventDialog";

const Page = ({params}: { params: Promise<{ eventId: number }> }) => {

    const {eventId} = React.use(params);

    const [eventDetails, setEventDetails] = useState<EventDetails>();
    //approval state
    const [eventApproval, setEventApproval] = useState<string>('');
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isDisapproved, setIsDisapproved] = useState<boolean>(false);
    const [isStarted, setIsStarted] = useState<boolean>(false);

    //session state
    const [sessionInfo, setSessionInfo] = useState<Session[]>([]);

    //pending approval badge elements
    const approvalStates = [
        {
            state: "Pending Approval",
            src: "/pending-approval.png",
            message: "Pending Approval"
        },
        {
            state: "Approved",
            src: "/ok.png",
            message: "Approved"
        },
        {
            state: "Disapproved",
            src: "/disapproved-event.png",
            message: "Disapproved"
        },
        {
            state: "Completed",
            src: "/completed.png",
            message: "Completed"
        },
        {
            state: "On Going",
            src: "/on-going.png",
            message: "On Going"
        }
    ]

    //approve event
    const approveEvent = async () => {

        const statusUpdate: EventStatus = {
            isApproved: true,
            isDisapproved: false,
            isStarted: false,
            isCompleted: false
        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/status`, statusUpdate);
            console.log(response.data.updatedData.eventStatus.statusName);
            setEventApproval(response.data.updatedData.status);
            setIsApproved(true);
            setIsDisapproved(false);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    // disapprove event
    const disapproveEvent = async () => {

        const statusUpdate: EventStatus = {
            isApproved: false,
            isDisapproved: true,
            isStarted: false,
            isCompleted: false
        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/status`, statusUpdate);
            console.log(response.data.updatedData.eventStatus.statusName);
            setEventApproval(response.data.updatedData.status);
            setIsApproved(false);
            setIsDisapproved(true);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    //fetch event details
    const getEventDetailsById = async (eventId: number): Promise<void> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/details`);

            // Debug: Log the entire response structure
            // console.log('Full API response:', response.data);
            // console.log('Entity data:', response.data.entityData);
            // console.log('isApproved from API:', response.data.entityData.isApproved);
            // console.log('isStarted from API:', response.data.entityData.isStarted);
            // console.log('Type of isApproved:', typeof response.data.entityData.isApproved);

            setEventDetails(response.data.entityData);
            setEventApproval(response.data.entityData.status);
            setIsApproved(response.data.entityData.isApproved);
            setIsDisapproved(response.data.entityData.isDisapproved);
            setIsStarted(response.data.entityData.isStarted);
        } catch (err) {
            console.log(err);
        }
    }

    //fetch session details
    const getSessionDetailsByEvent = async (eventId: number): Promise<void> => {
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/sessions`);

            setSessionInfo(response.data.sessionList);
            console.log(response.data.sessionList);
        }catch (err){
            if (err instanceof AxiosError) {
                // Check if it's a 404 (no assigned manager) vs actual error
                if (err.response?.status === 404) {
                    // 404 means no manager assigned - this is normal
                    console.log("No session was found");
                } else {
                    // Actual error (500, network issues, etc.)
                    console.error("Error fetching session:", err);
                    const errorMessage = err.response?.data?.message || 'Failed to find session';
                    toast.error(errorMessage);
                }
            } else {
                console.error("Unexpected error:", err);
                toast.error('An unexpected error occurred');
            }
        }
    }

    useEffect(() => {
        getEventDetailsById(eventId);
        getSessionDetailsByEvent(eventId);
    }, []);


    return (
        <>
            {/*header section*/}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                <div className="text-center mb-[10px] p-[10px]">
                    <h1 className="text-2xl font-semibold text-gray-900">Event</h1>
                    <p className="mt-1 text-gray-600">View event details</p>
                </div>
            </div>

            {/*scrollable content*/}
            <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">
                {/*event details section*/}
                <div className="display-event bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
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
                                <div className="break-words text-gray-700 text-sm sm:text-base"><span className="font-semibold">Organizer ID</span>
                                    : {eventDetails?.organizerId}
                                </div>
                                <div className="break-words text-gray-700 mt-2 text-sm sm:text-base">
                                    Event Description<br/>
                                    {eventDetails?.eventDescription}
                                </div>
                            </div>
                        </div>

                        {/* Desktop status display - positioned absolute top right */}
                        <div
                            className="hidden sm:flex absolute top-4 right-4 flex-col items-center justify-center bg-gray-100 rounded-lg p-4 min-w-[120px]">
                            {approvalStates.map((eventState) => {
                                const isCurrentState = eventApproval === eventState.state;

                                // Only render the current state
                                if (!isCurrentState) return null;

                                return (
                                    <React.Fragment key={eventState.state}>
                                        <div
                                            className="flex justify-center items-center w-12 h-12 bg-white rounded-full mb-2 shadow-lg">
                                            <Image src={eventState.src} alt={eventState.state} height={24} width={24}/>
                                        </div>
                                        <div className="text-center text-sm font-medium">{eventState.message}</div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Mobile status display */}
                        <div className="sm:hidden mt-4 flex items-center justify-center bg-gray-100 rounded-lg p-3">
                            {approvalStates.map((eventState) => {
                                const isCurrentState = eventApproval === eventState.state;

                                // Only render the current state
                                if (!isCurrentState) return null;

                                return (
                                    <React.Fragment key={eventState.state}>
                                        <div
                                            className="flex justify-center items-center w-8 h-8 bg-white rounded-full mr-2 shadow-lg">
                                            <Image src={eventState.src} alt={eventState.state} height={16} width={16}/>
                                        </div>
                                        <div className="text-sm font-medium">{eventState.message}</div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            {!isApproved && (
                                <Button
                                    onClick={approveEvent}
                                    className="w-full sm:w-1/5 bg-blue-600 border border-blue-600 text-white rounded-md shadow-sm font-medium py-2 sm:py-3 px-4 text-sm flex items-center justify-center hover:bg-blue-700 active:bg-blue-600 active:text-white transition-colors duration-200 hover:cursor-pointer"
                                >
                                    <CircleCheck className="w-4 h-4" />
                                    Approve Event
                                </Button>

                            )}
                            {/*rounded hover:cursor-pointer*/}
                            <DisapproveEventDialog
                                status={eventApproval}
                                isDisapproved={isDisapproved}
                                isStarted={isStarted}
                                onDisapprove={disapproveEvent}
                            />

                        </div>
                    </div>
                </div>
                {/*sessions table section*/}
                <div
                    className="display-sessions bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                    <div>
                        <h3 className="text-gray-500 font-medium py-2">SESSIONS</h3>
                    </div>

                    <div>
                        {/*    desktop table view*/}
                        <div className="hidden md:block overflow-x-auto shadow-lg">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Session Number
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Venue
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Starting Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Ending Time
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {sessionInfo && sessionInfo.length > 0 ? (
                                    sessionInfo.map((session: Session) => (
                                        <tr className="hvoer:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                            key={session.id}>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{session.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{session.venue}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{session.date}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{session.startTime}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{session.endTime}</td>
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
                                                <p className="text-sm text-gray-500">There are currently no sessions to
                                                    display.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/*mobile card view*/}
                        <div className="md:hidden space-y-4">
                            {(() => {
                                return sessionInfo && sessionInfo.length > 0
                                    ? sessionInfo.map((session: Session) => (
                                        <div
                                            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                            key={session.id}>
                                            <div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-900">Session Number:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{session.id}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span
                                                            className="text-sm font-medium text-gray-900">Venue:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{session.venue}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-900">Date:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{session.date}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-900">Starting Time:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{session.startTime}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-900">Ending Time:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{session.endTime}</span>
                                                    </div>
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
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions
                                                    available</h3>
                                                <p className="text-sm text-gray-500 text-center">There are currently no
                                                    sessions to display.</p>
                                            </div>
                                        </div>
                                    )
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Page
