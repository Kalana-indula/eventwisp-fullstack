'use client'

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {OrganizerEarningDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {getValueString} from "@/lib/utils";
import {FileText} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import AdminProtectedRoute from "@/utils/AdminProtectedRoutes";

const Page = () => {

    const [organizerEarnings, setOrganizerEarnings] = useState<OrganizerEarningDetails[]>([]);
    const [searchId, setSearchId] = useState<string>("");

    //searched organizer details
    const [organizerDetails, setOrganizerDetails] = useState<OrganizerEarningDetails | null>(null);

    //get params
    const route = useRouter();

    //load data at the page loading
    useEffect(() => {
        getOrganizerEarningDetails();
    }, []);

    // Watch for searchId changes - when cleared, reset to default data
    useEffect(() => {
        if (searchId === "") {
            setOrganizerDetails(null);
        }
    }, [searchId]);

    //get organizer earning details
    const getOrganizerEarningDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/earnings`);
            setOrganizerEarnings(response.data.entityList);
            console.log(response.data.entityList);
        } catch (err) {
            if (err instanceof AxiosError) {
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
                toast.error(errorMessage);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    }

    //get organizer by organizer id
    const getOrganizerByOrganizerId = async (organizerId: string): Promise<void> => {

        // Add validation check
        if (!organizerId.trim()) {
            toast.error("Please enter an Organizer ID before searching");
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/id/${organizerId}/earnings`);

            if (response.data.entityData) {
                setOrganizerDetails(response.data.entityData);
                console.log("Found organizer:", response.data.entityData);
            } else {
                console.log(response.data.message);
                toast(response.data.message);
                setOrganizerDetails(null);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    console.log("No organizer was found");
                    toast.error("No organizer was found");
                    setOrganizerDetails(null);
                } else {
                    console.error("Error fetching organizer:", err);
                    const errorMessage = err.response?.data?.message || 'Failed to find organizer';
                    toast.error(errorMessage);
                }
            } else {
                console.error("Unexpected error:", err);
                toast.error('An unexpected error occurred');
            }
        }
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchId(e.target.value);
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle search button click
    const handleSearch = () => {
        if (searchId.trim()) {
            getOrganizerByOrganizerId(searchId.trim());
        } else {
            toast.error("Please enter an Organizer ID");
        }
    };

    const roteToUser = (id: number) => {
        route.push(`/admin/statistics/organizer/${id}`);
    }

    // Determine which data to display in table
    const displayData = organizerDetails ? [organizerDetails] : organizerEarnings;

    return (
        <>
            <AdminProtectedRoute>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Statistics</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">Analyze Financial Data</p>
                    </div>
                </div>

                {/*    scrollable content*/}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white min-h-screen">

                    {/*search*/}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        {/*    Search Organizer*/}
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">SEARCH ORGANIZER BY ID</h3>
                        </div>
                        <div className="flex justify-center sm:justify-start">
                            <div className="flex flex-col sm:flex-row w-full max-w-sm items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="Organizer ID"
                                    className="bg-white shadow-lg"
                                    value={searchId}
                                    onChange={handleSearchChange}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button
                                    type="button"
                                    onClick={handleSearch}
                                    className="w-full sm:w-1/5 bg-blue-600 border border-blue-600 text-white rounded-md shadow-sm font-medium py-2 sm:py-3 px-4 text-sm flex items-center justify-center hover:bg-blue-700 active:bg-blue-600 active:text-white transition-colors duration-200 hover:cursor-pointer"
                                >
                                    Search
                                </Button>

                            </div>
                        </div>
                    </div>

                    {/*table*/}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div className="flex justify-between items-center py-2">
                            <h3 className="text-gray-500 font-medium">EARNING DETAILS</h3>
                            {organizerDetails && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearchId("");
                                        setOrganizerDetails(null);
                                    }}
                                    className="text-xs"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                        <div>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
                                <table
                                    className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Organizer
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Organizer</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Total
                                            Revenue (LKR.)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {displayData && displayData.length > 0 ? (
                                        displayData.map((earning: OrganizerEarningDetails) => (
                                            <tr className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                                key={earning.organizerId}
                                                onClick={() => roteToUser(Number(earning.id))}>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-sm">{earning.organizerId}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-sm">{earning.organizerName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-sm">{getValueString(earning.totalEarnings)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div
                                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-600">
                                                        <FileText strokeWidth={1} size={40}/>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No records
                                                        available</h3>
                                                    <p className="text-sm text-gray-500">There are currently no records
                                                        to display.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {displayData && displayData.length > 0 ? (
                                    displayData.map((earning: OrganizerEarningDetails) => (
                                        <div
                                            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                            key={earning.organizerId}
                                            onClick={() => roteToUser(Number(earning.organizerId))}>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-500">Organizer ID:</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-sm">{earning.organizerId}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-500">Organizer Name:</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-sm">{earning.organizerName}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-500">Total Revenue (LKR.) :</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-sm">{getValueString(earning.totalEarnings)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                        <div className="flex flex-col items-center justify-center">
                                            <div
                                                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-600">
                                                <FileText strokeWidth={1} size={40}/>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No records
                                                available</h3>
                                            <p className="text-sm text-gray-500 text-center">There are currently no
                                                records to display.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AdminProtectedRoute>
        </>
    )
}
export default Page