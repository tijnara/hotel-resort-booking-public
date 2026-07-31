'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Info, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import type { SiteSettings, AboutFeature } from '@/modules/settings/services/getSettings';

interface Props {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export function AboutSettingsTab({ formData, setFormData }: Props) {
    const [aboutImageUploading, setAboutImageUploading] = useState(false);

    const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAboutImageUploading(true);
        const supabase = createClient();
        const filePath = `about/hero-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);
        if (!error) {
            const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
            if (data?.publicUrl) setFormData((prev) => ({ ...prev, about_image_url: data.publicUrl }));
        }
        setAboutImageUploading(false);
    };

    const handleAddFeature = () => {
        setFormData((prev) => ({
            ...prev,
            about_features: [
                ...(prev.about_features || []),
                { icon: 'ShieldCheck', title: 'New Feature', description: '' },
            ],
        }));
    };

    const handleUpdateFeature = (index: number, key: keyof AboutFeature, value: string) => {
        const updated = [...(formData.about_features || [])];
        updated[index][key] = value;
        setFormData((prev) => ({ ...prev, about_features: updated }));
    };

    const handleRemoveFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            about_features: (prev.about_features || []).filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
            <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          About Us Page Content
        </span>
                <h3 className="text-lg font-bold text-[#1c120c]">Hero Tag Badge, Header, Story, Mission, Vision & Feature Cards</h3>
            </div>

            <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                    Top Tag Badge Phrase (Shown above title)
                </label>
                <input
                    type="text"
                    value={formData.about_badge_text || ''}
                    onChange={(e) => setFormData({ ...formData, about_badge_text: e.target.value })}
                    placeholder={`Discover ${formData.site_name || 'SEAVIEW'}`}
                    className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none uppercase"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Main Heading Title</label>
                    <input
                        type="text"
                        value={formData.about_title || ''}
                        onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Subtitle / Hero Subheading</label>
                    <input
                        type="text"
                        value={formData.about_subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, about_subtitle: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Story Section Title</label>
                    <input
                        type="text"
                        value={formData.about_story_title || ''}
                        onChange={(e) => setFormData({ ...formData, about_story_title: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Story Body Paragraph</label>
                    <textarea
                        rows={4}
                        value={formData.about_story_body || ''}
                        onChange={(e) => setFormData({ ...formData, about_story_body: e.target.value })}
                        className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Resort Mission Statement</label>
                    <textarea
                        rows={3}
                        value={formData.about_mission || ''}
                        onChange={(e) => setFormData({ ...formData, about_mission: e.target.value })}
                        className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Resort Vision Statement</label>
                    <textarea
                        rows={3}
                        value={formData.about_vision || ''}
                        onChange={(e) => setFormData({ ...formData, about_vision: e.target.value })}
                        className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                    />
                </div>
            </div>

            <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">About Page Feature Photo</label>
                <div className="flex items-center gap-4">
                    {formData.about_image_url ? (
                        <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-[#c89349]">
                            <Image src={formData.about_image_url} alt="About feature" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-20 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-[10px] font-bold text-center px-2">
                            Auto Photo
                        </div>
                    )}

                    <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                        {aboutImageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                        <span>{formData.about_image_url ? 'Change Feature Photo' : 'Upload Feature Photo'}</span>
                        <input type="file" accept="image/*" onChange={handleAboutImageUpload} disabled={aboutImageUploading} className="hidden" />
                    </label>
                </div>
            </div>

            {/* Feature Cards Manager ("The Seaview Difference") */}
            <div className="space-y-4 pt-4 border-t border-[#e6c898]/30">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#c89349] uppercase tracking-wider">Features Section ("The Seaview Difference")</h4>
                    <button
                        type="button"
                        onClick={handleAddFeature}
                        className="min-h-[38px] px-4 bg-[#c89349] text-[#1c120c] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 hover:bg-[#b07d37] transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Feature Card</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Small Tagline Subtitle</label>
                        <input
                            type="text"
                            value={formData.about_features_subtitle || ''}
                            onChange={(e) => setFormData({ ...formData, about_features_subtitle: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none uppercase"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Section Main Title</label>
                        <input
                            type="text"
                            value={formData.about_features_title || ''}
                            onChange={(e) => setFormData({ ...formData, about_features_title: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    {(formData.about_features || []).map((item, idx) => (
                        <div key={idx} className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 relative space-y-3">
                            <button
                                type="button"
                                onClick={() => handleRemoveFeature(idx)}
                                className="absolute top-3 right-3 p-1.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-2 gap-3 pr-10">
                                <div>
                                    <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Icon Graphic</label>
                                    <select
                                        value={item.icon}
                                        onChange={(e) => handleUpdateFeature(idx, 'icon', e.target.value)}
                                        className="w-full text-xs font-bold text-[#1c120c] bg-white border border-[#e6c898]/50 p-2 rounded-lg outline-none cursor-pointer"
                                    >
                                        <option value="ShieldCheck">Shield / Eco</option>
                                        <option value="Palmtree">Palmtree / Beach</option>
                                        <option value="Heart">Heart / Hospitality</option>
                                        <option value="Compass">Compass / Location</option>
                                        <option value="Sun">Sun / Warmth</option>
                                        <option value="Waves">Waves / Ocean</option>
                                        <option value="Leaf">Leaf / Nature</option>
                                        <option value="Wind">Wind / Breeze</option>
                                        <option value="Home">Home / Sanctuary</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Feature Card Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent border-b border-[#e6c898]/50 p-1 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Description Paragraph</label>
                                <textarea
                                    rows={2}
                                    value={item.description}
                                    onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                                    className="w-full text-xs font-medium text-[#1c120c] bg-transparent border-b border-[#e6c898]/50 p-1 outline-none resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}