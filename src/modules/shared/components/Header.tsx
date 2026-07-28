'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Palmtree } from 'lucide-react';

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-40 w-full transition-all duration-300 ${
                isScrolled
                    ? 'bg-[#1c120c]/95 backdrop-blur-md border-b border-[#2b1d14] text-[#faf7f2]'
                    : 'bg-[#1c120c] text-[#faf7f2]'
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2.5 font-bold tracking-widest text-lg uppercase text-[#faf7f2]">
                    <Palmtree className="w-5 h-5 text-[#c89349]" />
                    <span>SEAVIEW</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#e6c898]/80">
                    <Link href="#villas" className="hover:text-[#c89349] transition">Kubo Villas</Link>
                    <Link href="#experience" className="hover:text-[#c89349] transition">The Sanctuary</Link>
                    <Link href="#dining" className="hover:text-[#c89349] transition">Al Fresco Dining</Link>
                    <Link href="#location" className="hover:text-[#c89349] transition">Location</Link>
                </nav>

                {/* Desktop CTA */}
                <Link
                    href="#booking"
                    className="hidden md:inline-flex bg-[#c89349] text-[#1c120c] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#b07d37] transition"
                >
                    Reserve Villa
                </Link>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden min-w-[48px] min-h-[48px] flex items-center justify-end text-[#faf7f2] active:text-[#c89349]"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden fixed inset-x-0 top-16 bg-[#1c120c] border-b border-[#2b1d14] px-6 py-8 h-[calc(100vh-4rem)] flex flex-col justify-between animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col space-y-6 text-xl font-light tracking-wide text-[#faf7f2]">
                        <Link href="#villas" onClick={() => setIsOpen(false)}>Kubo Villas & Suites</Link>
                        <Link href="#experience" onClick={() => setIsOpen(false)}>Island Experience</Link>
                        <Link href="#dining" onClick={() => setIsOpen(false)}>Kusina & Bar</Link>
                        <Link href="#location" onClick={() => setIsOpen(false)}>Location</Link>
                    </nav>

                    <Link
                        href="#booking"
                        onClick={() => setIsOpen(false)}
                        className="w-full h-14 bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center text-xs"
                    >
                        Book Your Stay
                    </Link>
                </div>
            )}
        </header>
    );
}