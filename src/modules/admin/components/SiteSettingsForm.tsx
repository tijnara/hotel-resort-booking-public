'use client';

import { useState } from 'react';
import { Save, Loader2, Palette, Home, Info, Camera, Phone, MapPin, ChevronRight } from 'lucide-react';
import { updateSiteSettingsAction } from '../actions/settingsActions';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

import { BrandingSettingsTab } from './settings/BrandingSettingsTab';
import { HomeSettingsTab } from './settings/HomeSettingsTab';
import { AboutSettingsTab } from './settings/AboutSettingsTab';
import { SanctuarySettingsTab } from './settings/SanctuarySettingsTab';
import { ContactSettingsTab } from './settings/ContactSettingsTab';
import { FooterSettingsTab } from './settings/FooterSettingsTab';

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
    const [subTab, setSubTab] = useState<'branding' | 'home' | 'about' | 'sanctuary' | 'contact' | 'footer'>('branding');
    const [formData, setFormData] = useState<SiteSettings>(settings);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const res = await updateSiteSettingsAction(formData);
        setLoading(false);

        if (res.success) {
            setMsg({ type: 'success', text: 'Site settings updated successfully across all pages!' });
        } else {
            setMsg({ type: 'error', text: res.message || 'Failed to update settings.' });
        }
    };

    const navTabs = [
        { id: 'branding', label: 'Branding & Nav', icon: Palette },
        { id: 'home', label: 'Home Page', icon: Home },
        { id: 'about', label: 'About Page', icon: Info },
        { id: 'sanctuary', label: 'The Sanctuary', icon: Camera },
        { id: 'contact', label: 'Contact Page', icon: Phone },
        { id: 'footer', label: 'Footer Info', icon: MapPin },
    ] as const;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto relative">
            {msg && (
                <div className={`p-4 rounded-2xl text-xs font-bold transition-all animate-in fade-in duration-300 ${
                    msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    {msg.text}
                </div>
            )}

            {/* Floating Glass Segmented Tab Bar Container */}
            <div className="sticky top-4 z-30 bg-[#faf7f2]/95 backdrop-blur-xl p-2 rounded-2xl border border-[#e6c898]/40 shadow-sm relative space-y-1.5">
                {/* 📱 Mobile Indicator for Scrollable Sub-Tabs */}
                <div className="flex items-center justify-between sm:hidden text-[10px] font-bold uppercase tracking-widest text-[#c89349] px-1 pt-0.5">
                    <span>Content Sections</span>
                    <span className="flex items-center gap-1 bg-[#c89349]/15 px-2.5 py-1 rounded-full text-[#1c120c]">
                        <span>Swipe tabs</span>
                        <ChevronRight className="w-3.5 h-3.5 animate-pulse text-[#c89349]" />
                    </span>
                </div>

                {/* Horizontal Scrollable Tabs */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-1 py-0.5">
                    {navTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = subTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSubTab(tab.id)}
                                className={`group relative min-h-[42px] px-3.5 sm:px-4 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shrink-0 cursor-pointer ${
                                    isActive
                                        ? 'bg-[#1c120c] text-[#faf7f2] shadow-md scale-[1.02]'
                                        : 'text-[#2b1d14]/70 hover:bg-white/80 hover:text-[#1c120c]'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#c89349]' : 'text-[#c89349]/70 group-hover:text-[#c89349]'}`} />
                                <span>{tab.label}</span>

                                {/* Active Gold Indicator Dot */}
                                {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c89349] animate-pulse ml-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Tab Panel View */}
            <div className="transition-all duration-300">
                {subTab === 'branding' && <BrandingSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'home' && <HomeSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'about' && <AboutSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'sanctuary' && <SanctuarySettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'contact' && <ContactSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'footer' && <FooterSettingsTab formData={formData} setFormData={setFormData} />}
            </div>

            {/* Global Save Action Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] active:scale-[0.99] transition shadow-lg disabled:opacity-50 cursor-pointer border border-[#c89349]/30"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <Save className="w-5 h-5 text-[#c89349]" />
                        <span>Save All Landing Page Changes</span>
                    </>
                )}
            </button>
        </form>
    );
}