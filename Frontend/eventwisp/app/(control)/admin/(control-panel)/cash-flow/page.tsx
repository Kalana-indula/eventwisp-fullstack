'use client'

import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {MdClose, MdEdit, MdSave} from "react-icons/md"
import Image from "next/image";
import {useRouter} from "next/navigation";
import {AddBankDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {getValueString} from "@/lib/utils";
import AdminProtectedRoute from "@/utils/AdminProtectedRoutes";

const CashFlow = () => {
    const [commission, setCommission] = useState<number>(0);
    const [isEditingCommission, setIsEditingCommission] = useState<boolean>(false);
    const [tempCommission, setTempCommission] = useState(commission);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [bankInfo, setBankInfo] = useState<AddBankDetails>();

    const router = useRouter();

    const routeToAddBank = () => {
        router.push(`/admin/bank/add-bank`);
    }

    const routeToBankDetailsUpdate = () => {
        router.push(`/admin/bank/update-bank-details`);
    }

    useEffect(() => {
        getBankDetails();
        getCommissionData();
        getTotalEarnings();
    }, []);

    // Handle commission editing
    const handleEditCommission = () => {
        setIsEditingCommission(true)
        setTempCommission(commission)
    }

    const handleCancelCommission = () => {
        setTempCommission(commission)
        setIsEditingCommission(false)
    }

    //get commission details
    const getCommissionData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/commission`);
            console.log(response.data.entityData);
            setCommission(response.data.entityData);
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

    //update commission
    const updateCommission = async () => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/commission`,
                {commission: tempCommission}, // Send as an object
                {
                    headers: {
                        'Content-Type': 'application/json' // Explicitly set content type
                    }
                }
            );
            setCommission(tempCommission);
            setIsEditingCommission(false);
            console.log("Commission saved:", response.data);
            toast.success('Commission updated successfully'); // Add success feedback
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

    //get current earnings
    const getTotalEarnings = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/platform-balance`);
            console.log(response.data.entityData);
            setTotalRevenue(response.data.entityData);
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

    //get bank details
    const getBankDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/system-banks`);
            console.log(response.data.entityData);
            setBankInfo(response.data.entityData);
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
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Cash Flow</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">Manage And Control The Cash Flow</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
                    {/* Commission Section */}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium">COMMISSION DATA</h3>
                        </div>
                        <div
                            className="bg-white p-3 sm:p-4 rounded-lg my-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <span
                                    className="text-gray-700 font-medium text-sm sm:text-base">Current commission :</span>
                                {isEditingCommission ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={tempCommission}
                                            onChange={(e) => setTempCommission(Number(e.target.value))}
                                            className="w-16 px-2 py-1 border border-gray-400 rounded text-center text-sm sm:text-base"
                                            min="0"
                                            max="100"
                                        />
                                        <span className="text-gray-700 text-sm sm:text-base">%</span>
                                    </div>
                                ) : (
                                    <span
                                        className="text-gray-900 font-semibold text-sm sm:text-base">{commission} %</span>
                                )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {isEditingCommission ? (
                                    <>
                                        <Button
                                            onClick={updateCommission}
                                            className="bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 active:bg-blue-600 active:text-white px-2 sm:px-3 py-1 text-xs sm:text-sm flex-1 sm:flex-none rounded-lg shadow-sm font-medium hover:cursor-pointer transition-colors duration-200"
                                        >
                                            <MdSave className="mr-1"/>
                                            Save
                                        </Button>

                                        <Button
                                            onClick={handleCancelCommission}
                                            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white active:bg-white active:text-blue-600 px-2 sm:px-3 py-1 text-xs sm:text-sm flex-1 sm:flex-none rounded-lg shadow-sm font-medium hover:cursor-pointer transition-colors duration-200"
                                        >
                                            <MdClose className="mr-1"/>
                                            Cancel
                                        </Button>

                                    </>
                                ) : (
                                    <Button
                                        onClick={handleEditCommission}
                                        className="bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 active:bg-blue-600 active:text-white px-2 sm:px-3 py-1 text-xs sm:text-sm w-full sm:w-auto rounded-lg shadow-sm font-medium hover:cursor-pointer transition-colors duration-200"
                                    >
                                        <MdEdit className="mr-1"/>
                                        Edit
                                    </Button>

                                )}
                            </div>
                        </div>
                    </div>

                    {/* Revenue Section */}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium">REVENUE DATA</h3>
                        </div>

                        {/*Total revenue*/}
                        <div className="grid sm:grid-cols-1 lg:grid-cols-2">
                            <div
                                className="card flex items-center bg-white px-[10px] py-[30px] rounded-[8px] shadow-lg my-[5px] mx-[10px] relative">
                                <div className="p-[12px] mx-[10px] bg-gray-300 rounded-full">
                                    <Image src="/current-revenue.png" alt="pending" height={32} width={32}/>
                                </div>
                                <div>
                                    <div className="font-medium">
                                        Current Revenue
                                    </div>
                                    {totalRevenue ? (
                                        <div className="text-gray-700">
                                            {getValueString(totalRevenue)} LKR.
                                        </div>
                                    ) : (
                                        <div className="text-gray-700">
                                            N/A
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Bank Information Section */}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium">BANK DETAILS</h3>
                        </div>
                        <div className="bg-white shadow-xl text-black p-4 sm:p-6 rounded-lg my-[10px] relative">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex justify-center items-center sm:h-32 sm:w-32 p-[18px] sm:p-[20px] mx-[10px] bg-gray-300 rounded-full">
                                    <Image src="/bank.png" alt="pending" height={64} width={64}/>
                                </div>
                                <div className="sm:py-[20px]">
                                    <h2 className="text-lg sm:text-2xl font-semibold">Your Bank</h2>
                                    <div className="break-words text-gray-700">{bankInfo?.bankName}</div>
                                    <div className="break-words text-gray-700">Account Holder Name
                                        : {bankInfo?.accountHolderName}</div>
                                    <div className="break-words text-gray-700">Branch Code
                                        : {bankInfo?.branchName}</div>
                                    <div className="break-words text-gray-700">Account No
                                        : {bankInfo?.accountNumber}</div>

                                </div>
                            </div>
                            <Button
                                onClick={routeToBankDetailsUpdate}
                                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 active:bg-blue-600 active:text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-sm text-xs sm:text-sm font-medium hover:cursor-pointer transition-colors duration-200"
                            >
                                <span className="hidden sm:inline">Update Bank</span>
                                <span className="sm:hidden">Update</span>
                            </Button>

                        </div>
                    </div>

                    {/* Add Bank Section */}
                    <button
                        onClick={routeToAddBank}
                        disabled={!!bankInfo}
                        className={`${bankInfo ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 active:shadow-xl hover:cursor-pointer'} 
                    bg-white transition-colors duration-300 border rounded-[10px] font-semibold border-gray-800 p-[20px] w-full flex items-center justify-center gap-4`}>
                        <div><Image src="/bank.png" height={24} width={24} alt="pending"/></div>
                        <div>Add Bank +</div>
                    </button>
                </div>
            </AdminProtectedRoute>
        </>
    )
}

export default CashFlow