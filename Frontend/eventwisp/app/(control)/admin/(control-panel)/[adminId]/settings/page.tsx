'use client'

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {AdminDetails} from "@/types/entityTypes";
import AdminProtectedRoute from "@/utils/AdminProtectedRoutes";


const Page = () => {

    const [adminDetails, setAdminDetails] = useState<AdminDetails>();

    const params = useParams();

    const adminId = params.adminId;

    //configure navigation
    const router = useRouter();

    useEffect(() => {
        getAdminDetails();
    }, []);

    const routeToUpdatePassword = () => {
        router.push(`/admin/${adminId}/settings/update-password`);
    }

    const routeToUpdateEmail = () => {
        router.push(`/admin/${adminId}/settings/update-email`);
    }

    const routeToUpdateContact = () => {
        router.push(`/admin/${adminId}/settings/update-contact`);
    }

    const routeToDeleteAccount = () => {
        router.push(`/admin/${adminId}/settings/delete-account`);
    }

    const getAdminDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admins/${adminId}`);
            console.log(response.data);
            setAdminDetails(response.data);
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

    return (
        <>
            <AdminProtectedRoute>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">Update account status</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-3 sm:p-4 md:p-6 bg-white">

                    {/*Admin user information */}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium">ADMIN DETAILS</h3>
                        </div>
                        <div className="bg-white shadow-xl text-black p-4 sm:p-6 rounded-lg my-[10px] relative">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex justify-center items-center sm:h-32 sm:w-32 p-[18px] sm:p-[20px] mx-[10px] bg-gray-300 rounded-full">
                                    <Image src="/admin-user.png" alt="pending" height={64} width={64}/>
                                </div>
                                <div className="sm:py-[20px]">
                                    <h2 className="text-lg sm:text-2xl font-semibold">{}</h2>
                                    <div
                                        className="break-words text-gray-700 font-semibold text-[24px]">{adminDetails?.firstName} {adminDetails?.lastName}</div>
                                    <div className="break-words text-gray-700">Contact : {adminDetails?.phone}</div>
                                    <div className="break-words text-gray-700">Email : {adminDetails?.email}</div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings select Section */}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium">ADMIN ACCOUNT SETTINGS</h3>
                        </div>

                        <div className="flex justify-center py-4 sm:py-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                                <div
                                    className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[300px] sm:w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                    onClick={routeToUpdatePassword}>
                                    <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                        <Image src="/update-password.png" alt="update-password" height={64} width={64}
                                               className="sm:h-[75px] sm:w-[75px]"/>
                                    </div>
                                    <div className="absolute bottom-3 sm:bottom-4">
                                        <span className="font-medium text-gray-900">Password</span>
                                    </div>
                                </div>

                                <div
                                    className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[300px] sm:w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                    onClick={routeToUpdateEmail}>
                                    <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                        <Image src="/update-email.png" alt="update-email" height={64} width={64}
                                               className="sm:h-[75px] sm:w-[75px]"/>
                                    </div>
                                    <div className="absolute bottom-3 sm:bottom-4">
                                        <span className="font-medium text-gray-900">Email</span>
                                    </div>
                                </div>

                                <div
                                    className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[300px] sm:w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                    onClick={routeToUpdateContact}>
                                    <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                        <Image src="/update-contact.png" alt="update-email" height={64} width={64}
                                               className="sm:h-[75px] sm:w-[75px]"/>
                                    </div>
                                    <div className="absolute bottom-3 sm:bottom-4">
                                        <span className="font-medium text-gray-900">Contact Details</span>
                                    </div>
                                </div>

                                <div
                                    className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[300px] sm:w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                    onClick={routeToDeleteAccount}>
                                    <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                        <Image src="/delete-account.png" alt="update-email" height={64} width={64}
                                               className="sm:h-[75px] sm:w-[75px]"/>
                                    </div>
                                    <div className="absolute bottom-3 sm:bottom-4">
                                        <span className="font-medium text-gray-900">Delete Account</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </AdminProtectedRoute>
        </>
    )
}

export default Page;