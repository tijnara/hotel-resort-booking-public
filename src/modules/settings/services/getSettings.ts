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

export interface AboutFeature {
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
    contact_banner_image?: string;
    contact_title?: string;
    contact_subtitle?: string;
    contact_landline?: string;
    inquiry_email?: string;
    // About Page Settings
    about_title?: string;
    about_subtitle?: string;
    about_story_title?: string;
    about_story_body?: string;
    about_mission?: string;
    about_vision?: string;
    about_image_url?: string;
    about_features_subtitle?: string;
    about_features_title?: string;
    about_features?: AboutFeature[];
}

const DEFAULT_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
];

const DEFAULT_STORY_BANNER = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_SANCTUARY_BANNER = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_CONTACT_BANNER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';

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

const DEFAULT_ABOUT_FEATURES: AboutFeature[] = [
    {
        icon: 'ShieldCheck',
        title: 'Eco-Conscious Architecture',
        description: 'Built with sustainably sourced local timber and traditional bamboo weaving for natural coastal ventilation.',
    },
    {
        icon: 'Palmtree',
        title: 'Private Oceanfront Access',
        description: 'Enjoy peaceful beachfront views far from crowded commercial tourist strips.',
    },
    {
        icon: 'Heart',
        title: 'Warm Filipino Hospitality',
        description: 'Our front desk and resort staff provide personalized service to make every stay feel like home.',
    },
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
                hero_images: (data.hero_images && data.hero_images.length > 0) ? data.hero_images : DEFAULT_HERO_IMAGES,
                story_banner_image: data.story_banner_image || DEFAULT_STORY_BANNER,
                sanctuary_banner_image: data.sanctuary_banner_image || DEFAULT_SANCTUARY_BANNER,
                sanctuary_gallery: (data.sanctuary_gallery && data.sanctuary_gallery.length > 0) ? data.sanctuary_gallery : DEFAULT_SANCTUARY_GALLERY,
                contact_banner_image: data.contact_banner_image || DEFAULT_CONTACT_BANNER,
                inquiry_email: data.inquiry_email || 'aranjitarchita@gmail.com',
                about_title: data.about_title || 'Crafted for Serenity & Luxury',
                about_subtitle: data.about_subtitle || 'A sanctuary tucked away along the pristine coastal waters of Pangasinan.',
                about_story_title: data.about_story_title || 'The Seaview Story',
                about_story_body: data.about_story_body || 'Founded with a passion for modern Filipino hospitality, Seaview Resort combines hand-carved local timber, traditional bahay kubo architecture, and minimalist oceanfront luxury. Every suite is designed to reconnect you with nature while providing modern comfort.',
                about_mission: data.about_mission || 'To deliver authentic Filipino warmth and unforgettable beachfront relaxation in an eco-friendly sanctuary.',
                about_vision: data.about_vision || 'To be Pangasinans premier destination for eco-luxury kubo living and coastal wellness.',
                about_image_url: data.about_image_url || DEFAULT_ABOUT_IMAGE,
                about_features_subtitle: data.about_features_subtitle || 'WHY CHOOSE US',
                about_features_title: data.about_features_title || 'The Seaview Difference',
                about_features: (data.about_features && data.about_features.length > 0) ? data.about_features : DEFAULT_ABOUT_FEATURES,
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
            { label: 'About Us', href: '/about' },
            { label: 'The Sanctuary', href: '/sanctuary' },
            { label: 'Contact Us', href: '/contact' },
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
        villas_title: 'Handcrafted Kubo Villas',
        villas_description: 'Explore our executive beachfront suites combining traditional Filipino craftsmanship with modern minimalist luxury.',
        contact_banner_image: DEFAULT_CONTACT_BANNER,
        contact_title: 'Connect with Our Resort Desk',
        contact_subtitle: 'We are here to assist with your beachfront villa reservations, private staycations, and custom coastal experience inquiries.',
        contact_landline: '(075) 632-8888',
        inquiry_email: 'aranjitarchita@gmail.com',
        about_title: 'Crafted for Serenity & Luxury',
        about_subtitle: 'A sanctuary tucked away along the pristine coastal waters of Pangasinan.',
        about_story_title: 'The Seaview Story',
        about_story_body: 'Founded with a passion for modern Filipino hospitality, Seaview Resort combines hand-carved local timber, traditional bahay kubo architecture, and minimalist oceanfront luxury. Every suite is designed to reconnect you with nature while providing modern comfort.',
        about_mission: 'To deliver authentic Filipino warmth and unforgettable beachfront relaxation in an eco-friendly sanctuary.',
        about_vision: 'To be Pangasinans premier destination for eco-luxury kubo living and coastal wellness.',
        about_image_url: DEFAULT_ABOUT_IMAGE,
        about_features_subtitle: 'WHY CHOOSE US',
        about_features_title: 'The Seaview Difference',
        about_features: DEFAULT_ABOUT_FEATURES,
    };
}