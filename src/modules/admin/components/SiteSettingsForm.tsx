'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Save, Loader2, Plus, Trash2, Upload, Images, BookOpen, Camera, Laptop } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import { updateSiteSettingsAction } from '../actions/settingsActions';
import type { SiteSettings, NavLinkItem, SanctuaryAmenity } from '@/modules/settings/services/getSettings';

interface SiteSettingsFormProps {
    settings: SiteSettings;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [heroUploading, setHeroUploading] = useState(false);
    const [bannerUploading, setBannerUploading] = useState(false);
    const [sancBannerUploading, setSancBannerUploading] = useState(false);
    const [galleryUploading, setGalleryUploading] = useState(false);
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

    // Home Page Story States
    const [heroImages, setHeroImages] = useState<string[]>(settings.hero_images || []);
    const [storyHeading1, setStoryHeading1] = useState(settings.story_heading_1 || '');
    const [storyBody1, setStoryBody1] = useState(settings.story_body_1 || '');
    const [storyBannerImage, setStoryBannerImage] = useState(settings.story_banner_image || '');
    const [storyHeading2, setStoryHeading2] = useState(settings.story_heading_2 || '');
    const [storyBody2, setStoryBody2] = useState(settings.story_body_2 || '');

    // Sanctuary Page Editable States
    const [sancHeroSubtitle, setSancHeroSubtitle] = useState(settings.sanctuary_hero_subtitle || 'Coastal Wellness & Peace');
    const [sancHeroTitle, setSancHeroTitle] = useState(settings.sanctuary_hero_title || 'The Seaview Sanctuary');
    const [sancHeroDesc, setSancHeroDesc] = useState(settings.sanctuary_hero_description || '');
    const [sancBannerImage, setSancBannerImage] = useState(settings.sanctuary_banner_image || '');
    const [sancAmenities, setSancAmenities] = useState<SanctuaryAmenity[]>(settings.sanctuary_amenities || []);
    const [sanctuaryGallery, setSanctuaryGallery] = useState<string[]>(settings.sanctuary_gallery || []);

    // Independent Sanctuary Story Cards States
    const [sancStoryHeading1, setSancStoryHeading1] = useState(settings.sanctuary_story_heading_1 || 'Your Next Unforgettable Family Beachfront Staycation.');
    const [sancStoryBody1, setSancStoryBody1] = useState(settings.sanctuary_story_body_1 || '');
    const [sancStoryHeading2, setSancStoryHeading2] = useState(settings.sanctuary_story_heading_2 || '');
    const [sancStoryBody2, setSancStoryBody2] = useState(settings.sanctuary_story_body_2 || '');

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

