import React, { useState } from 'react'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

interface DialogBoxParams {
    isPublished: boolean;
    status: string;
    sessionDetails: any[];   // 👈 added prop
    onPublish: () => void;
}

const PublishEventSwitch = (props: DialogBoxParams) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleSwitchChange = (checked: boolean) => {
        if (checked && !props.isPublished) {
            setShowDialog(true);
        }
    };

    const handleConfirmPublish = () => {
        props.onPublish();
        setShowDialog(false);
    };

    // Only show when status is 'Approved'
    if (props.status !== 'Approved') {
        return null;
    }

    const hasSessions = props.sessionDetails && props.sessionDetails.length > 0;

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                <label className="text-sm sm:text-base font-medium text-gray-700">Publish Event</label>
                <Switch
                    className="hover:cursor-pointer"
                    checked={props.isPublished}
                    onCheckedChange={handleSwitchChange}
                    disabled={props.isPublished}
                />
            </div>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {hasSessions ? "Publish Event?" : "Cannot Publish Event"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {hasSessions
                                ? "Are you sure you want to publish this event? Once published, the event will be visible to the public and you cannot unpublish it."
                                : "You need to create at least one session in order to publish an event."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {hasSessions ? (
                            <>
                                <AlertDialogCancel onClick={() => setShowDialog(false)}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirmPublish}>
                                    Publish Event
                                </AlertDialogAction>
                            </>
                        ) : (
                            <AlertDialogAction onClick={() => setShowDialog(false)}>
                                OK
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default PublishEventSwitch;
