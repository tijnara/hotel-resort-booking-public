import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Palmtree, LogOut } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/server';
import { getAdminBookings } from '@/modules/admin/actions/adminActions';
import { getStaffUsersAction } from '@/modules/admin/actions/userActions';
import { getRooms } from '@/modules/rooms/services/getRooms';
import { AdminDashboard } from '@/modules/admin/components/AdminDashboard';

export const metadata = {
    title: 'Admin Desk | Seaview Resort',
};

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    // Fetch bookings, staff, and rooms in parallel
    const [bookings, staffUsers, rooms] = await Promise.all([
        getAdminBookings(),
        getStaffUsersAction(),
        getRooms(),
    ]);

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] pb-20">
            <header className="bg-[#1c120c] text-[#faf7f2] px-5 h-16 flex items-center justify-between border-b border-[#2b1d14]">
                <Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-lg uppercase text-[#faf7f2]">
                    <Palmtree className="w-5 h-5 text-[#c89349]" />
                    <span>SEAVIEW DESK</span>
                </Link>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-[#e6c898] hidden sm:inline">{user.email}</span>
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="text-xs font-semibold uppercase tracking-wider text-[#c89349] hover:text-white transition flex items-center gap-1.5"
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

                {/* Pass initialRooms here */}
                <AdminDashboard
                    initialBookings={bookings}
                    initialStaff={staffUsers}
                    initialRooms={rooms}
                />
            </main>
        </div>
    );
}