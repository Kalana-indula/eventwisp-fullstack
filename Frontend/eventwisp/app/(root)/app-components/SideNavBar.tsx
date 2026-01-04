'use client'

import React from 'react'
import { LuMessageSquareText, LuUserRound } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { IoIosClose, IoIosHome, IoIosNotifications } from "react-icons/io";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { LayoutDashboard } from "lucide-react";

interface SideNavBarProps {
    isNavBarOpen: boolean;
    setIsNavBarOpen: (value: boolean) => void;
}

const SideNavBar = ({ isNavBarOpen, setIsNavBarOpen }: SideNavBarProps) => {

    const pathName = usePathname();
    const router = useRouter();
    const params = useParams();
    const organizerId = params.organizerId;

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
            href: `/organizer/${organizerId}/settings`,
            icon: MdOutlinePayment,
            label: 'Settings'
        }
    ];

    const handleLinkClick = () => {
        setIsNavBarOpen(false);
    }

    const navigateToRegister = () => {
        router.push("/auth/organizer/register");
    }

    const navigateToLogin = () => {
        router.push("/auth/organizer/login");
    }

    const navigateToEntertainment = ()=>{
        router.push("/categories/entertainment");
    }

    const navigateToEducational = ()=>{
        router.push("/categories/educational");
    }

    const navigateToBusinessAndTech = ()=>{
        router.push("/categories/business & tech");
    }

    return (
        <>
            <div className={`h-screen bg-gray-700 w-[100px] lg:w-[200px] sm:block
                            ${isNavBarOpen ? "w-[200px]" : "hidden"} relative`}>
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

                        <button className="w-full" onClick={navigateToLogin}>
                            <div
                                className="flex items-center justify-start px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200">
                                <div className="text-[20px]">
                                   Login
                                </div>
                            </div>
                        </button>
                        <button className="w-full" onClick={navigateToRegister}>
                            <div
                                className="flex items-center justify-start px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200">
                                <div className="text-[20px]">
                                    Register
                                </div>
                            </div>
                        </button>

                    </div>
                    <hr className="border-gray-600 border-t-2 mx-4 my-5 shadow-sm" />
                </div>

                <div className="flex flex-col justify-center text-gray-100 lg:hidden">
                    <button
                        className="flex items-center justify-start sm:justify-center px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200"
                        onClick={navigateToEntertainment}>
                        <div className="text-[20px] sm:hidden">
                            Entertainment
                        </div>
                    </button>
                    <button
                        className="flex items-center justify-start sm:justify-center px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200"
                        onClick={navigateToEducational}>
                        <div className="text-[20px] sm:hidden">
                            Educational
                        </div>
                    </button>
                    <button
                        className="flex items-center justify-start sm:justify-center px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200"
                        onClick={navigateToBusinessAndTech}>
                        <div className="text-[20px] sm:hidden">
                            Business & Tech
                        </div>
                    </button>
                    <hr className="border-gray-600 border-t-2 mx-4 my-5 shadow-sm"/>
                </div>

                {/*<div className="flex flex-col justify-center w-full">*/}
                {/*    {navItems.map((item) => {*/}
                {/*        const isActive = pathName === item.href;*/}
                {/*        const IconComponent = item.icon;*/}

                {/*        return (*/}
                {/*            <Link href={item.href} key={item.href} className="w-full" onClick={handleLinkClick}>*/}
                {/*                <div*/}
                {/*                    className={`flex items-center justify-center lg:justify-start gap-4 h-[50px] px-[20px] py-[20px] w-full transition-colors duration-200 ${*/}
                {/*                        isActive ? 'bg-gray-600 text-white border-r-4 border-blue-500' : 'text-gray-100 hover:bg-gray-600'*/}
                {/*                    }*/}
                {/*                    ${isNavBarOpen ? "justify-start" : ""}`}>*/}
                {/*                    <div className="nav-icon text-[32px]">*/}
                {/*                        <IconComponent />*/}
                {/*                    </div>*/}
                {/*                    <div*/}
                {/*                        className={`page-name text-[20px] lg:block ${isNavBarOpen ? "block" : "hidden"}`}>*/}
                {/*                        {item.label}*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </Link>*/}
                {/*        );*/}
                {/*    })}*/}
                {/*</div>*/}
            </div>
        </>
    )
}

export default SideNavBar;
