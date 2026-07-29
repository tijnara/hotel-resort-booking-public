import { createClient } from '@/modules/shared/lib/supabase/server';

export interface NavLinkItem {
    label: string;
    href: string;
}

export interface SiteSettings {
    id: string;
    site_name: string;
    logo_url: string;
    hero_subtitle: string;
    hero_title: string;
    hero_description: string;
    reserve_button_text: string;
    nav_links: NavLinkItem[];
    footer_address: string;
    footer_phone: string;
    footer_email: string;
    footer_watermark: string;
    footer_credit: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 'default')
            .single();

        if (data) return data as SiteSettings;
    } catch (err) {
        console.error('Failed to fetch site settings:', err);
    }

    // Fallback defaults if DB row is not found
    return {
        id: 'default',
        site_name: 'SEAVIEW',
        logo_url: '',
        hero_subtitle: 'MODERN FILIPINO COASTAL SANCTUARY',
        hero_title: 'Bamboo, Capiz & Unbroken Ocean Views.',
        hero_description: 'Handcrafted beachfront Kubo villas blending ancestral Philippine architecture with modern minimalist luxury.',
        reserve_button_text: 'Reserve Villa',
        nav_links: [
            { label: 'Kubo Villas', href: '#villas' },
            { label: 'The Sanctuary', href: '#sanctuary' },
            { label: 'Al Fresco Dining', href: '#dining' },
        ],
        footer_address: 'Coastal Highway, Philippines',
        footer_phone: '+63 912 345 6789',
        footer_email: 'reservations@seaviewkubo.com',
        footer_watermark: 'SEAVIEW',
        footer_credit: '@tijnara',
    };
}