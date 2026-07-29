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
    sanctuary_story_heading_1?: string;
    sanctuary_story_body_1?: string;
    sanctuary_story_heading_2?: string;
    sanctuary_story_body_2?: string;
    villas_title?: string;
    villas_description?: string;
}

// Curated Tropical Luxury Mock Photos for Home Page Fallbacks
const DEFAULT_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
];

const DEFAULT_STORY_BANNER = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80';

// Sanctuary Fallbacks
const DEFAULT_SANCTUARY_BANNER = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';

const DEFAULT_SANCTUARY_GALLERY = [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
];

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 'default')
            .single();

        if (data) {
            return {
                ...data,
                hero_images: (data.hero_images && data.hero_images.length > 0)
                    ? data.hero_images
                    : DEFAULT_HERO_IMAGES,
                story_banner_image: data.story_banner_image || DEFAULT_STORY_BANNER,
                sanctuary_banner_image: data.sanctuary_banner_image || DEFAULT_SANCTUARY_BANNER,
                sanctuary_gallery: (data.sanctuary_gallery && data.sanctuary_gallery.length > 0)
                    ? data.sanctuary_gallery
                    : DEFAULT_SANCTUARY_GALLERY,
            } as SiteSettings;
        }
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
        ],
        footer_address: 'Coastal Highway, Philippines',
        footer_phone: '+63 912 345 6789',
        footer_email: 'reservations@seaviewkubo.com',
        footer_watermark: 'SEAVIEW',
        hero_images: DEFAULT_HERO_IMAGES,
        story_heading_1: "More than a stay — It's the Seaview Coastal Experience.",
        story_body_1: "Nestled along the pristine shores of the Philippines, Seaview offers a fresh take on modern beachfront luxury.",
        story_banner_image: DEFAULT_STORY_BANNER,
        story_heading_2: "Step inside and discover a modern sanctuary — where heritage meets seaside tranquility.",
        story_body_2: "Whether you are seeking a romantic weekend getaway, a peaceful solo retreat, or an unforgettable family vacation, Seaview is your home by the ocean.",
        sanctuary_hero_subtitle: 'Coastal Wellness & Peace',
        sanctuary_hero_title: 'The Seaview Sanctuary',
        sanctuary_hero_description: 'Unwind in a secluded beachfront haven where natural sea salt breezes, bamboo architecture, and tranquil tide pools rejuvenate your senses.',
        sanctuary_banner_image: DEFAULT_SANCTUARY_BANNER,
        sanctuary_gallery: DEFAULT_SANCTUARY_GALLERY,
        sanctuary_amenities: [
            { icon: 'Waves', title: 'Oceanfront Tide Pools', description: 'Immerse in private natural tide pools naturally refreshed by daily ocean breezes.' },
            { icon: 'Sun', title: 'Sunset Yoga Pavilion', description: 'Open-air bamboo deck tailored for sunrise meditation and evening sea-breeze stretches.' },
            { icon: 'Leaf', title: 'Eco-Crafted Sanctuaries', description: 'Built with locally harvested bamboo, capiz shells, and indigenous sustainable materials.' },
        ],
        sanctuary_story_heading_1: 'Your Next Unforgettable Family Beachfront Staycation.',
        sanctuary_story_body_1: 'Escape to the serene shores of Seaside Laois, Labrador, Pangasinan. At Seaview Cabins, we offer a safe, kid-friendly environment designed to give your family the ultimate beach getaway.',
        sanctuary_story_heading_2: 'Step inside and discover a modern sanctuary — where heritage meets seaside tranquility.',
        sanctuary_story_body_2: 'Whether you are seeking a romantic weekend getaway, a peaceful solo retreat, or an unforgettable family vacation, Seaview is your home by the ocean.',
        villas_title: 'Handcrafted Kubo Villas',
        villas_description: 'Explore our executive beachfront suites combining traditional Filipino craftsmanship with modern minimalist luxury.',
    };
}