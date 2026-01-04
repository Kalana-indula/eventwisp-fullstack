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

interface DialogBoxParams {
    status: string;                // current event status text (e.g., "Approved", "On Going", "Completed", etc.)
    isDisapproved: boolean;        // whether already disapproved
    isStarted?: boolean;           // optional: if you want to additionally gate the button
    onDisapprove: () => void;      // callback to perform the disapprove action
}

const DisapproveEventDialog = (props: DialogBoxParams) => {
    const [open, setOpen] = useState(false);

    // Can't disapprove if already disapproved or the event is running/completed
    const lockedByStatus = props.status === 'On Going' || props.status === 'Completed';
    const buttonDisabled = props.isDisapproved || lockedByStatus || props.isStarted;

    const title = lockedByStatus
        ? 'Cannot Disapprove Event'
        : props.isDisapproved
            ? 'Already Disapproved'
            : 'Disapprove Event?';

    const description = lockedByStatus
        ? (props.status === 'On Going'
            ? 'This event has already started. You cannot disapprove an ongoing event.'
            : 'This event has been completed. You cannot disapprove a completed event.')
        : props.isDisapproved
            ? 'This event is already marked as Disapproved.'
            : 'Are you sure you want to disapprove this event? The organizer will be notified and the event will no longer be visible to the public.';

    const handleConfirm = () => {
        props.onDisapprove();
        setOpen(false);
    };

    return (
        <>
            <Button
                className={`rounded-lg hover:cursor-pointer bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 active:bg-blue-600 active:text-white transition-colors duration-200 ${props.isStarted ? 'hidden' : 'block'}`}
                variant="default"
                disabled={buttonDisabled}
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-2">
                    <SlClose /> Disapprove Event
                </div>
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        {/* When it's blocked/readonly states, show only OK */}
                        {lockedByStatus || props.isDisapproved ? (
                            <AlertDialogAction onClick={() => setOpen(false)}>OK</AlertDialogAction>
                        ) : (
                            <>
                                <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirm}>OK</AlertDialogAction>
                            </>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DisapproveEventDialog;
