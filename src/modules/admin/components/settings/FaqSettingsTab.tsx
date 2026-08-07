'use client';

import type { SiteSettings, FaqItem } from '@/modules/settings/services/getSettings';
import { Plus, Trash2, HelpCircle, MessageSquare } from 'lucide-react';

interface FaqSettingsTabProps {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export function FaqSettingsTab({ formData, setFormData }: FaqSettingsTabProps) {
    const handleAddFaq = () => {
        const newFaq: FaqItem = {
            id: `faq_${Date.now()}`,
            question: 'New Frequently Asked Question',
            answer: 'Provide a clear and concise answer for your guests here...',
        };

        setFormData({
            ...formData,
            faqs: [...(formData.faqs || []), newFaq],
        });
    };

    const handleDeleteFaq = (id: string) => {
        setFormData({
            ...formData,
            faqs: (formData.faqs || []).filter((f) => f.id !== id),
        });
    };

    const handleUpdateFaq = (id: string, field: keyof FaqItem, value: string) => {
        setFormData({
            ...formData,
            faqs: (formData.faqs || []).map((f) =>
                f.id === id ? { ...f, [field]: value } : f
            ),
        });
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Guest Information Desk
                    </span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Frequently Asked Questions (FAQ) Editor</h3>
                    <p className="text-xs text-[#2b1d14]/60">
                        Manage questions regarding corkage, pet policies, pool hours, and check-in details.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-4 py-2.5 bg-[#c89349] text-[#1c120c] font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#b07d37] transition active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ Question</span>
                </button>
            </div>

            <div className="space-y-4">
                {(formData.faqs || []).map((faq, index) => (
                    <div key={faq.id} className="p-4 bg-[#faf7f2] rounded-2xl border border-[#e6c898]/40 space-y-3 relative">
                        <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-2">
                            <span className="text-xs font-bold text-[#c89349] uppercase flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Question #{index + 1}</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Item</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Question Title</label>
                            <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => handleUpdateFaq(faq.id, 'question', e.target.value)}
                                placeholder="e.g. Is there a corkage fee for outside food?"
                                className="w-full text-xs font-bold text-[#1c120c] bg-white p-2.5 rounded-xl border border-[#e6c898]/50 outline-none focus:border-[#c89349]"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Answer / Explanation</label>
                            <textarea
                                rows={3}
                                value={faq.answer}
                                onChange={(e) => handleUpdateFaq(faq.id, 'answer', e.target.value)}
                                placeholder="Write a clear answer for your guests..."
                                className="w-full text-xs font-medium text-[#1c120c] bg-white p-3 rounded-xl border border-[#e6c898]/50 outline-none focus:border-[#c89349] leading-relaxed resize-y"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}