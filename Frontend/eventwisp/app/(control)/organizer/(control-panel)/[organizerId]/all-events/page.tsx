// organizer events

'use client'

import React, {useEffect, useState} from 'react';
import {EventDetails} from "@/types/entityTypes";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {handleApiError} from "@/lib/utils";
import {FileText} from "lucide-react";
import ProtectedRoute from "@/utils/ProtectedRoutes";


const Page = () => {

    //event states
    const [isOngoing,setIsOngoing] = useState<boolean>(false);
    const [isPending,setIsPending] = useState<boolean>(false);
    const [isCompleted,setIsCompleted] = useState<boolean>(false);
    const [isPendingApproval,setIsPendingApproval]=useState<boolean>(false);

    //event details state
    const [tableData,setTableData] = useState<EventDetails[]>([]);

    const params = useParams();
    const organizerId = params.organizerId;

    //configure navigation
    const route=useRouter();

    useEffect(() => {
        getOnGoingEvents();
        setIsOngoing(true);
    }, []);

    const handleOngoingTab = ()=>{
        setIsOngoing(true);
        setIsPending(false);
        setIsCompleted(false);
        setIsPendingApproval(false);
        getOnGoingEvents();
    }

    const handlePendingTab = ()=>{
        setIsOngoing(false);
        setIsPending(true);
        setIsCompleted(false);
        setIsPendingApproval(false);
        getPendingEvents();
    }

    const handleCompletedTab = ()=>{
        setIsOngoing(false);
        setIsPending(false);
        setIsCompleted(true);
        setIsPendingApproval(false);
        getCompletedEvents();
    }

    const handlePendingApprovalTab = ()=>{
        setIsOngoing(false);
        setIsPending(false);
        setIsCompleted(false);
        setIsPendingApproval(true);
        getPendingApprovalEvents()
    }

    //route to event dashboard
    const routeToEventDashboard =(eventId:number)=>{
        route.push(`/organizer/${organizerId}/event/${eventId}/dashboard`);
    }

    //fetch event details
    const getOnGoingEvents = async ()=>{
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/events`);
            setTableData(response.data.onGoingEvents);

        }catch (err){
            handleApiError(err,"Failed to load events");
        }
    }

    //pending approvals
    const getPendingEvents = async ()=>{
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/events`);
            setTableData(response.data.approvedEvents);
            console.log(response.data.approvedEvents);

        }catch (err){
            handleApiError(err,"Failed to load events");
        }
    }

    const getPendingApprovalEvents = async ()=>{
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/events`);
            setTableData(response.data.pendingApprovalEvents);

        }catch (err){
            handleApiError(err,"Failed to load events");
        }
    }

    //completed events
    const getCompletedEvents = async ()=>{
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/events`);
            setTableData(response.data.completedEvents);

        }catch (err){
            handleApiError(err,"Failed to load events");
        }
    }

    return (
        <ProtectedRoute>
        <>
            {/*    header section*/}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                <div className="text-center p-[10px]">
                    <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
                    <p className="mt-1 text-gray-600">View all events</p>
                </div>
            </div>

            {/*main scrollable content*/}
            <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">
                <div
                    className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                    <div>
                        <h3 className="text-gray-500 font-medium py-2">EVENT DETAILS</h3>
                    </div>

                    {/* Tab navigation*/}
                    <div className="mb-4">
                        <div className="flex border-b border-gray-300">
                            <button
                                onClick={handleOngoingTab}
                                className={`px-6 py-3 text-sm font-medium transition-colors hover:cursor-pointer duration-200 border-b-2 ${
                                    isOngoing ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                }`}
                            >
                                Ongoing Events
                            </button>
                            <button
                                onClick={handlePendingTab}
                                className={`px-6 py-3 text-sm font-medium transition-colors hover:cursor-pointer duration-200 border-b-2 ${
                                    isPending ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                }`}
                            >
                                Up Coming Events
                            </button>
                            <button
                                onClick={handleCompletedTab}
                                className={`px-6 py-3 text-sm font-medium transition-colors hover:cursor-pointer duration-200 border-b-2 ${
                                    isCompleted ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                }`}
                            >
                                Completed Events
                            </button>
                            <button
                                onClick={handlePendingApprovalTab}
                                className={`px-6 py-3 text-sm font-medium transition-colors hover:cursor-pointer duration-200 border-b-2 ${
                                    isPendingApproval ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                }`}
                            >
                                Pending Approvals
                            </button>
                        </div>
                    </div>

                    {/*desktop table view*/}
                    <div className="hidden md:block overflow-x-auto shadow-lg">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-300">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                    Event ID
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                    Event Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                    Event Type
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                    { isOngoing ?  'Date Started' : isPending ? 'Starting Date' : isPendingApproval ? 'Date Requested' : 'Date Completed'}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {tableData.length > 0 ? (
                                tableData.map((event) => (
                                    <tr
                                        className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                        key={event.eventId}
                                        onClick={()=>routeToEventDashboard(event.eventId)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 font-sm">{event.generatedId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-sm">{event.eventName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-sm">{event.eventType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-sm">
                                            {isOngoing ? `${event.startingDate}`: isPending ? `${event.startingDate}`: isPendingApproval ? `${event.dateAdded}`: `${event.dateCompleted}`}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <FileText strokeWidth={1} size={40}/>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No events found
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                There are currently no event records to display.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/*mobile view*/}
                    <div className="md:hidden space-y-4">
                        {tableData.length > 0 ? (
                            tableData.map((event) => (
                                <div
                                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                    key={event.eventId}
                                    onClick={()=>routeToEventDashboard(event.eventId)}
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">ID:</span>
                                            <span className="text-sm text-gray-900 font-sm">{event.generatedId}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Name:</span>
                                            <span className="text-sm text-gray-900 font-sm">{event.eventName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Type:</span>
                                            <span className="text-sm text-gray-900 font-sm">{event.eventType}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">{ isOngoing ?  'Date Started' : isPending ? 'Starting Date' : isPendingApproval ? 'Date Requested' : 'Date Completed'}</span>
                                            <span className="text-sm text-gray-900 font-sm">
                                                {isOngoing ? `${event.startingDate}`: isPending ? `${event.startingDate}`:`${event.dateCompleted}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FileText strokeWidth={1} size={40}/>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No events found
                                    </h3>
                                    <p className="text-sm text-gray-500 text-center">
                                        There are currently no event records to display.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
        </ProtectedRoute>
    )
}
export default Page
