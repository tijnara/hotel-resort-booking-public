'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Waves } from 'lucide-react';

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
                    ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white'
                    : 'bg-slate-950 text-white'
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-widest text-lg uppercase">
                    <Waves className="w-5 h-5 text-cyan-400" />
                    <span>SEAVIEW</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    <Link href="#rooms" className="hover:text-cyan-400 transition">Stays</Link>
                    <Link href="#experience" className="hover:text-cyan-400 transition">Experience</Link>
                    <Link href="#dining" className="hover:text-cyan-400 transition">Dining</Link>
                    <Link href="#location" className="hover:text-cyan-400 transition">Location</Link>
                </nav>

                {/* Desktop CTA */}
                <Link
                    href="#booking"
                    className="hidden md:inline-flex bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition"
                >
                    Book Stay
                </Link>

                {/* Mobile Hamburger (Target minimum 48x48px) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden min-w-[48px] min-h-[48px] flex items-center justify-end text-slate-200 active:text-white"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden fixed inset-x-0 top-16 bg-slate-950 border-b border-slate-800 px-6 py-8 h-[calc(100vh-4rem)] flex flex-col justify-between animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col space-y-6 text-xl font-light tracking-wide text-slate-200">
                        <Link href="#rooms" onClick={() => setIsOpen(false)}>Stays & Villas</Link>
                        <Link href="#experience" onClick={() => setIsOpen(false)}>The Experience</Link>
                        <Link href="#dining" onClick={() => setIsOpen(false)}>Dining & Bar</Link>
                        <Link href="#location" onClick={() => setIsOpen(false)}>Location</Link>
                    </nav>

                    <Link
                        href="#booking"
                        onClick={() => setIsOpen(false)}
                        className="w-full h-14 bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest rounded-xl flex items-center justify-center text-xs"
                    >
                        Check Availability
                    </Link>
                </div>
            )}
        </header>
    );
}