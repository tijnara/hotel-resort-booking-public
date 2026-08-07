'use client';

import { useState } from 'react';
import { Header } from '@/modules/shared/components/Header';
import { Footer } from '@/modules/shared/components/Footer';
import { ShieldCheck, FileText } from 'lucide-react';
import type { SiteSettings } from '@/modules/settings/services/getSettings';

export function PoliciesClient({ settings }: { settings: SiteSettings }) {
    const policies = settings.legal_policies || [];
    const [activePolicyId, setActivePolicyId] = useState<string>(policies[0]?.id || '');

    const currentPolicy = policies.find((p) => p.id === activePolicyId) || policies[0];

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c120c] flex flex-col justify-between">
            <Header settings={settings} />

            <main className="py-28 max-w-4xl mx-auto px-5 w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Legal & Policies</span>
                    <h1 className="text-3xl sm:text-5xl font-light text-[#1c120c]">Guest Stay Guidelines</h1>
                    <p className="text-xs sm:text-sm text-[#2b1d14]/70 max-w-lg mx-auto leading-relaxed">
                        Important details regarding resort stay rules, cancellation policies, and guest data privacy.
                    </p>
                </div>

                {/* Dynamic Policy Tab Switcher */}
                {policies.length > 0 && (
                    <div className="flex justify-center border-b border-[#e6c898]/40 pb-4 gap-2 flex-wrap">
                        {policies.map((policy) => (
                            <button
                                key={policy.id}
                                onClick={() => setActivePolicyId(policy.id)}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                                    (currentPolicy?.id === policy.id)
                                        ? 'bg-[#1c120c] text-[#faf7f2]'
                                        : 'bg-white text-[#2b1d14]/70 border border-[#e6c898]/40 hover:bg-[#faf7f2]'
                                }`}
                            >
                                <FileText className="w-3.5 h-3.5 text-[#c89349]" />
                                <span>{policy.title}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Active Policy Content Card */}
                {currentPolicy ? (
                    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#e6c898]/30 pb-3">
                            <ShieldCheck className="w-5 h-5 text-[#c89349]" />
                            <h2 className="text-lg font-bold text-[#1c120c]">{currentPolicy.title}</h2>
                        </div>
                        <div className="text-xs sm:text-sm text-[#1c120c] leading-relaxed whitespace-pre-line font-medium">
                            {currentPolicy.content}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-[#e6c898]/40 text-center text-xs text-gray-500">
                        No policies currently published.
                    </div>
                )}
            </main>

            <Footer settings={settings} />
        </div>
    );
}