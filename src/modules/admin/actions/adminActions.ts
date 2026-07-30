'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { sendConfirmationEmail, sendCancellationEmail, sendRefundEmail } from '@/modules/bookings/services/emailService';
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
            console.error('Error fetching admin bookings:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Unexpected error fetching admin bookings:', err);
        return [];
    }
}

export async function updateBookingStatusAction(
    bookingId: string,
    newStatus: 'pending' | 'confirmed' | 'cancelled' | 'refunded'
) {
    if (!bookingId) {
        return { success: false, message: 'Invalid booking ID.' };
    }

    const supabase = await createClient();

    // 1. Fetch current booking details along with room information
    const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select(`
      *,
      rooms ( name )
    `)
        .eq('id', bookingId)
        .single();

    if (fetchError || !booking) {
        return { success: false, message: 'Booking record not found.' };
    }

    // 2. Update status in Supabase
    const { error: updateError } = await supabase
        .from('bookings')
        .update({
            status: newStatus
        })
        .eq('id', bookingId);

    if (updateError) {
        console.error('Failed to update booking status in Supabase:', updateError);
        return { success: false, message: updateError.message };
    }

    const bookingRef = booking.id.slice(0, 8).toUpperCase();
    const roomData = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms;
    const roomName = roomData?.name || 'Kubo Villa';

    // 3. 📩 Await email dispatch matching the new status transition
    try {
        if (newStatus === 'confirmed' && booking.status !== 'confirmed') {
            await sendConfirmationEmail({
                to: booking.guest_email,
                guestName: booking.guest_name,
                bookingRef,
                roomName,
                checkIn: booking.check_in,
                checkOut: booking.check_out,
                totalPrice: Number(booking.total_price),
            });
        } else if (newStatus === 'cancelled' && booking.status !== 'cancelled') {
            await sendCancellationEmail({
                to: booking.guest_email,
                guestName: booking.guest_name,
                bookingRef,
                roomName,
                checkIn: booking.check_in,
                checkOut: booking.check_out,
                totalPrice: Number(booking.total_price),
            });
        } else if (newStatus === 'refunded' && booking.status !== 'refunded') {
            await sendRefundEmail({
                to: booking.guest_email,
                guestName: booking.guest_name,
                bookingRef,
                roomName,
                checkIn: booking.check_in,
                checkOut: booking.check_out,
                totalPrice: Number(booking.total_price),
            });
        }
    } catch (emailErr) {
        console.error('Failed to dispatch status update email:', emailErr);
    }

    // 4. Revalidate paths to refresh calendars and dashboard views
    revalidatePath('/admin');
    revalidatePath('/villas');
    revalidatePath('/');

    return { success: true };
}