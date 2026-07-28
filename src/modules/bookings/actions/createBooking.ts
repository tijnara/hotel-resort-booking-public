'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { sendRequestReceivedEmail } from '../services/emailService';
import { revalidatePath } from 'next/cache';

export async function createBookingAction(payload: {
    roomId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    pricePerNight: number;
}) {
    const supabase = await createClient();

    if (!payload.guestName || !payload.guestEmail || !payload.checkIn || !payload.checkOut) {
        return { success: false, message: 'Please complete all required fields.' };
    }

    // Fetch room name for email formatting
    const { data: room } = await supabase.from('rooms').select('name').eq('id', payload.roomId).single();

    const checkInDate = new Date(payload.checkIn);
    const checkOutDate = new Date(payload.checkOut);

    if (checkOutDate <= checkInDate) {
        return { success: false, message: 'Check-out date must be after check-in date.' };
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * payload.pricePerNight;

    // Execute atomic procedure in Supabase (saves status as 'pending')
    const { data, error } = await supabase.rpc('create_booking_safe', {
        p_room_id: payload.roomId,
        p_guest_name: payload.guestName,
        p_guest_email: payload.guestEmail,
        p_guest_phone: payload.guestPhone,
        p_check_in: payload.checkIn,
        p_check_out: payload.checkOut,
        p_guests_count: payload.guestsCount,
        p_total_price: totalPrice,
    });

    if (error) return { success: false, message: error.message };

    const result = data as { success: boolean; message?: string; booking_id?: string };

    if (result.success && result.booking_id) {
        const bookingRef = result.booking_id.slice(0, 8).toUpperCase();

        // 📩 STAGE 1: Send "Request Received" Email to the guest
        await sendRequestReceivedEmail({
            to: payload.guestEmail,
            guestName: payload.guestName,
            bookingRef,
            roomName: room?.name || 'Kubo Villa',
            checkIn: payload.checkIn,
            checkOut: payload.checkOut,
            totalPrice,
        });

        revalidatePath('/');
        return { success: true, bookingId: result.booking_id, totalPrice, nights };
    } else {
        return { success: false, message: result.message || 'Booking request failed.' };
    }
}