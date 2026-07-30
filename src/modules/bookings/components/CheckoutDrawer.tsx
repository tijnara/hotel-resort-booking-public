'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Calendar as CalendarIcon, Users, CheckCircle2, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { createBookingAction } from '@/modules/bookings/actions/createBooking';
import { getBookedDatesForRoomAction, BookedDateRange } from '@/modules/bookings/actions/getRoomBookings';
import { getOccupiedDatesSet, isRangeOverlapping } from '@/modules/shared/lib/dateUtils';
import type { Room } from '@/modules/shared/types/database.types';

type ExtendedRoom = Room & {
    capacity?: number;
    max_guests?: number;
};

interface CheckoutDrawerProps {
    room: Room | null;
    isOpen: boolean;
    onClose: () => void;
    initialCheckIn?: string;
    initialCheckOut?: string;
}

export function CheckoutDrawer({
                                   room,
                                   isOpen,
                                   onClose,
                                   initialCheckIn = '',
                                   initialCheckOut = '',
                               }: CheckoutDrawerProps) {
    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestsCount, setGuestsCount] = useState(1);

    const [bookedRanges, setBookedRanges] = useState<BookedDateRange[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const calendarRef = useRef<HTMLDivElement>(null);

    // Track previous open and room state to sync states without synchronous effect calls
    const [prevSync, setPrevSync] = useState({ isOpen: false, roomId: '' });

    if (isOpen && room && (isOpen !== prevSync.isOpen || room.id !== prevSync.roomId)) {
        setPrevSync({ isOpen, roomId: room.id });
        setCheckIn(initialCheckIn);
        setCheckOut(initialCheckOut);
        setErrorMessage(null);
        setIsSuccess(false);
        setLoadingBookings(true);
    } else if (!isOpen && prevSync.isOpen) {
        setPrevSync({ isOpen: false, roomId: prevSync.roomId });
    }

    // Fetch room-specific booked dates on drawer open asynchronously
    useEffect(() => {
        let isMounted = true;

        if (isOpen && room?.id) {
            getBookedDatesForRoomAction(room.id).then((res) => {
                if (isMounted) {
                    if (res.success) {
                        setBookedRanges(res.bookedRanges);
                    }
                    setLoadingBookings(false);
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, [isOpen, room?.id]);

    // Close calendar dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setIsCalendarOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen || !room) return null;

    const extendedRoom = room as ExtendedRoom;
    const roomCapacity = extendedRoom.capacity ?? extendedRoom.max_guests ?? 2;

    const occupiedSet = getOccupiedDatesSet(bookedRanges);

    // Calculate nights and total price
    const calcNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        return diff > 0 ? Math.ceil(diff) : 0;
    };

    const nights = calcNights();
    const totalPrice = nights * (room.price_per_night || 0);

    // Handle custom date clicks in calendar dropdown
    const handleDateClick = (dateStr: string) => {
        setErrorMessage(null);

        if (occupiedSet.has(dateStr)) {
            setErrorMessage('This date is already booked.');
            return;
        }

        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(dateStr);
            setCheckOut('');
        } else if (checkIn && !checkOut) {
            if (new Date(dateStr) <= new Date(checkIn)) {
                setCheckIn(dateStr);
                setCheckOut('');
            } else {
                if (isRangeOverlapping(checkIn, dateStr, occupiedSet)) {
                    setErrorMessage('Selected range includes dates that are already booked.');
                    return;
                }
                setCheckOut(dateStr);
                setIsCalendarOpen(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!checkIn || !checkOut || nights <= 0) {
            setErrorMessage('Please select valid check-in and check-out dates.');
            return;
        }

        if (isRangeOverlapping(checkIn, checkOut, occupiedSet)) {
            setErrorMessage('Your selected dates overlap with an existing reservation.');
            return;
        }

        setIsSubmitting(true);

        const res = await createBookingAction({
            roomId: room.id,
            guestName,
            guestEmail,
            guestPhone,
            checkIn,
            checkOut,
            guestsCount,
            totalPrice,
        });

        setIsSubmitting(false);

        if (res.success) {
            setIsSuccess(true);
        } else {
            setErrorMessage(res.message || 'Failed to complete booking.');
        }
    };

    // Calendar view variables
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-lg bg-[#faf7f2] h-full shadow-2xl flex flex-col justify-between overflow-y-auto relative animate-in slide-in-from-right duration-300">
                {/* Drawer Header */}
                <div className="p-6 bg-[#1c120c] text-[#faf7f2] flex items-center justify-between sticky top-0 z-20 border-b border-[#2b1d14]">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Reserve Villa</span>
                        <h2 className="text-xl font-light tracking-tight">{room.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#faf7f2]/70 hover:text-[#c89349] transition rounded-full cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Success Confirmation View */}
                {isSuccess ? (
                    <div className="p-8 text-center my-auto space-y-6">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-[#1c120c]">Reservation Confirmed!</h3>
                            <p className="text-xs text-[#2b1d14]/70 max-w-xs mx-auto leading-relaxed">
                                Thank you, <span className="font-bold text-[#1c120c]">{guestName}</span>. Your stay at <span className="font-bold text-[#1c120c]">{room.name}</span> from {checkIn} to {checkOut} has been booked.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full h-12 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#2b1d14] transition cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    /* Booking Form */
                    <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
                        {/* Room Preview Card */}
                        <div className="flex gap-4 p-3 bg-white rounded-2xl border border-[#e6c898]/40 shadow-2xs items-center">
                            {room.images?.[0] && (
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                    <Image src={room.images[0]} alt={room.name} fill className="object-cover" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-sm font-bold text-[#1c120c]">{room.name}</h4>
                                <p className="text-xs text-[#c89349] font-bold mt-0.5">₱{room.price_per_night?.toLocaleString()} / night</p>
                                <p className="text-[10px] text-[#2b1d14]/60 mt-1 flex items-center gap-1">
                                    <Users className="w-3 h-3 text-[#c89349]" /> Max {roomCapacity} Guests
                                </p>
                            </div>
                        </div>

                        {/* Custom Interactive Room Date Picker */}
                        <div className="space-y-2 relative" ref={calendarRef}>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/70">
                                Select Stay Dates
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                className="w-full p-3 bg-white rounded-xl border border-[#e6c898]/50 flex items-center justify-between text-left text-xs font-bold text-[#1c120c] hover:border-[#c89349] transition cursor-pointer shadow-2xs"
                            >
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-[#c89349]" />
                                    <span>
                                        {checkIn && checkOut
                                            ? `${checkIn}  →  ${checkOut} (${nights} night${nights > 1 ? 's' : ''})`
                                            : checkIn
                                                ? `Check-In: ${checkIn} (Select Check-Out)`
                                                : 'Click to select Check-In & Check-Out dates'}
                                    </span>
                                </div>
                                {loadingBookings && <Loader2 className="w-4 h-4 animate-spin text-[#c89349]" />}
                            </button>

                            {/* Custom Popover Calendar Dropdown */}
                            {isCalendarOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white p-4 rounded-2xl border border-[#e6c898] shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#1c120c]">
                                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                                                className="p-1 rounded-lg hover:bg-[#faf7f2] text-[#1c120c]"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                                                className="p-1 rounded-lg hover:bg-[#faf7f2] text-[#1c120c]"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Calendar Day Labels */}
                                    <div className="grid grid-cols-7 text-center text-[9px] font-bold uppercase text-[#c89349]">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                                            <div key={d}>{d}</div>
                                        ))}
                                    </div>

                                    {/* Calendar Days */}
                                    <div className="grid grid-cols-7 gap-1 text-xs">
                                        {Array.from({ length: firstDay }).map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const dayNum = i + 1;
                                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                            const isOccupied = occupiedSet.has(dateStr);
                                            const isPast = dateStr < todayStr;
                                            const isSelected = dateStr === checkIn || dateStr === checkOut;
                                            const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

                                            return (
                                                <button
                                                    key={dateStr}
                                                    type="button"
                                                    disabled={isOccupied || isPast}
                                                    onClick={() => handleDateClick(dateStr)}
                                                    className={`h-8 rounded-lg font-bold flex items-center justify-center text-[11px] transition cursor-pointer relative ${
                                                        isSelected
                                                            ? 'bg-[#c89349] text-[#1c120c]'
                                                            : isInRange
                                                                ? 'bg-amber-100 text-[#1c120c]'
                                                                : isOccupied
                                                                    ? 'bg-[#1c120c]/15 text-[#1c120c]/30 line-through cursor-not-allowed border border-[#1c120c]/10'
                                                                    : isPast
                                                                        ? 'text-[#2b1d14]/20 cursor-not-allowed'
                                                                        : 'hover:bg-[#faf7f2] text-[#1c120c]'
                                                    }`}
                                                >
                                                    {dayNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Calendar Legend */}
                                    <div className="flex items-center justify-center gap-3 text-[9px] font-bold uppercase text-[#2b1d14]/60 pt-2 border-t border-[#e6c898]/30">
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-white border border-gray-400" /> Available
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-[#1c120c]/30 line-through" /> Booked
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-[#c89349]" /> Selected
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Guest Personal Information Inputs */}
                        <div className="space-y-3 pt-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/70">
                                Guest Information
                            </label>

                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                className="w-full p-3 bg-white rounded-xl border border-[#e6c898]/50 text-xs text-[#1c120c] font-medium outline-none focus:border-[#c89349]"
                            />

                            <input
                                type="email"
                                required
                                placeholder="Email Address"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                className="w-full p-3 bg-white rounded-xl border border-[#e6c898]/50 text-xs text-[#1c120c] font-medium outline-none focus:border-[#c89349]"
                            />

                            <input
                                type="tel"
                                required
                                placeholder="Phone Number"
                                value={guestPhone}
                                onChange={(e) => setGuestPhone(e.target.value)}
                                className="w-full p-3 bg-white rounded-xl border border-[#e6c898]/50 text-xs text-[#1c120c] font-medium outline-none focus:border-[#c89349]"
                            />

                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#e6c898]/50">
                                <span className="text-xs font-bold text-[#1c120c]">Number of Guests</span>
                                <select
                                    value={guestsCount}
                                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                                    className="bg-transparent text-xs font-bold text-[#c89349] outline-none cursor-pointer"
                                >
                                    {Array.from({ length: roomCapacity }).map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1} Guest{i > 0 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price Summary Breakdown */}
                        {nights > 0 && (
                            <div className="p-4 bg-amber-50 rounded-2xl border border-[#e6c898]/60 space-y-2">
                                <div className="flex justify-between text-xs text-[#2b1d14]/70">
                                    <span>₱{room.price_per_night?.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                                    <span>₱{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-[#1c120c] pt-2 border-t border-[#e6c898]/40">
                                    <span>Total Amount</span>
                                    <span className="text-[#c89349]">₱{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {errorMessage && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Submit Action Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || nights <= 0}
                            className="w-full h-12 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition shadow-lg disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin text-[#c89349]" />
                            ) : (
                                <span>Confirm & Reserve Villa</span>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}