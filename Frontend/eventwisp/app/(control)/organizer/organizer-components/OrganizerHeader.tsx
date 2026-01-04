'use client'

import React, {useEffect, useState} from 'react'
import Link from "next/link";
import {IoIosMenu} from "react-icons/io";
import {useRouter} from "next/navigation";
import {Bell, CircleUserRound, House, Mail} from "lucide-react";

interface OrganizerHeaderProps {
    isNavBarOpen: boolean;
    toggleNavBar: () => void;
}

const OrganizerHeader = ({isNavBarOpen, toggleNavBar}: OrganizerHeaderProps) => {

    const [username,setUsername]=useState<string|null>(null);

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedName = localStorage.getItem('userName'); // key must match what you stored
            if (storedName && storedName !== 'undefined' && storedName !== 'null') {
                setUsername(storedName);
            }
        }
    }, []);

    const navigateToUser = () => {
        router.push("/user");
    }

    return (
        <>
            <div className="h-[10vh] flex items-center justify-between px-[10px] w-full relative">
                {/* Left Section - Home Link */}
                <div className="hidden sm:block">
                    <Link className="flex items-center hover:cursor-pointer" href="/">
                        <div className="text-[25px]">
                            <House />
                        </div>
                        <div className="text-[16px]">
                            Home
                        </div>
                    </Link>
                </div>
                <div className="block sm:hidden">
                    <button
                        className="p-[5px] bg-white rounded-full text-[25px] hover:cursor-pointer border border-gray-200 hover:bg-gray-100 transition-colors duration-300 active:bg-gray-300"
                        onClick={toggleNavBar}>
                        <IoIosMenu/>
                    </button>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <h1 className="text-[25px] sm:text-[30px] text-center font-bold text-gray-900">Organizer Control Panel</h1>
                </div>

                {/* Right Section - User Link */}
                <div className="hidden sm:block">
                    <div className="flex justify-center items-center gap-[20px]">
                        <button className="flex items-center hover:cursor-pointer"
                                onClick={navigateToUser}
                        >
                            <div className="text-[25px]">
                                <CircleUserRound />
                            </div>
                            <div className="text-[16px]">
                                {username || 'username'}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default OrganizerHeader;