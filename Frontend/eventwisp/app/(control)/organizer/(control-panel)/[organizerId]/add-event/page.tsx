'use client'

import React, { useEffect, useState } from 'react'
import {useParams, useRouter} from "next/navigation";
import {CategoryDetails, CreateEventBody, TicketDetails} from "@/types/entityTypes";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {handleApiError} from "@/lib/utils";
import {mediaUpload} from "@/lib/mediaUpload";
import {toast} from "react-hot-toast";
import ProtectedRoute from "@/utils/ProtectedRoutes";

const Page = () => {
    // State for form fields
    const [eventName, setEventName] = useState('')
    const [startingDate, setStartingDate] = useState('')
    const [eventCategories, setEventCategories] = useState<CategoryDetails[]>([]);
    const [eventCategoryId, setEventCategoryId] = useState<number>(0);
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [description, setDescription] = useState('')
    const [ticketTypes, setTicketTypes] = useState<TicketDetails[]>([
        { ticketType: '', price: 0, ticketCount: 0 }
    ])

    //get organizer id
    const params=useParams();

    const organizerId = params.organizerId;

    useEffect(() => {
        getCategories();
    }, []);

    //configure navigation
    const route = useRouter();

    //fetch category
    const getCategories = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
            setEventCategories(response.data.entityList);
        } catch (err) {
            handleApiError(err,"Failed to load categories");
        }
    }

    //handle routing
    const routeToDashboard = (eventId: number) => {
        route.push(`/organizer/${organizerId}/event/${eventId}/dashboard`);
    }

    // Handle input changes
    const handleEventName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventName(e.target.value)
    }

    const handleStartingDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartingDate(e.target.value)
    }


    const handleEventCategory = (value: string) => {
        setEventCategoryId(parseInt(value, 10));
    }

    const handleBannerImage = (e: React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files && e.target.files[0]) {
            console.log(e.target.files[0]);
            setBannerImage(e.target.files[0]);
        }
        // setBannerImage(e.target.value)
    }

    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    // Handle ticket type changes
    const handleTicketTypeChange = (
        index: number,
        field: keyof Omit<TicketDetails, 'ticketId'>,
        value: string
    ) => {
        const updatedTicketTypes = ticketTypes.map((ticket, i) => {
            if (i === index) {
                if (field === 'ticketType') {
                    return { ...ticket, [field]: value }
                } else {
                    // For price and ticketCount, convert string to number
                    const numericValue = value === '' ? 0 : Number(value)
                    return { ...ticket, [field]: numericValue }
                }
            }
            return ticket
        })
        setTicketTypes(updatedTicketTypes)
    }

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { ticketType: '', price: 0, ticketCount: 0 }])
    }

    const removeTicketType = (index: number) => {
        if (ticketTypes.length > 1) {
            setTicketTypes(ticketTypes.filter((_, i) => i !== index))
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Upload image first (if one exists)
            let uploadedUrl: string | null = null;
            if (bannerImage) {
                uploadedUrl = await mediaUpload(bannerImage);
            }

            //Build event data with the uploaded image url
            const eventData: CreateEventBody = {
                eventName:eventName,
                startingDate:startingDate,
                coverImageLink: uploadedUrl,
                description:description,
                eventCategoryId:eventCategoryId,
                organizerId: Number(organizerId),
                tickets: ticketTypes,
            };

            //Post event
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events`, eventData,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Successfully added the event!");
            routeToDashboard(response.data.event.id);

            // Reset form
            setEventName("");
            setStartingDate("");
            setBannerImage(null);
            setDescription("");
            setEventCategoryId(0);
            setTicketTypes([{ ticketType: "", price: 0, ticketCount: 0 }]);

        } catch (err) {
            handleApiError(err, "Failed to create event");
            toast.error("Failed to create event");
        }
    };


    const handleCancel = () => {
        setEventName('')
        setStartingDate('')
        setDescription('')
        setTicketTypes([{ ticketType: '', price: '', ticketCount: 0 }])
    }

    return (
        <ProtectedRoute>
        <>
            {/*Header section*/}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">Add Event</h1>
                </div>
            </div>

            {/*main scrollable content*/}
            <div className="p-3 sm:p-4 md:p-6 bg-white">
                <div className="bg-gray-200 border-l-4 border-blue-500 px-4 py-2 pb-6 mb-6 rounded-r-md shadow-sm">
                    <div>
                        <h3 className="text-gray-500 font-medium py-2">EVENT DETAILS</h3>
                    </div>

                    {/*form content*/}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white shadow-2xl p-6 sm:p-8 rounded-lg">
                            <form className="space-y-6" onSubmit={handleSubmit}>

                                {/*Event name*/}
                                <div>
                                    <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Event name
                                    </label>
                                    <input
                                        id="eventName"
                                        name="eventName"
                                        type="text"
                                        value={eventName}
                                        onChange={handleEventName}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                    />
                                </div>

                                {/*Starting date*/}
                                <div>
                                    <label htmlFor="startingDate"
                                           className="block text-sm font-medium text-gray-700 mb-2">
                                        Starting date
                                    </label>
                                    <input
                                        id="startingDate"
                                        name="startingDate"
                                        type="date"
                                        value={startingDate}
                                        onChange={handleStartingDate}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                    />
                                </div>

                                {/*Event Category*/}
                                <div>
                                    <label htmlFor="eventCategory"
                                           className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Category
                                    </label>
                                    <Select
                                        value={eventCategoryId ? String(eventCategoryId) : undefined}
                                        onValueChange={handleEventCategory}
                                    >
                                        <SelectTrigger
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400 appearance-none bg-white">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {eventCategories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.category}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/*Banner Image*/}
                                <div>
                                    <label htmlFor="bannerImage"
                                           className="block text-sm font-medium text-gray-700 mb-2">
                                        Banner Image
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            id="bannerImage"
                                            name="bannerImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerImage}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="bannerImage"
                                            className="px-4 py-2 border border-gray-400 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                        >
                                            Browse
                                        </label>
                                        <span className="text-sm text-gray-500">
                                            {bannerImage ? 'File selected' : 'No file chosen'}
                                        </span>
                                    </div>
                                </div>

                                {/*Ticket Types Section*/}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-700">Ticket Information</h3>
                                    </div>

                                    {ticketTypes.map((ticket, index) => (
                                        <div key={index}
                                             className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Ticket Type
                                                </label>
                                                <input
                                                    type="text"
                                                    value={ticket.ticketType}
                                                    onChange={(e) => handleTicketTypeChange(index, 'ticketType', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Ticket price
                                                </label>
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-500 mr-2">LKR</span>
                                                    <input
                                                        type="number"
                                                        value={ticket.ticketPrice}
                                                        onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Ticket count
                                                </label>
                                                <input
                                                    type="number"
                                                    value={ticket.ticketCount}
                                                    onChange={(e) => handleTicketTypeChange(index, 'ticketCount', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                {ticketTypes.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTicketType(index)}
                                                        className="px-3 py-2 text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addTicketType}
                                        className="w-full py-2 px-4 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Add Ticket Type
                                    </button>
                                </div>

                                {/*Description*/}
                                <div>
                                    <label htmlFor="description"
                                           className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={description}
                                        onChange={handleDescription}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400 resize-vertical"
                                    />
                                </div>

                                {/*Action buttons*/}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer"
                                    >
                                        Save Event
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium bg-white transition-colors text-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
        </ProtectedRoute>
    )
}

export default Page