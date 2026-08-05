import { getRooms } from '@/modules/rooms/services/getRooms';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { VillasClient } from '@/modules/rooms/components/VillasClient';
import { filterAvailableRoomsAction } from '@/modules/rooms/actions/filterRooms';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    const siteName = settings.site_name || 'SEAVIEW';

    return {
        title: settings.villas_meta_title?.trim() || `Kubo Villas | ${siteName}`,
        description: 'Explore and reserve handcrafted beachfront Kubo villas blending ancestral Philippine architecture with modern luxury.',
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