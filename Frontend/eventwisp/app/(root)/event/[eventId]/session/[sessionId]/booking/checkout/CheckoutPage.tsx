'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {useParams, useRouter, useSearchParams} from 'next/navigation'
import {BookedTicketDetails, BookingDto} from '@/types/entityTypes'
import {getValueString} from '@/lib/utils'
import axios, {AxiosError} from 'axios'
import toast from 'react-hot-toast'
import MainFooter from '@/app/(root)/app-components/MainFooter'
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js'

const CheckoutPage = () => {
    // Stripe hooks
    const stripe = useStripe()
    const elements = useElements()

    // params & state from previous page
    const searchParams = useSearchParams()
    const [tickets] = useState<number[]>(() => JSON.parse(searchParams.get('tickets') || '[]'))
    const [bookedTicketDetails] = useState<any>(() => JSON.parse(searchParams.get('bookedTickets') || '{}'))

    // UI state
    const [selectedTicketDetails, setSelectedTicketDetails] = useState<BookedTicketDetails[]>([])
    const [totalTicketPrice, setTotalTicketPrice] = useState<number>(0)

    // form data
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [nic, setNic] = useState<string>('')
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [processing, setProcessing] = useState(false)

    const params = useParams()
    const sessionId = Number(params.sessionId)
    const eventId = params.eventId as string
    const router = useRouter()

    useEffect(() => {
        setSelectedTicketDetails(bookedTicketDetails?.ticketDetails ?? [])
        setTotalTicketPrice(bookedTicketDetails?.totalPrice ?? 0)
    }, [])

    const routeToConfirmation = (query: string) => {
        router.push(`/event/${eventId}/session/${sessionId}/booking/confirmation?${query}`)
    }

    // if you later need minor units
    const amountInCents = useMemo(
        () => Math.max(1, Math.round(Number(totalTicketPrice) * 100)),
        [totalTicketPrice]
    )

    // MAIN submit
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        if (!stripe || !elements) {
            toast.error('Payment system is not ready yet. Please try again.')
            return
        }
        if (!acceptedTerms) {
            toast.error('Please accept the terms first.')
            return
        }

        try {
            setProcessing(true)

            // Create PaymentIntent on backend
            const piRes = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-intent`,
                {sessionId, ticketIdList: tickets, email},
                {headers: {'Content-Type': 'application/json'}}
            )

            const {clientSecret} = piRes.data
            if (!clientSecret) throw new Error('Failed to initialize payment (no clientSecret).')

            // Confirm the payment using the mounted CardElement
            const card = elements.getElement(CardElement)
            if (!card) throw new Error('Card element not found.')

            const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {card},
                receipt_email: email, // optional in test mode
            })

            if (error) {
                toast.error(error.message || 'Payment failed')
                return
            }
            if (!paymentIntent || paymentIntent.status !== 'succeeded') {
                toast.error(`Payment status: ${paymentIntent?.status ?? 'unknown'}`)
                return
            }

            // 3) Payment OK -> Create the booking (server re-verifies PI)
            const bookingPayload: BookingDto & { paymentIntentId: string } = {
                paymentIntentId: paymentIntent.id,
                firstName,
                lastName,
                email,
                phone: phoneNumber,
                idNumber: nic,
                sessionId,
                ticketIdList: tickets,
            } as any

            const bookingRes = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`,
                bookingPayload,
                {headers: {Accept: 'application/json', 'Content-Type': 'application/json'}}
            )

            toast.success(bookingRes.data.message || 'Booking successful')

            //  Clear and route to confirmation
            setFirstName('')
            setLastName('')
            setEmail('')
            setPhoneNumber('')
            setNic('')

            const query = new URLSearchParams({
                bookingId: JSON.stringify(bookingRes.data.bookingDetails.bookingId),
                savedBookingDetails: JSON.stringify(bookingRes.data),
            }).toString()

            routeToConfirmation(query)
        } catch (err) {
            const msg =
                err instanceof AxiosError
                    ? err.response?.data?.message || err.message
                    : err instanceof Error
                        ? err.message
                        : 'Unknown error'
            toast.error(msg)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* header (your existing header if any) */}

            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Billing form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-1 h-6 rounded-full" style={{backgroundColor: '#193cb8'}}></div>
                                Billing Information
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* First + Last */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Enter your first name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Enter your last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                        required
                                    />
                                </div>

                                {/* Phone + NIC */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">National ID (NIC)</label>
                                        <input
                                            type="text"
                                            name="nic"
                                            placeholder="Enter your NIC number"
                                            value={nic}
                                            onChange={(e) => setNic(e.target.value)}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:border-gray-300 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Card Details */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Card Details</label>
                                    <div
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 transition-all">
                                        <CardElement
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#1f2937',
                                                        '::placeholder': {color: '#9ca3af'},
                                                    },
                                                    invalid: {color: '#ef4444'},
                                                },
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Test card: 4242 4242 4242 4242 (any future expiry & CVC).
                                    </p>
                                </div>

                                {/* Terms (keep here OR on the right; this ties the button disable directly) */}
                                <div className="mb-2">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                                            className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-600">
                                            I accept and agree to the{' '}
                                            <span className="font-semibold underline" style={{color: '#193cb8'}}>
                                                terms and conditions
                                            </span>{' '}
                                            and{' '}
                                            <span className="font-semibold underline" style={{color: '#193cb8'}}>
                                                 privacy policy
                                            </span>
                                        </span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={!acceptedTerms || processing || !stripe || !elements}
                                    className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 hover:cursor-pointer"
                                    style={{backgroundColor: '#193cb8'}}
                                >
                                    {processing ? 'Processing…' : 'Proceed to Payment'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Order summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-1 h-6 rounded-full" style={{backgroundColor: '#193cb8'}}></div>
                                Order Summary
                            </h2>

                            {/* Ticket Items */}
                            <div className="space-y-4 mb-6">
                                {selectedTicketDetails.map((ticket) => (
                                    <div key={ticket.ticketId} className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-3 h-3 rounded-full"
                                                         style={{backgroundColor: '#193cb8'}}></div>
                                                    <span
                                                        className="font-semibold text-gray-900">{ticket.ticketType} Tickets</span>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {ticket.count} × LKR {getValueString(ticket.price)}
                                                </span>
                                            </div>
                                            <span className="font-bold text-gray-900">
                                                LKR {getValueString(ticket.count * ticket.price)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="border-t-2 pt-4 mb-6" style={{borderColor: '#193cb8'}}>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                                    <span className="text-2xl font-bold" style={{color: '#193cb8'}}>
                                        LKR {getValueString(totalTicketPrice)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment badges */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Accepted Payment Methods</h3>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">VISA
                                    </div>
                                    <div
                                        className="flex items-center bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                                        <div className="flex">
                                            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                                            <div className="w-6 h-6 bg-yellow-400 rounded-full -ml-2"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">Secure</div>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">🔒 Your payment information is encrypted and
                                    secure</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer>
                <MainFooter/>
            </footer>
        </div>
    )
}

export default CheckoutPage
