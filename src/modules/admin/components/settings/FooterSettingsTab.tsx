'use client';

import type { SiteSettings } from '@/modules/settings/services/getSettings';

interface Props {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export function FooterSettingsTab({ formData, setFormData }: Props) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
            <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Footer & Contact</span>
                <h3 className="text-lg font-bold text-[#1c120c]">Footer Information & Branding</h3>
            </div>

            {/* Editable Footer Description Paragraph */}
            <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                    Footer Description Paragraph (Under Logo)
                </label>
                <textarea
                    rows={2}
                    value={formData.footer_description || ''}
                    onChange={(e) => setFormData({ ...formData, footer_description: e.target.value })}
                    className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                    placeholder="Executive coastal Kubo suites where traditional Filipino craftsmanship meets contemporary beachfront luxury."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Resort Address</label>
                    <input
                        type="text"
                        value={formData.footer_address || ''}
                        onChange={(e) => setFormData({ ...formData, footer_address: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Contact Phone</label>
                    <input
                        type="text"
                        value={formData.footer_phone || ''}
                        onChange={(e) => setFormData({ ...formData, footer_phone: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Contact Email</label>
                    <input
                        type="email"
                        value={formData.footer_email || ''}
                        onChange={(e) => setFormData({ ...formData, footer_email: e.target.value })}
                        className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>
            </div>

            {/* Editable Giant Background Watermark Text */}
            <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                    Giant Background Watermark Text
                </label>
                <input
                    type="text"
                    value={formData.footer_watermark || ''}
                    onChange={(e) => setFormData({ ...formData, footer_watermark: e.target.value })}
                    className="w-full text-xs font-bold text-[#1c120c] bg-transparent outline-none uppercase"
                    placeholder={formData.site_name || 'SEAVIEW'}
                />
            </div>
        </div>
    );
}