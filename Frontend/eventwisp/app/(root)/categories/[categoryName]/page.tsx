'use client'

import React, {useEffect, useState} from 'react'
import {useParams} from "next/navigation";
import {SessionCardDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";
import EventCard from "@/app/(root)/app-components/EventCard";
import MainFooter from "@/app/(root)/app-components/MainFooter";
import {Calendar} from "lucide-react";

const Page = () => {

    //states
    const [pageHeader, setPageHeader] = useState<string>('');
    const [sessions,setSessions]=useState<SessionCardDetails[]>([])

    //get params
    const params=useParams();

    //get category id
    const categoryName=params.categoryName;

    useEffect(() => {
        console.log("categoryName: "+categoryName);
        if (categoryName) {
            getEventsByCategory();
        }
    }, [categoryName]);

    //get event details
    const getEventsByCategory = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/categories/${categoryName}/sessions`);
            console.log('Sessions By category:', response.data);
            setSessions(response.data.entityList);
            setPageHeader(response.data.remarks);
        } catch (error) {
            console.error('Error fetching events by category:', error);

            // Check if it's an AxiosError (HTTP error)
            if (error instanceof AxiosError) {
                console.log('This is an AxiosError');
                console.log('Status:', error.response?.status);
                console.log('Status Text:', error.response?.statusText);
                console.log('Response Data:', error.response?.data);

                if (error.response?.status === 404) {
                    // 404 means no events found for this category - this is normal
                    console.log("No events found for category:", categoryName);
                } else {
                    // Other HTTP errors (500, network issues, etc.)
                    console.error("HTTP Error:", error.response?.status, error.response?.data);
                }
            } else {
                // Non-HTTP errors (network timeout, etc.)
                console.error("Network or other error:", error);
            }

            // Always set empty array for any error
            setSessions([]);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header section */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 border-b border-gray-200/30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-4">
                        {/* Main Title */}
                        <div className="relative inline-block">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    <span
                        className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        {pageHeader}
                    </span>
                            </h1>
                            {/* Accent Line */}
                            <div
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full"
                                style={{backgroundColor: "#193cb8"}}>
                            </div>
                        </div>

                        {/* Subtitle */}
                        <p className="mt-3 text-sm sm:text-base text-gray-600 font-light max-w-xl mx-auto">
                            Discover amazing events happening around you
                        </p>

                        {/* Decorative Elements */}
                        <div className="mt-3 flex justify-center items-center gap-2 opacity-60">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div
                                className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: "#193cb8"}}></div>
                            <div
                                className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 px-3 py-1 sm:px-4 sm:py-2 md:px-8 bg-white">
                {/* Events grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sessions && sessions.length > 0 ? (
                        sessions.map((session: SessionCardDetails) => (
                            <div key={session.sessionId} className="flex justify-center">
                                <EventCard session={session}/>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-gray-50 p-8 rounded-md text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div
                                    className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                    <Calendar strokeWidth={1.25} size={40}/>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No events available in this category</h3>
                                <p className="text-sm text-gray-500">Check back later for upcoming events.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/*Footer section*/}
            <footer>
                <MainFooter/>
            </footer>
        </div>
    )
}
export default Page