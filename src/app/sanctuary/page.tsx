export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getRooms } from '@/modules/rooms/services/getRooms';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { SanctuaryClient } from '@/modules/sanctuary/components/SanctuaryClient';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    const siteName = settings.site_name || 'SEAVIEW';

    const title = settings.sanctuary_meta_title?.trim() || `The Sanctuary | ${siteName}`;
    const description = settings.sanctuary_hero_description || 'Discover coastal wellness, ocean breezes, and serene luxury at Seaview Sanctuary.';
    const ogImage = settings.sanctuary_banner_image || settings.sanctuary_gallery?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=630';

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

export default async function SanctuaryPage() {
    const [rooms, settings] = await Promise.all([
        getRooms(),
        getSiteSettings(),
    ]);

    return <SanctuaryClient initialRooms={rooms} settings={settings} />;
}