'use client';

import { useState } from 'react';
import { Calendar, Users, X, ChevronRight } from 'lucide-react';

export function BookingBar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('2');

    return (
        <>
            {/* DESKTOP VIEW */}
            <div id="booking" className="hidden md:block w-full max-w-4xl mx-auto bg-[#faf7f2]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#e6c898]/50 p-3">
                <form className="grid grid-cols-4 gap-3 items-center" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col px-4 py-1 border-r border-[#e6c898]/40">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Check-In</span>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="text-sm font-semibold text-[#1c120c] outline-none bg-transparent cursor-pointer"
                        />
                    </div>

                    <div className="flex flex-col px-4 py-1 border-r border-[#e6c898]/40">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Check-Out</span>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="text-sm font-semibold text-[#1c120c] outline-none bg-transparent cursor-pointer"
                        />
                    </div>

                    <div className="flex flex-col px-4 py-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Guests</span>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="text-sm font-semibold text-[#1c120c] outline-none bg-transparent cursor-pointer"
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3+ Guests</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 bg-[#1c120c] text-[#faf7f2] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2b1d14] transition"
                    >
                        Check Rates
                    </button>
                </form>
            </div>

            {/* MOBILE STICKY BOTTOM BAR */}
            <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-4 bg-[#1c120c]/95 backdrop-blur-md border-t border-[#2b1d14] pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full h-13 bg-[#c89349] text-[#1c120c] rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-between px-5 active:scale-[0.98] transition"
                >
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Check Kubo Availability</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* MOBILE BOTTOM SHEET */}
            {isDrawerOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-[#1c120c]/70 backdrop-blur-xs flex justify-end flex-col">
                    <div className="bg-[#faf7f2] rounded-t-3xl p-6 space-y-5 animate-in slide-in-from-bottom duration-300 pb-[calc(2rem+env(safe-area-inset-bottom))]">
                        <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-[#1c120c]">Reserve Your Stay</h3>
                                <p className="text-xs text-[#2b1d14]/70">Direct bookings include complimentary breakfast</p>
                            </div>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#e6c898]/30 text-[#1c120c]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-white p-3.5 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Check-In</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full text-sm font-semibold text-[#1c120c] bg-transparent outline-none"
                                />
                            </div>

                            <div className="bg-white p-3.5 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Check-Out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full text-sm font-semibold text-[#1c120c] bg-transparent outline-none"
                                />
                            </div>

                            <div className="bg-white p-3.5 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Guests</label>
                                <select
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="w-full text-sm font-semibold text-[#1c120c] bg-transparent outline-none"
                                >
                                    <option value="1">1 Guest</option>
                                    <option value="2">2 Guests</option>
                                    <option value="3">3+ Guests</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="w-full h-14 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl mt-2 active:bg-[#2b1d14] transition"
                            >
                                Search Available Villas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}