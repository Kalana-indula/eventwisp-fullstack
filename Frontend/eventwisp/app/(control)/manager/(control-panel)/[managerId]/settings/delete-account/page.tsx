'use client'

import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import ManagerProtectedRoutes from "@/utils/ManagerProtectedRoutes";
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

    const managerId= params.managerId;

    const router = useRouter();

    const clearData = () => {
        setEmail("");
        setPassword("");
    };

    //handle cancel
    const handleCancel = (): void => {
        clearData();
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setEmail(value);
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setPassword(value);
    }

    const handleDeleteManager = async (event:React.FormEvent<HTMLFormElement>)=>{
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
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/managers/${managerId}`,
                {
                    data: parsed.data,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            // read backend's SingleEntityResponse message (string is also fine) handles null or undefined values as well
            const message: string = typeof response.data === "string" ? response.data : (response.data?.message ?? "Request completed");

            if (message.toLowerCase().includes("incorrect") || message.toLowerCase().includes("not found")) {
                toast.error(message);
                return;
            }

            toast.success(message);

            // optional: clear auth + redirect
            localStorage.removeItem("auth");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("userRole");
            clearData?.();
            router.replace("/manager/auth/login");

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
            <ManagerProtectedRoutes>
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
                                <form className="space-y-6" onSubmit={handleDeleteManager}>
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
                                        {/* Delete Account button */}
                                        <Button
                                            type="submit"
                                            className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 active:bg-blue-600 active:text-white transition-all duration-200 ease-in-out hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Delete Account
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
