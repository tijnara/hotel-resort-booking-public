'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palmtree, MapPin, Phone, PhoneCall, Mail, Send, CheckCircle2, Menu, X, Laptop, AlertCircle } from 'lucide-react';
import { sendInquiryAction } from '../actions/sendInquiryAction';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface ContactClientProps {
    settings: SiteSettings;
}

export function ContactClient({ settings }: ContactClientProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Form Fields State
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg(null);

        const res = await sendInquiryAction({
            name,
            contactNumber,
            email,
            message,
        });

        setSubmitting(false);

        if (res.success) {
            setFormSubmitted(true);
            setName('');
            setContactNumber('');
            setEmail('');
            setMessage('');
        } else {
            setErrorMsg(res.message || 'Failed to submit inquiry. Please try again.');
        }
    };

    const bannerPhoto = settings.contact_banner_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80';

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

                {/* Mobile Navigation Drawer */}
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

                {/* Contact Banner Section with Dark Overlay Card */}
                <section className="relative min-h-[380px] sm:min-h-[460px] w-full flex items-center justify-center bg-[#1c120c] overflow-hidden">
                    <Image
                        src={bannerPhoto}
                        alt="Seaview Resort Front Desk & Entrance"
                        fill
                        priority
                        className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c120c] via-black/40 to-transparent" />

                    {/* Floating Dark Card */}
                    <div className="relative z-10 max-w-2xl mx-4 my-8 p-6 sm:p-10 bg-[#1c120c]/90 backdrop-blur-md rounded-3xl border border-[#c89349]/30 text-center shadow-2xl space-y-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#c89349] block">
              Resort Concierge & Guest Relations
            </span>
                        <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-[#faf7f2]">
                            {settings.contact_title || 'Connect with Our Resort Desk'}
                        </h1>
                        <p className="text-xs sm:text-sm text-[#e6c898]/80 leading-relaxed max-w-lg mx-auto font-light">
                            {settings.contact_subtitle || 'We are here to assist with your beachfront villa reservations, private staycations, and custom coastal experience inquiries.'}
                        </p>
                    </div>
                </section>

                {/* Contact Info & Inquiry Form Container */}
                <section className="max-w-4xl mx-auto px-5 py-12 space-y-12">
                    {/* Resort Contact Details Bar */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e6c898]/40 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] block">Location</span>
                                <p className="text-xs font-bold text-[#1c120c] leading-snug">{settings.footer_address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] block">Mobile Hotlines</span>
                                <p className="text-xs font-bold text-[#1c120c] leading-snug">{settings.footer_phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center shrink-0">
                                <PhoneCall className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] block">Landline</span>
                                <p className="text-xs font-bold text-[#1c120c] leading-snug">{settings.contact_landline || '(075) 632-8888'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] block">Email Service</span>
                                <p className="text-xs font-bold text-[#1c120c] leading-snug break-all">{settings.footer_email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Inquiry Form */}
                    <div className="bg-[#1c120c] text-[#faf7f2] p-6 sm:p-10 rounded-3xl shadow-xl border border-[#2b1d14] space-y-6">
                        <div className="text-center space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Guest Service Desk</span>
                            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#faf7f2]">Send Us an Inquiry</h2>
                            <p className="text-xs text-[#e6c898]/70 max-w-md mx-auto">
                                Fill out the form below and our resort coordinator will respond to your request within 24 hours.
                            </p>
                        </div>

                        {errorMsg && (
                            <div className="bg-rose-950/80 border border-rose-500/40 p-4 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {formSubmitted ? (
                            <div className="bg-[#2b1d14] border border-[#c89349]/40 p-8 rounded-2xl text-center space-y-3">
                                <CheckCircle2 className="w-12 h-12 text-[#c89349] mx-auto" />
                                <h3 className="text-lg font-bold text-[#faf7f2]">Inquiry Received!</h3>
                                <p className="text-xs text-[#e6c898]/80 max-w-sm mx-auto leading-relaxed">
                                    Thank you for reaching out. Your message has been sent to our guest service desk at <span className="font-bold text-[#faf7f2]">{settings.inquiry_email || 'aranjitarchita@gmail.com'}</span>.
                                </p>
                                <button
                                    onClick={() => setFormSubmitted(false)}
                                    className="mt-4 px-6 py-2.5 bg-[#c89349] text-[#1c120c] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#b07d37] transition cursor-pointer"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#c89349] uppercase tracking-widest mb-1.5">
                                        Full Name <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Maria Santos"
                                        className="w-full h-12 px-4 bg-[#2b1d14] text-xs font-medium text-[#faf7f2] rounded-xl border border-[#faf7f2]/10 focus:border-[#c89349] outline-none transition"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#c89349] uppercase tracking-widest mb-1.5">
                                            Contact Number <span className="text-rose-400">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            placeholder="+63 912 345 6789"
                                            className="w-full h-12 px-4 bg-[#2b1d14] text-xs font-medium text-[#faf7f2] rounded-xl border border-[#faf7f2]/10 focus:border-[#c89349] outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-[#c89349] uppercase tracking-widest mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="guest@example.com"
                                            className="w-full h-12 px-4 bg-[#2b1d14] text-xs font-medium text-[#faf7f2] rounded-xl border border-[#faf7f2]/10 focus:border-[#c89349] outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#c89349] uppercase tracking-widest mb-1.5">
                                        Message / Special Requests <span className="text-rose-400">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us about your planned check-in dates, group size, or questions about our Kubo villas..."
                                        className="w-full p-4 bg-[#2b1d14] text-xs font-medium text-[#faf7f2] rounded-xl border border-[#faf7f2]/10 focus:border-[#c89349] outline-none resize-none transition leading-relaxed"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-14 bg-[#c89349] text-[#1c120c] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#b07d37] transition shadow-lg disabled:opacity-50 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                                </button>
                            </form>
                        )}
                    </div>
                </section>
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