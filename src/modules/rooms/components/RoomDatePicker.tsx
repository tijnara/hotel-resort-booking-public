'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getBookedDatesForRoomAction, BookedDateRange } from '@/modules/bookings/actions/getRoomBookings';
import { getOccupiedDatesSet, isRangeOverlapping } from '@/modules/shared/lib/dateUtils';

interface RoomDatePickerProps {
    roomId: string;
    onSelectDates: (checkIn: string, checkOut: string) => void;
}

export function RoomDatePicker({ roomId, onSelectDates }: RoomDatePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedRanges, setBookedRanges] = useState<BookedDateRange[]>([]);
    const [loading, setLoading] = useState(true);

    const [checkIn, setCheckIn] = useState<string | null>(null);
    const [checkOut, setCheckOut] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Track previous roomId to adjust loading and selection state during render
    const [prevRoomId, setPrevRoomId] = useState(roomId);

    if (roomId !== prevRoomId) {
        setPrevRoomId(roomId);
        setLoading(true);
        setCheckIn(null);
        setCheckOut(null);
        setErrorMessage(null);
    }

    // Fetch booked dates whenever roomId changes
    useEffect(() => {
        let isMounted = true;

        getBookedDatesForRoomAction(roomId).then((res) => {
            if (isMounted) {
                if (res.success) {
                    setBookedRanges(res.bookedRanges);
                }
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [roomId]);

    const occupiedSet = getOccupiedDatesSet(bookedRanges);

    // Generate days for the current calendar view
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handleDateClick = (dateStr: string) => {
        setErrorMessage(null);

        // If date is occupied, block selection
        if (occupiedSet.has(dateStr)) {
            setErrorMessage('This date is already booked.');
            return;
        }

        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(dateStr);
            setCheckOut(null);
        } else if (checkIn && !checkOut) {
            if (new Date(dateStr) <= new Date(checkIn)) {
                setCheckIn(dateStr);
                setCheckOut(null);
            } else {
                // Check if selection spans across any booked dates
                if (isRangeOverlapping(checkIn, dateStr, occupiedSet)) {
                    setErrorMessage('Your selected range includes already booked dates.');
                    return;
                }
                setCheckOut(dateStr);
                onSelectDates(checkIn, dateStr);
            }
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-sm max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1c120c] flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#c89349]" />
                    <span>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                </h3>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                        className="p-1.5 rounded-xl hover:bg-[#faf7f2] text-[#1c120c] transition cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                        className="p-1.5 rounded-xl hover:bg-[#faf7f2] text-[#1c120c] transition cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[#2b1d14]/70 pt-1 pb-2 border-y border-[#e6c898]/30">
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#2b1d14]/30" />
                    Available
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1c120c]/20 line-through" />
                    Booked
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c89349]" />
                    Selected
                </span>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#c89349] uppercase">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-xs">
                {/* Empty padding days */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {/* Days of month */}
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
                            disabled={isOccupied || isPast || loading}
                            onClick={() => handleDateClick(dateStr)}
                            className={`h-9 rounded-xl font-bold flex items-center justify-center transition cursor-pointer relative ${
                                isSelected
                                    ? 'bg-[#c89349] text-[#1c120c] shadow-xs'
                                    : isInRange
                                        ? 'bg-amber-100 text-[#1c120c]'
                                        : isOccupied
                                            ? 'bg-[#1c120c]/10 text-[#1c120c]/30 line-through cursor-not-allowed'
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

            {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl text-center">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}