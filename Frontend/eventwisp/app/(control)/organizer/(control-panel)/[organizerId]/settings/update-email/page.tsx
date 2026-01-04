'use client'

import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import ProtectedRoute from "@/utils/ProtectedRoutes";
import {useParams, useRouter} from "next/navigation";
import {UpdateEmailForm, updateEmailSchema} from "@/lib/validation";
import toast from "react-hot-toast";
import {UpdateEmailDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";

const Page = () => {
    //fetch password details
    const [newEmail, setNewEmail] = useState<string>('');

    const params = useParams();

    const organizerId = params.organizerId;

    const router = useRouter();

    //handle cancel
    const handleCancel = (): void => {
        setNewEmail('');
    }

    const handleNewEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setNewEmail(value);
    }

    //logout from current session
    const logoutFromSession = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
        }
        router.push('/organizer/auth/login');
    };

    const handleUpdateEmail = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // build form data object for validation
        const formData: UpdateEmailForm = {
            email: newEmail,
        };

        // zod validation
        const parsed = updateEmailSchema.safeParse(formData);

        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || "Invalid form input";
            toast.error(firstError);
            return;
        }

        // build payload
        const emailPayload: UpdateEmailDetails = {
            email: parsed.data.email,
        };

        try{
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizers/${organizerId}/email`, emailPayload);
            console.log(response.data);
            toast.success("Email updated successfully");
            logoutFromSession();
        }catch (err) {
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
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Update Email</h1>
                    </div>
                </div>

                {/*    main content*/}
                <div className="p-3 sm:p-4 md:p-6 bg-white">
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 pb-6 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">UPDATE EMAIL</h3>
                        </div>

                        {/*    form*/}
                        <div className="max-w-md mx-auto">
                            <div className="bg-white shadow-2xl p-8 rounded-lg">
                                <form className="space-y-6" onSubmit={handleUpdateEmail}>
                                    {/*old password field*/}
                                    <div>
                                        <label htmlFor="current-email"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            Enter Current Email <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="current-email"
                                            name="current-email"
                                            type="email"
                                            required={true}
                                            value={newEmail}
                                            onChange={handleNewEmail}
                                            placeholder="email@example.com"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>

                                    {/*buttons*/}
                                    <div className="space-y-2">
                                        {/*save button*/}
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-600 active:text-white hover:cursor-pointer">
                                            Submit
                                        </Button>

                                        {/*cancel button*/}
                                        <Button
                                            className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium bg-white text-blue-600 hover:bg-blue-600 hover:text-white active:text-blue-600 active:bg-white hover:cursor-pointer"
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
