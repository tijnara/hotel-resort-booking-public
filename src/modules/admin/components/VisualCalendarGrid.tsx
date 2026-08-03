'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import type { AdminBooking } from './settings/AdminDashboard';
import type { Room } from '@/modules/shared/types/database.types';

interface VisualCalendarGridProps {
    rooms: Room[];
    bookings: AdminBooking[];
    onSelectBooking?: (booking: AdminBooking) => void;
}

export function VisualCalendarGrid({ rooms, bookings, onSelectBooking }: VisualCalendarGridProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Date calculations for current month view
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const todayStr = new Date().toISOString().split('T')[0];

    // Array of days [1, 2, ..., daysInMonth]
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateObj = new Date(year, month, day);
        const dateStr = dateObj.toISOString().split('T')[0];
        const dayOfWeek = dateObj.toLocaleString('en-US', { weekday: 'narrow' });
        const isToday = dateStr === todayStr;
        return { day, dateStr, dayOfWeek, isToday, dateObj };
    });

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleTodayMonth = () => setCurrentDate(new Date());

    // Filter active bookings for this month
    const activeBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'refunded');

    // Calculate monthly occupancy metrics
    const totalPossibleNights = rooms.length * daysInMonth;
    let bookedNightsThisMonth = 0;

    daysArray.forEach(({ dateStr }) => {
        rooms.forEach((room) => {
            const isBooked = activeBookings.some((b) => {
                const matchRoom = (b.rooms?.name && b.rooms.name === room.name) || (b as { room_id?: string }).room_id === room.id;
                return matchRoom && dateStr >= b.check_in && dateStr < b.check_out;
            });
            if (isBooked) bookedNightsThisMonth++;
        });
    });

    const occupancyRate = totalPossibleNights > 0
        ? Math.round((bookedNightsThisMonth / totalPossibleNights) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Top Toolbar & Summary Header */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Live Visual Grid</span>
                    <h2 className="text-xl font-bold text-[#1c120c] flex items-center gap-2">
                        <span>Front Desk Room Timeline</span>
                        <span className="text-xs bg-[#c89349]/15 text-[#1c120c] font-bold px-2.5 py-0.5 rounded-full border border-[#c89349]/30">
                            {monthName}
                        </span>
                    </h2>
                </div>

                {/* Month Controls & Month Quick Switcher */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center bg-[#faf7f2] p-1 rounded-2xl border border-[#e6c898]/40">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 text-[#1c120c] hover:bg-white rounded-xl transition cursor-pointer"
                            title="Previous Month"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleTodayMonth}
                            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1c120c] hover:bg-white rounded-xl transition cursor-pointer"
                        >
                            Today
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 text-[#1c120c] hover:bg-white rounded-xl transition cursor-pointer"
                            title="Next Month"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Occupancy Indicator Pill */}
                    <div className="bg-[#1c120c] text-[#faf7f2] px-4 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-xs">
                        <Sparkles className="w-4 h-4 text-[#c89349]" />
                        <span>Occupancy: <strong className="text-[#c89349] font-black">{occupancyRate}%</strong></span>
                    </div>
                </div>
            </div>

            {/* Legend Indicators */}
            <div className="flex items-center gap-4 text-xs font-semibold text-[#2b1d14]/70 bg-white p-4 rounded-2xl border border-[#e6c898]/30 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Status Legend:</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500 border border-emerald-600 inline-block" />
                    <span>Direct Confirmed</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-amber-400 border border-amber-500 inline-block" />
                    <span>Pending Approval</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-indigo-500 border border-indigo-600 inline-block" />
                    <span>External OTA (Airbnb/Booking)</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-white border-2 border-rose-500 inline-block" />
                    <span>Today&apos;s Date</span>
                </span>
            </div>

            {/* Visual Tape Chart Grid Container */}
            <div className="bg-white rounded-3xl border border-[#e6c898]/40 shadow-xs overflow-x-auto relative">
                <table className="w-full border-collapse text-left min-w-[1000px]">
                    {/* Calendar Header Row */}
                    <thead>
                    <tr className="bg-[#1c120c] text-[#faf7f2] text-[11px] font-bold border-b border-[#2b1d14]">
                        <th className="p-4 w-48 sticky left-0 z-20 bg-[#1c120c] border-r border-[#2b1d14] shadow-sm">
                            Villa Accommodations
                        </th>
                        {daysArray.map(({ day, dayOfWeek, isToday, dateStr }) => (
                            <th
                                key={dateStr}
                                className={`p-1.5 text-center min-w-[36px] max-w-[40px] border-r border-[#2b1d14]/50 ${
                                    isToday ? 'bg-[#c89349] text-[#1c120c] font-black' : ''
                                }`}
                            >
                                <div className="text-[9px] uppercase tracking-tighter opacity-80">{dayOfWeek}</div>
                                <div className="text-xs font-bold leading-none mt-0.5">{day}</div>
                            </th>
                        ))}
                    </tr>
                    </thead>

                    {/* Room Rows */}
                    <tbody className="divide-y divide-[#faf7f2] text-xs">
                    {rooms.map((room) => (
                        <tr key={room.id} className="hover:bg-[#faf7f2]/50 transition">
                            {/* Room Title Sticky Cell */}
                            <td className="p-4 sticky left-0 z-10 bg-white border-r border-[#e6c898]/40 font-bold text-[#1c120c] shadow-2xs">
                                <div className="truncate max-w-[170px]" title={room.name}>{room.name}</div>
                                <div className="text-[10px] text-[#c89349] font-medium mt-0.5">
                                    ₱{Number(room.price_per_night).toLocaleString()} / night
                                </div>
                            </td>

                            {/* Day Cells */}
                            {daysArray.map(({ dateStr, isToday }) => {
                                // Find matching booking for this room on this date
                                const matchingBooking = activeBookings.find((b) => {
                                    const matchRoom = (b.rooms?.name && b.rooms.name === room.name) || (b as { room_id?: string }).room_id === room.id;
                                    return matchRoom && dateStr >= b.check_in && dateStr < b.check_out;
                                });

                                const isCheckInDay = matchingBooking && matchingBooking.check_in === dateStr;
                                const isOta = matchingBooking?.payment_method === 'airbnb' || matchingBooking?.payment_method === 'booking.com';

                                return (
                                    <td
                                        key={dateStr}
                                        className={`p-1 text-center border-r border-[#e6c898]/20 relative h-14 ${
                                            isToday ? 'bg-[#c89349]/10' : ''
                                        }`}
                                    >
                                        {matchingBooking ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedBooking(matchingBooking);
                                                    if (onSelectBooking) onSelectBooking(matchingBooking);
                                                }}
                                                className={`w-full h-11 rounded-lg text-[10px] font-bold p-1 flex flex-col justify-center items-center overflow-hidden transition cursor-pointer shadow-2xs ${
                                                    isOta
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        : matchingBooking.status === 'confirmed'
                                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                            : 'bg-amber-500 text-slate-900 hover:bg-amber-600'
                                                }`}
                                                title={`${matchingBooking.guest_name} (${matchingBooking.check_in} → ${matchingBooking.check_out})`}
                                            >
                                                {isCheckInDay ? (
                                                    <span className="truncate w-full font-black text-center px-0.5">
                                                        {matchingBooking.guest_name.split(' ')[0]}
                                                    </span>
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                                                )}
                                            </button>
                                        ) : (
                                            <span className="block w-full h-full rounded-md hover:bg-[#faf7f2] transition" />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Quick-View Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 bg-[#1c120c]/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-5 shadow-2xl relative border border-[#e6c898]/40 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">
                                    #{selectedBooking.id.slice(0, 8).toUpperCase()}
                                </span>
                                <h3 className="text-lg font-bold text-[#1c120c]">Reservation Details</h3>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                            >
                                <X className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="bg-[#faf7f2] p-3 rounded-2xl space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Guest Info</span>
                                <h4 className="font-bold text-sm text-[#1c120c]">{selectedBooking.guest_name}</h4>
                                <p className="text-gray-600">{selectedBooking.guest_email} • {selectedBooking.guest_phone}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#faf7f2] p-3 rounded-2xl">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Check-In</span>
                                    <p className="font-bold text-[#1c120c] mt-0.5">{selectedBooking.check_in}</p>
                                </div>
                                <div className="bg-[#faf7f2] p-3 rounded-2xl">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Check-Out</span>
                                    <p className="font-bold text-[#1c120c] mt-0.5">{selectedBooking.check_out}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-[#faf7f2] rounded-2xl">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Status & Payment</span>
                                    <p className="font-bold text-[#1c120c] uppercase mt-0.5">
                                        {selectedBooking.status} ({selectedBooking.payment_method || 'Direct'})
                                    </p>
                                </div>
                                <span className="text-base font-extrabold text-[#c89349]">
                                    ₱{Number(selectedBooking.total_price).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedBooking(null)}
                            className="w-full py-3 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#2b1d14] transition cursor-pointer"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}