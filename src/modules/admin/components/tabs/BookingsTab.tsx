'use client';

import { useState } from 'react';
import { Clock, Calendar, Check, RefreshCw, Loader2, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import type { AdminBooking } from '../settings/AdminDashboard';

interface BookingsTabProps {
    initialBookings: AdminBooking[];
    loadingId: string | null;
    isSyncingOta: boolean;
    onSyncOta: () => void;
    onStatusUpdate: (id: string, status: 'confirmed' | 'cancelled' | 'pending' | 'refunded', reason?: string) => void;
    onOpenCancelModal: (id: string) => void;
    onViewReceipt: (url: string) => void;
}

export function BookingsTab({
                                initialBookings,
                                loadingId,
                                isSyncingOta,
                                onSyncOta,
                                onStatusUpdate,
                                onOpenCancelModal,
                                onViewReceipt,
                            }: BookingsTabProps) {
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'refunded'>('all');

    const confirmedBookings = initialBookings.filter((b) => b.status === 'confirmed');
    const pendingBookings = initialBookings.filter((b) => b.status === 'pending');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

    const filteredBookings = filter === 'all'
        ? initialBookings
        : initialBookings.filter((b) => b.status === filter);

    const formatBookingTimestamp = (isoDate: string) => {
        if (!isoDate) return 'N/A';
        return new Date(isoDate).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#e6c898]/40 shadow-xs">
                    <div className="flex items-center justify-between text-[#c89349] mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Total Revenue</span>
                        <span className="text-base font-black text-[#c89349] leading-none bg-[#c89349]/10 w-7 h-7 rounded-full flex items-center justify-center">₱</span>
                    </div>
                    <p className="text-2xl font-black text-[#1c120c]">₱{totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#e6c898]/40 shadow-xs">
                    <div className="flex items-center justify-between text-amber-600 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Pending</span>
                        <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-[#1c120c]">{pendingBookings.length}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#e6c898]/40 shadow-xs">
                    <div className="flex items-center justify-between text-[#2d5a43] mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Confirmed</span>
                        <Check className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-[#1c120c]">{confirmedBookings.length}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#e6c898]/40 shadow-xs">
                    <div className="flex items-center justify-between text-[#1c120c] mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60">Total Stays</span>
                        <Calendar className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-[#1c120c]">{initialBookings.length}</p>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-[#e6c898]/40 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-[#e6c898]/30 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg text-[#1c120c]">Reservations & Payment Status</h3>
                        <button
                            onClick={onSyncOta}
                            disabled={isSyncingOta}
                            className="px-3 py-1.5 bg-[#c89349] text-[#1c120c] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-[#b07d37] transition disabled:opacity-50"
                        >
                            {isSyncingOta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                            <span>Sync OTA Calendars</span>
                        </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'pending', 'confirmed', 'cancelled', 'refunded'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                                    filter === tab ? 'bg-[#1c120c] text-[#faf7f2]' : 'bg-[#faf7f2] text-[#2b1d14]/60'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-[#faf7f2]">
                    {filteredBookings.map((b) => (
                        <div key={b.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-xs font-bold text-[#c89349]">#{b.id.slice(0, 8).toUpperCase()}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                        b.status === 'confirmed' ? 'bg-[#2d5a43]/10 text-[#2d5a43]' :
                                            b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                b.status === 'refunded' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                                    'bg-rose-100 text-rose-800'
                                    }`}>
                                        {b.status}
                                    </span>

                                    {b.payment_method && (
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                            {b.payment_method === 'gcash' ? 'GCash / Maya' : b.payment_method === 'bank' ? 'Bank Transfer' : b.payment_method.toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <h4 className="font-bold text-base text-[#1c120c]">{b.guest_name}</h4>
                                <p className="text-xs text-[#2b1d14]/70">{b.guest_email} • {b.guest_phone}</p>

                                <p className="text-xs text-[#2b1d14]/80 pt-0.5">
                                    <strong>{b.rooms?.name || 'Kubo Villa'}</strong> • {b.check_in} to {b.check_out} ({b.guests_count || 1} {b.guests_count === 1 ? 'Guest' : 'Guests'})
                                </p>

                                {b.status === 'cancelled' && b.cancellation_reason && (
                                    <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl mt-1 inline-block font-medium">
                                        <strong>Cancellation Reason:</strong> {b.cancellation_reason}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#c89349] font-medium">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Booked on: {formatBookingTimestamp(b.created_at)}</span>
                                    </div>

                                    {b.receipt_url && (
                                        <button
                                            onClick={() => onViewReceipt(b.receipt_url!)}
                                            className="px-2.5 py-0.5 bg-[#c89349]/15 text-[#1c120c] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#c89349]/30 flex items-center gap-1 hover:bg-[#c89349]/30 transition cursor-pointer"
                                        >
                                            <ImageIcon className="w-3 h-3 text-[#c89349]" />
                                            <span>View Receipt</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="font-extrabold text-lg text-[#1c120c]">₱{Number(b.total_price).toLocaleString()}</span>
                                <div className="flex gap-2">
                                    {loadingId === b.id ? (
                                        <div className="px-4 py-2 bg-gray-100 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <Loader2 className="w-4 h-4 animate-spin text-[#c89349]" />
                                            <span>Updating...</span>
                                        </div>
                                    ) : b.status === 'refunded' ? (
                                        <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 flex items-center gap-1.5 cursor-not-allowed select-none opacity-90">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                                            <span>Refunded (Final)</span>
                                        </span>
                                    ) : (
                                        <>
                                            {b.status === 'pending' && (
                                                <button
                                                    onClick={() => onStatusUpdate(b.id, 'confirmed')}
                                                    className="min-h-[40px] px-3 bg-[#2d5a43] text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#234734] transition active:scale-95 cursor-pointer"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>Confirm</span>
                                                </button>
                                            )}

                                            {b.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => onOpenCancelModal(b.id)}
                                                    className="min-h-[40px] px-3 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-rose-200 transition active:scale-95 cursor-pointer border border-rose-200"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span>Cancel</span>
                                                </button>
                                            )}

                                            {b.status === 'cancelled' && (
                                                <button
                                                    onClick={() => onStatusUpdate(b.id, 'refunded')}
                                                    className="min-h-[40px] px-3 bg-purple-100 text-purple-900 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-purple-200 transition active:scale-95 cursor-pointer border border-purple-300"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    <span>Process Refund</span>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}