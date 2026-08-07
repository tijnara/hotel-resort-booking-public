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

export interface PaymentMethodItem {
    id: string;
    name: string;
    account_number: string;
    account_name: string;
    type: 'qr' | 'bank';
    instructions?: string;
}

export interface EmailTemplateItem {
    header_title?: string;
    header_subtitle?: string;
    subject: string;
    status_badge: string;
    heading: string;
    body_text: string;
    footer_text: string;
}

export interface EmailTemplatesSettings {
    request_received: EmailTemplateItem;
    confirmed: EmailTemplateItem;
    cancelled: EmailTemplateItem;
    refunded: EmailTemplateItem;
}

export interface ContactInfoItem {
    id: string;
    title: string;
    value: string;
    subtitle?: string;
    icon?: string;
}

export interface LegalPolicyItem {
    id: string;
    title: string;
    content: string;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface SiteSettings {
    id: string;
    site_name: string;
    meta_title?: string;
    villas_meta_title?: string;
    sanctuary_meta_title?: string;
    contact_meta_title?: string;
    about_meta_title?: string;
    site_icon?: string;
    logo_url: string;

    // 🎨 Hero Background Controls
    contact_hero_bg_type?: 'image' | 'color';
    contact_hero_bg_color?: string;
    contact_banner_image?: string;

    villas_hero_bg_type?: 'image' | 'color';
    villas_hero_bg_color?: string;
    villas_hero_image?: string;

    sanctuary_hero_bg_type?: 'image' | 'color';
    sanctuary_hero_bg_color?: string;
    sanctuary_banner_image?: string;

    // ⚖️ Dynamic Legal & Policy Documents
    legal_policies?: LegalPolicyItem[];

    // ❓ Dynamic FAQ Accordion List
    faqs?: FaqItem[];

    hero_subtitle: string;
    hero_title: string;
    hero_description: string;
    reserve_button_text: string;
    nav_links: NavLinkItem[];
    footer_address: string;
    footer_phone: string;
    footer_email: string;
    footer_watermark: string;
    footer_description?: string;
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
    sanctuary_amenities?: SanctuaryAmenity[];
    sanctuary_story_heading_1?: string;
    sanctuary_story_body_1?: string;
    sanctuary_story_heading_2?: string;
    sanctuary_story_body_2?: string;
    sanctuary_badge_text?: string;
    villas_title?: string;
    villas_description?: string;
    contact_title?: string;
    contact_subtitle?: string;
    contact_landline?: string;
    inquiry_email?: string;
    contact_cards?: ContactInfoItem[];
    about_title?: string;
    about_subtitle?: string;
    about_badge_text?: string;
    about_story_title?: string;
    about_story_body?: string;
    about_mission?: string;
    about_vision?: string;
    about_image_url?: string;
    about_features_subtitle?: string;
    about_features_title?: string;
    about_features?: AboutFeature[];
    admin_tab_names?: Record<string, string>;
    cancellation_reasons?: string[];
    payment_methods?: PaymentMethodItem[];
    email_templates?: EmailTemplatesSettings;
}

const DEFAULT_LEGAL_POLICIES: LegalPolicyItem[] = [
    {
        id: 'cancellation',
        title: 'Cancellation & Refund Policy',
        content: `1. STANDARD CANCELLATION SCHEDULE
• 7 Days or More Before Check-In: Full 100% refund or free date rebooking.
• 3 to 6 Days Before Check-In: 50% refund or rebooking subject to villa availability.
• Less Than 48 Hours Before Check-In: Non-refundable.

2. INCLEMENT WEATHER & FORCE MAJEURE
Rain alone does not qualify for immediate cancellation or refund. However, if an official Typhoon Warning is issued covering Pangasinan or travel routes on your check-in date, guests may rebook their stay within 6 months at no extra charge or request a full refund.`,
    },
    {
        id: 'terms',
        title: 'Terms & Conditions',
        content: `1. GUEST RESPONSIBILITY & PROPERTY CARE
Guests are expected to treat Seaview Kubo Villas, amenities, and oceanfront grounds with care. Any damage caused to property, bamboo furniture, capiz windows, or resort appliances during stay will be assessed and billed to the registered primary guest.

2. CHECK-IN & CHECK-OUT POLICY
Standard Check-In time is 2:00 PM. Standard Check-Out time is 12:00 NN. Early check-in or late check-out is subject to villa availability and prior front desk approval. Valid government-issued ID is required upon arrival.

3. MAXIMUM OCCUPANCY & QUIET HOURS
Each Kubo Villa has a strict maximum guest capacity specified upon booking. Unregistered stayover guests are not permitted. To preserve serenity, quiet hours begin at 10:00 PM nightly across all beachfront grounds.`,
    },
    {
        id: 'privacy',
        title: 'Privacy Policy',
        content: `1. INFORMATION WE COLLECT
Seaview collects guest details (full name, phone number, email address, payment verification receipts) solely to process reservation requests, issue confirmation notices, and assist guest inquiries.

2. DATA PROTECTION & PRIVACY ACT
Your personal information is kept strictly confidential in compliance with the Philippine Data Privacy Act of 2012. We do not sell, share, or distribute guest data to third-party marketing services.

3. PAYMENT VERIFICATION
Uploaded GCash or bank payment screenshots are accessed exclusively by authorized front desk staff to verify stay payments and are securely stored.`,
    },
];

const DEFAULT_FAQS: FaqItem[] = [
    {
        id: 'faq_1',
        question: 'What are the standard Check-In and Check-Out times?',
        answer: 'Standard Check-In time is at 2:00 PM and Check-Out is at 12:00 NN. Early check-in or late check-out is subject to villa availability and prior front desk approval.',
    },
    {
        id: 'faq_2',
        question: 'Are pets allowed inside the Kubo Villas?',
        answer: 'Yes! We are pet-friendly for small to medium breeds. We kindly request guests to keep pets supervised and bring their own pet bedding.',
    },
    {
        id: 'faq_3',
        question: 'Is there a corkage fee for outside food or drinks?',
        answer: 'We do not charge corkage fees for personal snacks or drinks! You are free to bring your own food. Heavy cooking equipment requires prior desk approval.',
    },
    {
        id: 'faq_4',
        question: 'Is secure parking available on resort grounds?',
        answer: 'Yes, we provide free, secure gated parking for all registered staycation guests directly on resort property.',
    },
];

const DEFAULT_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
];

