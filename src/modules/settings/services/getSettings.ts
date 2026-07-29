import { createClient } from '@/modules/shared/lib/supabase/server';

export interface NavLinkItem {
    label: string;
    href: string;
}

export interface SanctuaryAmenity {
    icon: string;
    title: string;
    description: string;
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
    hero_images?: string[];
    story_heading_1?: string;
    story_body_1?: string;
    story_banner_image?: string;
    story_heading_2?: string;
    story_body_2?: string;
    sanctuary_gallery?: string[];
    sanctuary_hero_subtitle?: string;
    sanctuary_hero_title?: string;
    sanctuary_hero_description?: string;
    sanctuary_banner_image?: string;
    sanctuary_amenities?: SanctuaryAmenity[];
    // Independent Sanctuary Story Section
    sanctuary_story_heading_1?: string;
    sanctuary_story_body_1?: string;
    sanctuary_story_heading_2?: string;
    sanctuary_story_body_2?: string;
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

    return {
        id: 'default',
        site_name: 'SEAVIEW',
        logo_url: '',
        hero_subtitle: 'MODERN FILIPINO COASTAL SANCTUARY',
        hero_title: 'Bamboo, Capiz & Unbroken Ocean Views.',
        hero_description: 'Handcrafted beachfront Kubo villas blending ancestral Philippine architecture with modern minimalist luxury.',
        reserve_button_text: 'Reserve Villa',
        nav_links: [
            { label: 'Kubo Villas', href: '/villas' },
            { label: 'The Sanctuary', href: '/sanctuary' },
            { label: 'Al Fresco Dining', href: '/#dining' },
        ],
        footer_address: 'Coastal Highway, Philippines',
        footer_phone: '+63 912 345 6789',
        footer_email: 'reservations@seaviewkubo.com',
        footer_watermark: 'SEAVIEW',
        hero_images: [],
        story_heading_1: "More than a stay — It's the Seaview Coastal Experience.",
        story_body_1: "Nestled along the pristine shores of the Philippines, Seaview offers a fresh take on modern beachfront luxury.",
        story_banner_image: "",
        story_heading_2: "Step inside and discover a modern sanctuary — where heritage meets seaside tranquility.",
        story_body_2: "Whether you are seeking a romantic weekend getaway, a peaceful solo retreat, or an unforgettable family vacation, Seaview is your home by the ocean.",
        sanctuary_gallery: [],
        sanctuary_hero_subtitle: 'Coastal Wellness & Peace',
        sanctuary_hero_title: 'The Seaview Sanctuary',
        sanctuary_hero_description: 'Unwind in a secluded beachfront haven where natural sea salt breezes, bamboo architecture, and tranquil tide pools rejuvenate your senses.',
        sanctuary_banner_image: '',
        sanctuary_amenities: [],
        sanctuary_story_heading_1: 'Your Next Unforgettable Family Beachfront Staycation.',
        sanctuary_story_body_1: 'Escape to the serene shores of Seaside Laois, Labrador, Pangasinan. At Seaview Cabins, we offer a safe, kid-friendly environment designed to give your family the ultimate beach getaway. Unwind in comfort while the little ones make unforgettable memories by the sand and sea.',
        sanctuary_story_heading_2: 'Step inside and discover a modern sanctuary — where heritage meets seaside tranquility.',
        sanctuary_story_body_2: 'Whether you are seeking a romantic weekend getaway, a peaceful solo retreat, or an unforgettable family vacation, Seaview is your home by the ocean.',
    };
}