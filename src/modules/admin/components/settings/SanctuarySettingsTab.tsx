'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Images, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import type { SiteSettings, SanctuaryAmenity } from '@/modules/settings/services/getSettings';

interface Props {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export function SanctuarySettingsTab({ formData, setFormData }: Props) {
    const [sancBannerUploading, setSancBannerUploading] = useState(false);
    const [galleryUploading, setGalleryUploading] = useState(false);

    const handleSanctuaryBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSancBannerUploading(true);
        const supabase = createClient();
        const filePath = `sanctuary/banner-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);
        if (!error) {
            const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
            if (data?.publicUrl) setFormData((prev) => ({ ...prev, sanctuary_banner_image: data.publicUrl }));
        }
        setSancBannerUploading(false);
    };

    const handleSanctuaryGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setGalleryUploading(true);
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

        setFormData((prev) => ({
            ...prev,
            sanctuary_gallery: [...(prev.sanctuary_gallery || []), ...uploadedUrls],
        }));
        setGalleryUploading(false);
    };

    const handleAddAmenity = () => {
        setFormData((prev) => ({
            ...prev,
            sanctuary_amenities: [
                ...(prev.sanctuary_amenities || []),
                { icon: 'Sun', title: 'New Amenity', description: '' },
            ],
        }));
    };

    const handleUpdateAmenity = (index: number, key: keyof SanctuaryAmenity, value: string) => {
        const updated = [...(formData.sanctuary_amenities || [])];
        updated[index][key] = value;
        setFormData((prev) => ({ ...prev, sanctuary_amenities: updated }));
    };

    const handleRemoveAmenity = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            sanctuary_amenities: (prev.sanctuary_amenities || []).filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
            <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          The Sanctuary Page Content
        </span>
                <h3 className="text-lg font-bold text-[#1c120c]">Hero Header, Story Cards, Banner, Amenities & Gallery</h3>
            </div>

            <div className="space-y-3 pb-4 border-b border-[#e6c898]/30">
                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Hero Subtitle</label>
                    <input
                        type="text"
                        value={formData.sanctuary_hero_subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, sanctuary_hero_subtitle: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Hero Main Title</label>
                    <input
                        type="text"
                        value={formData.sanctuary_hero_title || ''}
                        onChange={(e) => setFormData({ ...formData, sanctuary_hero_title: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Hero Description Paragraph</label>
                    <textarea
                        rows={3}
                        value={formData.sanctuary_hero_description || ''}
                        onChange={(e) => setFormData({ ...formData, sanctuary_hero_description: e.target.value })}
                        className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                    />
                </div>
            </div>

            {/* Banner Upload */}
            <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">Sanctuary Banner Photo</label>
                <div className="flex items-center gap-4">
                    {formData.sanctuary_banner_image ? (
                        <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-[#c89349]">
                            <Image src={formData.sanctuary_banner_image} alt="Sanctuary banner" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-20 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-[10px] font-bold text-center px-2">
                            Auto Photo
                        </div>
                    )}

                    <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                        {sancBannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                        <span>{formData.sanctuary_banner_image ? 'Change Banner' : 'Upload Banner'}</span>
                        <input type="file" accept="image/*" onChange={handleSanctuaryBannerUpload} disabled={sancBannerUploading} className="hidden" />
                    </label>
                </div>
            </div>

            {/* Amenities Grid Manager */}
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
                    {(formData.sanctuary_amenities || []).map((item, idx) => (
                        <div key={idx} className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 relative space-y-3">
                            <button
                                type="button"
                                onClick={() => handleRemoveAmenity(idx)}
                                className="absolute top-3 right-3 p-1.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition cursor-pointer"
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

            {/* Gallery Photo Manager */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-xs font-bold text-[#c89349] uppercase tracking-wider">Sanctuary Photo Gallery</h4>
                    </div>

                    <label className="cursor-pointer min-h-[44px] px-5 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition shrink-0 shadow-md">
                        {galleryUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Images className="w-4 h-4 text-[#c89349]" />}
                        <span>Upload Gallery Photos</span>
                        <input type="file" multiple accept="image/*" onChange={handleSanctuaryGalleryUpload} disabled={galleryUploading} className="hidden" />
                    </label>
                </div>

                {(formData.sanctuary_gallery || []).length > 0 && (
                    <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {(formData.sanctuary_gallery || []).map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#e6c898]/60 group bg-white shadow-sm">
                                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, sanctuary_gallery: (formData.sanctuary_gallery || []).filter((_, i) => i !== idx) })}
                                        className="absolute top-1.5 right-1.5 bg-rose-600/90 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}