const DEFAULT_STORY_BANNER = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_SANCTUARY_BANNER = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_CONTACT_BANNER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_VILLAS_BANNER = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';

const DEFAULT_SANCTUARY_GALLERY = [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
];

const DEFAULT_CONTACT_CARDS: ContactInfoItem[] = [
    {
        id: 'card_1',
        title: 'Front Desk & Reservations',
        value: '+63 912 345 6789',
        subtitle: 'Available 24/7 for staycation bookings and assistance',
        icon: 'Phone',
    },
    {
        id: 'card_2',
        title: 'Email Inquiries',
        value: 'reservations@seaviewkubo.com',
        subtitle: 'Guaranteed response within 2 hours',
        icon: 'Mail',
    },
    {
        id: 'card_3',
        title: 'Resort Address',
        value: 'Coastal Highway, Pangasinan, Philippines',
        subtitle: 'Main Beachfront Entrance & Reception Desk',
        icon: 'MapPin',
    },
    {
        id: 'card_4',
        title: 'Check-In Hours',
        value: 'Check-In: 2:00 PM | Check-Out: 12:00 NN',
        subtitle: 'Early check-in subject to villa availability',
        icon: 'Clock',
    },
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

const DEFAULT_ADMIN_TAB_NAMES = {
    bookings: 'Reservations & Payments',
    villas: 'Kubo Villas',
    settings: 'Site Content & Branding',
    users: 'Users & Staff',
};

const DEFAULT_PAYMENT_METHODS: PaymentMethodItem[] = [
    {
        id: 'gcash',
        name: 'GCash / Maya',
        account_number: '0917-123-4567',
        account_name: 'SEAVIEW RESORT',
        type: 'qr',
    },
    {
        id: 'bank',
        name: 'Bank Transfer (BDO)',
        account_number: '0012-3456-7890',
        account_name: 'SEAVIEW RESORT',
        type: 'bank',
    },
];

const DEFAULT_EMAIL_TEMPLATES: EmailTemplatesSettings = {
    request_received: {
        header_title: 'SEAVIEW',
        header_subtitle: 'Modern Filipino Kubo Sanctuary',
        subject: 'Booking Request Received #{bookingRef} - Seaview Resort',
        status_badge: 'Status: Pending Desk Review',
        heading: 'Reservation Request Received',
        body_text: 'Mabuhay {guestName}! We have received your staycation request for {roomName}. Our resort desk is currently verifying your payment.',
        footer_text: 'Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines',
    },
    confirmed: {
        header_title: 'SEAVIEW',
        header_subtitle: 'Modern Filipino Kubo Sanctuary',
        subject: '[CONFIRMED] Official Reservation #{bookingRef} - Seaview Resort',
        status_badge: 'Status: Stay Confirmed',
        heading: 'Your Staycation is Confirmed!',
        body_text: 'Great news {guestName}! Your payment has been verified and your stay at {roomName} is officially confirmed.',
        footer_text: 'Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines',
    },
    cancelled: {
        header_title: 'SEAVIEW',
        header_subtitle: 'Modern Filipino Kubo Sanctuary',
        subject: 'Booking Cancelled #{bookingRef} - Seaview Resort',
        status_badge: 'Status: Reservation Cancelled',
        heading: 'Reservation Request Cancelled',
        body_text: 'Dear {guestName}, we regret to inform you that your reservation request for {roomName} has been cancelled by our resort desk.',
        footer_text: 'Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines',
    },
    refunded: {
        header_title: 'SEAVIEW',
        header_subtitle: 'Modern Filipino Kubo Sanctuary',
        subject: 'Refund Processed #{bookingRef} - Seaview Resort',
        status_badge: 'Status: Refund Processed',
        heading: 'Refund Confirmation',
        body_text: 'Dear {guestName}, your refund request for booking #{bookingRef} ({roomName}) has been processed successfully.',
        footer_text: 'Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines',
    },
};

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 'default')
            .single();

        if (data) {
            const siteName = data.site_name || 'SEAVIEW';
            return {
                ...data,
                meta_title: data.meta_title || `${siteName} | Executive Coastal Kubo Villas & Resort`,
                villas_meta_title: data.villas_meta_title || `Kubo Villas | ${siteName}`,
                sanctuary_meta_title: data.sanctuary_meta_title || `The Sanctuary | ${siteName}`,
                contact_meta_title: data.contact_meta_title || `Contact Us | ${siteName}`,
                about_meta_title: data.about_meta_title || `About Us | ${siteName}`,

                // ⚖️ Dynamic Legal Policies Fallback
                legal_policies: (data.legal_policies && data.legal_policies.length > 0) ? data.legal_policies : DEFAULT_LEGAL_POLICIES,

                // ❓ Dynamic FAQs Fallback
                faqs: (data.faqs && data.faqs.length > 0) ? data.faqs : DEFAULT_FAQS,

                // 🎨 Background Settings Fallbacks
                contact_hero_bg_type: data.contact_hero_bg_type || 'image',
                contact_hero_bg_color: data.contact_hero_bg_color || '#1c120c',
                contact_banner_image: data.contact_banner_image || DEFAULT_CONTACT_BANNER,

                villas_hero_bg_type: data.villas_hero_bg_type || 'image',
                villas_hero_bg_color: data.villas_hero_bg_color || '#1c120c',
                villas_hero_image: data.villas_hero_image || DEFAULT_VILLAS_BANNER,

                sanctuary_hero_bg_type: data.sanctuary_hero_bg_type || 'image',
                sanctuary_hero_bg_color: data.sanctuary_hero_bg_color || '#1c120c',
                sanctuary_banner_image: data.sanctuary_banner_image || DEFAULT_SANCTUARY_BANNER,

                site_icon: data.site_icon || 'Palmtree',
                hero_images: (data.hero_images && data.hero_images.length > 0) ? data.hero_images : DEFAULT_HERO_IMAGES,
                story_banner_image: data.story_banner_image || DEFAULT_STORY_BANNER,
                sanctuary_gallery: (data.sanctuary_gallery && data.sanctuary_gallery.length > 0) ? data.sanctuary_gallery : DEFAULT_SANCTUARY_GALLERY,
                inquiry_email: data.inquiry_email || 'aranjitarchita@gmail.com',
                contact_cards: (data.contact_cards && data.contact_cards.length > 0) ? data.contact_cards : DEFAULT_CONTACT_CARDS,
                footer_watermark: (data.footer_watermark && data.footer_watermark.trim() !== '') ? data.footer_watermark : siteName,
                footer_description: data.footer_description || 'Executive coastal Kubo suites where traditional Filipino craftsmanship meets contemporary beachfront luxury.',
                about_badge_text: data.about_badge_text || `Discover ${siteName}`,
                about_title: data.about_title || 'Crafted for Serenity & Comfort',
                about_subtitle: data.about_subtitle || 'A beachfront staycation tucked away along the pristine coastal waters of Pangasinan.',
                about_story_title: data.about_story_title || 'The Seaview Story',
                about_story_body: data.about_story_body || 'Founded with a passion for modern coastal relaxation, Seaview Cabins combines clean minimalist aesthetics with cozy beachside warmth.',
                about_mission: data.about_mission || 'To deliver clean, cozy, and kid-friendly beachfront staycations with authentic local warmth and exceptional service.',
                about_vision: data.about_vision || 'To be Pangasinans premier beachside destination for memorable family getaways, slow coastal living, and relaxing sunset retreats.',
                about_image_url: data.about_image_url || DEFAULT_ABOUT_IMAGE,
                about_features_subtitle: data.about_features_subtitle || 'WHY CHOOSE US',
                about_features_title: data.about_features_title || 'The Seaview Difference',
                about_features: (data.about_features && data.about_features.length > 0) ? data.about_features : DEFAULT_ABOUT_FEATURES,
                sanctuary_badge_text: data.sanctuary_badge_text || 'Modern Beachfront Staycation',
                admin_tab_names: data.admin_tab_names || DEFAULT_ADMIN_TAB_NAMES,
                payment_methods: (data.payment_methods && data.payment_methods.length > 0) ? data.payment_methods : DEFAULT_PAYMENT_METHODS,
                email_templates: data.email_templates || DEFAULT_EMAIL_TEMPLATES,
            } as SiteSettings;
        }
    } catch (err) {
        console.error('Failed to fetch site settings:', err);
    }

    return {
        id: 'default',
        site_name: 'SEAVIEW',
        meta_title: 'SEAVIEW | Executive Coastal Kubo Villas & Resort',
        villas_meta_title: 'Kubo Villas | SEAVIEW',
        sanctuary_meta_title: 'The Sanctuary | SEAVIEW',
        contact_meta_title: 'Contact Us | SEAVIEW',
        about_meta_title: 'About Us | SEAVIEW',

        legal_policies: DEFAULT_LEGAL_POLICIES,
        faqs: DEFAULT_FAQS,

        contact_hero_bg_type: 'image',
        contact_hero_bg_color: '#1c120c',
        contact_banner_image: DEFAULT_CONTACT_BANNER,

        villas_hero_bg_type: 'image',
        villas_hero_bg_color: '#1c120c',
        villas_hero_image: DEFAULT_VILLAS_BANNER,

        sanctuary_hero_bg_type: 'image',
        sanctuary_hero_bg_color: '#1c120c',
        sanctuary_banner_image: DEFAULT_SANCTUARY_BANNER,

        site_icon: 'Palmtree',
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
        footer_description: 'Executive coastal Kubo suites where traditional Filipino craftsmanship meets contemporary beachfront luxury.',
        hero_images: DEFAULT_HERO_IMAGES,
        story_heading_1: "More than a stay — It's the Seaview Coastal Experience.",
        story_body_1: "Nestled along the pristine shores of the Philippines, Seaview offers a fresh take on modern beachfront luxury.",
        story_banner_image: DEFAULT_STORY_BANNER,
        story_heading_2: "Step inside and discover a modern sanctuary — where heritage meets seaside tranquility.",
        story_body_2: "Whether you are seeking a romantic weekend getaway, a peaceful solo retreat, or an unforgettable family vacation, Seaview is your home by the ocean.",
        sanctuary_hero_subtitle: 'Coastal Wellness & Peace',
        sanctuary_hero_title: 'The Seaview Sanctuary',
        sanctuary_hero_description: 'Unwind in a secluded beachfront haven where natural sea salt breezes, bamboo architecture, and tranquil tide pools rejuvenate your senses.',
        sanctuary_gallery: DEFAULT_SANCTUARY_GALLERY,
        sanctuary_amenities: [
            { icon: 'Waves', title: 'Oceanfront Tide Pools', description: 'Immerse in private natural tide pools naturally refreshed by daily ocean breezes.' },
            { icon: 'Sun', title: 'Sunset Yoga Pavilion', description: 'Open-air bamboo deck tailored for sunrise meditation and evening sea-breeze stretches.' },
            { icon: 'Leaf', title: 'Eco-Crafted Sanctuaries', description: 'Built with locally harvested bamboo, capiz shells, and indigenous sustainable materials.' },
        ],
        sanctuary_badge_text: 'Modern Beachfront Staycation',
        villas_title: 'Handcrafted Kubo Villas',
        villas_description: 'Explore our executive beachfront suites combining traditional Filipino craftsmanship with modern minimalist luxury.',
        contact_title: 'Connect with Our Resort Desk',
        contact_subtitle: 'We are here to assist with your beachfront villa reservations, private staycations, and custom coastal experience inquiries.',
        contact_landline: '(075) 632-8888',
        inquiry_email: 'aranjitarchita@gmail.com',
        contact_cards: DEFAULT_CONTACT_CARDS,
        about_badge_text: 'Discover SEAVIEW',
        about_title: 'Crafted for Serenity & Comfort',
        about_subtitle: 'A beachfront staycation tucked away along the pristine coastal waters of Pangasinan.',
        about_story_title: 'The Seaview Story',
        about_story_body: 'Founded with a passion for modern coastal relaxation, Seaview Cabins combines clean minimalist aesthetics with cozy beachside warmth.',
        about_mission: 'To deliver clean, cozy, and kid-friendly beachfront staycations with authentic local warmth and exceptional service.',
        about_vision: 'To be Pangasinans premier beachside destination for memorable family getaways, slow coastal living, and relaxing sunset retreats.',
        about_image_url: DEFAULT_ABOUT_IMAGE,
        about_features_subtitle: 'WHY CHOOSE US',
        about_features_title: 'The Seaview Difference',
        about_features: DEFAULT_ABOUT_FEATURES,
        admin_tab_names: DEFAULT_ADMIN_TAB_NAMES,
        payment_methods: DEFAULT_PAYMENT_METHODS,
        email_templates: DEFAULT_EMAIL_TEMPLATES,
    };
}