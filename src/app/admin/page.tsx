import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Palmtree, LogOut, Laptop } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/server';
import { getAdminBookings } from '@/modules/admin/actions/adminActions';
import { getStaffUsersAction } from '@/modules/admin/actions/userActions';
import { getRooms } from '@/modules/rooms/services/getRooms';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { AdminDashboardComponent } from '@/modules/admin/components/settings/AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Admin Desk | Seaview Resort',
};

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    const [bookings, staffUsers, rooms, settings] = await Promise.all([
        getAdminBookings(),
        getStaffUsersAction(),
        getRooms(true), // Pass 'true' to include hidden/maintenance rooms on the Admin Desk
        getSiteSettings(),
    ]);

    // Determine user role, permissions, and formatted display label
    const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const userRole = (user.user_metadata?.role || 'staff').toLowerCase();
    const userPermissions = user.user_metadata?.permissions || ['bookings', 'calendar'];
    const userDisplayLabel = `${fullName} (${userRole.toUpperCase()})`;

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between">
            <div>
                <header className="bg-[#1c120c] text-[#faf7f2] px-5 h-16 flex items-center justify-between border-b border-[#2b1d14]">
                    <Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-lg uppercase text-[#faf7f2]">
                        <Palmtree className="w-5 h-5 text-[#c89349]" />
                        <span>{settings?.site_name || 'SEAVIEW'} DESK</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-[#e6c898] hidden sm:inline">
                            {userDisplayLabel}
                        </span>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="text-xs font-semibold uppercase tracking-wider text-[#c89349] hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log Out</span>
                            </button>
                        </form>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-5 pt-8">
                    <div className="mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Management Portal</span>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1c120c] mt-1">Dashboard & Administration</h1>
                    </div>

                    <AdminDashboardComponent
                        initialBookings={bookings}
                        initialStaff={staffUsers}
                        initialRooms={rooms}
                        siteSettings={settings}
                        userRole={userRole}
                        userPermissions={userPermissions}
                    />
                </main>
            </div>

            {/* Permanent Admin Footer Watermark */}
            <footer className="w-full max-w-7xl mx-auto px-5 py-8 border-t border-[#e6c898]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#2b1d14]/60 gap-3 mt-12">
                <p>© 2026 {settings?.site_name || 'SEAVIEW'}. All rights reserved.</p>
                <p className="flex items-center gap-1.5 font-medium text-[#c89349]">
                    <Laptop className="w-4 h-4 text-[#c89349]" />
                    <span className="font-bold text-[#1c120c]">@tijnara</span>
                </p>
            </footer>
        </div>
    );
}