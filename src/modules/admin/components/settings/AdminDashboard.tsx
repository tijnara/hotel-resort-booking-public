'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, LayoutGrid, Home, Sliders, UserPlus, ChevronRight, Check, Loader2, Edit3, Radio, ShieldAlert } from 'lucide-react';
import { updateBookingStatusAction } from '../../actions/adminActions';
import { createStaffUserAction, updateStaffUserAction, deleteStaffUserAction } from '../../actions/userActions';
import { updateSiteSettingsAction } from '../../actions/settingsActions';
import { deleteRoomAction } from '../../actions/roomActions';

import { EditRoomModal } from './EditRoomModal';
import { SiteSettingsForm } from '../SiteSettingsForm';
import { VisualCalendarGrid } from '../VisualCalendarGrid';
import { BookingsTab } from '../tabs/BookingsTab';
import { VillasTab } from '../tabs/VillasTab';
import { UsersTab } from '../tabs/UsersTab';
import { CancellationModal } from '../modals/CancellationModal';
import { EditUserModal } from '../modals/EditUserModal';
import { ReceiptModal } from '../modals/ReceiptModal';

import { createClient } from '@/modules/shared/lib/supabase/client';
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
    rooms?: { name?: string; price_per_night?: number } | null;
}

export interface StaffUser {
    id: string;
    email?: string;
    created_at: string;
    user_metadata?: { full_name?: string; role?: string; permissions?: string[] };
}

interface AdminDashboardProps {
    initialBookings: AdminBooking[];
    initialStaff: StaffUser[];
    initialRooms?: Room[];
    siteSettings?: SiteSettings;
    userRole?: string;
    userPermissions?: string[];
}

type DashboardTabKey = 'bookings' | 'calendar' | 'villas' | 'settings' | 'users';

const DEFAULT_REASONS = [
    'Guest requested cancellation',
    'Invalid or unverified payment receipt',
    'Unpaid / Expired payment deadline',
    'Double booking / Schedule conflict',
];

