'use client'

import React, {useState} from 'react'
import Link from "next/link";
import {useRouter} from "next/navigation";
import {AdminLoginDetails} from "@/types/entityTypes";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";

const Page = () => {

    //fetch password details
    const [email,setEmail]=useState<string>("");
    const [password,setPassword]=useState<string>("");

    const router=useRouter();

    //route to organizer dashboard
    const routeToDashboard= ()=>{
        router.push(`/admin/dashboard`);
    }

    const handleEmail = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {value} = e.target;
        setEmail(value);
    }

    const handlePassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {value} = e.target;
        setPassword(value);
    }

    //handle admin login
    const handleLogin = async (event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();

        const loginPayload:AdminLoginDetails ={
            email:email,
            password:password,
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/admins/login`,loginPayload,
                {
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            console.log(response.data);
            //check if the login successful
            if(response.status === 200){
                if(response.data.userRole==='ADMIN'){
                    //store the token in local storage
                    localStorage.setItem("token",response.data.authToken);
                    localStorage.setItem("userId",response.data.userId);
                    localStorage.setItem("userName",response.data.userName);
                    localStorage.setItem("userRole",response.data.userRole);

                    //set the token as default token for axios
                    axios.defaults.headers.common['Authorization']=`Bearer ${response.data.authToken}`;

                    console.log(response.data.authToken);

                    routeToDashboard();
                    toast.success("Login Successfully");
                }else{
                    toast.error("Not a valid user type");
                }
            }

        }catch(err){
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

    const handleCancel = ():void => {
        setEmail('');
        setPassword('');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/*Header section*/}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200 shadow-sm">
                <div className="px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            <Link href={`/`}>
                                EventWisp
                            </Link>
                        </div>
                        <div className="text-sm sm:text-base text-gray-600 font-medium">
                            Platform Control Panel
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Admin Login</h1>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">Sign in to access the admin panel</p>
                    </div>
                </div>
            </div>

            {/*page content*/}
            <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-2xl rounded-lg border border-gray-200">
                        {/*Form header*/}
                        <div className="px-6 pt-6 pb-2">
                            <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">LOGIN CREDENTIALS</h2>
                        </div>

                        {/*Form content*/}
                        <div className="p-6 sm:p-8">
                            <form className="space-y-6" onSubmit={handleLogin}>
                                {/*email field*/}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email<span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
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
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                                            Password<span className="text-red-600">*</span>
                                        </label>
                                        <Link
                                            href="/admin/auth/forgot"
                                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <input
                                        id="Password"
                                        name="Password"
                                        type="password"
                                        required={true}
                                        value={password}
                                        onChange={handlePassword}
                                        placeholder="Enter your password"
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-400"
                                    />
                                </div>

                                <div className="space-y-3">
                                    {/*login button*/}
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer">
                                        Login
                                    </button>
                                    {/*cancel button*/}
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
                                    Don't have an account?{' '}
                                    <Link href="/admin/auth/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                        Register Here
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
export default Page