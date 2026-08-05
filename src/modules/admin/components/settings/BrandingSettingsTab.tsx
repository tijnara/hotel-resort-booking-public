'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import { BrandIcon } from '@/modules/shared/components/BrandIcon';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface Props {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export function BrandingSettingsTab({ formData, setFormData }: Props) {
    const [uploading, setUploading] = useState(false);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const supabase = createClient();
        const filePath = `branding/logo-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);

        if (!error) {
            const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
            if (data?.publicUrl) setFormData((prev) => ({ ...prev, logo_url: data.publicUrl }));
        }
        setUploading(false);
    };

    const handleAddNav = () => {
        setFormData((prev) => ({
            ...prev,
            nav_links: [...(prev.nav_links || []), { label: 'New Link', href: '/villas' }],
        }));
    };

    const handleUpdateNav = (index: number, key: 'label' | 'href', value: string) => {
        const updated = [...(formData.nav_links || [])];
        updated[index][key] = value;
        setFormData((prev) => ({ ...prev, nav_links: updated }));
    };

    const handleRemoveNav = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            nav_links: (prev.nav_links || []).filter((_, i) => i !== index),
        }));
    };

    const iconOptions = [
        { value: 'Palmtree', label: 'Palm Tree (Resort & Beach)' },
        { value: 'Hotel', label: 'Hotel Building' },
        { value: 'Building2', label: 'Boutique Lodge / Villa' },
        { value: 'Sun', label: 'Sun / Coastal Sol' },
        { value: 'Waves', label: 'Ocean Waves' },
        { value: 'Compass', label: 'Compass / Travel' },
        { value: 'Anchor', label: 'Anchor / Harbor' },
        { value: 'Sparkles', label: 'Luxury / Sparkles' },
        { value: 'Crown', label: 'Crown / Executive Stay' },
    ];

    return (
        <div className="space-y-8">
            {/* Branding Section */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Header & Identity</span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Business Branding</h3>
                </div>

                {/* All Page Browser Tab Titles */}
                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                    <div>
                        <span className="text-[10px] font-bold text-[#c89349] uppercase tracking-widest block">
                            🌐 Browser Tab Titles (SEO Meta Titles)
                        </span>
                        <p className="text-[11px] text-gray-500">
                            Customize the browser tab titles displayed to users for every page of your resort website.
                        </p>
                    </div>

                    <div className="space-y-3 pt-1">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Home Page Tab Title</label>
                            <input
                                type="text"
                                placeholder="e.g. SEAVIEW | Executive Coastal Kubo Villas & Resort"
                                value={formData.meta_title || ''}
                                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                className="w-full text-xs font-semibold text-[#1c120c] bg-white p-2.5 rounded-xl border border-[#e6c898]/40 outline-none focus:border-[#c89349]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Kubo Villas Page Tab Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Kubo Villas | SEAVIEW"
                                    value={formData.villas_meta_title || ''}
                                    onChange={(e) => setFormData({ ...formData, villas_meta_title: e.target.value })}
                                    className="w-full text-xs font-semibold text-[#1c120c] bg-white p-2.5 rounded-xl border border-[#e6c898]/40 outline-none focus:border-[#c89349]"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">The Sanctuary Page Tab Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. The Sanctuary | SEAVIEW"
                                    value={formData.sanctuary_meta_title || ''}
                                    onChange={(e) => setFormData({ ...formData, sanctuary_meta_title: e.target.value })}
                                    className="w-full text-xs font-semibold text-[#1c120c] bg-white p-2.5 rounded-xl border border-[#e6c898]/40 outline-none focus:border-[#c89349]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Contact Us Page Tab Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Contact Us | SEAVIEW"
                                    value={formData.contact_meta_title || ''}
                                    onChange={(e) => setFormData({ ...formData, contact_meta_title: e.target.value })}
                                    className="w-full text-xs font-semibold text-[#1c120c] bg-white p-2.5 rounded-xl border border-[#e6c898]/40 outline-none focus:border-[#c89349]"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">About Us Page Tab Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. About Us | SEAVIEW"
                                    value={formData.about_meta_title || ''}
                                    onChange={(e) => setFormData({ ...formData, about_meta_title: e.target.value })}
                                    className="w-full text-xs font-semibold text-[#1c120c] bg-white p-2.5 rounded-xl border border-[#e6c898]/40 outline-none focus:border-[#c89349]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Business Name</label>
                        <input
                            type="text"
                            required
                            value={formData.site_name || ''}
                            onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Reserve Button Text</label>
                        <input
                            type="text"
                            required
                            value={formData.reserve_button_text || ''}
                            onChange={(e) => setFormData({ ...formData, reserve_button_text: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Dynamic Business Icon Choice */}
                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                        Primary Business Icon (Used in Header, Badges & Footer)
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="p-2 bg-[#1c120c] rounded-xl border border-[#c89349]/40 flex items-center justify-center">
                            <BrandIcon iconName={formData.site_icon} className="w-5 h-5 text-[#c89349]" />
                        </div>
                        <select
                            value={formData.site_icon || 'Palmtree'}
                            onChange={(e) => setFormData({ ...formData, site_icon: e.target.value })}
                            className="w-full text-xs font-bold text-[#1c120c] bg-white border border-[#e6c898]/50 p-2.5 rounded-xl outline-none cursor-pointer"
                        >
                            {iconOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest">Custom Logo Image (Optional)</label>
                    <div className="flex items-center gap-4">
                        {formData.logo_url ? (
                            <div className="relative w-12 h-12 bg-black rounded-xl overflow-hidden border border-[#c89349]">
                                <Image src={formData.logo_url} alt="Logo preview" fill className="object-contain p-1" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-xs font-bold">
                                <BrandIcon iconName={formData.site_icon} className="w-6 h-6 text-[#c89349]" />
                            </div>
                        )}

                        <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                            <span>{formData.logo_url ? 'Change Logo' : 'Upload Custom Logo'}</span>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                        </label>

                        {formData.logo_url && (
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, logo_url: '' })}
                                className="text-xs text-rose-700 underline font-medium cursor-pointer"
                            >
                                Reset to Default Icon
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
                    {(formData.nav_links || []).map((item, idx) => (
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
                                placeholder="URL"
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
        </div>
    );
}