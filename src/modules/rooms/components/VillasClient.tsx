'use client';

import { useState } from 'react';
import { AvailabilityBar } from '@/modules/rooms/components/AvailabilityBar';
import { RoomCarousel } from '@/modules/rooms/components/RoomCarousel';
import { filterAvailableRoomsAction } from '@/modules/rooms/actions/filterRooms';
import { Header } from '@/modules/shared/components/Header';
import { Footer } from '@/modules/shared/components/Footer';
import type { Room } from '@/modules/shared/types/database.types';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface VillasClientProps {
    initialRooms: Room[];
    allRooms: Room[];
    settings: SiteSettings;
    initialCheckIn?: string;
    initialCheckOut?: string;
    initiallyFiltered?: boolean;
}

export function VillasClient({
                                 initialRooms,
                                 allRooms,
                                 settings,
                                 initialCheckIn = '',
                                 initialCheckOut = '',
                                 initiallyFiltered = false,
                             }: VillasClientProps) {
    const [displayedRooms, setDisplayedRooms] = useState<Room[]>(initialRooms);
    const [loading, setLoading] = useState(false);
    const [isFiltered, setIsFiltered] = useState(initiallyFiltered);

    const handleFilter = async (checkIn: string, checkOut: string) => {
        setLoading(true);
        const res = await filterAvailableRoomsAction(checkIn, checkOut);
        setLoading(false);

        if (res.success) {
            setDisplayedRooms(res.rooms);
            setIsFiltered(true);
            window.history.replaceState(null, '', `/villas?checkIn=${checkIn}&checkOut=${checkOut}`);
        }
    };

    const handleReset = () => {
        setDisplayedRooms(allRooms);
        setIsFiltered(false);
        window.history.replaceState(null, '', '/villas');
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between">
            <div>
                {/* Shared Reusable Active-Aware Header */}
                <Header settings={settings} />

                {/* Accommodations Main Section */}
                <main className="py-12 max-w-7xl mx-auto px-5">
                    <div className="mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Accommodations</span>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1c120c] mt-1">
                            {settings?.villas_title || 'Handcrafted Kubo Villas'}
                        </h1>
                        <p className="text-xs md:text-sm text-[#2b1d14]/70 mt-2">
                            {settings?.villas_description || 'Explore our executive beachfront suites combining traditional Filipino craftsmanship with modern minimalist luxury.'}
                        </p>
                    </div>

                    <div className="mb-10">
                        <AvailabilityBar
                            onFilter={handleFilter}
                            onReset={handleReset}
                            isFiltered={isFiltered}
                            loading={loading}
                            initialCheckIn={initialCheckIn}
                            initialCheckOut={initialCheckOut}
                        />
                    </div>

                    <RoomCarousel rooms={displayedRooms} />
                </main>
            </div>

            {/* Shared Reusable Footer */}
            <Footer settings={settings} />
        </div>
    );
}