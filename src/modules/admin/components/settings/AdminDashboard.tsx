'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, X, Clock, Calendar, UserPlus, Home, Edit3, RefreshCw, Loader2, Users, Maximize2, Sliders, Save, CheckCircle2, Plus, Trash2, ShieldAlert, ChevronRight, Image as ImageIcon, AlertTriangle, Settings } from 'lucide-react';
import { updateBookingStatusAction } from '../../actions/adminActions';
import { createStaffUserAction, updateStaffUserAction, deleteStaffUserAction } from '../../actions/userActions';
import { updateSiteSettingsAction } from '../../actions/settingsActions';
import { deleteRoomAction } from '../../actions/roomActions';
import { EditRoomModal } from './EditRoomModal';
import { SiteSettingsForm } from '../SiteSettingsForm';
import type { Room } from '@/modules/shared/types/database.types';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

export interface AdminBooking {
    id: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    check_in: string;
    check_out: string;
    guests_count?: number;
    total_price: number | string;
    payment_method?: string | null;
    receipt_url?: string | null;
    cancellation_reason?: string | null;
    status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
    created_at: string;
    rooms?: {
        name?: string;
        price_per_night?: number;
    } | null;
}

export interface StaffUser {
    id: string;
    email?: string;
    created_at: string;
    user_metadata?: {
        full_name?: string;
        role?: string;
    };
}

interface AdminDashboardProps {
    initialBookings: AdminBooking[];
    initialStaff: StaffUser[];
    initialRooms?: Room[];
    siteSettings?: SiteSettings;
    userRole?: string;
}

type DashboardTabKey = 'bookings' | 'villas' | 'settings' | 'users';

const DEFAULT_REASONS = [
    'Guest requested cancellation',
    'Invalid or unverified payment receipt',
    'Unpaid / Expired payment deadline',
    'Double booking / Schedule conflict',
];

const MAIN_NAVIGATION_TABS: Array<{ key: DashboardTabKey; icon: typeof Clock }> = [
    { key: 'bookings', icon: Clock },
    { key: 'villas', icon: Home },
    { key: 'settings', icon: Sliders },
    { key: 'users', icon: UserPlus },
];

