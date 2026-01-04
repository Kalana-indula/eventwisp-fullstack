'use client'

import React from 'react'
import Image from "next/image";
import {MonitorCog, SquareUser} from "lucide-react";
import {useRouter} from "next/navigation";
import AdminProtectedRoute from "@/utils/AdminProtectedRoutes";

const Page = () => {

    //configure navigation
    const router = useRouter();

    const routeToPlatformStats = () => {
        router.push("/admin/statistics/platform");
    }

    const routeToOrganizerStats = () => {
        router.push("/admin/statistics/organizer");
    }
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

                {/* Main Content */}
                <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
                    {/* Statistics Section */}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium">STATISTICS OVERVIEW</h3>
                        </div>

                        <div className="flex justify-center py-4 sm:py-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                                <div
                                    className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[250px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                    onClick={routeToPlatformStats}>
                                    <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                        <MonitorCog strokeWidth={1.25} height={64} width={64}
                                                    className="sm:h-[75px] sm:w-[75px]"/>
                                    </div>
                                    <div className="absolute bottom-3 sm:bottom-4">
                                        <span className="font-medium text-gray-900">Platform</span>
                                    </div>
                                </div>

                                <div
                                    className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[250px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                    onClick={routeToOrganizerStats}>
                                    <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                        <SquareUser strokeWidth={1.25} height={64} width={64}
                                                    className="sm:h-[75px] sm:w-[75px]"/>
                                    </div>
                                    <div className="absolute bottom-3 sm:bottom-4">
                                        <span className="font-medium text-gray-900">Organizer</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Statistics Cards */}
                    {/*<div*/}
                    {/*    className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">*/}
                    {/*    <div>*/}
                    {/*        <h3 className="text-gray-500 font-medium">DETAILED METRICS</h3>*/}
                    {/*    </div>*/}

                    {/*    <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[30px] py-4">*/}
                    {/*        <div*/}
                    {/*            className="card flex items-center bg-white px-[10px] py-[30px] rounded-[8px] shadow-lg my-[5px] mx-[10px] relative hover:shadow-xl transition-shadow duration-300">*/}
                    {/*            <div className="p-[12px] mx-[10px] bg-gray-300 rounded-full">*/}
                    {/*                <Image src="/platform.png" alt="metric" height={32} width={32}/>*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <div className="font-medium text-gray-900">*/}
                    {/*                    Total Users*/}
                    {/*                </div>*/}
                    {/*                <div className="text-gray-700">*/}
                    {/*                    12,547*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}

                    {/*        <div*/}
                    {/*            className="card flex items-center bg-white px-[10px] py-[30px] rounded-[8px] shadow-lg my-[5px] mx-[10px] relative hover:shadow-xl transition-shadow duration-300">*/}
                    {/*            <div className="p-[12px] mx-[10px] bg-gray-300 rounded-full">*/}
                    {/*                <Image src="/platform.png" alt="metric" height={32} width={32}/>*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <div className="font-medium text-gray-900">*/}
                    {/*                    Active Sessions*/}
                    {/*                </div>*/}
                    {/*                <div className="text-gray-700">*/}
                    {/*                    3,247*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}

                    {/*        <div*/}
                    {/*            className="card flex items-center bg-white px-[10px] py-[30px] rounded-[8px] shadow-lg my-[5px] mx-[10px] relative hover:shadow-xl transition-shadow duration-300">*/}
                    {/*            <div className="p-[12px] mx-[10px] bg-gray-300 rounded-full">*/}
                    {/*                <Image src="/platform.png" alt="metric" height={32} width={32}/>*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <div className="font-medium text-gray-900">*/}
                    {/*                    Growth Rate*/}
                    {/*                </div>*/}
                    {/*                <div className="text-gray-700">*/}
                    {/*                    +15.3%*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </AdminProtectedRoute>
        </>
    )
}

export default Page