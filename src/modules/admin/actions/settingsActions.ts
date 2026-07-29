'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

export async function updateSiteSettingsAction(payload: Partial<SiteSettings>) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('site_settings')
        .update({
            ...payload,
            updated_at: new Date().toISOString(),
        })
        .eq('id', 'default');

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
}