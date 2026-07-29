'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import type { Room } from '@/modules/shared/types/database.types';

export async function filterAvailableRoomsAction(
    checkIn: string,
    checkOut: string
): Promise<{ success: boolean; rooms: Room[]; message?: string }> {
    if (!checkIn || !checkOut) {
        return { success: false, rooms: [], message: 'Please select both check-in and check-out dates.' };
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        return { success: false, rooms: [], message: 'Check-out date must be after check-in date.' };
    }

    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_available_rooms', {
            p_check_in: checkIn,
            p_check_out: checkOut,
        });

        if (error) {
            console.error('Error fetching available rooms:', error);
            return { success: false, rooms: [], message: error.message };
        }

        return { success: true, rooms: data || [] };
    } catch (err) {
        console.error('Failed to execute filterAvailableRoomsAction:', err);
        return { success: false, rooms: [], message: 'An unexpected error occurred.' };
    }
}