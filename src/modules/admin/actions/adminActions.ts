'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { sendConfirmationEmail } from '@/modules/bookings/services/emailService';
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

        if (error) return [];
        return data || [];
    } catch {
        return [];
    }
}

export async function updateBookingStatusAction(
    bookingId: string,
    newStatus: 'pending' | 'confirmed' | 'cancelled'
) {
    const supabase = await createClient();

    // Fetch current booking details
    const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select(`
      *,
      rooms ( name )
    `)
        .eq('id', bookingId)
        .single();

    if (fetchError || !booking) {
        return { success: false, message: 'Booking not found.' };
    }

    // Update status in Supabase
    const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

    if (updateError) {
        return { success: false, message: updateError.message };
    }

    // 📩 STAGE 2: Send "Booking Confirmed" Email when admin approves
    if (newStatus === 'confirmed' && booking.status !== 'confirmed') {
        const bookingRef = booking.id.slice(0, 8).toUpperCase();
        await sendConfirmationEmail({
            to: booking.guest_email,
            guestName: booking.guest_name,
            bookingRef,
            roomName: booking.rooms?.name || 'Kubo Villa',
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            totalPrice: booking.total_price,
        });
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
}