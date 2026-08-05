'use client';

import type { SiteSettings, ContactInfoItem } from '@/modules/settings/services/getSettings';
import { Plus, Trash2, Phone, Mail, MapPin, Clock, HelpCircle } from 'lucide-react';
import { HeroBackgroundControl } from './HeroBackgroundControl';

interface ContactSettingsTabProps {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

const AVAILABLE_ICONS = [
    { value: 'Phone', label: 'Phone Call', icon: Phone },
    { value: 'Mail', label: 'Email Envelope', icon: Mail },
    { value: 'MapPin', label: 'Location Map Pin', icon: MapPin },
    { value: 'Clock', label: 'Clock / Hours', icon: Clock },
];

const DEFAULT_CONTACT_BANNER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80';

export function ContactSettingsTab({ formData, setFormData }: ContactSettingsTabProps) {
    const handleAddContactCard = () => {
        const newCard: ContactInfoItem = {
            id: `card_${Date.now()}`,
            title: 'New Contact Detail',
            value: '+63 900 000 0000',
            subtitle: 'Available daily for guest inquiries',
            icon: 'Phone',
        };

        setFormData({
            ...formData,
            contact_cards: [...(formData.contact_cards || []), newCard],
        });
    };

    const handleDeleteContactCard = (id: string) => {
        setFormData({
            ...formData,
            contact_cards: (formData.contact_cards || []).filter((c) => c.id !== id),
        });
    };

    const handleUpdateContactCard = (id: string, field: keyof ContactInfoItem, value: string) => {
        setFormData({
            ...formData,
            contact_cards: (formData.contact_cards || []).map((c) =>
                c.id === id ? { ...c, [field]: value } : c
            ),
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Contact Page Headers</span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Main Heading & Page Subtitle</h3>
                </div>

                {/* 🎨 Hero Background Option (Image vs Color) */}
                <HeroBackgroundControl
                    title="Contact Us Hero Background"
                    bgType={formData.contact_hero_bg_type || 'image'}
                    imageUrl={formData.contact_banner_image || ''}
                    bgColor={formData.contact_hero_bg_color || '#1c120c'}
                    defaultImageUrl={DEFAULT_CONTACT_BANNER}
                    onTypeChange={(type) => setFormData({ ...formData, contact_hero_bg_type: type })}
                    onImageChange={(url) => setFormData({ ...formData, contact_banner_image: url })}
                    onColorChange={(color) => setFormData({ ...formData, contact_hero_bg_color: color })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                            Main Heading Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.contact_title || ''}
                            onChange={(e) => setFormData({ ...formData, contact_title: e.target.value })}
                            className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                            Inquiry Email Destination
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.inquiry_email || ''}
                            onChange={(e) => setFormData({ ...formData, inquiry_email: e.target.value })}
                            className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                        Page Subtitle Paragraph
                    </label>
                    <textarea
                        rows={2}
                        value={formData.contact_subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, contact_subtitle: e.target.value })}
                        className="w-full text-xs font-medium text-[#1c120c] bg-transparent outline-none resize-none leading-relaxed"
                    />
                </div>

                <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                    <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                        Landline Number
                    </label>
                    <input
                        type="text"
                        value={formData.contact_landline || ''}
                        onChange={(e) => setFormData({ ...formData, contact_landline: e.target.value })}
                        className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                    />
                </div>
            </div>

            {/* Dynamic Contact Detail Cards (Add / Edit / Delete) */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-3">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Directory Cards</span>
                        <h3 className="text-lg font-bold text-[#1c120c]">Contact Information Cards</h3>
                        <p className="text-xs text-[#2b1d14]/60">
                            Add, edit, or remove contact cards displayed on the public Contact Us page.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddContactCard}
                        className="px-4 py-2.5 bg-[#c89349] text-[#1c120c] font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#b07d37] transition active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Contact Card</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {(formData.contact_cards || []).map((card) => (
                        <div key={card.id} className="p-4 bg-[#faf7f2] rounded-2xl border border-[#e6c898]/40 space-y-3 relative">
                            <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-2">
                                <span className="text-xs font-bold text-[#c89349] uppercase flex items-center gap-1.5">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span>Contact Item</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteContactCard(card.id)}
                                    className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Card Title</label>
                                    <input
                                        type="text"
                                        value={card.title}
                                        onChange={(e) => handleUpdateContactCard(card.id, 'title', e.target.value)}
                                        placeholder="e.g., Front Desk & Reservations"
                                        className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border border-[#e6c898]/50 outline-none focus:border-[#c89349]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Contact Value / Number</label>
                                    <input
                                        type="text"
                                        value={card.value}
                                        onChange={(e) => handleUpdateContactCard(card.id, 'value', e.target.value)}
                                        placeholder="e.g., +63 912 345 6789"
                                        className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border border-[#e6c898]/50 outline-none focus:border-[#c89349]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Subtitle / Operating Hours</label>
                                    <input
                                        type="text"
                                        value={card.subtitle || ''}
                                        onChange={(e) => handleUpdateContactCard(card.id, 'subtitle', e.target.value)}
                                        placeholder="e.g., Available 24/7 for guest assistance"
                                        className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border border-[#e6c898]/50 outline-none focus:border-[#c89349]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Display Icon</label>
                                    <select
                                        value={card.icon || 'Phone'}
                                        onChange={(e) => handleUpdateContactCard(card.id, 'icon', e.target.value)}
                                        className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border border-[#e6c898]/50 outline-none cursor-pointer"
                                    >
                                        {AVAILABLE_ICONS.map((i) => (
                                            <option key={i.value} value={i.value}>
                                                {i.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}