'use client';

import { useState } from 'react';
import { Check, X, Clock, DollarSign, Calendar, UserPlus, Users, Loader2 } from 'lucide-react';
import { updateBookingStatusAction } from '../actions/adminActions';
import { createStaffUserAction } from '../actions/userActions';

interface AdminDashboardProps {
    initialBookings: any[];
    initialStaff: any[];
}

export function AdminDashboard({ initialBookings, initialStaff }: AdminDashboardProps) {
    const [mainTab, setMainTab] = useState<'bookings' | 'users'>('bookings');
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // User Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('staff');
    const [userLoading, setUserLoading] = useState(false);
    const [userMsg, setUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Stats
    const confirmedBookings = initialBookings.filter((b) => b.status === 'confirmed');
    const pendingBookings = initialBookings.filter((b) => b.status === 'pending');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

    const filteredBookings = filter === 'all'
        ? initialBookings
        : initialBookings.filter((b) => b.status === filter);

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
            <div className="flex items-center gap-3 border-b border-[#e6c898]/40 pb-4">
                <button
                    onClick={() => setMainTab('bookings')}
                    className={`min-h-[44px] px-6 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                        mainTab === 'bookings'
                            ? 'bg-[#1c120c] text-[#faf7f2]'
                            : 'bg-white text-[#2b1d14]/70 border border-[#e6c898]/40'
                    }`}
                >
                    Reservations & Payments
                </button>
                <button
                    onClick={() => setMainTab('users')}
                    className={`min-h-[44px] px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
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
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-black text-[#1c120c]">${totalRevenue.toLocaleString()}</p>
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
                                    <div>
                                        <span className="font-mono text-xs font-bold text-[#c89349]">#{b.id.slice(0, 8).toUpperCase()}</span>
                                        <h4 className="font-bold text-base text-[#1c120c]">{b.guest_name}</h4>
                                        <p className="text-xs text-[#2b1d14]/70">{b.guest_email} • {b.guest_phone}</p>
                                        <p className="text-xs text-[#2b1d14]/80 pt-1">
                                            <strong>{b.rooms?.name || 'Kubo Villa'}</strong> • {b.check_in} to {b.check_out}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-extrabold text-lg text-[#1c120c]">${b.total_price}</span>
                                        <div className="flex gap-2">
                                            {b.status !== 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                                                    className="min-h-[40px] px-3 bg-[#2d5a43] text-white text-xs font-bold rounded-xl"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {b.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(b.id, 'cancelled')}
                                                    className="min-h-[40px] px-3 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                /* Staff & User Section */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add User Form */}
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

                    {/* User List Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-[#e6c898]/40 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-[#e6c898]/30 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-[#1c120c]">Registered Staff & Users</h3>
                            <span className="text-xs text-[#2b1d14]/60">{initialStaff.length} Accounts</span>
                        </div>

                        <div className="divide-y divide-[#faf7f2]">
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
        </div>
    );
}