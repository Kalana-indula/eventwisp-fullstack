'use client'

import React from 'react'
import MainFooter from "@/app/(root)/app-components/MainFooter";

const Page = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Section */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 border-b border-gray-200/30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-4">
                        <div className="relative inline-block">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                    Privacy Policy
                                </span>
                            </h1>
                            <div
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full"
                                style={{ backgroundColor: "#193cb8" }}
                            ></div>
                        </div>
                        <div className="mt-3 flex justify-center items-center gap-2 opacity-60">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#193cb8" }}></div>
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Policy Content */}
            <main className="flex-grow bg-white">
                <div className="max-w-5xl mx-auto px-6 py-12 text-gray-700 leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">1. Introduction</h2>
                        <p>
                            Welcome to <strong>Eventwisp</strong>. Your privacy is important to us. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your information when you use our
                            platform. By accessing or using Eventwisp, you agree to the terms of this Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">2. Information We Collect</h2>
                        <p>We may collect the following types of information:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li><strong>Personal Information:</strong> Such as your name, email address, phone number, and payment details when registering or making a booking.</li>
                            <li><strong>Account Information:</strong> Login credentials, profile data, and preferences.</li>
                            <li><strong>Event Details:</strong> Information related to events you create, organize, or attend.</li>
                            <li><strong>Usage Data:</strong> Information about your interactions with the platform including pages visited, IP address, browser type, and device information.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">3. How We Use Your Information</h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Provide and maintain the Eventwisp platform.</li>
                            <li>Process bookings and payments securely.</li>
                            <li>Send notifications, confirmations, and support messages.</li>
                            <li>Improve user experience and platform performance.</li>
                            <li>Comply with legal obligations and prevent fraud.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">4. How We Protect Your Data</h2>
                        <p>
                            We implement appropriate technical and organizational measures to secure your personal
                            information, including encryption, password protection, and secure data transmission
                            protocols. While we strive to protect your data, no system is completely secure, and we
                            cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">5. Sharing of Information</h2>
                        <p>
                            Eventwisp does not sell your data. We may share your information only with:
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Service providers assisting in payment processing or email delivery.</li>
                            <li>Event organizers (if you are an attendee) to facilitate participation.</li>
                            <li>Law enforcement or regulatory authorities when required by law.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">6. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar tracking technologies to enhance your browsing experience,
                            remember preferences, and analyze usage. You can modify your browser settings to disable
                            cookies, but some features of Eventwisp may not function properly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">7. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal data. You may also withdraw
                            consent for certain data uses at any time by contacting us at{" "}
                            <a href="mailto:support@eventwisp.com" className="text-blue-600 hover:underline">
                                support@eventwisp.com
                            </a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">8. Data Retention</h2>
                        <p>
                            We retain your personal data only for as long as necessary to fulfill the purposes outlined
                            in this Privacy Policy or as required by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">9. Third-Party Links</h2>
                        <p>
                            Eventwisp may contain links to third-party websites. We are not responsible for the privacy
                            practices or content of these external sites. Please review their policies before sharing
                            personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">10. Updates to This Policy</h2>
                        <p>
                            We may update this Privacy Policy periodically. The revised version will be posted on this
                            page with an updated “Last Updated” date. We encourage you to review this page regularly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">11. Contact Us</h2>
                        <p>
                            For questions or concerns about this Privacy Policy or your data, please contact us at:
                        </p>
                        <div className="mt-2">
                            <p><strong>Email:</strong> <a href="mailto:support@eventwisp.com" className="text-blue-600 hover:underline">support@eventwisp.com</a></p>
                            <p><strong>Address:</strong> Eventwisp Pvt Ltd, Colombo, Sri Lanka</p>
                        </div>
                    </section>

                    <div className="pt-4 text-sm text-gray-500 italic">
                        Last Updated: October 20, 2025
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto">
                <MainFooter />
            </footer>
        </div>
    )
}
export default Page;
