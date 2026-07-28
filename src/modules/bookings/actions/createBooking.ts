'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface BookingPayload {
    roomId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    pricePerNight: number;
}

export async function createBookingAction(payload: BookingPayload) {
    const supabase = await createClient();

    // 1. Basic validation
    if (!payload.guestName || !payload.guestEmail || !payload.checkIn || !payload.checkOut) {
        return { success: false, message: 'Please complete all required fields.' };
    }

    const checkInDate = new Date(payload.checkIn);
    const checkOutDate = new Date(payload.checkOut);

    if (checkOutDate <= checkInDate) {
        return { success: false, message: 'Check-out date must be after check-in date.' };
    }

    // 2. Calculate total nights and price
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * payload.pricePerNight;

    // 3. Call Supabase Atomic Stored Procedure
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

    if (error) {
        return { success: false, message: error.message };
    }

    const result = data as { success: boolean; message?: string; booking_id?: string };

    if (result.success) {
        revalidatePath('/');
        return { success: true, bookingId: result.booking_id, totalPrice, nights };
    } else {
        return { success: false, message: result.message || 'Booking failed.' };
    }
}