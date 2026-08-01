'use client';

import { useState, useEffect } from 'react';
import { AvailabilityBar } from '@/modules/rooms/components/AvailabilityBar';
import { RoomCarousel } from '@/modules/rooms/components/RoomCarousel';
import { filterAvailableRoomsAction } from '@/modules/rooms/actions/filterRooms';
import { Header } from '@/modules/shared/components/Header';
import { Footer } from '@/modules/shared/components/Footer';
import { BrandIcon } from '@/modules/shared/components/BrandIcon';
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
    const [showTideMask, setShowTideMask] = useState(true);
    const [displayedRooms, setDisplayedRooms] = useState<Room[]>(initialRooms);
    const [loading, setLoading] = useState(false);
    const [isFiltered, setIsFiltered] = useState(initiallyFiltered);

    // Auto-hide Tidal Wave Curtain Mask
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTideMask(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

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
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between relative overflow-x-hidden">
            {/* 🌊 1. Tidal Wave Sweep Mask */}
            {showTideMask && (
                <div className="fixed inset-0 z-50 bg-[#1c120c] animate-tide-curtain pointer-events-none flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <BrandIcon iconName={settings.site_icon} className="w-8 h-8 text-[#c89349]" />
                        <span className="text-2xl font-black tracking-widest text-[#faf7f2] uppercase">
                            {settings.site_name || 'SEAVIEW'}
                        </span>
                    </div>
                </div>
            )}

            <div>
                {/* Shared Active-Aware Header */}
                <Header settings={settings} />

                {/* 🌅 Matching Resort Hero Banner */}
                <section className="relative bg-[#1c120c] text-[#faf7f2] pt-20 pb-20 px-6 text-center overflow-hidden">
                    <div className="max-w-4xl mx-auto space-y-5 relative z-10">
                        {/* Stagger 1: Subtitle Badge */}
                        <div className="animate-tide-text-1">
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#c89349] inline-flex items-center gap-2 bg-[#1c120c]/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#c89349]/40 shadow-lg">
                                <BrandIcon iconName={settings.site_icon} className="w-3.5 h-3.5 text-[#c89349]" />
                                <span>Accommodations</span>
                            </span>
                        </div>

                        {/* Stagger 2: Title with Metallic Gold Shimmer */}
                        <h1 className="animate-tide-text-2 text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight drop-shadow-md">
                            <span className="animate-shimmer-text font-normal">
                                {settings?.villas_title || 'Handcrafted Kubo Villas'}
                            </span>
                        </h1>

                        {/* Stagger 3: Description */}
                        <p className="animate-tide-text-3 text-xs sm:text-sm text-[#faf7f2]/90 max-w-xl mx-auto leading-relaxed drop-shadow-sm px-2 font-medium">
                            {settings?.villas_description || 'Explore our executive beachfront suites combining traditional Filipino craftsmanship with modern minimalist luxury.'}
                        </p>

                        {/* Stagger 4: Availability Filter Bar Embedded in Hero */}
                        <div className="animate-tide-text-3 pt-4 sm:pt-6">
                            <AvailabilityBar
                                onFilter={handleFilter}
                                onReset={handleReset}
                                isFiltered={isFiltered}
                                loading={loading}
                                initialCheckIn={initialCheckIn}
                                initialCheckOut={initialCheckOut}
                            />
                        </div>
                    </div>
                </section>

                {/* Accommodations Main Room Carousel Section */}
                <main className="py-16 max-w-7xl mx-auto px-5">
                    <RoomCarousel rooms={displayedRooms} />
                </main>
            </div>

            {/* Shared Reusable Footer */}
            <Footer settings={settings} />
        </div>
    );
}