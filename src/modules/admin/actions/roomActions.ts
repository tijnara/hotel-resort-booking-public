'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateRoomAction(
    roomId: string,
    payload: {
        name: string;
        tagline: string;
        description: string;
        price_per_night: number;
        max_guests: number;
        bed_type: string;
        size_sqm: number;
        images: string[];
    }
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('rooms')
        .update({
            name: payload.name,
            tagline: payload.tagline,
            description: payload.description,
            price_per_night: payload.price_per_night,
            max_guests: payload.max_guests,
            bed_type: payload.bed_type,
            size_sqm: payload.size_sqm,
            images: payload.images,
        })
        .eq('id', roomId);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
}