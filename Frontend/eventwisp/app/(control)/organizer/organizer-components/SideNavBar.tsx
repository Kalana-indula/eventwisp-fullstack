'use client'

import React, {useEffect, useState} from 'react'
import { LuMessageSquareText, LuUserRound } from "react-icons/lu";
import { IoIosClose, IoIosHome, IoIosNotifications } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { LayoutDashboard } from "lucide-react";
import {GrTransaction} from "react-icons/gr";
import {IoSettingsOutline} from "react-icons/io5";

interface SideNavBarProps {
    isNavBarOpen: boolean;
    setIsNavBarOpen: (value: boolean) => void;
}

const SideNavBar = ({ isNavBarOpen, setIsNavBarOpen }: SideNavBarProps) => {

    //organizer id and username
    const [username, setUsername] = useState<string | null>(null);

    //fetch current route
    const pathName = usePathname();
    const router = useRouter();
    const params = useParams();
    const organizerId = params.organizerId;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const name = localStorage.getItem('userName'); // fetch username

            if (name && name !== 'undefined' && name !== 'null') {
                setUsername(name);
            }
        }
    }, []);

    const navItems = [
        {
            href: `/organizer/${organizerId}/dashboard`,
            icon: LayoutDashboard,
            label: 'Dashboard'
        },
        {
            href: `/organizer/${organizerId}/revenue`,
            icon: LuUserRound,
            label: 'Revenue'
        },
        {
            href: `/organizer/${organizerId}/transactions`,
            icon: GrTransaction,
            label: 'Transactions'
        },
        {
            href: `/organizer/${organizerId}/settings`,
            icon: IoSettingsOutline,
            label: 'Settings'
        }
    ];

    const handleLinkClick = () => {
        setIsNavBarOpen(false);
    }

    const navigateToUser = () => {
        router.push("/user");
    }

    const handleLogout = () => {

        // Close navbar on mobile
        setIsNavBarOpen(false);

        //clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        // Redirect to login or home page
        router.push("/auth/organizer/login");
    }

    return (
        <>
            <div className={`h-screen bg-gray-700 w-[100px] lg:w-[200px] sm:block
                            ${isNavBarOpen ? "w-[200px]" : "hidden"}`}>
                <div className="w-full relative py-[10px] block sm:hidden">
                    <div className="text-gray-100 text-[32px] absolute right-[20px] hover:cursor-pointer hover:text-gray-300 transition-colors duration-200"
                         onClick={handleLinkClick}>
                        <IoIosClose />
                    </div>
                </div>
                <div className="h-[10vh] flex justify-center items-center">
                    <div className="text-blue-500 text-[32px]">
                        <MdEventAvailable />
                    </div>
                </div>

                <div className="block sm:hidden">
                    <div className="flex flex-col justify-center w-full text-gray-100">
                        <Link className="w-full" href="/">
                            <div
                                className="flex items-center justify-start px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200">
                                <div className="text-[32px]">
                                    <IoIosHome />
                                </div>
                                <div className="text-[20px]">
                                    Home
                                </div>
                            </div>
                        </Link>

                        <Link className="w-full" href="/user">
                            <div
                                className="flex items-center justify-start px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200">
                                <div className="text-[32px]">
                                    <FaUserCircle />
                                </div>
                                <div className="text-[20px]">
                                    {username || 'username'}
                                </div>
                            </div>
                        </Link>
                    </div>
                    <hr className="border-gray-600 border-t-2 mx-4 my-5 shadow-sm" />
                </div>
                <div className="flex flex-col justify-center w-full">
                    {navItems.map((item) => {
                        const isActive = pathName === item.href;
                        const IconComponent = item.icon;

                        return (
                            <Link href={item.href} key={item.href} className="w-full" onClick={handleLinkClick}>
                                <div className={`flex items-center justify-center lg:justify-start gap-4 h-[50px] px-[20px] py-[20px] w-full transition-colors duration-200 ${
                                    isActive ? 'bg-gray-600 text-white border-r-4 border-blue-500' : 'text-gray-100 hover:bg-gray-600'
                                }
                                    ${isNavBarOpen ? "justify-start" : ""}`}>
                                    <div className="nav-icon text-[32px]">
                                        <IconComponent strokeWidth={1.5} />
                                    </div>
                                    <div
                                        className={`page-name text-[20px] lg:block ${isNavBarOpen ? "block" : "hidden"}`}>
                                        {item.label}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full">
                        <div className={`flex items-center justify-center lg:justify-start gap-4 h-[50px] px-[20px] py-[20px] w-full transition-colors duration-200 text-gray-100 hover:bg-gray-600 hover:cursor-pointer
                            ${isNavBarOpen ? "justify-start" : ""}`}>
                            <div className="nav-icon text-[32px]">
                                <IoLogOutOutline strokeWidth={1.5} />
                            </div>
                            <div
                                className={`page-name text-[20px] lg:block ${isNavBarOpen ? "block" : "hidden"}`}>
                                Logout
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
}

export default SideNavBar;