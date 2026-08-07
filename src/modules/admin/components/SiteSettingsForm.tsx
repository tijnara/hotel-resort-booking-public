'use client';

import { useState } from 'react';
import { Save, Loader2, Palette, Home, Info, Camera, Phone, MapPin, ChevronRight, CreditCard, Mail, ShieldCheck, HelpCircle } from 'lucide-react';
import { updateSiteSettingsAction } from '../actions/settingsActions';
import type { SiteSettings, PaymentMethodItem, EmailTemplatesSettings } from '@/modules/settings/services/getSettings';

import { BrandingSettingsTab } from './settings/BrandingSettingsTab';
import { HomeSettingsTab } from './settings/HomeSettingsTab';
import { AboutSettingsTab } from './settings/AboutSettingsTab';
import { SanctuarySettingsTab } from './settings/SanctuarySettingsTab';
import { ContactSettingsTab } from './settings/ContactSettingsTab';
import { FooterSettingsTab } from './settings/FooterSettingsTab';
import { LegalSettingsTab } from './settings/LegalSettingsTab';
import { FaqSettingsTab } from './settings/FaqSettingsTab';

export interface SingleEmailTemplate {
    subject?: string;
    status_badge?: string;
    header_title?: string;
    header_subtitle?: string;
    heading?: string;
    body_text?: string;
    footer_text?: string;
}

const DEFAULT_EMAIL_TEMPLATE: SingleEmailTemplate = {
    subject: '',
    status_badge: '',
    header_title: '',
    header_subtitle: '',
    heading: '',
    body_text: '',
    footer_text: '',
};

