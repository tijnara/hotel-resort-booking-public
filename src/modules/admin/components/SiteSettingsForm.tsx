'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Save, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import { updateSiteSettingsAction } from '../actions/settingsActions';
import type { SiteSettings, NavLinkItem } from '@/modules/settings/services/getSettings';

interface SiteSettingsFormProps {
    settings: SiteSettings;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [siteName, setSiteName] = useState(settings.site_name || 'SEAVIEW');
    const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');
    const [heroSubtitle, setHeroSubtitle] = useState(settings.hero_subtitle || '');
    const [heroTitle, setHeroTitle] = useState(settings.hero_title || '');
    const [heroDescription, setHeroDescription] = useState(settings.hero_description || '');
    const [reserveButtonText, setReserveButtonText] = useState(settings.reserve_button_text || 'Reserve Villa');
    const [navLinks, setNavLinks] = useState<NavLinkItem[]>(settings.nav_links || []);
    const [footerAddress, setFooterAddress] = useState(settings.footer_address || '');
    const [footerPhone, setFooterPhone] = useState(settings.footer_phone || '');
    const [footerEmail, setFooterEmail] = useState(settings.footer_email || '');
    const [footerWatermark, setFooterWatermark] = useState(settings.footer_watermark || 'SEAVIEW');

    // Handle Logo Upload
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMsg(null);
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const filePath = `branding/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('room-images')
            .upload(filePath, file);

        if (uploadError) {
            setMsg({ type: 'error', text: `Logo upload failed: ${uploadError.message}` });
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
        if (data?.publicUrl) {
            setLogoUrl(data.publicUrl);
        }
        setUploading(false);
    };

    // Nav Links Management
    const handleAddNav = () => {
        setNavLinks([...navLinks, { label: 'New Link', href: '#villas' }]);
    };

    const handleUpdateNav = (index: number, key: 'label' | 'href', value: string) => {
        const updated = [...navLinks];
        updated[index][key] = value;
        setNavLinks(updated);
    };

    const handleRemoveNav = (index: number) => {
        setNavLinks(navLinks.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const res = await updateSiteSettingsAction({
            site_name: siteName,
            logo_url: logoUrl,
            hero_subtitle: heroSubtitle,
            hero_title: heroTitle,
            hero_description: heroDescription,
            reserve_button_text: reserveButtonText,
            nav_links: navLinks,
            footer_address: footerAddress,
            footer_phone: footerPhone,
            footer_email: footerEmail,
            footer_watermark: footerWatermark,
        });

        setLoading(false);

        if (res.success) {
            setMsg({ type: 'success', text: 'Site settings updated successfully!' });
        } else {
            setMsg({ type: 'error', text: res.message || 'Failed to update settings.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {msg && (
                <div className={`p-4 rounded-2xl text-xs font-bold ${
                    msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    {msg.text}
                </div>
            )}

            {/* Header & Branding */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Header & Identity</span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Business Branding</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Business Name</label>
                        <input
                            type="text"
                            required
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Reserve Button Text</label>
                        <input
                            type="text"
                            required
                            value={reserveButtonText}
                            onChange={(e) => setReserveButtonText(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest">Custom Logo Image (Optional)</label>
                    <div className="flex items-center gap-4">
                        {logoUrl ? (
                            <div className="relative w-12 h-12 bg-black rounded-xl overflow-hidden border border-[#c89349]">
                                <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-1" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-xs font-bold">
                                Default
                            </div>
                        )}

                        <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                            <span>{logoUrl ? 'Change Logo' : 'Upload Custom Logo'}</span>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                        </label>

                        {logoUrl && (
                            <button
                                type="button"
                                onClick={() => setLogoUrl('')}
                                className="text-xs text-rose-700 underline font-medium"
                            >
                                Reset to Default
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Header Links</span>
                        <h3 className="text-lg font-bold text-[#1c120c]">Navigation Links</h3>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddNav}
                        className="min-h-[38px] px-4 bg-[#c89349] text-[#1c120c] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 hover:bg-[#b07d37] transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Link</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {navLinks.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <input
                                type="text"
                                placeholder="Label"
                                value={item.label}
                                onChange={(e) => handleUpdateNav(idx, 'label', e.target.value)}
                                className="w-1/2 text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                            />
                            <input
                                type="text"
                                placeholder="#section or URL"
                                value={item.href}
                                onChange={(e) => handleUpdateNav(idx, 'href', e.target.value)}
                                className="w-1/2 text-xs font-mono text-[#1c120c] bg-transparent outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveNav(idx)}
                                className="p-2 text-rose-700 hover:bg-rose-100 rounded-xl transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Hero Banner</span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Main Headline & Subtitles</h3>
                </div>

                <div className="space-y-3">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Tagline Subtitle</label>
                        <input
                            type="text"
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Main Heading Title</label>
                        <input
                            type="text"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Hero Description Paragraph</label>
                        <textarea
                            rows={3}
                            value={heroDescription}
                            onChange={(e) => setHeroDescription(e.target.value)}
                            className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Footer & Contact</span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Footer Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Resort Address</label>
                        <input
                            type="text"
                            value={footerAddress}
                            onChange={(e) => setFooterAddress(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Contact Phone</label>
                        <input
                            type="text"
                            value={footerPhone}
                            onChange={(e) => setFooterPhone(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Contact Email</label>
                        <input
                            type="email"
                            value={footerEmail}
                            onChange={(e) => setFooterEmail(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Watermark Text</label>
                    <input
                        type="text"
                        value={footerWatermark}
                        onChange={(e) => setFooterWatermark(e.target.value)}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none uppercase"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || uploading}
                className="w-full h-14 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition shadow-lg disabled:opacity-50 cursor-pointer"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        <Save className="w-5 h-5 text-[#c89349]" />
                        <span>Save All Landing Page Changes</span>
                    </>
                )}
            </button>
        </form>
    );
}