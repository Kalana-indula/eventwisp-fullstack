'use client'
import React, {useEffect, useState} from 'react'
import {useRouter} from "next/navigation";
import axios, {AxiosError} from "axios";
import {OrganizerDetails} from "@/types/entityTypes";
import {User} from "lucide-react";
import ManagerProtectedRoutes from "@/utils/ManagerProtectedRoutes";
import {toast} from "react-hot-toast";


const Page = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'disapproved'>('pending');
    const router = useRouter();

    // Sample data for demonstration
    const [pendingOrganizers, setPendingOrganizers] = useState<OrganizerDetails[]>([]);

    const [approvedOrganizers, setApprovedOrganizers] = useState<OrganizerDetails[]>([]);

    const [disapprovedOrganizers, setDisapprovedOrganizers] = useState<OrganizerDetails[]>([]);

    const currentData =
        activeTab === 'pending' ? pendingOrganizers :
            activeTab === 'approved' ? approvedOrganizers :
                disapprovedOrganizers;

    const routeToOrganizer = (id: number) => {
        router.push(`/manager/organizers/${id}`);
    }

    //fetch all pending accounts
    const getPendingAccounts = async (): Promise<void> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/pending`);
            setPendingOrganizers(response.data.entityList);
            console.log(response.data.entityList);
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

    //fetch all approved accounts
    const getApprovedAccounts = async (): Promise<void> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/approved`);
            setApprovedOrganizers(response.data.entityList);
            console.log(response.data.entityList);
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

    //fetch all disapproved accounts
    const getDisapprovedAccounts = async (): Promise<void> => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/disapproved`);
            setDisapprovedOrganizers(response.data.entityList);
            console.log(response.data.entityList);
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

    //load data at page loading
    useEffect(() => {
        getPendingAccounts();
        getApprovedAccounts()
        getDisapprovedAccounts()
    }, []);

    return (
        <>
            <ManagerProtectedRoutes>
                {/* Header section */}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-[10px] p-[10px]">
                        <h1 className="text-2xl font-semibold text-gray-900">Organizers</h1>
                        <p className="mt-1 text-gray-600">Organizers List</p>
                    </div>
                </div>

                {/* main content */}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">ORGANIZER DETAILS</h3>
                        </div>

                        {/* Tab Navigation */}
                        <div className="mb-4">
                            <div className="flex border-b border-gray-300">
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                                        activeTab === 'pending'
                                            ? 'border-blue-500 text-blue-600 bg-white'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                                >
                                    Pending Approval
                                </button>
                                <button
                                    onClick={() => setActiveTab('approved')}
                                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                                        activeTab === 'approved'
                                            ? 'border-blue-500 text-blue-600 bg-white'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                                >
                                    Approved Accounts
                                </button>
                                <button
                                    onClick={() => setActiveTab('disapproved')}
                                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                                        activeTab === 'disapproved'
                                            ? 'border-blue-500 text-blue-600 bg-white'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                                >
                                    Disapproved Accounts
                                </button>
                            </div>
                        </div>

                        {/* desktop table view */}
                        <div className="hidden md:block overflow-x-auto shadow-lg">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Organizer ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Organizer Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Date Registered
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {currentData && currentData.length > 0 ? (
                                    currentData.map((organizer: OrganizerDetails) => (
                                        <tr className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                            key={organizer.id}
                                            onClick={() => routeToOrganizer(organizer.id)}>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{organizer.organizerId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{organizer.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-sm">{organizer.nic}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                                    <User strokeWidth={1} size={48}/>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    No {activeTab} organizers
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    There are currently no {activeTab} organizer records to display.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* mobile view */}
                        <div className="md:hidden space-y-4">
                            {(() => {
                                return currentData && currentData.length > 0
                                    ? currentData.map((organizer: OrganizerDetails, index: number) => (
                                        <div
                                            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                            key={`${organizer.id}-${index}`}
                                            onClick={() => routeToOrganizer(organizer.id)}>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-500">ID:</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-medium">{organizer.id}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-500">Name:</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-medium">{organizer.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-500">Date:</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-medium">{organizer.nic}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : (
                                        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                                    <User strokeWidth={1} size={48}/>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    No {activeTab} organizers
                                                </h3>
                                                <p className="text-sm text-gray-500 text-center">
                                                    There are currently no {activeTab} organizer records to display.
                                                </p>
                                            </div>
                                        </div>
                                    )
                            })()}
                        </div>
                    </div>
                </div>
            </ManagerProtectedRoutes>
        </>
    )
}
export default Page;