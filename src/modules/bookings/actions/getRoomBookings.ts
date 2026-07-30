'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';

export interface BookedDateRange {
    check_in: string;  // YYYY-MM-DD
    check_out: string; // YYYY-MM-DD
}

export async function getBookedDatesForRoomAction(roomId: string) {
    if (!roomId) return { success: false, bookedRanges: [] };

    const supabase = await createClient();

    // Fetch only active/occupying bookings (excluding cancelled & refunded stays)
    const { data, error } = await supabase
        .from('bookings')
        .select('check_in, check_out')
        .eq('room_id', roomId)
        .not('status', 'in', '("cancelled","refunded")');

    if (error) {
        console.error('Failed to fetch booked dates:', error);
        return { success: false, bookedRanges: [] };
    }

    return { success: true, bookedRanges: (data as BookedDateRange[]) || [] };
}