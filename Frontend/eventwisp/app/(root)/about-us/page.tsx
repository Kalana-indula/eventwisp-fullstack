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
                                    About Eventwisp
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

            {/* About Content */}
            <main className="flex-grow bg-white">
                <div className="max-w-5xl mx-auto px-6 py-12 text-gray-700 leading-relaxed space-y-12">

                    {/* Intro Section */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Who We Are</h2>
                        <p>
                            <strong>Eventwisp</strong> is a modern event management and ticketing platform designed to simplify the way
                            people create, manage, and attend events. From intimate workshops to large-scale festivals,
                            we provide organizers and attendees with a seamless experience through an all-in-one digital
                            ecosystem that blends innovation, convenience, and security.
                        </p>
                    </section>

                    {/* Mission Section */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Mission</h2>
                        <p>
                            Our mission is to empower event organizers and attendees by offering a reliable, user-friendly,
                            and transparent platform that eliminates the complexities of event planning and ticketing.
                            We aim to make every event — big or small — easy to manage, effortless to discover, and
                            unforgettable to experience.
                        </p>
                    </section>

                    {/* Vision Section */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Vision</h2>
                        <p>
                            We envision a world where technology seamlessly connects people through shared experiences.
                            Eventwisp strives to become the go-to digital hub for events — where creativity meets simplicity,
                            and where every user can host or attend with confidence and ease.
                        </p>
                    </section>

                    {/* Core Values */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Core Values</h2>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                            <li><strong>Innovation:</strong> We continuously evolve to provide smart and scalable event management solutions.</li>
                            <li><strong>Transparency:</strong> We maintain clarity and fairness in all transactions and communications.</li>
                            <li><strong>Reliability:</strong> Our platform is built with stability and performance at its core.</li>
                            <li><strong>Security:</strong> We prioritize data protection and safe payment handling through trusted integrations.</li>
                            <li><strong>Community:</strong> We believe in building meaningful connections through shared experiences.</li>
                        </ul>
                    </section>

                    {/* Our Story */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Story</h2>
                        <p>
                            Eventwisp was founded with a simple idea — to make event management smarter, faster, and more
                            accessible for everyone. We noticed how event organizers often struggled with multiple tools
                            for booking, payments, and attendee engagement. So, we built a unified system that brings
                            everything under one roof — from event creation to secure payments, QR-based ticketing, and
                            post-event analytics.
                        </p>
                        <p className="mt-3">
                            Today, Eventwisp continues to evolve with features like automated email notifications,
                            organizer dashboards, and Stripe-powered payments — helping thousands of users create
                            remarkable events effortlessly.
                        </p>
                    </section>

                    {/* The Team */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">The Team Behind Eventwisp</h2>
                        <p>
                            Our team is a group of passionate developers, designers, and innovators who believe that event
                            management should be intuitive and accessible. We blend technical excellence with creative
                            thinking to deliver a platform that’s both powerful and user-friendly.
                        </p>
                        <p className="mt-3">
                            Guided by our shared commitment to user satisfaction and modern design, we are continuously
                            improving Eventwisp to serve the growing needs of event organizers and attendees worldwide.
                        </p>
                    </section>

                    {/* Contact Section */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Get in Touch</h2>
                        <p>
                            Whether you’re an event organizer looking to scale or an attendee exploring your next experience,
                            we’d love to hear from you. Reach out to us for collaborations, feedback, or support.
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
