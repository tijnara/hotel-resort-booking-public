'use client';

import { useState } from 'react';
import { Loader2, ShieldAlert, Edit3, Trash2, Clock, LayoutGrid, Home, Sliders, UserPlus, ShieldCheck } from 'lucide-react';
import type { StaffUser } from '../settings/AdminDashboard';

interface UsersTabProps {
    initialStaff: StaffUser[];
    isAdmin: boolean;
    deletingUserId: string | null;
    onCreateUser: (payload: { fullName: string; email: string; password: string; role: string; permissions: string[] }) => Promise<{ success: boolean; message?: string }>;
    onOpenEditUser: (user: StaffUser) => void;
    onDeleteUser: (id: string, email?: string) => void;
}

const ALL_MODULE_PERMISSIONS = [
    { key: 'bookings', label: 'Reservations & Payments', desc: 'Confirm/cancel stays & view receipts', icon: Clock },
    { key: 'calendar', label: 'Visual Room Timeline', desc: 'View stay timeline & block dates', icon: LayoutGrid },
    { key: 'villas', label: 'Kubo Villas', desc: 'Edit pricing, photos & toggle maintenance', icon: Home },
    { key: 'settings', label: 'Site Content & Branding', desc: 'Customize home, FAQs & legal policies', icon: Sliders },
    { key: 'users', label: 'Users & Staff', desc: 'Register & manage staff accounts', icon: UserPlus },
];

export function UsersTab({
                             initialStaff,
                             isAdmin,
                             deletingUserId,
                             onCreateUser,
                             onOpenEditUser,
                             onDeleteUser,
                         }: UsersTabProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('staff');
    const [permissions, setPermissions] = useState<string[]>(['bookings', 'calendar']);
    const [userLoading, setUserLoading] = useState(false);
    const [userMsg, setUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const togglePermission = (key: string) => {
        setPermissions((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;
        setUserLoading(true);
        setUserMsg(null);

        const res = await onCreateUser({
            fullName,
            email,
            password,
            role,
            permissions: role === 'admin' ? ALL_MODULE_PERMISSIONS.map((m) => m.key) : permissions,
        });
        setUserLoading(false);

        if (res.success) {
            setUserMsg({ type: 'success', text: 'New staff user added successfully!' });
            setFullName('');
            setEmail('');
            setPassword('');
            setPermissions(['bookings', 'calendar']);
        } else {
            setUserMsg({ type: 'error', text: res.message || 'Failed to create user.' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {isAdmin ? (
                <div className="bg-white p-6 rounded-3xl border border-[#e6c898]/40 shadow-xs space-y-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349]">Staff Access</span>
                        <h3 className="text-lg font-bold text-[#1c120c]">Add New Resort User</h3>
                    </div>

                    {userMsg && (
                        <div className={`p-3 text-xs rounded-xl ${userMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                            {userMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="space-y-3">
                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Full Name</label>
                            <input type="text" required placeholder="Maria Santos" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none" />
                        </div>

                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Email</label>
                            <input type="email" required placeholder="staff@seaview.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none" />
                        </div>

                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Password</label>
                            <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none" />
                        </div>

                        <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest mb-1">Access Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none cursor-pointer">
                                <option value="staff">Front Desk Staff</option>
                                <option value="manager">Resort Manager</option>
                                <option value="admin">Administrator (Full Control)</option>
                            </select>
                        </div>

                        {/* Module Permissions Checkboxes */}
                        <div className="bg-[#faf7f2] p-3.5 rounded-2xl border border-[#e6c898]/40 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c89349] flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Module Access Permissions
                            </span>

                            <div className="space-y-1.5 pt-1">
                                {ALL_MODULE_PERMISSIONS.map((perm) => {
                                    const isChecked = role === 'admin' || permissions.includes(perm.key);
                                    return (
                                        <label
                                            key={perm.key}
                                            onClick={() => role !== 'admin' && togglePermission(perm.key)}
                                            className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold cursor-pointer select-none"
                                        >
                                            <span className="text-[#1c120c]">{perm.label}</span>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                disabled={role === 'admin'}
                                                onChange={() => {}}
                                                className="accent-[#c89349] cursor-pointer"
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <button type="submit" disabled={userLoading} className="w-full h-12 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] transition cursor-pointer">
                            {userLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register User'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-3xl border border-[#e6c898]/40 text-center space-y-2">
                    <ShieldAlert className="w-8 h-8 mx-auto text-[#c89349]" />
                    <h4 className="font-bold text-sm text-[#1c120c]">Administrator Restricted</h4>
                </div>
            )}

            <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-3xl border border-[#e6c898]/40 shadow-xs overflow-hidden`}>
                <div className="p-5 border-b border-[#e6c898]/30 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-[#1c120c]">Registered Staff & Users</h3>
                    <span className="text-xs text-[#2b1d14]/60">{initialStaff.length} Accounts</span>
                </div>

                <div className="divide-[#faf7f2] divide-y">
                    {initialStaff.map((u) => {
                        const userPerms: string[] = u.user_metadata?.permissions || ['bookings', 'calendar'];
                        const roleName = u.user_metadata?.role || 'Staff';

                        return (
                            <div key={u.id} className="p-5 flex items-center justify-between flex-wrap gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-sm text-[#1c120c]">{u.user_metadata?.full_name || u.email || 'Staff Member'}</h4>
                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#c89349]/20 text-[#1c120c]">
                                            {roleName}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#2b1d14]/60">{u.email || 'No email provided'}</p>

                                    {/* Permission Pills Preview */}
                                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Access:</span>
                                        {roleName.toLowerCase() === 'admin' ? (
                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                                                All Modules Granted
                                            </span>
                                        ) : (
                                            userPerms.map((pKey) => {
                                                const match = ALL_MODULE_PERMISSIONS.find((m) => m.key === pKey);
                                                return (
                                                    <span key={pKey} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                                                        {match?.label || pKey}
                                                    </span>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {isAdmin && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onOpenEditUser(u)} className="min-h-[36px] px-3.5 bg-[#1c120c] text-[#faf7f2] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1 hover:bg-[#2b1d14] cursor-pointer">
                                            <Edit3 className="w-3.5 h-3.5 text-[#c89349]" />
                                            <span>Edit Permissions</span>
                                        </button>
                                        <button onClick={() => onDeleteUser(u.id, u.email)} disabled={deletingUserId === u.id} className="min-h-[36px] px-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 cursor-pointer border border-rose-200">
                                            {deletingUserId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}