export function AdminDashboardComponent({
                                            initialBookings,
                                            initialStaff,
                                            initialRooms = [],
                                            siteSettings,
                                            userRole = 'staff',
                                        }: AdminDashboardProps) {
    const isAdmin = userRole.toLowerCase() === 'admin';

    const [mainTab, setMainTab] = useState<DashboardTabKey>('bookings');
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'refunded'>('all');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [viewingReceiptUrl, setViewingReceiptUrl] = useState<string | null>(null);

    // Cancellation Reasons State
    const [cancellationOptions, setCancellationOptions] = useState<string[]>(
        siteSettings?.cancellation_reasons || DEFAULT_REASONS
    );
    const [cancelModalBookingId, setCancelModalBookingId] = useState<string | null>(null);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [otherReasonText, setOtherReasonText] = useState<string>('');
    const [isManagingReasons, setIsManagingReasons] = useState(false);
    const [newReasonInput, setNewReasonInput] = useState('');

    // Supabase Database-Backed Tab Names
    const DEFAULT_TAB_NAMES: Record<DashboardTabKey, string> = {
        bookings: 'Reservations & Payments',
        villas: `Kubo Villas (${initialRooms.length})`,
        settings: 'Site Content & Branding',
        users: `Users & Staff (${initialStaff.length})`,
    };

    const [tabNames, setTabNames] = useState<Record<string, string>>(() => ({
        ...DEFAULT_TAB_NAMES,
        ...(siteSettings?.admin_tab_names || {}),
    }));

    const [editingTabKey, setEditingTabKey] = useState<string | null>(null);
    const [savingTabKey, setSavingTabKey] = useState<string | null>(null);

    const handleSaveTabName = async (key: string) => {
        if (!isAdmin) return;
        setEditingTabKey(null);
        setSavingTabKey(key);

        const updatedTabNames = { ...tabNames };

        const res = await updateSiteSettingsAction({
            ...siteSettings,
            admin_tab_names: updatedTabNames,
        });

        setSavingTabKey(null);

        if (!res || !res.success) {
            alert(`Failed to save tab name in database: ${res?.message || 'Unknown error'}`);
        }
    };

    // Save Updated Cancellation Reasons List (Admins Only)
    const handleSaveCancellationReasons = async (newReasons: string[]) => {
        setCancellationOptions(newReasons);
        if (siteSettings) {
            await updateSiteSettingsAction({
                ...siteSettings,
                cancellation_reasons: newReasons,
            });
        }
    };

    const handleAddReason = () => {
        if (!newReasonInput.trim()) return;
        const updated = [...cancellationOptions, newReasonInput.trim()];
        handleSaveCancellationReasons(updated);
        setNewReasonInput('');
    };

    const handleDeleteReason = (index: number) => {
        const updated = cancellationOptions.filter((_, i) => i !== index);
        handleSaveCancellationReasons(updated);
    };

    // Status Update Trigger
    const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled' | 'pending' | 'refunded', reason?: string) => {
        setLoadingId(id);
        const res = await updateBookingStatusAction(id, status, reason);
        setLoadingId(null);

        if (!res || !res.success) {
            alert(`Error updating reservation: ${res?.message || 'Unknown error'}`);
        }
    };

    const handleConfirmCancellation = async () => {
        if (!cancelModalBookingId) return;

        const finalReason = selectedReason === 'Other' ? otherReasonText : selectedReason;
        if (!finalReason.trim()) {
            alert('Please specify a reason for cancellation.');
            return;
        }

        const id = cancelModalBookingId;
        setCancelModalBookingId(null);
        await handleStatusUpdate(id, 'cancelled', finalReason);

        setSelectedReason('');
        setOtherReasonText('');
    };

    // Villa Management States
    const [roomModalOpen, setRoomModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

    const [villasTitle, setVillasTitle] = useState(siteSettings?.villas_title || 'Handcrafted Kubo Villas');
    const [villasDescription, setVillasDescription] = useState(siteSettings?.villas_description || '');
    const [savingVillasHeader, setSavingVillasHeader] = useState(false);
    const [villasHeaderMsg, setVillasHeaderMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('staff');
    const [userLoading, setUserLoading] = useState(false);
    const [userMsg, setUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState('staff');
    const [editPassword, setEditPassword] = useState('');
    const [editUserLoading, setEditUserLoading] = useState(false);
    const [editUserMsg, setEditUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

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

    const handleSaveVillasHeader = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;
        setSavingVillasHeader(true);
        setVillasHeaderMsg(null);

        const res = await updateSiteSettingsAction({
            ...siteSettings,
            villas_title: villasTitle,
            villas_description: villasDescription,
        });

        setSavingVillasHeader(false);
        if (res && res.success) {
            setVillasHeaderMsg({ type: 'success', text: 'Kubo Villas page header updated successfully!' });
        } else {
            setVillasHeaderMsg({ type: 'error', text: res?.message || 'Failed to update page header.' });
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;
        setUserLoading(true);
        setUserMsg(null);

        const res = await createStaffUserAction({ fullName, email, password, role });
        setUserLoading(false);

        if (res && res.success) {
            setUserMsg({ type: 'success', text: 'New staff user added successfully!' });
            setFullName('');
            setEmail('');
            setPassword('');
        } else {
            setUserMsg({ type: 'error', text: res?.message || 'Failed to create user.' });
        }
    };

    const handleOpenEditUser = (u: StaffUser) => {
        if (!isAdmin) return;
        setEditingUser(u);
        setEditFullName(u.user_metadata?.full_name || '');
        setEditEmail(u.email || '');
        setEditRole(u.user_metadata?.role || 'staff');
        setEditPassword('');
        setEditUserMsg(null);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin || !editingUser) return;

        setEditUserLoading(true);
        setEditUserMsg(null);

        const res = await updateStaffUserAction({
            id: editingUser.id,
            fullName: editFullName,
            email: editEmail,
            role: editRole,
            password: editPassword,
        });

        setEditUserLoading(false);

        if (res && res.success) {
            setEditUserMsg({ type: 'success', text: 'Staff account updated successfully!' });
            setTimeout(() => {
                setEditingUser(null);
            }, 1000);
        } else {
            setEditUserMsg({ type: 'error', text: res?.message || 'Failed to update user.' });
        }
    };

    const handleDeleteUser = async (id: string, userEmail?: string) => {
        if (!isAdmin) return;
        if (!confirm(`Are you sure you want to delete staff account ${userEmail || ''}?`)) return;

        setDeletingUserId(id);
        const res = await deleteStaffUserAction(id);
        setDeletingUserId(null);

        if (!res || !res.success) {
            alert(`Error deleting user: ${res?.message || 'Unknown error'}`);
        }
    };

    const handleDeleteRoom = async (id: string, roomName: string) => {
        if (!isAdmin) return;
        if (!confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) return;

        setDeletingRoomId(id);
        const res = await deleteRoomAction(id);
        setDeletingRoomId(null);

        if (!res || !res.success) {
            alert(`Error deleting villa: ${res?.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="space-y-8">
            {/* Top Navigation Control Container */}
            <div className="space-y-2">
                <div className="flex items-center justify-between md:hidden text-[10px] font-bold uppercase tracking-widest text-[#c89349]">
                    <span>Control Sections</span>
                    <span className="flex items-center gap-1 bg-[#c89349]/15 px-2.5 py-1 rounded-full text-[#1c120c]">
                        <span>Swipe tabs</span>
                        <ChevronRight className="w-3.5 h-3.5 animate-pulse text-[#c89349]" />
                    </span>
                </div>

                {/* 🖥️ Responsive Layout: Auto-Wraps on PC / Swipes on Mobile */}
                <div className="flex items-center gap-2.5 md:gap-3 border-b border-[#e6c898]/40 pb-4 max-md:overflow-x-auto md:flex-wrap max-md:[scrollbar-width:none]">
                    {MAIN_NAVIGATION_TABS.map(({ key, icon: IconComponent }) => {
                        const isSelected = mainTab === key;
                        const isEditing = editingTabKey === key;
                        const isSaving = savingTabKey === key;

                        return (
                            <div key={key} className="flex items-center gap-1 shrink-0 md:shrink">
                                {isEditing && isAdmin ? (
                                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-[#c89349] shadow-xs">
                                        <input
                                            type="text"
                                            value={tabNames[key] || ''}
                                            onChange={(e) => setTabNames({ ...tabNames, [key]: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveTabName(key);
                                            }}
                                            className="text-xs font-bold text-[#1c120c] outline-none w-36 bg-transparent"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleSaveTabName(key)}
                                            className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                                            title="Save to database"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={`min-h-[44px] px-5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition whitespace-nowrap ${
                                        isSelected
                                            ? 'bg-[#1c120c] text-[#faf7f2]'
                                            : 'bg-white text-[#2b1d14]/70 border border-[#e6c898]/40 hover:bg-[#faf7f2]'
                                    }`}>
                                        <button
                                            onClick={() => setMainTab(key)}
                                            className="flex items-center gap-2 cursor-pointer outline-none"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-[#c89349]" />
                                            ) : (
                                                <IconComponent className="w-4 h-4 text-[#c89349]" />
                                            )}
                                            <span>{tabNames[key]}</span>
                                        </button>

                                        {isAdmin && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingTabKey(key);
                                                }}
                                                className="p-1 hover:text-[#c89349] transition text-gray-400 cursor-pointer ml-1"
                                                title="Rename tab"
                                            >
                                                <Edit3 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* TAB 1: Reservations & Payments */}
            {mainTab === 'bookings' ? (
                <>
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
                            <h3 className="font-bold text-lg text-[#1c120c]">Reservations & Payment Status</h3>
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
                                                    {b.payment_method === 'gcash' ? 'GCash / Maya' : 'Bank Transfer'}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="font-bold text-base text-[#1c120c]">{b.guest_name}</h4>
                                        <p className="text-xs text-[#2b1d14]/70">{b.guest_email} • {b.guest_phone}</p>

                                        <p className="text-xs text-[#2b1d14]/80 pt-0.5">
                                            <strong>{b.rooms?.name || 'Kubo Villa'}</strong> • {b.check_in} to {b.check_out} ({b.guests_count || 1} {b.guests_count === 1 ? 'Guest' : 'Guests'})
                                        </p>

                                        {/* Display Reason if Cancelled */}
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
                                                    onClick={() => setViewingReceiptUrl(b.receipt_url || null)}
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
                                                            onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                                                            className="min-h-[40px] px-3 bg-[#2d5a43] text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#234734] transition active:scale-95 cursor-pointer"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            <span>Confirm</span>
                                                        </button>
                                                    )}

                                                    {/* Open Cancellation Modal */}
                                                    {b.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => {
                                                                setCancelModalBookingId(b.id);
                                                                setSelectedReason(cancellationOptions[0] || '');
                                                            }}
                                                            className="min-h-[40px] px-3 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-rose-200 transition active:scale-95 cursor-pointer border border-rose-200"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            <span>Cancel</span>
                                                        </button>
                                                    )}

                                                    {b.status === 'cancelled' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(b.id, 'refunded')}
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
                </>
            ) : mainTab === 'villas' ? (
                /* TAB 2: Villa Management */
                <div className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Inventory</span>
                            <h3 className="text-lg font-bold text-[#1c120c]">Kubo Villa Accommodations</h3>
                            <p className="text-xs text-[#2b1d14]/60">Manage pricing, photos, guest capacity, and room details.</p>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setSelectedRoom(null);
                                    setRoomModalOpen(true);
                                }}
                                className="min-h-[44px] px-6 bg-[#c89349] text-[#1c120c] font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 hover:bg-[#b07d37] transition cursor-pointer shadow-md active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add New Villa</span>
                            </button>
                        )}
                    </div>

                    {isAdmin && (
                        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Villas Page Content</span>
                                <h3 className="text-lg font-bold text-[#1c120c]">Main Heading Title & Description Paragraph</h3>
                            </div>

                            {villasHeaderMsg && (
                                <div className={`p-3 text-xs rounded-xl font-bold ${
                                    villasHeaderMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}>
                                    {villasHeaderMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleSaveVillasHeader} className="space-y-3">
                                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Main Heading Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={villasTitle}
                                        onChange={(e) => setVillasTitle(e.target.value)}
                                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                                    />
                                </div>

                                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description Paragraph</label>
                                    <textarea
                                        rows={2}
                                        required
                                        value={villasDescription}
                                        onChange={(e) => setVillasDescription(e.target.value)}
                                        className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingVillasHeader}
                                    className="min-h-[42px] px-6 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition cursor-pointer"
                                >
                                    {savingVillasHeader ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            <Save className="w-4 h-4 text-[#c89349]" />
                                            <span>Save Header Content</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialRooms.map((room) => (
                            <div key={room.id} className="bg-white rounded-3xl border border-[#e6c898]/40 overflow-hidden shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="relative aspect-16/9 w-full bg-[#faf7f2]">
                                        {room.images?.[0] && (
                                            <Image src={room.images[0]} alt={room.name} fill className="object-cover" />
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
                                        <p className="text-xs text-[#2b1d14]/70 mt-2 line-clamp-2 leading-relaxed">{room.description}</p>
                                    </div>
                                </div>

                                <div className="p-5 pt-0 border-t border-[#faf7f2] mt-2 flex items-center justify-between">
                                    <span className="font-extrabold text-xl text-[#1c120c]">₱{Number(room.price_per_night).toLocaleString()}</span>
                                    {isAdmin && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setSelectedRoom(room); setRoomModalOpen(true); }}
                                                className="px-3 py-2 bg-[#1c120c] text-white text-xs font-bold rounded-xl flex items-center gap-1"
                                            >
                                                <Edit3 className="w-3.5 h-3.5 text-[#c89349]" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRoom(room.id, room.name)}
                                                disabled={deletingRoomId === room.id}
                                                className="px-3 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-100"
                                            >
                                                {deletingRoomId === room.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : mainTab === 'settings' ? (
                isAdmin ? (
                    siteSettings ? <SiteSettingsForm settings={siteSettings} /> : <div className="p-8 text-center text-xs text-[#2b1d14]/60">Loading settings...</div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border text-center space-y-3">
                        <ShieldAlert className="w-10 h-10 mx-auto text-[#c89349]" />
                        <h3 className="font-bold text-lg text-[#1c120c]">Administrator Access Required</h3>
                    </div>
                )
            ) : (
                /* TAB 4: Staff Directory & Management */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {isAdmin ? (
                        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Staff Access</span>
                                <h3 className="text-lg font-bold text-[#1c120c]">Add New Resort User</h3>
                            </div>

                            {userMsg && (
                                <div className={`p-3 text-xs rounded-xl ${userMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                                    {userMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleCreateUser} className="space-y-3">
                                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Full Name</label>
                                    <input type="text" required placeholder="Maria Santos" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none" />
                                </div>

                                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Email</label>
                                    <input type="email" required placeholder="staff@seaview.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none" />
                                </div>

                                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Password</label>
                                    <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none" />
                                </div>

                                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Access Role</label>
                                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none cursor-pointer">
                                        <option value="staff">Front Desk Staff</option>
                                        <option value="manager">Resort Manager</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>

                                <button type="submit" disabled={userLoading} className="w-full h-12 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition cursor-pointer">
                                    {userLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register User'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-3xl border border-[#e6c898]/40 text-center space-y-2">
                            <ShieldAlert className="w-8 h-8 mx-auto text-[#c89349]" />
                            <h4 className="font-bold text-sm text-[#1c120c]">Administrator Restricted</h4>
                        </div>
                    )}

                    <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-3xl border border-[#e6c898]/40 shadow-xs overflow-hidden`}>
                        <div className="p-5 border-b border-[#e6c898]/30 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-[#1c120c]">Registered Staff & Users</h3>
                            <span className="text-xs text-[#2b1d14]/60">{initialStaff.length} Accounts</span>
                        </div>

                        <div className="divide-[#faf7f2] divide-y">
                            {initialStaff.map((u) => (
                                <div key={u.id} className="p-5 flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm text-[#1c120c]">{u.user_metadata?.full_name || u.email || 'Staff Member'}</h4>
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#c89349]/20 text-[#1c120c]">{u.user_metadata?.role || 'Staff'}</span>
                                        </div>
                                        <p className="text-xs text-[#2b1d14]/60 mt-0.5">{u.email || 'No email provided'}</p>
                                    </div>

                                    {isAdmin && (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenEditUser(u)} className="min-h-[36px] px-3.5 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1 hover:bg-[#2b1d14] cursor-pointer">
                                                <Edit3 className="w-3.5 h-3.5 text-[#c89349]" />
                                                <span>Edit</span>
                                            </button>
                                            <button onClick={() => handleDeleteUser(u.id, u.email)} disabled={deletingUserId === u.id} className="min-h-[36px] px-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 cursor-pointer border border-rose-200">
                                                {deletingUserId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CANCELLATION REASON MODAL */}
            {cancelModalBookingId && (
                <div className="fixed inset-0 z-50 bg-[#1c120c]/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-3xl max-w-lg w-full space-y-5 shadow-2xl relative border border-[#e6c898]/40 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2 text-rose-700">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="text-lg font-bold text-[#1c120c]">Cancel Reservation</h3>
                            </div>
                            <button onClick={() => setCancelModalBookingId(null)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
                                <X className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>

                        <p className="text-xs text-[#2b1d14]/70">Please select or specify the reason for cancelling this reservation:</p>

                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                            {cancellationOptions.map((reason) => (
                                <label key={reason} className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition ${selectedReason === reason ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-[#faf7f2] border-transparent text-[#1c120c]'}`}>
                                    <input type="radio" name="cancelReason" value={reason} checked={selectedReason === reason} onChange={() => setSelectedReason(reason)} className="accent-rose-600 cursor-pointer" />
                                    <span>{reason}</span>
                                </label>
                            ))}

                            <label className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition ${selectedReason === 'Other' ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-[#faf7f2] border-transparent text-[#1c120c]'}`}>
                                <input type="radio" name="cancelReason" value="Other" checked={selectedReason === 'Other'} onChange={() => setSelectedReason('Other')} className="accent-rose-600 cursor-pointer" />
                                <span>Other (Enter Custom Reason)</span>
                            </label>
                        </div>

                        {selectedReason === 'Other' && (
                            <div className="space-y-1.5 animate-in fade-in duration-200">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-rose-700">Specify Other Reason</label>
                                <textarea rows={2} required placeholder="e.g., Guest requested date change, double booking..." value={otherReasonText} onChange={(e) => setOtherReasonText(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-[#faf7f2] p-3 rounded-xl border border-rose-200 outline-none resize-none" />
                            </div>
                        )}

                        {isAdmin && (
                            <div className="pt-2 border-t border-gray-100">
                                <button type="button" onClick={() => setIsManagingReasons(!isManagingReasons)} className="text-[11px] font-bold text-[#c89349] hover:underline flex items-center gap-1 cursor-pointer">
                                    <Settings className="w-3.5 h-3.5" />
                                    <span>{isManagingReasons ? 'Hide Reason Options Editor' : 'Manage Cancellation Options (Add/Delete)'}</span>
                                </button>

                                {isManagingReasons && (
                                    <div className="mt-3 p-3 bg-[#faf7f2] rounded-2xl border border-[#e6c898]/40 space-y-3 animate-in fade-in duration-200">
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Add new cancellation reason..." value={newReasonInput} onChange={(e) => setNewReasonInput(e.target.value)} className="w-full text-xs bg-white p-2 rounded-xl border outline-none font-medium" />
                                            <button type="button" onClick={handleAddReason} className="px-3 bg-[#1c120c] text-white text-xs font-bold rounded-xl hover:bg-[#2b1d14] cursor-pointer">Add</button>
                                        </div>

                                        <div className="space-y-1.5">
                                            {cancellationOptions.map((opt, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg text-xs font-medium border">
                                                    <span className="truncate pr-2">{opt}</span>
                                                    <button type="button" onClick={() => handleDeleteReason(idx)} className="text-rose-600 hover:text-rose-800 cursor-pointer p-0.5" title="Delete Reason">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setCancelModalBookingId(null)} className="w-1/2 h-11 bg-white text-[#1c120c] border border-gray-200 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-50 transition cursor-pointer">Back</button>
                            <button type="button" onClick={handleConfirmCancellation} className="w-1/2 h-11 bg-rose-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-rose-800 transition cursor-pointer shadow-md">
                                <X className="w-4 h-4" />
                                <span>Confirm Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit/Add Room Modal (ADMINS ONLY) */}
            {isAdmin && (
                <EditRoomModal room={selectedRoom} isOpen={roomModalOpen} onClose={() => { setRoomModalOpen(false); setSelectedRoom(null); }} />
            )}

            {/* Edit User Modal (ADMINS ONLY) */}
            {isAdmin && editingUser && (
                <div className="fixed inset-0 z-50 bg-[#1c120c]/70 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-[#faf7f2] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#e6c898]/40 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Staff Access</span>
                                <h3 className="text-xl font-bold text-[#1c120c]">Edit Staff User</h3>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-[#e6c898]/30 text-[#1c120c] cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {editUserMsg && (
                            <div className={`mt-4 p-3 text-xs rounded-xl font-bold ${editUserMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                                {editUserMsg.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdateUser} className="space-y-3 mt-4">
                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Full Name</label>
                                <input type="text" required value={editFullName} onChange={(e) => setEditFullName(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] outline-none" />
                            </div>

                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Email</label>
                                <input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] outline-none" />
                            </div>

                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Access Role</label>
                                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] outline-none cursor-pointer">
                                    <option value="staff">Front Desk Staff</option>
                                    <option value="manager">Resort Manager</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">New Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                                <input type="password" placeholder="••••••••" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] outline-none" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setEditingUser(null)} className="w-1/2 h-11 bg-white text-[#1c120c] border border-[#e6c898]/40 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                                <button type="submit" disabled={editUserLoading} className="w-1/2 h-11 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition disabled:opacity-50 cursor-pointer">
                                    {editUserLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (<><Save className="w-4 h-4 text-[#c89349]" /><span>Save User</span></>)}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RECEIPT PREVIEW MODAL */}
            {viewingReceiptUrl && (
                <div className="fixed inset-0 z-50 bg-[#1c120c]/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white p-5 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative">
                        <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Payment Verification</span>
                                <h4 className="text-sm font-bold text-[#1c120c]">Uploaded Payment Screenshot</h4>
                            </div>
                            <button onClick={() => setViewingReceiptUrl(null)} className="p-1.5 rounded-full bg-[#faf7f2] hover:bg-[#e6c898]/30 transition text-[#1c120c] cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-[#faf7f2] border border-[#e6c898]/40">
                            <Image src={viewingReceiptUrl} alt="Payment Receipt Screenshot" fill className="object-contain" />
                        </div>

                        <button onClick={() => setViewingReceiptUrl(null)} className="w-full py-3 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#2b1d14] transition cursor-pointer">
                            Close Receipt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}