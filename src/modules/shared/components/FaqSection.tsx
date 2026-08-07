'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FaqItem } from '@/modules/settings/services/getSettings';

interface FaqSectionProps {
    faqs?: FaqItem[];
    title?: string;
    subtitle?: string;
}

export function FaqSection({
                               faqs = [],
                               title = 'Frequently Asked Questions',
                               subtitle = 'Everything you need to know about your stay at Seaview Resort.',
                           }: FaqSectionProps) {
    const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

    if (!faqs || faqs.length === 0) return null;

    const toggleFaq = (id: string) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="py-16 max-w-4xl mx-auto px-5 w-full">
            <div className="text-center space-y-2 mb-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] inline-flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Guest Help Desk</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-light text-[#1c120c] tracking-tight">{title}</h2>
                <p className="text-xs sm:text-sm text-[#2b1d14]/70 max-w-md mx-auto leading-relaxed">{subtitle}</p>
            </div>

            <div className="space-y-3">
                {faqs.map((faq) => {
                    const isOpen = openId === faq.id;

                    return (
                        <div
                            key={faq.id}
                            className="bg-white rounded-2xl border border-[#e6c898]/40 shadow-xs overflow-hidden transition-all duration-300"
                        >
                            <button
                                type="button"
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-[#faf7f2]/50 transition"
                            >
                                <span className="text-xs sm:text-sm font-bold text-[#1c120c] leading-snug">
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full bg-[#faf7f2] border border-[#e6c898]/40 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#1c120c] text-[#faf7f2]' : 'text-[#c89349]'}`}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </button>

                            {isOpen && (
                                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#2b1d14]/80 leading-relaxed font-medium border-t border-[#e6c898]/20 mt-1 pt-3 animate-in fade-in duration-200">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}