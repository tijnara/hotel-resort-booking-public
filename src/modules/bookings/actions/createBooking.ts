'use server';

import { z } from 'zod';
import { createClient } from '@/modules/shared/lib/supabase/server';
import { sendRequestReceivedEmail } from '@/modules/bookings/services/emailService';

const CreateBookingSchema = z.object({
    roomId: z.string().uuid('Invalid room selected.'),
    guestName: z.string().trim().min(2, 'Name must be at least 2 characters.'),
    guestEmail: z.string().trim().email('Please provide a valid email address.'),
    guestPhone: z.string().trim().min(7, 'Please provide a valid contact number.'),
    checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid check-in date.'),
    checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid check-out date.'),
    guestsCount: z.number().int().min(1, 'At least 1 guest is required.'),
    totalPrice: z.number().positive('Total price must be greater than zero.'),
    paymentMethod: z.enum(['gcash', 'bank']).default('gcash'),
    receiptUrl: z.string().optional(),
}).refine(
    (data) => new Date(data.checkOut) > new Date(data.checkIn),
    {
        message: 'Check-out date must be after check-in date.',
        path: ['checkOut'],
    }
);

interface CreateBookingPayload {
    roomId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    totalPrice: number;
    paymentMethod: 'gcash' | 'bank';
    receiptUrl?: string;
}

export async function createBookingAction(rawData: CreateBookingPayload) {
    const validation = CreateBookingSchema.safeParse(rawData);
    if (!validation.success) {
        return {
            success: false,
            message: validation.error.issues[0].message,
        };
    }

    const data = validation.data;
    const supabase = await createClient();

    const { data: roomData } = await supabase
        .from('rooms')
        .select('name')
        .eq('id', data.roomId)
        .single();

    const roomName = roomData?.name || 'Kubo Villa';

    const { data: insertedBooking, error } = await supabase
        .from('bookings')
        .insert([
            {
                room_id: data.roomId,
                guest_name: data.guestName,
                guest_email: data.guestEmail,
                guest_phone: data.guestPhone,
                check_in: data.checkIn,
                check_out: data.checkOut,
                guests_count: data.guestsCount,
                total_price: data.totalPrice,
                payment_method: data.paymentMethod,
                receipt_url: data.receiptUrl || null,
                status: 'pending',
            },
        ])
        .select('id')
        .single();

    if (error) {
        if (error.code === '23P01') {
            return {
                success: false,
                message: 'These dates were just reserved by another guest. Please select different dates.',
            };
        }

        console.error('Failed to create booking:', error);
        return { success: false, message: error.message || 'Failed to complete booking.' };
    }

    const bookingRef = insertedBooking?.id ? insertedBooking.id.slice(0, 8).toUpperCase() : 'SEAVIEW';

    // Send Stage 1 Email with Payment Method
    sendRequestReceivedEmail({
        to: data.guestEmail,
        guestName: data.guestName,
        bookingRef,
        roomName,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        totalPrice: data.totalPrice,
        paymentMethod: data.paymentMethod,
    }).catch((err) => console.error('Stage 1 Email Error:', err));

    return { success: true, bookingRef };
}