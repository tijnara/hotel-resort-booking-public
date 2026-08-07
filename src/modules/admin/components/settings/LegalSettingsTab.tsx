'use client';

import type { SiteSettings, LegalPolicyItem } from '@/modules/settings/services/getSettings';
import { Plus, Trash2, ShieldCheck, FileText } from 'lucide-react';

interface LegalSettingsTabProps {
    formData: SiteSettings;
    setFormData: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export function LegalSettingsTab({ formData, setFormData }: LegalSettingsTabProps) {
    const handleAddPolicy = () => {
        const newPolicy: LegalPolicyItem = {
            id: `policy_${Date.now()}`,
            title: 'New Resort Policy',
            content: 'Enter the guidelines or terms for this policy section here...',
        };

        setFormData({
            ...formData,
            legal_policies: [...(formData.legal_policies || []), newPolicy],
        });
    };

    const handleDeletePolicy = (id: string) => {
        setFormData({
            ...formData,
            legal_policies: (formData.legal_policies || []).filter((p) => p.id !== id),
        });
    };

    const handleUpdatePolicy = (id: string, field: keyof LegalPolicyItem, value: string) => {
        setFormData({
            ...formData,
            legal_policies: (formData.legal_policies || []).map((p) =>
                p.id === id ? { ...p, [field]: value } : p
            ),
        });
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Guest Legal Coverage & Policy Documents
                    </span>
                    <h3 className="text-lg font-bold text-[#1c120c]">Policies & Terms Manager</h3>
                    <p className="text-xs text-[#2b1d14]/60">
                        Add, edit, or delete policy sections displayed on the public /policies page.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddPolicy}
                    className="px-4 py-2.5 bg-[#c89349] text-[#1c120c] font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#b07d37] transition active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Policy Section</span>
                </button>
            </div>

            <div className="space-y-4">
                {(formData.legal_policies || []).map((policy) => (
                    <div key={policy.id} className="p-4 bg-[#faf7f2] rounded-2xl border border-[#e6c898]/40 space-y-3 relative">
                        <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-2">
                            <span className="text-xs font-bold text-[#c89349] uppercase flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Policy Document Section</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => handleDeletePolicy(policy.id)}
                                className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Section</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Policy Title / Document Name</label>
                            <input
                                type="text"
                                value={policy.title}
                                onChange={(e) => handleUpdatePolicy(policy.id, 'title', e.target.value)}
                                placeholder="e.g., Cancellation & Refund Policy"
                                className="w-full text-xs font-semibold bg-white p-2.5 rounded-xl border border-[#e6c898]/50 outline-none focus:border-[#c89349]"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Policy Rules & Content</label>
                            <textarea
                                rows={6}
                                value={policy.content}
                                onChange={(e) => handleUpdatePolicy(policy.id, 'content', e.target.value)}
                                placeholder="Enter detailed guidelines, rules, and conditions..."
                                className="w-full text-xs font-medium bg-white p-3 rounded-xl border border-[#e6c898]/50 outline-none focus:border-[#c89349] leading-relaxed resize-y"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}