'use client';

import { useState } from 'react';
import { X, Clock, Loader2, Users } from 'lucide-react';
import { createBookingAction } from '../actions/createBooking';
import type { Room } from '@/modules/shared/types/database.types';

interface CheckoutDrawerProps {
    room: Room;
    isOpen: boolean;
    onClose: () => void;
}

export function CheckoutDrawer({ room, isOpen, onClose }: CheckoutDrawerProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guestsCount, setGuestsCount] = useState<number>(1);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [bookingRef, setBookingRef] = useState('');

    if (!isOpen) return null;

    // Calculate dynamic nights & total
    const nights = checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
        ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const estimatedTotal = nights * room.price_per_night;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const res = await createBookingAction({
            roomId: room.id,
            guestName,
            guestEmail,
            guestPhone,
            checkIn,
            checkOut,
            guestsCount,
            pricePerNight: room.price_per_night,
        });

        setLoading(false);

        if (res.success && res.bookingId) {
            setBookingRef(res.bookingId.slice(0, 8).toUpperCase());
            setStep('success');
        } else {
            setErrorMsg(res.message || 'Could not submit reservation request.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1c120c]/70 backdrop-blur-xs flex justify-end flex-col sm:items-center sm:justify-center p-0 sm:p-4">
            <div className="bg-[#faf7f2] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#e6c898]/40 animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto pb-[calc(2rem+env(safe-area-inset-bottom))]">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Direct Reservation</span>
                        <h3 className="text-lg font-bold text-[#1c120c]">{room.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#e6c898]/30 text-[#1c120c]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {step === 'form' ? (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {errorMsg && (
                            <div className="p-3 bg-red-100 border border-red-200 text-red-800 text-xs rounded-xl">
                                {errorMsg}
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Check-In</label>
                                <input
                                    type="date"
                                    required
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                                />
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Check-Out</label>
                                <input
                                    type="date"
                                    required
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                                />
                            </div>
                        </div>

                        {/* Guest Count Selection */}
                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Number of Guests</label>
                            <select
                                value={guestsCount}
                                onChange={(e) => setGuestsCount(Number(e.target.value))}
                                className="w-full text-xs font-semibold text-[#1c120c] outline-none bg-transparent cursor-pointer"
                            >
                                {Array.from({ length: room.max_guests || 4 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? 'Guest' : 'Guests'} (Max {room.max_guests})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Guest Details */}
                        <div className="space-y-3">
                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Juan Dela Cruz"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                                />
                            </div>

                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="juan@example.com"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                                />
                            </div>

                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Mobile Phone</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+63 912 345 6789"
                                    value={guestPhone}
                                    onChange={(e) => setGuestPhone(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                                />
                            </div>
                        </div>

                        {/* Price Summary */}
                        {nights > 0 && (
                            <div className="bg-[#1c120c] text-[#faf7f2] p-4 rounded-2xl flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-[#e6c898]">{nights} Night(s) • {guestsCount} Guest(s)</span>
                                    <p className="text-xs text-[#faf7f2]/70">${room.price_per_night} x {nights} nights</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold text-[#c89349]">Total Price</span>
                                    <p className="text-xl font-extrabold text-[#faf7f2]">${estimatedTotal}</p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || nights <= 0}
                            className="w-full h-14 bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#b07d37] disabled:opacity-50 transition"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Booking Request'}
                        </button>
                    </form>
                ) : (
                    /* Awaiting Approval Screen */
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Request Submitted</span>
                            <h2 className="text-2xl font-bold text-[#1c120c]">Awaiting Approval</h2>
                            <p className="text-xs text-[#2b1d14]/70 mt-1 max-w-xs mx-auto leading-relaxed">
                                Your reservation request has been sent to our desk. You will receive an email at <strong className="text-[#1c120c]">{guestEmail}</strong> once our staff confirms your stay.
                            </p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-[#e6c898]/40 text-left space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#2b1d14]/60">Request Ref:</span>
                                <span className="font-mono font-bold text-[#1c120c]">#{bookingRef}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#2b1d14]/60">Status:</span>
                                <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px]">Pending Staff Review</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#2b1d14]/60">Villa:</span>
                                <span className="font-bold text-[#1c120c]">{room.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#2b1d14]/60">Guests:</span>
                                <span className="font-bold text-[#1c120c]">{guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#2b1d14]/60">Dates:</span>
                                <span className="font-bold text-[#1c120c]">{checkIn} to {checkOut}</span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full h-12 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}