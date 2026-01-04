'use client'
// payment code
import React, {useEffect, useState} from 'react'
import {FileText} from "lucide-react";
import {TransactionDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {formatDate, formatTime, getValueString} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import ManagerProtectedRoutes from "@/utils/ManagerProtectedRoutes";

const Page = () => {

    //payment details state
    const [transactions, setTransactions] = useState<TransactionDetails[]>([]);

    // searched transaction details
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);

    // search input state
    const [searchId, setSearchId] = useState<string>("");

    useEffect(() => {
        getTransactionDetails();
    }, []);

    // Watch for searchId changes - when cleared, reset to default data
    useEffect(() => {
        if (searchId === "") {
            setTransactionDetails(null);
        }
    }, [searchId]);

    //get transaction details by transaction id
    const getTransactionByTransactionId = async (transactionId: string): Promise<void> => {

        // Add validation check
        if (!transactionId.trim()) {
            toast.error("Please enter a Transaction ID before searching");
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/id/${transactionId}`);

            if (response.data.entityData) {
                setTransactionDetails(response.data.entityData);
                console.log("Found transaction:", response.data.entityData);
            } else {
                console.log(response.data.message);
                toast.error(response.data.message);
                setTransactionDetails(null);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    console.log("No transaction was found");
                    toast.error("No transaction was found");
                    setTransactionDetails(null);
                } else {
                    console.error("Error fetching transaction:", err);
                    const errorMessage = err.response?.data?.message || 'Failed to find transaction';
                    toast.error(errorMessage);
                }
            } else {
                console.error("Unexpected error:", err);
                toast.error('An unexpected error occurred');
            }
        }
    }

    //get all transaction details
    const getTransactionDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions`);
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
            getTransactionByTransactionId(searchId.trim());
        } else {
            toast.error("Please enter a Transaction ID");
        }
    };

    // Determine which data to display in table
    const displayData = transactionDetails ? [transactionDetails] : transactions;

    return (
        <>
            <ManagerProtectedRoutes>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-[10px] p-[10px]">
                        <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
                        <p className="mt-1 text-gray-600">View payment details</p>
                    </div>
                </div>

                {/*    main content*/}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">

                    {/*search*/}
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        {/*    Search Transaction*/}
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">SEARCH BY TRANSACTION ID</h3>
                        </div>
                        <div className="flex justify-center sm:justify-start">
                            <div className="flex flex-col sm:flex-row w-full max-w-sm items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="Transaction ID"
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

                    <div
                        className="display-payments bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div className="flex justify-between items-center py-2">
                            <h3 className="text-gray-500 font-medium">TRANSACTION DETAILS</h3>
                            {transactionDetails && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearchId("");
                                        setTransactionDetails(null);
                                    }}
                                    className="text-xs"
                                >
                                    Clear Search
                                </Button>
                            )}
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
                                        Organizer ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Organizer Name
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
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        Status
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {displayData && displayData.length > 0 ? (
                                    displayData.map((transaction: TransactionDetails) => (
                                        <tr className="hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer"
                                            key={transaction.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{transaction.transactionId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{transaction.organizerId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{transaction.organizerName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{formatDate(transaction.date)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{formatTime(transaction.time)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{getValueString(transaction.amount)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-sm">{transaction.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
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
                            {displayData && displayData.length > 0 ? (
                                displayData.map((transaction: TransactionDetails) => (
                                    <div
                                        className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:cursor-pointer"
                                        key={transaction.id}>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-500">ID:</span>
                                                <span
                                                    className="text-sm text-gray-900 font-sm">{transaction.transactionId}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-500">Organizer ID:</span>
                                                <span
                                                    className="text-sm text-gray-900 font-sm">{transaction.organizerId}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                            <span
                                                className="text-sm font-medium text-gray-500">Organizer Name:</span>
                                                <span
                                                    className="text-sm text-gray-900 font-sm">{transaction.organizerName}</span>
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
                                            <div className="flex justify-between items-center">
                                            <span
                                                className="text-sm font-medium text-gray-500">Status :</span>
                                                <span
                                                    className="text-sm text-gray-900 font-sm">{transaction.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
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
                            )}
                        </div>
                    </div>
                </div>
            </ManagerProtectedRoutes>
        </>
    )
}
export default Page;