'use client'

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {OrganizerDetails} from "@/types/entityTypes";
import axios from "axios";

const Page = ({params}: { params: Promise<{ organizerId: number }> }) => {

    //states
    const [organizerDetails,setOrganizerDetails] = useState<OrganizerDetails>();

    const {organizerId} = React.use(params);

    // configure routing
    const router=useRouter();

    //route to update details
    const routeToUpdatePassword = () => {
        router.push(`/organizer/${organizerId}/settings/update-password`);
    }

    const routeToUpdateEmail =()=>{
        router.push(`/organizer/${organizerId}/settings/update-email`);
    }

    const routeToUpdateContact = ()=>{
        router.push(`/organizer/${organizerId}/settings/update-contact`);
    }

    const routeToDeleteAccount = ()=>{
        router.push(`/organizer/${organizerId}/settings/delete-account`);
    }

    //load organizer data at page loading
    useEffect(() => {
        getOrganizerDetails();
    }, [organizerId]);

    //fetch organizer details
    const getOrganizerDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}`);
            console.log('Organizer details:', response.data.entityData);
            setOrganizerDetails(response.data.entityData);
        } catch (err) {
            console.error('Error fetching organizer details:', err);
        }
    }

    return (
        <>
            {/*    header section*/}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                <div className="text-center mb-[10px] p-[10px]">
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                    <p className="mt-1 text-gray-600">Organizer account settings</p>
                </div>
            </div>

            {/*    scrollable content*/}
            <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">
                {/*event details section*/}
                <div
                    className="display-event bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                    <div>
                        <h3 className="text-gray-500 font-medium">ORGANIZER DETAILS</h3>
                    </div>
                    <div className="bg-white shadow-xl text-black p-4 sm:p-6 rounded-lg my-[10px] relative">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex justify-center items-center sm:h-32 sm:w-32 p-[18px] sm:p-[20px] mx-[10px] bg-gray-300 rounded-full">
                                <Image src="/organizer.png" alt="event" height={64} width={64}/>
                            </div>
                            <div className="sm:py-[20px] flex-1">
                                <h2 className="text-lg sm:text-2xl font-semibold">{organizerDetails?.name}</h2>
                                <div className="break-words text-gray-700 text-sm sm:text-base"><span className="font-semibold">Company Name : </span>  {organizerDetails?.companyName}
                                    xxxx
                                </div>
                                <div className="break-words text-gray-700 mt-2 text-sm sm:text-base space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <Image src="/organizer-id.png" alt="event" height={32} width={32}/>
                                        </div>
                                        <div>
                                            <span
                                                className="font-semibold">ID : </span> {organizerDetails?.organizerId}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <Image src="/email.png" alt="event" height={32} width={32}/>
                                        </div>
                                        <div>
                                            {organizerDetails?.email}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <Image src="/contact.png" alt="event" height={32} width={32}/>
                                        </div>
                                        <div>
                                            {organizerDetails?.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Button
                                className={` bg-blue-600 hover:bg-blue-700 text-white border-gray-700 hover:cursor-pointer`}
                                onClick={routeToDeleteAccount}
                            >
                                <div className="flex items-center justify-center">
                                    <Trash2 strokeWidth={1.5} className="mr-2"/> Delete Account
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                {/*    settings selection*/}
                <div
                    className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                    <div>
                        <h3 className="text-gray-500 font-medium">UPDATE DETAILS</h3>
                    </div>

                    <div className="flex justify-center py-4 sm:py-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            <div className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[300px] sm:w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                onClick={routeToUpdatePassword}>
                                <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                    <Image src="/update-password.png" alt="update-password" height={64} width={64}
                                           className="sm:h-[75px] sm:w-[75px]"/>
                                </div>
                                <div className="absolute bottom-3 sm:bottom-4">
                                    <span className="font-medium text-gray-900">Password</span>
                                </div>
                            </div>

                            <div className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[300px] sm:w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                onClick={routeToUpdateEmail}>
                                <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                    <Image src="/update-email.png" alt="update-email" height={64} width={64}
                                           className="sm:h-[75px] sm:w-[75px]"/>
                                </div>
                                <div className="absolute bottom-3 sm:bottom-4">
                                    <span className="font-medium text-gray-900">Email</span>
                                </div>
                            </div>

                            <div className="card flex flex-col items-center justify-center h-[180px] sm:h-[200px] w-[300px] sm:w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer hover:bg-gray-50 active:shadow-2xl"
                                onClick={routeToUpdateContact}>
                                <div className="p-5 sm:p-6 bg-gray-300 rounded-full mb-4">
                                    <Image src="/update-contact.png" alt="update-email" height={64} width={64}
                                           className="sm:h-[75px] sm:w-[75px]"/>
                                </div>
                                <div className="absolute bottom-3 sm:bottom-4">
                                    <span className="font-medium text-gray-900">Contact Details</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Page