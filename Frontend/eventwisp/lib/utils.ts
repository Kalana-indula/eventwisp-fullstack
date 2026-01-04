import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

//handle exceptions
// utils/errorHandler.ts
import axios from "axios";
import {toast} from "react-hot-toast";
import React from "react";

export function handleApiError(err: unknown, fallbackMessage = "Something went wrong") {
    if (axios.isAxiosError(err)) {
        toast.error(
            err.response?.data?.message ||
            err.response?.statusText ||
            fallbackMessage
        );
    } else if (err instanceof Error) {
        toast.error(err.message);
    } else {
        toast.error(fallbackMessage);
    }
}

//format time into readable time
export const formatTime = (timeString: string|undefined): string => {
    if (!timeString) return "";

    // Parse the time string (assuming format: HH:MM:SS or HH:MM)
    const [hours, minutes] = timeString.split(':').map(Number);

    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    // Format minutes with leading zero if needed
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${displayHours}:${displayMinutes} ${period}`;
}


//format date into readable day
export const formatDate = (dateString: string|undefined): string => {
    if (!dateString) return "";

    // Create a Date object from the ISO date string
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) return dateString;

    // Format the date as "DD, Month YYYY"
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', {month: 'long'});
    const year = date.getFullYear();

    return `${day}, ${month} ${year}`;
}


//convert value to meaningful financial values
export const getValueString = (value?: number | null): string => {
    if (typeof value !== "number") return "0.00";
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

//==============turn rendered QR into a PNG data URL==============================


