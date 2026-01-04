'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
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
import { Trash2 } from 'lucide-react';

interface DeleteOrganizerDialogProps {
    organizerId: number;
    onSuccess: () => void;          // call routeToOrganizersList()
    className?: string;
}

const DeleteOrganizerDialog: React.FC<DeleteOrganizerDialogProps> = ({
                                                                         organizerId,
                                                                         onSuccess,
                                                                         className
                                                                     }) => {
    const [open, setOpen] = useState(false);
    const [serverMessage, setServerMessage] = useState<string>('');
    const [wasDeleted, setWasDeleted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDelete = async () => {
        // Call your new API and then show the dialog with backend message
        setIsLoading(true);
        try {
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/managers/actions/organizers/${organizerId}/delete`
            );

            // Expected shape: { message: string, entityData: boolean }
            const message: string = res.data?.message ?? 'Request processed';
            const ok: boolean = !!res.data?.entityData;

            setServerMessage(message);
            setWasDeleted(ok);
            setOpen(true);
        } catch (err) {
            let message = 'Failed to delete organizer';
            if (err && (err as AxiosError).response?.data) {
                const data = (err as AxiosError).response?.data as any;
                message = data?.message || message;
            }
            setServerMessage(message);
            setWasDeleted(false);
            setOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOk = () => {
        setOpen(false);
        if (wasDeleted) {
            onSuccess(); // route to organizers list
        }
    };

    return (
        <>
            <Button
                onClick={handleDelete}
                disabled={isLoading}
                className={`flex items-center justify-center bg-blue-600 border border-blue-600 text-white rounded-lg shadow-sm font-medium py-2 sm:py-3 px-4 text-sm hover:bg-blue-700 active:bg-blue-600 active:text-white transition-colors duration-200 hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className ?? ''}`}
            >
                <Trash2 strokeWidth={1.5} className="mr-2" />
                {isLoading ? 'Deleting...' : 'Delete Organizer'}
            </Button>


            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Organizer</AlertDialogTitle>
                        <AlertDialogDescription>
                            {serverMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleOk}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DeleteOrganizerDialog;
