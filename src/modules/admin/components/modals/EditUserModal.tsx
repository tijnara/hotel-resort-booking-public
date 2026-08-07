'use client';

import { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import type { StaffUser } from '../settings/AdminDashboard';

interface EditUserModalProps {
    user: StaffUser | null;
    onClose: () => void;
    onSave: (payload: { id: string; fullName: string; email: string; role: string; password?: string }) => Promise<{ success: boolean; message?: string }>;
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
    const [editFullName, setEditFullName] = useState(user?.user_metadata?.full_name || '');
    const [editEmail, setEditEmail] = useState(user?.email || '');
    const [editRole, setEditRole] = useState(user?.user_metadata?.role || 'staff');
    const [editPassword, setEditPassword] = useState('');
    const [editUserLoading, setEditUserLoading] = useState(false);
    const [editUserMsg, setEditUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditUserLoading(true);
        setEditUserMsg(null);

        const res = await onSave({
            id: user.id,
            fullName: editFullName,
            email: editEmail,
            role: editRole,
            password: editPassword,
        });

        setEditUserLoading(false);

        if (res.success) {
            setEditUserMsg({ type: 'success', text: 'Staff account updated successfully!' });
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setEditUserMsg({ type: 'error', text: res.message || 'Failed to update user.' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1c120c]/70 backdrop-blur-xs flex justify-center items-center p-4">
            <div className="bg-[#faf7f2] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#e6c898]/40 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center border-b border-[#e6c898]/40 pb-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Staff Access</span>
                        <h3 className="text-xl font-bold text-[#1c120c]">Edit Staff User</h3>
                    </div>
                    <button onClick={onClose} className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-[#e6c898]/30 text-[#1c120c] cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {editUserMsg && (
                    <div className={`mt-4 p-3 text-xs rounded-xl font-bold ${editUserMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        {editUserMsg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                    <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Full Name</label>
                        <input type="text" required value={editFullName} onChange={(e) => setEditFullName(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] outline-none" />
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Email</label>
                        <input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] outline-none" />
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Access Role</label>
                        <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] outline-none cursor-pointer">
                            <option value="staff">Front Desk Staff</option>
                            <option value="manager">Resort Manager</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#e6c898]/40">
                        <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">New Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                        <input type="password" placeholder="••••••••" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] outline-none" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="w-1/2 h-11 bg-white text-[#1c120c] border border-[#e6c898]/40 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                        <button type="submit" disabled={editUserLoading} className="w-1/2 h-11 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition disabled:opacity-50 cursor-pointer">
                            {editUserLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (<><Save className="w-4 h-4 text-[#c89349]" /><span>Save User</span></>)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}