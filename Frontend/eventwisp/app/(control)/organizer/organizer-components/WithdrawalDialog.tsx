import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WithdrawalDialogProps {
    currentBalance: number;
    onWithdraw: () => void;
    getValueString: (value: number) => string;
}

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({
                                                               currentBalance,
                                                               onWithdraw,
                                                               getValueString
                                                           }) => {
    const [open, setOpen] = React.useState(false);

    const handleConfirmWithdraw = () => {
        onWithdraw();
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full sm:w-auto flex justify-center py-3 px-4 bg-blue-600 rounded-lg shadow-sm text-sm sm:text-base font-medium text-white hover:bg-blue-700 active:bg-blue-600 active:text-white hover:cursor-pointer"
                >
                    Withdraw
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Confirm Withdrawal</DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                        Are you sure you want to withdraw cash?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm text-gray-600">Withdrawal Amount:</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {getValueString(currentBalance)} LKR
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        This will transfer your entire current balance to your registered bank account.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmWithdraw}
                        className="bg-blue-600 hover:bg-blue-700 px-6"
                        disabled={currentBalance <= 0}
                    >
                        OK - Withdraw
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawalDialog;