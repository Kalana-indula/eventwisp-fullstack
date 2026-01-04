'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {useParams, useRouter} from "next/navigation";
import {CreateSessionBody} from "@/types/entityTypes";
import {handleApiError} from "@/lib/utils";
import {toast} from "react-hot-toast";
import axios from "axios";
import ProtectedRoute from "@/utils/ProtectedRoutes";

const Page = () => {
    const [venue, setVenue] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [startingTime, setStartingTime] = useState<string>('');
    const [endingTime, setEndingTime] = useState<string>('');

    const params = useParams();

    const eventId = params.eventId;

    const organizerId = params.organizerId;

    //configure routing
    const router = useRouter();

    const routeToEventDashboard = () => {
        router.push(`/organizer/${organizerId}/event/${eventId}/dashboard`);
    }

    useEffect(() => {
        console.log(eventId);
    }, []);

    const handleVenue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVenue(e.target.value);
    }

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    }

    const handleStartingTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartingTime(e.target.value);
    }

    const handleEndingTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndingTime(e.target.value);
    }

    const handleCancel = () => {
        setVenue('');
        setDate('');
        setStartingTime('');
        setEndingTime('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const sessionData: CreateSessionBody = {
            venue: venue,
            date: date,
            startTime: startingTime,
            endTime: endingTime,
            eventId: Number(eventId),
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions`, sessionData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

            toast.success("Session added successfully");
            routeToEventDashboard();
            console.log(response.data);
        } catch (err) {
            handleApiError(err, "Failed to load categories");
            toast.error('Failed to create event');
        }
    }

    return (
        <>
            <ProtectedRoute>
                {/*   header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Create Session</h1>
                    </div>
                </div>

                {/*    main content*/}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white min-h-screen">

                    {/* Form Container */}
                    <div
                        className="session-form bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">SESSION DETAILS</h3>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-md">
                            <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>

                                {/* Venue Field */}
                                <div className="space-y-2">
                                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                                        Venue
                                    </label>
                                    <input
                                        required={true}
                                        type="text"
                                        id="venue"
                                        name="venue"
                                        value={venue}
                                        onChange={handleVenue}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Enter venue name"
                                    />
                                </div>

                                {/* Date Field */}
                                <div className="space-y-2">
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        required={true}
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={date}
                                        onChange={handleDate}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                {/* Start Time Field */}
                                <div className="space-y-2">
                                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                        Start Time
                                    </label>
                                    <input
                                        required={true}
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        value={startingTime}
                                        onChange={handleStartingTime}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                {/* End Time Field */}
                                <div className="space-y-2">
                                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                        End Time
                                    </label>
                                    <input
                                        required={true}
                                        type="time"
                                        id="endTime"
                                        name="endTime"
                                        value={endingTime}
                                        onChange={handleEndingTime}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                    <Button
                                        type="button"
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer"
                                    >
                                        Save Event
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}

export default Page;