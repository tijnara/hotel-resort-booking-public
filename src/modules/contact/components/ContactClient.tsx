'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Phone, PhoneCall, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendInquiryAction } from '../actions/sendInquiryAction';
import { Header } from '@/modules/shared/components/Header';
import { Footer } from '@/modules/shared/components/Footer';
import { BrandIcon } from '@/modules/shared/components/BrandIcon';
import { FaqSection } from '@/modules/shared/components/FaqSection'; // 👈 Import FaqSection
import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface ContactClientProps {
    settings: SiteSettings;
}

export function ContactClient({ settings }: ContactClientProps) {
    const [showTideMask, setShowTideMask] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Form Fields State
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // Dynamic Hero Background Settings
    const heroBgType = settings?.contact_hero_bg_type || 'image';
    const heroBgColor = settings?.contact_hero_bg_color || '#1c120c';
    const bannerPhoto = settings.contact_banner_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80';

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTideMask(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

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

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between relative overflow-x-hidden">
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
                {/* Shared Header Component */}
                <Header settings={settings} />

                {/* Contact Banner Section */}
                <section
                    className="relative min-h-[380px] sm:min-h-[460px] w-full flex items-center justify-center overflow-hidden transition-colors duration-300"
                    style={{ backgroundColor: heroBgType === 'color' ? heroBgColor : '#1c120c' }}
                >
                    {heroBgType === 'image' && (
                        <>
                            <Image
                                src={bannerPhoto}
                                alt="Resort Front Desk & Entrance"
                                fill
                                priority
                                className="object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1c120c] via-black/40 to-transparent" />
                        </>
                    )}

                    <div className="relative z-10 max-w-2xl mx-4 my-8 p-6 sm:p-10 bg-[#1c120c]/90 backdrop-blur-md rounded-3xl border border-[#c89349]/30 text-center shadow-2xl space-y-3">
                        <div className="animate-tide-text-1">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#c89349] block">
                                Resort Concierge & Guest Relations
                            </span>
                        </div>
                        <h1 className="animate-tide-text-2 text-2xl sm:text-4xl font-light tracking-tight">
                            <span className="animate-shimmer-text">
                                {settings.contact_title || 'Connect with Our Resort Desk'}
                            </span>
                        </h1>
                        <p className="animate-tide-text-3 text-xs sm:text-sm text-[#e6c898]/80 leading-relaxed max-w-lg mx-auto font-light">
                            {settings.contact_subtitle || 'We are here to assist with your beachfront villa reservations, private staycations, and custom coastal experience inquiries.'}
                        </p>
                    </div>
                </section>

                {/* Contact Details & Inquiry Form */}
                <section className="max-w-4xl mx-auto px-5 py-12 space-y-12">
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

                    {/* Form Section */}
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

                {/* ❓ FAQ Accordion Section */}
                <FaqSection faqs={settings.faqs} />
            </div>

            {/* Shared Footer Component */}
            <Footer settings={settings} />
        </div>
    );
}