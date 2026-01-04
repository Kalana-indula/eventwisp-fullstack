'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface OrganizerLoginButtonProps {
    email: string;
    password: string;
}

const OrganizerLoginButton: React.FC<OrganizerLoginButtonProps> = ({ email, password }) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [showPendingDialog, setShowPendingDialog] = useState(false);

    const handleLoginClick = async () => {
        // basic guard
        if (!email || !password) {
            toast.error('Please provide email and password');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/organizers/login`,
                { email, password },
                { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                const data = response.data;

                if (data.userRole !== 'ORGANIZER') {
                    toast.error('Not a valid user type');
                    return;
                }

                // Pending -> show dialog (instead of toast)
                if (data.isApproved !== true) {
                    setShowPendingDialog(true);
                    return;
                }

                // Approved organizer -> proceed
                localStorage.setItem('token', data.authToken);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('userRole', data.userRole);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.authToken}`;

                router.push(`/organizer/${Number(data.userId)}/dashboard`);
                toast.success('Login Successfully');
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
                toast.error(errorMessage);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                className="w-full py-8 px-6 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] hover:cursor-pointer"
                style={{ backgroundColor: '#193cb8' }}
                onClick={handleLoginClick}
                disabled={isLoading}
            >
                <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" strokeWidth={2} />
                    {isLoading ? 'Signing in…' : 'Sign In'}
                </div>
            </Button>

            {/* Pending approval dialog */}
            <AlertDialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Account Pending Approval</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your organizer account is pending approval. Once a manager approves it, you’ll be able to sign in.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowPendingDialog(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default OrganizerLoginButton;
