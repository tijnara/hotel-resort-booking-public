export const dynamic = 'force-dynamic';

import { getRooms } from '@/modules/rooms/services/getRooms';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { SanctuaryClient } from '@/modules/sanctuary/components/SanctuaryClient';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    return {
        title: `The Sanctuary | ${settings.site_name}`,
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