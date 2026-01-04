// reference code
'use client'

import React, {useState} from 'react'
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import AdminProtectedRoute from "@/utils/AdminProtectedRoutes";

//types
interface ManagerFormData {
    firstName: string;
    lastName: string;
    nic: string;
    phone: string;
    email: string;
    password: string;
}

const Page = () => {

    //fetch input details
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [nic, setNic] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    //handle inputs
    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = e.target;
        setFirstName(value);
        // console.log(firstName);
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

        //check if the password and confirm password are not matching
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
        }

        if (password === confirmPassword) {

            const ManagerData: ManagerFormData = {
                firstName: firstName,
                lastName: lastName,
                nic: nic,
                phone: phone,
                email: email,
                password: password
            }

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/managers`, ManagerData,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                toast.success(response.data.message + "Manager Saved Successfully!");

                setFirstName('');
                setLastName('');
                setNic('');
                setPhone('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

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

    }

    const handleCancel = (): void => {
        setFirstName('');
        setLastName('');
        setNic('');
        setPhone('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <>
            <AdminProtectedRoute>
                {/*Header section*/}
                <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900">Manager Registration</h1>
                        <p className="mt-1 text-gray-600">Create a new manager account</p>
                    </div>
                </div>

                {/*page content*/}
                <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 bg-white">
                    {/*input form div*/}
                    <div
                        className="display-form bg-gray-200 border-l-4 border-blue-500 px-4 py-2 mb-6 rounded-r-md shadow-sm">
                        <div>
                            <h3 className="text-gray-500 font-medium py-2">MANAGER DETAILS</h3>
                        </div>
                        <div className="max-w-md mx-auto">
                            <div className="bg-white shadow-2xl p-8 rounded-lg">
                                <form className="space-y-6" onSubmit={handleSubmit}>

                                    {/*first name and last name*/}
                                    <div className="grid grid-cols-1 space-y-6 sm:space-y-0 sm:grid-cols-2 sm:gap-6">
                                        <div>
                                            <label htmlFor="firstName"
                                                   className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name<span className="text-red-500">*</span>
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
                                                Last Name Name<span className="text-red-600">*</span>
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

                                    {/*nic field*/}
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

                                    {/*contact details field*/}
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

                                    {/*email field*/}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            E Mail <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={email}
                                            required={true}
                                            onChange={handleEmail}
                                            placeholder="john.doe@example.com"
                                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                        />
                                    </div>

                                    {/*password field*/}
                                    <div>
                                        <label htmlFor="Password"
                                               className="block text-sm font-medium text-gray-700 mb-2">
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
                                            value={confirmPassword}
                                            required={true}
                                            onChange={handleConfirmPassword}
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
                                        {/*save button*/}
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer">
                                            Save
                                        </button>

                                        {/*cancel button*/}
                                        <button
                                            onClick={handleCancel}
                                            className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium bg-white transition-colors text-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer">
                                            Cancel
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminProtectedRoute>
        </>
    )
}
export default Page;
