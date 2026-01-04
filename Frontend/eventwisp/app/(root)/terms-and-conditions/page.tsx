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
                                    Terms & Conditions
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

            {/* Terms & Conditions Content */}
            <main className="flex-grow bg-white">
                <div className="max-w-5xl mx-auto px-6 py-12 text-gray-700 leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">1. Introduction</h2>
                        <p>
                            Welcome to <strong>Eventwisp</strong>. By accessing or using our platform, you agree to comply
                            with and be bound by these Terms and Conditions. Please read them carefully before using
                            Eventwisp’s services. If you do not agree to these terms, you must not use the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">2. Definitions</h2>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li><strong>“Eventwisp”</strong> refers to our event management platform and related services.</li>
                            <li><strong>“User”</strong> means any person who accesses or uses the platform.</li>
                            <li><strong>“Organizer”</strong> refers to a user who creates or manages events.</li>
                            <li><strong>“Attendee”</strong> refers to a user who books or participates in events.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">3. Use of the Platform</h2>
                        <p>
                            You agree to use Eventwisp only for lawful purposes and in a manner that does not infringe the
                            rights of others or restrict their use of the platform. You must not attempt to interfere with,
                            damage, or gain unauthorized access to any part of the service or related systems.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">4. Account Registration</h2>
                        <p>
                            To access certain features, you may need to register for an account. You agree to provide
                            accurate, complete, and up-to-date information. You are responsible for maintaining the
                            confidentiality of your login credentials and for all activities under your account.
                            Eventwisp will not be liable for any loss resulting from unauthorized access to your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">5. Event Management and Bookings</h2>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Organizers are solely responsible for the accuracy of event details, ticket pricing, and schedules.</li>
                            <li>Attendees must ensure that their booking details are correct before completing a payment.</li>
                            <li>Eventwisp serves as an intermediary between organizers and attendees but is not responsible for event cancellations, delays, or modifications made by organizers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">6. Payments and Refunds</h2>
                        <p>
                            Payments made through Eventwisp are processed securely via third-party payment providers. By
                            completing a payment, you agree to the provider’s terms of service. Refunds, if applicable,
                            are governed by the event organizer’s refund policy. Eventwisp is not responsible for disputes
                            between organizers and attendees regarding refunds or cancellations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">7. Content Ownership</h2>
                        <p>
                            Users retain ownership of content they upload to Eventwisp. However, by posting content (such
                            as event descriptions or media), you grant Eventwisp a non-exclusive, royalty-free license to
                            use, display, and distribute that content solely for providing and promoting the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">8. Prohibited Activities</h2>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Engaging in fraudulent, abusive, or unlawful behavior.</li>
                            <li>Posting or distributing harmful or offensive content.</li>
                            <li>Using Eventwisp to promote unauthorized or illegal events.</li>
                            <li>Attempting to hack, decompile, or reverse-engineer the platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">9. Limitation of Liability</h2>
                        <p>
                            Eventwisp provides its platform “as is” without warranties of any kind. We are not liable for
                            any direct, indirect, incidental, or consequential damages arising from your use of the
                            platform or participation in any event listed on it. Your use of Eventwisp is at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">10. Termination</h2>
                        <p>
                            Eventwisp reserves the right to suspend or terminate your account without prior notice if you
                            violate these terms or engage in activities that may harm the platform or its users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">11. Changes to Terms</h2>
                        <p>
                            We may update these Terms & Conditions at any time. The latest version will always be
                            available on this page, and continued use of the platform after updates indicates your
                            acceptance of the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">12. Governing Law</h2>
                        <p>
                            These Terms & Conditions shall be governed by and construed in accordance with the laws of
                            Sri Lanka. Any disputes arising from these terms shall be subject to the exclusive jurisdiction
                            of the courts of Colombo, Sri Lanka.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">13. Contact Us</h2>
                        <p>
                            If you have questions or concerns about these Terms, please contact us at:
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