const MAIN_NAVIGATION_TABS: Array<{ key: DashboardTabKey; icon: typeof Clock }> = [
    { key: 'bookings', icon: Clock },
    { key: 'calendar', icon: LayoutGrid },
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
                                            userPermissions = ['bookings', 'calendar'],
                                        }: AdminDashboardProps) {
    const router = useRouter();
    const isAdmin = userRole.toLowerCase() === 'admin';

    // Filter available navigation tabs based on role & granted permissions
    const visibleTabs = MAIN_NAVIGATION_TABS.filter((tab) =>
        isAdmin || userPermissions.includes(tab.key)
    );

    const [mainTab, setMainTab] = useState<DashboardTabKey>(
        visibleTabs[0]?.key || 'bookings'
    );
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [viewingReceiptUrl, setViewingReceiptUrl] = useState<string | null>(null);
    const [isSyncingOta, setIsSyncingOta] = useState(false);

    // Supabase Realtime Listener
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel('realtime_admin_bookings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                router.refresh();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);

    // Cancellation & Tab Names State
    const [cancellationOptions, setCancellationOptions] = useState<string[]>(
        siteSettings?.cancellation_reasons || DEFAULT_REASONS
    );
    const [cancelModalBookingId, setCancelModalBookingId] = useState<string | null>(null);

    const DEFAULT_TAB_NAMES: Record<DashboardTabKey, string> = {
        bookings: 'Reservations & Payments',
        calendar: 'Visual Room Timeline',
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

    // Villa & Staff Modal States
    const [roomModalOpen, setRoomModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

    const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    // Handlers
    const handleSyncOtaCalendars = async () => {
        setIsSyncingOta(true);
        try {
            const res = await fetch('/api/cron/sync-calendars');
            const data = await res.json();
            setIsSyncingOta(false);
            if (data.success) {
                alert(data.message);
                router.refresh();
            } else {
                alert(`Sync Failed: ${data.message}`);
            }
        } catch {
            setIsSyncingOta(false);
            alert('Failed to connect to sync endpoint.');
        }
    };

    const handleSaveTabName = async (key: string) => {
        if (!isAdmin) return;
        setEditingTabKey(null);
        setSavingTabKey(key);

        const res = await updateSiteSettingsAction({
            ...siteSettings,
            admin_tab_names: tabNames,
        });

        setSavingTabKey(null);
        if (!res || !res.success) {
            alert(`Failed to save tab name: ${res?.message || 'Unknown error'}`);
        }
    };

    const handleSaveCancellationReasons = async (newReasons: string[]) => {
        setCancellationOptions(newReasons);
        if (siteSettings) {
            await updateSiteSettingsAction({
                ...siteSettings,
                cancellation_reasons: newReasons,
            });
        }
    };

    const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled' | 'pending' | 'refunded', reason?: string) => {
        setLoadingId(id);
        const res = await updateBookingStatusAction(id, status, reason);
        setLoadingId(null);

        if (!res || !res.success) {
            alert(`Error updating reservation: ${res?.message || 'Unknown error'}`);
        }
    };

    const handleConfirmCancellation = async (reason: string) => {
        if (!cancelModalBookingId) return;
        const id = cancelModalBookingId;
        setCancelModalBookingId(null);
        await handleStatusUpdate(id, 'cancelled', reason);
    };

    const handleSaveVillasHeader = async (payload: { title: string; description: string; bgType: 'image' | 'color'; bgColor: string; bgImage: string }) => {
        const res = await updateSiteSettingsAction({
            ...siteSettings,
            villas_title: payload.title,
            villas_description: payload.description,
            villas_hero_bg_type: payload.bgType,
            villas_hero_bg_color: payload.bgColor,
            villas_hero_image: payload.bgImage,
        });
        return { success: !!res?.success, message: res?.message };
    };

    const handleDeleteRoom = async (id: string, roomName: string) => {
        if (!isAdmin || !confirm(`Are you sure you want to delete "${roomName}"?`)) return;
        setDeletingRoomId(id);
        const res = await deleteRoomAction(id);
        setDeletingRoomId(null);

        if (!res || !res.success) {
            alert(`Error deleting villa: ${res?.message || 'Unknown error'}`);
        }
    };

    const handleCreateUser = async (payload: { fullName: string; email: string; password: string; role: string; permissions?: string[] }) => {
        const res = await createStaffUserAction(payload);
        return { success: !!res?.success, message: res?.message };
    };

    // 🛠️ Fixed: Made permissions optional (permissions?: string[]) to match EditUserModal's handler type signature
    const handleUpdateUser = async (payload: { id: string; fullName: string; email: string; role: string; permissions?: string[]; password?: string }) => {
        const res = await updateStaffUserAction(payload);
        return { success: !!res?.success, message: res?.message };
    };

    const handleDeleteUser = async (id: string, userEmail?: string) => {
        if (!isAdmin || !confirm(`Delete staff account ${userEmail || ''}?`)) return;
        setDeletingUserId(id);
        const res = await deleteStaffUserAction(id);
        setDeletingUserId(null);

        if (!res || !res.success) {
            alert(`Error deleting user: ${res?.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="space-y-8">
            {/* Top Navigation */}
            <div className="space-y-2">
                <div className="flex items-center justify-between md:hidden text-[10px] font-bold uppercase tracking-widest text-[#c89349]">
                    <span>Control Sections</span>
                    <span className="flex items-center gap-1 bg-[#c89349]/15 px-2.5 py-1 rounded-full text-[#1c120c]">
                        <span>Swipe tabs</span>
                        <ChevronRight className="w-3.5 h-3.5 animate-pulse text-[#c89349]" />
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-[#e6c898]/40 pb-4 flex-wrap">
                    <div className="flex items-center gap-2.5 md:gap-3 max-md:overflow-x-auto md:flex-wrap max-md:[scrollbar-width:none]">
                        {visibleTabs.map(({ key, icon: IconComponent }) => {
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
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveTabName(key)}
                                                className="text-xs font-bold text-[#1c120c] outline-none w-36 bg-transparent"
                                                autoFocus
                                            />
                                            <button onClick={() => handleSaveTabName(key)} className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer">
                                                <Check className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`min-h-[44px] px-5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition whitespace-nowrap ${
                                            isSelected ? 'bg-[#1c120c] text-[#faf7f2]' : 'bg-white text-[#2b1d14]/70 border border-[#e6c898]/40 hover:bg-[#faf7f2]'
                                        }`}>
                                            <button onClick={() => setMainTab(key)} className="flex items-center gap-2 cursor-pointer outline-none">
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#c89349]" /> : <IconComponent className="w-4 h-4 text-[#c89349]" />}
                                                <span>{tabNames[key]}</span>
                                            </button>

                                            {isAdmin && (
                                                <button onClick={(e) => { e.stopPropagation(); setEditingTabKey(key); }} className="p-1 hover:text-[#c89349] transition text-gray-400 cursor-pointer ml-1">
                                                    <Edit3 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                        <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        <span>Live Sync Active</span>
                    </div>
                </div>
            </div>

            {/* TAB CONTENT VIEWS */}
            {mainTab === 'bookings' && (
                <BookingsTab
                    initialBookings={initialBookings}
                    loadingId={loadingId}
                    isSyncingOta={isSyncingOta}
                    onSyncOta={handleSyncOtaCalendars}
                    onStatusUpdate={handleStatusUpdate}
                    onOpenCancelModal={(id) => setCancelModalBookingId(id)}
                    onViewReceipt={(url) => setViewingReceiptUrl(url)}
                />
            )}

            {mainTab === 'calendar' && (
                <VisualCalendarGrid
                    rooms={initialRooms}
                    bookings={initialBookings}
                    siteSettings={siteSettings}
                    isAdmin={isAdmin}
                />
            )}

            {mainTab === 'villas' && (
                <VillasTab
                    initialRooms={initialRooms}
                    siteSettings={siteSettings}
                    isAdmin={isAdmin}
                    deletingRoomId={deletingRoomId}
                    onOpenRoomModal={(room) => { setSelectedRoom(room); setRoomModalOpen(true); }}
                    onDeleteRoom={handleDeleteRoom}
                    onSaveHeader={handleSaveVillasHeader}
                />
            )}

            {mainTab === 'settings' && (
                isAdmin ? (
                    siteSettings ? <SiteSettingsForm settings={siteSettings} /> : <div className="p-8 text-center text-xs text-[#2b1d14]/60">Loading settings...</div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border text-center space-y-3">
                        <ShieldAlert className="w-10 h-10 mx-auto text-[#c89349]" />
                        <h3 className="font-bold text-lg text-[#1c120c]">Administrator Access Required</h3>
                    </div>
                )
            )}

            {mainTab === 'users' && (
                <UsersTab
                    initialStaff={initialStaff}
                    isAdmin={isAdmin}
                    deletingUserId={deletingUserId}
                    onCreateUser={handleCreateUser}
                    onOpenEditUser={(user) => setEditingUser(user)}
                    onDeleteUser={handleDeleteUser}
                />
            )}

            {/* MODALS */}
            <CancellationModal
                bookingId={cancelModalBookingId}
                cancellationOptions={cancellationOptions}
                isAdmin={isAdmin}
                onClose={() => setCancelModalBookingId(null)}
                onConfirm={handleConfirmCancellation}
                onAddReason={(reason) => handleSaveCancellationReasons([...cancellationOptions, reason])}
                onDeleteReason={(index) => handleSaveCancellationReasons(cancellationOptions.filter((_, i) => i !== index))}
            />

            {isAdmin && (
                <EditRoomModal
                    room={selectedRoom}
                    isOpen={roomModalOpen}
                    onClose={() => { setRoomModalOpen(false); setSelectedRoom(null); }}
                />
            )}

            {isAdmin && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleUpdateUser}
                />
            )}

            <ReceiptModal
                receiptUrl={viewingReceiptUrl}
                onClose={() => setViewingReceiptUrl(null)}
            />
        </div>
    );
}