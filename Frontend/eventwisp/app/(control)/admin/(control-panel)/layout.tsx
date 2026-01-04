'use client'

import React, {useEffect, useState} from 'react'
import AdminHeader from "@/app/(control)/admin/admin-components/AdminHeader";
import SideNavBar from "@/app/(control)/admin/admin-components/SideNavBar";

const Layout = ({children}: { children: React.ReactNode }) => {
    // check navbar status
    const [isNavBarOpen, setIsNavBarOpen] = useState<boolean>(false);

    const toggleNavBar = () => {
        setIsNavBarOpen(!isNavBarOpen);
    }

    // Auto-close navbar when screen size is larger than sm
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) { // 640px is Tailwind's sm breakpoint
                setIsNavBarOpen(false);
            }
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className="flex relative">
            {/*add overlay effect on mobile screens*/}
            {/*sm:relative enables the sidebar to behave normally on larger screen sizes*/}
            <div className={`
                fixed sm:relative
                z-50
                transition-transform duration-200 ease-in-out
                ${isNavBarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
            `}>
                <SideNavBar isNavBarOpen={isNavBarOpen} setIsNavBarOpen={setIsNavBarOpen}/>
            </div>

            {/*overlay backdrop for mobile*/}
            {isNavBarOpen && (
                <div className="fixed inset-0 bg-black/25 z-40 sm:hidden"
                     onClick={() => setIsNavBarOpen(false)}
                />
            )}
            <div className="flex-1 h-screen flex flex-col sm:ml-0">
                {/* Fixed Header */}
                <div className="top-0 flex justify-center z-30 bg-white w-full">
                    <AdminHeader isNavBarOpen={isNavBarOpen} toggleNavBar={toggleNavBar}/>
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