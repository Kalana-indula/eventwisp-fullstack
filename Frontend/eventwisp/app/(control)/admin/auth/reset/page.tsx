'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [checking, setChecking] = useState(true);
    const [valid, setValid] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const API = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Step 1: validate token as soon as page loads
    useEffect(() => {
        const check = async () => {
            if (!token) {
                setChecking(false);
                setValid(false);
                return;
            }
            try {
                const { data } = await axios.post(`${API}/auth/reset/validate`, { token });
                setValid(Boolean(data?.valid));
            } catch {
                setValid(false);
            } finally {
                setChecking(false);
            }
        };
        check();
    }, [API, token]);

    // Step 2: submit new password
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || !confirm) {
            toast.error('Please fill both fields');
            return;
        }
        if (newPassword !== confirm) {
            toast.error('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('Use at least 8 characters');
            return;
        }

        try {
            setSubmitting(true);
            await axios.post(`${API}/auth/reset/confirm`, { token, newPassword });
            toast.success('Password updated. Please log in.');
            router.replace('/admin/auth/login');
        } catch (err: any) {
            toast.error('Invalid or expired token');
        } finally {
            setSubmitting(false);
        }
    };

    // UI states
    if (checking) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-gray-600">Checking your reset link…</p>
            </div>
        );
    }

    if (!valid) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center p-4">
                <div className="max-w-md text-center">
                    <h1 className="text-2xl font-semibold mb-2">Reset link is invalid or expired</h1>
                    <p className="text-gray-600 mb-6">Please request a new one.</p>
                    <Link className="underline" href="/admin/auth/forgot">Go to Forgot Password</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
                <h1 className="text-2xl font-semibold mb-2">Set a new password</h1>
                <p className="text-sm text-gray-600 mb-6">Choose a strong password you don’t use elsewhere.</p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">New password</label>
                        <input
                            type="password"
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Confirm password</label>
                        <input
                            type="password"
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Re-enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg px-4 py-2 bg-black text-white disabled:opacity-60"
                    >
                        {submitting ? 'Saving…' : 'Reset password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
