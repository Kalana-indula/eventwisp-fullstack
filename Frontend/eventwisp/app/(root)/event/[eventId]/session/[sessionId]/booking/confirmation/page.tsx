'use client';

import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import MainFooter from '@/app/(root)/app-components/MainFooter';
import Link from 'next/link';
import {CheckCircle} from 'lucide-react';
import QRCode from 'react-qr-code';
import {jsPDF} from 'jspdf';
import {qrWrapperToPngDataUrl} from "@/lib/qr-utils";
import {sendConfirmationEmail} from "@/lib/email-utils";
import toast from "react-hot-toast";

const Page = () => {
    const searchParams = useSearchParams();

    // booking email
    const [bookingEmail, setBookingEmail] = useState<string>("");

    // holds a generated QR PNG data URL (base64) for reuse (PDF, email, etc.)
    const [qrPngDataUrl, setQrPngDataUrl] = useState<string | null>(null);

    // parse the whole response you passed as "?savedBookingDetails=..."
    const {bookingDetails} = React.useMemo(() => {
        try {
            const raw = searchParams.get('savedBookingDetails');
            const parsed = raw ? JSON.parse(raw) : {};
            // we only need bookingDetails from the response object
            return {bookingDetails: parsed?.bookingDetails ?? null};
        } catch {
            return {bookingDetails: null};
        }
    }, [searchParams]);

//derive a safe booking id (url param OR payload fallback)
    const bookingIdFromUrl = searchParams.get('bookingId');

    const effectiveBookingId = React.useMemo(
        () => bookingIdFromUrl ?? bookingDetails?.bookingId ?? null,
        [bookingIdFromUrl, bookingDetails]
    );

    // set email when details arrive (and guard logs)
    useEffect(() => {
        if (bookingDetails?.email) setBookingEmail(bookingDetails.email);
        console.log('bookingDetails.email:', bookingDetails?.email);
        console.log('bookingId (url):', bookingIdFromUrl);
        console.log('bookingId (effective):', effectiveBookingId);
    }, [bookingDetails, bookingIdFromUrl, effectiveBookingId]);


    // ref to QR wrapper
    const qrRef = React.useRef<HTMLDivElement | null>(null);

    // QR should include ONLY the bookingDetails object, exactly as specified
    const qrValue = React.useMemo(() => {
        return bookingDetails ? JSON.stringify(bookingDetails) : '';
    }, [bookingDetails]);

    /**
     * --------------------------
     * 1) Generate the QR (PNG)
     * --------------------------
     * Reads the already-rendered <svg> inside qrRef and converts it to a PNG dataURL.
     * Saves result in state (qrPngDataUrl) for reuse.
     */
        //  generate QR ONLY (no email send here)
    const generateQrCode = async (): Promise<string | null> => {
            if (!qrRef.current) return null;
            await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
            const pngDataUrl = await qrWrapperToPngDataUrl(qrRef.current, 3);
            if (pngDataUrl) setQrPngDataUrl(pngDataUrl);
            return pngDataUrl ?? null;
    };

    // auto-generate qr image whenever the QR payload changes
    useEffect(() => {
        if (qrValue) {
            generateQrCode(); // fire-and-forget; just generates/stores the PNG
        } else {
            setQrPngDataUrl(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qrValue]);

    // send the email ONCE when everything is ready
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        // need all three
        if (!qrPngDataUrl || !bookingEmail || !effectiveBookingId) return;
        if (emailSent) return; // avoid duplicates on re-renders

        (async () => {
            try {
                await sendConfirmationEmail(bookingEmail, effectiveBookingId, qrPngDataUrl);
                setEmailSent(true);
                toast.success('Confirmation email sent!');
                console.log('email sent');
            } catch (err) {
                console.error(' Failed to send confirmation email', err);
                toast.error('Failed to send confirmation email.');
            }
        })();
    }, [qrPngDataUrl, bookingEmail, effectiveBookingId, emailSent]);
    /**
     * ----------------------------------
     * 2) Download the generated QR (PDF)
     * ----------------------------------
     * Uses qrPngDataUrl (generates it first if missing) and saves a PDF.
     */
    const downloadQrCode = async () => {
        try {
            // ensure we have a PNG first
            const png = qrPngDataUrl ?? (await generateQrCode());
            if (!png) return;

            // Build the PDF
            const pdf = new jsPDF({orientation: 'portrait', unit: 'pt', format: 'a4'});
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 40;

            const maxSize = Math.min(pageW - margin * 2, pageH - margin * 2);
            const x = (pageW - maxSize) / 2;
            const y = (pageH - maxSize) / 2;

            pdf.addImage(png, 'PNG', x, y, maxSize, maxSize);
            pdf.save(`booking-${effectiveBookingId ?? 'qr'}.pdf`);
        } catch (e) {
            console.error('Failed to download QR PDF:', e);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 border-b border-gray-200/30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-4">
                        <div className="relative inline-block">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Booking Confirmed
                </span>
                            </h1>
                            <div
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full"
                                style={{backgroundColor: '#193cb8'}}
                            />
                        </div>
                        <div className="mt-3 text-sm sm:text-base text-gray-600 font-light max-w-xl mx-auto">
                            <p>Thank you for your booking! Your tickets are confirmed.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center"
                                    style={{backgroundColor: '#193cb8'}}
                                >
                                    <CheckCircle className="w-16 h-16 text-white" strokeWidth={1.5}/>
                                </div>
                                <div className="absolute inset-0 rounded-full opacity-20"
                                     style={{backgroundColor: '#193cb8'}}/>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
                            <p className="text-gray-600 text-lg">Your tickets have been confirmed and are ready to
                                use.</p>
                        </div>

                        {/* Booking ID */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-6 rounded-full" style={{backgroundColor: '#193cb8'}}/>
                                <h3 className="text-lg font-bold text-gray-900">Your Booking ID</h3>
                            </div>
                            <div className="bg-white rounded-lg p-4 border-2" style={{borderColor: '#193cb8'}}>
                                <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                                <p className="text-3xl font-bold text-gray-900 font-mono">{effectiveBookingId ?? '—'}</p>
                                <p className="text-xs text-gray-500 mt-2">Keep this ID for your records and check-in</p>
                            </div>
                        </div>

                        {/* Booking QR (ONLY bookingDetails in payload) */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-6 rounded-full" style={{backgroundColor: '#193cb8'}}/>
                                <h3 className="text-lg font-bold text-gray-900">Booking QR</h3>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 text-center">
                                    You may scan below QR at the ticket counter to get tickets
                                </p>
                            </div>
                            <div
                                ref={qrRef}
                                className="bg-white rounded-lg p-4 border-2 flex flex-col items-center gap-3"
                                style={{borderColor: '#193cb8'}}
                            >
                                {qrValue ? (
                                    <QRCode
                                        value={qrValue}
                                        size={220}
                                        level="M" // L, M, Q, H
                                        style={{height: 'auto', maxWidth: '100%', width: '100%'}}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-500">QR not available</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    {qrPngDataUrl ? 'QR is generated and ready to download' : 'Download or get a screenshot of this QR'}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/"
                                className="flex-1 py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-center"
                                style={{backgroundColor: '#193cb8'}}
                            >
                                <div className="flex items-center justify-center gap-2">Browse More Events</div>
                            </Link>

                            <button
                                onClick={downloadQrCode}
                                className="flex-1 py-4 px-6 rounded-2xl border-2 font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                                style={{borderColor: '#193cb8', color: '#193cb8', backgroundColor: 'transparent'}}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#193cb8';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#193cb8';
                                }}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {qrPngDataUrl ? 'Download QR Code' : 'Generate & Download QR Code'}
                                </div>
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-500">🔒 Your booking information is secure and encrypted</p>
                        </div>
                    </div>
                </div>
            </div>

            <footer>
                <MainFooter/>
            </footer>
        </div>
    );
};

export default Page;
