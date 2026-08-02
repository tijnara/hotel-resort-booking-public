'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Room } from '@/modules/shared/types/database.types';

export async function createRoomAction(roomData: Partial<Room>) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('rooms')
            .insert([roomData])
            .select()
            .single();

        if (error) {
            return { success: false, message: error.message };
        }

        revalidatePath('/admin');
        revalidatePath('/villas');
        revalidatePath('/');
        return { success: true, room: data };
    } catch (err: any) {
        return { success: false, message: err.message || 'Failed to create room.' };
    }
}

export async function updateRoomAction(id: string, roomData: Partial<Room>) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('rooms')
            .update(roomData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, message: error.message };
        }

        revalidatePath('/admin');
        revalidatePath('/villas');
        revalidatePath('/');
        return { success: true, room: data };
    } catch (err: any) {
        return { success: false, message: err.message || 'Failed to update room.' };
    }
}

export async function deleteRoomAction(id: string) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, message: error.message };
        }

        revalidatePath('/admin');
        revalidatePath('/villas');
        revalidatePath('/');
        return { success: true };
    } catch (err: any) {
        return { success: false, message: err.message || 'Failed to delete room.' };
    }
}