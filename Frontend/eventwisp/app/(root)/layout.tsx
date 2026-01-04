'use client'

import React, {useEffect, useState} from 'react'
import SideNavBar from "@/app/(root)/app-components/SideNavBar";
import TopNavBar from "@/app/(root)/app-components/TopNavBar";

const Layout = ({children}:{children:React.ReactNode}) => {
    const [isNavBarOpen, setIsNavBarOpen] = useState<boolean>(false);

    const toggleNavBarOpen = () => {
        setIsNavBarOpen(!isNavBarOpen);
    }

    // Auto close navbar when screen size changes or on initial load
    useEffect(() => {
        const handleResize = () => {
            // Close navbar if screen is larger than sm (640px)
            if (window.innerWidth >= 640) {
                setIsNavBarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call on initial load

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex relative">
            {/* SideNavBar - Only show on mobile screens */}
            <div className={`
                fixed
                z-50
                transition-transform duration-200 ease-in-out
                ${isNavBarOpen ? 'translate-x-0' : '-translate-x-full'}
                sm:hidden
            `}>
                <SideNavBar isNavBarOpen={isNavBarOpen} setIsNavBarOpen={setIsNavBarOpen}/>
            </div>

            {/* Overlay backdrop for mobile */}
            {isNavBarOpen && (
                <div className="fixed inset-0 bg-black/25 z-40 sm:hidden"
                     onClick={() => setIsNavBarOpen(false)}
                />
            )}

            <div className="flex-1 h-screen flex flex-col">
                {/* Fixed Header */}
                <div className="top-0 flex justify-center z-30 w-full">
                    <TopNavBar isNavBarOpen={isNavBarOpen} toggleNavBar={toggleNavBarOpen}/>
                </div>

                {/* Scrollable Main Content */}
                <div className="flex-1 overflow-y-auto px-0">
                    {children}
                </div>
            </div>
        </div>
    )
}
export default Layout;