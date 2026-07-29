'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, X, Clock, Calendar, UserPlus, Home, Edit3, RefreshCw, Loader2, Users, Maximize2, Sliders } from 'lucide-react';
import { updateBookingStatusAction } from '../actions/adminActions';
import { createStaffUserAction } from '../actions/userActions';
import { EditRoomModal } from './EditRoomModal';
import { SiteSettingsForm } from './SiteSettingsForm';
import type { Room } from '@/modules/shared/types/database.types';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface AdminDashboardProps {
    initialBookings: any[];
    initialStaff: any[];
    initialRooms?: Room[];
    siteSettings?: SiteSettings;
}

export function AdminDashboard({
                                   initialBookings,
                                   initialStaff,
                                   initialRooms = [],
                                   siteSettings,
                               }: AdminDashboardProps) {
    const [mainTab, setMainTab] = useState<'bookings' | 'users' | 'villas' | 'settings'>('bookings');
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    // User Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('staff');
    const [userLoading, setUserLoading] = useState(false);
    const [userMsg, setUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled' | 'pending') => {
        setLoadingId(id);
        await updateBookingStatusAction(id, status);
        setLoadingId(null);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserLoading(true);
        setUserMsg(null);

        const res = await createStaffUserAction({ fullName, email, password, role });
        setUserLoading(false);

        if (res.success) {
            setUserMsg({ type: 'success', text: 'New staff user added successfully!' });
            setFullName('');
            setEmail('');
            setPassword('');
        } else {
            setUserMsg({ type: 'error', text: res.message || 'Failed to create user.' });
        }
    };

    return (
        <div className="space-y-8">
            {/* Top View Selector */}
            <div className="flex items-center gap-3 border-b border-[#e6c898]/40 pb-4 overflow-x-auto [scrollbar-width:none]">
                <button
                    onClick={() => setMainTab('bookings')}
                    className={`min-h-[44px] px-6 rounded-2xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                        mainTab === 'bookings'
                            ? 'bg-[#1c120c] text-[#faf7f2]'
                            : 'bg-white text-[#2b1d14]/70 border border-[#e6c898]/40'
                    }`}
                >
                    Reservations & Payments
                </button>

                <button
                    onClick={() => setMainTab('villas')}
                    className={`min-h-[44px] px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition whitespace-nowrap ${
                        mainTab === 'villas'
                            ? 'bg-[#1c120c] text-[#faf7f2]'
                            : 'bg-white text-[#2b1d14]/70 border border-[#e6c898]/40'
                    }`}
                >
                    <Home className="w-4 h-4 text-[#c89349]" />
                    <span>Kubo Villas ({initialRooms.length})</span>
                </button>

                <button
                    onClick={() => setMainTab('settings')}
                    className={`min-h-[44px] px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition whitespace-nowrap ${
                        mainTab === 'settings'
                            ? 'bg-[#1c120c] text-[#faf7f2]'
                            : 'bg-white text-[#2b1d14]/70 border border-[#e6c898]/40'
                    }`}
                >
                    <Sliders className="w-4 h-4 text-[#c89349]" />
                    <span>Site Content & Branding</span>
                </button>

                <button
                    onClick={() => setMainTab('users')}
                    className={`min-h-[44px] px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition whitespace-nowrap ${
                        mainTab === 'users'
                            ? 'bg-[#1c120c] text-[#faf7f2]'
                            : 'bg-white text-[#2b1d14]/70 border border-[#e6c898]/40'
                    }`}
                >
                    <UserPlus className="w-4 h-4 text-[#c89349]" />
                    <span>Users & Staff ({initialStaff.length})</span>
                </button>
            </div>

            {mainTab === 'bookings' ? (
                <>
                    {/* Overview Stat Cards */}
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
                        <div className="p-5 border-b border-[#e6c898]/30 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-[#1c120c]">Reservations & Payment Status</h3>
                            <div className="flex gap-2">
                                {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilter(tab)}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
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
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-[#c89349]">#{b.id.slice(0, 8).toUpperCase()}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                                b.status === 'confirmed' ? 'bg-[#2d5a43]/10 text-[#2d5a43]' :
                                                    b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-rose-100 text-rose-800'
                                            }`}>
                        {b.status}
                      </span>
                                        </div>

                                        <h4 className="font-bold text-base text-[#1c120c]">{b.guest_name}</h4>
                                        <p className="text-xs text-[#2b1d14]/70">{b.guest_email} • {b.guest_phone}</p>

                                        <p className="text-xs text-[#2b1d14]/80 pt-0.5">
                                            <strong>{b.rooms?.name || 'Kubo Villa'}</strong> • {b.check_in} to {b.check_out} ({b.guests_count || 1} {b.guests_count === 1 ? 'Guest' : 'Guests'})
                                        </p>

                                        <div className="flex items-center gap-1.5 text-[11px] text-[#c89349] font-medium pt-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Booked on: {formatBookingTimestamp(b.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-extrabold text-lg text-[#1c120c]">₱{Number(b.total_price).toLocaleString()}</span>
                                        <div className="flex gap-2">
                                            {b.status !== 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                                                    disabled={loadingId === b.id}
                                                    className="min-h-[40px] px-3 bg-[#2d5a43] text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#234734] transition active:scale-95"
                                                >
                                                    {loadingId === b.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    <span>Confirm</span>
                                                </button>
                                            )}
                                            {b.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(b.id, 'cancelled')}
                                                    disabled={loadingId === b.id}
                                                    className="min-h-[40px] px-3 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-rose-200 transition active:scale-95"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span>Cancel</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : mainTab === 'villas' ? (
                /* Kubo Villa Management Section */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialRooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-3xl border border-[#e6c898]/40 overflow-hidden shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="relative aspect-16/9 w-full bg-[#faf7f2]">
                                    {room.images?.[0] && (
                                        <Image
                                            src={room.images[0]}
                                            alt={room.name}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="absolute top-3 right-3 bg-[#1c120c]/85 backdrop-blur-md text-[#faf7f2] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#c89349]/30">
                                        {room.bed_type}
                                    </div>
                                </div>

                                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] block mb-1">
                    {room.tagline || 'Kubo Villa'}
                  </span>
                                    <h3 className="font-bold text-lg text-[#1c120c]">{room.name}</h3>
                                    <p className="text-xs text-[#2b1d14]/70 mt-2 line-clamp-2 leading-relaxed">
                                        {room.description}
                                    </p>

                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#faf7f2] text-xs font-medium text-[#2b1d14]/70">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#c89349]" />
                      Max {room.max_guests} Guests
                    </span>
                                        <span className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-[#c89349]" />
                                            {room.size_sqm} m²
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 pt-0 border-t border-[#faf7f2] mt-2 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/50 block">Nightly Rate</span>
                                    <span className="font-extrabold text-xl text-[#1c120c]">₱{Number(room.price_per_night).toLocaleString()}</span>
                                </div>

                                <button
                                    onClick={() => setEditingRoom(room)}
                                    className="min-h-[44px] px-5 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] active:scale-95 transition"
                                >
                                    <Edit3 className="w-4 h-4 text-[#c89349]" />
                                    <span>Edit Villa</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : mainTab === 'settings' ? (
                /* Site Content & Settings Tab */
                siteSettings ? (
                    <SiteSettingsForm settings={siteSettings} />
                ) : (
                    <div className="p-8 text-center text-xs text-[#2b1d14]/60">Loading site settings...</div>
                )
            ) : (
                /* Staff & User Section */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Staff Access</span>
                            <h3 className="text-lg font-bold text-[#1c120c]">Add New Resort User</h3>
                        </div>

                        {userMsg && (
                            <div className={`p-3 text-xs rounded-xl ${
                                userMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                                {userMsg.text}
                            </div>
                        )}

                        <form onSubmit={handleCreateUser} className="space-y-3">
                            <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Maria Santos"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                                />
                            </div>

                            <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="staff@seaview.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                                />
                            </div>

                            <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                                />
                            </div>

                            <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Access Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                                >
                                    <option value="staff">Front Desk Staff</option>
                                    <option value="manager">Resort Manager</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={userLoading}
                                className="w-full h-12 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition"
                            >
                                {userLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register User'}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-3xl border border-[#e6c898]/40 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-[#e6c898]/30 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-[#1c120c]">Registered Staff & Users</h3>
                            <span className="text-xs text-[#2b1d14]/60">{initialStaff.length} Accounts</span>
                        </div>

                        <div className="divide-[#faf7f2] divide-y">
                            {initialStaff.map((u) => (
                                <div key={u.id} className="p-5 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm text-[#1c120c]">
                                                {u.user_metadata?.full_name || u.email}
                                            </h4>
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#c89349]/20 text-[#1c120c]">
                        {u.user_metadata?.role || 'Staff'}
                      </span>
                                        </div>
                                        <p className="text-xs text-[#2b1d14]/60 mt-0.5">{u.email}</p>
                                    </div>
                                    <span className="text-[10px] text-[#2b1d14]/40 font-mono">
                    Added: {new Date(u.created_at).toLocaleDateString()}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Room Modal */}
            {editingRoom && (
                <EditRoomModal
                    room={editingRoom}
                    isOpen={!!editingRoom}
                    onClose={() => setEditingRoom(null)}
                />
            )}
        </div>
    );
}