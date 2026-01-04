'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { SlClose } from "react-icons/sl";

interface DisapproveAccountSwitchProps {
    status: 'pending' | 'approved' | 'disapproved' | string;
    onDisapprove: () => void;
    isLoading?: boolean;
    organizerName?: string; // optional for nicer copy
}

const DisapproveAccountSwitch: React.FC<DisapproveAccountSwitchProps> = ({
                                                                             status,
                                                                             onDisapprove,
                                                                             isLoading = false,
                                                                             organizerName,
                                                                         }) => {
    const [open, setOpen] = useState(false);

    const lockedByStatus = status !== 'pending'; // only allow when pending

    const title = lockedByStatus
        ? 'Cannot Disapprove Organizer'
        : 'Disapprove Organizer?';

    const description = lockedByStatus
        ? (
            status === 'approved'
                ? 'This organizer is already approved. You can only disapprove organizers who are pending approval.'
                : 'This organizer is already disapproved.'
        )
        : `Are you sure you want to disapprove ${organizerName ?? 'this organizer'}? They will not be able to proceed until the account is approved again.`;

    const handleConfirm = () => {
        onDisapprove();
        setOpen(false);
    };

    return (
        <>
            <Button
                className="hover:bg-gray-700 hover:cursor-pointer text-white border-gray-600"
                variant={'default'}
                disabled={isLoading}
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center justify-center">
                    <SlClose className="mr-2" />
                    {isLoading ? 'Disapproving...' : 'Disapprove Organizer'}
                </div>
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        {lockedByStatus ? (
                            <AlertDialogAction onClick={() => setOpen(false)}>OK</AlertDialogAction>
                        ) : (
                            <>
                                <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
                                    OK
                                </AlertDialogAction>
                            </>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DisapproveAccountSwitch;
