'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAdminBookings() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        rooms (
          name,
          price_per_night
        )
      `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch bookings error:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('Unexpected admin fetch error:', err);
        return [];
    }
}

export async function updateBookingStatusAction(
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled'
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin');
    return { success: true };
}