'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Laptop } from 'lucide-react';
import { BrandIcon } from '@/modules/shared/components/BrandIcon';
import type { SiteSettings, NavLinkItem } from '@/modules/settings/services/getSettings';

interface FooterProps {
    settings: SiteSettings;
    onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export function Footer({ settings, onNavClick }: FooterProps) {
    const navLinks: NavLinkItem[] = (settings.nav_links && settings.nav_links.length > 0)
        ? settings.nav_links
        : [
            { label: 'Kubo Villas', href: '/villas' },
            { label: 'About Us', href: '/about' },
            { label: 'The Sanctuary', href: '/sanctuary' },
            { label: 'Contact Us', href: '/contact' },
        ];

    const watermarkText = (settings.footer_watermark && settings.footer_watermark.trim() !== '')
        ? settings.footer_watermark
        : (settings.site_name || 'SEAVIEW');

    // 🚀 Dynamic Auto-Fit Font Size Calculation
    const len = Math.max(watermarkText.length, 3);
    const dynamicFontSize = Math.min(210, Math.floor(1100 / (len * 0.62)));

    return (
        <footer className="bg-[#1c120c] text-[#faf7f2] relative overflow-hidden pt-12 sm:pt-16 pb-8 border-t border-[#2b1d14]">
            {/* Smart Adaptive SVG Watermark Engine */}
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
                                    <Link
                                        href={link.href}
                                        onClick={(e) => onNavClick && onNavClick(e, link.href)}
                                        className="hover:text-[#c89349] transition cursor-pointer"
                                    >
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
    );
}