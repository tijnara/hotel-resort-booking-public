'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Heart, ShieldCheck, ArrowRight, MapPin, Phone, Mail, Laptop, Sun, Waves, Leaf, Wind, Home, Droplets, Menu, X } from 'lucide-react';
import { BrandIcon } from '@/modules/shared/components/BrandIcon';
import type { SiteSettings, NavLinkItem } from '@/modules/settings/services/getSettings';

export function AboutClient({ settings }: { settings: SiteSettings }) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dynamic Icon Renderer for Feature Cards
    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#c89349]" />;
            case 'Palmtree': return <BrandIcon iconName="Palmtree" className="w-6 h-6 text-[#c89349]" />;
            case 'Heart': return <Heart className="w-6 h-6 text-[#c89349]" />;
            case 'Compass': return <Compass className="w-6 h-6 text-[#c89349]" />;
            case 'Sun': return <Sun className="w-6 h-6 text-[#c89349]" />;
            case 'Waves': return <Waves className="w-6 h-6 text-[#c89349]" />;
            case 'Leaf': return <Leaf className="w-6 h-6 text-[#c89349]" />;
            case 'Wind': return <Wind className="w-6 h-6 text-[#c89349]" />;
            case 'Droplets': return <Droplets className="w-6 h-6 text-[#c89349]" />;
            case 'Home': return <Home className="w-6 h-6 text-[#c89349]" />;
            default: return <BrandIcon iconName={iconName} className="w-6 h-6 text-[#c89349]" />;
        }
    };

    const navLinks: NavLinkItem[] = (settings.nav_links && settings.nav_links.length > 0)
        ? settings.nav_links
        : [
            { label: 'Kubo Villas', href: '/villas' },
            { label: 'About Us', href: '/about' },
            { label: 'The Sanctuary', href: '/sanctuary' },
            { label: 'Contact Us', href: '/contact' },
        ];

    const features = (settings.about_features && settings.about_features.length > 0)
        ? settings.about_features
        : [
            {
                icon: 'ShieldCheck',
                title: 'Eco-Conscious Architecture',
                description: 'Built with sustainably sourced local timber and traditional bamboo weaving for natural coastal ventilation.',
            },
            {
                icon: 'Palmtree',
                title: 'Private Oceanfront Access',
                description: 'Enjoy peaceful beachfront views far from crowded commercial tourist strips.',
            },
            {
                icon: 'Heart',
                title: 'Warm Filipino Hospitality',
                description: 'Our front desk and resort staff provide personalized service to make every stay feel like home.',
            },
        ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        setIsMobileMenuOpen(false);

        if (href === '#villas' || href === '/villas' || href.includes('villas')) {
            e.preventDefault();
            router.push('/villas');
            return;
        }
        if (href === '#about' || href === '/about' || href.includes('about')) {
            e.preventDefault();
            router.push('/about');
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
            router.push('/');
            return;
        }
    };

    const watermarkText = (settings.footer_watermark && settings.footer_watermark.trim() !== '')
        ? settings.footer_watermark
        : (settings.site_name || 'SEAVIEW');

    // 🚀 Dynamic Auto-Fit Font Size Calculation
    const len = Math.max(watermarkText.length, 3);
    const dynamicFontSize = Math.min(210, Math.floor(1100 / (len * 0.62)));

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between">
            <div>
                {/* Sticky Header Navigation */}
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
                            <BrandIcon iconName={settings.site_icon} className="w-5 h-5 sm:w-6 sm:h-6 text-[#c89349]" />
                        )}
                        <span>{settings.site_name}</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#faf7f2]/80">
                        {navLinks.map((link, idx) => (
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
                            {settings.reserve_button_text || 'Reserve Villa'}
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
                            {navLinks.map((link, idx) => (
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
                                {settings.reserve_button_text || 'Reserve Villa'}
                            </a>
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <section className="relative bg-[#1c120c] text-[#faf7f2] pt-20 pb-20 px-6 text-center">
                    <div className="max-w-5xl mx-auto space-y-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c89349] flex items-center justify-center gap-2">
                            <BrandIcon iconName={settings.site_icon} className="w-4 h-4 text-[#c89349]" />
                            <span>{settings.about_badge_text || `Discover ${settings.site_name || 'SEAVIEW'}`}</span>
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#faf7f2]">
                            {settings.about_title || 'Crafted for Serenity & Comfort'}
                        </h1>
                        <p className="text-sm md:text-base text-[#faf7f2]/70 max-w-2xl mx-auto leading-relaxed font-light">
                            {settings.about_subtitle || 'A beachfront staycation tucked away along the pristine coastal waters of Pangasinan.'}
                        </p>
                    </div>
                </section>

                {/* Main Story & Image Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c89349]">Our Heritage</span>
                        <h2 className="text-2xl md:text-4xl font-extrabold text-[#1c120c]">
                            {settings.about_story_title || 'The Seaview Story'}
                        </h2>
                        <p className="text-sm md:text-base text-[#2b1d14]/80 leading-relaxed font-light">
                            {settings.about_story_body}
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/villas"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#2b1d14] transition cursor-pointer"
                            >
                                <span>Explore Our Villas</span>
                                <ArrowRight className="w-4 h-4 text-[#c89349]" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-[#e6c898]/40 shadow-lg">
                        <Image
                            src={settings.about_image_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'}
                            alt={`${settings.site_name || 'Resort'} Grounds`}
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* Mission & Vision Cards */}
                <section className="bg-[#1c120c]/5 py-16 border-y border-[#e6c898]/30">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-3">
                            <Compass className="w-8 h-8 text-[#c89349]" />
                            <h3 className="text-lg font-bold text-[#1c120c]">Our Mission</h3>
                            <p className="text-xs md:text-sm text-[#2b1d14]/75 leading-relaxed">
                                {settings.about_mission}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-3">
                            <Heart className="w-8 h-8 text-[#c89349]" />
                            <h3 className="text-lg font-bold text-[#1c120c]">Our Vision</h3>
                            <p className="text-xs md:text-sm text-[#2b1d14]/75 leading-relaxed">
                                {settings.about_vision}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Dynamic Features Section ("The Seaview Difference") */}
                <section className="max-w-6xl mx-auto px-6 py-16 space-y-12 text-center">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c89349]">
                            {settings.about_features_subtitle || 'WHY CHOOSE US'}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1c120c] mt-1">
                            {settings.about_features_title || 'The Seaview Difference'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-6 bg-white rounded-2xl border border-[#e6c898]/30 space-y-2 shadow-xs">
                                {renderIcon(feature.icon)}
                                <h4 className="font-bold text-sm text-[#1c120c]">{feature.title}</h4>
                                <p className="text-xs text-[#2b1d14]/70 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Dynamic Footer Section */}
            <footer className="bg-[#1c120c] text-[#faf7f2] relative overflow-hidden pt-12 sm:pt-16 pb-8 border-t border-[#2b1d14]">
                {/* Adaptive SVG Watermark Engine */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none overflow-hidden px-2 sm:px-6">
                    <svg
                        viewBox="0 0 1000 220"
                        className="w-full h-full max-h-[180px] sm:max-h-[260px] md:max-h-[320px]"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <text
                            x="50%"
                            y="50%"
                            dominantBaseline="central"
                            textAnchor="middle"
                            fill="#c89349"
                            fontWeight="900"
                            fontSize={dynamicFontSize}
                            letterSpacing="4"
                            className="uppercase font-black"
                        >
                            {watermarkText}
                        </text>
                    </svg>
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
                                    <BrandIcon iconName={settings.site_icon} className="w-6 h-6 text-[#c89349]" />
                                )}
                                <span>{settings.site_name}</span>
                            </div>
                            <p className="text-xs text-[#e6c898]/70 leading-relaxed max-w-sm">
                                {settings.footer_description || 'Executive coastal Kubo suites where traditional Filipino craftsmanship meets contemporary beachfront luxury.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Quick Links</h4>
                            <ul className="space-y-2 text-xs text-[#faf7f2]/80">
                                {navLinks.map((link, idx) => (
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