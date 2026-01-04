'use client'

import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import ManagerProtectedRoutes from "@/utils/ManagerProtectedRoutes";
import {useParams, useRouter} from "next/navigation";
import {UpdatePasswordForm, updatePasswordSchema} from "@/lib/validation";
import toast from "react-hot-toast";
import {UpdatePasswordDetails} from "@/types/entityTypes";
import axios from "axios";

const Page = () => {
    //fetch password details
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const params=useParams();

    const managerId = params.managerId;

    const router=useRouter();

    //handle cancel
    const handleCancel = (): void => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }

    const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setCurrentPassword(value);
    }

    const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setNewPassword(value);
    }

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setConfirmPassword(value);
    }

    //logout from current session
    const logoutFromSession = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
        }
        router.push('/manager/auth/login');
    };

    //update manager password
    const handleUpdatePassword = async ( event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 1) Build + validate
        const form: UpdatePasswordForm = { currentPassword, newPassword };
        const parsed = updatePasswordSchema.safeParse(form);
        if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message || "Invalid form input");
            return;
        }

        const payload: UpdatePasswordDetails = {
            currentPassword: parsed.data.currentPassword,
            newPassword: parsed.data.newPassword,
        };

        try{
            const response=await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/managers/${managerId}/password`,payload,
                {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            //check if the process success
            if(response.data?.success){
                toast.success(response.data.message || "Password updated successfully");
                logoutFromSession(); // e.g. force re-login
                return;
            }

            // (Shouldn’t hit here if backend uses 400 for failures, but keep as fallback)
            toast.error(response.data?.message || "Password update failed");

        }catch (err) {
            // 4) Handle 4xx/5xx errors, show backend message if present
            if (axios.isAxiosError(err)) {
                const apiMsg = (typeof err.response?.data === "string" && err.response.data) ||
                    err.response?.data?.message ||
                    err.message || "Failed to update password";
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
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Update Password</h1>
                    </div>
                </div>

                {/*    main content*/}
                <div className="p-3 sm:p-4 md:p-6 bg-white">
                    <div
                        className="display-organizers bg-gray-200 border-l-4 border-blue-500 px-4 py-2 pb-6 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">UPDATE PASSWORD</h3>
                        </div>

                        {/*    form*/}
                        <div className="max-w-md mx-auto">
                            <div className="bg-white shadow-2xl p-8 rounded-lg">
                                <form className="space-y-6" onSubmit={handleUpdatePassword}>
                                    {/*old password field*/}
                                    <div>
                                        <label htmlFor="current-password"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="current-password"
                                            name="Password"
                                            type="password"
                                            required={true}
                                            value={currentPassword}
                                            onChange={handleCurrentPassword}
                                            placeholder="Minimum 8 characters"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>

                                    {/*password field*/}
                                    <div>
                                        <label htmlFor="Password"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="Password"
                                            name="Password"
                                            type="password"
                                            required={true}
                                            value={newPassword}
                                            onChange={handleNewPassword}
                                            placeholder="Minimum 8 characters"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>

                                    {/*confirm password field*/}
                                    <div>
                                        <label htmlFor="confirm-pw"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="confirm-pw"
                                            name="confirm-pw"
                                            type="password"
                                            required={true}
                                            onChange={handleConfirmPassword}
                                            value={confirmPassword}
                                            placeholder="Minimum 8 characters"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                            Password must contain at least one uppercase letter, one lowercase letter,
                                            and
                                            one
                                            number
                                        </p>
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
