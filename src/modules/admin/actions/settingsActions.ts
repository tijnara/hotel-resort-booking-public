'use server';

import { createClient } from '@/modules/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

export async function updateSiteSettingsAction(newSettings: Partial<SiteSettings>) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('site_settings')
            .upsert({
                id: 'default',
                ...newSettings,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            console.error('Failed to update site settings in Supabase:', error);
            return { success: false, message: error.message };
        }

        // 🚀 Purges root layout and ALL page caches globally (Browser Title, Watermark, Logo, Footer, Nav, etc.)
        revalidatePath('/', 'layout');
        revalidatePath('/admin', 'layout');

        return { success: true };
    } catch (err: unknown) {
        const error = err as Error;
        console.error('Unexpected error updating site settings:', error);
        return { success: false, message: error?.message || 'Failed to update settings.' };
    }
}