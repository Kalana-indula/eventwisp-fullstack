'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useZxing } from 'react-zxing';

const Page = () => {
    const router = useRouter();
    const [scanError, setScanError] = useState('');
    const navigatingRef = useRef(false);

    const isValidBooking = useCallback((obj: any) => {
        return (
            obj && typeof obj === 'object' &&
            typeof obj.bookingId === 'string' &&
            typeof obj.eventName === 'string' &&
            typeof obj.name === 'string' &&
            typeof obj.email === 'string' &&
            typeof obj.phone === 'string' &&
            typeof obj.nic === 'string' &&
            Array.isArray(obj.ticketDetails) &&
            obj.ticketDetails.every((t: any) =>
                t && typeof t.ticketType === 'string' && Number.isFinite(t.ticketCount)
            )
        );
    }, []);

    const handleScan = useCallback((text: string) => {
        if (!text || navigatingRef.current) return;
        try {
            const parsed = JSON.parse(text);
            if (!isValidBooking(parsed)) {
                setScanError('Invalid QR content. Please scan a valid EventWisp booking QR.');
                return;
            }
            navigatingRef.current = true;
            const qs = new URLSearchParams({ bookingId: parsed.bookingId }).toString();
            router.replace(`/event/ticketing?${qs}`);
        } catch {
            setScanError('Could not read QR. Make sure it contains valid booking JSON.');
        }
    }, [isValidBooking, router]);

    const { ref } = useZxing({
        onDecodeResult: (result) => handleScan(result.getText()),
        onError: (err) => {
            const msg = String(err?.message || '');
            if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('not allowed')) {
                setScanError('Camera permission denied. Please allow camera access in your browser.');
            }
            // Frequent decode errors while scanning are normal; don’t spam UI.
        },
        constraints: {
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 },
            },
        },
    });

    const videoStyle = useMemo<React.CSSProperties>(() => ({
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '1rem',
    }), []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center px-4 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Scan Booking QR</h1>

            <div className="w-full max-w-md">
                <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                    <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black/5">
                        <video ref={ref} style={videoStyle} />
                    </div>
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-6 rounded-2xl border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
                    </div>
                </div>

                <p className="text-sm text-gray-600 mt-3">
                    Tip: Hold your phone ~15–25cm from the code and ensure good lighting.
                </p>

                {scanError && <div className="mt-3 text-sm text-red-600">{scanError}</div>}
            </div>
        </div>
    );
};

export default Page;
