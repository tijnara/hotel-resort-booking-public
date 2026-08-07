'use client';

import { useState } from 'react';
import { X, Loader2, Save, Clock, LayoutGrid, Home, Sliders, UserPlus, ShieldCheck } from 'lucide-react';
import type { StaffUser } from '../settings/AdminDashboard';

interface EditUserModalProps {
    user: StaffUser | null;
    onClose: () => void;
    onSave: (payload: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        permissions?: string[];
        password?: string;
    }) => Promise<{ success: boolean; message?: string }>;
}

const ALL_MODULE_PERMISSIONS = [
    { key: 'bookings', label: 'Reservations & Payments', desc: 'Confirm/cancel stays & view receipts', icon: Clock },
    { key: 'calendar', label: 'Visual Room Timeline', desc: 'View stay timeline & block dates', icon: LayoutGrid },
    { key: 'villas', label: 'Kubo Villas', desc: 'Edit pricing, photos & toggle maintenance', icon: Home },
    { key: 'settings', label: 'Site Content & Branding', desc: 'Customize home, FAQs & legal policies', icon: Sliders },
    { key: 'users', label: 'Users & Staff', desc: 'Register & manage staff accounts', icon: UserPlus },
];

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
    const [editFullName, setEditFullName] = useState(user?.user_metadata?.full_name || '');
    const [editEmail, setEditEmail] = useState(user?.email || '');
    const [editRole, setEditRole] = useState(user?.user_metadata?.role || 'staff');
    const [editPermissions, setEditPermissions] = useState<string[]>(
        user?.user_metadata?.permissions || ['bookings', 'calendar']
    );
    const [editPassword, setEditPassword] = useState('');
    const [editUserLoading, setEditUserLoading] = useState(false);
    const [editUserMsg, setEditUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    if (!user) return null;

    const togglePermission = (key: string) => {
        setEditPermissions((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditUserLoading(true);
        setEditUserMsg(null);

        const res = await onSave({
            id: user.id,
            fullName: editFullName,
            email: editEmail,
            role: editRole,
            permissions: editRole === 'admin' ? ALL_MODULE_PERMISSIONS.map((m) => m.key) : editPermissions,
            password: editPassword,
        });

        setEditUserLoading(false);

        if (res.success) {
            setEditUserMsg({ type: 'success', text: 'Staff account & permissions updated successfully!' });
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setEditUserMsg({ type: 'error', text: res.message || 'Failed to update user.' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1c120c]/70 backdrop-blur-xs flex justify-center items-center p-4">
            <div className="bg-[#faf7f2] w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-[#e6c898]/40 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Staff Access</span>
                        <h3 className="text-xl font-bold text-[#1c120c]">Edit Staff User & Permissions</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-[#e6c898]/30 text-[#1c120c] cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {editUserMsg && (
                    <div className={`mt-4 p-3 text-xs rounded-xl font-bold ${editUserMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        {editUserMsg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={editFullName}
                                onChange={(e) => setEditFullName(e.target.value)}
                                className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                            />
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Access Role</label>
                            <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="w-full text-xs font-semibold text-[#1c120c] outline-none cursor-pointer"
                            >
                                <option value="staff">Front Desk Staff</option>
                                <option value="manager">Resort Manager</option>
                                <option value="admin">Administrator (Full Control)</option>
                            </select>
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">
                                New Password <span className="text-gray-400 font-normal">(Leave blank to keep)</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                className="w-full text-xs font-semibold text-[#1c120c] outline-none"
                            />
                        </div>
                    </div>

                    {/* 🛡️ Section Access Permissions Grid */}
                    <div className="bg-white p-4 rounded-2xl border border-[#e6c898]/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-[#faf7f2] pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Section Access Permissions
                            </span>
                            {editRole === 'admin' && (
                                <span className="text-[10px] font-bold uppercase bg-[#c89349]/20 text-[#1c120c] px-2 py-0.5 rounded-full">
                                    Admins Have Full Access
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            {ALL_MODULE_PERMISSIONS.map((perm) => {
                                const Icon = perm.icon;
                                const isChecked = editRole === 'admin' || editPermissions.includes(perm.key);

                                return (
                                    <label
                                        key={perm.key}
                                        onClick={() => editRole !== 'admin' && togglePermission(perm.key)}
                                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition select-none ${
                                            isChecked
                                                ? 'bg-[#faf7f2] border-[#c89349]/60 text-[#1c120c]'
                                                : 'bg-white border-gray-200 text-gray-400 opacity-60'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            disabled={editRole === 'admin'}
                                            onChange={() => {}}
                                            className="mt-0.5 accent-[#c89349] cursor-pointer"
                                        />
                                        <div className="flex-1 space-y-0.5">
                                            <div className="flex items-center gap-1.5 font-bold">
                                                <Icon className="w-3.5 h-3.5 text-[#c89349]" />
                                                <span>{perm.label}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-500 font-normal leading-tight">
                                                {perm.desc}
                                            </p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 h-11 bg-white text-[#1c120c] border border-[#e6c898]/40 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editUserLoading}
                            className="w-1/2 h-11 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition disabled:opacity-50 cursor-pointer"
                        >
                            {editUserLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#c89349]" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4 text-[#c89349]" />
                                    <span>Save User</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}