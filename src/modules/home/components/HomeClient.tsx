'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Header } from '@/modules/shared/components/Header';
import { Footer } from '@/modules/shared/components/Footer';
import { BrandIcon } from '@/modules/shared/components/BrandIcon';
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
const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80';

interface HomeClientProps {
    initialRooms: Room[];
    settings: SiteSettings;
}

export function HomeClient({ initialRooms, settings }: HomeClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const [showTideMask, setShowTideMask] = useState(true);

    const allRoomImages = initialRooms.flatMap((room) => room.images || []).filter(Boolean);
    const heroImages = (settings.hero_images && settings.hero_images.length > 0)
        ? settings.hero_images
        : (allRoomImages.length > 0 ? allRoomImages : DEFAULT_HERO_IMAGES);

    const storyBanner = settings.story_banner_image || heroImages[0] || DEFAULT_STORY_BANNER;

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTideMask(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (heroImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 9000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

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
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between scroll-smooth relative overflow-x-hidden">

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
                <Header settings={settings} />

                <div className="bg-[#1c120c] text-[#faf7f2]">
                    <section id="hero" className="bg-[#1c120c] text-[#faf7f2] pt-16 pb-20 px-4 text-center relative overflow-hidden min-h-[540px] sm:min-h-[640px] flex flex-col justify-center">
                        {heroImages.length > 0 && (
                            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                                {heroImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 transition-all duration-[2500ms] ease-in-out ${
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
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1c120c] via-[#1c120c]/40 to-[#1c120c]/65" />
                            </div>
                        )}

                        <div className="max-w-4xl mx-auto space-y-5 relative z-10">
                            {/* Badge */}
                            <div className="animate-tide-text-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#c89349] inline-flex items-center gap-2 bg-[#1c120c]/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#c89349]/40 shadow-lg">
                  <BrandIcon iconName={settings.site_icon} className="w-3.5 h-3.5 text-[#c89349]" />
                  <span>{settings.hero_subtitle}</span>
                </span>
                            </div>

                            {/* Shimmering Title */}
                            <h1 className="animate-tide-text-2 text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight drop-shadow-md">
                <span className="animate-shimmer-text font-normal">
                  {settings.hero_title}
                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="animate-tide-text-3 text-xs sm:text-sm text-[#faf7f2]/90 max-w-xl mx-auto leading-relaxed drop-shadow-sm px-2 font-medium">
                                {settings.hero_description}
                            </p>

                            {/* Availability Bar */}
                            <div className="animate-tide-text-3 pt-4 sm:pt-6">
                                <AvailabilityBar
                                    onFilter={handleFilter}
                                    onReset={handleReset}
                                    isFiltered={isFiltered}
                                    loading={loading}
                                />
                            </div>

                            {/* Slide Controls */}
                            {heroImages.length > 1 && (
                                <div className="animate-tide-text-3 pt-3 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                                        className="p-1.5 rounded-full bg-[#1c120c]/60 backdrop-blur-md text-[#faf7f2] hover:text-[#c89349] transition cursor-pointer border border-[#c89349]/30 hover:scale-110 active:scale-95"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1.5 bg-[#1c120c]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#c89349]/30">
                                        {heroImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentSlide(idx)}
                                                className={`h-1.5 rounded-full transition-all duration-700 cursor-pointer ${
                                                    idx === currentSlide ? 'w-6 bg-[#c89349]' : 'w-1.5 bg-[#faf7f2]/40 hover:bg-[#faf7f2]'
                                                }`}
                                                aria-label={`Slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
                                        className="p-1.5 rounded-full bg-[#1c120c]/60 backdrop-blur-md text-[#faf7f2] hover:text-[#c89349] transition cursor-pointer border border-[#c89349]/30 hover:scale-110 active:scale-95"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* About Us Preview */}
                    <section id="about-preview" className="py-16 sm:py-24 px-6 bg-[#1c120c] border-t border-[#2b1d14]">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-2">
                  <BrandIcon iconName={settings.site_icon} className="w-4 h-4 text-[#c89349]" />
                  <span>About {settings.site_name}</span>
                </span>
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#faf7f2] tracking-tight leading-snug">
                                    {settings.about_title || 'Crafted for Serenity & Luxury'}
                                </h2>
                                <p className="text-xs sm:text-sm text-[#e6c898]/80 leading-relaxed font-light">
                                    {settings.about_story_body || 'Founded with a passion for modern Filipino hospitality, Seaview Resort combines hand-carved local timber, traditional bahay kubo architecture, and minimalist oceanfront luxury.'}
                                </p>
                                <div className="pt-2">
                                    <Link
                                        href="/about"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#c89349] text-[#1c120c] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#b07d37] transition hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                                    >
                                        <span>Read Our Full Story</span>
                                        <ArrowRight className="w-4 h-4 text-[#1c120c]" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-[#e6c898]/30 shadow-xl group cursor-pointer">
                                <Image
                                    src={settings.about_image_url || DEFAULT_ABOUT_IMAGE}
                                    alt={`About ${settings.site_name}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                            </div>
                        </div>
                    </section>

                    {/* Resort Experience Story */}
                    <section id="experience" className="bg-[#1c120c]">
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

                        {storyBanner && (
                            <div className="relative h-[320px] sm:h-[500px] w-full overflow-hidden group">
                                <Image
                                    src={storyBanner}
                                    alt="Seaview Experience Banner"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#1c120c] via-transparent to-[#1c120c]" />
                            </div>
                        )}

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

            <Footer settings={settings} />
        </div>
    );
}