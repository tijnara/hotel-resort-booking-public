'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, Phone, Upload } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface Props {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export function ContactSettingsTab({ formData, setFormData }: Props) {
    const [contactBannerUploading, setContactBannerUploading] = useState(false);

    const handleContactBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setContactBannerUploading(true);
        const supabase = createClient();
        const filePath = `contact/banner-${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage.from('room-images').upload(filePath, file);
        if (!error) {
            const { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
            if (data?.publicUrl) setFormData((prev) => ({ ...prev, contact_banner_image: data.publicUrl }));
        }
        setContactBannerUploading(false);
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
            <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          Contact Us Page Content
        </span>
                <h3 className="text-lg font-bold text-[#1c120c]">Banner Image, Headlines & Hotlines</h3>
            </div>

            <div className="space-y-3">
                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Overlay Card Title</label>
                    <input
                        type="text"
                        value={formData.contact_title || ''}
                        onChange={(e) => setFormData({ ...formData, contact_title: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Overlay Card Subtitle</label>
                    <textarea
                        rows={2}
                        value={formData.contact_subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, contact_subtitle: e.target.value })}
                        className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Inquiry Recipient Email</label>
                    <input
                        type="email"
                        required
                        value={formData.inquiry_email || ''}
                        onChange={(e) => setFormData({ ...formData, inquiry_email: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                        placeholder="aranjitarchita@gmail.com"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Landline Telephone Number</label>
                    <input
                        type="text"
                        value={formData.contact_landline || ''}
                        onChange={(e) => setFormData({ ...formData, contact_landline: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>
            </div>

            <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                <label className="block text-[10px] font-bold text-[#2b1d14]/80 uppercase tracking-widest">Contact Page Hero Banner Photo</label>
                <div className="flex items-center gap-4">
                    {formData.contact_banner_image ? (
                        <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-[#c89349]">
                            <Image src={formData.contact_banner_image} alt="Contact banner" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-20 bg-[#1c120c] text-[#c89349] rounded-xl flex items-center justify-center text-[10px] font-bold text-center px-2">
                            Auto Photo
                        </div>
                    )}

                    <label className="cursor-pointer min-h-[40px] px-4 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase rounded-xl flex items-center gap-2 hover:bg-[#2b1d14] transition">
                        {contactBannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-[#c89349]" />}
                        <span>{formData.contact_banner_image ? 'Change Banner' : 'Upload Banner'}</span>
                        <input type="file" accept="image/*" onChange={handleContactBannerUpload} disabled={contactBannerUploading} className="hidden" />
                    </label>
                </div>
            </div>
        </div>
    );
}