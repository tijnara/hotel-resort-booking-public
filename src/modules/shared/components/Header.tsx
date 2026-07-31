'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Palmtree } from 'lucide-react';
import type { NavLinkItem } from '@/modules/settings/services/getSettings';

interface HeaderProps {
    navLinks?: NavLinkItem[];
}

export function Header({ navLinks }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const links: NavLinkItem[] = (navLinks && navLinks.length > 0) ? navLinks : [
        { label: 'Kubo Villas', href: '/villas' },
        { label: 'About Us', href: '/about' },
        { label: 'The Sanctuary', href: '/sanctuary' },
        { label: 'Contact Us', href: '/contact' },
    ];

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

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'bg-[#1c120c]/95 backdrop-blur-md border-b border-[#2b1d14] text-[#faf7f2]'
                    : 'bg-[#1c120c] text-[#faf7f2]'
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between relative z-50">
                {/* Brand Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 font-bold tracking-widest text-lg uppercase text-[#faf7f2]"
                    onClick={() => setIsOpen(false)}
                >
                    <Palmtree className="w-5 h-5 text-[#c89349]" />
                    <span>SEAVIEW</span>
                </Link>

                {/* Desktop Dynamic Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#e6c898]/80">
                    {links.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="hover:text-[#c89349] transition"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <Link
                    href="/villas"
                    className="hidden md:inline-flex bg-[#c89349] text-[#1c120c] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#b07d37] transition"
                >
                    Reserve Villa
                </Link>

                {/* Mobile Hamburger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden min-w-[48px] min-h-[48px] flex items-center justify-center text-[#faf7f2] hover:text-[#c89349] active:text-[#c89349] transition cursor-pointer relative z-50 pointer-events-auto"
                    aria-label="Toggle navigation menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden fixed inset-x-0 top-16 bg-[#1c120c] border-b border-[#2b1d14] px-6 py-8 h-[calc(100vh-4rem)] flex flex-col justify-between animate-in slide-in-from-top duration-200 z-40 overflow-y-auto">
                    <nav className="flex flex-col space-y-6 text-xl font-light tracking-wide text-[#faf7f2]">
                        {links.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <Link
                        href="/villas"
                        onClick={() => setIsOpen(false)}
                        className="w-full h-14 bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center text-xs shadow-lg"
                    >
                        Book Your Stay
                    </Link>
                </div>
            )}
        </header>
    );
}