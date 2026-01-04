import React from 'react'
import Link from "next/link";
import {FaFacebook, FaLinkedin, FaWhatsapp} from "react-icons/fa";
import {MdEmail} from "react-icons/md";
import {IoCall} from "react-icons/io5";
import {IoMdMail} from "react-icons/io";
import {FaLocationDot} from "react-icons/fa6";

const MainFooter = () => {
    return (
        <footer className="bg-gray-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/*details section*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Quick Links Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
                            <li><Link href="/categories/business-tech" className="text-gray-300 hover:text-white">Business & Tech</Link></li>
                            <li><Link href="/categories/educational" className="text-gray-300 hover:text-white">Educational</Link></li>
                            <li><Link href="/categories/entertainment" className="text-gray-300 hover:text-white">Entertainment</Link></li>
                            <li><Link href="/auth/organizer/register" className="text-gray-300 hover:text-white">Register As Organizer</Link></li>
                            <li><Link href="/auth/organizer/login" className="text-gray-300 hover:text-white">Login As Organizer</Link></li>
                        </ul>
                    </div>

                    {/* Legal & FAQ Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal & FAQ</h3>
                        <ul className="space-y-2">
                            <li><Link href="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
                            <li><Link href="/about-us" className="text-gray-300 hover:text-white">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2 text-gray-300">
                                <IoCall /> <span>+94 421 312 421</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-300">
                                <IoMdMail /> <span>mail.ew@ewentwisp.com</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-300">
                                <FaLocationDot /> <span>532, Anywhere, Somewhere</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Icons Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-gray-300 hover:text-white"><FaFacebook size={24}/></a>
                            <a href="#" className="text-gray-300 hover:text-white"><FaLinkedin size={24}/></a>
                            <a href="#" className="text-gray-300 hover:text-white"><FaWhatsapp size={24}/></a>
                            <a href="mailto:your-email@example.com" className="text-gray-300 hover:text-white"><MdEmail size={26}/></a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-600 my-6"/>

                {/* Bottom copyright */}
                <div className="text-center text-sm text-gray-400">
                    <p>© 2025 EventWisp. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    )
}
export default MainFooter;
