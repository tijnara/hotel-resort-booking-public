'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { BrandIcon } from '@/modules/shared/components/BrandIcon';
import type { SiteSettings, NavLinkItem } from '@/modules/settings/services/getSettings';

interface HeaderProps {
    settings?: SiteSettings;
    navLinks?: NavLinkItem[];
}

export function Header({ settings, navLinks }: HeaderProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const links: NavLinkItem[] = (settings?.nav_links && settings.nav_links.length > 0)
        ? settings.nav_links
        : ((navLinks && navLinks.length > 0)
            ? navLinks
            : [
                { label: 'Kubo Villas', href: '/villas' },
                { label: 'About Us', href: '/about' },
                { label: 'The Sanctuary', href: '/sanctuary' },
                { label: 'Contact Us', href: '/contact' },
            ]);

    const siteName = settings?.site_name || 'SEAVIEW';
    const reserveText = settings?.reserve_button_text || 'Reserve Villa';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const isLinkActive = (href: string) => {
        if (!pathname) return false;
        if (href === '/' || href === '') return pathname === '/';
        return pathname === href || pathname.startsWith(href);
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'bg-[#1c120c]/95 backdrop-blur-md border-b border-[#2b1d14] text-[#faf7f2] shadow-lg'
                    : 'bg-[#1c120c] text-[#faf7f2] border-b border-[#2b1d14]'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between relative z-50">
                {/* Brand Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold tracking-widest text-lg sm:text-xl uppercase text-[#faf7f2] hover:opacity-90 transition"
                    onClick={() => setIsOpen(false)}
                >
                    {settings?.logo_url ? (
                        <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                            <Image src={settings.logo_url} alt={siteName} fill className="object-contain" />
                        </div>
                    ) : (
                        <BrandIcon iconName={settings?.site_icon} className="w-5 h-5 sm:w-6 sm:h-6 text-[#c89349]" />
                    )}
                    <span>{siteName}</span>
                </Link>

                {/* Desktop Dynamic Navigation with Active Page Indicators */}
                <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
                    {links.map((item, idx) => {
                        const active = isLinkActive(item.href);
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className={`py-1.5 transition relative flex items-center gap-1.5 ${
                                    active
                                        ? 'text-[#c89349] font-extrabold border-b-2 border-[#c89349]'
                                        : 'text-[#faf7f2]/80 hover:text-[#c89349]'
                                }`}
                            >
                                <span>{item.label}</span>
                                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#c89349] animate-pulse" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop CTA & Mobile Toggle */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/villas"
                        className="hidden sm:flex min-h-[40px] px-5 bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-wider text-xs rounded-xl items-center justify-center hover:bg-[#b07d37] transition active:scale-95 cursor-pointer shadow-md"
                    >
                        {reserveText}
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-[#faf7f2] hover:text-[#c89349] transition focus:outline-none cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {isOpen ? <X className="w-6 h-6 text-[#c89349]" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer with Active Indicators */}
            {isOpen && (
                <div className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-[#1c120c] text-[#faf7f2] border-t border-[#2b1d14] p-6 flex flex-col justify-between overflow-y-auto z-40 animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col gap-5 pt-2">
                        {links.map((item, idx) => {
                            const active = isLinkActive(item.href);
                            return (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-base font-bold uppercase tracking-widest transition border-b border-[#2b1d14] pb-4 flex items-center justify-between ${
                                        active
                                            ? 'text-[#c89349] font-extrabold'
                                            : 'text-[#faf7f2] hover:text-[#c89349]'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {active && <span className="w-2 h-2 rounded-full bg-[#c89349]" />}
                                        <span>{item.label}</span>
                                    </span>
                                    <span className="text-[#c89349] text-xs font-bold">{active ? '• ACTIVE' : '→'}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-8 pb-6">
                        <Link
                            href="/villas"
                            onClick={() => setIsOpen(false)}
                            className="w-full min-h-[50px] bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center hover:bg-[#b07d37] transition shadow-lg active:scale-95 cursor-pointer"
                        >
                            {reserveText}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}