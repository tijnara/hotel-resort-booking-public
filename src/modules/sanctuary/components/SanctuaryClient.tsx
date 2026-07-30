'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palmtree, MapPin, Phone, Mail, Laptop, Waves, Sun, ShieldCheck, Leaf, Wind, Droplets, Heart, ChevronDown, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import type { Room } from '@/modules/shared/types/database.types';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

const ICON_MAP: Record<string, React.ElementType> = {
    Waves, Sun, ShieldCheck, Leaf, Wind, Droplets, Heart
};

const DEFAULT_SANCTUARY_BANNER = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';

const DEFAULT_SANCTUARY_GALLERY = [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80',
];

interface SanctuaryClientProps {
    initialRooms: Room[];
    settings: SiteSettings;
}

export function SanctuaryClient({ initialRooms, settings }: SanctuaryClientProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Collect all Sanctuary gallery images
    const sanctuaryImages = (settings.sanctuary_gallery && settings.sanctuary_gallery.length > 0)
        ? settings.sanctuary_gallery
        : DEFAULT_SANCTUARY_GALLERY;

    const storyBanner = settings.sanctuary_banner_image || sanctuaryImages[0] || DEFAULT_SANCTUARY_BANNER;

    // Slideshow State
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (sanctuaryImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sanctuaryImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [sanctuaryImages.length]);

    const [visiblePhotos, setVisiblePhotos] = useState(12);

    const loadMorePhotos = () => {
        setVisiblePhotos((prev) => prev + 12);
    };

    const amenitiesList = settings.sanctuary_amenities || [];

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between scroll-smooth">
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

                    {/* Desktop Navigation Links */}
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

                {/* Unified Continuous Dark Section */}
                <div className="bg-[#1c120c] text-[#faf7f2]">
                    {/* Hero Section with Full Gallery Slideshow (Same Behavior as Home Page) */}
                    <section id="sanctuary-hero" className="bg-[#1c120c] text-[#faf7f2] pt-16 pb-20 px-4 text-center relative overflow-hidden min-h-[540px] sm:min-h-[620px] flex flex-col justify-center">
                        {sanctuaryImages.length > 0 && (
                            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                                {sanctuaryImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                            idx === currentSlide ? 'opacity-90 scale-105' : 'opacity-0 scale-100'
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Sanctuary Photo ${idx + 1}`}
                                            fill
                                            priority={idx === 0}
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                {/* Balanced Vignette & Soft Gradient for High Photo Visibility + Crisp Text Readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1c120c] via-[#1c120c]/35 to-[#1c120c]/65" />
                            </div>
                        )}

                        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#c89349] inline-flex items-center justify-center gap-2 bg-[#1c120c]/60 backdrop-blur-xs px-4 py-1 rounded-full border border-[#c89349]/30">
                {settings.logo_url ? (
                    <div className="relative w-4 h-4">
                        <Image src={settings.logo_url} alt={settings.site_name} fill className="object-contain" />
                    </div>
                ) : (
                    <Palmtree className="w-4 h-4 text-[#c89349]" />
                )}
                  <span>{settings.sanctuary_hero_subtitle || 'Modern Beachfront Staycation'}</span>
              </span>

                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#faf7f2] leading-tight drop-shadow-md">
                                {settings.sanctuary_hero_title || 'Seaview Cabins'}
                            </h1>
                            <p className="text-xs sm:text-sm text-[#faf7f2]/90 max-w-xl mx-auto leading-relaxed drop-shadow-sm px-2 font-medium">
                                {settings.sanctuary_hero_description || 'Escape to a peaceful beachfront sanctuary. Relax in our modern minimalist villas and enjoy a memorable seaside getaway.'}
                            </p>

                            {/* Interactive Slide Controls */}
                            {sanctuaryImages.length > 1 && (
                                <div className="pt-6 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setCurrentSlide((prev) => (prev - 1 + sanctuaryImages.length) % sanctuaryImages.length)}
                                        className="p-1.5 rounded-full bg-[#1c120c]/60 backdrop-blur-md text-[#faf7f2] hover:text-[#c89349] transition cursor-pointer border border-[#c89349]/30"
                                        aria-label="Previous photo"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1.5 bg-[#1c120c]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#c89349]/30">
                                        {sanctuaryImages.map((_, idx) => (
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
                                        onClick={() => setCurrentSlide((prev) => (prev + 1) % sanctuaryImages.length)}
                                        className="p-1.5 rounded-full bg-[#1c120c]/60 backdrop-blur-md text-[#faf7f2] hover:text-[#c89349] transition cursor-pointer border border-[#c89349]/30"
                                        aria-label="Next photo"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* First Story Card */}
                    <section className="py-12 sm:py-16 px-6 text-center border-t border-[#2b1d14]">
                        <div className="max-w-3xl mx-auto space-y-4">
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight leading-snug text-[#faf7f2]">
                                {settings.sanctuary_story_heading_1 || settings.story_heading_1}
                            </h2>
                            <p className="text-xs md:text-sm text-[#e6c898]/80 leading-relaxed font-light max-w-2xl mx-auto">
                                {settings.sanctuary_story_body_1 || settings.story_body_1}
                            </p>
                        </div>
                    </section>

                    {/* Featured Sanctuary Banner Photo with Feathered Gradients */}
                    {storyBanner && (
                        <section className="relative h-[320px] sm:h-[500px] w-full overflow-hidden">
                            <Image
                                src={storyBanner}
                                alt="Sanctuary Coastal View"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1c120c] via-transparent to-[#1c120c]" />
                        </section>
                    )}

                    {/* Second Story Card */}
                    <section className="py-16 sm:py-24 px-6 text-center relative">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="w-12 h-0.5 bg-[#c89349]/50 mx-auto rounded-full mb-6" />
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight leading-snug text-[#faf7f2]">
                                {settings.sanctuary_story_heading_2 || settings.story_heading_2}
                            </h2>
                            <p className="text-xs md:text-sm text-[#e6c898]/80 leading-relaxed font-light max-w-2xl mx-auto">
                                {settings.sanctuary_story_body_2 || settings.story_body_2}
                            </p>
                        </div>
                    </section>
                </div>

                {/* Dynamic Sanctuary Amenities Grid */}
                {amenitiesList.length > 0 && (
                    <section className="max-w-7xl mx-auto px-6 py-16">
                        <div className="text-center mb-10 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Sanctuary Amenities</span>
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#1c120c]">Designed for Absolute Relaxation</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {amenitiesList.map((amenity, idx) => {
                                const IconComponent = ICON_MAP[amenity.icon] || Palmtree;
                                return (
                                    <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                                        <div className="w-12 h-12 bg-amber-100 text-[#c89349] rounded-2xl flex items-center justify-center">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1c120c]">{amenity.title}</h3>
                                        <p className="text-xs text-[#2b1d14]/70 leading-relaxed">
                                            {amenity.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Sanctuary Gallery Section */}
                {sanctuaryImages.length > 0 && (
                    <section className="bg-white border-t border-[#e6c898]/30 py-16 sm:py-20">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-10 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Visual Tour</span>
                                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1c120c]">The Sanctuary Gallery</h2>
                                <p className="text-xs md:text-sm text-[#2b1d14]/70 max-w-lg mx-auto leading-relaxed">
                                    Catch a glimpse of the serene corners, striking architecture, and breathtaking ocean views that await you.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                                {sanctuaryImages.slice(0, visiblePhotos).map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="relative aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden group shadow-sm bg-[#faf7f2] cursor-pointer"
                                    >
                                        <Image
                                            src={img}
                                            alt={`Sanctuary Moment ${idx + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                        />
                                        <div className="absolute inset-0 bg-[#1c120c]/0 group-hover:bg-[#1c120c]/10 transition-colors duration-500" />
                                    </div>
                                ))}
                            </div>

                            {visiblePhotos < sanctuaryImages.length && (
                                <div className="mt-10 text-center">
                                    <button
                                        onClick={loadMorePhotos}
                                        className="min-h-[48px] px-8 bg-[#faf7f2] border border-[#e6c898]/50 text-[#1c120c] text-xs font-bold uppercase tracking-widest rounded-xl inline-flex items-center gap-2 hover:bg-[#e6c898]/20 transition-colors cursor-pointer"
                                    >
                                        <span>View More Photos</span>
                                        <ChevronDown className="w-4 h-4 text-[#c89349]" />
                                    </button>
                                    <p className="text-[10px] text-[#2b1d14]/50 mt-3 font-medium tracking-wider">
                                        Showing {visiblePhotos} of {sanctuaryImages.length}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {/* Footer */}
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