'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        try {
            setSubmitting(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot`, { email });
            toast.success('If that email exists, a reset link was sent.');
            setEmail('');
        } catch (err) {
            // We still show the same message to avoid email enumeration
            toast.success('If that email exists, a reset link was sent.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
                <h1 className="text-2xl font-semibold mb-2">Forgot Password</h1>
                <p className="text-sm text-gray-600 mb-6">
                    Enter the email you used to register. We’ll send a reset link if it exists.
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg px-4 py-2 bg-black text-white disabled:opacity-60 hover:cursor-pointer"
                    >
                        {submitting ? 'Sending…' : 'Send reset link'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <Link href="/admin/auth/login" className="underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