    const handleStoryBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setBannerUploading(true);
        setMsg(null);
        const supabase = createClient();
        const filePath = `story/banner-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);
        if (error) {
            setMsg({ type: 'error', text: `Home banner upload failed: ${error.message}` });
            setBannerUploading(false);
            return;
        }

        const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
        if (data?.publicUrl) setStoryBannerImage(data.publicUrl);
        setBannerUploading(false);
    };

    const handleSanctuaryBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSancBannerUploading(true);
        setMsg(null);
        const supabase = createClient();
        const filePath = `sanctuary/banner-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);
        if (error) {
            setMsg({ type: 'error', text: `Sanctuary banner upload failed: ${error.message}` });
            setSancBannerUploading(false);
            return;
        }

        const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
        if (data?.publicUrl) setSancBannerImage(data.publicUrl);
        setSancBannerUploading(false);
    };

    const handleSanctuaryGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setGalleryUploading(true);
        setMsg(null);
        const supabase = createClient();
        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = `sanctuary/gallery-${Date.now()}-${i}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('room-images').upload(filePath, file);

            if (!error) {
                const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
                if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
            }
        }

        setSanctuaryGallery([...sanctuaryGallery, ...uploadedUrls]);
        setGalleryUploading(false);
    };

    const handleRemoveGalleryImage = (index: number) => {
        setSanctuaryGallery(sanctuaryGallery.filter((_, i) => i !== index));
    };

    const handleRemoveHeroImage = (index: number) => {
        setHeroImages(heroImages.filter((_, i) => i !== index));
    };

    const handleAddNav = () => setNavLinks([...navLinks, { label: 'New Link', href: '/villas' }]);
    const handleUpdateNav = (index: number, key: 'label' | 'href', value: string) => {
        const updated = [...navLinks];
        updated[index][key] = value;
        setNavLinks(updated);
    };
    const handleRemoveNav = (index: number) => setNavLinks(navLinks.filter((_, i) => i !== index));

    const handleAddAmenity = () => {
        setSancAmenities([...sancAmenities, { icon: 'Sun', title: 'New Amenity', description: '' }]);
    };
    const handleUpdateAmenity = (index: number, key: keyof SanctuaryAmenity, value: string) => {
        const updated = [...sancAmenities];
        updated[index][key] = value;
        setSancAmenities(updated);
    };
    const handleRemoveAmenity = (index: number) => {
        setSancAmenities(sancAmenities.filter((_, i) => i !== index));
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
            hero_images: heroImages,
            story_heading_1: storyHeading1,
            story_body_1: storyBody1,
            story_banner_image: storyBannerImage,
            story_heading_2: storyHeading2,
            story_body_2: storyBody2,
            sanctuary_hero_subtitle: sancHeroSubtitle,
            sanctuary_hero_title: sancHeroTitle,
            sanctuary_hero_description: sancHeroDesc,
            sanctuary_banner_image: sancBannerImage,
            sanctuary_amenities: sancAmenities,
            sanctuary_gallery: sanctuaryGallery,
            sanctuary_story_heading_1: sancStoryHeading1,
            sanctuary_story_body_1: sancStoryBody1,
            sanctuary_story_heading_2: sancStoryHeading2,
            sanctuary_story_body_2: sancStoryBody2,
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
                                className="text-xs text-rose-700 underline font-medium cursor-pointer"
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
                        className="min-h-[38px] px-4 bg-[#c89349] text-[#1c120c] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 hover:bg-[#b07d37] transition cursor-pointer"
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
                                placeholder="Label (e.g. Kubo Villas)"
                                value={item.label}
                                onChange={(e) => handleUpdateNav(idx, 'label', e.target.value)}
                                className="w-1/2 text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                            />
                            <input
                                type="text"
                                placeholder="URL (e.g. /villas or /#dining)"
                                value={item.href}
                                onChange={(e) => handleUpdateNav(idx, 'href', e.target.value)}
                                className="w-1/2 text-xs font-mono text-[#1c120c] bg-transparent outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveNav(idx)}
                                className="p-2 text-rose-700 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Home Hero Section */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Home Hero Banner</span>
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
                                        className="absolute top-1.5 right-1.5 bg-rose-600/90 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Home Brand Story / Experience Section */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Home Page Resort Story Section
                    </span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Home Brand Experience Content & Photo Banner</h3>
                </div>

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

                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">
                        Home Page Banner Photo
                    </label>
                    <div className="flex items-center gap-4">
                        {storyBannerImage ? (
                            <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-[#c89349]">
                                <Image src={storyBannerImage} alt="Home story banner" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-28 h-16 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-[10px] font-bold text-center px-2">
                                Auto Room Photo
                            </div>
                        )}

                        <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                            {bannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                            <span>{storyBannerImage ? 'Change Home Banner' : 'Upload Home Banner'}</span>
                            <input type="file" accept="image/*" onChange={handleStoryBannerUpload} disabled={bannerUploading} className="hidden" />
                        </label>

                        {storyBannerImage && (
                            <button
                                type="button"
                                onClick={() => setStoryBannerImage('')}
                                className="text-xs text-rose-700 underline font-medium cursor-pointer"
                            >
                                Use Default Photo
                            </button>
                        )}
                    </div>
                </div>

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

            {/* THE SANCTUARY PAGE EDITABLE CONTENT & GALLERY MANAGER */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        The Sanctuary Page Content
                    </span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Hero Header, Story Cards, Banner, Amenities & Gallery</h3>
                </div>

                {/* Sanctuary Hero Inputs */}
                <div className="space-y-3 pb-4 border-b border-[#e6c898]/30">
                    <h4 className="text-xs font-bold text-[#c89349] uppercase tracking-wider">Hero Header Content</h4>
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Hero Subtitle</label>
                        <input
                            type="text"
                            value={sancHeroSubtitle}
                            onChange={(e) => setSancHeroSubtitle(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Hero Main Title</label>
                        <input
                            type="text"
                            value={sancHeroTitle}
                            onChange={(e) => setSancHeroTitle(e.target.value)}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Hero Description Paragraph</label>
                        <textarea
                            rows={3}
                            value={sancHeroDesc}
                            onChange={(e) => setSancHeroDesc(e.target.value)}
                            className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Independent Sanctuary Story Section Cards */}
                <div className="space-y-4 pb-4 border-b border-[#e6c898]/30">
                    <h4 className="text-xs font-bold text-[#c89349] uppercase tracking-wider">Sanctuary Story Cards Content</h4>

                    {/* Top Dark Card */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest">Top Dark Card</span>
                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Top Headline</label>
                            <input
                                type="text"
                                value={sancStoryHeading1}
                                onChange={(e) => setSancStoryHeading1(e.target.value)}
                                className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                            />
                        </div>

                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Top Description Paragraph</label>
                            <textarea
                                rows={3}
                                value={sancStoryBody1}
                                onChange={(e) => setSancStoryBody1(e.target.value)}
                                className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Bottom Light Card */}
                    <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest">Bottom Light Card</span>
                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Bottom Headline</label>
                            <input
                                type="text"
                                value={sancStoryHeading2}
                                onChange={(e) => setSancStoryHeading2(e.target.value)}
                                className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                            />
                        </div>

                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Bottom Description Paragraph</label>
                            <textarea
                                rows={3}
                                value={sancStoryBody2}
                                onChange={(e) => setSancStoryBody2(e.target.value)}
                                className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* Dedicated Sanctuary Banner Image Upload */}
                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                    <div>
                        <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">
                            The Sanctuary Page Main Banner Photo
                        </label>
                        <p className="text-[11px] text-[#2b1d14]/60 mt-0.5">
                            This photo is displayed exclusively on The Sanctuary page.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {sancBannerImage ? (
                            <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-[#c89349]">
                                <Image src={sancBannerImage} alt="Sanctuary banner" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-32 h-20 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-[10px] font-bold text-center px-2">
                                Auto Photo
                            </div>
                        )}

                        <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                            {sancBannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                            <span>{sancBannerImage ? 'Change Sanctuary Banner' : 'Upload Sanctuary Banner'}</span>
                            <input type="file" accept="image/*" onChange={handleSanctuaryBannerUpload} disabled={sancBannerUploading} className="hidden" />
                        </label>

                        {sancBannerImage && (
                            <button
                                type="button"
                                onClick={() => setSancBannerImage('')}
                                className="text-xs text-rose-700 underline font-medium cursor-pointer"
                            >
                                Use Default Photo
                            </button>
                        )}
                    </div>
                </div>

                {/* Sanctuary Amenities Manager */}
                <div className="space-y-4 pb-4 border-b border-[#e6c898]/30">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#c89349] uppercase tracking-wider">Sanctuary Amenities Grid</h4>
                        <button
                            type="button"
                            onClick={handleAddAmenity}
                            className="min-h-[38px] px-4 bg-[#c89349] text-[#1c120c] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 hover:bg-[#b07d37] transition cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Amenity Card</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {sancAmenities.map((item, idx) => (
                            <div key={idx} className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 relative space-y-3">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAmenity(idx)}
                                    className="absolute top-3 right-3 p-1.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition cursor-pointer"
                                    title="Delete Amenity"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="grid grid-cols-2 gap-3 pr-10">
                                    <div>
                                        <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Icon Graphic</label>
                                        <select
                                            value={item.icon}
                                            onChange={(e) => handleUpdateAmenity(idx, 'icon', e.target.value)}
                                            className="w-full text-xs font-bold text-[#1c120c] bg-white border border-[#e6c898]/50 p-2 rounded-lg outline-none cursor-pointer"
                                        >
                                            <option value="Waves">Ocean Waves</option>
                                            <option value="Sun">Sun / Yoga</option>
                                            <option value="ShieldCheck">Private / Secure</option>
                                            <option value="Leaf">Nature / Eco</option>
                                            <option value="Wind">Breeze</option>
                                            <option value="Droplets">Water / Pool</option>
                                            <option value="Heart">Wellness / Spa</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Amenity Title</label>
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => handleUpdateAmenity(idx, 'title', e.target.value)}
                                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent border-b border-[#e6c898]/50 p-1 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description Paragraph</label>
                                    <textarea
                                        rows={2}
                                        value={item.description}
                                        onChange={(e) => handleUpdateAmenity(idx, 'description', e.target.value)}
                                        className="w-full text-xs font-medium text-[#1c120c] bg-transparent border-b border-[#e6c898]/50 p-1 outline-none resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sanctuary Gallery Photo Uploads */}
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-[#c89349] uppercase tracking-wider">Sanctuary Photo Gallery</h4>
                            <p className="text-[11px] text-[#2b1d14]/60 mt-0.5">
                                Upload unlimited photos to populate the luxury grid on The Sanctuary page.
                            </p>
                        </div>

                        <label className="cursor-pointer min-h-[44px] px-5 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition shrink-0 shadow-md">
                            {galleryUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Images className="w-4 h-4 text-[#c89349]" />}
                            <span>Upload Gallery Photos</span>
                            <input type="file" multiple accept="image/*" onChange={handleSanctuaryGalleryUpload} disabled={galleryUploading} className="hidden" />
                        </label>
                    </div>

                    {sanctuaryGallery.length > 0 ? (
                        <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b1d14]/60 block mb-3">
                                Uploaded Photos ({sanctuaryGallery.length})
                            </span>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {sanctuaryGallery.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#e6c898]/60 group bg-white shadow-sm">
                                        <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryImage(idx)}
                                            className="absolute top-1.5 right-1.5 bg-rose-600/90 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm cursor-pointer"
                                            title="Delete Photo"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#faf7f2] border border-dashed border-[#e6c898] rounded-2xl p-8 text-center text-xs text-[#2b1d14]/60 font-medium">
                            No gallery photos uploaded yet.
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
                disabled={loading || uploading || heroUploading || bannerUploading || sancBannerUploading || galleryUploading}
                className="w-full h-14 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition shadow-lg disabled:opacity-50 cursor-pointer"
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