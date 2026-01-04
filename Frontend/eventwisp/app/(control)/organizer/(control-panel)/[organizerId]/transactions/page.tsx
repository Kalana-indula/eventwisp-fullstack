'use client'
// payment code
import React, {useEffect, useState} from 'react'
import {FileText} from "lucide-react";
import {TransactionDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {useParams} from "next/navigation";
import {formatDate, formatTime, getValueString} from "@/lib/utils";
import ProtectedRoute from "@/utils/ProtectedRoutes";


const Page = () => {

    //get params
    const params = useParams();

    const organizerId = params.organizerId;

    //payment details state
    const [transactions, setTransactions] = useState<TransactionDetails[]>([]);

    useEffect(() => {
        getTransactionDetails();
    }, []);

    //get all transaction details
    const getTransactionDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/transactions`);
            setTransactions(response.data.entityList);
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

    return (
        <>
            <ProtectedRoute>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-[10px] p-[10px]">
                        <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
                        <p className="mt-1 text-gray-600">View payment details</p>
                    </div>
                </div>

                {/*    main content*/}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">
                    <div
                        className="display-payments bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">PAYMENT DETAILS</h3>
                        </div>

                        {/*desktop table view*/}
                        <div className="hidden md:block overflow-x-auto shadow-lg">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Transaction ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Amount (LKR.)
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {transactions && transactions.length > 0 ? (
                                    transactions.map((transaction: TransactionDetails) => (
                                        <tr className="hvoer:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                            key={transaction.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{transaction.transactionId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{formatDate(transaction.date)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{formatTime(transaction.time)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{getValueString(transaction.amount)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                                    <FileText strokeWidth={1} size={40}/>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments
                                                    available</h3>
                                                <p className="text-sm text-gray-500">There are currently no payment
                                                    records to display.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/*    mobile view*/}
                        <div className="md:hidden space-y-4">
                            {(() => {
                                return transactions && transactions.length > 0
                                    ? transactions.map((transaction: TransactionDetails) => (
                                        <div
                                            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                            key={transaction.id}>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-500">Transaction ID:</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-sm">{transaction.transactionId}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-500">Date:</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-sm">{formatDate(transaction.date)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-500">Time:</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-sm">{formatTime(transaction.time)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-sm font-medium text-gray-500">Amount (LKR.):</span>
                                                    <span
                                                        className="text-sm text-gray-900 font-sm">{getValueString(transaction.amount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : (
                                        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="w-16 h-16 bg-gray-100 rounded-full text-gray-600 flex items-center justify-center mb-4">
                                                    <FileText strokeWidth={1} size={40}/>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments
                                                    available</h3>
                                                <p className="text-sm text-gray-500 text-center">There are currently no
                                                    payment records to display.</p>
                                            </div>
                                        </div>
                                    )
                            })()}
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}
export default Page