const EMAIL_STAGE_TEMPLATES: Array<{ key: keyof EmailTemplatesSettings; title: string }> = [
    { key: 'request_received', title: '1. Request Received (Pending Review)' },
    { key: 'confirmed', title: '2. Booking Confirmed' },
    { key: 'cancelled', title: '3. Booking Cancelled' },
    { key: 'refunded', title: '4. Refund Processed' },
];

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
    const [subTab, setSubTab] = useState<'branding' | 'home' | 'about' | 'sanctuary' | 'contact' | 'footer' | 'payments' | 'emails' | 'policies' | 'faqs'>('branding');
    const [formData, setFormData] = useState<SiteSettings>(settings);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const res = await updateSiteSettingsAction(formData);
        setLoading(false);

        if (res.success) {
            setMsg({ type: 'success', text: 'Site settings updated successfully across all pages!' });
        } else {
            setMsg({ type: 'error', text: res.message || 'Failed to update settings.' });
        }
    };

    const navTabs = [
        { id: 'branding', label: 'Branding & Nav', icon: Palette },
        { id: 'payments', label: 'Payment Channels', icon: CreditCard },
        { id: 'emails', label: 'Email Templates', icon: Mail },
        { id: 'home', label: 'Home Page', icon: Home },
        { id: 'about', label: 'About Page', icon: Info },
        { id: 'sanctuary', label: 'The Sanctuary', icon: Camera },
        { id: 'contact', label: 'Contact Page', icon: Phone },
        { id: 'footer', label: 'Footer Info', icon: MapPin },
        { id: 'policies', label: 'Legal & Policies', icon: ShieldCheck },
        { id: 'faqs', label: 'FAQ Accordion', icon: HelpCircle },
    ] as const;

    // Payment Method Handlers
    const handleAddPaymentMethod = () => {
        const newMethod: PaymentMethodItem = {
            id: `pay_${Date.now()}`,
            name: 'New Payment Channel',
            account_number: '0000-000-0000',
            account_name: formData.site_name || 'SEAVIEW RESORT',
            type: 'bank',
        };
        setFormData({
            ...formData,
            payment_methods: [...(formData.payment_methods || []), newMethod],
        });
    };

    const handleDeletePaymentMethod = (id: string) => {
        setFormData({
            ...formData,
            payment_methods: (formData.payment_methods || []).filter((m) => m.id !== id),
        });
    };

    const handleUpdatePaymentMethod = (id: string, field: keyof PaymentMethodItem, value: string) => {
        setFormData({
            ...formData,
            payment_methods: (formData.payment_methods || []).map((m) =>
                m.id === id ? { ...m, [field]: value } : m
            ),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto relative">
            {msg && (
                <div className={`p-4 rounded-2xl text-xs font-bold transition-all animate-in fade-in duration-300 ${
                    msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    {msg.text}
                </div>
            )}

            {/* Floating Responsive Tab Bar Container */}
            <div className="sticky top-4 z-30 bg-[#faf7f2]/95 backdrop-blur-xl p-2.5 rounded-2xl border border-[#e6c898]/40 shadow-sm relative space-y-2">
                <div className="flex items-center justify-between md:hidden text-[10px] font-bold uppercase tracking-widest text-[#c89349] px-1 pt-0.5">
                    <span>Site Customization Tabs</span>
                    <span className="flex items-center gap-1 bg-[#c89349]/15 px-2.5 py-1 rounded-full text-[#1c120c]">
                        <span>Swipe tabs</span>
                        <ChevronRight className="w-3.5 h-3.5 animate-pulse text-[#c89349]" />
                    </span>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2 max-md:overflow-x-auto md:flex-wrap max-md:[scrollbar-width:none] max-md:[-ms-overflow-style:none] max-md:[&::-webkit-scrollbar]:hidden px-0.5 py-0.5">
                    {navTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = subTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSubTab(tab.id)}
                                className={`group relative min-h-[40px] px-3.5 md:px-4 rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 shrink-0 md:shrink cursor-pointer border ${
                                    isActive
                                        ? 'bg-[#1c120c] text-[#faf7f2] border-[#1c120c] shadow-md scale-[1.02]'
                                        : 'bg-white/80 text-[#2b1d14]/70 border-[#e6c898]/40 hover:bg-white hover:text-[#1c120c] hover:border-[#c89349]/50'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#c89349]' : 'text-[#c89349]/70 group-hover:text-[#c89349]'}`} />
                                <span>{tab.label}</span>

                                {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c89349] animate-pulse ml-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Sub-Tab Views */}
            <div className="transition-all duration-300">
                {subTab === 'branding' && <BrandingSettingsTab formData={formData} setFormData={setFormData} />}

                {/* Payment Methods Tab */}
                {subTab === 'payments' && (
                    <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                        <div className="flex justify-between items-center flex-wrap gap-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Guest Checkout</span>
                                <h3 className="text-lg font-bold text-[#1c120c]">Manage Payment Channels</h3>
                                <p className="text-xs text-[#2b1d14]/60">Add, edit, or delete GCash, Maya, and Bank account numbers displayed to guests during checkout.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddPaymentMethod}
                                className="px-4 py-2.5 bg-[#c89349] text-[#1c120c] font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#b07d37] transition active:scale-95"
                            >
                                <span>+ Add Payment Channel</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(formData.payment_methods || []).map((method) => (
                                <div key={method.id} className="p-4 bg-[#faf7f2] rounded-2xl border border-[#e6c898]/40 space-y-3 relative">
                                    <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-2">
                                        <span className="text-xs font-bold text-[#c89349] uppercase">Payment Method</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePaymentMethod(method.id)}
                                            className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                            <span>Delete</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Display Name</label>
                                            <input
                                                type="text"
                                                value={method.name}
                                                onChange={(e) => handleUpdatePaymentMethod(method.id, 'name', e.target.value)}
                                                className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Account Number / Mobile</label>
                                            <input
                                                type="text"
                                                value={method.account_number}
                                                onChange={(e) => handleUpdatePaymentMethod(method.id, 'account_number', e.target.value)}
                                                className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Account Name</label>
                                            <input
                                                type="text"
                                                value={method.account_name}
                                                onChange={(e) => handleUpdatePaymentMethod(method.id, 'account_name', e.target.value)}
                                                className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Email Templates Tab */}
                {subTab === 'emails' && (
                    <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Email Notifications</span>
                            <h3 className="text-lg font-bold text-[#1c120c]">Customize Email Message Templates</h3>
                            <p className="text-xs text-[#2b1d14]/60 mt-1">
                                Edit subject lines, header titles, header subtitles/taglines, status badges, headings, body text, and footers for all 4 booking email stages.
                            </p>
                        </div>

                        {EMAIL_STAGE_TEMPLATES.map(({ key, title }) => {
                            const tmpl: SingleEmailTemplate = formData.email_templates?.[key] || DEFAULT_EMAIL_TEMPLATE;

                            const updateField = (field: keyof SingleEmailTemplate, value: string) => {
                                setFormData({
                                    ...formData,
                                    email_templates: {
                                        ...formData.email_templates,
                                        [key]: {
                                            ...tmpl,
                                            [field]: value,
                                        },
                                    } as EmailTemplatesSettings,
                                });
                            };

                            return (
                                <div key={key} className="p-5 bg-[#faf7f2] rounded-2xl border border-[#e6c898]/40 space-y-3">
                                    <h4 className="font-bold text-sm text-[#1c120c] border-b border-[#e6c898]/40 pb-2">{title}</h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Subject Line</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Booking Confirmation - Seaview Resort"
                                                value={tmpl.subject || ''}
                                                onChange={(e) => updateField('subject', e.target.value)}
                                                className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Status Badge Text</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. CONFIRMED"
                                                value={tmpl.status_badge || ''}
                                                onChange={(e) => updateField('status_badge', e.target.value)}
                                                className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Top Email Banner Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. SEAVIEW KUBO RESORT"
                                                value={tmpl.header_title || ''}
                                                onChange={(e) => updateField('header_title', e.target.value)}
                                                className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Header Subtitle / Tagline</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Modern Filipino Kubo Sanctuary"
                                                value={tmpl.header_subtitle || ''}
                                                onChange={(e) => updateField('header_subtitle', e.target.value)}
                                                className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Main Heading</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Reservation Confirmed!"
                                            value={tmpl.heading || ''}
                                            onChange={(e) => updateField('heading', e.target.value)}
                                            className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Body Text Paragraph</label>
                                        <textarea
                                            rows={3}
                                            value={tmpl.body_text || ''}
                                            onChange={(e) => updateField('body_text', e.target.value)}
                                            className="w-full text-xs font-medium bg-white p-2.5 rounded-xl border outline-none resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Footer Text</label>
                                        <input
                                            type="text"
                                            value={tmpl.footer_text || ''}
                                            onChange={(e) => updateField('footer_text', e.target.value)}
                                            className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border outline-none"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {subTab === 'home' && <HomeSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'about' && <AboutSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'sanctuary' && <SanctuarySettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'contact' && <ContactSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'footer' && <FooterSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'policies' && <LegalSettingsTab formData={formData} setFormData={setFormData} />}
                {subTab === 'faqs' && <FaqSettingsTab formData={formData} setFormData={setFormData} />}
            </div>

            {/* Global Save Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] active:scale-[0.99] transition shadow-lg disabled:opacity-50 cursor-pointer border border-[#c89349]/30"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <Save className="w-5 h-5 text-[#c89349]" />
                        <span>Save All Landing Page & Email Changes</span>
                    </>
                )}
            </button>
        </form>
    );
}