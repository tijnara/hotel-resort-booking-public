import type { Metadata } from 'next';
import { getRooms } from '@/modules/rooms/services/getRooms';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { VillasClient } from '@/modules/rooms/components/VillasClient';
import { filterAvailableRoomsAction } from '@/modules/rooms/actions/filterRooms';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    const siteName = settings.site_name || 'SEAVIEW';

    const title = settings.villas_meta_title?.trim() || `Kubo Villas | ${siteName}`;
    const description = settings.villas_description || 'Explore and reserve handcrafted beachfront Kubo villas blending ancestral Philippine architecture with modern luxury.';
    const ogImage = settings.villas_hero_image || settings.hero_images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=630';

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

interface VillasPageProps {
    searchParams: Promise<{
        checkIn?: string;
        checkOut?: string;
    }>;
}

export default async function VillasPage({ searchParams }: VillasPageProps) {
    const resolvedSearchParams = await searchParams;
    const checkIn = resolvedSearchParams?.checkIn || '';
    const checkOut = resolvedSearchParams?.checkOut || '';

    const [allRooms, settings] = await Promise.all([
        getRooms(),
        getSiteSettings(),
    ]);

    let displayedRooms = allRooms;
    let isFiltered = false;

    if (checkIn && checkOut) {
        const res = await filterAvailableRoomsAction(checkIn, checkOut);
        if (res.success) {
            displayedRooms = res.rooms;
            isFiltered = true;
        }
    }

    return (
        <VillasClient
            initialRooms={displayedRooms}
            allRooms={allRooms}
            settings={settings}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initiallyFiltered={isFiltered}
        />
    );
}