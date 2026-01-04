// send confirmation email after booking

'use client';

import axios from "axios";

/**
 * Send booking confirmation email
 * @param to - Recipient email address
 * @param bookingId - Booking ID (e.g. BK20251016-003)
 * @param qrPngDataUrl - Base64 PNG data URL of the QR code
 */
export const sendConfirmationEmail = async (
    to: string,
    bookingId: string,
    qrPngDataUrl: string
) => {
    try {
        // Extract only the base64 part (strip "data:image/png;base64,")
        const base64 = qrPngDataUrl.split(",")[1];

        // Use the correct API base URL from your .env
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

        // POST request using Axios
        const response = await axios.post(
            `${apiBase}/emails/booking-confirmation`,
            {
                to,
                bookingId,
                qrPngBase64: base64,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Email sent successfully:", response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Failed to send email:", error.response?.data || error.message);
            throw new Error(
                error.response?.data?.message || "Failed to send confirmation email"
            );
        } else {
            console.error("Unknown error:", error);
            throw error;
        }
    }
};

