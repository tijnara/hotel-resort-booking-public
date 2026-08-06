export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { ContactClient } from '@/modules/contact/components/ContactClient';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    const siteName = settings.site_name || 'SEAVIEW';

    const title = settings.contact_meta_title?.trim() || `Contact Us | ${siteName}`;
    const description = settings.contact_subtitle || 'Connect with our resort desk for beachfront villa reservations, private stays, and guest assistance.';
    const ogImage = settings.contact_banner_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=630';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function ContactPage() {
    const settings = await getSiteSettings();
    return <ContactClient settings={settings} />;
}