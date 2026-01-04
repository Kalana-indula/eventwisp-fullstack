'use client'

import React from 'react'
import {useRouter} from "next/navigation";
import EventCard from "@/app/(root)/app-components/EventCard";

interface Event {
    id: number;
    image: string;
    date: string;
    time: string;
    title: string;
    venue: string;
    type: string;
    ticketPrice: string;
    currency: string;
    onBookNow: () => void;
}

const Page = () => {
    //configure routing
    const router = useRouter();

    //route to booking page
    const routeToBooking = (eventId: number) => {
        router.push(`/event/${eventId}/booking`);
    }

    const featuredEvents: Event[] = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
            date: "20 March 2025",
            time: "09:00 AM",
            title: "Tech Innovators Summit 2025",
            venue: "Convention Center, San Francisco",
            type: "Conference",
            ticketPrice: "199.99",
            currency: "USD",
            onBookNow: () => routeToBooking(1)
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop",
            date: "25 March 2025",
            time: "10:00 AM",
            title: "Global Sustainability Forum",
            venue: "Eco Hall, New York",
            type: "Forum",
            ticketPrice: "149.99",
            currency: "USD",
            onBookNow: () => routeToBooking(2)
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
            date: "28 March 2025",
            time: "11:00 AM",
            title: "Crafting Compelling Stories",
            venue: "Writers Guild, Los Angeles",
            type: "Workshop",
            ticketPrice: "99.99",
            currency: "USD",
            onBookNow: () => routeToBooking(3)
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=250&fit=crop",
            date: "30 March 2025",
            time: "02:00 PM",
            title: "Digital Marketing Masterclass",
            venue: "Business Center, Chicago",
            type: "Masterclass",
            ticketPrice: "299.99",
            currency: "USD",
            onBookNow: () => routeToBooking(4)
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
            date: "05 April 2025",
            time: "06:00 PM",
            title: "Jazz Under The Stars",
            venue: "Central Park, New York",
            type: "Concert",
            ticketPrice: "75.99",
            currency: "USD",
            onBookNow: () => routeToBooking(5)
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop",
            date: "10 April 2025",
            time: "09:30 AM",
            title: "Health & Wellness Expo",
            venue: "Community Center, Miami",
            type: "Expo",
            ticketPrice: "45.99",
            currency: "USD",
            onBookNow: () => routeToBooking(6)
        }
    ];

    return (
        <>
            {/* Header section */}
            <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                <div className="text-center mb-2 sm:mb-4 pt-3 sm:p-1">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Popular Events</h1>
                    <p className="mt-1 text-sm sm:text-base text-gray-600">Experience the most celebrated events near you </p>
                </div>
            </div>

            {/* Main content */}
            <div className="px-3 py-1 sm:px-4 sm:py-2 md:px-8 bg-white">
                {/* Events grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {featuredEvents && featuredEvents.length > 0 ? (
                        featuredEvents.map((event) => (
                            <div key={event.id} className="flex justify-center">
                                <EventCard event={event}/>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-gray-50 p-8 rounded-md text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div
                                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No featured events available</h3>
                                <p className="text-sm text-gray-500">Check back later for upcoming events.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/*Footer section*/}
            <footer className="bg-gray-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="col-span-1 lg:col-span-2">
                            <h3 className="text-xl font-bold mb-4">CONTACT US</h3>
                            <p className="text-blue-200 mb-4">
                                EventWisp is simply a dummy event management system, designed to streamline event
                                planning and ticketing. It has been the industry standard for organizers since the
                                2020s.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                            <div className="space-y-2 text-blue-200">
                                <p>📧 info@eventips.com</p>
                                <p>📞 Phone: (123) 456-7890</p>
                                <p>📍 SouthBangiya, Argamala, Bollatta</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-blue-200">
                        <p>© 2023 EventWisp. All Rights Reserved. | Privacy Policy | Terms & Conditions</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Page