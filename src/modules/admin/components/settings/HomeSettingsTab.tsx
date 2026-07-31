'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Images, Loader2, Trash2, Upload, BookOpen } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface Props {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export function HomeSettingsTab({ formData, setFormData }: Props) {
    const [heroUploading, setHeroUploading] = useState(false);
    const [bannerUploading, setBannerUploading] = useState(false);

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setHeroUploading(true);
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

        setFormData((prev) => ({
            ...prev,
            hero_images: [...(prev.hero_images || []), ...uploadedUrls],
        }));
        setHeroUploading(false);
    };

    const handleStoryBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setBannerUploading(true);
        const supabase = createClient();
        const filePath = `story/banner-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);
        if (!error) {
            const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
            if (data?.publicUrl) setFormData((prev) => ({ ...prev, story_banner_image: data.publicUrl }));
        }
        setBannerUploading(false);
    };

    return (
        <div className="space-y-8">
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
                            value={formData.hero_subtitle || ''}
                            onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Main Heading Title</label>
                        <input
                            type="text"
                            value={formData.hero_title || ''}
                            onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Hero Description Paragraph</label>
                        <textarea
                            rows={3}
                            value={formData.hero_description || ''}
                            onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                            className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>

                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">
                            Hero Slideshow Photos ({(formData.hero_images || []).length})
                        </label>
                        <label className="cursor-pointer min-h-[38px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition shrink-0">
                            {heroUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Images className="w-4 h-4 text-[#c89349]" />}
                            <span>Upload Custom Hero Photos</span>
                            <input type="file" multiple accept="image/*" onChange={handleHeroImageUpload} disabled={heroUploading} className="hidden" />
                        </label>
                    </div>

                    {(formData.hero_images || []).length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {(formData.hero_images || []).map((img, idx) => (
                                <div key={idx} className="relative aspect-16/9 rounded-xl overflow-hidden border border-[#e6c898]/60 group">
                                    <Image src={img} alt={`Hero ${idx}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, hero_images: (formData.hero_images || []).filter((_, i) => i !== idx) })}
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

            {/* Home Brand Story */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Home Page Resort Story Section
          </span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Home Brand Experience Content & Photo Banner</h3>
                </div>

                <div className="space-y-3">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Headline 1</label>
                        <input
                            type="text"
                            value={formData.story_heading_1 || ''}
                            onChange={(e) => setFormData({ ...formData, story_heading_1: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description Paragraph 1</label>
                        <textarea
                            rows={3}
                            value={formData.story_body_1 || ''}
                            onChange={(e) => setFormData({ ...formData, story_body_1: e.target.value })}
                            className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>

                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">Home Page Banner Photo</label>
                    <div className="flex items-center gap-4">
                        {formData.story_banner_image ? (
                            <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-[#c89349]">
                                <Image src={formData.story_banner_image} alt="Story banner" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-28 h-16 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-[10px] font-bold text-center px-2">
                                Auto Photo
                            </div>
                        )}

                        <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                            {bannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                            <span>{formData.story_banner_image ? 'Change Home Banner' : 'Upload Home Banner'}</span>
                            <input type="file" accept="image/*" onChange={handleStoryBannerUpload} disabled={bannerUploading} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Headline 2</label>
                        <input
                            type="text"
                            value={formData.story_heading_2 || ''}
                            onChange={(e) => setFormData({ ...formData, story_heading_2: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description Paragraph 2</label>
                        <textarea
                            rows={3}
                            value={formData.story_body_2 || ''}
                            onChange={(e) => setFormData({ ...formData, story_body_2: e.target.value })}
                            className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}