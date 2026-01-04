'use client'

import React, {useState} from 'react'
import {RegisterOrganizerDto} from "@/types/entityTypes";
import {toast} from "react-hot-toast";
import axios, {AxiosError} from "axios";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {RegisterOrganizerForm, registerOrganizerSchema} from "@/lib/validation";
import MainFooter from "@/app/(root)/app-components/MainFooter";


const Page = () => {

    //states
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [nicPassport, setNicPassport] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [companyName, setCompanyName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    //store errors
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterOrganizerForm, string>>>({});
    const [loading, setLoading] = useState(false);


    const router=useRouter();

    const routeToLogin=()=>{
        router.push('/auth/organizer/login');
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        // Build form data object for validation
        const formData: RegisterOrganizerForm = {
            firstName,
            lastName,
            nic: nicPassport,
            companyName,
            phone,
            email,
            password,
            confirmPassword,
        };

        //  Zod validation
        const parsed = registerOrganizerSchema.safeParse(formData);

        if (!parsed.success) {
            // Collect the first error message (or map them per field if you want)
            const firstError = parsed.error.issues[0]?.message || "Invalid form input";
            toast.error(firstError);
            return;
        }

        // Build backend payload (exclude confirmPassword)
        const AddOrganizerPayload: RegisterOrganizerDto = {
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            nic: parsed.data.nic,
            companyName: parsed.data.companyName || "",
            phone: parsed.data.phone,
            email: parsed.data.email,
            password: parsed.data.password,
        };

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/organizers`, AddOrganizerPayload,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            clearFields();
            console.log(response.data);
            toast.success("Your account was created successfully!");
            routeToLogin();
        } catch (err) {
            if (err instanceof AxiosError) {
                const errorMessage = err.response?.data?.message || err.message || "An error occurred";
                toast.error(errorMessage);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An unknown error occurred");
            }
        }
    };


    const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFirstName(event.target.value);
    }

    const handleLastName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setLastName(event.target.value);
    }

    const handleNicPassport = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setNicPassport(event.target.value);
    }

    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    }

    const handlePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    }

    const handleCompanyName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCompanyName(event.target.value);
    }

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    }

    const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirmPassword(event.target.value);
    }

    const handleCancel = () => {
        clearFields();
    }

    const clearFields = () => {
        setFirstName('');
        setLastName('');
        setNicPassport('');
        setEmail('');
        setCompanyName('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 border-b border-gray-200/30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-4">
                        {/* Main Title */}
                        <div className="relative inline-block">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                    Register As Organizer
                                </span>
                            </h1>
                            {/* Accent Line */}
                            <div
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full"
                                style={{backgroundColor: "#193cb8"}}>
                            </div>
                        </div>
                        {/* Decorative Elements */}
                        <div className="mt-3 flex justify-center items-center gap-2 opacity-60">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div
                                className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: "#193cb8"}}></div>
                            <div
                                className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-8">
                {/* Subtitle section */}
                <div className="text-center mb-8">
                    <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                        Join our platform and start creating amazing events
                    </p>
                </div>

                {/* Form section */}
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {/* First name and last name */}
                            <div className="grid grid-cols-1 space-y-6 sm:space-y-0 sm:grid-cols-2 sm:gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={firstName}
                                        required={true}
                                        onChange={handleFirstName}
                                        placeholder="Enter your first name"
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                        style={{focusRingColor: '#193cb8'}}
                                    />
                                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={lastName}
                                        required={true}
                                        onChange={handleLastName}
                                        placeholder="Enter your last name"
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                        style={{focusRingColor: '#193cb8'}}
                                    />
                                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                                </div>
                            </div>

                            {/* NIC/Passport Number */}
                            <div className="space-y-2">
                                <label htmlFor="nicPassport" className="block text-sm font-semibold text-gray-700">
                                    NIC / Passport Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nicPassport"
                                    name="nicPassport"
                                    type="text"
                                    value={nicPassport}
                                    required={true}
                                    onChange={handleNicPassport}
                                    placeholder="Enter your NIC or Passport number"
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                    style={{focusRingColor: '#193cb8'}}
                                />
                                {errors.nic && <p className="mt-1 text-sm text-red-600">{errors.nic}</p>}
                            </div>

                            {/* Company name */}
                            <div className="space-y-2">
                                <label htmlFor="company" className="block text-sm font-semibold text-gray-700">
                                    Company Name
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    value={companyName}
                                    onChange={handleCompanyName}
                                    placeholder="Enter your company name (optional)"
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                    style={{focusRingColor: '#193cb8'}}
                                />
                                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                            </div>

                            {/* Contact details */}
                            <div className="grid grid-cols-1 space-y-6 sm:space-y-0 sm:grid-cols-2 sm:gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={phone}
                                        required={true}
                                        onChange={handlePhone}
                                        placeholder="+94 77 123 4567"
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                        style={{focusRingColor: '#193cb8'}}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        required={true}
                                        onChange={handleEmail}
                                        placeholder="john.doe@example.com"
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                        style={{focusRingColor: '#193cb8'}}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Password fields */}
                            <div className="grid grid-cols-1 space-y-6 sm:space-y-0 sm:grid-cols-2 sm:gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        required={true}
                                        onChange={handlePassword}
                                        placeholder="Minimum 8 characters"
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                        style={{focusRingColor: '#193cb8'}}
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        required={true}
                                        onChange={handleConfirmPassword}
                                        placeholder="Confirm your password"
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                        style={{focusRingColor: '#193cb8'}}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password requirements */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Password Requirements</h4>
                                        <p className="text-xs text-blue-700">
                                            Password must contain at least one uppercase letter, one lowercase letter, and
                                            one number
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-4 pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                    style={{backgroundColor: '#193cb8'}}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Create Account
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full py-4 px-6 rounded-2xl border-2 font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                                    style={{
                                        borderColor: '#193cb8',
                                        color: '#193cb8',
                                        backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#193cb8";
                                        e.currentTarget.style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = "#193cb8";
                                    }}
                                >
                                    Clear Form
                                </button>
                            </div>

                            {/* Additional info */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link href="/auth//organizer/login" className="font-semibold underline" style={{color: '#193cb8'}}>
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer section */}
            <footer className="mt-auto">
                <MainFooter/>
            </footer>
        </div>
    )
}

export default Page