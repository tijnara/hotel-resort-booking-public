'use client';

import { useState } from 'react';
import { Calendar, Search, RefreshCw, Palmtree } from 'lucide-react';

interface AvailabilityBarProps {
    onFilter: (checkIn: string, checkOut: string) => void;
    onReset: () => void;
    isFiltered: boolean;
    loading: boolean;
}

export function AvailabilityBar({ onFilter, onReset, isFiltered, loading }: AvailabilityBarProps) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkIn || !checkOut) {
            setError('Please select both dates');
            return;
        }
        if (new Date(checkOut) <= new Date(checkIn)) {
            setError('Check-out must be after check-in');
            return;
        }

        setError('');
        onFilter(checkIn, checkOut);
    };

    const handleClear = () => {
        setCheckIn('');
        setCheckOut('');
        setError('');
        onReset();
    };

    return (
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6c898]/50 shadow-xl max-w-4xl mx-auto my-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">

                {/* Check In */}
                <div className="flex-1 bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#c89349] shrink-0" />
                    <div className="w-full">
                        <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest">Check-In Date</label>
                        <input
                            type="date"
                            value={checkIn}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Check Out */}
                <div className="flex-1 bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#c89349] shrink-0" />
                    <div className="w-full">
                        <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest">Check-Out Date</label>
                        <input
                            type="date"
                            value={checkOut}
                            min={checkIn || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 md:flex-none h-14 px-8 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin text-[#c89349]" /> : <Search className="w-4 h-4 text-[#c89349]" />}
                        <span>Check Rates</span>
                    </button>

                    {isFiltered && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="h-14 px-4 bg-[#faf7f2] border border-[#e6c898]/40 text-[#1c120c] text-xs font-bold rounded-2xl hover:bg-slate-100 transition"
                            title="Show All Rooms"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </form>

            {error && (
                <p className="text-rose-700 text-[11px] font-medium mt-2 pl-2">{error}</p>
            )}

            {isFiltered && !error && (
                <div className="mt-3 text-center md:text-left flex items-center justify-between text-xs text-[#2b1d14]/70 px-2 pt-2 border-t border-[#faf7f2]">
          <span className="flex items-center gap-1.5 text-[#2d5a43] font-bold">
            {/* Replaced Sparkles with Seaview Palm Tree Logo */}
              <Palmtree className="w-4 h-4 text-[#c89349]" />
            Showing available villas for {checkIn} to {checkOut}
          </span>
                    <button onClick={handleClear} className="underline text-[11px] text-[#c89349]">
                        Show all villas
                    </button>
                </div>
            )}
        </div>
    );
}