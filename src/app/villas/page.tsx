import { getRooms } from '@/modules/rooms/services/getRooms';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { VillasClient } from '@/modules/rooms/components/VillasClient';
import { filterAvailableRoomsAction } from '@/modules/rooms/actions/filterRooms';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    return {
        title: `Kubo Villas | ${settings.site_name}`,
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

    // Filter available rooms on server if checkIn & checkOut are provided
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