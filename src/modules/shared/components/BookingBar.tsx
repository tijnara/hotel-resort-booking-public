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
            <div id="booking" className="hidden md:block w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 p-3">
                <form className="grid grid-cols-4 gap-3 items-center" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col px-4 py-1 border-r border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Check-In</span>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="text-sm font-medium text-slate-800 outline-none bg-transparent cursor-pointer"
                        />
                    </div>

                    <div className="flex flex-col px-4 py-1 border-r border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Check-Out</span>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="text-sm font-medium text-slate-800 outline-none bg-transparent cursor-pointer"
                        />
                    </div>

                    <div className="flex flex-col px-4 py-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Guests</span>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="text-sm font-medium text-slate-800 outline-none bg-transparent cursor-pointer"
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3+ Guests</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition"
                    >
                        Check Rates
                    </button>
                </form>
            </div>

            {/* MOBILE STICKY BOTTOM BAR */}
            <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full h-13 bg-cyan-400 text-slate-950 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-between px-5 active:scale-[0.98] transition"
                >
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Reserve Your Stay</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* MOBILE BOTTOM SHEET */}
            {isDrawerOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end flex-col">
                    <div className="bg-white rounded-t-3xl p-6 space-y-5 animate-in slide-in-from-bottom duration-300 pb-[calc(2rem+env(safe-area-inset-bottom))]">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Select Dates</h3>
                                <p className="text-xs text-slate-500">Best rates guaranteed on direct stays</p>
                            </div>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-100 text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check-In</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none"
                                />
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check-Out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none"
                                />
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Guests</label>
                                <select
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none"
                                >
                                    <option value="1">1 Guest</option>
                                    <option value="2">2 Guests</option>
                                    <option value="3">3+ Guests</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="w-full h-14 bg-slate-950 text-white font-bold uppercase tracking-widest text-xs rounded-xl mt-2 active:bg-slate-800 transition"
                            >
                                View Available Rooms
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}