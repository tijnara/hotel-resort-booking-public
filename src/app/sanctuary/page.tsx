export const dynamic = 'force-dynamic';

import { getRooms } from '@/modules/rooms/services/getRooms';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { SanctuaryClient } from '@/modules/sanctuary/components/SanctuaryClient';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    const siteName = settings.site_name || 'SEAVIEW';

    return {
        title: settings.sanctuary_meta_title?.trim() || `The Sanctuary | ${siteName}`,
        description: 'Discover coastal wellness, ocean breezes, and serene luxury at Seaview Sanctuary.',
    };
}

export default async function SanctuaryPage() {
    const [rooms, settings] = await Promise.all([
        getRooms(),
        getSiteSettings(),
    ]);

    return <SanctuaryClient initialRooms={rooms} settings={settings} />;
}