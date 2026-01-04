'use client'

import React, {useEffect, useState} from 'react'
import {MdManageAccounts} from "react-icons/md";
import {RiUserAddLine} from "react-icons/ri";
import {MdOutlineDashboard} from "react-icons/md";
import axios from "axios";
import Image from "next/image";
import {useRouter} from "next/navigation";
import AdminProtectedRoute from "@/utils/AdminProtectedRoutes";

const Page = () => {
    //get current date and format it
    const getCurrentDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear());
        return `${day}/${month}/${year}`;
    }

    //fetch organizer count
    const [approvedOrganizers, setApprovedOrganizers] = useState<number | string>(0);
    const [pendingOrganizerAccounts, setPendingOrganizerAccounts] = useState<number|string>(0);
    const [onGoingEvents, setOnGoingEvents] = useState<number | string>(0);
    const [pendingEvents, setPendingEvents] = useState<number|string>(0);

    //configure navigation
    const router = useRouter();

    //navigate
    const routeToAddAdmin = () => {
        router.push("/admin/auth/register");
    }

    const routeToAddManager = (): void => {
        router.push("/admin/add-manager");
    }

    const routeToManagerControl = (): void => {
        router.push("/admin/manager-control");
    }

    const routeToManagerDachboard = (): void => {
        router.push("/manager/dashboard");
    }

    //load data at page loading
    useEffect(() => {
        getApprovedOrganizerCount();
        getPendingOrganizerCount();
        getPendingEvents();
        getOngoingEvents();
    }, []);

    //fetch organizers count from api
    const getApprovedOrganizerCount = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/approved`);
            console.log(response.data.remarks);
            setApprovedOrganizers(response.data.remarks);

        } catch (error) {
            console.log(error);

            //check the error
            if (axios.isAxiosError(error) && error.response) {
                setApprovedOrganizers(error.response.data.message);
            } else {
                setApprovedOrganizers("Error Loading Data");
            }
        }
    }

    const getPendingOrganizerCount = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/pending`);
            console.log(response.data.remarks);
            setPendingOrganizerAccounts(response.data.remarks);

        } catch (error) {
            console.log(error);

            //check the error
            if (axios.isAxiosError(error) && error.response) {
                setPendingOrganizerAccounts(error.response.data.message);
            } else {
                setPendingOrganizerAccounts("Error Loading Data");
            }
        }
    }

    //fetch ongoing events
    const getOngoingEvents = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/status/3`);
            setOnGoingEvents(response.data.remarks);
            console.log(response.data.remarks);
        } catch (error) {
            console.log(error);

            if (axios.isAxiosError(error) && error.response) {
                setOnGoingEvents(error.response.data.message);
            } else {
                setOnGoingEvents("Error Loading Data");
            }
        }
    }

    const getPendingEvents = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/status/1`);
            setPendingEvents(response.data.remarks);
            console.log(response.data.remarks);
        } catch (error) {
            console.log(error);

            if (axios.isAxiosError(error) && error.response) {
                setPendingEvents(error.response.data.message);
            } else {
                setPendingEvents("Error Loading Data");
            }
        }
    }

    return (
        <>
            <AdminProtectedRoute>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="flex justify-center items-center text-[20px] h-[50px] py-[30px]">
                        <h1>Admin Dashboard</h1>
                    </div>
                </div>

                {/*Scrollable content*/}
                <div className="p-3 sm:p-4 md:p-6">
                    <div>
                        <div className="display-date bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                            <span className="text-gray-500 font-medium">DATE:</span>
                            <span className="text-gray-800 font-semibold ml-2">{getCurrentDate()}</span>
                        </div>

                        {/*Organizer Details*/}
                        <div className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                            <div>
                                <h3 className="text-gray-500 font-medium">ORGANIZER STATUS</h3>
                            </div>

                            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="card flex items-center justify-between bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gray-300 rounded-full flex-shrink-0">
                                            <Image src="/pending.png" alt="pending" height={28} width={28}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500 font-medium">Pending Approvals</span>
                                            <span className="text-2xl font-bold text-gray-800">{pendingOrganizerAccounts}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex items-center justify-between bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gray-300 rounded-full flex-shrink-0">
                                            <Image src="/approved.png" alt="approved" height={28} width={28}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500 font-medium">Approved Organizers</span>
                                            <span className="text-2xl font-bold text-gray-800">{approvedOrganizers}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*Event details*/}
                        <div className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                            <div>
                                <h3 className="text-gray-500 font-medium">EVENT STATUS</h3>
                            </div>

                            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="card flex items-center justify-between bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gray-300 rounded-full flex-shrink-0">
                                            <Image src="/pending.png" alt="pending" height={28} width={28}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500 font-medium">Pending Approvals</span>
                                            <span className="text-2xl font-bold text-gray-800">{pendingEvents}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex items-center justify-between bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gray-300 rounded-full flex-shrink-0">
                                            <Image src="/ongoing.png" alt="ongoing" height={28} width={28}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500 font-medium">On Going Events</span>
                                            <span className="text-2xl font-bold text-gray-800">{onGoingEvents}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Action buttons*/}
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 my-[20px] gap-[20px] mx-[10px]">
                        <button
                            className="h-[150px] bg-blue-600 text-white flex flex-col justify-center items-center my-[5px] hover:bg-blue-700 transition-colors duration-200 rounded-[5px] cursor-pointer"
                            onClick={routeToAddAdmin}>
                            <div className="text-4xl sm:text-2xl md:text-[40px]">
                                <MdManageAccounts/>
                            </div>
                            <div className="text-base sm:text-sm md:text-base mt-2">
                                Add Admin
                            </div>
                        </button>
                        <button
                            className="h-[150px] bg-blue-600 text-white flex flex-col justify-center items-center my-[5px] hover:bg-blue-700 transition-colors duration-200 rounded-[5px] cursor-pointer"
                            onClick={routeToManagerControl}>
                            <div className="text-4xl sm:text-2xl md:text-[40px]">
                                <MdManageAccounts/>
                            </div>
                            <div className="text-base sm:text-sm md:text-base mt-2">
                                Manager Control
                            </div>
                        </button>
                        <button
                            className="h-[150px] bg-blue-600 text-white flex flex-col justify-center items-center my-[5px] hover:bg-blue-700 transition-colors duration-200 rounded-[5px] cursor-pointer"
                            onClick={routeToAddManager}>
                            <div className="text-4xl sm:text-2xl md:text-[40px]">
                                <RiUserAddLine/>
                            </div>
                            <div className="text-base sm:text-sm md:text-base mt-2">
                                Add Manager
                            </div>
                        </button>
                        <div
                            className="h-[150px] bg-blue-600 text-white flex flex-col justify-center items-center my-[5px] hover:bg-blue-700 transition-colors duration-200 rounded-[5px] cursor-pointer"
                            onClick={routeToManagerDachboard}>
                            <div className="text-4xl sm:text-2xl md:text-[40px]">
                                <MdOutlineDashboard/>
                            </div>
                            <div className="text-base sm:text-sm md:text-base mt-2">
                                Manager Dashboard
                            </div>
                        </div>
                    </div>
                </div>
            </AdminProtectedRoute>
        </>
    )
}

export default Page;