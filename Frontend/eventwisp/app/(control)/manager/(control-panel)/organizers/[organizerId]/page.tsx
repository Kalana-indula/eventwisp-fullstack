'use client'

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {CircleCheck} from "lucide-react";
import {OrganizerDetails, OrganizerStatus} from "@/types/entityTypes";
import axios from "axios";
import {useRouter} from "next/navigation";
import ManagerProtectedRoutes from "@/utils/ManagerProtectedRoutes";
import toast from "react-hot-toast";
import DisapproveAccountSwitch from "@/app/(control)/manager/manager-components/DisapproveAccountSwitch";
import DeleteOrganizerDialog from "@/app/(control)/manager/manager-components/DeleteOrganizerDialog";

const Page = ({params}: { params: Promise<{ organizerId: number }> }) => {

    const {organizerId} = React.use(params);
    const router = useRouter();

    //route to organizer list
    const routeToOrganizersList = () => {
        router.push("/manager/organizers");
    }

    //approval state
    const [organizerApproval, setOrganizerApproval] = useState<string>('pending');

    // Loading state for buttons
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //organizer details
    const [organizerDetails, setOrganizerDetails] = useState<OrganizerDetails | null>(null);

    // approval badge elements
    const approvalStates = [
        {
            state: "pending",
            src: "/pending-approval.png",
            message: "Pending Approval"
        },
        {
            state: "approved",
            src: "/ok.png",
            message: "Approved"
        },
        {
            state: "disapproved",
            src: "/disapproved-event.png",
            message: "Disapproved"
        }
    ]

    //fetch details from organizer
    const getOrganizerDetails = async (organizerId: number) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}`);
            setOrganizerDetails(response.data.entityData);
            console.log(response.data.entityData);

            // Set approval status based on the response
            if (response.data.entityData.isApproved) {
                setOrganizerApproval('approved');
            } else if (response.data.entityData.isDisapproved) {
                setOrganizerApproval('disapproved');
            } else {
                setOrganizerApproval('pending');
            }
        } catch (error) {
            console.error('Error fetching organizer details:', error);
            router.push('/manager/organizers');
        }
    };

    const approveAccount = async (): Promise<void> => {
        const status: OrganizerStatus = {
            pendingApproval: false,
            isApproved: true,
            isDisapproved: false,
        }

        setIsLoading(true);

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/status`, status);
            console.log('Approve response:', response.data);

            // Update local state
            setOrganizerApproval('approved');
            toast.success("Organizer was approved");
            // Update organizer details if needed
            if (organizerDetails) {
                setOrganizerDetails({
                    ...organizerDetails,
                    isApproved: true,
                    isDisapproved: false,
                    pendingApproval: false
                });
            }

        } catch (err) {
            console.error('Error approving account:', err);
            toast.success("Error approving account");
        } finally {
            setIsLoading(false);
        }
    }

    const disapproveAccount = async (): Promise<void> => {
        const status: OrganizerStatus = {
            pendingApproval: false,
            isApproved: false,
            isDisapproved: true,
        }

        setIsLoading(true);

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/status`, status);
            console.log('Disapprove response:', response.data);

            // Update local state
            setOrganizerApproval('disapproved');
            toast.success("Organizer was disapproved");
            // Update organizer details if needed
            if (organizerDetails) {
                setOrganizerDetails({
                    ...organizerDetails,
                    isApproved: false,
                    isDisapproved: true,
                    pendingApproval: false
                });
            }

        } catch (err) {
            console.error('Error disapproving account:', err);
            toast.error("Error disapproving account");
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        getOrganizerDetails(organizerId);
    }, [organizerId]);

    return (
        <>
            <ManagerProtectedRoutes>
                {/*    header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-[10px] p-[10px]">
                        <h1 className="text-2xl font-semibold text-gray-900">Organizer </h1>
                        <p className="mt-1 text-gray-600">Organizer {organizerDetails?.organizerId} details</p>
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
                                    <div className="break-words text-gray-700 text-sm sm:text-base font-semibold">
                                        Company Name :
                                        <span className="font-normal">
                                            {organizerDetails?.companyName}
                                        </span>
                                    </div>
                                    <div className="break-words text-gray-700 text-sm sm:text-base font-semibold">
                                        Active Events Count :
                                        <span className="font-normal">
                                            {organizerDetails?.activeEventsCount ?? 0}
                                        </span>
                                    </div>
                                    <div className="break-words text-gray-700 mt-2 text-sm sm:text-base space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <div>
                                                <Image src="/organizer-id.png" alt="event" height={32} width={32}/>
                                            </div>
                                            <div>
                                                {organizerDetails?.organizerId}
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

                            {/* Desktop status display - positioned absolute top right */}
                            <div
                                className={`hidden sm:flex absolute top-4 right-4 flex-col items-center justify-center ${organizerApproval === 'disapproved' ? 'bg-red-100' : 'bg-gray-100'}  rounded-lg p-4 min-w-[120px]`}>
                                {approvalStates.map((approvalState) => {
                                    const isCurrentState = organizerApproval === approvalState.state;

                                    // Only render the current state
                                    if (!isCurrentState) return null;

                                    return (
                                        <React.Fragment key={approvalState.state}>
                                            <div
                                                className="flex justify-center items-center w-12 h-12 bg-white rounded-full mb-2 shadow-lg">
                                                <Image src={approvalState.src} alt={approvalState.state} height={24}
                                                       width={24}/>
                                            </div>
                                            <div
                                                className="text-center text-sm font-medium">{approvalState.message}</div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Mobile status display */}
                            <div className="sm:hidden mt-4 flex items-center justify-center bg-gray-100 rounded-lg p-3">
                                {approvalStates.map((eventState) => {
                                    const isCurrentState = organizerApproval === eventState.state;

                                    // Only render the current state
                                    if (!isCurrentState) return null;

                                    return (
                                        <React.Fragment key={eventState.state}>
                                            <div
                                                className="flex justify-center items-center w-8 h-8 bg-white rounded-full mr-2 shadow-lg">
                                                <Image src={eventState.src} alt={eventState.state} height={16}
                                                       width={16}/>
                                            </div>
                                            <div className="text-sm font-medium">{eventState.message}</div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                {/* Approve Button - Show when pending or disapproved */}
                                {(organizerApproval === 'pending' || organizerApproval === 'disapproved') && (
                                    <Button
                                        onClick={approveAccount}
                                        disabled={isLoading}
                                        className="flex items-center justify-center bg-blue-600 border border-blue-600 text-white rounded-lg shadow-sm font-medium py-2 sm:py-3 px-4 text-sm hover:bg-blue-700 active:bg-blue-600 active:text-white transition-colors duration-200 hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <CircleCheck className="mr-2" />
                                        {isLoading ? 'Approving...' : 'Approve Organizer'}
                                    </Button>
                                )}

                                {/* Disapprove Button - Show only when pending */}
                                {organizerApproval === 'pending' && (
                                    <DisapproveAccountSwitch
                                        status={organizerApproval}
                                        onDisapprove={disapproveAccount}
                                        isLoading={isLoading}
                                        organizerName={organizerDetails?.name}
                                    />
                                )}

                                {/* Delete Account Button - Show when not pending */}
                                {organizerApproval !== 'pending' && (
                                    <DeleteOrganizerDialog
                                        organizerId={organizerId}
                                        onSuccess={routeToOrganizersList}
                                        // className is optional; keeps your existing styling by default
                                    />
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </ManagerProtectedRoutes>
        </>
    )
}
export default Page