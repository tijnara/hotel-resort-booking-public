'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Palmtree, MapPin, Phone, Mail, Laptop, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { AvailabilityBar } from '@/modules/rooms/components/AvailabilityBar';
import { filterAvailableRoomsAction } from '@/modules/rooms/actions/filterRooms';
import type { Room } from '@/modules/shared/types/database.types';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

const DEFAULT_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
];

const DEFAULT_STORY_BANNER = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80';

interface HomeClientProps {
    initialRooms: Room[];
    settings: SiteSettings;
}

export function HomeClient({ initialRooms, settings }: HomeClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const allRoomImages = initialRooms.flatMap((room) => room.images || []).filter(Boolean);
    const heroImages = (settings.hero_images && settings.hero_images.length > 0)
        ? settings.hero_images
        : (allRoomImages.length > 0 ? allRoomImages : DEFAULT_HERO_IMAGES);

    const storyBanner = settings.story_banner_image || heroImages[0] || DEFAULT_STORY_BANNER;

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (heroImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        setIsMobileMenuOpen(false);

        if (href === '#villas' || href === '/villas' || href.includes('villas')) {
            e.preventDefault();
            router.push('/villas');
            return;
        }

        if (href === '#sanctuary' || href === '/sanctuary' || href.includes('sanctuary')) {
            e.preventDefault();
            router.push('/sanctuary');
            return;
        }

        if (href === '#contact' || href === '/contact' || href.includes('contact')) {
            e.preventDefault();
            router.push('/contact');
            return;
        }

        if (href === '/' || href === '#' || href === '') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.replace('#', '');
            const element = document.getElementById(targetId);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handleFilter = async (checkIn: string, checkOut: string) => {
        setLoading(true);
        const res = await filterAvailableRoomsAction(checkIn, checkOut);
        setLoading(false);

        if (res.success) {
            setIsFiltered(true);
            router.push(`/villas?checkIn=${checkIn}&checkOut=${checkOut}`);
        }
    };

    const handleReset = () => {
        setIsFiltered(false);
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between scroll-smooth">
            <div>
                {/* Sticky Header */}
                <header className="sticky top-0 z-50 bg-[#1c120c] text-[#faf7f2] px-4 sm:px-6 h-20 flex items-center justify-between border-b border-[#2b1d14] shadow-lg">
                    <Link
                        href="/"
                        onClick={(e) => handleNavClick(e, '/')}
                        className="flex items-center gap-2 font-bold tracking-widest text-lg sm:text-xl uppercase text-[#faf7f2] hover:opacity-90 transition"
                    >
                        {settings.logo_url ? (
                            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                                <Image src={settings.logo_url} alt={settings.site_name} fill className="object-contain" />
                            </div>
                        ) : (
                            <Palmtree className="w-5 h-5 sm:w-6 sm:h-6 text-[#c89349]" />
                        )}
                        <span>{settings.site_name}</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#faf7f2]/80">
                        {settings.nav_links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="hover:text-[#c89349] transition cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Reserve Button & Mobile Hamburger Toggle */}
                    <div className="flex items-center gap-3">
                        <a
                            href="/villas"
                            onClick={(e) => handleNavClick(e, '/villas')}
                            className="hidden sm:flex min-h-[40px] px-5 bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-wider text-xs rounded-xl items-center justify-center hover:bg-[#b07d37] transition active:scale-95 cursor-pointer shadow-md"
                        >
                            {settings.reserve_button_text}
                        </a>

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
                                <a
                                    key={idx}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-base font-bold uppercase tracking-widest text-[#faf7f2] hover:text-[#c89349] transition border-b border-[#2b1d14] pb-4 flex items-center justify-between"
                                >
                                    <span>{link.label}</span>
                                    <span className="text-[#c89349] text-sm">→</span>
                                </a>
                            ))}
                        </nav>

                        <div className="pt-8 pb-6">
                            <a
                                href="/villas"
                                onClick={(e) => handleNavClick(e, '/villas')}
                                className="w-full min-h-[50px] bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center hover:bg-[#b07d37] transition shadow-lg active:scale-95 cursor-pointer"
                            >
                                {settings.reserve_button_text}
                            </a>
                        </div>
                    </div>
                )}

                {/* Continuous Dark Canvas (Eliminates All White Gaps & Section Dividers) */}
                <div className="bg-[#1c120c] text-[#faf7f2]">
                    {/* Hero Section */}
                    <section id="hero" className="bg-[#1c120c] text-[#faf7f2] pt-16 pb-20 px-4 text-center relative overflow-hidden min-h-[540px] sm:min-h-[620px] flex flex-col justify-center">
                        {heroImages.length > 0 && (
                            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                                {heroImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                            idx === currentSlide ? 'opacity-90 scale-105' : 'opacity-0 scale-100'
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Hero Resort Photo ${idx + 1}`}
                                            fill
                                            priority={idx === 0}
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1c120c] via-[#1c120c]/35 to-[#1c120c]/65" />
                            </div>
                        )}

                        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#c89349] block bg-[#1c120c]/60 backdrop-blur-xs w-fit mx-auto px-4 py-1 rounded-full border border-[#c89349]/30">
                                {settings.hero_subtitle}
                            </span>
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#faf7f2] leading-tight drop-shadow-md">
                                {settings.hero_title}
                            </h1>
                            <p className="text-xs sm:text-sm text-[#faf7f2]/90 max-w-xl mx-auto leading-relaxed drop-shadow-sm px-2 font-medium">
                                {settings.hero_description}
                            </p>

                            <div className="pt-4 sm:pt-6">
                                <AvailabilityBar
                                    onFilter={handleFilter}
                                    onReset={handleReset}
                                    isFiltered={isFiltered}
                                    loading={loading}
                                />
                            </div>

                            {heroImages.length > 1 && (
                                <div className="pt-3 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                                        className="p-1.5 rounded-full bg-[#1c120c]/60 backdrop-blur-md text-[#faf7f2] hover:text-[#c89349] transition cursor-pointer border border-[#c89349]/30"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1.5 bg-[#1c120c]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#c89349]/30">
                                        {heroImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentSlide(idx)}
                                                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                                                    idx === currentSlide ? 'w-6 bg-[#c89349]' : 'w-1.5 bg-[#faf7f2]/40 hover:bg-[#faf7f2]'
                                                }`}
                                                aria-label={`Slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
                                        className="p-1.5 rounded-full bg-[#1c120c]/60 backdrop-blur-md text-[#faf7f2] hover:text-[#c89349] transition cursor-pointer border border-[#c89349]/30"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Seamless Resort Story Section */}
                    <section id="experience" className="bg-[#1c120c]">
                        {/* Top Story Card */}
                        <div className="py-16 sm:py-24 px-6 text-center">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight leading-snug text-[#faf7f2]">
                                    {settings.story_heading_1 || "More than a stay — It's the Seaview Coastal Experience."}
                                </h2>
                                <p className="text-xs sm:text-sm text-[#e6c898]/80 leading-relaxed font-light max-w-2xl mx-auto">
                                    {settings.story_body_1 || "Nestled along the pristine shores of the Philippines, Seaview offers a fresh take on modern beachfront luxury."}
                                </p>
                            </div>
                        </div>

                        {/* Full-Bleed Banner Photo with Feathered Top & Bottom Fades */}
                        {storyBanner && (
                            <div className="relative h-[320px] sm:h-[500px] w-full overflow-hidden">
                                <Image
                                    src={storyBanner}
                                    alt="Seaview Experience Banner"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#1c120c] via-transparent to-[#1c120c]" />
                            </div>
                        )}

                        {/* Bottom Story Card with Subtle Gold Divider */}
                        <div className="py-16 sm:py-24 px-6 text-center">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="w-12 h-0.5 bg-[#c89349]/50 mx-auto rounded-full mb-6" />
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight leading-snug text-[#faf7f2]">
                                    {settings.story_heading_2 || "Step inside and discover a modern sanctuary — where heritage meets seaside tranquility."}
                                </h2>
                                <p className="text-xs sm:text-sm text-[#e6c898]/80 leading-relaxed font-light max-w-2xl mx-auto">
                                    {settings.story_body_2 || "Whether you are seeking a romantic weekend getaway, a peaceful solo retreat, or an unforgettable family vacation, Seaview is your home by the ocean."}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Dynamic Footer Section */}
            <footer className="bg-[#1c120c] text-[#faf7f2] relative overflow-hidden pt-12 sm:pt-16 pb-8 border-t border-[#2b1d14]">
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
                                        <a
                                            href={link.href}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                            className="hover:text-[#c89349] transition cursor-pointer"
                                        >
                                            {link.label}
                                        </a>
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