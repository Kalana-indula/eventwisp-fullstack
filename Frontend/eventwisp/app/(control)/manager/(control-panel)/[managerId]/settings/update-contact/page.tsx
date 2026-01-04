'use client'

import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import ManagerProtectedRoutes from "@/utils/ManagerProtectedRoutes";
import {useParams, useRouter} from "next/navigation";
import {UpdateContactDetailsForm, updateContactDetailsSchema} from "@/lib/validation";
import toast from "react-hot-toast";
import {UpdateContactDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";

const Page = () => {
    //new contact details
    const [newContactDetails, setNewContactDetails] = useState<string>("");

    const params=useParams();

    const router = useRouter();

    const managerId=params.managerId;

    const handleContactDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setNewContactDetails(value);
    }

    const handleCancel = () => {
        setNewContactDetails("");
    }

    const routeToSettings = ()=>{
        router.push(`/manager/${managerId}/settings`);
    }

    const handleUpdateContactDetails = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // build form data object for validation
        const formData: UpdateContactDetailsForm = {
            contactDetails: newContactDetails,
        };

        // zod validation
        const parsed = updateContactDetailsSchema.safeParse(formData);

        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || "Invalid form input";
            toast.error(firstError);
            return;
        }

        // build payload
        const contactDetailsData: UpdateContactDetails = {
            contactDetails: parsed.data.contactDetails,
        };

        try{
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/managers/${managerId}/contact`, contactDetailsData);
            console.log(response.data);
            toast.success("Contact details updated successfully");
            routeToSettings();
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
            <ManagerProtectedRoutes>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Contact</h1>
                    </div>
                </div>

                {/*main content*/}
                <div className="p-3 sm:p-4 md:p-6 bg-white">
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 pb-6 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">UPDATE CONTACT DETAILS</h3>
                        </div>

                        {/*form*/}
                        <div className="max-w-md mx-auto">
                            <div className="bg-white shadow-2xl p-8 rounded-lg">

                                <form className="space-y-6" onSubmit={handleUpdateContactDetails}>
                                    {/*New contact details section*/}
                                    <div>
                                        <label htmlFor="new-contact"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            New Contact <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="new-contact"
                                            name="new-contact"
                                            type="text"
                                            required={true}
                                            value={newContactDetails}
                                            onChange={handleContactDetails}
                                            placeholder="+94 XXX XXX XXX"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        {/* Save button */}
                                        <Button
                                            type="submit"
                                            className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 active:bg-blue-600 active:text-white transition-all duration-200 ease-in-out hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Save
                                        </Button>

                                        {/* Cancel button */}
                                        <Button
                                            onClick={handleCancel}
                                            className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white active:bg-white active:text-blue-600 transition-all duration-200 ease-in-out hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </Button>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </ManagerProtectedRoutes>
        </>
    )
}
export default Page
