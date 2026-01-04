'use client'

import React, {useEffect,useState} from 'react';
import {FaMoneyBillTransfer} from "react-icons/fa6";
import {TfiStatsUp} from "react-icons/tfi";
import {IoLogOutOutline, IoSettingsOutline} from "react-icons/io5";
import {IoIosClose, IoIosHome} from "react-icons/io";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {FaUserCircle} from "react-icons/fa";
import {MdEventAvailable} from "react-icons/md";
import {LayoutDashboard} from "lucide-react";
import {GrTransaction} from "react-icons/gr";

interface SideNavBarProps {
    isNavBarOpen: boolean;
    setIsNavBarOpen: (value: boolean) => void;
}

const SideNavBar = ({isNavBarOpen, setIsNavBarOpen}: SideNavBarProps) => {

    // hold adminId only on client
    const [adminId, setAdminId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);


    //fetch current route
    const pathName = usePathname();

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const id = localStorage.getItem('userId');
            const name = localStorage.getItem('userName'); // fetch username

            if (id && id !== 'undefined' && id !== 'null') {
                setAdminId(id);
            }

            if (name && name !== 'undefined' && name !== 'null') {
                setUsername(name);
            }
        }
    }, []);


    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/cash-flow', icon: FaMoneyBillTransfer, label: 'Cash Flow' },
        { href: '/admin/transactions', icon: GrTransaction, label: 'Transactions' },
        { href: '/admin/statistics', icon: TfiStatsUp, label: 'Statistics' },

        // only add settings link when adminId is known
        ...(adminId
            ? [
                {
                    href: `/admin/${adminId}/settings`,
                    icon: IoSettingsOutline,
                    label: 'Settings',
                },
            ]
            : []),
    ];

    //close nav bar when link is clicked
    const handleLinkClick = () => {
        setIsNavBarOpen(false);
    }

    const handleLogout = () => {
        setIsNavBarOpen(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
        }
        router.push('/admin/auth/login');
    };

    return (
        <>
            <div className={`h-screen bg-gray-700 w-[100px] lg:w-[200px] sm:block
                            ${isNavBarOpen ? "w-[200px]" : "hidden"}`}>
                <div className="w-full relative py-[10px] block sm:hidden">
                    <div className="text-gray-100 text-[32px] absolute right-[20px] hover:cursor-pointer hover:text-gray-300 transition-colors duration-200"
                         onClick={handleLinkClick}>
                        <IoIosClose/>
                    </div>
                </div>
                <div className="h-[10vh] flex justify-center items-center">
                    <div className="text-blue-500 text-[32px]">
                        <MdEventAvailable/>
                    </div>
                </div>

                <div className="block sm:hidden">
                    <div className="flex flex-col justify-center w-full text-gray-100">
                        {/*Home*/}
                        <Link className="w-full" href="/">
                            <div
                                className="flex items-center justify-start px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200">
                                <div className="text-[32px]">
                                    <IoIosHome/>
                                </div>
                                <div className="text-[20px]">
                                    Home
                                </div>
                            </div>
                        </Link>

                        {/*Username*/}
                        <div className="w-full">
                            <div
                                className="flex items-center justify-start px-[20px] py-[10px] gap-4 hover:bg-gray-600 transition-colors duration-200">
                                <div className="text-[32px]">
                                    <FaUserCircle />
                                </div>
                                <div className="text-[20px]">
                                    {username || "Username"}
                                </div>
                            </div>
                        </div>

                    </div>
                    <hr className="border-gray-600 border-t-2 mx-4 my-5 shadow-sm"/>
                </div>

                <div className="flex flex-col justify-center w-full">
                    {navItems.map((item) => {
                        //check if the current pathname is the active one
                        const isActive = pathName === item.href;
                        const IconComponent = item.icon;

                        return (
                            <Link href={item.href} key={item.href} className="w-full">
                                <div
                                    className={`flex items-center justify-center lg:justify-start gap-4 h-[50px] px-[20px] py-[20px] w-full transition-colors duration-200 ${
                                        isActive ? 'bg-gray-600 text-white border-r-4 border-blue-500' : 'text-gray-100 hover:bg-gray-600'
                                    }
                                    ${isNavBarOpen ? "justify-start" : ""}`}>
                                    <div className="nav-icon text-[32px]">
                                        <IconComponent/>
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