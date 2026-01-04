'use client'

import React, {useEffect, useState} from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {EventDetails} from "@/types/entityTypes";
import {FileText} from "lucide-react";
import ManagerProtectedRoutes from "@/utils/ManagerProtectedRoutes";

interface EventStatus {
    id: number;
    statusName: string;
}

const Page = () => {

    //set event details state
    const [eventDetails, setEventDetails] = useState<EventDetails[]>([]);
    const [status, setStatus] = useState<EventStatus[]>([]);
    const [searchedId, setSearchedId] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    //configure routing
    const router = useRouter();

    const routeToEvent = (eventId: number) => {
        router.push(`/manager/dashboard/events/${eventId}`);
    }

    useEffect(() => {
        getEventDetails();
        getEventStatusList();
    }, []);

    //fetch event details
    const getEventDetails = async (): Promise<void> => {

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/details`);
            console.log(response.data);
            setEventDetails(response.data.eventDetails);
        } catch (error) {
            console.log(error);
        }
    }

    // Fetch events by status
// Updated getEventsByStatus function
    const getEventsByStatus = async (statusId: number): Promise<void> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/status/${statusId}`);

            // Check if response data exists and has events
            if (response.data && response.data.entityList && response.data.entityList.length > 0) {
                setEventDetails(response.data.entityList);
            } else {
                // Set empty array to trigger the "No events available" message in the table
                setEventDetails([]);
                toast.error("No events found for the selected status");
            }
        } catch (error) {
            console.log(error);
            setEventDetails([]);
            toast.error("Failed to fetch events by status");
        }
    };

    // Fetch status list
    const getEventStatusList = async (): Promise<void> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/event-status`);
            setStatus(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // get event by generated ID (String) using new API shape { message, entityData }
    const getEventById = async (eventId: string): Promise<void> => {
        if (!eventId.trim()) {
            toast.error("Please enter an Event ID before searching");
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/search/events/${eventId}`;
            const { data } = await axios.get<{ message: string; entityData: EventDetails | null }>(url);

            if (data?.entityData) {
                // Your state expects an array; wrap the single DTO
                setEventDetails([data.entityData]);
                toast.success(data.message || "Event loaded");
            } else {
                setEventDetails([]);
                toast.error(data?.message || "No event was found");
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    setEventDetails([]);
                    toast.error("No event was found");
                } else {
                    const errorMessage =
                        (err.response?.data as any)?.message || err.message || "Failed to find event";
                    toast.error(errorMessage);
                }
            } else {
                console.error("Unexpected error:", err);
                toast.error("An unexpected error occurred");
            }
        }
    };

    //fetch value from search field
    const handleSearchedId = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchedId(e.target.value);

        //get all details as the field is cleared
        if (!e.target.value.trim()) {
            getEventDetails();
            setSelectedStatus('');
        }
    }

    // Handle status change
    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        //set selected status
        if (value === "all" || !value) {
            // No status selected or "All" selected → fetch all events
            getEventDetails();
        } else {
            // Find the status ID by status name
            const selectedStatus = status.find(s => s.statusName === value);
            if (selectedStatus) {
                console.log(selectedStatus.id);
                getEventsByStatus(selectedStatus.id);
            }
        }
    };
    return (
        <>
            <ManagerProtectedRoutes>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-[10px] p-[10px]">
                        <h1 className="text-2xl font-semibold text-gray-900">Manager Dashboard</h1>
                        <p className="mt-1 text-gray-600">Events List</p>
                    </div>
                </div>

                {/*    main content*/}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">
                    {/*    search bar*/}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        {/*    Search Organizer*/}
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">SEARCH EVENT BY ID</h3>
                        </div>
                        <div className="flex justify-center sm:justify-start">
                            <div className="flex flex-col sm:flex-row w-full max-w-sm items-center gap-2">
                                <Input type="email"
                                       placeholder="Event ID"
                                       className="bg-white shadow-lg"
                                       onChange={handleSearchedId}
                                />
                                <Button
                                    type="submit"
                                    onClick={() => getEventById(searchedId)}
                                    className="w-full sm:w-1/5 bg-blue-600 border border-blue-600 text-white rounded-md shadow-sm font-medium py-2 sm:py-3 px-4 text-sm flex items-center justify-center hover:bg-blue-700 active:bg-blue-600 active:text-white transition-colors duration-200 hover:cursor-pointer"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/*    sort*/}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        {/*    area title*/}
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">SORT</h3>
                        </div>

                        {/*drop downs*/}
                        <div className="flex items-start flex-col sm:flex-row space-y-4 space-x-4">

                            <div>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={(value) => {
                                        setSelectedStatus(value);
                                        handleStatusChange(value);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px] bg-white shadow-lg">
                                        <SelectValue placeholder="Select Status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="all">All Events</SelectItem>
                                            {status && status.map((statusType: EventStatus) => (
                                                <SelectItem value={statusType.statusName} key={statusType.id}>
                                                    {statusType.statusName}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/*    table*/}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        {/*    area title*/}
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">EVENT DETAILS</h3>
                        </div>

                        <div>
                            {/*    desktop table view*/}
                            <div className="hidden md:block overflow-x-auto shadow-lg">
                                <table
                                    className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                                            Organizer
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Date Added
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                            Status
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {eventDetails && eventDetails.length > 0 ? (
                                        eventDetails.map((event: EventDetails) => (
                                            <tr className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                                key={event.eventId}
                                                onClick={() => routeToEvent(event.eventId)}
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-600 font-sm">{event.generatedId}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-sm">{event.eventName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-sm">{event.eventType}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-sm">{event.organizer}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-sm">{event.dateAdded}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-sm">{event.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div
                                                        className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
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
                                {(() => {
                                    return eventDetails && eventDetails.length > 0
                                        ? eventDetails.map((event: EventDetails) => (
                                            <div
                                                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                                key={event.eventId}
                                                onClick={() => routeToEvent(event.eventId)}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-900">ID:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{event.generatedId}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-900">Name:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{event.eventName}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-900">Type:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{event.eventType}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-900">Organizer:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{event.organizer}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-900">Date Added:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{event.dateAdded}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-900">Status:</span>
                                                        <span
                                                            className="text-sm text-gray-600 font-sm">{event.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : (
                                            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div
                                                        className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                                        <FileText strokeWidth={1} size={40}/>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events
                                                        available</h3>
                                                    <p className="text-sm text-gray-500 text-center">There are currently
                                                        no
                                                        event records to display.</p>
                                                </div>
                                            </div>
                                        )
                                })()}

                            </div>
                        </div>

                    </div>

                </div>
            </ManagerProtectedRoutes>
        </>
    )
}
export default Page