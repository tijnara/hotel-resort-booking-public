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

        revalidatePath('/admin', 'page');
        revalidatePath('/villas', 'page');
        revalidatePath('/', 'page');
        return { success: true, room: data };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create room.';
        return { success: false, message };
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

        revalidatePath('/admin', 'page');
        revalidatePath('/villas', 'page');
        revalidatePath('/', 'page');
        return { success: true, room: data };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update room.';
        return { success: false, message };
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

        revalidatePath('/admin', 'page');
        revalidatePath('/villas', 'page');
        revalidatePath('/', 'page');
        return { success: true };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to delete room.';
        return { success: false, message };
    }
}