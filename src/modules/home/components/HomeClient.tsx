'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palmtree, MapPin, Phone, Mail, Laptop } from 'lucide-react';
import { AvailabilityBar } from '@/modules/rooms/components/AvailabilityBar';
import { RoomCarousel } from '@/modules/rooms/components/RoomCarousel';
import { filterAvailableRoomsAction } from '@/modules/rooms/actions/filterRooms';
import type { Room } from '@/modules/shared/types/database.types';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface HomeClientProps {
    initialRooms: Room[];
    settings: SiteSettings;
}

export function HomeClient({ initialRooms, settings }: HomeClientProps) {
    const [displayedRooms, setDisplayedRooms] = useState<Room[]>(initialRooms);
    const [loading, setLoading] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);

    const handleFilter = async (checkIn: string, checkOut: string) => {
        setLoading(true);
        const res = await filterAvailableRoomsAction(checkIn, checkOut);
        setLoading(false);

        if (res.success) {
            setDisplayedRooms(res.rooms);
            setIsFiltered(true);
            document.getElementById('villas')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleReset = () => {
        setDisplayedRooms(initialRooms);
        setIsFiltered(false);
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between">
            <div>
                {/* Sticky Navigation Header */}
                <header className="sticky top-0 z-40 bg-[#1c120c]/95 backdrop-blur-md text-[#faf7f2] px-6 h-20 flex items-center justify-between border-b border-[#2b1d14] shadow-lg transition-all duration-300">
                    <Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-xl uppercase text-[#faf7f2]">
                        {settings.logo_url ? (
                            <div className="relative w-8 h-8">
                                <Image src={settings.logo_url} alt={settings.site_name} fill className="object-contain" />
                            </div>
                        ) : (
                            <Palmtree className="w-6 h-6 text-[#c89349]" />
                        )}
                        <span>{settings.site_name}</span>
                    </Link>

                    {/* Dynamic Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#faf7f2]/80">
                        {settings.nav_links.map((link, idx) => (
                            <a key={idx} href={link.href} className="hover:text-[#c89349] transition">
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Dynamic Reserve Button */}
                    <a
                        href="#villas"
                        className="min-h-[44px] px-6 bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center hover:bg-[#b07d37] transition active:scale-95"
                    >
                        {settings.reserve_button_text}
                    </a>
                </header>

                {/* Dynamic Hero Section */}
                <section className="bg-[#1c120c] text-[#faf7f2] pt-16 pb-20 px-5 text-center relative overflow-hidden">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#c89349] block">
                            {settings.hero_subtitle}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#faf7f2] leading-tight">
                            {settings.hero_title}
                        </h1>
                        <p className="text-xs md:text-sm text-[#e6c898]/80 max-w-xl mx-auto leading-relaxed">
                            {settings.hero_description}
                        </p>

                        {/* Check Rates Search Bar */}
                        <div className="pt-6">
                            <AvailabilityBar
                                onFilter={handleFilter}
                                onReset={handleReset}
                                isFiltered={isFiltered}
                                loading={loading}
                            />
                        </div>
                    </div>
                </section>

                {/* Accommodations Section */}
                <section id="villas" className="py-16 max-w-7xl mx-auto px-5 scroll-mt-24">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Accommodations</span>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1c120c] mt-1">Handcrafted Kubo Villas</h2>
                        </div>
                        <span className="text-xs text-[#2b1d14]/50 hidden sm:inline">Swipe to view suites →</span>
                    </div>

                    <RoomCarousel rooms={displayedRooms} />
                </section>
            </div>

            {/* Dynamic Footer Section */}
            <footer className="bg-[#1c120c] text-[#faf7f2] relative overflow-hidden pt-16 pb-8 border-t border-[#2b1d14] mt-20">
                {/* Dynamic Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none overflow-hidden">
                    <span className="text-[110px] sm:text-[180px] md:text-[240px] font-black tracking-widest text-[#c89349] uppercase whitespace-nowrap">
                        {settings.footer_watermark || settings.site_name}
                    </span>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column 1: Brand Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 font-bold tracking-widest text-xl uppercase text-[#faf7f2]">
                                {settings.logo_url ? (
                                    <div className="relative w-6 h-6">
                                        <Image src={settings.logo_url} alt={settings.site_name} fill className="object-contain" />
                                    </div>
                                ) : (
                                    <Palmtree className="w-6 h-6 text-[#c89349]" />
                                )}
                                <span>{settings.site_name}</span>
                            </div>
                            <p className="text-xs text-[#e6c898]/70 leading-relaxed max-w-sm">
                                Executive coastal Kubo suites where traditional Filipino craftsmanship meets contemporary beachfront luxury.
                            </p>
                        </div>

                        {/* Column 2: Navigation Links */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Quick Links</h4>
                            <ul className="space-y-2 text-xs text-[#faf7f2]/80">
                                {settings.nav_links.map((link, idx) => (
                                    <li key={idx}>
                                        <a href={link.href} className="hover:text-[#c89349] transition">{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Resort Contact Details */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Resort Desk</h4>
                            <div className="space-y-2 text-xs text-[#faf7f2]/80">
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#c89349]" />
                                    <span>{settings.footer_address}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#c89349]" />
                                    <span>{settings.footer_phone}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#c89349]" />
                                    <span>{settings.footer_email}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar with Computer Icon & Developer Credit */}
                    <div className="pt-8 border-t border-[#2b1d14] flex flex-col sm:flex-row items-center justify-between text-xs text-[#faf7f2]/50 gap-3">
                        <p>© 2026 {settings.site_name}. All rights reserved.</p>
                        <p className="flex items-center gap-1.5 font-medium text-[#c89349]">
                            <Laptop className="w-4 h-4 text-[#c89349]" />
                            <span className="font-bold text-[#faf7f2]">@tijnara</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}