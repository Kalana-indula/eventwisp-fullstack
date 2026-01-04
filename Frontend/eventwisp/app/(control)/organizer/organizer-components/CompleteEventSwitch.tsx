'use client';

import React, { useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

interface CompleteEventSwitchProps {
    isCompleted: boolean;
    status: string;
    onComplete: () => void;
}

const CompleteEventSwitch = ({ isCompleted, status, onComplete }: CompleteEventSwitchProps) => {
    const [showDialog, setShowDialog] = useState(false);

    // Only render when status is NOT Pending / Approved
    if (status === 'Pending Approval' || status === 'Approved') return null;

    const handleSwitchChange = (checked: boolean) => {
        if (checked && !isCompleted) setShowDialog(true);
    };

    const handleConfirm = () => {
        onComplete();
        setShowDialog(false);
    };

    return (
        <>
            {/* Same visual wrapper as PublishEventSwitch */}
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                <label className="text-sm sm:text-base font-medium text-gray-700">Mark Event as Completed</label>
                <Switch
                    className="hover:cursor-pointer"
                    checked={isCompleted}
                    onCheckedChange={handleSwitchChange}
                    disabled={isCompleted}
                />
            </div>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mark Event as Completed?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Once marked completed, the event cannot be re-opened. Are you sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDialog(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            Complete Event
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CompleteEventSwitch;