'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palmtree, MapPin, Phone, Mail, Laptop, Menu, X } from 'lucide-react';
import { AvailabilityBar } from '@/modules/rooms/components/AvailabilityBar';
import { RoomCarousel } from '@/modules/rooms/components/RoomCarousel';
import { filterAvailableRoomsAction } from '@/modules/rooms/actions/filterRooms';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                {/* Sticky Header */}
                <header className="sticky top-0 z-50 bg-[#1c120c] text-[#faf7f2] px-4 sm:px-6 h-20 flex items-center justify-between border-b border-[#2b1d14] shadow-lg">
                    <Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-lg sm:text-xl uppercase text-[#faf7f2]">
                        {settings.logo_url ? (
                            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                                <Image src={settings.logo_url} alt={settings.site_name} fill className="object-contain" />
                            </div>
                        ) : (
                            <Palmtree className="w-5 h-5 sm:w-6 sm:h-6 text-[#c89349]" />
                        )}
                        <span>{settings.site_name}</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#faf7f2]/80">
                        {settings.nav_links.map((link, idx) => (
                            <Link key={idx} href={link.href} className="hover:text-[#c89349] transition">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Reserve Button & Hamburger Menu */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/villas"
                            className="hidden sm:flex min-h-[40px] px-5 bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-wider text-xs rounded-xl items-center justify-center hover:bg-[#b07d37] transition shadow-md"
                        >
                            {settings.reserve_button_text}
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-[#faf7f2] hover:text-[#c89349] transition focus:outline-none cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#c89349]" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </header>

                {/* Opaque Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-x-0 top-20 bottom-0 z-50 bg-[#1c120c] text-[#faf7f2] md:hidden flex flex-col justify-between p-6 overflow-y-auto border-t border-[#2b1d14]">
                        <nav className="flex flex-col gap-5 pt-2">
                            {settings.nav_links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-base font-bold uppercase tracking-widest text-[#faf7f2] hover:text-[#c89349] transition border-b border-[#2b1d14] pb-4 flex items-center justify-between"
                                >
                                    <span>{link.label}</span>
                                    <span className="text-[#c89349] text-sm">→</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="pt-8 pb-6">
                            <Link
                                href="/villas"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full min-h-[50px] bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center hover:bg-[#b07d37] transition shadow-lg cursor-pointer"
                            >
                                {settings.reserve_button_text}
                            </Link>
                        </div>
                    </div>
                )}

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

            {/* Footer */}
            <footer className="bg-[#1c120c] text-[#faf7f2] relative overflow-hidden pt-12 sm:pt-16 pb-8 border-t border-[#2b1d14] mt-20">
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none overflow-hidden">
                    <span className="text-[80px] sm:text-[180px] md:text-[240px] font-black tracking-widest text-[#c89349] uppercase whitespace-nowrap">
                        {settings.footer_watermark || settings.site_name}
                    </span>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Quick Links</h4>
                            <ul className="space-y-2 text-xs text-[#faf7f2]/80">
                                {settings.nav_links.map((link, idx) => (
                                    <li key={idx}>
                                        <Link href={link.href} className="hover:text-[#c89349] transition">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

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

                    <div className="pt-6 border-t border-[#2b1d14] flex flex-col sm:flex-row items-center justify-between text-xs text-[#faf7f2]/50 gap-3">
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