'use client'

import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import ProtectedRoute from "@/utils/ProtectedRoutes";
import {useParams, useRouter} from "next/navigation";
import {DeleteUserForm, deleteUserSchema} from "@/lib/validation";
import toast from "react-hot-toast";
import axios from "axios";

const Page = () => {
    //set password state
    const [password, setPassword] = useState<string>('');

    // set email state
    const [email, setEmail] = useState<string>('');

    const params=useParams();

    const organizerId = params.organizerId;

    const router = useRouter();

    const clearData = () => {
        setEmail('');
        setPassword('');
    }

    //handle cancel
    const handleCancel = (): void => {
        clearData()
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setEmail(value);
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setPassword(value);
    }

    //logout and route to login page
    const logoutFromSession = ()=>{
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        clearData?.();
        router.replace("/organizer/auth/login");
    }

    const handleDeleteOrganizer = async (event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();

        // build + validate
        const formData: DeleteUserForm = {
            email:email,
            password:password
        };

        const parsed = deleteUserSchema.safeParse(formData);

        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || "Invalid input";
            toast.error(firstError);
            return;
        }

        try {
            // IMPORTANT: send DELETE body under `data`
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}`,
                {
                    data: parsed.data,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            //check if the process success
            if(response.data?.success){
                toast.success(response.data.message || "Organizer account deleted successfully");
                logoutFromSession(); // e.g. force re-login
                return;
            }

            // send an error message
            toast.error(response.data?.message || "Account deletion failed");

        }catch (err) {
            if (axios.isAxiosError(err)) {
                const apiMsg =
                    (typeof err.response?.data === "string" && err.response?.data) ||
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to delete account";
                toast.error(apiMsg);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An unknown error occurred");
            }
        }
    }

    return (
        <>
            <ProtectedRoute>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Delete Account</h1>
                    </div>
                </div>

                {/*    main content*/}
                <div className="p-3 sm:p-4 md:p-6 bg-white">
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 pb-6 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">DELETE ACCOUNT</h3>
                        </div>

                        {/*    form*/}
                        <div className="max-w-md mx-auto">
                            <div className="bg-white shadow-2xl p-8 rounded-lg">
                                <form className="space-y-6" onSubmit={handleDeleteOrganizer}>
                                    {/*email field*/}
                                    <div>
                                        <label htmlFor="current-email"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            Enter Email <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="current-email"
                                            name="current-email"
                                            type="email"
                                            required={true}
                                            value={email}
                                            onChange={handleEmail}
                                            placeholder="email@example.com"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>

                                    {/*password field*/}
                                    <div>
                                        <label htmlFor="current-email"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            Enter Password<span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="current-email"
                                            name="current-email"
                                            type="password"
                                            required={true}
                                            value={password}
                                            onChange={handlePassword}
                                            placeholder="Minimum 8 characters"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>

                                    {/*buttons*/}
                                    <div className="space-y-2">
                                        {/*save button*/}
                                        <Button
                                            type="submit"
                                            className="w-full flex justify-center py-3 px-4 bg-blue-600 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-600 active:text-white hover:cursor-pointer">
                                            Delete Account
                                        </Button>

                                        {/*cancel button*/}
                                        <Button
                                            className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium bg-white text-blue-600 hover:text-white hover:bg-blue-600 active:text-blue-600 active:bg-white hover:cursor-pointer"
                                            onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}
export default Page
