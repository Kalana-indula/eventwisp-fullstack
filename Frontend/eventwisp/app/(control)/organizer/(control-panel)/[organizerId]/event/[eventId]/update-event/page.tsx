'use client'

import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from "next/navigation"
import axios, {AxiosError} from "axios"
import {mediaUpload} from "@/lib/mediaUpload"
import {toast} from "react-hot-toast"
import {handleApiError} from "@/lib/utils"
import ProtectedRoute from "@/utils/ProtectedRoutes";

const Page = () => {
    // State for form fields
    const [startingDate, setStartingDate] = useState('')
    const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null) // existing
    const [newBannerImage, setNewBannerImage] = useState<File | null>(null)   // new file
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)


    // Get params
    const params = useParams()
    const organizerId = params.organizerId
    const eventId = params.eventId
    const router = useRouter()

    useEffect(() => {
        getEventDetails();
    }, []);

    // Handle input changes
    const handleStartingDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartingDate(e.target.value)
    }

    const handleBannerImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewBannerImage(e.target.files[0])
        }
    }

    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            let uploadedUrl: string | null = null

            // If a new file is selected, upload it
            if (newBannerImage) {
                uploadedUrl = await mediaUpload(newBannerImage)
            }

            // Build update data
            const updateData: any = {}

            if (startingDate) updateData.startingDate = startingDate
            if (uploadedUrl) updateData.coverImageLink = uploadedUrl
            if (description) updateData.description = description

            if (Object.keys(updateData).length === 0) {
                toast.error("No changes detected")
                setIsSubmitting(false)
                return
            }

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}`,
                updateData,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            )

            toast.success("Successfully updated the event!")
            router.push(`/organizer/${organizerId}/event/${eventId}/dashboard`)

        } catch (err) {
            handleApiError(err, "Failed to update event")
            toast.error("Failed to update event")
        } finally {
            setIsSubmitting(false)
        }
    }


    //get event details
    const getEventDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/details`);
            //set event state
            setStartingDate(response.data.entityData.startingDate);
            setBannerImageUrl(response.data.entityData.coverImageLink);
            setDescription(response.data.entityData.eventDescription);
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

    const handleCancel = () => {
        router.push(`/organizer/${organizerId}/event/${eventId}/dashboard`)
    }

    return (
        <>
            <ProtectedRoute>
                {/* Header section */}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Update Event Details</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">Some times you need to make changes</p>
                    </div>
                </div>

                {/* Main scrollable content */}
                <div className="p-3 sm:p-4 md:p-6 bg-white">
                    <div className="bg-gray-200 border-l-4 border-blue-500 px-4 py-2 pb-6 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">UPDATE EVENT INFORMATION</h3>
                        </div>

                        {/* Form content */}
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white shadow-2xl p-6 sm:p-8 rounded-lg">
                                <form className="space-y-6" onSubmit={handleSubmit}>

                                    {/* Starting date */}
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

                                    {/* Banner Image */}
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
                                             {newBannerImage ? newBannerImage.name : bannerImageUrl ? 'Existing image loaded' : 'No file chosen'}
                                        </span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Upload a new image to replace the
                                            current banner</p>
                                    </div>

                                    {/* Description */}
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
                                            placeholder="Enter event description..."
                                        />
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Updating...' : 'Update Event'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={isSubmitting}
                                            className="flex-1 flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium bg-white transition-colors text-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}

export default Page