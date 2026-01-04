'use client'
// register page
import React, {useState} from 'react'
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {AdminFormData} from "@/types/entityTypes";
import {RegisterAdminForm, registerAdminSchema} from "@/lib/validation";
import {useRouter} from "next/navigation";
import Link from "next/link";

//types
const Page = () => {

    //fetch input details
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [nic, setNic] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const router=useRouter();

    //route to admin login
    const routeToAdminLogin = ()=>{
        router.push('/admin/auth/login');
    }

    //handle inputs
    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = e.target;
        setFirstName(value);
    }

    const handleLastName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = e.target;
        setLastName(value);
    }

    const handleNic = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = e.target;
        setNic(value);
    }

    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = e.target;
        setPhone(value);
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = e.target;
        setEmail(value);
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = e.target;
        setPassword(value);
    }

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = e.target;
        setConfirmPassword(value);
    }

    //submit data
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        //build form data object for validation
        const formdData: RegisterAdminForm = {
            firstName,
            lastName,
            nic,
            phone,
            email,
            password,
            confirmPassword,
        };

        //zod validation
        const parsed = registerAdminSchema.safeParse(formdData);

        if (!parsed.success) {
            //collect error messages
            const firstError = parsed.error.issues[0]?.message || "Invalid form input";
            toast.error(firstError);
            return;
        }

        //build payload
        const adminPayload: AdminFormData = {
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            nic: parsed.data.nic,
            phone: parsed.data.phone,
            email: parsed.data.email,
            password: parsed.data.password,
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/admins`, adminPayload,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            clearData();
            toast.success( "Admin Saved Successfully!");
            routeToAdminLogin();
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

    const clearData = () => {
        setFirstName('');
        setLastName('');
        setNic('');
        setPhone('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    const handleCancel = (): void => {
        clearData();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/*Header section*/}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200 shadow-sm">
                <div className="px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">EventWisp</div>
                        <div className="text-sm sm:text-base text-gray-600 font-medium">
                            Platform Control Panel
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Admin Registration</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">Create a new admin account</p>
                    </div>
                </div>
            </div>

            {/*page content*/}
            <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white shadow-2xl rounded-lg border border-gray-200">
                        {/*Form header*/}
                        <div className="px-6 pt-6 pb-2">
                            <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">ADMIN DETAILS</h2>
                        </div>

                        {/*Form content*/}
                        <div className="p-6 sm:p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="firstName"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name<span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={firstName}
                                            required={true}
                                            onChange={handleFirstName}
                                            placeholder="John"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name<span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={lastName}
                                            required={true}
                                            onChange={handleLastName}
                                            placeholder="Doe"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-2">
                                        NIC / Passport <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="nic"
                                        name="nic"
                                        type="text"
                                        value={nic}
                                        required={true}
                                        onChange={handleNic}
                                        placeholder="123456789V or 123456789012"
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone<span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        value={phone}
                                        required={true}
                                        onChange={handlePhone}
                                        placeholder="0771234567 or +94771234567"
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        required={true}
                                        onChange={handleEmail}
                                        placeholder="john.doe@example.com"
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="Password"
                                        name="Password"
                                        type="password"
                                        value={password}
                                        required={true}
                                        onChange={handlePassword}
                                        placeholder="Minimum 8 characters"
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirm-pw"
                                           className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="confirm-pw"
                                        name="confirm-pw"
                                        type="password"
                                        value={confirmPassword}
                                        required={true}
                                        onChange={handleConfirmPassword}
                                        placeholder="Minimum 8 characters"
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        Password must contain at least one uppercase letter, one lowercase letter, and one number
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer">
                                        Register
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium bg-white transition-colors text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/*Footer link*/}
                        <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-center text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link href="/admin/auth/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                        Login Here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Page;