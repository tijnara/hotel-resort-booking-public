'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Save, Loader2, Plus, Trash2, Upload, Images, BookOpen } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import { updateSiteSettingsAction } from '../actions/settingsActions';
import type { SiteSettings, NavLinkItem } from '@/modules/settings/services/getSettings';

interface SiteSettingsFormProps {
    settings: SiteSettings;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [heroUploading, setHeroUploading] = useState(false);
    const [bannerUploading, setBannerUploading] = useState(false);
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
    const [heroImages, setHeroImages] = useState<string[]>(settings.hero_images || []);

    // Story / Experience States
    const [storyHeading1, setStoryHeading1] = useState(settings.story_heading_1 || '');
    const [storyBody1, setStoryBody1] = useState(settings.story_body_1 || '');
    const [storyBannerImage, setStoryBannerImage] = useState(settings.story_banner_image || '');
    const [storyHeading2, setStoryHeading2] = useState(settings.story_heading_2 || '');
    const [storyBody2, setStoryBody2] = useState(settings.story_body_2 || '');

    // Handle Logo Upload
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMsg(null);
        const supabase = createClient();
        const filePath = `branding/logo-${Date.now()}.${file.name.split('.').pop()}`;

        const { error: uploadError } = await supabase.storage.from('room-images').upload(filePath, file);

        if (uploadError) {
            setMsg({ type: 'error', text: `Logo upload failed: ${uploadError.message}` });
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
        if (data?.publicUrl) setLogoUrl(data.publicUrl);
        setUploading(false);
    };

    // Handle Hero Upload
    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setHeroUploading(true);
        setMsg(null);
        const supabase = createClient();
        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = `hero/hero-${Date.now()}-${i}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('room-images').upload(filePath, file);

            if (!error) {
                const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
                if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
            }
        }

        setHeroImages([...heroImages, ...uploadedUrls]);
        setHeroUploading(false);
    };

    // Handle Story Banner Upload
    const handleStoryBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setBannerUploading(true);
        setMsg(null);
        const supabase = createClient();
        const filePath = `story/banner-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);
        if (error) {
            setMsg({ type: 'error', text: `Banner upload failed: ${error.message}` });
            setBannerUploading(false);
            return;
        }

        const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
        if (data?.publicUrl) setStoryBannerImage(data.publicUrl);
        setBannerUploading(false);
    };

    const handleRemoveHeroImage = (index: number) => {
        setHeroImages(heroImages.filter((_, i) => i !== index));
    };

    const handleAddNav = () => setNavLinks([...navLinks, { label: 'New Link', href: '#villas' }]);
    const handleUpdateNav = (index: number, key: 'label' | 'href', value: string) => {
        const updated = [...navLinks];
        updated[index][key] = value;
        setNavLinks(updated);
    };
    const handleRemoveNav = (index: number) => setNavLinks(navLinks.filter((_, i) => i !== index));

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
            hero_images: heroImages,
            story_heading_1: storyHeading1,
            story_body_1: storyBody1,
            story_banner_image: storyBannerImage,
            story_heading_2: storyHeading2,
            story_body_2: storyBody2,
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

            {/* Brand Story / Experience Section Manager (Bedbox Style) */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Resort Story Section (Bedbox Style)
          </span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Brand Experience Content & Photo Banner</h3>
                </div>

                {/* Section 1: Dark Card Text */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#c89349] uppercase tracking-wider">Top Dark Card Content</h4>
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Headline 1</label>
                        <input
                            type="text"
                            value={storyHeading1}
                            onChange={(e) => setStoryHeading1(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description Paragraph 1</label>
                        <textarea
                            rows={3}
                            value={storyBody1}
                            onChange={(e) => setStoryBody1(e.target.value)}
                            className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Story Banner Photo Upload */}
                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">
                        Full-Width Divider Banner Photo
                    </label>
                    <div className="flex items-center gap-4">
                        {storyBannerImage ? (
                            <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-[#c89349]">
                                <Image src={storyBannerImage} alt="Story banner" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-28 h-16 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-[10px] font-bold text-center px-2">
                                Auto Room Photo
                            </div>
                        )}

                        <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                            {bannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                            <span>{storyBannerImage ? 'Change Banner Photo' : 'Upload Custom Banner Photo'}</span>
                            <input type="file" accept="image/*" onChange={handleStoryBannerUpload} disabled={bannerUploading} className="hidden" />
                        </label>

                        {storyBannerImage && (
                            <button
                                type="button"
                                onClick={() => setStoryBannerImage('')}
                                className="text-xs text-rose-700 underline font-medium"
                            >
                                Use Default Photo
                            </button>
                        )}
                    </div>
                </div>

                {/* Section 2: Light Card Text */}
                <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-[#c89349] uppercase tracking-wider">Bottom Light Card Content</h4>
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Headline 2</label>
                        <input
                            type="text"
                            value={storyHeading2}
                            onChange={(e) => setStoryHeading2(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description Paragraph 2</label>
                        <textarea
                            rows={3}
                            value={storyBody2}
                            onChange={(e) => setStoryBody2(e.target.value)}
                            className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                        />
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

            {/* Hero Section & Hero Images Manager */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Hero Banner</span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Main Headline & Hero Background Photos</h3>
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

                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">
                                Hero Slideshow Photos ({heroImages.length})
                            </label>
                            <p className="text-[11px] text-[#2b1d14]/60 mt-0.5">
                                {heroImages.length > 0
                                    ? 'Custom hero slideshow photos enabled.'
                                    : 'ℹ️ No custom photos uploaded. Hero slideshow automatically displays all room photos uploaded under the Kubo Villas tab.'}
                            </p>
                        </div>

                        <label className="cursor-pointer min-h-[38px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition shrink-0">
                            {heroUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Images className="w-4 h-4 text-[#c89349]" />}
                            <span>Upload Custom Hero Photos</span>
                            <input type="file" multiple accept="image/*" onChange={handleHeroImageUpload} disabled={heroUploading} className="hidden" />
                        </label>
                    </div>

                    {heroImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {heroImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-16/9 rounded-xl overflow-hidden border border-[#e6c898]/60 group">
                                    <Image src={img} alt={`Hero ${idx}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveHeroImage(idx)}
                                        className="absolute top-1.5 right-1.5 bg-rose-600/90 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
                disabled={loading || uploading || heroUploading || bannerUploading}
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